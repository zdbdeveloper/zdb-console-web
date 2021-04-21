<template>
  <div>
    <!-- https://coreui.io/vue/docs/components/toast.html#ctoaster-api -->
    <CToaster position="bottom-center" class="custom-toast">
      <template v-for="(toast, key) in toasts">
        <CToast
          :key="key"
          :show="toast.show"
          class="text-white font-xs"
          :class="toastColor(toast)"
          v-bind="toast"
          @update:show="toast_remove({ key, show: $event })"
        >
          {{ toast.content }}
        </CToast>
      </template>
    </CToaster>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState("dialog", ["toasts"])
  },
  methods: {
    ...mapMutations("dialog", {
      toast_remove: "toast_remove"
    }),
    toastColor(toast) {
      const { color } = toast;
      return color === "danger" ? "bg-danger" : "bg-success";
    }
  }
};
</script>
