/**
 * https://axios.nuxtjs.org/extend.html
 * https://axios.nuxtjs.org/helpers.html#interceptors
 * https://axios.nuxtjs.org/options.html#prefix-host-and-port
 *
 * https://ko.nuxtjs.org/api/context/
 *
 * https://auth.nuxtjs.org/guide/scheme.html#creating-your-own-scheme
 */

function beforeReq(config) {
  console.debug(`axios :: ${config.method} ${config.url}`)
}

function afterRes(store) {
  return function(res) {
    const {
      config: { method, toast = true },
      status
    } = res
    console.debug(`[plugins/axios.js] - res.config.toast = ${toast}`)

    // Show Response Toast
    if (toast && status === 200) {
      if (['put', 'post'].includes(method)) {
        store.commit('dialog/toast', 'Saved')
      } else if (method === 'delete') {
        store.commit('dialog/toast', 'Removed')
      }
    }
  }
}

function afterErr(store) {
  return function(err) {
    const { status, headers, data } = err.response || {}
    console.debug('[plugins/axios.js] - onError', status, data, err)

    // Handle Unautorization (Redirect)
    if (status === 401) {
      if (data.location) {
        location.href = data.location
      } else if (headers.location) {
        location.href = headers.location || '/'
      } else {
        debugger
        location.href = '/'
      }
      return
    }

    // Show Response Toast
    const {
      config: { toast = true }
    } = err
    console.debug(`[plugins/axios.js] - err.config.toast = ${toast}`)
    toast && store.commit('dialog/toast_err', 'Request Failed')
  }
}

export default function({ store, $axios }) {
  console.debug('[plugins/axios.js] - Setup...')
  $axios.onRequest(beforeReq)
  $axios.onResponse(afterRes(store))
  $axios.onError(afterErr(store))
}
