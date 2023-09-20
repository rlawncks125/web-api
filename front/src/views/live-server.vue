<script setup lang="ts">
import "https://cdn.bootcss.com/flv.js/1.5.0/flv.min.js";
import { onMounted, ref } from "vue";
import LiveServerVideo from "@/components/LiveServerVideo.vue";

const playerRef = ref<HTMLVideoElement>();
let playerflvPlayer: any;
const isPlayer = ref(false);
const liveLists = ref<string[]>([]);

const handlerStreamVideoKey = (stream: any) => {
  // @ts-ignore
  if (flvjs.isSupported()) {
    console.log("사용가능");

    // @ts-ignore
    playerflvPlayer = flvjs.createPlayer({
      type: "flv",
      url: `wss://live.juchandev.xyz/live/${stream}.flv`,
    });
    playerflvPlayer.attachMediaElement(playerRef.value);
    playerflvPlayer.load();
    playerflvPlayer.play();
    isPlayer.value = true;
  }
};

const onClickStopStream = () => {
  playerflvPlayer.destroy();
  playerRef.value!.src = "";
  isPlayer.value = false;
};

onMounted(() => {
  fetch("api/media-server")
    .then((res) => res.json())
    .then((data) => {
      console.log(data["live"]);
      if (data.hasOwnProperty("live")) {
        liveLists.value = Object.keys(data["live"]);
      }
    });
});
</script>

<template>
  <div>liveServer</div>
  <button @click="onClickStopStream">리셋</button>
  <video v-show="isPlayer" ref="playerRef" controls></video>
  {{ liveLists }}
  <div class="video-lists">
    <template v-for="item in liveLists">
      <LiveServerVideo
        :streamName="item"
        @click:stream-key="handlerStreamVideoKey"
      />
    </template>
  </div>
</template>

<style lang="scss">
.video-lists {
  @apply grid grid-cols-3 gap-2 px-4;

  & video {
    @apply cursor-pointer;
  }
}
</style>
