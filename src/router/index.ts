import Vue from "vue";
import Router from "vue-router";
import { routes } from "./routes";

Vue.use(Router);

export const router = new Router({
  mode: "history",
  base: "/",
  scrollBehavior: () => {
    return { x: 0, y: 0 };
  },
  routes: [...routes],
});
