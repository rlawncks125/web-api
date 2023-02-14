<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <div>
      <h2 class="text-green-400 text-center text-[2rem] my-[2rem]">
        Web Api 테스트 페이지 입니다.
      </h2>

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/speech">Speech</RouterLink>
        <RouterLink to="/draganddrop">Drag and Drop</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
