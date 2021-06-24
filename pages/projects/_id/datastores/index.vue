
<template>
  <div>
    <MySpinner />
    <h2>Tables</h2>
    <!-- <button@click="stopSocket"
      :disabled="!Boolean(subscription)">STOP SOCKET</button@click=>
    <button @click="startSocket"
      :disabled="Boolean(subscription) || !Boolean(stompClient)">START SOCKET</button>
    <button @click="disconnectSocket"
      :disabled="!Boolean(stompClient)">DISCONNECT SOCKET</button>
    <button @click="connectSocket"
      :disabled="Boolean(stompClient)">CONNECT SOCKET</button> -->
    <!-- <button @click="allColumm">COLUMN</button> -->
    <MyScrollbar>
      <CDataTable
        :items="tableItems"
        :fields="FilteredFields"
        hover
        pagination
        sorter
        striped
        table-filter
        @row-clicked="handleRowClick"
      >
        <template #show_details="{item, index}">
          <td class="py-2">
            <CButton
              color="primary"
              variant="outline"
              square
              size="sm"
              @click="fetchDetails(item, index)"
            >
              {{Boolean(item._toggled) ? '-' : '+'}}
            </CButton>
          </td>
        </template>
        <template #details="{item}">
          <CCollapse
            :show="Boolean(item._toggled)"
            :duration="collapseDuration">
            <CDataTable
              :items="tableDetails[item.namespace].tableItems"
              :fields="tableDetails[item.namespace].tableFields"
              hover
              pagination
              sorter
              striped
            >
            <template #cpuUsage="{item}">
              <td>
                <div class="clearfix" style="min-width: 160px;">
                  <div class="float-left">
                    <strong>{{ item.cpuUsage.rate }} %</strong>
                  </div>
                  <div class="float-right">
                    <small class="text-muted">{{ item.cpuUsage.usage }}</small>
                  </div>
                </div>
                <CProgress
                  v-model="item.cpuUsage.rate"
                  :color="item.cpuColor"
                  class="progress-xs"
                />
              </td>
            </template>
            <template #memoryUsage="{item}">
              <td>
                <div class="clearfix" style="min-width: 160px;">
                  <div class="float-left">
                    <strong>{{ item.memoryUsage.rate }} %</strong>
                  </div>
                  <div class="float-right">
                    <small class="text-muted">{{ item.memoryUsage.usage }}</small>
                  </div>
                </div>
                <CProgress
                  v-model="item.memoryUsage.rate"
                  :color="item.memoryColor"
                  class="progress-xs"
                />
              </td>
            </template>          
            </CDataTable>
          </CCollapse>
        </template>
        <template #status="{item}">
          <td class="text-center">
            <CBadge :color="item.badgeColor">
              {{ item.status }}
            </CBadge>
          </td>
        </template>
        <template #Health="{item}">
          <td class="text-center">
            <font-awesome-icon v-if="item.health === 'green'" icon="check-circle" class="c-icon mt-1 text-success"/>
            <font-awesome-icon v-else-if="item.health === 'yellow'" icon="exclamation-circle"
                              class="c-icon mt-1 text-warning"/>
            <font-awesome-icon v-else-if="item.health === 'red'" icon="exclamation-circle"
                              class="c-icon mt-1 text-danger"/>
            <font-awesome-icon v-else icon="question-circle" class="c-icon mt-1 text-secondary"/>
          </td>
        </template>
      </CDataTable>
    </MyScrollbar>
  </div>
