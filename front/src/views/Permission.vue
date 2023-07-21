<script setup lang="ts">
const requestNotifiaction = () => {
  Notification.requestPermission().then(async (permission) => {
    console.log(permission);
    if (["default", "denied", "granted"].includes(permission)) {
      if (permission === "granted") {
        console.log("허용");
      } else {
        console.log("거부");
      }
    }
  });
};

const requestGeolocation = () => {
  const success = (position: GeolocationPosition) => {
    const latiude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(position.coords);

    console.log(`위도 : ${latiude}° , 경도 ${longitude}°`);
  };

  const error = () => {
    console.log("에러 핸들링");
  };

  navigator.geolocation.getCurrentPosition(success, error);
};

const requestMidi = () => {
  const MIDISuccess = (midiAccess: MIDIAccess) => {
    console.log("MIDI ready!", midiAccess);
  };
  const fail = () => {
    console.log("MIDI fail");
  };

  navigator.requestMIDIAccess({ sysex: true }).then(MIDISuccess, fail);
};

const permissionFunctions = {
  notifications: requestNotifiaction,
  geolocation: requestGeolocation,
  midi: requestMidi,
} as { [key: string]: any };

type permissionName = keyof typeof permissionFunctions;
const requestPermissionByName = async (name: permissionName) => {
  navigator.permissions
    // @ts-ignore
    .query({ name })
    .then(async (result) => {
      console.log(result);

      if (result.state === "granted") {
        console.log("허용됨");
        await permissionFunctions[name]();
      } else if (result.state === "prompt") {
        console.log("권한 요청");
        await permissionFunctions[name]();
      } else {
        console.log("거절");
      }
      // Don't do anything if the permission was denied.
    });
};

async function allRequest() {
  const lists: permissionName[] = ["geolocation", "notifications", "midi"];

  lists.forEach((v) => {
    requestPermissionByName(v);
  });
}
</script>

<template>
  <div>Permission</div>
  <div class="flex flex-col items-start">
    <button @click="allRequest">all권한</button>
    <button @click="requestPermissionByName('notifications')">알람 권한</button>
    <button @click="requestPermissionByName('geolocation')">위치 권한</button>
    <button @click="requestPermissionByName('midi')">미디어 권한</button>
  </div>
  <div></div>
</template>

<style lang="scss" scoped></style>
