import { Fetch } from '~/modules/fetch'

export default ({ app, store, $axios }, inject) => {
  Fetch.axios = $axios
  inject('fetcher', Fetch)
}