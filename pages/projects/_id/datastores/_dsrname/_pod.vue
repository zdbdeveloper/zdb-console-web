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
      <Management v-if="'management'==activeTab" />      
    </CTab>
  </CTabs>
</template>

<script>
import { dialog, scrollbar } from '~/mixins'
import { TableFactory } from '~/modules/tableFactory'

export default {
  mixins: [dialog, scrollbar],
  data () {
    return {
      activeTab: null,
      tableFields: [],
      tableItems: [],
      table_details: [],
      dbservers: [],
      collapseDuration: 100,
    }
  },
  created () {
    this.$store.dispatch('zdb', {
      projectid: this.$route.params.id,
      name: this.$route.params.dsrname,
      pod: this.$route.params.pod,
    })
    this.fetchChild()
  },
  methods: { 
    async fetchParents () {
      let res = await this.$fetcher.set(this.$store.state.zdb).get('datastore_parents')
      if (!res || typeof res !== 'object') return console.debug('NO response')
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
        if (!await this.fetchParents()) return console.debug('NO response')
      }
      this.$fetcher.set(this.$store.state.zdb).get('datastore_children').then(res => {
        if (!res || !Object.keys(res).length) return console.debug('NO response')
        res = new TableFactory({id: 'datastore_children', items: res}).build()
        if (!res) return console.debug('Parsing error')
        this.tableFields = res.tableFields
        this.tableItems = res.tableItems.filter((item, id) => {
          if (item.name == this.$store.state.zdb.pod) {
            this.$store.dispatch('zdb', {
              namespace: item.namespace,
              datastore: item.datastore
            })
          }
          return item.name == this.$store.state.zdb.pod
        })
      })
    },
  },
  watch: {
    activeTab (value) {
      switch(value) {
        case 1: {
          if ('mariadb' == this.$store.state.zdb.datastore?.toLowerCase())
            return this.activeTab='management'
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
