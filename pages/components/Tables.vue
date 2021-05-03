<template>
  <div>
    <h2>Tables</h2>
    <button@click="stopSocket"
      :disabled="!Boolean(subscription)">STOP SOCKET</button@click=>
    <button @click="startSocket"
      :disabled="Boolean(subscription) || !Boolean(stompClient)">START SOCKET</button>
    <button @click="disconnectSocket"
      :disabled="!Boolean(stompClient)">DISCONNECT SOCKET</button>
    <button @click="connectSocket"
      :disabled="Boolean(stompClient)">CONNECT SOCKET</button>
    <CDataTable
      :items="table_items"
      :fields="table_fields"
      hover
      pagination
      sorter
      striped
      table-filter
      @row-clicked="handleRowClick"
    >
      <template #show_details="{item, index}">
        <td class="py-2">
          <CButton
            color="primary"
            variant="outline"
            square
            size="sm"
            @click="fetchDetails(item, index)"
          >
            {{Boolean(item._toggled) ? '-' : '+'}}
          </CButton>
        </td>
      </template>
      <template #details="{item}">
        <CCollapse
          :show="Boolean(item._toggled)"
          :duration="collapseDuration">
          <CDataTable
            :items="table_details[item.namespace].table_items"
            :fields="table_details[item.namespace].table_fields"
            hover
            pagination
            sorter
            striped
          >
          <template #cpuUsage="{item}">
            <td>
              <div class="clearfix" style="min-width: 160px;">
                <div class="float-left">
                  <strong>{{ item.cpuUsage.rate }} %</strong>
                </div>
                <div class="float-right">
                  <small class="text-muted">{{ item.cpuUsage.usage }}</small>
                </div>
              </div>
              <CProgress
                v-model="item.cpuUsage.rate"
                :color="color(item.cpuUsage.rate)"
                class="progress-xs"
              />
            </td>
          </template>
          <template #memoryUsage="{item}">
            <td>
              <div class="clearfix" style="min-width: 160px;">
                <div class="float-left">
                  <strong>{{ item.memoryUsage.rate }} %</strong>
                </div>
                <div class="float-right">
                  <small class="text-muted">{{ item.memoryUsage.usage }}</small>
                </div>
              </div>
              <CProgress
                v-model="item.memoryUsage.rate"
                :color="color(item.memoryUsage.rate)"
                class="progress-xs"
              />
            </td>
          </template>          
          </CDataTable>
        </CCollapse>
      </template>
      <template #Provider="{item}">
        <td class="text-center">
          <img :alt="item.Provider" :src="providerIcon(item.Provider)" width="22">
        </td>
      </template>
      <template #status="{item}">
        <td class="text-center">
          <CBadge :color="getBadgeColor(item.status)">
            {{ item.status }}
          </CBadge>
        </td>
      </template>
      <template #Health="{item}">
        <td class="text-center">
          <font-awesome-icon v-if="item.health === 'green'" icon="check-circle" class="c-icon mt-1 text-success"/>
          <font-awesome-icon v-else-if="item.health === 'yellow'" icon="exclamation-circle"
                             class="c-icon mt-1 text-warning"/>
          <font-awesome-icon v-else-if="item.health === 'red'" icon="exclamation-circle"
                             class="c-icon mt-1 text-danger"/>
          <font-awesome-icon v-else icon="question-circle" class="c-icon mt-1 text-secondary"/>
        </td>
      </template>
    </CDataTable><br/><br/>
    <h2>Cards</h2>
    <CRow class="card-dash-group">
      <CCol lg="12" xl="10" class="card-dash-icon-group">
        <CRow>
          <CCol v-for="(v, k) in dbservers" :key="k"
            sm="6" lg="6" xl="3">
            <CWidgetIcon
              :header="v.title"
              :icon-padding="true"
              :text="v.text"
              :color="v.color"
            >
              <CIcon name="cil-pencil" width="24"/>
            </CWidgetIcon>
          </CCol>
        </CRow>
      </CCol>
    </CRow>
  </div>
