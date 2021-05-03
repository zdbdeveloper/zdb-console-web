<template>
  <div>
    <h2>Tables</h2>
    <button @click="handleTablesCpuUsage">changeCpuUsage</button>
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
            :items="details_items"
            :fields="details_fields"
            hover
            pagination
            sorter
            striped
          >
          </CDataTable>
        </CCollapse>
      </template>
      <template #Provider="{item}">
        <td class="text-center">
          <img :alt="item.Provider" :src="providerIcon(item.Provider)" width="22">
        </td>
      </template>
      <template #Status="{item}">
        <td class="text-center">
          <template v-for="(s, k) in item.Status">
            <template v-if="statusIcon(s) === 'Ready'">
              <CBadge :key="k" color="success">
                {{ statusIcon(s) }}
              </CBadge>
            </template>
            <template v-if="statusIcon(s) === 'Not Ready'">
              <CBadge :key="k" color="danger">
                {{ statusIcon(s) }}
              </CBadge>
            </template>
            <template v-if="statusIcon(s) === 'Unknown'">
              <CBadge :key="k" color="secondary">
                {{ statusIcon(s) }}
              </CBadge>
            </template>
            <template v-if="statusIcon(s) === 'Scheduling Disabled'">
              <CBadge :key="k" color="secondary">
                {{ statusIcon(s) }}
              </CBadge>
            </template>
          </template>
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
      <template #CPU_Usage="{item}">
        <td>
          <div class="clearfix" style="min-width: 160px;">
            <div class="float-left">
              <strong>{{ item.CPU_Usage.value }} %</strong>
            </div>
            <div class="float-right">
              <small class="text-muted">{{ item.CPU_Usage.range }} / {{ item.CPU_Usage.full }}</small>
            </div>
          </div>
          <CProgress
            v-model="item.CPU_Usage.value"
            :color="color(item.CPU_Usage.value)"
            class="progress-xs"
          />
        </td>
      </template>
      <template #Memory_Usage="{item}">
        <td>
          <div class="clearfix" style="min-width: 160px;">
            <div class="float-left">
              <strong>{{ item.Memory_Usage.value }} %</strong>
            </div>
            <div class="float-right">
              <small class="text-muted">{{ item.Memory_Usage.range }} / {{ item.Memory_Usage.full }}</small>
            </div>
          </div>
          <CProgress
            v-model="item.Memory_Usage.value"
            :color="color(item.Memory_Usage.value)"
            class="progress-xs"
          />
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

  const cpuUsage = [
    {"value": 67.06, "full": "2861Mi", "range": "2211Mi"},
    {"value": 17.06, "full": "2861Mi", "range": "2211Mi"},
    {"value": 37.06, "full": "2861Mi", "range": "2211Mi"}
  ]
  
  export default {
    mixins: [dialog],
    data() {
      return {
        value: "0000",
        table_fields: [],
        table_items: [],
        dbservers: [],
        activeTab: 0,
        collapseDuration: 100,
        details: [],
        details_fields: [],
        details_items: [],

        age: 'unknown'
        //stompClient: null,
        //subscription: null,
        //cpuUsage
      };
    },
    created() {
        this.fetchTables()
    },
    // mounted() {
    //   this.socket = this.$nuxtSocket({
    //     channel: '/index'
    //   })
    //   this.socket.on('tablesEvent', (msg, cb) => {
    //     handleSocket()
    //   })
    // },
    methods: {
      handleTablesCpuUsage() {
        console.log('items: ', this.table_items)
        this.table_items.map((item, id) => {
          item.CPU_Usage = cpuUsage[id]
        })
      },
      fetchTables() {
        const url = 'http://localhost:3004/mytables'
        this.$axios.$get(url, {}).then(res => {
          this.table_fields = res.table_fields
          this.table_items = res.table_items.map((item, id) => { return {...item, id}})
          this.dbservers = res.dbservers
        })
      },
      fetchDetails(item) {
        const url = `http://localhost:3004/mydetails/${item.id + 1}`
        this.$axios.$get(url, {}).then(res => {
          console.log('######## res: ', res)
          if (!res) return this.toastError()
          this.$set(this.table_items[item.id], '_toggled', !item._toggled)
          this.details_fields = res.details_fields
          this.details_items = res.details_items.map((item, id) => { return {...item, id}})
        })
      },
      getTableItems(items) {
        let table_items = []
        let table_fields = [
          { 
            key: "show_details", 
            label: "", 
            style: "width:1%", 
            sorter: false, 
            filter: false
          },
          {key: "namespace", label: "NAMESPACE"},
          {key: "name", label: "NAME"},
          {key: "datastore", label: "DATASTORE"},
          {key: "version", label: "VERSION"},
          {key: "architecture", label: "ARCHITECTURE"},
          {key: "deployStatus", label: "DEPLOY STATUS"},
          {key: "status", label: "STATUS"},
          {key: "ready", label: "READY"},
          {key: "requestCpu", label: "CPU(REQUEST)"},
          {key: "requestMemory", label: "MEMORY(REQUEST)"},
          {key: "storage", label: "STORAGE(DATA)"},
          {key: "message", label: "MESSAGE"},
          {key: "age", label: "AGE"}
        ]

        items.map(item => {
          table_items = [ ...table_items,
            { 
              namespace: item.metadata.namespace,
              name: item.metadata.name,
              datastore: item.spec.datastore,
              version: item.spec.version,
              architecture: item.status.architecture,
              deployStatus: item.status.deployStatus,
              status: item.status.status,
              ready: item.status.ready,
              requestCpu: item.status.resources.requestCpu,
              requestMemory: item.status.resources.requestMemory,
              storage: item.status.storage.data
            }
          ]
          console.log('table_items: ', table_items)    
        })
        return { table_fields, table_items }
      },
      handleRowClick (item, index, columnName, event) {
        if (columnName === 'Provider') {
          this.$router.push({
            path: '/components/detail'
          })
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
<style></style>
