<template>
<div>
  <div class="chart-options">
    <CRow>
      <CCol xl="2" lg="3">
        <v-select
          v-model.lazy="step.default"
          :options="step.options"
          :clearable="false"
          class="vs__select-custom"
          placeholder="Please select"
          @input="createCharts(true)"
          v-tooltip.top="'Step'"
        />
      </CCol>      
      <CCol xl="2" lg="3">
        <v-select
          v-model.lazy="period.default"
          :options="period.options"
          :clearable="false"
          class="vs__select-custom"
          placeholder="Please select"
          @input="createCharts(true)"
          v-tooltip.top="'Period'"
        />
      </CCol>
    </CRow>
  </div>
  <div v-for="(chart, key, idx) in targetCharts" :key="key" class="chart-wrap">
    <apexchart type="area" height="350"
      :series="chart.series"
      :options="chart.options">
    </apexchart>
  </div>
</div>
</template>

<script>
import { ApexChart } from '~/modules/apexChart'

export default {
  data () {
    return {
      targetCharts: this.$store.state.datastores.apexCharts.targetCharts || {},
      hideSeries: this.$store.state.datastores.apexCharts.hideSeries || [],
      pathname: this.$store.state.datastores.apexCharts.pathname,
      updated: 0,
      period: {
        default: this.$store.state.datastores.apexCharts.period || 1800,
        options: [ 600, 1800, 3600, 10800, 21600, 43200, 86400 ]
      },
      step: {
        default: this.$store.state.datastores.apexCharts.step || 30,
        options: [ 10, 30, 60, 180, 360, 1200, 2400 ]
      }
    }
  },
  created () {
    this.createCharts()
  },
  beforeDestroy () {
    if (this.updated === Object.keys(this.targetCharts).length) {
      this.$store.commit('datastores/apexCharts', { 
        pathname: location.pathname,
        targetCharts: this.targetCharts,
        hideSeries: this.hideSeries,
        period: this.period.default,
        step: this.step.default
      })
    }
  },
  methods: {
    async createCharts (force = false) {
      //Using cache data. You can remove it.
      if (!force && location.pathname == this.pathname && Object.keys(this.targetCharts).length) {
        setTimeout(() => {
          try {
            this.hideSeries.forEach(item => {
              item.id && item.name && this.$apexcharts.exec(item.id, 'hideSeries', item.name)
            })
          } catch (e) {
            console.log(e)
            this.createCharts(true)
          }
        }, 1000)
        return
      }
      const apexChart = new ApexChart({
        server: 'https://pog-dev-prometheus.cloudzcp.io/api/v1/query_range'
        , period: this.period.default
        , step: this.step.default
        , namespace: this.$store.state.datastores.zdb.namespace
        , name: this.$store.state.datastores.zdb.name
        , datastore: this.$store.state.datastores.zdb.datastore
        , standalone: this.$store.state.datastores.zdb.standalone
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
          this.hideSeries = [ ...this.hideSeries, { id: target.id, name }]
        }
      })
      this.updated = this.updated + 1
    },
    async fetchCharts (apexChart) {
      this.updated = 0
      this.targetCharts && Object.keys(this.targetCharts)?.forEach(async (id, idx) => {
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
            let data = {}
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
  }  
}
</script>

<style scoped>
.chart-options { padding: 1rem }
.chart-wrap { float:left; width:33.3%; padding:1%; margin:0 0 30px }
</style>