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
    <CTab title="관리">
      <template v-if="'mariadb' == zdb.datastore && 'management' == activeTab">
      <MySpinner width="4rem" height="4rem" color="success" :grow="true" /> 
      <div>
        <div>
          <CLink v-for="(v , k) in Object.entries(managements.sectors).map(v => v)"
            :key="k"
            href="#"
            target="_self"
            @click.prevent="handleManagementCategory(v[0])"
          >
            {{ v[1].title }}
          </CLink>
        </div><br/>
        <div
          v-for="(item, idx) in managements.sectors[managements.active].contents.variables.tableItems"
          :key="idx" class="management-wrap">
          {{ item.variable }} : {{ item.value }}
        </div><br/>
      </div>
      </template>
    </CTab>
  </CTabs>
</template>

<script>
import { dialog, scrollbar } from '~/mixins'

const managements = {
  active: 'statusVariables',
  sectors: {
    statusVariables: {
      title: '상태변수',
      contents: {}
    },
    systemVariables: {
      title: '시스템변수',
     contents: {}
    },
    connections: {
      title: '클라이언트 커넥션',
      contents: {}
    },
  }
}

export default {
  mixins: [dialog, scrollbar],
  data () {
    return {
      zdb: {
        projectid: this.$route.params.id,
        name: this.$route.params.dsrname,
        namespace: null,
        datastore: null,
        pod: this.$route.params.pod,
        standalone: this.$store.state.cookie.standalone ?? null,
        cluster: this.$store.state.cookie.cluster || null,
      },
      activeTab: 0,
      
      table_fields: [],
      table_items: [],
      table_details: [],
      dbservers: [],
      collapseDuration: 100,
      
      managements: managements
    }
    
  },
  created () {
    this.fetchChildren()
    //console.log('active: ', this.managements.active)
  },
  methods: { 
    /**
     * Fetch the detail data and toggleing its items
     */
    async fetchParents () {
      // const url = `/api/v2/projects/${this.zdb.projectid}/datastorereleases`
      // let res = await this.$axios.$get(url, {})
      let res = await this.$fetcher.set(this.zdb).get('datastore_parents')
      if (!res || !Object.keys(res).length) return console.log('NO response')
      for (let item of res) {
        if (this.zdb.name == item.metadata.name) {
          let architecture = item.status?.architecture || ''
          this.zdb.standalone = 'standalone' == architecture.toLowerCase() ? 1 : 0
          this.zdb.cluster = await item.status?.cluster || ''
        }
      }
      return this.zdb.cluster ? true : false
    },
    async fetchChildren () {
      if (!this.zdb.cluster || !this.zdb.name || !this.zdb.pod) {
        if (!await this.fetchParents()) return console.log('NO response')
      }
      this.$fetcher.set(this.zdb).get('datastore_children').then(res => {
        if (!res || !Object.keys(res).length) return console.log('NO response')
        res = this.parseChildren(res)
        if (!res) return console.log('Parsing error')
        this.table_fields = res.table_fields
        this.table_items = res.table_items.filter((item, id) => {
          if (0 === id) {
            this.zdb.namespace = item.namespace
            this.zdb.pod = item.name
            this.zdb.datastore = item.datastore
            console.log('namespace:', this.zdb.namespace)
            console.log('pod:', this.zdb.pod)
            console.log('datastore:', this.zdb.datastore)
          }
          return item.name == this.zdb.pod
        })
      })
    },
    parseChildren (items) {
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
    handleManagementCategory (id) {
      console.log('categoryId:', id)
      this.fetchManagement(id)
    },
    async fetchManagement (id = this.managements.active) {
      let target = this.managements.sectors[id]
      //if (target.contents.variables.tableItems) return
      let ids = { [id]: [`mariadb_${id}`] }
      if ('connections' == id)
        ids[id] = [ ...ids[id], 'mariadb_processes' ]
      let tasks = []
      ids[id].forEach(id => {
        tasks = [ ...tasks, this.$fetcher.get(id) ]
      })
      let resolves = await Promise.all(tasks)
      target.contents.variables = {}
      resolves.forEach((resolve, idx) => {
        resolve = this.parseVariables(resolve)
        target.contents.variables.tableFields = resolve.fields
        target.contents.variables.tableItems = resolve.items
      })
      this.managements.active = id
      this.activeTab='management'
    },
    parseVariables(data, target) {
      if (!data || typeof data !== 'object') return false
      data = Object.entries(data).sort((a, b) => a > b ? 1 : a < b ? -1 : 0)
      let fields = [
        {key: "variable", label: "변수"},
        {key: "value", label: "값"},
      ]
      let items = []
      data.map(item => {
        items = [ ...items,
          {
            variable: item[0] || '',
            value: item[1] || '',
          }
        ]
      })
      return { fields, items }
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
        case 1: {
          if ('mariadb' == this.zdb.datastore?.toLowerCase())
          //return this.activeTab='management'
            return this.fetchManagement()
        }
        default: return console.log('tab:', value)
      }
    }
  }
}
</script>

<style scoped>
.chart-wrap {float:left; width:33.3%; padding:1%; margin:0 0 30px}
</style>
