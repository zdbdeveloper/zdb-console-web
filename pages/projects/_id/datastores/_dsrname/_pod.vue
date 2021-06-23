<template>
  <CTabs @update:activeTab="activeTab = $event"
    variant='tabs'
  >
    <br/>
    <CTab title="Overview">
      <Overview />
    </CTab>
    <CTab title="관리">
      <Management v-if="'1'==activeTab && 'mariadb'==($store.state.zdb.datastore).toLowerCase()" />      
    </CTab>
  </CTabs>
</template>

<script>
export default {
  data () {
    return {
      activeTab: 0,
    }
  },
  created () {
    this.$store.dispatch('zdb', {
      projectid: this.$route.params.id,
      name: this.$route.params.dsrname,
      pod: this.$route.params.pod,
    })
  },
  methods: { 

  },
}
</script>

<style>

</style>
