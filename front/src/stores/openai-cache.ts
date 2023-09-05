import { ref } from "vue";
import { defineStore } from "pinia";

export const useOpenaiCache = defineStore(
  "openai-cache",
  () => {
    const itemLists = ref<string[]>([]);

    const setItem = (item: string) => {
      itemLists.value.push(item);
    };

    const clear = () => {
      itemLists.value.length = 0;
    };

    return { itemLists, setItem, clear };
  },
  {
    persist: {
      storage: localStorage,
      paths: ["itemLists"],
    },
  }
);
