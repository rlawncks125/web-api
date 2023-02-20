<script setup lang="ts">
const location = document.location;

const openShare = async () => {
  if ("share" in navigator) {
    await navigator
      .share({
        title: "공부사이트 타이틀",
        text: "Text Text Text",
        url: location + "",
      })
      .then(() => console.log("성공 적으로 보냈습니다."))
      .catch(() => console.log("실패 하였습니다."));
  } else {
    alert("사용 불가");
    // share.js 로 모달 만들어서 대체
  }
};
</script>

<template>
  <div>
    <h2>Share</h2>
    <p>{{ location }}</p>
    <button @click="openShare">공유</button>
  </div>
</template>

<style lang="scss" scoped></style>
