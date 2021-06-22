<template>
  <div>
    <MySpinner width="4rem" height="4rem" color="success" :grow="true" />
    <CRow>
      <CCol xl="2">
        <Category
          :payload="{
            categories: Object.entries(managements.categories).map(v => v),
            active: managements.active
          }"
          @onHandleCategory="handleCategory"
        />
      </CCol>
      <CCol v-if="managements.completed">
        <Blocks
          v-if="Object.keys(managements.categories[managements.active].contents.blocks).length"
          :payload="{ blocks: managements.categories[managements.active].contents.blocks.tableItems }"
        />
        <CDataTable
          :fields="managements.categories[managements.active].contents.table.tableFields"
          :items="managements.categories[managements.active].contents.table.tableItems"
          hover
          sorter
          striped
          table-filter
          pagination
          :itemsPerPage="100"
          @page-change="page=$event"
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
        categories: {
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
      page: 1,
    }
  },
  created () {
    this.fetchContent()
  },
  methods: {
    handleCategory (id) {
      this.fetchContent(id)
    },
    async fetchContent (id = this.managements.active) {
      this.managements.completed = false
      let target = this.managements.categories[id]
      if (target.contents.table?.tableItems) {
        this.managements.active = id
        this.managements.completed = true
        this.page = 1
        return
      }
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
      this.page = 1
    },
    async killProcess (item, index) {
      if (await this.$store.dispatch('dialog/confirm'
        , 'Are you sure you want to kill this?')) {
        this.$fetcher.set({ target: Number(item.Id) }).patch('mariadb_processKill')
          .then(res => {
            this.fetchContent()
        })
      }
    }
  },
  watch: {
    page () {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } 
  }
}
</script>

