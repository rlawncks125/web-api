<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink, RouterView } from "vue-router";
import * as Socket from "@/api/socket";

const imageRef = ref();

const getImage = async () => {
  fetch("/api/stream/noStream/image/base64")
    .then((res) => res.json())
    .then(({ data }) => (imageRef.value.src = data));
};

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
    <div>
      <h2>2번째 태그 입니다. Docker 입니다.</h2>
      <h2>image baes64 redner</h2>
      <div>
        <button @click="getImage">Get Image</button>
        <img ref="imageRef" alt="불러온 이미지" />
      </div>
    </div>
  </header>

  <RouterView :key="$route.fullPath" />
</template>

<style scoped></style>
