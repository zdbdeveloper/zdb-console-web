<template>
  <div>
    <MySpinner />
    <CRow>
      <CCol xl="2" lg="3">
        <Category
          :payload="{
            categories: categories,
            active: managements.active
          }"
          @onHandleCategory="fetchContent"
        />
      </CCol>
      <CCol v-if="managements.completed">
        <Blocks
          v-if="Object.keys(activeBlocks).length"
          :payload="{ blocks: activeBlocks.tableItems }"
        />
        <CDataTable
          :fields="activeTable.tableFields"
          :items="activeTable.tableItems"
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

const tableFactory = new TableFactory()

export default {
  created () {
    this.fetchContent()
  },
  data () {
    return {
      //The structure for the management contents.
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
  computed: {
    //The service categories.
    categories () {
     return Object.entries(this.managements.categories).map(v => v) 
    },
    //The activated blocks on the mariadb processes.
    activeBlocks () {
      return this.managements.categories[this.managements.active].contents.blocks
    },
    //The activated table each content.
    activeTable () {
      return this.managements.categories[this.managements.active].contents.table
    }
  },
  methods: {
    /**
     * Fetching Content by each category.
     */
    async fetchContent (id = this.managements.active) {
      //Mark a flag for the job processing.
      this.managements.completed = false
      this.page = 1
      let target = this.managements.categories[id]
      //Using cache data. you can remove it.
      if (target.contents.table?.tableItems) {
        this.managements.active = id
        this.managements.completed = true
        return
      }
      //Fetch data asynchronously
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
      //Inject data into the targeted blocks.
      if ('connections' == id) {
        table = tableFactory.build({id: 'mariadb_processes', items: resolves[0]})
        blocks = Object.entries(resolves[1]).sort((a, b) => a > b ? 1 : a < b ? -1 : 0)
        blocks = tableFactory.build({id: 'mariadb_variables', items: blocks})
        target.contents.blocks.tableFields = blocks.tableFields
        target.contents.blocks.tableItems = blocks.tableItems
      } else {
        table = Object.entries(resolves[0]).sort((a, b) => a > b ? 1 : a < b ? -1 : 0)
        table = tableFactory.build({id: 'mariadb_variables', items: table})
      }
      //Inject data into the targeted table.
      target.contents.table.tableFields = table.tableFields
      target.contents.table.tableItems = table.tableItems
      this.managements.active = id
      this.managements.completed = true
    },
    /**
     * Kill the process.
     */
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
    //Watch for changing the page number.
    page () {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } 
  }
}
</script>

