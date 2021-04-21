import { mapActions } from "vuex";

export const dialog = {
  methods: {
    ...mapActions("dialog", {
      _toast: "toast",
      _toast_err: "toast_err",
      _confirm: "confirm",
      // _confirm_close: 'confirm_close'
      _alert: "alert",
      _alert_error: "alert_error",
    }),
  },
};
