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

    const deleteItem = (index: number) => {
      if (confirm("정말 삭제 할껀가요??")) {
        itemLists.value = itemLists.value.filter((v, i) => i !== +index);
      }
    };

    const clear = () => {
      itemLists.value.length = 0;
    };

    return { itemLists, setItem, clear, deleteItem };
  },
  {
    persist: {
      storage: localStorage,
      paths: ["itemLists"],
    },
  }
);
