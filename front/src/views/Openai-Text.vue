<script setup lang="ts">
import { readStreamTextByBodyReader } from "@/utils/Stream";
import { onMounted, ref, toRaw } from "vue";

import { marked } from "marked";
import { storeToRefs } from "pinia";

import { useOpenaiCache, type Prompt } from "@/stores/openai-cache";

const openaiText = ref("");
const openaiTextResult = ref("");
const gptModel = ref("gpt-3.5-turbo");
const isStream = ref(false);

const bottomEndRef = ref<HTMLElement>();

const checkLists = ref<any[]>([]);
const concept = ref();

const { itemLists } = storeToRefs(useOpenaiCache());
const { setItem, clear: clearItem, deleteItem } = useOpenaiCache();

const onClickCallChatGPT = () => {
  if (openaiText.value === "" || gptModel.value === "") return;

  const newPrompt: Prompt[] = [];

  newPrompt.push({ role: "user", content: openaiText.value });
  isStream.value = true;

  // 선택된 Prompt 찾기
  const selectLists = itemLists.value.filter((v, i) =>
    checkLists.value.includes(i)
  );

  // @ts-ignore
  const selectPrompt = selectLists.map(toRaw).flat(2);

  const pushPrompt: Prompt[] = [
    {
      role: "system",
      content: concept.value || "당신은 조수입니다.",
    },
    ...selectPrompt,
    newPrompt[0],
  ];

  console.log(pushPrompt);

  fetch("api/openai/text", {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: gptModel.value,
      messages: pushPrompt,
    }),
  })
    .then((res) => {
      const reader = res.body?.getReader();

      readStreamTextByBodyReader(
        reader,
        function onReadStream(value) {
          openaiTextResult.value += value;
          bottomEndRef.value?.scrollIntoView({
            inline: "end",
          });
        },
        function onDone() {
          newPrompt.push({
            role: "assistant",
            content: openaiTextResult.value,
          });
          setItem(newPrompt);

          openaiText.value = "";
          openaiTextResult.value = "";

          isStream.value = false;
          checkLists.value.length = 0;
        }
      );
    })
    .catch(console.error);
};

onMounted(() => {});
</script>

<template>
  <div class="text-center">
    <div>openaiText</div>
    <br />
    <div class="flex justify-center gap-2">
      <h1 class="text-[2rem]">텍스트</h1>
      <button @click="clearItem" class="border p-2 bg-red-500 text-white">
        초기화
      </button>
    </div>

    <div>
      <p>Lists</p>
      <div class="flex flex-col justify-center max-w-[50vw] mx-auto">
        <!-- 요청 기록 List -->
        <div v-for="([user, assistant], index) in itemLists">
          <div class="flex justify-between">
            <div class="checkbox-wrapper-10">
              <input
                class="tgl tgl-flip"
                type="checkbox"
                :id="`list-${index}`"
                :value="index"
                v-model="checkLists"
              />
              <label
                class="tgl-btn"
                :for="`list-${index}`"
                data-tg-off="Nope"
                data-tg-on="Yeah!"
              ></label>
            </div>
            <div>
              <button
                class="bg-red-400 text-white p-1 px-2 rounded-md font-bold"
                @click="deleteItem(index)"
              >
                Delete
              </button>
            </div>
          </div>
          <div
            class="result-list"
            :class="user.role"
            v-html="marked(user.content)"
          ></div>

          <div
            class="result-list"
            :class="assistant.role"
            v-html="marked(assistant.content)"
          ></div>
        </div>
        <!-- 요청 Render -->
        <div v-if="isStream">
          <div class="result-list user">
            <p>{{ openaiText }}</p>
          </div>
          <div
            class="result-list assistant my-2 border-t-2"
            v-html="marked(openaiTextResult)"
          ></div>
        </div>
      </div>
    </div>

    <!-- 입력 From -->
    <div ref="bottomEndRef" class="mt-[20rem]"></div>
    <form
      class="w-[full] h-[15rem] mx-auto fixed bottom-0 left-0 right-0 flex flex-col bg-white border-t-2 border-black"
    >
      <select v-model="gptModel" class="border-b-2 border-black">
        <option value="gpt-4">gpt-4</option>
        <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
      </select>

      <div class="w-full flex justify-start">
        <label for="concept">컨셉 :</label>
        <input
          class="border flex-1 w-full"
          type="text"
          id="concept"
          v-model="concept"
        />
      </div>

      <textarea
        placeholder="여기에 질문하세요"
        class="border w-full p-2"
        name=""
        id="text-promt"
        cols="30"
        rows="10"
        v-model="openaiText"
      ></textarea>

      <div>
        <div v-if="isStream" class="w-full text-center border p-2 my-2">
          입력중..
        </div>
        <button
          v-else
          class="border p-2 my-2 w-full"
          @click.prevent="onClickCallChatGPT"
        >
          호출
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.result-list {
  @apply py-4 my-2 border-t-2 border-b-2 px-2 prose text-left max-w-full;

  &.user {
    @apply bg-green-200;
  }
  &.user::before {
    display: inline-block;
    content: "Q :";
  }

  &.assistant {
    @apply bg-blue-200;
  }
  &.assistant::before {
    display: inline-block;
    content: "A :";
  }
}

