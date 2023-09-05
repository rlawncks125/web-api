import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
import eruda from "./plugins/eruda";
import WebRPCAdapter from "./plugins/WebRPC-adapter";

import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
// app.use(eruda);
app.use(WebRPCAdapter);

app.mount("#app");
