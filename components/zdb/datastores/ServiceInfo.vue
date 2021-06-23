<template>
  <div>
    <MySpinner width="4rem" height="4rem" color="success" :grow="true" />
    <CScrollbar class="scroll-area" :settings="psSettings" @ps-scroll-x="scrollHandle">
    <CDataTable
      :items="tableItems"
      :fields="tableFields"
      hover
      pagination
      sorter
      striped
      @row-clicked="handleRowClick"
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
          :color="item.cpuColor"
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
          :color="item.memoryColor"
          class="progress-xs"
        />
      </td>
    </template> 
    </CDataTable>
    </CScrollbar>    
  </div>
</template>

<script>
import { scrollbar } from '~/mixins'
import { TableFactory } from '~/modules/tableFactory'

export default {
  mixins: [scrollbar],
  data () {
    return {
      tableFields: [],
      tableItems: [],
    }
  },
  created () {
    this.fetchChildren()
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
    async fetchChildren () {
      if (!this.$store.state.zdb.cluster || !(0 <= this.$store.state.zdb.standalone)) {
        if (!await this.fetchParents()) return console.debug('NO response')
      }
      let res = await this.$fetcher.set(this.$store.state.zdb).get('datastore_children')
      if (!res || !Object.keys(res).length) return console.debug('NO response')
      res = new TableFactory({id: 'datastore_children', items: res}).build()
      if (!res) return console.debug('Parsing error')
      this.tableFields = res.tableFields
      this.tableItems = res.tableItems.map((item, id) => {
        if (0 === id) {
          this.$store.dispatch('zdb', {
            namespace: item.namespace,
            datastore: item.datastore
          })
        }
        return { ...item, id }
      })
    },
    handleRowClick (item, index, columnName, event) {
      if (columnName === 'name') {
        this.$router.push({
          path: `/projects/${this.$store.state.zdb.projectid}/datastores/${this.$store.state.zdb.name}/${item.name}`
        })
      }
    },
  },
}
</script>

<style>

</style>