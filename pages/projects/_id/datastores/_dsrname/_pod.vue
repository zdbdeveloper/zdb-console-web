<template>
  <CTabs @update:activeTab="activeTab = $event"
    variant='tabs'
  >
    <br/>
    <CTab title="Overview">
      <MySpinner width="4rem" height="4rem" color="success" :grow="true" />
      <CScrollbar class="scroll-area" :settings="psSettings" @ps-scroll-x="scrollHandle">
      <CDataTable
        :items="table_items"
        :fields="table_fields"
        hover
        pagination
        sorter
        striped
      >
      </CDataTable>
      </CScrollbar>
    </CTab>
  </CTabs>
</template>

<script>
import { dialog, scrollbar } from '~/mixins'

export default {
  mixins: [dialog, scrollbar],
  data () {
    return {
      //Parameters
      zdb: {
        projectid: this.$route.params.id,
        name: this.$route.params.dsrname,
        pod: this.$route.params.pod,
      },
      //tables
      activeTab: 0,
      table_fields: [],
      table_items: [],
      table_details: [],
      dbservers: [],
      collapseDuration: 100,
    }
  },
  created () {
    this.fetchDsrChildren()    
  },
  methods: {
    /**
     * Fetch the detail data and toggleing its items
     */
    fetchDsrChildren () {
      this.$store.dispatch('spinner', true);
      let url = `/api/v2/projects/${this.zdb.projectid}/datastorereleases/${this.zdb.name}/datastores?cluster=cloudzcp-pog-dev`
      this.$axios.$get(url, {}).then(res => {
        if (!res || !res.length) return console.log('No data')
        res = this.parseDsrChildren(res)
        if (!res) return console.log('Parsing error')
        this.table_fields = res.table_fields
        this.table_items = res.table_items.filter((item, id) => {
          return item.name == this.zdb.pod
        })
        this.$store.dispatch('spinner', false);
      })
    },
    parseDsrChildren (items) {
      if (!items || typeof items !== 'object') return
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
          ? size?.replace(/\D/g, '') || 0
          : ( /\D?g/gi.test(size)
              ? size?.replace(/\D/g, '') * 1024 * 1024
              : size?.replace(/\D/g, '') * 1024
            )
        )
      }
      //Build a percentage number as rate
      let getUsageRate = (item, type) => {
          if (!/(cpu|memory)/i.test(type)
            || !item.status.resources?.cpuUsage
            || !item.status.resources?.cpuUsage) return 0
          let usage = 'cpu' == type
            ? item.status.resources.cpuUsage
            : item.status.resources.memoryUsage
            usage = getByteSize(usage)
          let maximum = 'cpu' == type
            ? item.status.resources.requestCpu
            : item.status.resources.requestMemory
            maximum = getByteSize(maximum)
          let rate = 'cpu' == type ? 100 : 1
          return !usage || !maximum ? 0 : Math.round((usage/maximum) * rate)
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
            requestCpu: item.status.resources?.requestCpu || '',
            requestMemory: item.status.resources?.requestMemory || '',
            cpuUsage: { value: getUsageRate(item, 'cpu'), usage: item.status.resources?.cpuUsage } || {},
            memoryUsage: { value: getUsageRate(item, 'memory'), usage: item.status.resources?.memoryUsage } || '',
            storage: item.status.storage?.data || '',
            datastore: item.spec.datastore || '',
          }
        ]
      })
      return { table_fields, table_items }
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
      switch(value) {
        default: return console.log('tab:', value)
      }
    }
  }
}
</script>

<style scoped>
.chart-wrap {float:left; width:33.3%; padding:1%; margin:0 0 30px}
</style>
