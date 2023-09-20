<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps<{
  streamName: string;
}>();
const emits = defineEmits<{
  (e: "click:streamKey", key: string): void;
}>();

const videoRef = ref<HTMLVideoElement>();

onMounted(() => {
  // @ts-ignore
  if (flvjs.isSupported()) {
    // @ts-ignore
    const flvPlayer = flvjs.createPlayer({
      type: "flv",
      url: `wss://live.juchandev.xyz/live/${props.streamName}.flv`,
    });
    flvPlayer.attachMediaElement(videoRef.value);
    flvPlayer.load();
    // flvPlayer.play();
  }
});
</script>

<template>
  <video
    ref="videoRef"
    @click="emits('click:streamKey', props.streamName)"
  ></video>
</template>

<style lang="scss" scoped></style>
