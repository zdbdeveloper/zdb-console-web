import _ from "lodash";

export const state = {
  realm: "",
  realms: [],
  project: "",
  projects: [],
  user: {},
  loading: false,
};

export const mutations = {
  UPDATE(state, payload) {
    _.extend(state, payload);
  },
  LOADING(state, payload) {
    state.loading = payload;
  },
};

export const actions = {
  update({ commit }, payload) {
    commit("UPDATE", payload);
  },
  loading({ commit }, payload) {
    commit("LOADING", payload);
  },
  async load({ commit, state }, payload) {
    if (state.loading) {
      return;
    }

    commit("LOADING", true);

    try {
      const res = await this.$fetcher.get('profile')
      commit("LOADING", false);
      commit("UPDATE", { ...payload, ...res });
    } catch (e) {
      commit("LOADING", false);
    }
  },
};
