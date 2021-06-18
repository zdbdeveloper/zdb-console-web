<template>
  <CTabs @update:activeTab="activeTab=$event"
    justified
    variant='tabs'
  >
    <br/>
    <CTab title="서비스정보">
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
      </CScrollbar>
    </CTab>
    <CTab title="스케일">
      <!-- <CRow class="card-dash-group">
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
    </CTab>
    <CTab title="모니터링">
      <div v-for="(chart, key, idx) in targetCharts" :key="key" class="chart-wrap">
        <apexchart type="area" height="350"
          :series="chart.series"
          :options="chart.options">
        </apexchart>
      </div>
    </CTab>
    <CTab title="백업" />
    <CTab title="이벤트" />
    <CTab title="로그" />
    <CTab title="관리" />
    </CTab>
  </CTabs>
</template>

<script>
import { dialog, scrollbar } from '~/mixins'
import { ApexChart } from '~/modules/apexChart'
import { TableFactory } from '~/modules/tableFactory'

export default {
  mixins: [dialog, scrollbar],
  data () {
    return {
      activeTab: 0,
      //Tables
      tableFields: [],
      tableItems: [],
      table_details: [],
      dbservers: [],
      collapseDuration: 100,
      //Apexchart Chart
      targetCharts: null,
    }
  },
  computed: {
  },
  created () {
    this.$store.dispatch('zdb', {
      projectid: this.$route.params.id,
      name: this.$route.params.dsrname,
    })
    this.fetchChildren()
  },
  methods: {
    async createChart () {
      if (this.targetCharts) return
      const apexChart = new ApexChart({
        server: 'https://pog-dev-prometheus.cloudzcp.io/api/v1/query_range'
        , period: 1800
        , step: 30
        , namespace: this.$store.state.zdb.namespace
        , name: this.$store.state.zdb.name
        , datastore: this.$store.state.zdb.datastore
        , standalone: this.$store.state.zdb.standalone
      })
      this.targetCharts = apexChart.getCharts()
      setTimeout(() => {
        this.fetchCharts(apexChart)
      }, 300)
    },
    parseChartData (rawData) {
      let series = [], categories = [], names = []
      if(rawData) {
        for (let [key, content] of Object.entries(rawData)) {
          content.data.result.forEach(async (result, idx) => {
            //if (1 < idx) return
            let originName = result.metric.pod || result.metric.service || result.metric.release
              || result.metric.state || result.metric.db || result.metric.statefulset_kubernetes_io_pod_name
              , name = originName ? `${key}/${originName}` : `${key}`
              , data = result.values
              , item = { name, data }
            series = [ ...series, item ]
            names = [ ...names, name ]
            if (1 === series.length) {
              categories = data.map(arr => arr[0])
            }
          });
        }
      }
      return { series, categories, names }
    },
    async updateChart (target, contents) {
      let targetChart = this.targetCharts[target.id]
      contents = this.parseChartData(contents)
      targetChart.series = contents.series
      targetChart.options = await { ...targetChart.options, ...{
        xaxis: { ...targetChart.options.xaxis, categories: contents.categories },
        noData: { ...targetChart.options.noData, text: 'No Data' }
      }}
      target.exclusive && contents.names?.forEach(name => {
        let splitedName = name.split('/')
          , hasKey = splitedName?.[1]
        if (hasKey && !target.exclusive.includes(splitedName[0])) {
          this.$apexcharts.exec(target.id, 'hideSeries', name)
        }
      })
    },
    async fetchCharts (apexChart) {
      this.targetCharts && Object.keys(this.targetCharts)?.forEach(async id => {
        let requests = apexChart.getRequests(id)
        if (!requests) return
        let url = requests.url
          , params = requests.params
          , queries = requests.chart.queries
          , exclusive = requests.chart.exclusive || ''
        if (queries && typeof queries === 'object') {
          let names = [], tasks = []
          for (let [name, query] of Object.entries(queries)) {
            names.push(name)
            tasks = [ ...tasks, this.$axios.$get(url, { params: { ...params, query }}) ]
          }
          Promise.all(tasks).then(resolve => {
            let data = {}, i = 0
            names.forEach((name, idx) => {
              data[name] = resolve[idx]
            })
            this.updateChart (
              { id, exclusive }, data
            )
          })
        }
      })
    },
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
    /**
     * Click Event on the table rows
     */
    handleRowClick (item, index, columnName, event) {
      if (columnName === 'name') {
        this.$router.push({
          path: `/projects/${this.$store.state.zdb.projectid}/datastores/${this.$store.state.zdb.name}/${item.name}`
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
    },
  },
  watch: {
    activeTab (value) {
      switch(value) {
        case 2: return this.createChart()
        // case 6: {
        //   return this.activeTab='management'
        // }
        default: return console.log('tab:', value)
      }
    }
  }
}
</script>

<style>
.chart-wrap { float:left; width:33.3%; padding:1%; margin:0 0 30px }
</style>
