import { createI18n } from "vue-i18n";
import en from "./src/lang/en/en.json";
import th from "./src/lang/th/th.json";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("lang") || "th",
  fallbackLocale: "th",
  messages: {
    en,
    th,
  },
});

export default i18n;