</template>
<script>
  import SockJS from 'sockjs-client'
  import Stomp from 'webstomp-client'
  import { TableFactory } from '~/modules/tableFactory'

  export default {
    data() {
      return {
        //For Tables
        tableFields: [],
        tableItems: [],
        tableDetails: [],
        collapseDuration: 100,
        filteringFields: [ 'version', 'datastore' ],
        //For STOMP socket
        stompClient: null,
        subscription: null,
        systemStates: [],
      };
    },
    created() {
      this.$store.commit('datastores/zdb', {
        projectid: this.$route.params.id
      })
      this.fetchTables()
    },
    beforeDestroy() {
      this.disconnectSocket()
    },
    computed: {
      computedFields () {
        return this.tableFields.map(field => {
          return { 
            ...field
          }
        })
      },
      FilteredFields() {
        return this.computedFields.filter(field => {
          return !this.filteringFields.includes(field.key)
        })
      },
    },
    methods: {
      allColumm() {
        this.filteringFields = []
      },    
      connectSocket () {
        const socket = new SockJS('http://localhost:8090/websocket')
        this.stompClient = Stomp.over(socket)
        this.stompClient?.connect({}, (frame) => {
          //console.log('frame:', frame)
          this.stompClient.send('/states', {}, 'connectSocket')
          this.subscribe()
        })
      },
      async subscribe () {
        this.subscription = this.stompClient.subscribe('/topic/states', async res => {
          let systemStates = await JSON.parse(res.body) || []
          this.handleTablesSystemUsage(systemStates)
        })
      },
      startSocket () {
        this.stompClient.send('/states', {}, 'socket-start')
        this.subscribe()
      },
      stopSocket () {
        this.stompClient.send('/states', {}, 'socket-stop')
        this.subscription.unsubscribe()
        this.subscription = null
      },
      disconnectSocket () {
        if (this.subscription) {
          this.subscription.unsubscribe()
          this.subscription = null
        }
        if (this.stompClient) {
          this.stompClient.disconnect()
          this.stompClient = null
        }
      },
      /** 
       * Handle the system usages in the tables
       */    
      handleTablesSystemUsage (mysystemStates) {
        if (!Array.isArray(mysystemStates) || !mysystemStates.length) return false
        Object.keys(this.tableDetails).forEach(namespace => {
          let tableItems = this.tableDetails[namespace].tableItems
          tableItems?.forEach((tableItem, tableItemIdx) => {
            mysystemStates.forEach(systemState => {
              if (systemState.name == tableItem.name) {
                tableItem.cpuUsage.rate = systemState.cpuRate
                tableItem.memoryUsage.rate = systemState.memoryRate
              }
            })
          })
        })
      },
      /**
       * Fetch data for the tables
       */
      async fetchTables () {
        let res = await this.$fetcher.set(this.$store.state.datastores.zdb).get('datastore_parents')
        if (!res || typeof res !== 'object') return console.debug('NO response')
        res = new TableFactory({id: 'datastore_parents', items: res}).build()
        this.tableFields = res.tableFields
        this.tableItems = res.tableItems.map((item, id) => {
          this.tableDetails[item.namespace] = {}
          return { ...item, id }
        })
      },
      /**
       * Fetch table's detail data and toggleing its items
       */
      async fetchDetails (item) {
        let namespace = item.namespace
          , name = item.name
          , cluster = item.cluster
        if (this.tableDetails && this.tableDetails[namespace].tableItems) {
          return this.$set(this.tableItems[item.id], '_toggled', !item._toggled)
        }
        this.$store.commit('datastores/zdb', { namespace, name, cluster })
        let res = await this.$fetcher.set(this.$store.state.datastores.zdb).get('datastore_children')
        if (!res || !Object.keys(res).length) return console.debug('NO response')
        res = new TableFactory({id: 'datastore_children', items: res}).build()
        let tableFields = res.tableFields
        let tableItems = res.tableItems.map((item, id) => { return {...item, id}})
        this.tableDetails[namespace] =  { tableFields, tableItems }
        this.$set(this.tableItems[item.id], '_toggled', !item._toggled)
      },
      /**
       * Click Event on the table rows
       */
      handleRowClick (item, index, columnName, event) {
        if (columnName === 'name') {
          let name = this.tableItems[index].name
            , cluster = this.tableItems[index].cluster
            , architecture = this.tableItems[index].architecture
            , standalone = 'standalone' == architecture.toLowerCase() ? 1 : 0
          this.$store.commit('datastores/zdb', { standalone, cluster })
          this.$router.push({
            path: `/projects/${this.$store.state.datastores.zdb.projectid}/datastores/${name}`
          })
        }
      },
    }
  };
</script>

<style>

</style>