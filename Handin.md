GIT
===
## Account
zdbdeveloper@gmail.com
Cloudzdb!23$

```bash
// Credential
$ git config --global user.email "zdbdeveloper@gmail.com"
$ git config --global user.name "zdbdeveloper"

// Toggle Remote
$ git remote set-url origin https://github.com/zdbdeveloper/zdb-console-web.git
$ git remote set-url origin https://github.com/cnpst/zdb-console-web.git
```



KUBERNETES
==========
```bash
$ kubectl version
$ kubectl cluster-info

// Config
$ set KUBECONFIG=c:\kubeconfig\cloudzcp-pog-dev.yml || $ set KUBECONFIG=c:\kubeconfig\cloudzcp-eks-dev.yml

// My targets
$ kubectl get ns/ pods/ services
$ kubectl -n zdb-managed get dsr
$ kubectl -n zdb-managed get zdb

// Table list
$ kubectl get dsr -A -o json --kubeconfig=\kubeconfig\cloudzcp-pog-dev.yml

// Table detail
$ kubectl get zdbs -A -o json --kubeconfig=\kubeconfig\cloudzcp-pog-dev.yml

// Specific table detail
$ kubectl -n zdb-managed get ZDB zdb-managed-dsr-mdb-mongodb-0 -o json

// API server port forward
set KUBECONFIG=C:\kubeconfig\kube.conf
kubectl -n console port-forward svc/console-zdb-api 8086:80
```



ZDB-CONSOLE-WEB SPECIFICATION
=============================
## .nuxt: Nuxt core

## assets
	### icons
		- icons.js: coreui/logo
		- iconsFontAwesome.js: fontAweome
		- logo.js: For CIcon
	### images
		...^icon: svg icons
	### scss
		####- vendors
			##### chartjs
				- chart.scss: coreui chart style
			- _variables.scss: coreui/bootstrap/_variables style pakage
		- _custom.scss: coreui main style
		- _variables.scss: variable style
		- style.scss: Style package(*)
		
## build
	- config.gypi: build configuration

## components
	### dialog
		- Alert.vue: Alert window
		- Confirm.vue: Confirm window
		- Toast.vue: Toast message	
	### zdb
		#### datastores
			- Blocks.vue: Blocks in Managements component (*)
			- Category.vue: Categories in Managements component (*)
			- Managements.vue: It's a tab in the pod page. (*)
			- Overview.vue: It's a tab in the pod page. (*)
			- Monitoring.vue: It's a tab in the dsrname page. (*)
			- ServiceInfo.vue: It's a tab in the dsrname page. (*)
		- MyScrollbar.vue: Scrolllbar everwhere (*)
		- MySpinner.vue: Spinner everwhere (*)
	- Logo.vue: Nuxt logo
	
## layouts
	### coureui
		~~_nav.js:~~ 
		- TheAside.vue: Aside contents on the right
		- TheFooter.vue: Main footer
		- TheHeader.vue: Main header
		- TheHeaderDropdownAccnt.vue: Profile information and for CSRF, XSRF
		- TheHeaderDropDownMssgs.vue: Message content provided Coreui
		- TheheaderDrodownNotify.vue: Notify content provided Coreui
		- TheHeaderDrodownTasks.vue: Tasks content provided Coreui
		- TheSidebar.vue: Sidebar menus (*)
	- default.vue: Root page
	
## middleware: You can setup a Node server

## mixins
	### common
		- dialog.js: Various kinds of dialog window
		- downloader.js: File save library
		- profile.js: Profile handler
	### ui
		- colors.js: Define colors
		- provider.js: Define colors and images
		- scrollbar.js: Scrollbar options (*)
	index.js: Mixin ui package

## modules
	- apexChart.js: Apexchart structure (*)
	- chartRequest.js: Prometheus queries (*)
	- fetch.js: Fetching data helper (*)
	- tableFactory.js: Building tables helper (*)
	
