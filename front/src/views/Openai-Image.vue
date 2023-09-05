<script setup lang="ts">
import { ref } from "vue";

const openaiImage = ref("");
const openaiImageResult = ref("");
const isImageCreated = ref(false);

const chatGPTCallModelImage = () => {
  if (openaiImage.value === "") return;
  isImageCreated.value = true;
  fetch("api/openai/image", {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: openaiImage.value,
    }),
  })
    .then((res) => res.text())
    .then((url) => {
      isImageCreated.value = false;
      openaiImageResult.value = url;
    })
    .catch((err) => {
      isImageCreated.value = false;
      console.log(`Error : ${err}`);
    });
};
</script>

<template>
  <div>OpenAI-Image</div>
  <h1 class="text-[2rem]">비용</h1>
  <p>1024×1024 : $0.020</p>
  <p>512×512 : $0.018</p>
  <p>256×256 : $0.016</p>
  <br />
  <br />

  <form>
    <label for="text-promt">prompt 작성: </label>
    <br />
    <textarea
      class="border"
      name=""
      id="text-promt"
      cols="30"
      rows="10"
      v-model="openaiImage"
    ></textarea>

    <div>
      <span v-if="isImageCreated">생성중</span>
      <button
        v-else
        class="border p-2 my-2"
        @click.prevent="chatGPTCallModelImage"
      >
        생성
      </button>
    </div>
    <div>
      <p>Image Render :</p>
      <img :src="openaiImageResult" />
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
