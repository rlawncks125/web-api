<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <div class="prose">
    <div>openai</div>
    <h1>이동</h1>
    <ul>
      <li>
        <button @click="router.push(`openai-text`)">text</button>
      </li>
      <li>
        <button @click="router.push(`openai-image`)">image</button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped></style>
