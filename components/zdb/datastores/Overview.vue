<template>
  <div>
    <MySpinner />
    <MyScrollbar>
      <CDataTable
        :items="tableItems"
        :fields="tableFields"
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
    </MyScrollbar>
  </div>  
</template>

<script>
import { TableFactory } from '~/modules/tableFactory'

export default {
  data () {
    return {
      tableFields: [],
      tableItems: [],
    }
  },
  created () {
    this.fetchChild()
  },
  methods: { 
    async fetchParents () {
      let res = await this.$fetcher.set(this.$store.state.datastores.zdb).get('datastore_parents')
      if (!res || typeof res !== 'object') return console.debug('NO response')
      for (let item of res) {
        if (this.$store.state.datastores.zdb.name == item.metadata.name) {
          let architecture = item.status?.architecture || ''
            , standalone = 'standalone' == architecture.toLowerCase() ? 1 : 0
            , cluster = item.metadata.labels.cluster
          this.$store.commit('datastores/zdb', {
            architecture, standalone, cluster
          })
        }
      }
      return this.$store.state.datastores.zdb.cluster ? true : false
    },
    async fetchChild () {
      if (!this.$store.state.datastores.zdb.cluster || !(0 <= this.$store.state.datastores.zdb.standalone)) {
        if (!await this.fetchParents()) return console.debug('NO response')
      }
      this.$fetcher.set(this.$store.state.datastores.zdb).get('datastore_children').then(res => {
        if (!res || !Object.keys(res).length) return console.debug('NO response')
        res = new TableFactory({id: 'datastore_children', items: res}).build()
        if (!res) return console.debug('Parsing error')
        this.tableFields = res.tableFields
        this.tableItems = res.tableItems.filter((item, id) => {
          if (item.name == this.$store.state.datastores.zdb.pod) {
            this.$store.commit('datastores/zdb', {
              namespace: item.namespace,
              datastore: item.datastore
            })
          }
          return item.name == this.$store.state.datastores.zdb.pod
        })
      })
    },
  },
}
</script>

<style>

</style>