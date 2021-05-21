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
          max: function (max) {
            if (max > 0.09) {
              return max + 0.1
            } else if (max > 0.009) {
              return max + 0.01
            } else if (max > 0.0009) {
              return max + 0.001
            }
            return max + 1
          },
          labels: {
            formatter: function (value, index) {
              if (value > 0.09) {
                return value.toFixed(1)
              } else if (value > 0.009) {
                return value.toFixed(2)
              } else if (value > 0.0009) {
                return value.toFixed(3)
              } else if (value > 0.009) {
                return value.toFixed(4)
              } else if (value >= 0) {
                return value.toFixed(0)
              }
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
              return `${(value / 1024).toFixed(1)}KBps`
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
            return value.toFixed()
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
            return value.toFixed()
          }
        },
      },
    }
  }
  getCharts(ids) {
    let charts = {}
    if (!Array.isArray(ids) || !ids.length) return charts
    for (let id of ids) {
      charts[id] = { ...this['_' + id] }
    }
    return charts
  }
}
