import { RouteConfig } from "vue-router";

export const routes: Array<RouteConfig> = [
  {
    path: "/main",
    name: "main",
    component: (): any =>
      import(/* webpackChunkName: "MainLayout" */ "@/views/main/Main.vue"),
  },
];
