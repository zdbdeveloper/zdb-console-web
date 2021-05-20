<template>
  <CTabs @update:activeTab="activeTab = $event"
    fill
    justified
    variant='pills'
  >
    <br/>
    <CTab title="ApexChart">
      <div v-if="cpuUsageChart" class="chart-wrap">
        <apexchart type="area" height="350"
          :options="cpuUsageChart.options" :series="cpuUsageChart.series">
        </apexchart>
      </div>
      <div v-if="memoryUsageChart" class="chart-wrap">
        <apexchart type="area" height="350"
          :options="memoryUsageChart.options" :series="memoryUsageChart.series">
        </apexchart>
      </div>
     <div v-if="networkIOChart" class="chart-wrap">
        <apexchart type="area" height="350"
          :options="networkIOChart.options" :series="networkIOChart.series">
        </apexchart>
      </div>
      <div v-if="connectionsChart" class="chart-wrap">
        <apexchart type="area" height="350"
          :options="connectionsChart.options" :series="connectionsChart.series">
        </apexchart>
      </div>
      <div v-if="threadActivityChart" class="chart-wrap">
        <apexchart type="area" height="350"
          :options="threadActivityChart.options" :series="threadActivityChart.series">
        </apexchart>
      </div>
      <div v-if="tableLocksChart" class="chart-wrap">
        <apexchart type="area" height="350"
          :options="tableLocksChart.options" :series="tableLocksChart.series">
        </apexchart>
      </div>
      <div v-if="currentQPSChart" class="chart-wrap">
        <apexchart type="area" height="350"
          :options="currentQPSChart.options" :series="currentQPSChart.series">
        </apexchart>
      </div>
      <div v-if="replictionDelayChart" class="chart-wrap">
        <apexchart type="area" height="350"
          :options="replictionDelayChart.options" :series="replictionDelayChart.series">
        </apexchart>
      </div>
      <div v-if="slaveSqlThreadRunningChart" class="chart-wrap">
        <apexchart type="area" height="350"
          :options="slaveSqlThreadRunningChart.options" :series="slaveSqlThreadRunningChart.series">
        </apexchart>
      </div>
      <div v-if="slaveIOThreadRunningChart" class="chart-wrap">
        <apexchart type="area" height="350"
          :options="slaveIOThreadRunningChart.options" :series="slaveIOThreadRunningChart.series">
        </apexchart>
      </div>
    </CTab>

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
import { dialog } from '~/mixins'
import { getCpuUsageChart, getMemoryUsageChart, getNetworkIOChart
  , getConnectionsChart, getThreadActivityChart, getTableLocksChart
  , getCurrentQPSChart, getReplictionDelayChart, getSlaveSqlThreadRunningChart
  , getSlaveIOThreadRunningChart } from '~/modules/apexcharts'

const now = Math.floor(new Date().getTime() / 1000)

