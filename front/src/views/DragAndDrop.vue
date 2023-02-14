<template>
  <div class="flex justify-between">
    <p>Drag and Drop Api ( DataTransfer )</p>
    <button class="border p-2" @click="addList">ADD LIST</button>
  </div>
  <div class="flex justify-between">
    <div
      class="border px-[2rem] py-[2rem]"
      v-for="(item, Tindex) in items"
      :key="Tindex"
      @dragover.prevent
      @dragenter.prevent
      @drop.prevent="dropTable_handler($event, Tindex)"
    >
      <div
        v-for="(data, itemIndex) in item"
        draggable="true"
        @dragstart="dragStart_handler($event, Tindex, itemIndex, data)"
        @dragover.prevent
        @dragenter.prevent
        @drop.prevent="dropChangeItem($event, Tindex, itemIndex)"
      >
        {{ data.data }}
      </div>
    </div>
  </div>
  <h2>배치 안된 아이템들</h2>
  <div
    v-for="data in noneMoveItems"
    draggable="true"
    @dragstart="dragStart_handler($event, undefined, undefined, data)"
  >
    {{ data.data }}
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";

interface Item {
  id: number;
  data: string;
}

const items = reactive<Array<Item[]>>([
  [
    { id: 1, data: "1 입니다." },
    { id: 2, data: "2 입니다." },
    { id: 3, data: "3 입니다." },
    { id: 4, data: "4 입니다." },
  ],
  [
    { id: 5, data: "5 입니다." },
    { id: 6, data: "6 입니다." },
    { id: 7, data: "7 입니다." },
  ],
  [
    { id: 8, data: "8 입니다." },
    { id: 9, data: "9 입니다." },
    { id: 10, data: "10 입니다." },
  ],
]);

let noneMoveItems = reactive<Item[]>([
  {
    id: 42145,
    data: "42145 입니다",
  },
  {
    id: 21315,
    data: "21315 입니다",
  },
]);

const addList = () => {
  items.push([]);
};

const dragStart_handler = (
  e: any,
  moveIndex: number | undefined,
  itemIndex: number | undefined,
  item: Item
) => {
  e.dataTransfer?.setData(
    "item",
    JSON.stringify({ moveIndex, itemIndex, item })
  );
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.dropEffect = "move";
};

const dropTable_handler = (e: any, dropIndex: number) => {
  const { moveIndex, item } = JSON.parse(e.dataTransfer?.getData("item")) as {
    moveIndex: number;
    itemIndex: number;
    item: Item;
  };

  // 같은 테이블일시 동작x dropChangeItem 작동
  if (moveIndex === dropIndex) {
    return;
  }

  // 기존 데이터 삭제
  if (items[moveIndex]) {
    items[moveIndex] = items[moveIndex].filter((v) => v.id !== item.id);
  } else {
    noneMoveItems = noneMoveItems.filter((v) => v.id !== item.id);
  }
  // 이동
  items[dropIndex] = [...items[dropIndex], item];

  console.log(`moveTableIndex : ${moveIndex} -> ${dropIndex}`, item);
};

const dropChangeItem = (e: any, dropIndex: number, targetItemIndex: number) => {
  const { moveIndex, itemIndex, item } = JSON.parse(
    e.dataTransfer?.getData("item")
  ) as {
    moveIndex: number;
    itemIndex: number;
    item: Item;
  };

  // 같은 테이블 일때만 작동
  if (moveIndex !== dropIndex) return;
  const targetItem = items[moveIndex].splice(targetItemIndex, 1, item);
  items[moveIndex].splice(itemIndex, 1, ...targetItem);

  console.log("change", itemIndex, targetItemIndex);
};
</script>

<style scoped></style>
