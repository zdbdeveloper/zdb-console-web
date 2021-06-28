<template>
  <CTabs @update:activeTab="activeTab = $event"
    variant='tabs'
  >
    <br/>
    <CTab title="Overview">
      <Overview />
    </CTab>
    <CTab title="관리">
      <Management v-if="'1'==activeTab && 'mariadb'==($store.state.datastores.zdb.datastore).toLowerCase()" />      
    </CTab>
  </CTabs>
</template>

<script>
export default {
  data () {
    return {
      //Initial data for the tabs
      activeTab: 0,
    }
  },
  created () {
    /**
     * Register Zdb data into Store
     */
    this.$store.commit('datastores/zdb', {
      projectid: this.$route.params.id,
      name: this.$route.params.dsrname,
      pod: this.$route.params.pod,
    })
  },
}
</script>

<style>

</style>