export default {
  mixins: [dialog],
  data() {
    return {
      namespace: this.$route.params.namespace,
      activeTab: 0,
      table_fields: [],
      table_items: [],
      table_details: [],
      dbservers: [],
      collapseDuration: 100,
      //Apexchart Chart
      cpuUsageChart: getCpuUsageChart(),
      memoryUsageChart: getMemoryUsageChart(),
      networkIOChart: getNetworkIOChart(),
      connectionsChart: getConnectionsChart(),
      threadActivityChart: getThreadActivityChart(),
      tableLocksChart: getTableLocksChart(),
      currentQPSChart: getCurrentQPSChart(),
      replictionDelayChart: getReplictionDelayChart(),
      slaveSqlThreadRunningChart: getSlaveSqlThreadRunningChart(),
      slaveIOThreadRunningChart: getSlaveIOThreadRunningChart()
    }
  },
  created() {
    //this.fetchDetails(this.namespace)
    this.fetchCpuUsageChart()
    this.fetchMemoryUsageChart()
    this.fetchNetworkIOChart()
    this.fetchConnectionsChart()
    this.fetchThreadActivityChart()
    this.fetchTableLocksChart()
    this.fetchCurrentQPSChart()
    this.fetchReplictionDelayChart()
    this.fetchSlaveSqlThreadRunningChart()
    this.fetchSlaveIOThreadRunningChart()
  },
  methods: {

    parseRawChartData (rawData) {
      let series = [], categories = [], names = []

      if(rawData) {
        for (let [key, content] of Object.entries(rawData)) {
          content.data.result.forEach((result, idx) => {
            //if (1 < idx) return
            let pod = result.metric.pod
              , name = pod ? `${key}/${pod}` : key
              , data = result.values
              , item = { name, data } 
            series = [ ...series, item ]
            names = [ ...names, name ]

            if (1 === Object.keys(series).length)
              categories = data.map(arr => arr[0])        
          });
        }
      }
      return { series, categories, names }
    },

    async updateChart (target, contents) {
      let targetChart = this[target.id]
      //console.log('targetChart:', targetChart)
      contents = this.parseRawChartData(contents)
      targetChart.series = contents.series
      targetChart.options = await { ...targetChart.options, ...{
        xaxis: { ...targetChart.options.xaxis, categories: contents.categories }
      }}

      target.exclusive && contents.names?.forEach(name => {
        if (!target.exclusive.includes(name.split('/')[0]))
          this.$apexcharts.exec(target.id, 'hideSeries', name)
      })
    },

    async fetchCpuUsageChart () { 
      let url = 'https://pog-dev-prometheus.cloudzcp.io/api/v1/query_range'
        , queries = {
            current: 'sum by (pod)(rate(container_cpu_usage_seconds_total{pod=~"backup-test-test10214-mariadb-master-0",container="mariadb"}[1m]))',
            request: 'kube_pod_container_resource_requests_cpu_cores{pod=~"backup-test-test10214-mariadb-master-0",container="mariadb"}',
            limit: 'kube_pod_container_resource_limits_cpu_cores{pod=~"backup-test-test10214-mariadb-master-0",container="mariadb"}'
        }
        , params = {
          end: now,
          start: now - 1800,
          step: 30
        }
        
      let current = this.$axios.$get(url, { params: { ...params, query: queries.current } })
        , request = this.$axios.$get(url, { params: { ...params, query: queries.request } })
        , limit = this.$axios.$get(url, { params: { ...params, query: queries.limit } })

      Promise.all([ current, request, limit ]).then(([current, request, limit ]) => {
        this.updateChart (
          { id: 'cpuUsageChart', exclusive: 'current limit' },
          { current, request, limit }
        )
      })
    },

    async fetchMemoryUsageChart () {
      let url = 'https://pog-dev-prometheus.cloudzcp.io/api/v1/query_range'
        , queries = {
            current: 'avg by(pod) (container_memory_rss{pod=~"backup-test-test10214-mariadb-master-0",container="mariadb"})',
            request: 'kube_pod_container_resource_requests_memory_bytes{pod=~"backup-test-test10214-mariadb-master-0",container="mariadb"}',
            limit: 'kube_pod_container_resource_limits_memory_bytes{pod=~"backup-test-test10214-mariadb-master-0",container="mariadb"}'
        }
        , params = {
          end: now,
          start: now - 1800,
          step: 30
        }

      let current = this.$axios.$get(url, { params: { ...params, query: queries.current } })
        , request = this.$axios.$get(url, { params: { ...params, query: queries.request } })
        , limit = this.$axios.$get(url, { params: { ...params, query: queries.limit } })

      Promise.all([ current, request, limit ]).then(([current, request, limit ]) => {
        this.updateChart (
          { id: 'memoryUsageChart', exclusive: 'current' },
          { current, request, limit }
        )
      })
    },
    
    async fetchNetworkIOChart () {
      let url = 'https://pog-dev-prometheus.cloudzcp.io/api/v1/query_range'
        , queries = {
            tx: 'rate (container_network_transmit_bytes_total{pod=~"backup-test-test10214-mariadb-master-0",interface="eth0"}[5m])',
            rx: 'rate (container_network_receive_bytes_total{pod=~"backup-test-test10214-mariadb-master-0",interface="eth0"}[5m])'
        }
        , params = {
          end: now,
          start: now - 1800,
          step: 30
        }

      let tx = this.$axios.$get(url, { params: { ...params, query: queries.tx } })
        , rx = this.$axios.$get(url, { params: { ...params, query: queries.rx } })

      Promise.all([ tx, rx ]).then(([ tx, rx ]) => {
        this.updateChart (
          { id: 'networkIOChart', exclusive: 'tx' },
          { tx, rx }
        )
      })
    },

    async fetchConnectionsChart () {
      let url = 'https://pog-dev-prometheus.cloudzcp.io/api/v1/query_range'
        , queries = {
            connections: 'max(max_over_time(mysql_global_status_threads_connected{service="backup-test-test10214-mariadb"}[15s])  or mysql_global_status_threads_connected{service="backup-test-test10214-mariadb"})',
	          maxUsedConnections: 'mysql_global_status_max_used_connections{service="backup-test-test10214-mariadb"}',
	          maxConnections: 'mysql_global_variables_max_connections{service="backup-test-test10214-mariadb"}'
        }
        , params = {
          end: now,
          start: now - 1800,
          step: 30
        }

      let connections = this.$axios.$get(url, { params: { ...params, query: queries.connections } })
        , maxUsedConnections = this.$axios.$get(url, { params: { ...params, query: queries.maxUsedConnections } })
        , maxConnections = this.$axios.$get(url, { params: { ...params, query: queries.maxConnections } })

      Promise.all([ connections, maxUsedConnections, maxConnections ])
        .then(([ connections, maxUsedConnections, maxConnections ]) => {
        this.updateChart (
          { id: 'connectionsChart', exclusive: 'connections' },
          { connections, maxUsedConnections, maxConnections }
        )
      })
    },

    async fetchThreadActivityChart () {
      let url = 'https://pog-dev-prometheus.cloudzcp.io/api/v1/query_range'
        , queries = {
          peakThreadsConnected: 'max_over_time(mysql_global_status_threads_connected{service="backup-test-test10214-mariadb"}[15s]) or max_over_time(mysql_global_status_threads_connected{service="backup-test-test10214-mariadb"}[5m])',
          peakThreadsRunning: 'max_over_time(mysql_global_status_threads_running{service="backup-test-test10214-mariadb"}[15s]) or max_over_time(mysql_global_status_threads_running{service="backup-test-test10214-mariadb"}[5m])',
          avgThreadsRunning: 'avg_over_time(mysql_global_status_threads_running{service="backup-test-test10214-mariadb"}[15s]) or avg_over_time(mysql_global_status_threads_running{service="backup-test-test10214-mariadb"}[5m])'
        }
        , params = {
          end: now,
          start: now - 1800,
          step: 30
        }

      let  avgThreadsRunning = this.$axios.$get(url, { params: { ...params, query: queries.avgThreadsRunning } })
        , peakThreadsConnected = this.$axios.$get(url, { params: { ...params, query: queries.peakThreadsConnected } })
        , peakThreadsRunning = this.$axios.$get(url, { params: { ...params, query: queries.peakThreadsRunning } })

      Promise.all([ avgThreadsRunning, peakThreadsConnected, peakThreadsRunning ])
        .then(([ avgThreadsRunning, peakThreadsConnected, peakThreadsRunning ]) => {
        this.updateChart (
          { id: 'threadActivityChart', exclusive: 'avgThreadsRunning' },
          { avgThreadsRunning, peakThreadsConnected, peakThreadsRunning }
        )
      })
    },

    async fetchTableLocksChart () {
      let url = 'https://pog-dev-prometheus.cloudzcp.io/api/v1/query_range'
        , queries = {
            tableLocksImmediate: 'rate(mysql_global_status_table_locks_immediate{service="backup-test-test10214-mariadb"}[15s]) or irate(mysql_global_status_table_locks_immediate{service="backup-test-test10214-mariadb"}[5m])',
	          tableLocksWaited: 'rate(mysql_global_status_table_locks_waited{service="backup-test-test10214-mariadb"}[15s]) or irate(mysql_global_status_table_locks_waited{service="backup-test-test10214-mariadb"}[5m])'
        }
        , params = {
          end: now,
          start: now - 1800,
          step: 30
        }

      let tableLocksImmediate = this.$axios.$get(url, { params: { ...params, query: queries.tableLocksImmediate } })
        , tableLocksWaited = this.$axios.$get(url, { params: { ...params, query: queries.tableLocksWaited } })

      Promise.all([ tableLocksImmediate, tableLocksWaited ]).then(([ tableLocksImmediate, tableLocksWaited ]) => {
        this.updateChart (
          { id: 'tableLocksChart' },
          { tableLocksImmediate, tableLocksWaited }
        )
      })
    },

    async fetchCurrentQPSChart () {
      let url = 'https://pog-dev-prometheus.cloudzcp.io/api/v1/query_range'
        , queries = {
            currentQPS: 'rate(mysql_global_status_queries{service="backup-test-test10214-mariadb"}[5m]) or irate(mysql_global_status_queries{service="backup-test-test10214-mariadb"}[5m])'
        }
        , params = {
          end: now,
          start: now - 1800,
          step: 30
        }

      let currentQPS = await this.$axios.$get(url, { params: { ...params, query: queries.currentQPS } })

      this.updateChart (
        { id: 'currentQPSChart' },
        { currentQPS }
      )
    },

    //master , slave일 경우에만 나온다.
    async fetchReplictionDelayChart () {
      let url = 'https://pog-dev-prometheus.cloudzcp.io/api/v1/query_range'
        , queries = {
          replicationDelay: 'mysql_slave_status_seconds_behind_master{master_host="backup-test-test10214-mariadb"}'
        }
        , params = {
          end: now,
          start: now - 1800,
          step: 30
        }

      let replicationDelay = await this.$axios.$get(url, { params: { ...params, query: queries.replicationDelay } })
      
      this.updateChart (
        { id: 'replictionDelayChart' },
        { replicationDelay }
      )
    },

    async fetchSlaveSqlThreadRunningChart () {
      let url = 'https://pog-dev-prometheus.cloudzcp.io/api/v1/query_range'
        //service name == master_host
        , queries = {
          slaveSqlThreadRunning: 'mysql_slave_status_slave_sql_running{master_host="backup-test-test10214-mariadb"}'
        }
        , params = {
          end: now,
          start: now - 1800,
          step: 30
        }

      let slaveSqlThreadRunning = await this.$axios.$get(url, { params: { ...params, query: queries.slaveSqlThreadRunning } })
      
      this.updateChart (
        { id: 'slaveSqlThreadRunningChart' },
        { slaveSqlThreadRunning }
      )
    },

    async fetchSlaveIOThreadRunningChart () {
      let url = 'https://pog-dev-prometheus.cloudzcp.io/api/v1/query_range'
        , queries = {
          slaveIOThreadRunning: 'mysql_slave_status_slave_io_running{master_host="backup-test-test10214-mariadb"}'
        }
        , params = {
          end: now,
          start: now - 1800,
          step: 30
        }

      let slaveIOThreadRunning = await this.$axios.$get(url, { params: { ...params, query: queries.slaveIOThreadRunning } })
      
      this.updateChart (
        { id: 'slaveIOThreadRunningChart' },
        { slaveIOThreadRunning }
      )
    },

    /**
     * Fetch the detail data and toggleing its items
     */
    fetchDetails (namespace) {
      //Fetch data
      let url = `http://localhost:3005/${namespace}`
      this.$axios.$get(url, {}).then(res => {
        if (!res) return this._toast_err('error: fetchDetails')
        //Parse data
        res = this.parseTableDetails(res)
        this.table_fields = res.table_fields
        this.table_items = res.table_items.map((item, id) => {
          return { ...item, id }
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
      let url = 'http://localhost:3003/dbservers'
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
        this.fetchDetails(this.namespace)
      } else if (2 === value) {
        this.fetchConfiguration()
      } 
    }
  }
}
</script>

<style>
.chart-wrap {float:left;width:32%;padding:0.2%;margin:0 0 30px}
</style>