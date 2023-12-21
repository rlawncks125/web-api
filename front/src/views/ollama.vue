<script setup lang="ts">
import { readStreamTextByBodyReader } from "@/utils/Stream";
import { ref } from "vue";
import { marked } from "marked";

const openaiTextResult = ref("");
const promptText = ref("");

const onClickGetOllama = () => {
  openaiTextResult.value = "";
  console.log("요청 시작");

  fetch("api/ollama/text", {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: promptText.value,
    }),
  })
    .then((res) => {
      const reader = res.body?.getReader();

      readStreamTextByBodyReader(
        reader,
        function onReadStream(value) {
          openaiTextResult.value += value;
        },
        function onDone() {
          console.log("요청 끝");
        }
      );
    })
    .catch(console.error);
};
</script>

<template>
  <div>ollama</div>
  <input type="text" name="" id="" class="border" v-model="promptText" />
  <button @click="onClickGetOllama">Get Ollama</button>

  <div class="" v-html="marked(openaiTextResult)"></div>
</template>

<style lang="scss" scoped></style>
