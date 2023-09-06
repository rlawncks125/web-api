import { ref } from "vue";
import { defineStore } from "pinia";

export interface Prompt {
  role: "system" | "user" | "assistant";
  content: string;
}

export const useOpenaiCache = defineStore(
  "openai-cache",
  () => {
    const itemLists = ref<Prompt[][]>([]);

    const setItem = (item: Prompt[]) => {
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
