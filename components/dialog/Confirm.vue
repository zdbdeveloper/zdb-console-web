<template>
  <CModal
    :show="confirm.show"
    :no-close-on-backdrop="true"
    :title="confirm.title"
    :centered="true"
    size="sm"
    :color="confirm.color"
    class="modal-custom"
    @update:show="confirm_cancel()"
  >
    <p class="my-2 text-center">
      {{ confirm.content }}
    </p>
    <template #footer>
      <CButton
        color="secondary"
        class="my-0"
        size="sm"
        @click="confirm_cancel()"
      >
        <CIcon name="cil-arrow-circle-left" />
        <span class="icon-text ml-1">Cancel</span>
      </CButton>
      <CButton color="primary" class="my-0" size="sm" @click="confirm_ok()">
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
    ...mapState("dialog", ["confirm"])
  },
  methods: {
    ...mapActions("dialog", ["confirm_ok", "confirm_cancel"])
  }
};
</script>
