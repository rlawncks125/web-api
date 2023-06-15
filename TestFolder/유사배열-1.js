// 배열
const array = ["첫번째", "두번쨰", "3번쨰"];
console.log(array[0]);
console.log(array[1]);

console.log(Array.isArray(array));

console.log("length" in array);
console.log("map" in array);
console.log("filter" in array);

// 유사 배열
const obj = {
  0: "첫번쨰",
  1: "두번쨰",
  2: "3번쨰",
  length: 3,
  // 내포된 배열 함수 사용 x
  // 같은 기능을 할려면 직접 구현해야함
  pop: function () {
    return Array.from(this).pop();
  },
  // ↑ 예제는 함수로 변환해서 기능을 구현 했지만
  // 원래는 직접 구현
};
console.log(obj[0]);
console.log(obj[1]);
console.log(obj.pop());

console.log(Array.isArray(obj));

console.log("length" in obj);
console.log("map" in obj);
console.log("filter" in obj);

// 배열에 내포되어 있는 기능들을 사용하기 위한 방법
// # Array.from()
const r1 = Array.from(obj).map((v) => v);
// # call
const r2 = Array.prototype.map.call(obj, (v) => v);
console.log(r1);
console.log(r2);

// 유사 배열 을 사용하는이유
Array.prototype.test1 = () => {};
const 배열 = ["test0"];
배열.__proto__.test2 = () => {
  return "test";
};
console.log(Array.prototype);

Object.prototype.test4 = () => {};
const 유사배열 = {
  0: "test0",
  length: 1,
};
유사배열.__proto__.test3 = () => {
  return "test";
};
console.log(Array.prototype);
console.log(Object.prototype);
