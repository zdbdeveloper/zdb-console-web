<template>
  <div>
    <MySpinner width="4rem" height="4rem" color="success" :grow="true" />
    <CRow>
      <CCol xl="2">
        <Category
          :payload="{ managements }" @onHandleSector="handleSector"
        />
      </CCol>
      <CCol>
        <MyTable
          v-if="managements.completed"
          :payload="{ ...managements.sectors[managements.active].contents.table }"
        />
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { TableFactory } from '~/modules/tableFactory'

export default {
  data () {
    return {
      managements: {
        active: 'statusVariables',
        completed: false,
        sectors: {
          statusVariables: {
            title: '상태변수',
            contents: {}
          },
          systemVariables: {
            title: '시스템변수',
            contents: {}
          },
          connections: {
            title: '클라이언트 커넥션',
            contents: {}
          },
        }
      }
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
      if ('connections' == id)
        ids[id] = [ 'mariadb_processes', ...ids[id] ]
      let tasks = []
      ids[id].forEach(id => {
        tasks = [ ...tasks, this.$fetcher.get(id) ]
      })
      let resolves = await Promise.all(tasks)
      let table = null, field = null
      if ('connections' == id) {
        table = new TableFactory({id: 'mariadb_processes', items: resolves[0]}).build()
      } else {
        table = Object.entries(resolves[0]).sort((a, b) => a > b ? 1 : a < b ? -1 : 0)
        table = new TableFactory({id: 'mariadb_variables', items: table}).build()
      }
      target.contents.table = {}
      target.contents.table.tableFields = table.tableFields
      target.contents.table.tableItems = table.tableItems
      this.managements.active = id
      this.managements.completed = true
    },
  }
}
</script>

<style>

</style>
