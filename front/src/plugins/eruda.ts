import eruda from "eruda";
import type { App } from "vue";

// 모바일 개발자 모드 접근 하게 해주는 라이브러리
export default {
  install: (app?: App<any>, options?: any) => {
    eruda.init();
  },
};