.checkbox-wrapper-10 .tgl {
  display: none;
}
.checkbox-wrapper-10 .tgl,
.checkbox-wrapper-10 .tgl:after,
.checkbox-wrapper-10 .tgl:before,
.checkbox-wrapper-10 .tgl *,
.checkbox-wrapper-10 .tgl *:after,
.checkbox-wrapper-10 .tgl *:before,
.checkbox-wrapper-10 .tgl + .tgl-btn {
  box-sizing: border-box;
}
.checkbox-wrapper-10 .tgl::-moz-selection,
.checkbox-wrapper-10 .tgl:after::-moz-selection,
.checkbox-wrapper-10 .tgl:before::-moz-selection,
.checkbox-wrapper-10 .tgl *::-moz-selection,
.checkbox-wrapper-10 .tgl *:after::-moz-selection,
.checkbox-wrapper-10 .tgl *:before::-moz-selection,
.checkbox-wrapper-10 .tgl + .tgl-btn::-moz-selection,
.checkbox-wrapper-10 .tgl::selection,
.checkbox-wrapper-10 .tgl:after::selection,
.checkbox-wrapper-10 .tgl:before::selection,
.checkbox-wrapper-10 .tgl *::selection,
.checkbox-wrapper-10 .tgl *:after::selection,
.checkbox-wrapper-10 .tgl *:before::selection,
.checkbox-wrapper-10 .tgl + .tgl-btn::selection {
  background: none;
}
.checkbox-wrapper-10 .tgl + .tgl-btn {
  outline: 0;
  display: block;
  width: 4em;
  height: 2em;
  position: relative;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.checkbox-wrapper-10 .tgl + .tgl-btn:after,
.checkbox-wrapper-10 .tgl + .tgl-btn:before {
  position: relative;
  display: block;
  content: "";
  width: 50%;
  height: 100%;
}
.checkbox-wrapper-10 .tgl + .tgl-btn:after {
  left: 0;
}
.checkbox-wrapper-10 .tgl + .tgl-btn:before {
  display: none;
}
.checkbox-wrapper-10 .tgl:checked + .tgl-btn:after {
  left: 50%;
}

.checkbox-wrapper-10 .tgl-flip + .tgl-btn {
  padding: 2px;
  transition: all 0.2s ease;
  font-family: sans-serif;
  perspective: 100px;
}
.checkbox-wrapper-10 .tgl-flip + .tgl-btn:after,
.checkbox-wrapper-10 .tgl-flip + .tgl-btn:before {
  display: inline-block;
  transition: all 0.4s ease;
  width: 100%;
  text-align: center;
  position: absolute;
  line-height: 2em;
  font-weight: bold;
  color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 4px;
}
.checkbox-wrapper-10 .tgl-flip + .tgl-btn:after {
  content: attr(data-tg-on);
  background: #02c66f;
  transform: rotateY(-180deg);
}
.checkbox-wrapper-10 .tgl-flip + .tgl-btn:before {
  @apply bg-yellow-500;

  content: attr(data-tg-off);
}
.checkbox-wrapper-10 .tgl-flip + .tgl-btn:active:before {
  transform: rotateY(-20deg);
}
.checkbox-wrapper-10 .tgl-flip:checked + .tgl-btn:before {
  transform: rotateY(180deg);
}
.checkbox-wrapper-10 .tgl-flip:checked + .tgl-btn:after {
  transform: rotateY(0);
  left: 0;
  background: #7fc6a6;
}
.checkbox-wrapper-10 .tgl-flip:checked + .tgl-btn:active:after {
  transform: rotateY(20deg);
}
</style>
