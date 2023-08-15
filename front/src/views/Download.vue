<script setup lang="ts">
const download = () => {
  fetch("api/stream/file/download")
    .then((res) => res.blob())
    .then((blob) => {
      console.log(blob);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "테스트.png");
      document.body.appendChild(link);
      link.click();
    });
};
</script>

<template>
  <div>download</div>
  <button @click="download">다운로드</button>
</template>

<style lang="scss" scoped></style>
