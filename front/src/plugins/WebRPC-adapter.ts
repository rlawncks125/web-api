import type { App } from "vue";
import adapter from "webrtc-adapter";

export default {
  install: (app?: App<any>, options?: any) => {
    adapter.browserDetails.browser;

    console.log(adapter.browserDetails);
  },
};
