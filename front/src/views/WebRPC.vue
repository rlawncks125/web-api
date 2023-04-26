<script setup lang="ts">
import { ref, onMounted, nextTick, reactive, type Ref, onUnmounted } from "vue";
import * as Socket from "@/api/socket";
import { onBeforeRouteLeave } from "vue-router";

const room = "testroom";

const videoDevices = ref<any[]>([]);
// const videoTracks = ref<MediaStreamTrack[]>();
const constraints = {
  audio: true,
  video: true,
} as MediaStreamConstraints;

const stream = ref<MediaStream>();
const videoRef = ref<HTMLVideoElement>();
const AdvancedOptionsSelect = ref<HTMLSelectElement>();

const peerUserStream = ref<MediaStream>();
const peerVideoRef = ref<HTMLVideoElement>();

const isMuted = ref<boolean>(constraints.audio as boolean);
const videoVolume = ref(50);

const initVloume = 0.2;

const getVideoDevices = async () => {
  return await window.navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      return devices.filter((v) => v.kind === "videoinput");
    });
};

const videoUpdate = () => {
  if (!stream.value) return;
  videoRef.value!.srcObject = stream.value!;

  cameraController();
};

const videoStart = async () => {
  stream.value = await navigator.mediaDevices.getUserMedia(constraints);

  await nextTick();
  videoUpdate();

  // onVideoStop();
  // changeMute();
  videoRef.value!.volume = initVloume;
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
        // constraints 데이터만 소켓으로 보내면 될듯
      } catch (err) {
        console.error("applyConstraints() failed: ", err);
      }
    };
  }
};

const streamEnable = (stream: MediaStream, enabled: boolean) => {
  if (!stream) return;
  stream.getVideoTracks()[0].enabled = enabled;
  stream.getAudioTracks()[0].enabled = enabled;
};

const onVideoPlay = () => {
  stream.value && streamEnable(stream.value, true);
};
const onPeerVideoPlay = () => {
  peerUserStream.value && streamEnable(peerUserStream.value, true);
};

const onVideoStop = () => {
  stream.value && streamEnable(stream.value, false);
};
const onPeerVideoStop = () => {
  peerUserStream.value && streamEnable(peerUserStream.value, false);
};

// 카메라 변경
const chnageCamera = async () => {
  if (!stream.value) return;
  // 카메라 변경을 위한 연결중인 트랙 삭제
  stream.value.getVideoTracks().forEach((track) => {
    track.stop();
    stream.value?.removeTrack(track);
  });

  const deviceId = AdvancedOptionsSelect.value!.value;

  stream.value = await navigator.mediaDevices.getUserMedia({
    video: { deviceId: deviceId ? { exact: deviceId } : undefined },
    audio: constraints.audio,
  });

  // p2p 연결 비디오 변경
  const [videoTrack] = stream.value.getVideoTracks();

  if (myPeerConnection) {
    const videoSender = myPeerConnection
      .getSenders()
      .find((sender) => sender.track?.kind === videoTrack.kind);

    videoSender && videoSender!.replaceTrack(videoTrack);
  }

  // videoTracks.value = stream.value.getVideoTracks();

  videoUpdate();
};

// 불륨 변경
const changeInputVolume = (e: any) => {
  const videowrap = e.target.parentElement as HTMLElement;
  const controller = videowrap.parentElement as HTMLElement;
  const video = controller?.querySelector("video");

  if (video) {
    video.volume = e.target.value / 100;
  }
};

// 음소거
const changeMute = async () => {
  if (!stream.value) return;

  const audio = stream.value?.getAudioTracks()[0];

  audio.enabled = !audio.enabled;

  isMuted.value = audio.enabled;
};
// ##########################
// ########## WebRTC Pp2 연결
// ##########################
let myPeerConnection = new RTCPeerConnection({
  iceServers: [
    {
      urls: [
        "stun:testapi.kimjuchan97.xyz:3478",
        "stun:testapi.kimjuchan97.xyz:3479",
      ],
    },
  ],
});

