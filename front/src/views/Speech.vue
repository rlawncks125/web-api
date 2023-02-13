<template>
  <!-- npm install --save @types/dom-speech-recognition -->
  <div>Speech</div>
  <div class="flex justify-between">
    <h2>{{ isRecogintion ? "녹음중" : "대기" }}</h2>
    <div class="flex gap-2">
      <button class="border px-2" @click="onStart">시작</button>
      <button class="border px-2" @click="onStop">녹음끝</button>
    </div>
  </div>

  <div>
    <p ref="output"><em>출력 메세지</em></p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

let SpeechRecognition =
  // @ts-ignore
  window.SpeechRecognition || window.webkitSpeechRecognition;

let output = ref<HTMLElement>();

const isRecogintion = ref(false);

const recognition = new SpeechRecognition();

// 끊지않고 계속 음성을 인식할지 ( true해도 계속녹음 안될때가 있음 )
recognition.continuous = false;
recognition.lang = "ko-KR";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.onresult = function (event: any) {
  const text = event.results[0][0].transcript;
  output.value!.textContent = "입력 메세지: " + text;

  console.log("text: " + text.replaceAll(" ", ""));
  // 신뢰도 0~1 사이
  console.log("Confidence: " + event.results[0][0].confidence);
};

// 음성이 검출되지 않을떄 발생
recognition.onspeechend = function () {
  recoginionStop();
};

recognition.onnomatch = function (event: any) {
  console.log("I didn't recognise");
  recoginionStop();
};

recognition.onerror = function (event: any) {
  output.value!.textContent = "Error occurred in recognition: " + event.error;
};

const recoginionStart = () => {
  recognition.start();
  isRecogintion.value = true;
  console.log("녹음 시작");
};
const recoginionStop = () => {
  isRecogintion.value = false;
  recognition.stop();
  console.log("녹음 중단");
};

const onStart = () => {
  recoginionStart();
};
const onStop = () => {
  recoginionStop();
};
</script>

<style lang="scss"></style>
