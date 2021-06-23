<template>
  <CTabs @update:activeTab="activeTab=$event"
    justified
    variant='tabs'
  >
    <br/>
    <CTab title="서비스정보">
      <ServiceInfo />
    </CTab>
    <CTab title="스케일" />
    <CTab title="모니터링">
      <Monitoring v-if="'2'==activeTab" /> 
    </CTab>
    <CTab title="백업" />
    <CTab title="이벤트" />
    <CTab title="로그" />
    <CTab title="관리" />
  </CTabs>
</template>

<script>
export default {
  data () {
    return {
      activeTab: 0
    }
  },
  created () {
    this.$store.dispatch('zdb', {
      projectid: this.$route.params.id,
      name: this.$route.params.dsrname,
    })
  },
  methods: {
  },
}
</script>

<style scoped>
.tab-content h1 { text-align: center; margin: 3rem 0 0}
</style>
