<template>
  <div class="c-app" :class="{ 'c-dark-theme': $store.state.darkMode }">
    <TheSidebar />
    <TheAside />
    <CWrapper>
      <TheHeader />
      <div class="c-body">
        <main class="c-main">
          <CContainer fluid>
            <transition name="fade">
              <Nuxt />
            </transition>
          </CContainer>
        </main>
        <TheFooter />
      </div>
      <!-- Common Dialog Area -->
      <Toaster />
      <Confirm />
      <Alert />
    </CWrapper>
  </div>
</template>

<script>
import TheSidebar from "./coreui/TheSidebar";
import TheHeader from "./coreui/TheHeader";
import TheFooter from "./coreui/TheFooter";
import TheAside from "./coreui/TheAside";

export default {
  name: "TheContainer",
  components: {
    TheSidebar,
    TheHeader,
    TheFooter,
    TheAside
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
