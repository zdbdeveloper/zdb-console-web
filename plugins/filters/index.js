/*
 * https://kr.vuejs.org/v2/guide/plugins.html
 */
import Vue from 'vue'
import dayjs from './dayjs'

const filters = { ...dayjs }

function install (vue, options) {
  for (const [key, value] of Object.entries(filters)) {
    vue.filter(key, value)
  }
}

Vue.use({ install })

// export default (context, inject) => {
//   context.$dayjs = dayjs
//   inject('dayjs', dayjs)
// }