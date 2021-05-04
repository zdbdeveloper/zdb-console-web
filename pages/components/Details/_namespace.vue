<template>
  <CTabs @update:activeTab="activeTab = $event">
    <br/>
    <CTab :title="namespace">
      <CDataTable
        :items="table_items"
        :fields="table_fields"
        hover
        pagination
        sorter
        striped
      >
      <template #cpuUsage="{item}">
        <td>
          <div class="clearfix" style="min-width: 160px;">
            <div class="float-left">
              <strong>{{ item.cpuUsage.value }} %</strong>
            </div>
            <div class="float-right">
              <small class="text-muted">{{ item.cpuUsage.usage }}</small>
            </div>
          </div>
          <CProgress
            v-model="item.cpuUsage.value"
            :color="color(item.cpuUsage.value)"
            class="progress-xs"
          />
        </td>
      </template>
      <template #memoryUsage="{item}">
        <td>
          <div class="clearfix" style="min-width: 160px;">
            <div class="float-left">
              <strong>{{ item.memoryUsage.value }} %</strong>
            </div>
            <div class="float-right">
              <small class="text-muted">{{ item.memoryUsage.usage }}</small>
            </div>
          </div>
          <CProgress
            v-model="item.memoryUsage.value"
            :color="color(item.memoryUsage.value)"
            class="progress-xs"
          />
        </td>
      </template>          
      </CDataTable>
    </CTab>
    <CTab title="환경설정">
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
    </CTab>
    <CTab title="Disabled" disabled>
      Text will not be shown.
    </CTab>
  </CTabs>
</template>

<script>
export default {
  data() {
    return {
      namespace: this.$route.params.namespace,
      activeTab: 0,
      table_fields: [],
      table_items: [],
      table_details: [],
      dbservers: [],
      activeTab: 0,
      collapseDuration: 100,
    };
  },
  created() {
    this.fetchDetails(this.namespace)
  },
  methods: {
    /**
     * Fetch the detail data and toggleing its items
     */
    fetchDetails (namespace) {
      //Fetch data
      const url = `http://localhost:3005/${namespace}`
      this.$axios.$get(url, {}).then(res => {
        if (!res) return this.toastError()
        //Parse data
        res = this.parseTableDetails(res)
        this.table_fields = res.table_fields
        this.table_items = res.table_items.map((item, id) => {
          return {...item, id}
        })
      })
    },
    parseTableDetails (items) {
      let table_fields = [
        {key: "namespace", label: "NAMESPACE"},
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
      //Translate size into byte type
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
      //Build a percentage number as rate 
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
        return Math.round((usage/maximum) * 100)
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
            cpuUsage: { value: getUsageRate(item, 'cpu'), usage: item.status.resources.cpuUsage } || {},
            memoryUsage: { value: getUsageRate(item, 'memory'), usage: item.status.resources.memoryUsage } || '',
            storage: item.status.storage.data || ''
          }
        ]
        //console.log('table_items: ', table_items)    
      })
      return { table_fields, table_items }
    },
    
    /**
     * Click Event for the tab of Configuration
     */
    fetchConfiguration() {
      const url = 'http://localhost:3003/dbservers'
      this.$axios.$get(url, {}).then(res => {
        if (!res) return this._toast_err("Fail to fetch data from the server")
        this.dbservers = res
      })
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
  },
  watch: {
    activeTab (value) {
      if (1 === value) {
        this.fetchConfiguration()
      }
    }
  }
}
</script>

<style>

</style>