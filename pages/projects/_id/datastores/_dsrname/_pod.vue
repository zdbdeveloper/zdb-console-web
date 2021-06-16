<template>
  <CTabs @update:activeTab="activeTab = $event"
    variant='tabs'
  >
    <br/>
    <CTab title="Overview">
      <MySpinner width="4rem" height="4rem" color="success" :grow="true" />
      <CScrollbar class="scroll-area" :settings="psSettings" @ps-scroll-x="scrollHandle">
      <CDataTable
        :items="tableItems"
        :fields="tableFields"
        hover
        pagination
        sorter
        striped
      >
      </CDataTable>
      </CScrollbar>
    </CTab>
    <CTab title="관리">
      <!-- <Management v-if="'management' == activeTab" :payload="{zdb}" />       -->
      <template v-if="'mariadb' == $store.state.zdb.datastore && 'management' == activeTab">
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
        <div
            v-for="(item, idx) in managements.sectors[managements.active].contents.processes.tableItems"
            :key="'p'+ idx" class="management-wrap">
            Id: {{ item.Id }}, Progress:{{ item.Progress }}, User: {{ item.User }}, Command: {{ item.Command }}, State: {{ item.State }}, Time: {{ item.Time }}, Info: {{ item.Info }}, db: {{ item.db }}
          </div>
      </div>
      </template>
    </CTab>
  </CTabs>
</template>

<script>
import { dialog, scrollbar } from '~/mixins'
import { TableFactory } from '~/modules/tableFactory'

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
      activeTab: 0,
      tableFields: [],
      tableItems: [],
      table_details: [],
      dbservers: [],
      collapseDuration: 100,
      managements: managements
    }
    
  },
  created () {
    this.$store.dispatch('zdb', {
      projectid: this.$route.params.id,
      name: this.$route.params.dsrname,
      pod: this.$route.params.pod,
    })
    this.fetchChild()
    //console.log('active: ', this.managements.active)
  },
  methods: { 
    async fetchParents () {
      let res = await this.$fetcher.set(this.$store.state.zdb).get('datastore_parents')
      if (!res || typeof res !== 'object') return console.log('NO response')
      for (let item of res) {
        if (this.$store.state.zdb.name == item.metadata.name) {
          let architecture = item.status?.architecture || ''
            , standalone = 'standalone' == architecture.toLowerCase() ? 1 : 0
            , cluster = item.metadata.labels.cluster
          this.$store.dispatch('zdb', {
            architecture, standalone, cluster
          })
        }
      }
      return this.$store.state.zdb.cluster ? true : false
    },
    async fetchChild () {
      if (!this.$store.state.zdb.cluster || !(0 <= this.$store.state.zdb.standalone)) {
        if (!await this.fetchParents()) return console.log('NO response')
      }
      this.$fetcher.set(this.$store.state.zdb).get('datastore_children').then(res => {
        if (!res || !Object.keys(res).length) return console.log('NO response')
        //res = this.parseChildren(res)
        res = new TableFactory({id: 'children', items: res}).build()

        if (!res) return console.log('Parsing error')
        this.tableFields = res.tableFields
        this.tableItems = res.tableItems.filter((item, id) => {
          //item.name == this.$store.state.zdb.pod
          if (0 == id) {
            //console.log('item.pod:', item.name, ' zdb.pod:', this.$store.state.zdb.pod)
            this.$store.dispatch('zdb', {
              namespace: item.namespace,
              pod: item.name,
              datastore: item.datastore
            })
          }
          return item.name == this.$store.state.zdb.pod
        })
      })
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
      target.contents.processes = {}
      resolves.forEach((resolve, idx) => {
        //console.log('resolve:', resolve)
        if ('connections' == id && 0 < idx) {
          resolve = this.parseProcesses(resolve)
          target.contents.processes.tableFields = resolve.fields
          target.contents.processes.tableItems = resolve.items
        } else {
          resolve = this.parseVariables(resolve)
          target.contents.variables.tableFields = resolve.fields
          target.contents.variables.tableItems = resolve.items
        }
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
    parseProcesses(data) {
      let fields = [
        {key: "Id", label: "Id", style: "width:1%", sorter: false, filter: false},
        {key: "Progress", label: "Progress", _style: 'min-width:100px'},
        {key: "User", label: "User", _style:'min-width:140px'},
        {key: "Command", label: "Command"},
        {key: "State", label: "State"},
        {key: "Time", label: "Time"},
        {key: "Info", label: "Info"},
        {key: "db", label: "db"},
      ]
      let items = []
      data.map(item => {
        items = [ ...items,
          {
            Id: item.Id || '',
            Progress: item.Progress || '',
            User: item.User || '',
            Command: item.Command || '',
            State: item.State || '',
            Time: item.Time || '',
            Info: item.Info || '',
            db: item.db || '',
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
          if ('mariadb' == this.$store.state.zdb.datastore?.toLowerCase())
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