const makeConnection = async () => {
  if (!stream.value) return;
  // console.log(stream.value);
  stream.value
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, stream.value!));

  // create offer
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);

  console.log("offer", offer);
  Socket.emitOffer({
    room,
    offer,
  });
};
//
onMounted(async () => {
  videoDevices.value = [...(await getVideoDevices())];
  videoDevices.value.length > 0 && (await videoStart());
  Socket.emitJoinRoom(room);

  await makeConnection();

  myPeerConnection.addEventListener("icecandidate", (data) => {
    console.log("icecandidate", data.candidate);
    if (data.candidate) {
      myPeerConnection.addIceCandidate(data.candidate);

      Socket.emitIcecandidate({
        room: room,
        candidate: data.candidate,
      });
    }
  });
  myPeerConnection.addEventListener("track", (data) => {
    console.log("addstream", data);
    const stream = data.streams[0];
    peerUserStream.value = stream;

    peerVideoRef.value!.volume = initVloume;
  });

  Socket.catchOffer((offer) => {
    console.log("recived offer", offer);
    if (!offer) return;

    if (offer.type === "offer") {
      myPeerConnection.setRemoteDescription(offer);
      myPeerConnection.createAnswer().then((answer) => {
        myPeerConnection.setLocalDescription(answer);
        Socket.emitAnswer({ room: room, answer });
        console.log("answer", answer);
      });
    }
  });

  Socket.catchAnswer((answer) => {
    console.log("Recived answer", answer);
    if (!answer) return;
    myPeerConnection.setRemoteDescription(answer);
  });

  Socket.catchIcecandidate((candidate) => {
    console.log("Recived candidate", candidate);
    if (!candidate) return;
    myPeerConnection.addIceCandidate(candidate);
  });
});
</script>

<template>
  <!-- 참고 사이트 -->
  <!-- https://webrtc.github.io/samples/ -->
  <div>Web RPC</div>
  <!-- 비디오 wrap -->
  <div v-if="stream" class="flex justify-between px-4">
    <!-- 비디오 -->
    <div>
      <!-- 카메라 선택 -->
      <select ref="AdvancedOptionsSelect" @change="chnageCamera">
        <option :value="device.deviceId" v-for="device in videoDevices">
          {{ `${device.kind}: ${device.label} id = ${device.deviceId}` }}
        </option>
      </select>

      <div class="flex justify-between">
        <!-- 비디오 -->
        <video ref="videoRef" autoplay playsinline></video>
        <!-- <video :srcObject="stream" autoplay playsinline></video> -->
        <!-- 비디오 컨트롤러 -->
        <div class="p-4">
          <h2>비디오 컨트롤러</h2>
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
            @input="changeInputVolume"
            name="volume"
            v-model="videoVolume"
            type="range"
            min="0"
            max="100"
            step="10"
          />
          <br />
          <br />
          <!-- 시작 & 중지 버튼 -->
          <div class="">
            <button class="border px-2" @click="onVideoPlay()">start</button>
            <button class="border px-2" @click="onVideoStop()">stop</button>
            <button class="border px-2" @click="changeMute()">
              마이크 {{ isMuted ? "중지" : "사용" }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div></div>
  </div>
  <div v-else>장치를 발견할수없습니다.</div>

  <div v-for="device in videoDevices">
    {{ `${device.kind}: ${device.label} id = ${device.deviceId}` }}
  </div>

  <!-- 참여 유저 카메라 -->
  <div>
    <div>
      <h2>현재 참여 중인방 {{ room }}</h2>
      <!-- <label for="joinRoom">방 이름</label>
      <input type="text" name="" id="joinRoom" />
      <button>방 참여</button> -->
    </div>
    <!-- 참여 유저 카메라 -->
    <div class="peer-user-stream" v-if="peerUserStream">
      <div>
        <video
          ref="peerVideoRef"
          :srcObject="peerUserStream"
          autoplay
          playsinline
        ></video>
        <!-- 비디오 컨트롤러 -->
        <div class="p-4">
          <h2>비디오 컨트롤러</h2>
          <div class="label">볼륨:</div>
          <input
            @input="changeInputVolume"
            name="volume"
            type="range"
            min="0"
            max="100"
            step="10"
          />
          <br />
          <br />
          <!-- 시작 & 중지 버튼 -->
          <div class="">
            <button class="border px-2" @click="onPeerVideoPlay()">
              start
            </button>
            <button class="border px-2" @click="onPeerVideoStop()">stop</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
