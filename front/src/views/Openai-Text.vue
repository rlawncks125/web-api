<script setup lang="ts">
import { readTextByBodyReader } from "@/utils/Stream";
import { ref } from "vue";

import { marked } from "marked";
import { storeToRefs } from "pinia";

import { useOpenaiCache } from "@/stores/openai-cache";

const openaiText = ref("");
const openaiTextResult = ref("");
const gptModel = ref("gpt-3.5-turbo");
const isStream = ref(false);

const renderRef = ref<HTMLElement>();

// const markdown = ref<string[]>([]);

const { itemLists } = storeToRefs(useOpenaiCache());
const { setItem, clear: clearItem } = useOpenaiCache();

const chatGPTCallModelText = () => {
  if (openaiText.value === "" || gptModel.value === "") return;
  setItem(openaiText.value);
  isStream.value = true;

  fetch("api/openai/text", {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: openaiText.value,
      model: gptModel.value,
    }),
  }).then((res) => {
    openaiText.value = "";
    const reader = res.body?.getReader();
    readTextByBodyReader(
      reader,
      (value) => {
        openaiTextResult.value += value;
        renderRef.value?.scrollIntoView();
      },
      () => {
        openaiTextResult.value += "<br />";
        setItem(openaiTextResult.value);
        openaiTextResult.value = "";
        isStream.value = false;
      }
    );
  });
};
</script>

<template>
  <div class="text-center">
    <div>openaiText</div>
    <br />

    <h1 class="text-[2rem]">텍스트</h1>

    <div>
      <p>Lists</p>
      <div
        class="prose text-left mx-auto result-list"
        v-for="item in itemLists"
        v-html="marked(item)"
      ></div>
    </div>
    <div>
      <p>text Render :</p>
      <div
        ref="renderRef"
        class="prose text-left mx-auto my-2 border-t-2 bg-blue-200"
        v-html="marked(openaiTextResult)"
      ></div>
    </div>

    <div class="mt-[20rem]"></div>
    <form
      class="w-[full] h-[15rem] mx-auto fixed bottom-0 left-0 right-0 flex flex-col bg-white border-t-2 border-black"
    >
      <select v-model="gptModel" class="border-b-2 border-black">
        <option value="gpt-4">gpt-4</option>
        <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
      </select>
      <br />
      <textarea
        placeholder="여기에 질문하세요"
        class="border w-full"
        name=""
        id="text-promt"
        cols="30"
        rows="10"
        v-model="openaiText"
      ></textarea>

      <div>
        <div v-if="isStream" class="w-full text-center border p-2 my-2">
          입력중..
        </div>
        <button
          v-else
          class="border p-2 my-2 w-full"
          @click.prevent="chatGPTCallModelText"
        >
          호출
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.result-list {
  @apply py-4 my-2 border-t-2 border-b-2 px-2;

  &:nth-child(even) {
    @apply bg-green-200;
  }
  &:nth-child(2n)::before {
    display: inline-block;
    content: "Q :";
  }

  &:nth-child(odd) {
    @apply bg-blue-200;
  }
  &:nth-child(odd)::before {
    display: inline-block;
    content: "A :";
  }
}
</style>
