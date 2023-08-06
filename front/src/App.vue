<script setup lang="ts">
import { onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";
import * as Socket from "@/api/socket";

onMounted(() => {
  Socket.init();

  fetch("/api/hello")
    .then((res) => res.text())
    .then((data) => {
      console.log(data);
    });
});
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
        <RouterLink to="/webRPC">Web RPC</RouterLink>
        <RouterLink to="/share">Share</RouterLink>
        <RouterLink to="/permission">Permission</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
