<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

const checkInstalledProgram = () => {
  // Obsidian의 URL 스킴을 사용하여 확인
  const url = "obsidian://launch";
  const iframe = document.createElement("iframe");

  // URL 스킴이 호출되었을 때 실행되는 콜백 함수
  const handleObsidianLaunch = (success: any) => {
    if (success) {
      console.log("Obsidian이 설치되었습니다.");
    } else {
      console.log("Obsidian이 설치되지 않았습니다.");
    }
  };

  // URL 스킴 호출
  iframe.src = url;
  iframe.style.display = "none";

  document.body.appendChild(iframe);

  const isTrue = () => {
    document.body.removeChild(iframe);
    handleObsidianLaunch(true);
    window.removeEventListener("blur", isTrue);
  };
  const isFlase = () => {
    document.body.removeChild(iframe);
    handleObsidianLaunch(false);
  };

  // Obsidian이 설치되어 있는지 확인
  setTimeout(function () {
    if (document.body.contains(iframe)) {
      isFlase();
    }
  }, 100);

  window.addEventListener("blur", isTrue);
};
</script>

<template>
  <br />
  <br />
  <br />
  <div>programCheck</div>
  <div @click="checkInstalledProgram">확인하기</div>
</template>

<style lang="scss" scoped></style>
