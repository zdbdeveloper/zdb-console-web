const state = () => {
  return {
    apexCharts: {
      targetCharts: null,
      hideSeries: [],
      pathname: null
    },
  }
}

const mutations = {
  apexCharts(state, payload) {
    state.apexCharts = { ...state.apexCharts, ...payload }
  },
}

// const actions = {
//   apexCharts({ commit }, payload) {
//     commit('apexCharts', payload)
//   },
// }

export default {
  state,
  mutations
}