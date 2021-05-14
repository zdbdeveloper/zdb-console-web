<template>
  <div>
    <div id="monMemory" ref="memoryChart"></div>
  </div>
</template>

<script>
//Memory
let monMemoryRequests = {
  status: "success",
  data: {
    resultType: "matrix",
    result: [
      {
        metric: {
          __name__: "kube_pod_container_resource_requests_memory_bytes",
          component: "kube-state-metrics",
          container: "mariadb",
          instance: "172.30.188.213:8080",
          job: "kubernetes-monitoring-endpoints",
          kubernetes_name: "kube-state-metrics",
          kubernetes_namespace: "zcp-system",
          namespace: "backup-test",
          node: "10.178.218.166",
          pod: "backup-test-ydb1-mariadb-0"
        },
        values: [
          [1620632362, "1048576000"],
          [1620632369, "1048576000"],
          [1620632376, "1048576000"],
          [1620632383, "1048576000"],
          [1620632390, "1048576000"],
          [1620632397, "1048576000"],
          [1620632404, "1048576000"],
          [1620632411, "1048576000"],
          [1620632418, "1048576000"],
          [1620632425, "1048576000"],
          [1620632432, "1048576000"],
          [1620632439, "1048576000"],
          [1620632446, "1048576000"],
          [1620632453, "1048576000"],
          [1620632460, "1048576000"],
          [1620632467, "1048576000"],
          [1620632474, "1048576000"],
          [1620632481, "1048576000"]
        ]
      },
      {
        metric: {
          __name__: "kube_pod_container_resource_requests_memory_bytes",
          component: "kube-state-metrics",
          container: "mariadb",
          instance: "172.30.188.213:8080",
          job: "kubernetes-monitoring-endpoints",
          kubernetes_name: "kube-state-metrics",
          kubernetes_namespace: "zcp-system",
          namespace: "backup-test",
          node: "10.178.218.187",
          pod: "backup-test-test10214-mariadb-master-0"
        },
        values: [
          [1620632362, "1048576000"],
          [1620632369, "1048576000"],
          [1620632376, "1048576000"],
          [1620632383, "1048576000"],
          [1620632390, "1048576000"],
          [1620632397, "1048576000"],
          [1620632404, "1048576000"],
          [1620632411, "1048576000"],
          [1620632418, "1048576000"],
          [1620632425, "1048576000"],
          [1620632432, "1048576000"],
          [1620632439, "1048576000"],
          [1620632446, "1048576000"],
          [1620632453, "1048576000"],
          [1620632460, "1048576000"],
          [1620632467, "1048576000"],
          [1620632474, "1048576000"],
          [1620632481, "1048576000"]
        ]
      }
    ]
  }
};
let monMemoryLimits = null;
let monMemoryCurrents = {
  status: "success",
  data: {
    resultType: "matrix",
    result: [
      {
        metric: { pod: "backup-test-test10214-mariadb-master-0" },
        values: [
          [1620632362, "232689664"],
          [1620632369, "232689664"],
          [1620632376, "232689664"],
          [1620632383, "232288256"],
          [1620632390, "232288256"],
          [1620632397, "232300544"],
          [1620632404, "232300544"],
          [1620632411, "232300544"],
          [1620632418, "232337408"],
          [1620632425, "232337408"],
          [1620632432, "232415232"],
          [1620632439, "232415232"],
          [1620632446, "232448000"],
          [1620632453, "232448000"],
          [1620632460, "232448000"],
          [1620632467, "232448000"],
          [1620632474, "232448000"],
          [1620632481, "232476672"]
        ]
      },
      {
        metric: { pod: "backup-test-ydb1-mariadb-0" },
        values: [
          [1620632362, "230838272"],
          [1620632369, "230838272"],
          [1620632376, "230838272"],
          [1620632383, "230838272"],
          [1620632390, "230834176"],
          [1620632397, "230834176"],
          [1620632404, "230838272"],
          [1620632411, "230838272"],
          [1620632418, "230834176"],
          [1620632425, "230834176"],
          [1620632432, "230834176"],
          [1620632439, "230834176"],
          [1620632446, "230834176"],
          [1620632453, "230834176"],
          [1620632460, "230834176"],
          [1620632467, "230834176"],
          [1620632474, "230834176"],
          [1620632481, "230838272"]
        ]
      }
    ]
  }
};
let arrMemoryType = ["memoryCurrent", "memoryLimits", "memoryRequests"];

const memRequest =
  'kube_pod_container_resource_requests_memory_bytes{pod=~"backup-test.*",container="mariadb"}';
const memCurrent =
  'avg by(pod) (container_memory_rss{pod=~"backup-test-.*",container="mariadb"})';
