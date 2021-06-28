export default class ChartRequest {
  constructor(args) {
    this.properties = args
  }
  set properties(args) {
    if (!args || typeof args != 'object') return
    Object.entries(args).forEach(([key, value]) => {
      this[key] = value
    })
  }
  get name_datastore() {
    return `${this.name}-${this.datastore}` 
  }
  get whole() {
    return '.*'
  }
  //Requests by chart ID
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
      },
      kafka: {
        current: `sum by (pod) (rate(container_cpu_usage_seconds_total{pod=~"${this.name}-.*",container="kafka"}[1m]))`,
        request: `kube_pod_container_resource_requests_cpu_cores{pod=~"${this.name}-.*", container="kafka"}`,
        limit: `kube_pod_container_resource_limits_cpu_cores{pod=~"${this.name}-.*", container="kafka"}`,
        currentZookeeper: `sum by (pod) (rate(container_cpu_usage_seconds_total{pod=~"${this.name}-.*",container="zookeeper"}[1m]))`,
        requestZookeeper: `kube_pod_container_resource_requests_cpu_cores{pod=~"${this.name}-.*", container="zookeeper"}`,
        LimitZookeeper: `kube_pod_container_resource_limits_cpu_cores{pod=~"${this.name}-.*", container="zookeeper"}`
      },
      postgresql: {
        current: `sum by (pod)( rate(container_cpu_usage_seconds_total{pod=~"${this.name_datastore}.*", container=~"postgresql.*"}[1m]))`,
        request: `kube_pod_container_resource_requests_cpu_cores{pod=~"${this.name_datastore}.*", container=~"postgresql.*"}`,
        limit: `kube_pod_container_resource_limits_cpu_cores{pod=~"${this.name_datastore}.*", container=~"postgresql.*"}`,
      }
    }
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
        // virtual: `mongodb_memory{namespace="${this.namespace}" , release=~"${this.name}",type=~"virtual"}`,
        // resident: `mongodb_memory{namespace="${this.namespace}" , release=~"${this.name}",type=~"resident"}`
      },
      redis: {
        used: `redis_memory_used_bytes{release="${this.name}"}`,
        max: `redis_config_maxmemory{release="${this.name}"}`
      },
      kafka: {
        current: `avg by(pod) (container_memory_rss{pod=~"${this.name}-.*", container="kafka"})`,
        request: `kube_pod_container_resource_requests_memory_bytes{pod=~"${this.name}-.*", container="kafka"}`,
        limit: `kube_pod_container_resource_limits_memory_bytes{pod=~"${this.name}-.*", container="kafka"}`,
        currentZookeeper: `avg by(pod) (container_memory_rss{pod=~"${this.name}-.*", container="zookeeper"})`,
        requestZookeeper: `kube_pod_container_resource_requests_memory_bytes{pod=~"${this.name}-.*", container="zookeeper"}`,
        limitZookeeper: `kube_pod_container_resource_limits_memory_bytes{pod=~"${this.name}-.*", container="zookeeper"}`
      },
      postgresql: {
        current: `avg by(pod) (container_memory_rss{pod=~"${this.name_datastore}-.*", container="postgresql"} / 1024 / 1024)`,
        request: `kube_pod_container_resource_requests_memory_bytes{pod=~"${this.name_datastore}-.*", container="postgresql"}/ 1024 / 1024`,
        limit: `kube_pod_container_resource_limits_memory_bytes{pod=~"${this.name_datastore}-.*", container="postgresql"}/ 1024 / 1024`
      }
    }
    queries = queries[this.datastore]
    return { queries, exclusive: 'current used' }
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
        input: `rate(redis_net_input_bytes_total{release="${this.name}"}[5m])`,
        output: `rate(redis_net_output_bytes_total{release="${this.name}"}[5m])`,
      },
      kafka: {
        transmit: `rate (container_network_transmit_bytes_total{pod=~"${this.name}-.*", pod!~".*exporter.*", interface="eth0"}[5m])`,
        receive: `rate (container_network_receive_bytes_total{pod=~"${this.name}-.*", pod!~".*exporter.*", interface="eth0"}[5m])`
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get connectionsChart() {
    let queries = {
      mariadb: {
        connected: `max(max_over_time(mysql_global_status_threads_connected{service="${this.name_datastore}"}[5m]) or mysql_global_status_threads_connected{service="${this.name_datastore}"})`,
        used: `mysql_global_status_max_used_connections{service="${this.name_datastore}"}`,
        max: `mysql_global_variables_max_connections{service="${this.name_datastore}"}`
      },
      mongodb: {
        connected: `mongodb_connections{namespace="${this.namespace}" , release="${this.name}",state=~"current"}`,
        max: `mongodb_connections{namespace="${this.namespace}" , release="${this.name}",state=~"available"}`,
      }
    }
    queries = queries[this.datastore]
    return { queries, exclusive: 'connected' }
  }
  get threadActivityChart() {
    let queries = {
      mariadb: {
        connected: `max_over_time(mysql_global_status_threads_connected{service="${this.name_datastore}"}[5m])`,
        running: `max_over_time(mysql_global_status_threads_running{service="${this.name_datastore}"}[5m])`,
        avg: `avg_over_time(mysql_global_status_threads_running{service="${this.name_datastore}"}[5m])`
      },
    }
    queries = queries[this.datastore]
    return { queries, exclusive: 'connected' }
  }
  get tableLocksChart() {
    let queries = {
      mariadb: {
        immediate: `rate(mysql_global_status_table_locks_immediate{service="${this.name_datastore}"}[5m]) or irate(mysql_global_status_table_locks_immediate{service="${this.name_datastore}"}[5m])`,
        waited: `rate(mysql_global_status_table_locks_waited{service="${this.name_datastore}"}[5m]) or irate(mysql_global_status_table_locks_waited{service="${this.name_datastore}"}[5m])`,
      },
      postgresql: {
        pglock: `pg_locks_count{datname=~"${this.whole}", statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*", mode=~"${this.whole}"}`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get currentQPSChart() {
    let queries = {
      mariadb: {
        current: `rate(mysql_global_status_queries{service="${this.name_datastore}"}[5m]) or irate(mysql_global_status_queries{service="${this.name_datastore}"}[5m])`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get replicationDelayChart() {
    let queries = {
      mariadb: {
        delay: `mysql_slave_status_seconds_behind_master{master_host="${this.name_datastore}"}`,
      },
      mongodb: {
        operational: `mongodb_mongod_replset_member_operational_lag{namespace="${this.namespace}", release="${this.name}"}`,
        replication: `mongodb_mongod_replset_member_replication_lag{namespace="${this.namespace}", release="${this.name}"}`,
      },
      postgresql: {
        delay: `pgpool2_pool_nodes_replication_delay{release=~"${this.name}.*"}`,
      }
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get slaveSqlThreadRunningChart() {
    let queries = {
      mariadb: {
        running: `mysql_slave_status_slave_sql_running{master_host="${this.name_datastore}"}`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get slaveIOThreadRunningChart() {
    let queries = {
      mariadb: {
        running: `mysql_slave_status_slave_io_running{master_host="${this.name_datastore}"}`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get memberHealthChart() {
    let queries = {
      mongodb: {
        members: `avg by (release)(mongodb_mongod_replset_number_of_members{namespace="${this.namespace}", release="${this.name}"})`,
        health: `avg by (state)(mongodb_mongod_replset_member_health{namespace="${this.namespace}", release="${this.name}"})`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get queryOperationsChart() {
    let queries = {
      mongodb: {
        total: `rate(mongodb_op_counters_total{namespace="${this.namespace}",release="${this.name}"}[5m])`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get cacheChart() {
    let queries = {
      mongodb: {
        cache: `mongodb_mongod_wiredtiger_cache_bytes_total{namespace="${this.namespace}",release="${this.name}"}`,
      },
      postgresql: {
        cache: `pg_stat_database_blks_hit{statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*", datname=~"${this.whole}"} / (pg_stat_database_blks_read{statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*", datname=~"${this.whole}"} + pg_stat_database_blks_hit{statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*", datname=~"${this.whole}"})`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get ticketChart() {
    let queries = {
      mongodb: {
        read: `mongodb_mongod_wiredtiger_concurrent_transactions_total_tickets{namespace="${this.namespace}",release="${this.name}",type="read"}`,
        write: `mongodb_mongod_wiredtiger_concurrent_transactions_total_tickets{namespace="${this.namespace}",release="${this.name}",type="write"}`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get cursorChart() {
    let queries = {
      mongodb: {
        reader: `mongodb_mongod_metrics_cursor_open{namespace="${this.namespace}",release="${this.name}",state="total"}`,
        writer: `mongodb_mongod_metrics_cursor_timed_out_total{namespace="${this.namespace}",release="${this.name}"}`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get queueChart() {
    let queries = {
      mongodb: {
        queue: `mongodb_mongod_global_lock_current_queue{namespace="${this.namespace}",release="${this.name}"}`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get totalItemPerDBChart() {
    let queries = {
      redis: {
        item: `sum (redis_db_keys{release="${this.name}"}) by (db)`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get expiringNotExpiringKeysChart() {
    let queries = {
      redis: {
        expiring: `sum (redis_db_keys_expiring{release="${this.name}"})`,
        notExpiring: `sum (redis_db_keys{release="${this.name}"}) - sum (redis_db_keys_expiring{release="${this.name}"})`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get expiredEvictedChart() {
    let queries = {
      redis: {
        evicted: `sum(rate(redis_evicted_keys_total{release="${this.name}"}[5m])) by (addr)`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get commandExecutedChart() {
    let queries = {
      redis: {
        total: `rate(redis_commands_processed_total{release="${this.name}"}[5m])`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get hitsMissesPerSecChart() {
    let queries = {
      redis: {
        hits: `irate(redis_keyspace_hits_total{release="${this.name}"}[5m])`,
        misses: `irate(redis_keyspace_misses_total{release="${this.name}"}[5m])`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get commandCallsSecChart() {
    let queries = {
      redis: {
        count: `irate(redis_command_call_duration_seconds_count{release="${this.name}"} [1m])`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get messageReadyConsumersChart() {
    let queries = {
      rabbitmq: {
        item: `sum by (statefulset_kubernetes_io_pod_name)(rabbitmq_queue_messages_ready{statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*"})`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get messagePendingConsumerAcknowledgementChart() {
    let queries = {
      rabbitmq: {
        item: `sum by (statefulset_kubernetes_io_pod_name)(rabbitmq_queue_messages_ready{statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*"})`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get totalQueues () {
    let queries = {
      rabbitmq: {
        item: `rabbitmq_queues{statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*"}`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get totalChannels() {
    let queries = {
      rabbitmq: {
        item: `rabbitmq_channels{statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*"}`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get totalConnections() {
    let queries = {
      rabbitmq: {
        item: `rabbitmq_connections{statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*"}`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get topics() {
    let queries = {
      kafka: {
        count: `count(sum by(topic) (kafka_topic_partitions{service=~"${this.name}.*"}))`,
        sum: `sum(kafka_topic_partitions{service=~"${this.name}.*"})`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get replicas() {
    let queries = {
      kafka: {
        replicas: `sum(kafka_topic_partition_replicas{service=~"${this.name}.*"})`,
        syncReplicas: `sum(kafka_topic_partition_in_sync_replica{service=~"${this.name}.*"})`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get partitions() {
    let queries = {
      kafka: {
        replicated: `sum(kafka_topic_partition_under_replicated_partition{service=~"${this.name}.*"})`,
        atminisr: `sum(kafka_cluster_partition_atminisr{service=~"${this.name}.*"})`,
        underminisr: `sum(kafka_cluster_partition_underminisr{service=~"${this.name}.*"})`,
        preferred: `count(kafka_topic_partition_leader_is_preferred{service=~"${this.name}.*"}<1)`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get messagesInPerSecond() {
    let queries = {
      kafka: {
        current: `sum(rate(kafka_topic_partition_current_offset{service=~"${this.name}.*"}[1m])) by (topic)`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get messageConsumedPerSecond() {
    let queries = {
      kafka: {
        current: `sum(delta(kafka_consumergroup_current_offset{service=~"${this.name}.*"}[1m])/60) by (consumergroup, topic)`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get lagByConsumerGroup() {
    let queries = {
      kafka: {
        current: `sum(kafka_consumergroup_lag{service=~"${this.name}.*"}) by (consumergroup, topic)`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get openFileDescriptors() {
    let queries = {
      postgresql: {
        fds: `process_open_fds{statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*"}`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get pgPoolNodeStatusChart() {
    let queries = {
      postgresql: {
        status: `pgpool2_pool_nodes_status{release=~"${this.name}.*"}`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get pgPoolFrontendChart() {
    let queries = {
      postgresql: {
        total: `pgpool2_frontend_total{release=~"${this.name}.*"}`,
        used: `pgpool2_frontend_used{release=~"${this.name}.*"}`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get scrapeDurationChart() {
    let queries = {
      postgresql: {
        seconds: `pgpool2_last_scrape_duration_seconds{release=~"${this.name}.*"}`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get activeSessionsChart() {
    let queries = {
      postgresql: {
        count: `pg_stat_activity_count{datname=~"${this.whole}", statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*", state="active"}`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get transactionsChart() {
    let queries = {
      postgresql: {
        commit: `irate(pg_stat_database_xact_commit{statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*", datname=~"${this.whole}"}[5m])`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get updateDataChart() {
    let queries = {
      postgresql: {
        updated: `pg_stat_database_tup_updated{datname=~"${this.whole}", statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*"}`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get fetchDataChart() {
    let queries = {
      postgresql: {
        fetched: `pg_stat_database_tup_fetched{datname=~"${this.whole}", statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*"}`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get insertDataChart() {
    let queries = {
      postgresql: {
        inserted: `pg_stat_database_tup_inserted{datname=~"${this.whole}", statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*"}`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get returnDataChart() {
    let queries = {
      postgresql: {
        returned: `pg_stat_database_tup_returned{datname=~"${this.whole}", statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*"}`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get deleteDataChart() {
    let queries = {
      postgresql: {
        deleted: `pg_stat_database_tup_deleted{datname=~"${this.whole}", statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*"}`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get buffersChart() {
    let queries = {
      postgresql: {
        backend: `irate(pg_stat_bgwriter_buffers_backend{statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*"}[5m])`,
        alloc: `irate(pg_stat_bgwriter_buffers_alloc{statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*"}[5m])`,
        fsync: `irate(pg_stat_bgwriter_buffers_backend_fsync{statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*"}[5m])`,
        checkpoint: `irate(pg_stat_bgwriter_buffers_checkpoint{statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*"}[5m])`,
        clean: `irate(pg_stat_bgwriter_buffers_clean{statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*"}[5m])`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get conflictsDeadlocksChart() {
    let queries = {
      postgresql: {
        conflicts: `irate(pg_stat_database_conflicts{statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*", datname=~"${this.whole}"}[5m])`,
        deadlocks: `irate(pg_stat_database_deadlocks{statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*", datname=~"${this.whole}"}[5m])`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get tempFileChart() {
    let queries = {
      postgresql: {
        bytes: `irate(pg_stat_database_temp_bytes{statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*", datname=~"${this.whole}"}[5m])`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get checkpointStatsChart() {
    let queries = {
      postgresql: {
        syncTime: `irate(pg_stat_bgwriter_checkpoint_sync_time{statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*"}[5m])`,
        writeTime: `irate(pg_stat_bgwriter_checkpoint_write_time{statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*"}[5m])`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  get replicationLSNDiffChart() {
    let queries = {
      postgresql: {
        diff: `pg_stat_replication_pg_wal_lsn_diff{statefulset_kubernetes_io_pod_name=~"${this.name_datastore}.*"}`,
      },
    }
    queries = queries[this.datastore]
    return { queries }
  }
  //Call data with the chart ID
  getRequests(id) {
    let now = Math.floor(new Date().getTime() / 1000)
    let url = `${this.server}`,
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