## node_modules
	- ...js library

## pages
	### components
		- apitest.vue: Sample Api test
		- components.vue: Sample components
		- monitoring.vue: Sample Apexchart
	### system
		- clusters.vue: Cluster tamplate
		- dashboard.vue: Dashboard template
	### projects/_id/datastores
		- index.vue: Projects page (*)
		#### dsrname
			- _pod.vue: The child page (*)
			- index.vue: The children page (*)
- index.vue: Main page

## plugins
	### filters
		- dayjs.js: Date filter
		- index.js: Filters package
	- axios.js: Axios (*)
	- coreui.js: Coreui package
	- i18n.js: For locale service	
	- utils.js: ...loadash
	- service.js: Service modules package
	
~~## service~~
	
## static
	### img
		#### avatars
			...images
		#### brand
			...images
		#### services
			...images
		- icon_*.svg
	### locale
		- en.js: Static message for locale service
	- favicon.ico

## store
	- datastores.js: For Datastores page (*)
	- dialog.js: For Dialog window
	- index.js: Store package
	- profile.js: For handling Profile data

- .dockerignore: Define Docker ignore files
- .env: Procees environment setting 
- .gitignore: Define Git ignore files
- console-zdb-web.yaml: Kubernetes object
- default.conf: Running Server configuration
- Dockerfile: Cocker image configuration
- Handin.md: Just this file (*)
- nuxt.config.js: Nuxt configuration (*)
- package-lock.json: Nodejs dependencies
- package.json: Nodejs dependencies
- yarn.lock: Nodejs dependencies
- zdb-console-web.yaml: Kubernetes object




NUXT INTRODUCTION
==================
## Install/Build
```bash
// Create
$ npm install -g yarn
$ yarn create nuxt-app zdb-console-web
$ cd zdb-console-web

// Install
$ yarn install
$ yarn dev

// build
$ yarn build
$ yarn start

// genertate
$ yarn generate
```



## Using SCSS
```bash
$ yarn add --dev node-sass sass-loader
```
```javascript
// nuxt.config.js 
export default {
	css: ['~/assets/scss/style.scss'],
}	
```

## Using Nunxt proxy to avoid CORS
```javascript
// nuxt.config.js 
/api/v2': {
	target: process.env.CONSOLE_ZDB_API_URL || 'http://console-zdb-api.console/',   
	secure: false,
	ws: true
}
```

## Access API via Kubectl Port forward
1. forward
```bash
set KUBECONFIG=C:\kubeconfig\kube.conf
kubectl -n console port-forward svc/console-zdb-api 8086:80
```
2. Using .env file
CONSOLE_ZDB_API_URL=http://localhost:8086/




CORE-UI INTRODUCTION
=====================
## Sample with Git Clone
https://github.com/coreui/coreui-free-vue-admin-template#installation


## Getting Started
1. Install
```bash
$ npm install @coreui/vue
$ npm install @coreui/coreui
$ npm install core-js
```

2. Register to Plugin
```javascript
// ~/plugins/components.js
import CoreuiVue from "@coreui/vue";
Vue.use(CoreuiVue);

// nuxt.config.js 
plugins: [  '~/plugins/components' ]
```

## Table data
* itemS: Array objects you want to list
* fieldS: Table columns
		




ORIGINAL API DATA
==================
## Reference the code
~/data/datastores.json




