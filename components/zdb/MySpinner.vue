<template>
  <div v-show="$store.state.spinner" class="full-page-spinner">
    <CSpinner
      :style="style"
      :color="$props.color"
      :grow="$props.grow"
    />
  </div>
</template>

<script>
export default {
  //You can bind these data for your customization
  props: {
    width: { type: String, default: '4rem' },
    height: { type: String, default: '4rem' },
    color: { type: String, default: 'success' },
    grow: { type: Boolean, default: true }
  },
  data () {
    return { 
      style: `width: ${this.$props.width}; height: ${this.$props.height};`
    }
  }
}
</script>

<style scoped>
.full-page-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .6);
  z-index: 10000;
}
</style>
