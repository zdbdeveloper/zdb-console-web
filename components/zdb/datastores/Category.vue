<template>
  <CListGroup>
    <CListGroupItem
      v-for="(category, idx) in $props.payload.categories"
      :key="idx"
      :class="{ 'active': $props.payload.active == category[0] }"
      @click="$emit('onHandleCategory', category[0])"
    >
      {{ category[1].title }}
    </CListGroupItem>
  </CListGroup>
</template>

<script>
export default {
  props: {
    payload: { type: Object, default: null },
  }
}
</script>

<style scoped>
  .list-group-item {
    cursor: pointer;
  }
</style>