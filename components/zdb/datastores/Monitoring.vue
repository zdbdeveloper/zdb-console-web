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
          :reduce="name => name.value"
          label="name"
          :clearable="false"
          class="vs__select-custom"
          placeholder="Please select"
          v-tooltip.top="'Period'"
          @input="createCharts(true)"
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
      //Import cache data from Store
      targetCharts: this.$store.state.datastores.apexCharts.targetCharts || {},
      hideSeries: this.$store.state.datastores.apexCharts.hideSeries || [],
      pathname: this.$store.state.datastores.apexCharts.pathname,
      updated: 0,
      //The period to fetch the chart's data
      period: {
        default: this.$store.state.datastores.apexCharts.period || 1800,
        options: [
          { value: 600, name: '10 Minuts'},
          { value: 1800, name: '30 Minuts'},
          { value: 3600, name: '1 Hours'},
          { value: 10800, name: '3 Hours'},
          { value: 21600, name: '6 Hours'},
          { value: 43200, name: '12 Hours'},
          { value: 86400, name: '1 Day'},
        ]
      },
      //What a narrow steps in fetching data.
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
    //Store cache data
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
    /**
     * Create Charts you choose.
     */
    async createCharts (force = false) {
      //Using cache data. You can remove it.
      if (!force && location.pathname == this.pathname && Object.keys(this.targetCharts).length) {
        setTimeout(() => {
            this.hideSeries.forEach(item => {
              try {
                this.$apexcharts.exec(item.id, 'hideSeries', item.name)
              } catch (e) { console.log(e) }
            })
        }, 500)
        return
      }
      //Construct ApexChart and getting data.
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
    /**
     * Parse data to make the charts.
     */
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
            //It's enough to make the categories only once. 
            if (1 === series.length) {
              categories = data.map(arr => arr[0])
            }
          });
        }
      }
      return { series, categories, names }
    },
    /**
     * Uupdate the chart
     */
    async updateChart (target, contents) {
      let targetChart = this.targetCharts[target.id]
      contents = this.parseChartData(contents)
      targetChart.series = contents.series
      targetChart.options = await { ...targetChart.options, ...{
        xaxis: { ...targetChart.options.xaxis, categories: contents.categories },
        noData: { ...targetChart.options.noData, text: 'No Data' }
      }}
      //Hide the series by your settings.
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
    /**
     * Fetch data for making charts.
     */
    async fetchCharts (apexChart) {
      this.updated = 0
      this.hideSeries = []
      this.targetCharts && Object.keys(this.targetCharts)?.forEach(async (id, idx) => {
        let requests = apexChart.getRequests(id)
        if (!requests) return
        let url = requests.url
          , params = requests.params
          , queries = requests.chart.queries
          , exclusive = requests.chart.exclusive || ''
        //Take on work asyncronusly
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