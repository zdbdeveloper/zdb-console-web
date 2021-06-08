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
  props: {
    width: { type: String, default: '4rem' },
    height: { type: String, default: '4rem' },
    color: { type: String, default: 'success' },
    grow: { type: Boolean, default: false }
  },
  data () {
    return { 
      style: `width: ${this.$props.width}; height: ${this.$props.height};`
    }
  }
}
</script>

<style />
