import { Fetch } from '~/modules/fetch'

export default ({ app, store, $axios }, inject) => {
  Fetch.setAxios($axios)
  inject('fetcher', Fetch)
}