<template>
  <div>
    <div>
      <CDataTable
        :fields="tableFields"
        :items="tableItems"
        hover
        sorter
        striped
        table-filter
        :pagination="attrs.pagination"
        :activePage="attrs.activePage"
        :itemsPerPage="attrs.itemsPerPage"
        @page-change="attrs.page=$event"
      >
      </CDataTable>
    </div>
    <div v-if="!attrs.pagination">
      <CPagination :activePage.sync="attrs.activePage" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    payload: { type: Object, default: null },
  },
  data () {
    return {
      attrs: {
        pagination: true,
        page: 1,
        activePage: 1,
        itemsPerPage: 100
      },
      ...this.$props.payload,
    }
  },
  methods: {
  }
}
</script>

<style>

</style>