</template>
<script>
  import SockJS from 'sockjs-client'
  import Stomp from 'webstomp-client'
  import {dialog} from "~/mixins";

  export default {
    mixins: [dialog],
    data() {
      return {
        //For Tables
        table_fields: [],
        table_items: [],
        table_details: [],
        dbservers: [],
        activeTab: 0,
        collapseDuration: 100,
        //For STOMP socket
        stompClient: null,
        subscription: null,
        //System States as cpuUsage, memoryUsage
        systemStates: [],
      };
    },
    created() {
      //console.log('this.table_details: ', this.table_details)
      this.fetchTables()
      this.connectSocket()
    },
    beforeDestroy() {
      this.disconnectSocket()
    },
    methods: {
      connectSocket () {
        const socket = new SockJS('http://localhost:8090/websocket')
        this.stompClient = Stomp.over(socket)
        this.stompClient.connect({}, (frame) => {
          console.log('Connected.frame: ' + frame)
          this.subscribe()
        })
      },
      subscribe () {
        this.subscription = this.stompClient.subscribe('/topic/states', (res) => {
          let systemStates = JSON.parse(res.body || '[]')
          console.log('###### subscribe: ', systemStates)
          this.handleTablesSystemUsage(systemStates)
        })
      },
      startSocket () {
        this.stompClient.send("/states", {}, "socket-stop")
        this.subscribe()
      }, 
      stopSocket () {
        this.stompClient.send("/states", {}, "socket-stop")
        this.subscription.unsubscribe()
        this.subscription = null
      },
      disconnectSocket () {
        if (this.subscription) {
          this.subscription.unsubscribe()
          this.subscription = null
        }
        if (this.stompClient) {
          this.stompClient.disconnect()
          this.stompClient = null
        }
        console.log('disconnect.subscription:', this.subscription)
        console.log('disconnect.stompClient:', this.stompClient)
      },    
      handleTablesSystemUsage (mysystemStates) {
        //console.log('table_details: ', this.table_details)
        Object.keys(this.table_details).forEach(namespace => {
          let table_items = this.table_details[namespace].table_items
          if (!table_items) return false

          table_items.forEach((tableItem, tableItemIdx) => {
            if (!mysystemStates.length) return false
           
            mysystemStates.forEach(systemState => {
              if (systemState.name == tableItem.name) {
                tableItem.cpuUsage.rate = systemState.cpuRate
                tableItem.memoryUsage.rate = systemState.memoryRate
              }
            })
            //
          })
        })
      },
      fetchTables () {
        const url = 'http://localhost:3003/items'
        this.$axios.$get(url, {}).then(res => {
          res = this.parseTableItems(res)
          this.table_fields = res.table_fields
          this.table_items = res.table_items.map((item, id) => {
            //Assign table_details
            this.table_details[item.namespace] = {}
            return {...item, id}
          })
          //this.dbservers = res.dbservers
        })
      },
      fetchDetails (item) {
        let namespace = item.namespace
        if (this.table_details && this.table_details[namespace].table_items) {
          this.$set(this.table_items[item.id], '_toggled', !item._toggled)
          return false
        }
        const url = `http://localhost:3005/${namespace}`
        this.$axios.$get(url, {}).then(res => {
          if (!res) return this.toastError()
          res = this.parseTableDetails(res)
          let table_fields = res.table_fields
          let table_items = res.table_items.map((item, id) => { return {...item, id}})
          this.table_details[namespace] =  { table_fields, table_items }
          this.$set(this.table_items[item.id], '_toggled', !item._toggled)
        })
      },
      parseTableItems (items) {
        let table_fields = [
          {key: "show_details", label: "", style: "width:1%", sorter: false, filter: false},
          {key: "namespace", label: "NAMESPACE", _style: 'min-width:100px'},
          {key: "name", label: "NAME", _style:'min-width:140px'},
          {key: "datastore", label: "DATASTORE"},
          {key: "version", label: "VERSION"},
          {key: "architecture", label: "ARCHITECTURE"},
          {key: "deployStatus", label: "DEPLOY\nSTATUS"},
          {key: "status", label: "STATUS"},
          {key: "ready", label: "READY"},
          {key: "requestCpu", label: "CPU\n(REQUEST)"},
          {key: "requestMemory", label: "MEMORY\n(REQUEST)"},
          {key: "storage", label: "STORAGE\n(DATA)"},
          {key: "message", label: "MESSAGE"},
          {key: "age", label: "AGE"}
        ]
        let getAge = creationTime => {
          let elapsedTime = new Date().getTime() - new Date(creationTime).getTime()
            , times = elapsedTime / (1000 * 60 * 60 * 24)
            , days = Math.floor(times)
            //, hours = (times - days) / (1000 *60 * 60)
          //return `${ days }d-${String(hours).split('.')[0] || 0 }h`
          return `${ days }d`
        }
        let table_items = []
        items.map(item => {
          table_items = [ ...table_items,
            {
              namespace: item.metadata.namespace || '',
              name: item.metadata.name || '',
              datastore: item.spec.datastore || '',
              version: item.spec.version || '',
              architecture: item.status.architecture || '',
              deployStatus: item.status.deployStatus || '',
              status: item.status.status || '',
              ready: item.status.ready || '',
              requestCpu: item.status.resources.requestCpu || '',
              requestMemory: item.status.resources.requestMemory || '',
              storage: item.status.storage.data || '',
              message: '',
              age: getAge(item.metadata.creationTimestamp)
            }
          ]
        })
        return { table_fields, table_items }
      },
      parseTableDetails (items) {
        let table_fields = [
          // {key: "namespace", label: "NAMESPACE"},
          {key: "name", label: "NAME", _style:'min-width:140px'},
          {key: "memberRole", label: "MEMBER\nROLE"},
          {key: "status", label: "STATUS"},
          {key: "ready", label: "READY"},
          {key: "nodeName", label: "HOST IP"},
          {key: "podIP", label: "POD IP"},
          {key: "workrPool", label: "WORKER POOL"},
          {key: "requestCpu", label: "CPU\n(REQUEST)"},
          {key: "requestMemory", label: "MEMORY\n(REQUEST)"},
          {key: "cpuUsage", label: "CPU\n(CORES)"},
          {key: "memoryUsage", label: "MEMORY\n(BYTES)"},
          {key: "storage", label: "STORAGE\n(DATA)"}
        ]
        let getByteSize = (size) => {
          return (  
            ! /\D?(g|m)/gi.test(size)
            ? size.replace(/\D/g, '') || 0
            : ( /\D?g/gi.test(size)
                ? size.replace(/\D/g, '') * 1024 * 1024
                : size.replace(/\D/g, '') * 1024 
              )
          )
        }
        let getUsageRate = (item, type) => {
          if (!/(cpu|memory)/i.test(type)) return 0
          let usage = 'cpu' == type
            ? item.status.resources.cpuUsage
            : item.status.resources.memoryUsage
            usage = getByteSize(usage)
          let maximum = 'cpu' == type
            ? item.status.resources.requestCpu
            : item.status.resources.requestMemory        
            maximum = getByteSize(maximum)
          //console.log('####### usage', usage)
          //console.log('####### maximum', maximum)
          return !usage || !maximum ? 0 : Math.round((usage/maximum) * 100)
        }
        let table_items = []
        items.map(item => {
          table_items = [ ...table_items,
            { 
              namespace: item.metadata.namespace || '',
              name: item.metadata.name || '',
              memberRole: item.status.memberRole || '',
              status: item.status.status || '',
              ready: item.status.ready || '',
              nodeName: item.status.nodeName || '',
              podIP: item.status.podIP || '',
              workrPool: item.status.workerPool || '',
              requestCpu: item.status.resources.requestCpu || '',
              requestMemory: item.status.resources.requestMemory || '',
              cpuUsage: { rate: getUsageRate(item, 'cpu'), usage: item.status.resources.cpuUsage } || {},
              memoryUsage: { rate: getUsageRate(item, 'memory'), usage: item.status.resources.memoryUsage } || '',
              storage: item.status.storage.data || ''
            }
          ]
        })
        return { table_fields, table_items }
      },
      handleRowClick (item, index, columnName, event) {
        if (columnName === 'name') {
          this.$router.push({
            path: `/components/details/${item.namespace}`
          })
        }
      },
      getBadgeColor(name) {
        switch (name) {
          case 'Running': return 'success'
          case 'Inactive': return 'secondary'
          case 'Pending': return 'warning'
          case 'Banned': return 'danger'
          default: return 'primary'
        }
      },      

      toast() {
        this._toast("_toast() BUTTON CLICKED !!"); //dialog mixin 함수.
      },
      toastError() {
        this._toast_err("_toast_err() BUTTON CLICKED !!"); //dialog mixin 함수.
      },
      confirm() {
        this._confirm("_confirm() CONFIRM CREATED !!"); //dialog mixin 함수.
      },
      alert() {
        this._alert("_alert() ALERT CREATED !!"); //dialog mixin 함수.
      },
      copySuccess(e) {
        this._toast(this.$t("copy.success") + ` ${e.text}`); //$t -> static.locale 값을 가져온다.
      },
      copyError(e) {
        this._toast(this.$t("copy.fail") + ` ${e.text}`); // $t -> static.locale 값을 가져온다.
      },
      providerIcon(provider) {
        const icons = {
          AZURE: "/img/brand/img_logo_azure.png",
          AWS: "/img/brand/img_logo_aws.png",
          IBM: "/img/brand/img_logo_ibm.png",
          GKE: "/img/brand/img_logo_gcs.png"
        };
        return icons[provider];
      },
      statusIcon(status) {
        const icons = {
          READY: "Ready",
          NOTREADY: "Not Ready",
          UNKNOWN: "Unknown",
          SCHEDULINGDISABLED: "Scheduling Disabled"
        };
        return icons[status];
      },
      color(value) {
        let $color;
        if (value <= 25) {
          $color = "info";
        } else if (value > 25 && value <= 50) {
          $color = "success";
        } else if (value > 50 && value <= 75) {
          $color = "warning";
        } else if (value > 75 && value <= 100) {
          $color = "danger";
        } else if (value > 100) {
          $color = "danger";
        }
        return $color;
      }
    }
  };
</script>
<style>
.table {text-align: center}
</style>
