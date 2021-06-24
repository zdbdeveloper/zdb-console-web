<template>
  <CScrollbar class="scroll-area" :settings="settings">
    <slot />
  </CScrollbar>
</template>

<script>

export default {
  props: {
    maxLength: { type: Number, default: 200 },
    minLength: { type: Number, default: 40 }
  },
  data () {
    return {
      settings: {
        maxScrollbarLength: this.$props.maxLength,
        minScrollbarLength: this.$props.minLength,
        suppressScrollY: true,
        wheelPropagation: true,
        useBothWheelAxes: true
      }
    }
  }
}
</script>

<style>

</style>