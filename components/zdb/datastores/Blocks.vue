<template>
  <ul class="blocks">
    <li v-for="(item, idx) in $props.payload.tableItems" :key="idx">
        <span>{{ item.variable }}</span>
        <span>{{ item.value }}</span>
    </li>
  </ul>  
</template>

<script>
export default {
  props: {
    payload: { type: Object, default: null },
  }
}
</script>

<style scoped>
.blocks { display:block; clear:both; margin: 0 0 1rem; padding: 0; border:1px solid #ccc; background: #fff; overflow:hidden }
.blocks>li { display:block; float:left; width: 33.3%; border: 1px solid #e4e7ea}
.blocks>li>span { display: block; float:left; padding: 0.4rem; overflow: hidden; text-overflow: ellipsis }
.blocks>li>span:first-child { width:70%; border-right:1px solid #e4e7ea; background-color: #f1f4f9 }
</style>
