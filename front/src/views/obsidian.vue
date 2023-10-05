<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
const path = route.query.path || "출력파일";
</script>

<template>
  <div class="max-h-[90vh]">
    <div>
      <p>Obsidian</p>
      <div>
        <RouterLink to="/obsidian?path=export-obsidian-test"
          >export-obsidian-test</RouterLink
        >
        <RouterLink to="/obsidian?path=출력파일">출력파일</RouterLink>
      </div>
    </div>

    <object
      :data="`public/${path}/홈.html`"
      type="text/html"
      class="w-full h-[100vh]"
    >
      Your browser does not support embedding HTML.
    </object>

    <!-- <iframe
      src="public/export-obsidian-test/홈.html"
      class="w-full h-[100vh]"
    /> -->
    <!-- <object
      data="public/출력파일/홈.html"
      type="text/html"
      class="w-full h-[100vh]"
    >
      Your browser does not support embedding HTML.
    </object> -->

    <!-- <embed
      src="public/obsidian/연습.html"
      class="w-full h-[100vh]"
      type="text/html"
    /> -->
  </div>
</template>

<style lang="scss"></style>