PARSED DATA FOR TABLES
========================
```json
//For DSR tables
{
	"fields": [
	],
	"items": [
		{
			"metadata" : {
				"namespace": "zdb-managed",
				"name": "zdb-managed-dsr-mdb",
				"creationTimestamp": "2021-04-08T07:22:10Z",
				"labels": {
          "cluster": "cloudzcp-pog-dev"
				}
			},
			"spec" : {
				"datastore": "mongodb",
				"version": "4.2.9"
			},
			"status": {
				"architecture": "Replicaset(P-S-A)",
				"deployStatus": "DEPLOYED",
				"status": "Running",
				"ready": "3/3",
				"resources" : {
					"requestCpu": "700m",
					"requestMemory": "704Mi"
				}
				
			},
			"storage": {
				"data": "20Gi/20Gi"
			}
		}
	]
}
//For details
{
	"fields": [
	],
	"items": [
		{
			"metadata" : {
				"namespace": "zdb-managed",
				"name": "zdb-managed-dsr-mdb"
			},
			"status": {
				"memberRole": "primary",
				"status": "Running",
				"ready": "3/3",
				"nodeName": "10.178.218.166",
				"podIP": "172.30.71.177",
				"resources" : {
					"requestCpu": "700m",
					"requestMemory": "704Mi",
					"cpuUsage": "25m",
					"memoryUsage": "133Mi"
				}				
			},
			"storage": {
				"data": "20Gi/20Gi"
			}
		},			
	]
}
```




FORMER REQUEST FOR APEXCHART
=============================
## Former response structure
```javascript
{
  result: {
		status: 'success|fail|error',
		data: {
			resultType: 'matrix',
			result: [{
				metric: {
					pod: "msa-framework-maria-mariadb-0"
				},
				values: [
					[1620280388, 0.0034591863824185495],
					[1620280395, 0.004111213409057882],
					[1620280402, 0.004111213409057882]
				]
			}]
		},
		// code: 200
		// message: ""
	}
}
```

1. Into monitoring page
https://pog-dev-zdb.cloudzcp.io/zdb02/zdb0210?namespace=backup-test&serviceType=mariadb&serviceName=backup-test-bkup1

2. cpu
* current
https://pog-dev-zdb.cloudzcp.io/zdbapi/getMonData?namespace=backup-test&serviceType=mariadb&serviceName=backup-test-bkup1&monType=cpuCurrent&step=7
* limit
https://pog-dev-zdb.cloudzcp.io/zdbapi/getMonData?namespace=backup-test&serviceType=mariadb&serviceName=backup-test-bkup1&monType=cpuLimits&step=7
* request
https://pog-dev-zdb.cloudzcp.io/zdbapi/getMonData?namespace=backup-test&serviceType=mariadb&serviceName=backup-test-bkup1&monType=cpuRequests&step=7

3. memory
Request URL: https://pog-dev-zdb.cloudzcp.io/zdbapi/getMonData?namespace=backup-test&serviceType=mariadb&serviceName=backup-test-bkup1&monType=memoryCurrent&step=7





FORMER PROMQUERY FOR APEXCHARTS
================================
1. NONAME
* CPU_REQUESTS, CPU_LIMITS, CPU_CURRENT, MEMORY_REQUESTS, MEMORY_LIMITS, MEMORY_CURRENT {
	params: SERVICE_NAME, SERVICE_TYPE, SERVICE_TYPE
	binds: pod=~"%s-%s-.*", container="%s" }

* NETWORK_TX, NETWORK_RX {
	params: SERVICE_NAME, SERVICE_TYPE
	binds: pod=~"%s-%s-.*" }

* CONNECTIONS {
	params: SERVICE_NAME, SERVICE_TYPE, SERVICE_NAME, SERVICE_TYPE
	binds: service="%s-%s", service="%s-%s" }

* CONNECTIONS_MAX_USED, CONNECTIONS_MAX {
	params: SERVICE_NAME, SERVICE_TYPE, SERVICE_TYPE
	binds: service="%s-%s" }
	
* CLIENT_PEAK_THREAD_CONNECTED, CLIENT_PEAK_THREAD_RUNNING, CLIENT_AVG_THREAD_RUNNING {
	params: SERVICE_NAME, SERVICE_TYPE, SERVICE_TYPE 
	binds: service="%s-%s" }

* TABLE_LOCKS_IMMEDIATE, TABLE_LOCKS_WAITED, CURRENT_QPS {
	params: SERVICE_NAME, SERVICE_TYPE, SERVICE_NAME, SERVICE_TYPE
	binds: service="%s-%s", service="%s-%s" }

