export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: "spa",
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: "static",
  /*
   ** Nuxt server
   ** See https://nuxtjs.org/api/configuration-server/
   */
  server: { host: "0.0.0.0" },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "zdb-console-web",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    { path: "~/components", pathPrefix: false },
    { path: "~/zdb", pathPrefix: false },
  ],

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["~/assets/scss/style.scss"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~/plugins/components",
    "~/plugins/axios",
    "~/plugins/utils",
    "~/plugins/i18n",
    "~/plugins/service",
    "~/plugins/filters",
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "@nuxtjs/proxy",
    "@nuxtjs/dayjs",
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true,
  },
  proxy: {
    "/v2": {
      target: "http://localhost:9999/",     
      ws: true,
    },
    //'/v2/': { target: 'http://localhost:9999/', pathRewrite: {'^/v2/': ''}, changeOrigin: true }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
