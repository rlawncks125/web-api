import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
import eruda from "./plugins/eruda";
import WebRPCAdapter from "./plugins/WebRPC-adapter";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(eruda);
app.use(WebRPCAdapter);

app.mount("#app");