* MARIADB_REPLICATION_DELAY, SLAVE_SQL_THREAD_RUNNING, SLAVE_IO_THREAD_RUNNING {
	params: SERVICE_NAME, SERVICE_TYPE, SERVICE_TYPE
	binds: master_host="%s-%s" }


2. MONGODB
* MONGODB_CPU_REQUESTS, MONGODB_CPU_LIMITS, MONGODB_CPU_CURRENT
, MONGODB_MEMORY_CURRENT, MONGODB_MEMORY_LIMITS, MONGODB_MEMORY_REQUESTS	{
	params: SERVICE_NAME, SERVICE_TYPE, SERVICE_TYPE
	binds: pod=~"%s-%s-.*", container="%s" }

* MONGODB_NETWORK {
	params: NAMESPACE, SERVICE_NAME
	binds: namespace="%s" , release=~"%s" }

* MONGODB_MEMORY_RESIDENT, MONGODB_MEMORY_VIRTUAL	
, MONGODB_CONNECTION_CURRENT, MONGODB_CONNECTION_AVAILABLE
, MONGODB_QUERY_OPERATIONS, MONGODB_CACHE
, MONGODB_TICKET_WRITE, MONGODB_TICKET_READ
, MONGODB_CURSOR_TOTAL, MONGODB_CURSOR_TIMEOUT
, MONGODB_QUEUE
, MONGODB_LAG_OP, MONGODB_LAG_REP
, MONGODB_MEMBER_HEALTH_RELEASE, MONGODB_MEMBER_HEALTH_STATE
, MONGODB_REPLICA_QUERY_OPERATIONS {
	params: NAMESPACE, SERVICE_NAME
	binds: namespace="%s" , release="%s" }
	
	
3. REDIS
* REDIS_CPU_REQUESTS, REDIS_CPU_LIMITS, REDIS_CPU_CURRENT {
	params: SERVICE_NAME, SERVICE_TYPE, SERVICE_TYPE
	binds: container="%s-%s" }
	
* REDIS_MEMORY_USED, REDIS_MEMORY_MAX
, REDIS_NETWORK_INPUT, REDIS_NETWORK_OUTPUT
, REDIS_ITEMS_PER_DB, REDIS_EXPIRING
, REDIS_EXPIRED, REDIS_EVICTED, REDIS_COMMANDS_EXECUTED, REDIS_HITS
, REDIS_MISSES, REDIS_COMMAND_CALLS {
	params: SERVICE_NAME, SERVICE_TYPE, SERVICE_TYPE
	binds: alias="%s-%s" }

* REDIS_NOT_EXPIRING {
	params: SERVICE_NAME, SERVICE_TYPE, SERVICE_NAME, SERVICE_TYPE
	binds: alias="%s-%s", alias="%s-%s" }
	

