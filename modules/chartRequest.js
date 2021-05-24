export default class ChartRequest {
  constructor(args) {
    this.requests = args
  }
  set requests(args) {
    if (!args || typeof args != 'object') return
    Object.entries(args).forEach(([key, value]) => {
      this[key] = value
    })
  }
  get name_datastore() {
    return `${this.name}-${this.datastore}` 
  }
  get cpuUsageChart() {
    let queries = {
      mariadb: {
        current: `sum by (pod)(rate(container_cpu_usage_seconds_total{pod=~"${this.name_datastore}-.*",container="${this.datastore}"}[1m]))`,
        request: `kube_pod_container_resource_requests_cpu_cores{pod=~"${this.name_datastore}-.*",container="${this.datastore}"}`,
        limit: `kube_pod_container_resource_limits_cpu_cores{pod=~"${this.name_datastore}-.*",container="${this.datastore}"}`,
      },
      mongodb: {
        current: `sum by (pod)(rate(container_cpu_usage_seconds_total{pod=~"${this.name_datastore}-.*",container="${this.datastore}"}[1m]))`,
        request: `kube_pod_container_resource_requests_cpu_cores{pod=~"${this.name_datastore}-.*",container="${this.datastore}"}`,
        limit: `kube_pod_container_resource_limits_cpu_cores{pod=~"${this.name_datastore}-.*",container="${this.datastore}"}`
      },
      redis: {
        current: `sum by (pod)(rate(container_cpu_usage_seconds_total{container="${this.name_datastore}"}[2m]))`,
        request: `kube_pod_container_resource_requests_cpu_cores{container="${this.name_datastore}"}`,
        limit: `kube_pod_container_resource_limits_cpu_cores{container="${this.name_datastore}"}`
      }
    }
    //queries = /(redis|mongodb)/gi.test(this.datastore) ? queries[this.datastore] : queries.others
    queries = queries[this.datastore]
    return { queries, exclusive: 'current' }
  }
  get memoryUsageChart() {
    let queries = {
      mariadb: {
        current: `avg by(pod) (container_memory_rss{pod=~"${this.name_datastore}-.*",container="${this.datastore}"})`,
        request: `kube_pod_container_resource_requests_memory_bytes{pod=~"${this.name_datastore}-.*",container="${this.datastore}"}`,
        limit: `kube_pod_container_resource_limits_memory_bytes{pod=~"${this.name_datastore}-.*",container="${this.datastore}"}`
      },
      mongodb: {
        current: `avg by (pod)(container_memory_rss{pod=~"${this.name_datastore}-.*",container="${this.datastore}"})`,
        request: `kube_pod_container_resource_requests_memory_bytes{pod=~"${this.name_datastore}-.*",container="${this.datastore}"}`,
        limit: `kube_pod_container_resource_limits_memory_bytes{pod=~"${this.name_datastore}-.*",container="${this.datastore}"}`,
        virtual: `mongodb_memory{namespace="${this.namespace}" , release=~"${this.name}",type=~"virtual"}`,
        resident: `mongodb_memory{namespace="${this.namespace}" , release=~"${this.name}",type=~"resident"}`
      },
      redis: {
        used: `redis_memory_used_bytes{alias="${this.name_datastore}"}`,
        max: `redis_config_maxmemory{alias="${this.name_datastore}"}`
      }
    }
    queries = queries[this.datastore]
    return { queries, exclusive: 'current' }
  }
  get networkIOChart() {
    return {
      queries: {
        tx: `rate (container_network_transmit_bytes_total{pod=~"${this.pod}",interface="eth0"}[5m])`,
        rx: `rate (container_network_receive_bytes_total{pod=~"${this.pod}",interface="eth0"}[5m])`,
      },
      exclusive: 'tx',
    }
  }
  get connectionsChart() {
    return {
      queries: {
        connections: `max(max_over_time(mysql_global_status_threads_connected{service="${this.service}"}[15s])  or mysql_global_status_threads_connected{service="${this.service}"})`,
        maxUsedConnections: `mysql_global_status_max_used_connections{service="${this.service}"}`,
        maxConnections: `mysql_global_variables_max_connections{service="${this.service}"}`,
      },
      exclusive: 'connections',
    }
  }
  get threadActivityChart() {
    return {
      queries: {
        peakThreadsConnected: `max_over_time(mysql_global_status_threads_connected{service="${this.service}"}[15s]) or max_over_time(mysql_global_status_threads_connected{service="${this.service}"}[5m])`,
        peakThreadsRunning: `max_over_time(mysql_global_status_threads_running{service="${this.service}"}[15s]) or max_over_time(mysql_global_status_threads_running{service="${this.service}"}[5m])`,
        avgThreadsRunning: `avg_over_time(mysql_global_status_threads_running{service="${this.service}"}[15s]) or avg_over_time(mysql_global_status_threads_running{service="${this.service}"}[5m])`,
      },
      exclusive: 'avgThreadsRunning',
    }
  }
  get tableLocksChart() {
    return {
      queries: {
        tableLocksImmediate: `rate(mysql_global_status_table_locks_immediate{service="${this.service}"}[15s]) or irate(mysql_global_status_table_locks_immediate{service="${this.service}"}[5m])`,
        tableLocksWaited: `rate(mysql_global_status_table_locks_waited{service="${this.service}"}[15s]) or irate(mysql_global_status_table_locks_waited{service="${this.service}"}[5m])`,
      },
    }
  }
  get currentQPSChart() {
    return {
      queries: {
        currentQPS: `rate(mysql_global_status_queries{service="${this.service}"}[5m]) or irate(mysql_global_status_queries{service="${this.service}"}[5m])`,
      },
    }
  }
  get replictionDelayChart() {
    return {
      queries: {
        replicationDelay: `mysql_slave_status_seconds_behind_master{master_host="${this.service}"}`,
      },
    }
  }
  get slaveSqlThreadRunningChart() {
    return {
      queries: {
        slaveSqlThreadRunning: `mysql_slave_status_slave_sql_running{master_host="${this.service}"}`,
      },
    }
  }
  get slaveIOThreadRunningChart() {
    return {
      queries: {
        slaveIOThreadRunning: `mysql_slave_status_slave_io_running{master_host="${this.service}"}`,
      },
    }
  }
  getRequests(id) {
    let now = Math.floor(new Date().getTime() / 1000)
    let url = `${this.server}/api/v1/query_range`,
      params = {
        end: now,
        start: now - this.period,
        step: this.step,
      },
      chart = this[id]
    return {
      url,
      params,
      chart,
    }
  }
}