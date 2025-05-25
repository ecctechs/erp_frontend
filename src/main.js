import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router.js";
import "./style.css";
import i18n from "../i18n";
import VCalendar from "@peeraop21/v-calendar-buddhist";
import "@peeraop21/v-calendar-buddhist/style.css";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);

app.use(router);
app.use(i18n);
app.use(vuetify);
app.use(VCalendar, {
  locale: "th-TH",
  firstDayOfWeek: 1, // วันจันทร์เป็นวันเริ่มต้น
});

app.mount("#app");
