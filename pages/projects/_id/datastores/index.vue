
<template>
  <div>
    <MySpinner width="4rem" height="4rem" color="success" :grow="true" />
    <h2>Tables</h2>
    <!-- <button@click="stopSocket"
      :disabled="!Boolean(subscription)">STOP SOCKET</button@click=>
    <button @click="startSocket"
      :disabled="Boolean(subscription) || !Boolean(stompClient)">START SOCKET</button>
    <button @click="disconnectSocket"
      :disabled="!Boolean(stompClient)">DISCONNECT SOCKET</button>
    <button @click="connectSocket"
      :disabled="Boolean(stompClient)">CONNECT SOCKET</button> -->
    <!-- <button @click="allColumm">COLUMN</button> -->
    <CScrollbar class="scroll-area" :settings="psSettings" @ps-scroll-x="scrollHandle">
    <CDataTable
      :items="tableItems"
      :fields="FilteredFields"
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
            :items="tableDetails[item.namespace].tableItems"
            :fields="tableDetails[item.namespace].tableFields"
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
    </CDataTable>
    </CScrollbar>
    <!-- <h2>Cards</h2>
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
    </CRow> -->
  </div>
</template>
<script>
  import SockJS from 'sockjs-client'
  import Stomp from 'webstomp-client'
  import {dialog, scrollbar} from "~/mixins";
  import { TableFactory } from '~/modules/tableFactory'

  export default {
    mixins: [dialog, scrollbar],
    data() {
      return {
        //For Tables
        tableFields: [],
        tableItems: [],
        tableDetails: [],
        //filteringFields: ['version', 'datastore'],
        filteringFields: [],
        dbservers: [],
        collapseDuration: 100,
        //For STOMP socket
        stompClient: null,
        subscription: null,
        systemStates: [],

        selected: [
          '1',
          // '1', 'group option 2', '5'
        ],
        options: [
          {
            value: 0,
            text: 'enhancement'
          },
          {
            value: 1,
            text: 'bug',
            // selected: true
          },
          {
            value: 2,
            text: 'duplicate',
            // selected: true
          },
          {
            value: 3,
            text: 'invalid'
          },
          {
            label: 'group',
            options: [
              {
                value: 4,
                text: 'enhancement2'
              },
              {
                value: 5,
                text: 'bug2'
              }
            ]
          }
        ],
      };
    },
    created() {
      this.$store.dispatch('zdb', {
        projectid: this.$route.params.id
      })
      this.fetchTables()
    },
    unmounted() {
      this.disconnectSocket()
    },
    computed: {
      computedFields () {
        return this.tableFields.map(field => {
          return { 
            ...field
          }
        })
      },
      FilteredFields() {
        return this.computedFields.filter(field => {
          return !this.filteringFields.includes(field.key)
        })
      },
    },
    methods: {
      allColumm() {
        this.filteringFields = []
      },    
      connectSocket () {
        const socket = new SockJS('http://localhost:8090/websocket')
        this.stompClient = Stomp.over(socket)
        this.stompClient?.connect({}, (frame) => {
          //console.log('frame:', frame)
          this.stompClient.send('/states', {}, 'connectSocket')
          this.subscribe()
        })
      },
      async subscribe () {
        this.subscription = this.stompClient.subscribe('/topic/states', async res => {
          let systemStates = await JSON.parse(res.body) || []
          this.handleTablesSystemUsage(systemStates)
        })
      },
      startSocket () {
        this.stompClient.send('/states', {}, 'socket-start')
        this.subscribe()
      },
      stopSocket () {
        this.stompClient.send('/states', {}, 'socket-stop')
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
      },
      /** 
       * Handle the system usages in the tables
       */    
      handleTablesSystemUsage (mysystemStates) {
        if (!Array.isArray(mysystemStates) || !mysystemStates.length) return false
        Object.keys(this.tableDetails).forEach(namespace => {
          let tableItems = this.tableDetails[namespace].tableItems
          tableItems?.forEach((tableItem, tableItemIdx) => {
            mysystemStates.forEach(systemState => {
              if (systemState.name == tableItem.name) {
                tableItem.cpuUsage.rate = systemState.cpuRate
                tableItem.memoryUsage.rate = systemState.memoryRate
              }
            })
          })
        })
      },
      /**
       * Fetch data for the tables
       */
      async fetchTables () {
        let res = await this.$fetcher.set(this.$store.state.zdb).get('datastore_parents')
        if (!res || typeof res !== 'object') return console.debug('NO response')
        res = new TableFactory({id: 'datastore_parents', items: res}).build()
        this.tableFields = res.tableFields
        this.tableItems = res.tableItems.map((item, id) => {
          this.tableDetails[item.namespace] = {}
          return { ...item, id }
        })
      },
      /**
       * Fetch table's detail data and toggleing its items
       */
      async fetchDetails (item) {
        let namespace = item.namespace
          , name = item.name
          , cluster = item.cluster
        if (this.tableDetails && this.tableDetails[namespace].tableItems) {
          return this.$set(this.tableItems[item.id], '_toggled', !item._toggled)
        }
        this.$store.dispatch('zdb', { namespace, name, cluster })
        let res = await this.$fetcher.set(this.$store.state.zdb).get('datastore_children')
        if (!res || !Object.keys(res).length) return console.debug('NO response')
        res = new TableFactory({id: 'datastore_children', items: res}).build()
        let tableFields = res.tableFields
        let tableItems = res.tableItems.map((item, id) => { return {...item, id}})
        this.tableDetails[namespace] =  { tableFields, tableItems }
        this.$set(this.tableItems[item.id], '_toggled', !item._toggled)
      },
      /**
       * Click Event on the table rows
       */
      handleRowClick (item, index, columnName, event) {
        if (columnName === 'name') {
          let name = this.tableItems[index].name
            , cluster = this.tableItems[index].cluster
            , architecture = this.tableItems[index].architecture
            , standalone = 'standalone' == architecture.toLowerCase() ? 1 : 0
          this.$store.dispatch('zdb', { standalone, cluster })
          this.$router.push({
            path: `/projects/${this.$store.state.zdb.projectid}/datastores/${name}`
          })
        }
      },
      /**
       * Bage color
       */
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
<style scoped>
.table {text-align: center}
.hide {display: none}
</style>