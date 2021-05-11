export function getCpuUsageChart(content1, content2, content3) {
  let data1 = content1?.result.data
    , name1 = data1 ? 'Current/' + data1.result[0].metric.pod : 'TX'
    , values1 = data1 ? data1.result[0].values : []
    , categories = data1 ? data1.result[0].values.map(period => period[0]) : []  
  let data2 = content2?.result.data
    , name2 = data2 ? 'Limit/' + data2.result[0].metric.pod : 'RX'
    , values2 = data2 ? data2.result[0].values : []
  let data3 = content3?.result.data
    , name3 = data3 ? 'Requested/' + data3.result[0].metric.pod : 'RX'
    , values3 = data3 ? data3.result[0].values : []
  return {
    series: [
      {
        name: name1,
        data: values1
      },
      {
        name: name2,
        data: values2
      },
      {
        name: name3,
        data: values3
      }
    ],
    options: {
      chart: {
        stacked: false,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: 'zoom'
        }
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
        labels: { // Y 축의 label format 설정 
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
        categories: categories,
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
      noData:{ text: 'No Data', align: 'center', verticalAlign:'top' },
      legend:{ height:100, horizontalAlign: 'center' },
      // tooltip: {
      //   shared: false,
      //   y: {
      //     formatter: function (value) {
      //       return (value / 1000000).toFixed(0)
      //     }
      //   }
      // }
    },
    events: {
      mounted: function(chartContext, config) {
        console.log(`chart mounted: ${chartContext}`)
      }
    }
  }
}

export function getMemoryUsageChart(content) {
  let data = content?.result.data
    , name = data ? data.result[0].metric.pod : 'Memory Usage'
    , values = data ? data.result[0].values : []
    , categories = data ? data.result[0].values.map(period => period[0]) : []
  return {
    series: [{
      name: name,
      data: values
    }],
    options: {
      chart: {
        stacked: false,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: 'zoom'
        }
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
        categories: categories,
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
      noData:{ text: 'No Data', align: 'center', verticalAlign:'top' },
      legend:{ height:100, horizontalAlign: 'left' }
    }
  }
}

export function getNetworkIOChart(content1, content2) {
  let data1 = content1?.result.data
    , name1 = data1 ? 'TX/' + data1.result[0].metric.pod : 'TX'
    , values1 = data1 ? data1.result[0].values : []
    , categories = data1 ? data1.result[0].values.map(period => period[0]) : []  
  let data2 = content2?.result.data
    , name2 = data2 ? 'RX/' + data2.result[0].metric.pod : 'RX'
    , values2 = data2 ? data2.result[0].values : []
  return {
    series: [
      {
        name: name1,
        data: values1
      },
      {
        name: name2,
        data: values2
      }
    ],
    options: {
      chart: {
        //height: 350,
        //type: 'area'
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
        categories: categories,
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
    noData:{ text: 'No Data', align: 'center', verticalAlign:'top' },
    legend:{ height:100, horizontalAlign: 'left' }
  }
}