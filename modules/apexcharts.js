export function getCpuUsageChart() {
  return {
    series: [],
    options: {
      chart: {
        id: 'cpuUsageChart',
        // stacked: false,
        // zoom: {
        //   type: 'x',
        //   enabled: true,
        //   autoScaleYaxis: true
        // },
        // toolbar: {
        //   autoSelected: 'zoom'
        // }
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0,
      },
      title: {
        text: 'CPU Usage',
        align: 'left'
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        },
      },
      yaxis: {
        decimalsInFloat: 4,
        tickAmount: 4,
        min: 0,
        max: function(max) {
          //console.log(`max: ${max}`)
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
          formatter: function(value, index) {
            if (value > 0.09) {
              return value.toFixed(1);
            } else if (value > 0.009) {
              return value.toFixed(2);
            } else if (value > 0.0009) {
              return value.toFixed(3);
            } else if (value > 0.009) {
              return value.toFixed(4);
            } else if (value >= 0) {
              return value.toFixed(0);
            }
          }
        }
      },
      xaxis: {
        type: 'datetime', //(datetime, category, numeric)
        categories: [],
        labels: {
          formatter: function(value) {
            //console.log(`value: ${value}`)
            let date = new Date(value * 1000)
                , hours = date.getHours()
                , minutes = ('0' + date.getMinutes()).substr(-2)
                , seconds = ('0' + date.getSeconds()).substr(-2)
            return `${hours}:${minutes}:${seconds}`
          },
        },
        tickAmount: 8,
        //tickPlacement: 'between',  //(on, between)
        //position:'bottom'  //(top, bottom )
      },
      noData:{ text: 'Loading...', align: 'center', verticalAlign:'top' },
      legend:{ height:100, horizontalAlign: 'center', show: true, showForSingleSeries: true, showForNullSeries: true, showForZeroSeries: true }
      // tooltip: {
      //   shared: false,
      //   y: {
      //     formatter: function (value) {
      //       return (value / 1000000).toFixed(0)
      //     }
      //   }
      // }
    },
    // events: {
    //   mounted: function(chartContext, config) {
    //     console.log(`chart mounted: ${chartContext}`)
    //   }
    // }
  }
}

export function getMemoryUsageChart() {
  return {
    series: [],
    options: {
      chart: {
        id: 'memoryUsageChart'
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0,
      },
      title: {
        text: 'Memory Usage',
        align: 'left'
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        },
      },
      yaxis: {
        decimalsInFloat: 4,
        tickAmount: 4,
        min: 0,
        max: 1073741824, 
        labels: {
          formatter: function(value) {
            return `${value / (1024 * 1024)} MB`;
          }
        }
      },
      xaxis: {
        type: 'datetime',
        categories: [],
        labels: {
          formatter: function(value) {
            let date = new Date(value * 1000)
                , hours = date.getHours()
                , minutes = ('0' + date.getMinutes()).substr(-2)
                , seconds = ('0' + date.getSeconds()).substr(-2)
            return `${hours}:${minutes}:${seconds}`
          },
        },
        tickAmount: 8,
      },
      noData:{ text: 'Loading...', align: 'center', verticalAlign:'top' },
      legend:{ height:100, horizontalAlign: 'center', show: true, showForSingleSeries: true, showForNullSeries: true, showForZeroSeries: true }
    }
  }
}

export function getNetworkIOChart() {
  return {
    series: [],
    options: {
      chart: {
        id: 'networkIOChart'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'Network I/O',
        align: 'left'
      },
      yaxis: {
        labels: {
          formatter: function(value) {
            return `${(value / 1024).toFixed(1)}KBps`;
          }
        }
      },
      xaxis: {
        type: 'datetime',
        categories: [],
        labels: {
          formatter: function(value) {
            let date = new Date(value * 1000)
                , hours = date.getHours()
                , minutes = ('0' + date.getMinutes()).substr(-2)
                , seconds = ('0' + date.getSeconds()).substr(-2)
            return `${hours}:${minutes}:${seconds}`
          },
        }
        , tickAmount: 8
      },
    },
    noData:{ text: 'Loading...', align: 'center', verticalAlign:'top' },
    legend:{ height:100, horizontalAlign: 'center', show: true, showForSingleSeries: true, showForNullSeries: true, showForZeroSeries: true }
  }  
}

