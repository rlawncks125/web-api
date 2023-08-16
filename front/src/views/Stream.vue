<script setup lang="ts">
import { onMounted, ref } from "vue";

const textBuffer = ref("");
const videoRef = ref<HTMLVideoElement>();
const fileWatchArray = ref("");

const readText = (
  reader: ReadableStreamDefaultReader<Uint8Array> | undefined,
  callback?: (value: any) => void
) => {
  if (!reader) return;

  reader.read().then(({ done, value }) => {
    // 더이상 처리할 데이터가 없다
    if (done) {
      console.log("stream end");
      return;
    }

    // 처리
    if (callback) {
      const decoder = new TextDecoder();
      callback(decoder.decode(value));
    }

    // 다음 stream 호출
    readText(reader, callback);
  });
};

const getTextStream = () => {
  fetch("api/stream/text").then((res) => {
    const reader = res.body?.getReader();

    readText(reader, (value) => {
      textBuffer.value += " " + value;
    });
  });
};

const watchFile = () => {
  fetch("api/stream/watch").then((res) => {
    const reader = res.body?.getReader();

    readText(reader, (value) => {
      console.log("받은 데이터 : ", value);
      fileWatchArray.value += value;
    });
  });
};
const endWatch = () => {
  fetch("api/stream/watch/end").then((res) => {
    console.log("");
  });
};

const dataToByline = (data: string) => {
  return data.split("\n");
};

onMounted(() => {});
</script>

<template>
  <div>stream APi</div>
  <button
    class="border-2 p-2 bg-gray-400 hover:bg-gray-600 text-white"
    @click="getTextStream"
  >
    GET TEXT STREAM
  </button>
  <div>
    <p>Get Text :</p>
    <span>{{ textBuffer }}</span>
  </div>
  <hr />
  <!-- 비디오 -->
  <p>Stream Video</p>
  <video ref="videoRef" controls>
    <source src="api/stream/video" type="video/mp4" />
  </video>
  <img src="api/stream/image" alt="" />
  <hr />
  <h2>File Modify Watch ( 수정된 파일 내용 감지)</h2>
  <div class="border flex gap-4">
    <button @click="watchFile">Watch</button>
    <button @click="endWatch">End</button>
  </div>
  <div class="border mt-4">
    <h2>변경된 데이터 :</h2>
    <p v-for="data in dataToByline(fileWatchArray)" v-html="data"></p>
  </div>
</template>

<style lang="scss" scoped></style>
