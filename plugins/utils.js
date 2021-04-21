import Vue from 'vue'
import lodash from 'lodash'

Vue.use((vm, options) => {
  vm.prototype._ = lodash
})