4. RABBITMQ
* RABBITMQ_READY_MSG, RABBITMQ_INCOMING_MESSAGES
, RABBITMQ_PUBLISHERS, RABBITMQ_CONNECTIONS
, RABBITMQ_QUEUES, RABBITMQ_UNACKNOWLEDGED_MESSAGES {
, RABBITMQ_COMSUMERS
, RABBITMQ_CHANNELS
, RABBITMQ_NODES
, RABBITMQ_MSG_CONSUMERS
, RABBITMQ_MSG_CONSUMER_ACK
, RABBITMQ_MSG_PUBLISHED
, RABBITMQ_TOTAL_QUEUES
, RABBITMQ_TOTAL_CHANNELS
, RABBITMQ_TOTAL_CONNECTIONS {
	params: SERVICE_NAME, SERVICE_TYPE
	binds: statefulset_kubernetes_io_pod_name=~"%s-%s-.*" }

* RABBITMQ_OUTGOING_MESSAGES {
	params: SERVICE_NAME, SERVICE_TYPE, SERVICE_NAME, SERVICE_TYPE, SERVICE_NAME, SERVICE_TYPE, SERVICE_NAME, SERVICE_TYPE, SERVICE_NAME, SERVICE_TYPE
	binds: statefulset_kubernetes_io_pod_name=~"%s-%s-.*", statefulset_kubernetes_io_pod_name=~"%s-%s-.*", statefulset_kubernetes_io_pod_name=~"%s-%s-.*", statefulset_kubernetes_io_pod_name=~"%s-%s-.*", statefulset_kubernetes_io_pod_name=~"%s-%s-.*" } 

* RABBITMQ_MSG_DELIVERED {
	params: SERVICE_NAME, SERVICE_TYPE, SERVICE_NAME, SERVICE_TYPE
	binds: binds: statefulset_kubernetes_io_pod_name=~"%s-%s-.*", statefulset_kubernetes_io_pod_name=~"%s-%s-.*" }

* CLUSTER_INFO, SELECTED_CLUSTER { not thing }

5. KAFKA
* ALL_KINDS {
	params: SERVICE_NAME
	binds: pod=~"%s-.*", service=~"%s.*"

* Not working queries
count(sum by(topic) (kafka_topic_partitions{service=~\"%s.*\"} ))
sum(kafka_topic_partitions{service=~\"%s.*\"})
sum(kafka_topic_partition_replicas{service=~\"%s.*\"})
sum(kafka_topic_partition_in_sync_replica{service=~\"%s.*\"})
sum(kafka_topic_partition_under_replicated_partition{service=~\"%s.*\"})
sum(kafka_cluster_partition_atminisr{service=~\"%s.*\"})
sum(kafka_cluster_partition_underminisr{service=~\"%s.*\"})
count(kafka_topic_partition_leader_is_preferred{service=~\"%s.*\"}<1)
sum(rate(kafka_topic_partition_current_offset{service=~\"%s.*\"}[1m])) by (topic)
sum(delta(kafka_consumergroup_current_offset{service=~\"%s.*\"}[1m])/60) by (consumergroup, topic)
sum(kafka_consumergroup_lag{service=~\"%s.*\"}) by (consumergroup, topic)

6. POSTGRESQL
System Resources
 - CPU Usage
    sum by (pod)( rate(container_cpu_usage_seconds_total{pod=~"$postgrerelease.*", container=~"postgresql.*"}[1m] ) )
    kube_pod_container_resource_requests_cpu_cores{pod=~"$postgrerelease.*", container=~"postgresql.*"}
    kube_pod_container_resource_limits_cpu_cores{pod=~"$postgrerelease.*", container=~"postgresql.*"}
    sum by (pod)( rate(container_cpu_usage_seconds_total{pod=~"$postgrerelease.*", container=~"pgpool.*"}[1m] ) )
    kube_pod_container_resource_requests_cpu_cores{pod=~"$postgrerelease.*", container=~"pgpool.*"}
    kube_pod_container_resource_limits_cpu_cores{pod=~"$postgrerelease.*", container=~"pgpool.*"}

 - Memory Usage
    avg by(pod) (container_memory_rss{pod=~"$postgrerelease-.*", container="postgresql"} / 1024 / 1024)
    kube_pod_container_resource_requests_memory_bytes{pod=~"$postgrerelease-.*", container="postgresql"}/ 1024 / 1024
    kube_pod_container_resource_limits_memory_bytes{pod=~"$postgrerelease-.*", container="postgresql"}/ 1024 / 1024
    avg by(pod) (container_memory_rss{pod=~"$postgrerelease-.*", container="pgpool"} / 1024 / 1024)
    kube_pod_container_resource_requests_memory_bytes{pod=~"$postgrerelease-.*", container="pgpool"}/ 1024 / 1024
    kube_pod_container_resource_limits_memory_bytes{pod=~"$postgrerelease-.*", container="pgpool"}/ 1024 / 1024 
 - Network I/O
    rate (container_network_transmit_bytes_total{pod=~"$postgrerelease-.*",interface="eth0"}[5m])
    rate (container_network_receive_bytes_total{pod=~"$postgrerelease-.*",interface="eth0"}[5m])

Connections & Table
 - PGPool Frontend 
    pgpool2_frontend_total{release=~"$postgrerelease.*"} 
    pgpool2_frontend_used{release=~"$postgrerelease.*"}
 - Active sessions 
    pg_stat_activity_count{statefulset_kubernetes_io_pod_name=~"$pod_name.*", state="active"}
* Legend Format : {{datname}}[a], s: active/{{statefulset_kubernetes_io_pod_name}}
 - Lock tables 
    pg_locks_count{statefulset_kubernetes_io_pod_name=~"$pod_name.*"}
* Legend Format : {{datname}},{{mode[b]}}/{{statefulset_kubernetes_io_pod_name}}

Query & Replication
 - PGPool Node Status
    pgpool2_pool_nodes_status{release=~"$postgrerelease.*"}
 - Node Replication Delay 
    pgpool2_pool_nodes_replication_delay{release=~"$postgrerelease.*"}
 - Replication LSN Diff 
    pg_stat_replication_pg_wal_lsn_diff{statefulset_kubernetes_io_pod_name=~"$pod_name.*"}





APEXCHART INTRODUCTION
=========================
## Getting Started
1. Install modules
$ npm install --save apexcharts
$ npm install --save vue-apexcharts

2. Register
```javascript
// ~/plugins/components.js
import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)
```

3. Using Template
```html
<div id="chart">
	<apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
</div>
```

4. Data
```javascript
{
	series: [{
		name: "Desktops",
		data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
	}],
	chartOptions: {
		chart: {
			height: 350,
			type: 'line',
			zoom: {
				enabled: false
			}
		},
		dataLabels: {
			enabled: false
		},
		stroke: {
			curve: 'straight'
		},
		title: {
			text: 'Product Trends by Month',
			align: 'left'
		},
		grid: {
			row: {
				colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
				opacity: 0.5
			},
		},
		xaxis: {
			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
		}
	}
}
```

## former Server 
1	MariaDB	/zdb02/zdb0210	Zdb02Controller	zdb0212	zdb0212.html	MariaDB 서비스상세  - 신규모니터링 페이지	https://github.com/cnpst/zdb-portal-ui/blob/1.5.0-prod/src/main/resources/templates/zdb02/zdb0212.html

2	Redis	
zdb0222	zdb0222.html	Redis 서비스상세 - 신규모니터링 페이지	https://github.com/cnpst/zdb-portal-ui/blob/1.5.0-prod/src/main/resources/templates/zdb02/zdb0222.html

3	RabbitMQ	/zdb02/zdb0250	Zdb02Controller	zdb0252	zdb0252.html	RabbitMQ 서비스상세  - 신규모니터링 페이지	https://github.com/cnpst/zdb-portal-ui/blob/1.5.0-prod/src/main/resources/templates/zdb02/zdb0252.html

4	MongoDB	/zdb02/zdb0230	Zdb02Controller	zdb0232	zdb0232.html	MongoDB 서비스상세  - 신규모니터링 페이지	https://github.com/cnpst/zdb-portal-ui/blob/1.5.0-prod/src/main/resources/templates/zdb02/zdb0232.html

5	Kafka	/zdb02/zdb0240	Zdb02Controller	zdb0242	zdb0242.html	Kafka 서비스상세  - 신규모니터링 페이지	https://github.com/cnpst/zdb-portal-ui/blob/1.5.0-prod/src/main/resources/templates/zdb02/zdb0242.html





ZDB MANAGEMENT
==============
## former request URL
https://eks-dev-zdb.cloudzcp.io/zdbapi/getDatabaseStatusVariables?namespace=awesome-shopping&serviceType=mariadb&serviceName=awesome-shopping-demo&podName=awesome-shopping-demo-mariadb-0


## API sample
1. If
namespace: zdb-v2-ma
name: zdb-v2-ma-ma2-mariadb-master-0

2. url https://zdb.mcm-dev.cloudzcp.com/api/v2/projects/pjt1/datastorereleases/zdb-v2-ma/datastores/zdb-v2-ma-ma2-mariadb-master-0/statusVariables?cluster=cloudzcp-pog-dev


## DataStore Release
https://zdb.mcm-dev.cloudzcp.com/api/docs.html#get-/api/v2/cluster/{cluster}/namespace/{namespace}/datastorerelease/{datastorerelease}


## Process List
1. connections
>https://myshare.skcc.com/pages/viewpage.action?spaceKey=SKMONITOR&title=ZDBv2+-+mariadb+%3E+processlist
>https://zdb.mcm-dev.cloudzcp.com/api/v2/projects/pjt1/datastorereleases/zdb-v2-ma-ma2/datastores/zdb-v2-ma-ma2-mariadb-master-0/connection?cluster=cloudzcp-pog-dev
>http://localhost:8080/api/v2/projects/pjt1/datastorereleases/zdb-v2-ma-ma2/datastores/zdb-v2-ma-ma2-mariadb-master-0/connection?cluster=cloudzcp-pog-dev

2. Process list
http://localhost:8080/api/v2/projects/pjt1/datastorereleases/zdb-v2-ma-ma2/datastores/zdb-v2-ma-ma2-mariadb-slave-0/processes?cluster=cloudzcp-pog-dev

3. Process kill
http://localhost:8080/api/v2/projects/pjt1/datastorereleases/zdb-v2-ma-ma2/datastores/zdb-v2-ma-ma2-mariadb-master-0/pid/68729?cluster=cloudzcp-pog-dev


### Status variables
http://localhost:8080/api/v2/projects/pjt1/datastorereleases/zdb-v2-ma-ma2/datastores/zdb-v2-ma-ma2-mariadb-slave-0/statusVariables?cluster=cloudzcp-pog-dev


### System variables
>http://localhost:8080/api/v2/projects/pjt1/datastorereleases/zdb-v2-ma-ma2/datastores/zdb-v2-ma-ma2-mariadb-slave-0/systemVariables?cluster=cloudzcp-pog-dev




ZCP-CONSOLE-WEB INTRODUCTION
============================
```bash
// port forward
$ set KUBECONFIG=c:/kubeconfig/zcp-console-web.conf
$ kubectl port-forward service/console-api 8080:80 -n console
X $ kubectl port-forward service/zcp-mcm-backend-service 8081:4000 -n site1-system

// Install
$ yarn install
$ yarn dev

// build
$ yarn build
$ yarn start

// genertate
$ yarn generate
```

## With API server
## zcp local
1. Configure kubeconfig
$ cd /kubeconfig
$ set KUBECONFIG=./zcp-context.conf

2. forward Port on windows each other
$ kubectl port-forward service/zcp-mcm-backend-service 8081:4000 -n site1-system
	> http://localhost:8081
$ kubectl port-forward service/zcp-cicd-backend 8082:80 -n zcp-system
	> http://localhost:8082
$ kubectl port-forward service/zcp-monitoring-backend 8083:80 -n monitoring
	> http://localhost:8083

3. forward DB Port
$ cd /kubeconfig
$ set KUBECONFIG=./cloudzcp-eks-dev.yml
$ kubectl port-forward svc/zdb-managed-zdbv2-mongodb-0 27017 -n zdb-managed

4. Run the API
$ cd C:\workspace
$ cd zcp-console-web-develop
	$ ./gradlew
	$ ./gradlew build
	$ ./gradlew bootRun

5. Run the vue-app
$ cd C:\workspace
$ cd zcp-console-web-develop
$ npm install --save package.json
$ npm run dev
	admin/admin