export function getConnectionsChart() {
  return {
    series: [],
    options: {
      chart: {
        id: 'connectionsChart'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'Connections',
        align: 'left'
      },
      yaxis: {
        labels: {
          formatter: function(value) {
            return `${(value / 1024).toFixed(1)}KBps`;
          }
        }
      },
      xaxis: {
        type: 'datetime',
        categories: [],
        labels: {
          formatter: function(value) {
            let date = new Date(value * 1000)
                , hours = date.getHours()
                , minutes = ('0' + date.getMinutes()).substr(-2)
                , seconds = ('0' + date.getSeconds()).substr(-2)
            return `${hours}:${minutes}:${seconds}`
          },
        }
        , tickAmount: 8
      },
    },
    noData:{ text: 'Loading...', align: 'center', verticalAlign:'top' },
    legend:{ height:100, horizontalAlign: 'center', show: true, showForSingleSeries: true, showForNullSeries: true, showForZeroSeries: true }
  }  
}

export function getThreadActivityChart(contents) {
  return {
    series: [],
    options: {
      chart: {
        id: 'threadActivityChart'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'Thread Activity',
        align: 'left'
      },
      yaxis: {
        labels: {
          formatter: function(value) {
            let re = Number(value).toFixed(3)
            if(Number(value) == 0  ){							    		  
                re = Number(value).toFixed(0) ;	
            }else if(Number(value) > 10  ){
              re = Number(value).toFixed(0) ;
            }else if(Number(value) > 0.9  ){
              re = Number(value).toFixed(1) ;		
            }else if(Number(value) > 0.1  ){
              re = Number(value).toFixed(2) ;								    		  
            }
            return re; 
          }
        }
      },
      xaxis: {
        type: 'datetime',
        categories: [],
        labels: {
          formatter: function(value) {
            let date = new Date(value * 1000)
                , hours = date.getHours()
                , minutes = ('0' + date.getMinutes()).substr(-2)
                , seconds = ('0' + date.getSeconds()).substr(-2)
            return `${hours}:${minutes}:${seconds}`
          },
        }
        , tickAmount: 8
      },
    },
    noData:{ text: 'Loading...', align: 'center', verticalAlign:'top' },
    legend:{ height:100, horizontalAlign: 'center', show: true, showForSingleSeries: true, showForNullSeries: true, showForZeroSeries: true }
  }  
}

export function getTableLocksChart() {
  return {
    series: [],
    options: {
      chart: {
        id: 'tableLocksChart'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'Table Locks',
        align: 'left'
      },
      yaxis: {
        labels: {
          formatter: function(value) {
            let re = Number(value).toFixed(3)
            if(Number(value) == 0  ){							    		  
                re = Number(value).toFixed(0) ;	
            }else if(Number(value) > 10  ){
              re = Number(value).toFixed(0) ;
            }else if(Number(value) > 0.9  ){
              re = Number(value).toFixed(1) ;		
            }else if(Number(value) > 0.1  ){
              re = Number(value).toFixed(2) ;								    		  
            }
            return re; 
          }
        }
      },
      xaxis: {
        type: 'datetime',
        categories: [],
        labels: {
          formatter: function(value) {
            let date = new Date(value * 1000)
                , hours = date.getHours()
                , minutes = ('0' + date.getMinutes()).substr(-2)
                , seconds = ('0' + date.getSeconds()).substr(-2)
            return `${hours}:${minutes}:${seconds}`
          },
        }
        , tickAmount: 8
      },
    },
    noData:{ text: 'Loading...', align: 'center', verticalAlign:'top' },
    legend:{ height:100, horizontalAlign: 'center', show: true, showForSingleSeries: true, showForNullSeries: true, showForZeroSeries: true }
  }  
}