export default {
  mounted: function() {
    this.getMemoryMon();
  },
  methods: {
    promQueryService(query, step) {
      console.log(query);
      const end = 1620634162; // unixtime 으로 현재시간 가져오기
      const start = end - 1800;
      const args = new URLSearchParams({
        query: query,
        start: start,
        end: end,
        step: step
      });
      const url = `https://pog-dev-prometheus.cloudzcp.io/api/v1/query_range`;
      var response = null;
      return this.$axios.$get(url, { params: args });
    },
    getMemoryMon() {
      // metrics 값 가져오기
      // Memory Usage Chart GET Data
      // use promQueryService
      //   monMemoryRequests = await this.promQueryService(memRequest, 7); // asyn 동작 필요
      this.getMemoryMonCharts();
    },
    getMemoryMonCharts: function() {
      // 그래프  그리기
      // CPU Usage Chart Rendering
      let pSeries = [];
      let pCategories = [];
      console.log(monMemoryRequests);

      // monMemoryCurrents 데이터 가공
      if (monMemoryCurrents != null) {
        if (
          monMemoryCurrents.data.result != undefined &&
          monMemoryCurrents.data.result.length > 0
        ) {
          let results = monMemoryCurrents.data.result;

          for (let r in results) {
            let result = results[r];

            if (result.values != undefined && result.values.length > 0) {
              let values = result.values;
              let pName = "Current/ " + result.metric.pod;
              let pData = [];
              for (let v in values) {
                let value = values[v];
                if (r == 0) {
                  pCategories.push(new Date(value[0] * 1000).getTime());
                }
                //let fData =  Number(value[1])/1024/1024/1024 ;
                let fData = Number(value[1]) / 1000000000;
                //let fData =  Number(value[1]) ;
                pData.push(fData);
              }
              pSeries.push({ name: pName, data: pData, type: "area" });
            }
          }
        }
      }

      // monMemoryRequests 데이터 가공
      if (monMemoryRequests != null) {
        if (
          monMemoryRequests.data.result != undefined &&
          monMemoryRequests.data.result.length > 0
        ) {
          let results = monMemoryRequests.data.result;

          for (let r in results) {
            let result = results[r];

            if (result.values != undefined && result.values.length > 0) {
              let values = result.values;
              let pName = "Requested/ " + result.metric.pod;
              let pData = [];
              for (let v in values) {
                let value = values[v];
                if (r == 0) {
                  pCategories.push(new Date(value[0] * 1000).getTime());
                }
                //let fData =  Number(value[1])/1024/1024/1024 ;
                let fData = Number(value[1]) / 1000000000;
                //let fData =  Number(value[1]) ;
                pData.push(fData);
              }
              pSeries.push({ name: pName, data: pData });
            }
          }
        }
      }

      // 그래프 설정
      let options = {
        chart: { type: "line", height: 350, zoom: { enabled: false } },
        stroke: {
          width: 1, //그래프 선 굵기 설정
          curve: "smooth" // 선의 형태 설정 (smooth , straight , stepline)
          //, lineCap : 'square'   // 선의 시작과 끝점의 설정용 옵션 (butt, square , round)
        },
        fill: {
          // 선의  색 채우기 옵션
          //colors: ['#f2f1de','#f2f1de']        // 선의 index 별 색 지정
          opacity: 0.35, // 색의 투명도 수치
          type: "solid" // 채우기 type (solid, gradient, pattern ,image)
        },
        title: {
          text: "Memory Usage",
          align: "center",
          style: { fontSize: "16px", color: "#666" }
        },
        legend: { height: 50, horizontalAlign: "left" }, // 하단 목록 style
        noData: { text: "No Data", align: "center", verticalAlign: "top" }, // nodata  일 경우 표현 처리
        series: pSeries, //charts 표현 기준 data
        xaxis: {
          type: "datetime", // X 축 표현 type (datetime / category / numeric)
          categories: pCategories, //X 축 data (categories)  입력 부분
          //   labels: {
          //     formatter: function (value, timestamp, index) {
          //       return moment(new Date(timestamp)).format("HH:mm");
          //     },
          //   },
          tickAmount: 3, //표현하려는 갯수 (type 이 datetime 일 때만 기능 )
          tickPlacement: "between", // label 의 위치 조정 (on , between)
          position: "bottom" // x 축 표현 위치 (top /bottom )
        },
        yaxis: {
          decimalsInFloat: 3, //float 값으로 들어왔을 경우 소수점 자리수 셋팅
          tickAmount: 4, //표현하려는 갯수 (type 이 datetime 일 때만 기능 )
          min: function(min) {
            return 0;
          },
          labels: {
            // Y 축의 label format 설정
            formatter: function(val, index) {
              let re = "";
              if (Number(val) > 1) {
                re = Number(val).toFixed(1);
                re += " GB";
              } else if (Number(val) < 0.001) {
                re = Number(val) * 1000000;
                re = re.toFixed(0);
                re += " KB";
              } else {
                re = Number(val) * 1000;
                re = re.toFixed(0);
                re += " MB";
              }
              return re;
            }
          }
        }
      };

      let memoryChart = new ApexCharts(this.$refs.memoryChart, options);
      memoryChart.render();
    }
  }
};
</script>

<style></style>
