const state = () => {
  return {
    zdb: {},
    apexCharts: {
      pathname: null,
      targetCharts: {},
      hideSeries: [],
      period: 1800,
      step: 30
    },
  }
}

const mutations = {
  zdb(state, payload) {
    state.zdb = { ...state.zdb, ...payload }
  },
  apexCharts(state, payload) {
    state.apexCharts = { ...state.apexCharts, ...payload }
  },
}

// const actions = {
//   zdb({ commit }, payload) {
//     commit('zdb', payload)
//   },
//   apexCharts({ commit }, payload) {
//     commit('apexCharts', payload)
//   },
// }

export default {
  state,
  mutations
}