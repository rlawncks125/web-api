// 이터레이터를 배워우면서 활용해본
// 리스트 만들어보어봄

/**
 *
 * @param {Array} array
 * @returns
 */
function makerIterator(array) {
  let nextIndex = 0;
  return {
    next() {
      return nextIndex < array.length
        ? { done: false, vlaue: array[nextIndex++] }
        : { done: true };
    },
    pre() {
      --nextIndex < 1 ? (nextIndex = 1) : "";
      return nextIndex > 1
        ? { done: false, value: array[nextIndex] }
        : { done: false, value: array[nextIndex - 1] };
    },
    add(item) {
      array.push(item);
    },
    remove(item) {
      array = array.filter((v) => v !== item);
    },
    pop() {
      const item = array.splice(--nextIndex, 1);
      return item;
    },
  };
}
const it2 = makerIterator(["test1", "test2"]);
const it3 = makerIterator(["3"]);
it3.add("addItem");
it3.add("deleteItem2");
it3.add("setItem3");

console.log(it2);
console.log(it2.next());
console.log(it2.next());
console.log(it2.next());

console.log(it3);
console.log(it3.next());
console.log(it3.next());
console.log(it3.next());
console.log(it3.next());
console.log(it3.next());
console.log(it3.pre());
console.log(it3.pre());
console.log(it3.pre());
console.log(it3.pre());
console.log(it3.pre());
console.log(it3.next());
console.log(it3.next());
console.log(it3.next());
console.log(it3.next());
console.log(it3.pre());
console.log(it3.pop());
console.log(it3.pre());
console.log(it3.next());
console.log(it3.next());
console.log(it3.pre());
console.log(it3.pre());
console.log(it3.next());
