<template>
  <CListGroup>
    <CListGroupItem
      v-for="(sector, idx) in Object.entries(managements.sectors).map(v => v)"
      :key="idx"
      :class="{ 'active': managements.active == sector[0] }"
      @click="$emit('onHandleSector', sector[0])"
    >
      {{ sector[1].title }}
    </CListGroupItem>
  </CListGroup>
</template>

<script>
export default {
  props: {
    payload: { type: Object, default: null },
  },
  data () {
    return {
      ...this.$props.payload,
    }
  },
  methods: {

  }
}
</script>

<style scoped>
  .list-group-item {
    cursor: pointer;
  }
</style>