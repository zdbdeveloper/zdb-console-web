<template>
  <div>
    <MySpinner width="4rem" height="4rem" color="success" :grow="true" />
    <CRow>
      <CCol xl="2">
        <Category :payload="{ managements }" @onHandleSector="handleSector" />
      </CCol>
      <CCol v-if="managements.completed">
        <Blocks
          v-if="Object.keys(managements.sectors[managements.active].contents.blocks).length"
          :payload="{ ...managements.sectors[managements.active].contents.blocks }"
        />
        <CDataTable
          :fields="managements.sectors[managements.active].contents.table.tableFields"
          :items="managements.sectors[managements.active].contents.table.tableItems"
          hover
          sorter
          striped
          table-filter
          pagination
          :itemsPerPage="100"
        >
          <template #kill="{item, index}">
            <td class="py-2">
              <CButton
                color="primary"
                variant="outline"
                square
                size="sm"
                @click="killProcess(item, index)"
              >
                {{ 'Kill' }}
              </CButton>
            </td>
          </template>
      </CDataTable>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { TableFactory } from '~/modules/tableFactory'

export default {
  data () {
    return {
      tableFactory: new TableFactory(),
      managements: {
        active: 'connections',
        completed: false,
        sectors: {
          connections: {
            title: '클라이언트 커넥션',
            contents: {}
          },
          statusVariables: {
            title: '상태변수',
            contents: {}
          },
          systemVariables: {
            title: '시스템변수',
            contents: {}
          },
        }
      },
    }
  },
  created () {
    this.fetchContent()
  },
  methods: {
    handleSector (id) {
      this.fetchContent(id)
    },
    async fetchContent (id = this.managements.active) {
      this.managements.completed = false
      let target = this.managements.sectors[id]
      //if (target.contents.table.tableItems) return
      let ids = { [id]: [`mariadb_${id}`] }
      if ('connections' == id) {
        ids[id] = [ 'mariadb_processes', ...ids[id] ]
      }
      let tasks = []
      ids[id].forEach(id => {
        tasks = [ ...tasks, this.$fetcher.get(id) ]
      })
      let resolves = await Promise.all(tasks)
      let table = null
        , blocks = null
      target.contents.table = {}
      target.contents.blocks = {}
      if ('connections' == id) {
        table = this.tableFactory.build({id: 'mariadb_processes', items: resolves[0]})
        blocks = Object.entries(resolves[1]).sort((a, b) => a > b ? 1 : a < b ? -1 : 0)
        blocks = this.tableFactory.build({id: 'mariadb_variables', items: blocks})
        target.contents.blocks.tableFields = blocks.tableFields
        target.contents.blocks.tableItems = blocks.tableItems
      } else {
        table = Object.entries(resolves[0]).sort((a, b) => a > b ? 1 : a < b ? -1 : 0)
        table = this.tableFactory.build({id: 'mariadb_variables', items: table})
      }
      target.contents.table.tableFields = table.tableFields
      target.contents.table.tableItems = table.tableItems
      this.managements.active = id
      this.managements.completed = true
    },
    async killProcess (item, index) {
     if(confirm('Are you sure you want to kill this?')) {
      this.$fetcher.set({ target: Number(item.Id) }).patch('mariadb_processKill').then(res => {
        console.log('res:', res)
        this.fetchContent()
      })
     }
    }
  }
}
</script>

