<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from "vue";

const stream = ref<MediaStream>();
const videoTracks = ref<MediaStreamTrack[]>();
const constraints = {
  audio: true,
  video: true,
} as MediaStreamConstraints;

const videoDevices = ref<any[]>([]);
const videoRef = ref<HTMLVideoElement>();
const AdvancedOptionsSelect = ref<HTMLSelectElement>();

const isMuted = ref<boolean>(constraints.audio as boolean);
const videoVolume = ref(50);

const otherUserLists = ref<{ userid: Number; stream: MediaStream }[]>([]);

const getVideoDevices = async () => {
  return await window.navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      return devices.filter((v) => v.kind === "videoinput");
    });
};

const videoStart = async () => {
  stream.value = await navigator.mediaDevices.getUserMedia(constraints);

  if (!stream.value) return;
  videoTracks.value = stream.value.getVideoTracks();
  // console.log(videoTracks.value);
  // console.log(stream.value);

  await nextTick();
  onVideoPlay();

  cameraController();
};

const chnageCamera = async () => {
  // 카메라 변경을 위한 연결중인 트랙 삭제
  videoTracks.value?.forEach((track) => {
    track.stop();
    stream.value?.removeTrack(track);
  });

  const deviceId = AdvancedOptionsSelect.value!.value;

  stream.value = await navigator.mediaDevices.getUserMedia({
    video: { deviceId: deviceId ? { exact: deviceId } : undefined },
    audio: constraints.audio,
  });

  if (!stream.value) return;
  videoTracks.value = stream.value.getVideoTracks();

  onVideoPlay();

  cameraController();
};

/** 카메라 Pan Tilt zoom 컨트롤 */
const cameraController = () => {
  if (!stream.value) return;
  // 카메라 Pan Tilt zoom 컨트롤
  const track = stream.value.getVideoTracks()[0];
  const capabilities = track.getCapabilities();
  const settings = track.getSettings();
  for (const ptz of ["pan", "tilt", "zoom"]) {
    // Map it to a slider element.
    const input = document.querySelector(
      `input[name=${ptz}]`
    ) as HTMLInputElement;

    // input 초기화
    input.disabled = true;
    input.oninput = () => {};
    // Check whether camera supports pan/tilt/zoom.
    if (!(ptz in settings)) {
      console.warn(`Camera does not support ${ptz}.`);
      continue;
    }

    if (!input) continue;
    //@ts-ignore
    input.min = capabilities[ptz].min;
    //@ts-ignore
    input.max = capabilities[ptz].max;
    //@ts-ignore
    input.step = capabilities[ptz].step;
    //@ts-ignore
    input.value = settings[ptz];

    input.disabled = false;

    input.oninput = async (event) => {
      try {
        const constraints = { advanced: [{ [ptz]: input.value }] };
        await track.applyConstraints(constraints);
      } catch (err) {
        console.error("applyConstraints() failed: ", err);
      }
    };
  }
};

const onVideoPlay = () => {
  if (!stream.value) return;
  videoRef.value!.srcObject = stream.value!;
};

const onVideoStop = () => {
  videoRef.value!.srcObject = null;
};

// 음소거
const changeMute = async () => {
  if (!stream.value) return;

  const audio = stream.value?.getAudioTracks()[0];

  audio.enabled = !audio.enabled;

  isMuted.value = audio.enabled;
};

onMounted(async () => {
  videoDevices.value = [...(await getVideoDevices())];
  videoDevices.value.length > 0 && videoStart();
});

watch(videoVolume, (current, old) => {
  if (!videoRef.value) return;

  videoRef.value.volume = current / 100;
});
</script>

<template>
  <!-- 참고 사이트 -->
  <!-- https://webrtc.github.io/samples/ -->
  <div>Web RPC</div>
  <div v-if="stream" class="flex justify-between px-4">
    <!-- 비디오 -->
    <div>
      <!-- 카메라 선택 -->
      <select ref="AdvancedOptionsSelect" @change="chnageCamera">
        <option :value="device.deviceId" v-for="device in videoDevices">
          {{ `${device.kind}: ${device.label} id = ${device.deviceId}` }}
        </option>
      </select>

      <video ref="videoRef" autoplay playsinline></video>
    </div>
    <!-- 비디오 컨트롤러 -->
    <div>
      <h2>카메라 컨트롤러</h2>
      <div>
        <div class="label">Pan:</div>
        <input name="pan" type="range" disabled />
      </div>
      <div>
        <div class="label">Tilt:</div>
        <input name="tilt" type="range" disabled />
      </div>
      <div>
        <div class="label">Zoom:</div>
        <input name="zoom" type="range" disabled />
      </div>
      <div class="label">볼륨:</div>
      <input
        name="volume"
        v-model="videoVolume"
        type="range"
        min="0"
        max="100"
        step="10"
      />
    </div>
    <div></div>
    <!-- 시작 & 중지 버튼 -->
    <div class="">
      <button class="border px-2" @click="onVideoPlay">start</button>
      <button class="border px-2" @click="onVideoStop">stop</button>
      <button class="border px-2" @click="changeMute">
        마이크 {{ isMuted ? "중지" : "사용" }}
      </button>
    </div>
  </div>
  <div v-else>장치를 발견할수없습니다.</div>

  <div v-for="device in videoDevices">
    {{ `${device.kind}: ${device.label} id = ${device.deviceId}` }}
  </div>
</template>

<style lang="scss" scoped></style>
