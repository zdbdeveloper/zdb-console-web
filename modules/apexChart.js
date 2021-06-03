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
      //showForSingleSeries: true,
      //showForNullSeries: true,
      //showForZeroSeries: true,
    },
    noData: { text: 'Loading...', align: 'center', verticalAlign: 'top' }
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
          max: function (value) {
            // if (value > 0.09) {
            //   return value + 0.1
            // } else if (value > 0.009) {
            //   return value + 0.01
            // } else if (value > 0.0009) {
            //   return value + 0.001
            // }
            // return value + 1
            return 0 < value ? value * 1.1 : 100
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
              value = Number(value)
              let digits = value.toFixed(4)
                , idx = digits.indexOf(digits.replace(/[^1-9]/g, ''))
              return value.toFixed(0 > idx ? 0 : idx)
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
              value = Number(value / (1024 * 1024))
              return 1024 <= value
                ? `${(value / 1024).toFixed(1)} GB`
                : `${value.toFixed()} MB`
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
          min: 0,
          labels: {
            formatter: function (value) {
              value = Number(value)
              return 1024 * 1024 * 1024 <= value
                ? `${(value / (1024 * 1024 * 1024)).toFixed(2)} GBps`
                : ( 1024 * 1024 <= value
                    ? `${(value / (1024 * 1024)).toFixed(1)} MBps`
                    : (1024 <= value
                        ? `${(value / 1024).toFixed(1)} KBps`
                        : `${value.toFixed()} Bps`) )
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
          tickAmount: 5,
          min: 0,
          max: function(value) {
            return 5 > value ? 5 : Math.floor(value + 50)
          },
          labels: {
            formatter: function (value) {
              return Math.floor(Number(value)).toFixed()
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
          min: 0,
          max: function(value) {
            return 5 > value ? 5 : Math.floor(value + 1)
          },
          labels: {
            formatter: function (value) {
              // let re = Number(value).toFixed(3)
              // if (Number(value) == 0) {
              //   re = Number(value).toFixed(0)
              // } else if (Number(value) > 10) {
              //   re = Number(value).toFixed(0)
              // } else if (Number(value) > 0.9) {
              //   re = Number(value).toFixed(1)
              // } else if (Number(value) > 0.1) {
              //   re = Number(value).toFixed(2)
              // }
              // return re
              return Math.floor(Number(value)).toFixed()
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
          max: function(value) {
            value = Number(value)
            return 0 < value ? value * 1.1 : 1
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
          min: 0,
          max: function (value) {
            return 4 > value ? 4 : value + 1
          },
          labels: {
            formatter: function (value) {
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(1)
            },
          },
        },
      },
    }
  }
  get _replicationDelayChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'replicationDelayChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'Replication Delay',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 4,
          min: 0,
          max: function (value) {
            return 4 > value ? 4 : value + 1
          },
          labels: {
            formatter: function (value) {
              // let re = Number(value).toFixed(1)
              // if (Number(value) <= 0) {
              //   re = Number(value).toFixed(0)
              // }
              // return re
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed()
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
        title: {
          text: 'Query Operations',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 4,
          min: 0,
          labels: {
            formatter: function (value) {
              value = Number(value)
              return 0 >= value ? 0 : `${value.toFixed(2)} ops`
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
        title: {
          text: 'Cache',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 4,
          min: 0,
          max: function (value) {
            value = Number(value)
            return 4 > value ? 4 : value * 1.1
          },
          labels: {
            formatter: function (value) {
              return Number(value).toFixed()
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
        title: {
          text: 'Ticket',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 4,
          min: 0,
          labels: {
            formatter: function (value) {
              return Number(value).toFixed()
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
        title: {
          text: 'Cursor',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 1,
          tickAmount: 5,
          min: 0,
          max: function(max) {
            return max + 0.5
          },
          labels: {
            formatter: function (value) {
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(1)
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
        title: {
          text: 'Queue',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 4,
          min: 0,
          max: function(value) {
            return value <= 0 ? 5 : Math.floor(value + 1)
          },
          labels: {
            formatter: function (value) {
              return Number(value).toFixed()
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
              return Number(value).toFixed()
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(2)
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(2)
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(2)
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(2)
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(1)
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
              return Number(value).toFixed()
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
              return Number(value).toFixed()
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
              return Number(value).toFixed()
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
              return Number(value).toFixed()
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(1)
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(1)
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(1)
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(1)
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(1)
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(1)
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(1)
            },
          },
        },
      },
    }
  }
  get _openFileDescriptors() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'openFileDescriptors',
          zoom: { enabled: false },
        },
        title: {
          text: 'Open File Descriptors',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 6,
          min: 0,
          max: function(value) {
            return value < 1 ? 7 : value + 3
          },
          labels: {
            formatter: function (value) {
              return Number(value).toFixed()
            },
          },
        },
      },
    }
  }
  get _pgPoolNodeStatusChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'pgPoolNodeStatusChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'PGPool Node Status',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 5,
          min: 0,
          max: function(value) {
            return value < 5 ? 5 : (50 <= value ?  value + 50 : value + 1)
          },
          labels: {
            formatter: function (value) {
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed()
            },
          },
        },
      },
    }
  }
  get _pgPoolFrontendChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'pgPoolFrontendChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'PGPool Frontend',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 6,
          min: 0,
          max: function(value) {
            return value < 5 ? 5 : (50 <= value ?  value + 50 : value + 1)
          },
          labels: {
            formatter: function (value) {
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed()
            },
          },
        },
      },
    }
  }
  get _scrapeDurationChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'scrapeDurationChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'Scrape Duration',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 5,
          min: 0,
          max: function(value) {
            return 0 < value ? value * 1.1 : 0
          },
          labels: {
            formatter: function (value) {
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(2)
            },
          },
        },
      },
    }
  }
  get _activeSessionsChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'activeSessionsChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'Active Sessions',
          align: 'left',
        },
        yaxis: {
          decimalsInFloat: 0,
          tickAmount: 4,
          min: 0,
          max: function(value) {
            return value < 4 ? 4 : value + 1
          },
          labels: {
            formatter: function (value) {
              return Number(value).toFixed()
            },
          },
        },
      },
    }
  }
  get _transactionsChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'transactionsChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'Transactions',
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(1)
            },
          },
        },
      },
    }
  }
  get _updateDataChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'updateDataChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'Update data',
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(1)
            },
          },
        },
      },
    }
  }
  get _fetchDataChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'fetchDataChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'Fetch data(SELECT)',
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed()
            },
          },
        },
      },
    }
  }
  get _insertDataChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'insertDataChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'Insert data',
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(1)
            },
          },
        },
      },
    }
  }
  get _returnDataChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'returnDataChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'Return data',
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(1)
            },
          },
        },
      },
    }
  }
  get _deleteDataChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'deleteDataChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'Delete data',
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(1)
            },
          },
        },
      },
    }
  }
  get _buffersChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'buffersChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'buffers(bgwriter)',
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(1)
            },
          },
        },
      },
    }
  }
  get _conflictsDeadlocksChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'conflictsDeadlocksChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'Conflicts/Deadlocks',
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(1)
            },
          },
        },
      },
    }
  }
  get _tempFileChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'tempFileChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'TempFile(Bytes)',
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(1)
            },
          },
        },
      },
    }
  }
  get _checkpointStatsChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'checkpointStatsChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'Checkpoint Stats',
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(1)
            },
          },
        },
      },
    }
  }
  get _replicationLSNDiffChart() {
    return {
      series: [],
      options: {
        ...this.options,
        chart: {
          id: 'replicationLSNDiffChart',
          zoom: { enabled: false },
        },
        title: {
          text: 'Replication LSN Diff',
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
              value = Number(value)
              return 0 >= value ? 0 : value.toFixed(1)
            },
          },
        },
      },
    }
  }
  get targetCharts() {
    let mariadbOptionalCharts = this.standalone
        ? [] : [ 'replicationDelayChart'
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
        , 'replicationDelayChart'
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
      ],
      postgresql: [
        'cpuUsageChart'
        , 'memoryUsageChart'
        , 'openFileDescriptors'
        , 'replicationDelayChart'
        , 'pgPoolNodeStatusChart'
        , 'pgPoolFrontendChart'
        , 'scrapeDurationChart'
        , 'activeSessionsChart'
        , 'transactionsChart'
        , 'insertDataChart'
        , 'updateDataChart'
        , 'fetchDataChart'
        , 'deleteDataChart'
        , 'tableLocksChart'
        , 'cacheChart'
        , 'buffersChart'
        , 'conflictsDeadlocksChart'
        , 'tempFileChart'
        , 'checkpointStatsChart'
        , 'replicationLSNDiffChart'
      ]
    }
  }
  getCharts(targetIds) {
    let charts = {}
      , ids = targetIds && Array.isArray(targetIds)
            ? targetIds.filter(id => this.targetCharts[this.datastore].includes(id))
            : this.targetCharts[this.datastore]
    if (!ids) return charts
    for (let id of ids) {
      charts[id] = { ...this['_' + id] }
    }
    return charts
  }
}
