<script src="../../nuxt.config.js"></script>
<template>
  <div>
    <CMedia>
      <h5 class="mt-0">DSR</h5>
      {{dsr}}
    </CMedia>
    <CMedia>
      <h5 class="mt-0">ZDBs</h5>
      {{zdbs}}
    </CMedia>
  </div>
</template>
<script>

export default {
  data() {
    return {
      dsr: [],
      zdbs: []
    };
  },
  created() {
    this.getDSR();
    this.getZDBs();
  },
  methods: {
    getDSR () {
      const url = '/v2/namespace/-/dsrs'
      this.$axios.$get(url, {}).then(res => {
        this.dsr = res;
      })
    },
    getZDBs () {
      const url = '/v2/namespace/-/zdbs'
      this.$axios.$get(url, {}).then(res => {
        this.zdbs = res;
      })
    },
  }
};
</script>

