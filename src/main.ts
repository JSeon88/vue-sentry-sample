import Vue from "vue";
import App from "./App.vue";
import { router } from "./router";
import { initSentry } from "./util/sentryUtil";

Vue.config.productionTip = false; // true 인 경우 vue devtool 작동이 안됨

initSentry();

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
