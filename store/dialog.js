const opt = {
  toast: {
    autohide: 3000, // ms
    show: true,
    position: undefined,
    header: undefined,
    closeButton: true,
    // Custom Properties
    content: "",
  },
  confirm: {
    show: true,
    color: "primary",
    title: "Confirm",
    content: "",
  },
  alert: {
    show: true,
    color: undefined,
    size: "sm",
    title: undefined,
    content: "",
  },
};

// Utils
const normalize = (payload) => {
  if (_.isString(payload)) {
    payload = { content: payload };
  }

  return payload;
};

const append = (target, key, value) => {
  return { ...target, ...{ [key]: value } };
};

const remove = (target, key) => {
  const remains = delete target[key];
  return { ...remains };
};

// Local State
const local = {
  confirm_promise: null,
  alert_promise: null,
};

// Store
export const state = {
  toasts: {},
  toast_counter: 0,
  confirm: {},
  alert: {},
};

export const mutations = {
  TOAST(state, payload) {
    payload = normalize(payload);

    const toast = _.extend({}, opt.toast, payload);
    state.toasts = append(state.toasts, state.toast_counter++, toast);
  },
  TOAST_ERR(state, payload) {
    payload = normalize(payload);
    payload.color = "danger";

    const toast = _.extend({}, opt.toast, payload);
    state.toasts = append(state.toasts, state.toast_counter++, toast);
  },
  TOAST_REMOVE(state, payload) {
    const { key, show } = payload;
    if (!show && key in state.toasts) {
      state.toasts = remove(state.toasts, key);
    }
  },
  // for Confirm
  CONFIRM_SHOW(state, payload) {
    payload = normalize(payload);
    const confirm = _.extend({}, opt.confirm, payload);
    state.confirm = { ...confirm };
  },
  CONFIRM_OK(state, payload) {
    state.confirm.show = false;

    if (_.isFunction(local.confirm_resolve)) {
      local.confirm_resolve();
    }

    local.confirm_promise = null;
    local.confirm_resolve = null;
    local.confirm_reject = null;
  },
  CONFIRM_CANCEL(state, payload) {
    state.confirm.show = false;

    if (_.isFunction(local.confirm_reject)) {
      local.confirm_reject();
    }

    local.confirm_promise = null;
    local.confirm_resolve = null;
    local.confirm_reject = null;
  },
  // for Alert
  ALERT_SHOW(state, payload) {
    payload = normalize(payload);
    const alert = _.extend({}, opt.alert, payload);
    state.alert = { ...alert };
  },
  ALERT_SHOW_ERROR(state, payload) {
    payload = normalize(payload);
    payload.color = "danger";
    payload.title = "Error";

    const alert = _.extend({}, opt.alert, payload);
    state.alert = { ...alert };
  },
  ALERT_OK(state, payload) {
    state.alert.show = false;

    if (_.isFunction(local.alert_resolve)) {
      local.alert_resolve();
    }

    local.alert_promise = null;
    local.alert_resolve = null;
    local.alert_reject = null;
  },
};

export const actions = {
  toast({ commit }, payload) {
    commit("TOAST", payload);
  },
  toast_err({ commit }, payload) {
    commit("TOAST_ERR", payload);
  },
  toast_remove({ commit }, payload) {
    commit("TOAST_REMOVE", payload);
  },
  confirm({ commit }, payload) {
    if (local.confirm_promise !== null) {
      return new Promise((resolve, reject) => {
        reject();
      });
    } else {
      // Create New Promise
      local.confirm_promise = new Promise((resolve, reject) => {
        local.confirm_resolve = resolve;
        local.confirm_reject = reject;
      });
    }

    commit("CONFIRM_SHOW", payload);
    return local.confirm_promise;
  },
  confirm_ok({ commit }, payload) {
    commit("CONFIRM_OK", payload);
  },
  confirm_cancel({ commit }, payload) {
    commit("CONFIRM_CANCEL", payload);
  },
  alert({ commit }, payload) {
    if (local.alert_promise !== null) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject();
      });
    } else {
      // Create New Promise
      local.alert_promise = new Promise((resolve, reject) => {
        local.alert_resolve = resolve;
        local.alert_reject = reject;
      });
    }

    commit("ALERT_SHOW", payload);
    return local.alert_promise;
  },
  alert_error({ commit }, payload) {
    if (local.alert_promise !== null) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject();
      });
    } else {
      // Create New Promise
      local.alert_promise = new Promise((resolve, reject) => {
        local.alert_resolve = resolve;
        local.alert_reject = reject;
      });
    }

    commit("ALERT_SHOW_ERROR", payload);
    return local.alert_promise;
  },
  alert_ok({ commit }, payload) {
    commit("ALERT_OK", payload);
  },
};
