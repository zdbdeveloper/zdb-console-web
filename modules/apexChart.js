import ChartRequest from '~/modules/chartRequest'
export class ApexChart extends ChartRequest {
  options = {
    xaxis: {
      type: 'datetime',
      categories: [],
      labels: {
        formatter: function (value) {
          let date = new Date(value * 1000),
            hours = date.getHours(),
            minutes = ('0' + date.getMinutes()).substr(-2),
            seconds = ('0' + date.getSeconds()).substr(-2)
          return `${hours}:${minutes}:${seconds}`
        }
      },
      tickAmount: 8,
      tickPlacement: 'between',
      position:'bottom'
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    stroke: {
      width: 1,
      curve: 'smooth',
    },
    legend: {
      height: 50,
      horizontalAlign: 'left',
      show: true,
      showForSingleSeries: true,
      showForNullSeries: true,
      showForZeroSeries: true,
    },
    noData: { text: 'No Data', align: 'center', verticalAlign: 'top' }
  }
  get _cpuUsageChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'cpuUsageChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'CPU Usage',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 4,
          tickAmount: 4,
          min: 0,
          max: function (max) {
            // if (max > 0.09) {
            //   return max + 0.1
            // } else if (max > 0.009) {
            //   return max + 0.01
            // } else if (max > 0.0009) {
            //   return max + 0.001
            // }
            // return max + 1
            return max * 1.1 < 100 ? max * 1.1 : max
          },
          labels: {
            formatter: function (value, index) {
              // if (value > 0.09) {
              //   return value.toFixed(1)
              // } else if (value > 0.009) {
              //   return value.toFixed(2)
              // } else if (value > 0.0009) {
              //   return value.toFixed(3)
              // } else if (value > 0.009) {
              //   return value.toFixed(4)
              // } else if (value >= 0) {
              //   return value.toFixed(0)
              // }
              let digit = Number(value).toFixed(4)
                , idx = digit.indexOf(digit.replace(/[^1-9]/g, '')) || 1
              return value.toFixed(idx)
            },
          },
        }        
      }
    }
  }
  get _memoryUsageChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'memoryUsageChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'Memory Usage',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 3,
          tickAmount: 4,
          min: 0,
          max: 1073741824,
          labels: {
            formatter: function (value) {
              return `${value / (1024 * 1024)} MB`
            },
          },
        },
      },
    }
  }
  get _networkIOChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'networkIOChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'Network I/O',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 6,
          labels: {
            formatter: function (value) {
              return `${(value / 1024).toFixed(1)} KBps`
            },
          },
        },
      },
    }
  }
  get _connectionsChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'connectionsChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'Connections',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 4,
          labels: {
            formatter: function (value) {
              return `${(value / 1024).toFixed(1)}KBps`
            },
          },
        },
      },
    }
  }
  get _threadActivityChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'threadActivityChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'Thread Activity',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 5,
          labels: {
            formatter: function (value) {
              let re = Number(value).toFixed(3)
              if (Number(value) == 0) {
                re = Number(value).toFixed(0)
              } else if (Number(value) > 10) {
                re = Number(value).toFixed(0)
              } else if (Number(value) > 0.9) {
                re = Number(value).toFixed(1)
              } else if (Number(value) > 0.1) {
                re = Number(value).toFixed(2)
              }
              return re
            },
          },
        },
      },
    }
  }
  get _tableLocksChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'tableLocksChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'Table Locks',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 5,
          min: 0,
          max: function(max) {
           return max <= 0 ? max + 1 : max
          },						
          labels: {
            formatter: function(value, index) {
              let re = Number(value).toFixed(2)
              if(Number(value) == 0  ){							    		  
                re = Number(value).toFixed(0)
              } else if(Number(value) > 10  ){
                re = Number(value).toFixed(0)
              }
              return re
            }
          },
        },
      },
    }
  }
  get _currentQPSChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'currentQPSChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'Current QPS',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 1,
          tickAmount: 4,
          min: 0
        },
      },
    }
  }
  get _replictionDelayChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'replictionDelayChart',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Repliction Delay',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 4,
          min: 0,
          max: function (max) {
            return max <= 0 ? max + 1 : max
          },
          labels: {
            formatter: function (value) {
              let re = Number(value).toFixed(1)
              if (Number(value) <= 0) {
                re = Number(value).toFixed(0)
              }
              return re
            },
          },
        },
      },
    }
  }
  get _slaveSqlThreadRunningChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'slaveSqlThreadRunningChart',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Slave Sql Thread Running',
          align: 'left',
        },
        yaxis: {
          min: 0,
          max: function (value) {
            return Number(value).toFixed()
          }
        },
      },
    }
  }
  get _slaveIOThreadRunningChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'slaveIOThreadRunningChart',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Slave IO Thread Running',
          align: 'left',
        },
        yaxis: {
          min: 0,
          max: function (value) {
            return Number(value).toFixed()
          }
        },
      },
    }
  }
  get _memberHealthChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'memberHealthChart',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Member Health',
          align: 'left',
        },
        yaxis: {
          min: 0,
          max: function (value) {
            return Number(value).toFixed()
          }
        },
      },
    }
  }
  get _queryOperationsChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'queryOperationsChart',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Query Operations',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 4,
          labels: {
            formatter: function (value) {
              return `${value.toFixed(2)}ops`
            },
          },
        },
      },
    }
  }
  get _cacheChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'cacheChart',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Cache',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 4,
          labels: {
            formatter: function (value) {
              return `${value.toFixed()}`
            },
          },
        },
      },
    }
  }
  get _ticketChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'ticketChart',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Ticket',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 4,
          labels: {
            formatter: function (value) {
              return `${value.toFixed()}`
            },
          },
        },
      },
    }
  }
  get _cursorChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'cursorChart',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Cursor',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 1,
          tickAmount: 5,
          max: function(max) {
            return max + 0.5
          },
          labels: {
            formatter: function (value) {
              return `${value}`
            },
          },
        },
      },
    }
  }
  get _queueChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'queueChart',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Queue',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 4,
          min: 0,
          max: function(value) {
            return value <= 0 ? 4 : Math.floor(value + 1)
          },
          labels: {
            formatter: function (value) {
              return `${value}`
            },
          },
        },
      },
    }
  }
  get _totalItemPerDBChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'totalItemPerDBChart',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Total Items per DB',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 5,
          min: 0,
          max: 10,
          labels: {
            formatter: function (value) {
              return `${value}`
            },
          },
        },
      },
    }
  }
  get _expiringNotExpiringKeysChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'expiringNotExpiringKeysChart',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Expiring vs Not Expiring Keys',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 4,
          min: 0,
          max: 1,
          labels: {
            formatter: function (value) {
              return `${value}`
            },
          },
        },
      },
    }
  }
  get _expiredEvictedChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'expiredEvictedChart',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Expired/Evicted',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 4,
          min: 0,
          max: 1,
          labels: {
            formatter: function (value) {
              return `${value}`
            },
          },
        },
      },
    }
  }
  get _commandExecutedChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'commandExecutedChart',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Commands Executed/sec',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 5,
          min: 0,
          max: 10,
          labels: {
            formatter: function (value) {
              return `${value.toFixed(2)}`
            },
          },
        },
      },
    }
  }
  get _hitsMissesPerSecChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'hitsMissesPerSecChart',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Hits/Misses per Sec',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 4,
          min: 0,
          max: 1,
          labels: {
            formatter: function (value) {
              return `${value.toFixed(2)}`
            },
          },
        },
      },
    }
  }
  get _commandCallsSecChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'commandCallsSecChart',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Command Calls/sec',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 4,
          min: 0,
          max: 1,
          labels: {
            formatter: function (value) {
              return `${value.toFixed(1)}`
            },
          },
        },
      },
    }
  }
  get _messageReadyConsumersChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'messageReadyConsumersChart',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Messages ready to be delivered to consumers',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 3,
          min: 0,
          max: function(value) {
            return value < 3 ? 3 : value + 1
          },
          labels: {
            formatter: function (value) {
              return `${value.toFixed()}`
            },
          },
        },
      },
    }
  }
  get _messagePendingConsumerAcknowledgementChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'messagePendingConsumerAcknowledgementChart',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Messages pending consumer acknowledgement',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 3,
          min: 0,
          max: function(value) {
            return value < 3 ? 3 : value + 1
          },
          labels: {
            formatter: function (value) {
              return `${value.toFixed()}`
            },
          },
        },
      },
    }
  }
  get _totalQueues() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'totalQueues',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Total queues',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 3,
          min: 0,
          max: function(value) {
            return value < 3 ? 3 : value + 1
          },
          labels: {
            formatter: function (value) {
              return `${value.toFixed()}`
            },
          },
        },
      },
    }
  }
  get _totalChannels() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'totalChannels',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Total channels',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 3,
          min: 0,
          max: function(value) {
            return value < 3 ? 3 : value + 1
          },
          labels: {
            formatter: function (value) {
              return `${value.toFixed()}`
            },
          },
        },
      },
    }
  }
  get _totalConnections() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'totalConnections',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Total connections',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 3,
          min: 0,
          max: function(value) {
            return value < 3 ? 3 : value + 1
          },
          labels: {
            formatter: function (value) {
              return `${value.toFixed()}`
            },
          },
        },
      },
    }
  }
  get _topics() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'topics',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Topics',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 5,
          min: 0,
          max: function(value) {
            return value < 1 ? 1 : value + 1
          },
          labels: {
            formatter: function (value) {
              return `${value.toFixed(1)}`
            },
          },
        },
      },
    }
  }
  get _replicas() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'replicas',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Replicas',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 5,
          min: 0,
          max: function(value) {
            return value < 1 ? 1 : value + 1
          },
          labels: {
            formatter: function (value) {
              return `${value.toFixed(1)}`
            },
          },
        },
      },
    }
  }
  get _partitions() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'partitions',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Partitions',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 5,
          min: 0,
          max: function(value) {
            return value < 1 ? 1 : value + 1
          },
          labels: {
            formatter: function (value) {
              return `${value.toFixed(1)}`
            },
          },
        },
      },
    }
  }
  get _messagesInPerSecond() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'messagesInPerSecond',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Messages in per second',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 5,
          min: 0,
          max: function(value) {
            return value < 1 ? 1 : value + 1
          },
          labels: {
            formatter: function (value) {
              return `${value.toFixed(1)}`
            },
          },
        },
      },
    }
  }
  get _messageConsumedPerSecond() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'messageConsumedPerSecond',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Message consumed per second',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 5,
          min: 0,
          max: function(value) {
            return value < 1 ? 1 : value + 1
          },
          labels: {
            formatter: function (value) {
              return `${value.toFixed(1)}`
            },
          },
        },
      },
    }
  }
  get _lagByConsumerGroup() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'lagByConsumerGroup',
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          curve: 'smooth',
        },
        title: {
          text: 'Lag by Consumer Group',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 5,
          min: 0,
          max: function(value) {
            return value < 1 ? 1 : value + 1
          },
          labels: {
            formatter: function (value) {
              return `${value.toFixed(1)}`
            },
          },
        },
      },
    }
  }
  get _targetCharts() {
    let mariadbOptionalCharts = ('standalone' == this.architecture?.toLowerCase())
        ? [] : [ 'replictionDelayChart'
          , 'slaveSqlThreadRunningChart'
          , 'slaveIOThreadRunningChart' ]
    return {
      mariadb: [
        'cpuUsageChart'
        , 'memoryUsageChart'
        , 'networkIOChart'
        , 'connectionsChart'
        , 'threadActivityChart'
        , 'tableLocksChart'
        , 'currentQPSChart'
        , ...mariadbOptionalCharts
      ],
      mongodb: [
        'cpuUsageChart'
        , 'memoryUsageChart'
        , 'networkIOChart'
        , 'connectionsChart'
        , 'replictionDelayChart'
        , 'memberHealthChart'
        , 'queryOperationsChart'
        , 'cacheChart'
        , 'ticketChart'
        , 'cursorChart'
        , 'queueChart'
      ] ,
      redis: [
        'cpuUsageChart'
        , 'memoryUsageChart'
        , 'networkIOChart'
        , 'totalItemPerDBChart'
        , 'expiringNotExpiringKeysChart'
        , 'expiredEvictedChart'
        , 'commandExecutedChart'
        , 'hitsMissesPerSecChart'
        , 'commandCallsSecChart'
      ] ,
      rabbitmq: [
        'messageReadyConsumersChart'
        , 'messagePendingConsumerAcknowledgementChart'
        , 'totalQueues'
        , 'totalChannels'
        , 'totalConnections'
      ],
      kafka: [
        'cpuUsageChart'
        , 'memoryUsageChart'
        , 'networkIOChart'
        , 'topics'
        , 'replicas'
        , 'partitions'
        , 'messagesInPerSecond'
        , 'messageConsumedPerSecond'
        , 'lagByConsumerGroup'
      ]
    }
  }
  getCharts(targetIds) {
    let charts = {}
      , targets = this._targetCharts[this.datastore]
      , ids = targetIds && Array.isArray(targetIds)
            ? targetIds?.filter(id => targets.includes(id))
            : targets
    if (!ids) return charts
    for (let id of ids) {
      charts[id] = { ...this['_' + id] }
    }
    return charts
  }
}
