
export default function(ctx, inject) {
  const {
    $axios,
    app: { store }
  } = ctx

  const service = {
  }

  // app.$service = $service
  // Vue.prototype.$service = $service
  // https://ko.nuxtjs.org/guide/plugins#%ED%98%BC%ED%95%A9%ED%95%B4-%EC%A3%BC%EC%9E%85%ED%95%98%EA%B8%B0
  inject('service', service)
}
