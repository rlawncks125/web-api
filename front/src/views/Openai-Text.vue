<script setup lang="ts">
import { readTextByBodyReader } from "@/utils/Stream";
import { ref } from "vue";

import { marked } from "marked";

const openaiText = ref("");
const openaiTextResult = ref("");

const renderRef = ref<HTMLElement>();

const markdown = ref<string[]>([]);

const chatGPTCallModelText = () => {
  if (openaiText.value === "") return;
  markdown.value.push(openaiText.value);

  fetch("api/openai/text", {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: openaiText.value,
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
        markdown.value.push(openaiTextResult.value);
        openaiTextResult.value = "";
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
    <form class="mx-auto" @sumbit.prevent="chatGPTCallModelText">
      <label for="text-promt">prompt : </label>
      <br />
      <textarea
        class="border"
        name=""
        id="text-promt"
        cols="30"
        rows="10"
        v-model="openaiText"
      ></textarea>

      <button class="border p-2 my-2">호출</button>
      <div>
        <p>Lists</p>
        <div
          class="prose text-left mx-auto result-list"
          v-for="item in markdown"
          v-html="marked(item)"
        ></div>
      </div>
      <div>
        <p>text Render :</p>
        <div
          ref="renderRef"
          class="prose text-left mx-auto py-4 my-2 border-t-2 bg-blue-200"
          v-html="marked(openaiTextResult)"
        ></div>
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
