<template>
  <CModal
    :show="alert.show"
    :no-close-on-backdrop="true"
    :title="alertTitle(alert)"
    :size="alert.size"
    :color="alertColor(alert)"
    class="modal-custom"
    @update:show="alert_ok()"
  >
    <p class="my-2 text-center">
      {{ alert.content }}
    </p>
    <template #footer>
      <CButton :color="alertColor(alert)" class="my-0" size="sm" @click="alert_ok()">
        <CIcon name="cil-check-circle" />
        <span class="icon-text ml-1">OK</span>
      </CButton>
    </template>
  </CModal>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState("dialog", ["alert"])
  },
  methods: {
    ...mapActions("dialog", ["alert_ok"]),
    alertTitle(alert) {
      const { title } = alert;
      return title != null ? title : "Alert";
    },
    alertColor(alert) {
      const { color } = alert;
      return color != null ? color : "primary";
    }
  }
};
</script>
