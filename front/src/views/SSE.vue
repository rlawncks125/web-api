<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  if ("EventSource" in window) {
    // use polyfills
    console.log("SSE 지원");
  }

  const evtSource = new EventSource("/api/stream/sse", {
    withCredentials: true,
  });

  evtSource.addEventListener("message", (e) => {
    // console.log(e);
    const { data } = e;
    console.log("New message", JSON.parse(data));
  });

  // connection되면
  evtSource.addEventListener("open", function (e) {
    // Connection was opened.
    console.log("con : ", e);
  });

  evtSource.addEventListener("error", function (e) {
    console.log("eer : ", e);

    // if (e.readyState == EventSource.CLOSED) {
    //   // Connection was closed.
    // }
  });
});
</script>

<template>
  <div>
    <h1>Server-Side-Event</h1>
    <p>socket 과 비슷하지만 다름</p>
    <p>
      Socket은 양방향 통신이지만 SSE는 서버에서 클라으언트로(한방향) 만 데이터를
      보냄
    </p>
    <p>SSE 는 HTTP 통신을 사용함</p>
  </div>
</template>

<style lang="scss" scoped></style>