export function getCurrentQPSChart() {
  return {
    series: [],
    options: {
      chart: {
        id: 'currentQPSChart'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'Current QPS',
        align: 'left'
      },
      yaxis: {
        labels: {
          formatter: function(value) {
            let re = Number(value).toFixed(3)
            if(Number(value) == 0  ){							    		  
                re = Number(value).toFixed(0) ;	
            }else if(Number(value) > 10  ){
              re = Number(value).toFixed(0) ;
            }else if(Number(value) > 0.9  ){
              re = Number(value).toFixed(1) ;		
            }else if(Number(value) > 0.1  ){
              re = Number(value).toFixed(2) ;								    		  
            }
            return re; 
          }
        }
      },
      xaxis: {
        type: 'datetime',
        categories: [],
        labels: {
          formatter: function(value) {
            let date = new Date(value * 1000)
                , hours = date.getHours()
                , minutes = ('0' + date.getMinutes()).substr(-2)
                , seconds = ('0' + date.getSeconds()).substr(-2)
            return `${hours}:${minutes}:${seconds}`
          },
        }
        , tickAmount: 8
      },
    },
    noData:{ text: 'Loading...', align: 'center', verticalAlign:'top' },
    legend:{ height:100, horizontalAlign: 'center', show: true, showForSingleSeries: true, showForNullSeries: true, showForZeroSeries: true }
  }  
}

export function getReplictionDelayChart() {
  return {
    series: [],
    options: {
      chart: {
        id: 'replictionDelayChart'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'Repliction Delay',
        align: 'left'
      },
      yaxis: {
        decimalsInFloat: 0,
        tickAmount: 4,
        min: 0,
        max: function(max) {
          return max <= 0 ? max + 1 : max
        },
        labels: {
          formatter: function(value) {
            let re = Number(value).toFixed(1)
            if(Number(value) == 0) {							    		  
                re = Number(value).toFixed(0) ;
            }
            return re; 
          }
        }
      },
      xaxis: {
        type: 'datetime',
        categories: [],
        labels: {
          formatter: function(value) {
            let date = new Date(value * 1000)
                , hours = date.getHours()
                , minutes = ('0' + date.getMinutes()).substr(-2)
                , seconds = ('0' + date.getSeconds()).substr(-2)
            return `${hours}:${minutes}:${seconds}`
          },
        }
        , tickAmount: 8
      },
    },
    noData:{ text: 'Loading...', align: 'center', verticalAlign:'top' },
    legend:{ height:100, horizontalAlign: 'center', show: true, showForSingleSeries: true, showForNullSeries: true, showForZeroSeries: true }
  }  
}

export function getSlaveSqlThreadRunningChart() {
  return {
    series: [],
    options: {
      chart: {
        id: 'slaveSqlThreadRunningChart'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'Slave Sql Thread Running',
        align: 'left'
      },
      yaxis: {
        //decimalsInFloat: 4,
        //tickAmount: 3,
        min: 0,
        max: function(value) {
          return value.toFixed()
        }
      },
      xaxis: {
        type: 'datetime',
        categories: [],
        labels: {
          formatter: function(value) {
            let date = new Date(value * 1000)
                , hours = date.getHours()
                , minutes = ('0' + date.getMinutes()).substr(-2)
                , seconds = ('0' + date.getSeconds()).substr(-2)
            return `${hours}:${minutes}:${seconds}`
          },
        }
        , tickAmount: 8
      },
    },
    noData:{ text: 'Loading...', align: 'center', verticalAlign:'top' },
    legend:{ height:100, horizontalAlign: 'center', show: true, showForSingleSeries: true, showForNullSeries: true, showForZeroSeries: true }
  }  
}

export function getSlaveIOThreadRunningChart() {
  return {
    series: [],
    options: {
      chart: {
        id: 'slaveIOThreadRunningChart'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'Slave IO Thread Running',
        align: 'left'
      },
      yaxis: {
        min: 0,
        max: function(value) {
          return value.toFixed()
        }
      },
      xaxis: {
        type: 'datetime',
        categories: [],
        labels: {
          formatter: function(value) {
            let date = new Date(value * 1000)
                , hours = date.getHours()
                , minutes = ('0' + date.getMinutes()).substr(-2)
                , seconds = ('0' + date.getSeconds()).substr(-2)
            return `${hours}:${minutes}:${seconds}`
          },
        }
        , tickAmount: 8
      },
    },
    noData:{ text: 'Loading...', align: 'center', verticalAlign:'top' },
    legend:{ height:100, horizontalAlign: 'center', show: true, showForSingleSeries: true, showForNullSeries: true, showForZeroSeries: true }
  }  
}