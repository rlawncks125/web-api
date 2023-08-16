<script setup lang="ts">
const requestCookie = () => {
  fetch("api/cookie", {
    method: "get",
    credentials: "include",
  });
};
const checkCookie = () => {
  fetch("api/cookie", {
    method: "post",
    credentials: "include",
  });
};

const myCookie = () => {
  console.log(document.cookie);
};
</script>

<template>
  <div>cookie</div>
  <div class="flex justify-between">
    <button @click="myCookie">쿠키확인</button>
    <button @click="requestCookie">요청</button>
    <button @click="checkCookie">체크</button>
  </div>
</template>

<style lang="scss" scoped></style>
