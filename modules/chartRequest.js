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
        current: `sum by (pod)(rate(container_cpu_usage_seconds_total{container="${this.datastore}"}[2m]))`,
        request: `kube_pod_container_resource_requests_cpu_cores{container="${this.datastore}"}`,
        limit: `kube_pod_container_resource_limits_cpu_cores{container="${this.datastore}"}`
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
    let queries = {
      mariadb: {
        tx: `rate (container_network_transmit_bytes_total{pod=~"${this.name_datastore}-.*",interface="eth0"}[5m])`,
        rx: `rate (container_network_receive_bytes_total{pod=~"${this.name_datastore}-.*",interface="eth0"}[5m])`
      },
      mongodb: {
        network: `mongodb_network_bytes_total{namespace="${this.namespace}" , release=~"${this.name}"}`,
      },
      redis: {
        input: `rate(redis_net_input_bytes_total{alias="${this.name_datastore}"}[5m])`,
        output: `rate(redis_net_output_bytes_total{alias="${this.name_datastore}"}[5m])`,
      }
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get connectionsChart() {
    let queries = {
      mariadb: {
        connections: `max(max_over_time(mysql_global_status_threads_connected{service="${this.name_datastore}"}[5m]) or mysql_global_status_threads_connected{service="${this.name_datastore}"})`,
        maxUsedConnections: `mysql_global_status_max_used_connections{service="${this.name_datastore}"}`,
        maxConnections: `mysql_global_variables_max_connections{service="${this.name_datastore}"}`
      },
      mongodb: {
        connections: `mongodb_connections{namespace="${this.namespace}" , release="${this.name}",state=~"current"}`,
        maxUsedConnections: `mongodb_connections{namespace="${this.namespace}" , release="${this.name}",state=~"available"}`,
      }
    }
    queries = queries[this.datastore]
    return { queries, exclusive: 'connections' }
  }
  get threadActivityChart() {
    let queries = {
      mariadb: {
        peakThreadsConnected: `max_over_time(mysql_global_status_threads_connected{service="${this.name_datastore}"}[5m])`,
        peakThreadsRunning: `max_over_time(mysql_global_status_threads_running{service="${this.name_datastore}"}[5m])`,
        avgThreadsRunning: `avg_over_time(mysql_global_status_threads_running{service="${this.name_datastore}"}[5m])`
      },
    }
    queries = queries[this.datastore]
    return { queries, exclusive: 'peakThreadsConnected' }
  }
  get tableLocksChart() {
    let queries = {
      mariadb: {
        tableLocksImmediate: `rate(mysql_global_status_table_locks_immediate{service="${this.name_datastore}"}[5m]) or irate(mysql_global_status_table_locks_immediate{service="${this.name_datastore}"}[5m])`,
        tableLocksWaited: `rate(mysql_global_status_table_locks_waited{service="${this.name_datastore}"}[5m]) or irate(mysql_global_status_table_locks_waited{service="${this.name_datastore}"}[5m])`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get currentQPSChart() {
    let queries = {
      mariadb: {
        currentQPS: `rate(mysql_global_status_queries{service="${this.name_datastore}"}[5m]) or irate(mysql_global_status_queries{service="${this.name_datastore}"}[5m])`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get replictionDelayChart() {
    let queries = {
      mariadb: {
        replicationDelay: `mysql_slave_status_seconds_behind_master{master_host="${this.name_datastore}"}`,
      },
      mongodb: {
        operational: `mongodb_mongod_replset_member_operational_lag{namespace="${this.namespace}", release="${this.name}"}`,
        replication: `mongodb_mongod_replset_member_replication_lag{namespace="${this.namespace}", release="${this.name}"}`,
      }
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get slaveSqlThreadRunningChart() {
    let queries = {
      mariadb: {
        slaveSqlThreadRunning: `mysql_slave_status_slave_sql_running{master_host="${this.name_datastore}"}`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get slaveIOThreadRunningChart() {
    let queries = {
      mariadb: {
        slaveIOThreadRunning: `mysql_slave_status_slave_io_running{master_host="${this.name_datastore}"}`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
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