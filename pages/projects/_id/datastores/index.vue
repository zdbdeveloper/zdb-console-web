
<template>
  <div>
    <MySpinner />
    <!-- <button@click="stopSocket"
      :disabled="!subscription">STOP SOCKET</button@click=>
    <button @click="startSocket"
      :disabled="subscription || !stompClient || !stompClient.connected">START SOCKET</button>
    <button @click="disconnectSocket"
      :disabled="!stompClient || !stompClient.connected">DISCONNECT SOCKET</button>
    <button @click="connectSocket"
      :disabled="stompClient && stompClient.connected">CONNECT SOCKET</button> -->
    <CCard body-wrapper class="filter-box">
      <h5 class="tab-style-title"><CIcon class="mr-2" name="cil-filter"/>Filter</h5>
      <CRow class="form-group mb-0">
        <CCol>
          <multiselect
            v-model="filteringFields"
            :options="allFields"
            label="name"
            track-by="name"
            :multiple="true"
            class="multiselect-custom"
            placeholder="Please select"
            v-tooltip.top="'Filtering Fields'"
          />
        </CCol>
      </CRow>
    </CCard>
    <MyScrollbar>
      <CDataTable
        :items="tableItems"
        :fields="filteredFields"
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
        <!-- <template #Health="{item}">
          <td class="text-center">
            <font-awesome-icon v-if="item.health === 'green'" icon="check-circle" class="c-icon mt-1 text-success"/>
            <font-awesome-icon v-else-if="item.health === 'yellow'" icon="exclamation-circle"
                              class="c-icon mt-1 text-warning"/>
            <font-awesome-icon v-else-if="item.health === 'red'" icon="exclamation-circle"
                              class="c-icon mt-1 text-danger"/>
            <font-awesome-icon v-else icon="question-circle" class="c-icon mt-1 text-secondary"/>
          </td>
        </template> -->
      </CDataTable>
    </MyScrollbar>
  </div>
</template>
<script>
  import SockJS from 'sockjs-client'
  import Stomp from 'webstomp-client'
  import { TableFactory } from '~/modules/tableFactory'

  export default {
    created() {
      //Store the zdb information
      this.$store.commit('datastores/zdb', {
        projectid: this.$route.params.id
      })
      this.fetchTables()
      this.connectSocket()
    },
    beforeDestroy() {
      this.disconnectSocket()
    },
    data() {
      return {
        //For Tables
        tableFields: [],
        tableItems: [],
        tableDetails: [],
        collapseDuration: 100,
        filteringFields: [],
        //For STOMP socket
        stompClient: null,
        subscription: null,
        systemStates: [],
      };
    },
    computed: {
      //All table fields for filtering fields
      allFields () {
        return this.tableFields.map(field => {
          let value = false === field.filter ? '' : field.key
          return {
            value: value,
            name: value.toUpperCase()
          }
        }).filter(field => field.value)
      },
      //Filtered fields
      filteredFields () {
        return this.tableFields.filter(field => 
          !this.filteringFields.map(field => field.value).includes(field.key)
        )
      },
    },
    methods: {
      /**
       * Connect the socket using STOMP
       */
      connectSocket () {
        const socket = new SockJS('http://localhost:8090/websocket')
        this.stompClient = Stomp.over(socket)
        this.stompClient?.connect({}, (frame) => {
          this.stompClient.send('/states', {}, 'connectSocket')
          this.subscribe()
        })
      },
      /**
       * The socket subscribe.
       */
      async subscribe () {
        this.subscription = this.stompClient.subscribe('/topic/states', async res => {
          let systemStates = await JSON.parse(res.body) || []
          this.handleTablesSystemUsage(systemStates)
        })
      },
      /**
       * Start/Restart the socket.
       */
      startSocket () {
        this.stompClient.send('/states', {}, 'socket-start')
        this.subscribe()
      },
      /**
       * Stop the socket.
       */
      stopSocket () {
        this.stompClient.send('/states', {}, 'socket-stop')
        this.subscription.unsubscribe()
        this.subscription = null
      },
      /**
       * Disconnect the socket
       */
      disconnectSocket () {
        if (this.subscription) {
          this.subscription.unsubscribe()
          this.subscription = null
        }
        if (this.stompClient && this.stompClient.connected) {
          this.stompClient.disconnect()
          this.stompClient = null
        }
      },
      /** 
       * Handle the system usages in the children tables
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
        //Update Zdb data
        this.$store.commit('datastores/zdb', { namespace, name, cluster })
        //Fetch data
        let res = await this.$fetcher.set(this.$store.state.datastores.zdb).get('datastore_children')
        if (!res || !Object.keys(res).length) return console.debug('NO response')
        res = new TableFactory({id: 'datastore_children', items: res}).build()
        let tableFields = res.tableFields
        let tableItems = res.tableItems.map((item, id) => { return {...item, id}})
        this.tableDetails[namespace] =  { tableFields, tableItems }
        this.$set(this.tableItems[item.id], '_toggled', !item._toggled)
      },
      /**
       * Change the location by clicking the name on the row.
       */
      handleRowClick (item, index, columnName, event) {
        if (columnName === 'name') {
          let name = this.tableItems[index].name
            , cluster = this.tableItems[index].cluster
            , architecture = this.tableItems[index].architecture
            , standalone = 'standalone' == architecture.toLowerCase() ? 1 : 0
          //Register it's Standalone or not
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