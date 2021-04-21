import Vue from "vue";
import VueI18n from "vue-i18n";
import { en } from "~/static/locale/en.js"

Vue.use(VueI18n);

export default ({ app, store }) => {
  app.i18n = new VueI18n({
    locale: store.state.locale,
    fallbackLocale: "en",
    messages: {
      en: en
    }
  });
};
