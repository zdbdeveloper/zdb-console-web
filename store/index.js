export const state = () => {
  return {
    sidebarShow: "responsive",
    sidebarMinimize: false,
    asideShow: false,
    localAsideShow: false,
    localAsideShow2: false,
    darkMode: false,
    hidePane2: false,
    pageTitle: "",
    locale: "en",
    locales: ["en", "kr"],
    spinner: false,
  }
};

export const mutations = {
  TOGGLE_SIDEBAR_DESKTOP(state) {
    const sidebarOpened = [true, "responsive"].includes(state.sidebarShow);
    state.sidebarShow = sidebarOpened ? false : "responsive";
  },
  TOGGLE_SIDEBAR_MOBILE(state) {
    const sidebarClosed = [false, "responsive"].includes(state.sidebarShow);
    state.sidebarShow = sidebarClosed ? true : "responsive";
  },
  SETLOCALE(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale;
    }
  },
  SET(state, [variable, value]) {
    state[variable] = value;
  },
  TOGGLE(state, variable) {
    state[variable] = !state[variable];
  },
  PAGE_TITLE(state, title) {
    state.pageTitle = title;
  },
  SPINNER(state, value) {
    state.spinner = value
  },
};

export const actions = {
  toggleSidebarDesktop({ commit }) {
    commit("TOGGLE_SIDEBAR_DESKTOP");
  },
  toggleSidebarMobile({ commit }) {
    commit("TOGGLE_SIDEBAR_MOBILE");
  },
  setLocale({ commit }, value) {
    commit("SETLOCALE", value);
  },
  set({ commit }, value) {
    commit("SET", value);
  },
  toggle({ commit }, value) {
    commit("TOGGLE", value);
  },
  pageTitle({ commit }, value) {
    commit("PAGE_TITLE", value);
  },
  spinner({ commit }, value) {
    commit('SPINNER', value)
  },
};
