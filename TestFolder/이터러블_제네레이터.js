const arr = [1, 2, 3];
for (v of arr) console.log(v);

const iter = arr[Symbol.iterator]();
console.log(iter);
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());

const iterfor = arr[Symbol.iterator]();
for (v of iterfor) console.log(v);

// #################
// 이터러블 생성
// #################
// 객체 생성
const iter2 = {
  to: 5,
};
// 객체 -> 이터러블 객체 변환
iter2[Symbol.iterator] = function () {
  // 이터레이터 객체( Symbol.iterator ) 반환
  // 반환하는 next() 메서드가 구현되야함
  // 반환값 { done : Boolean , value: any}

  return {
    nextIndex: 0,
    last: this.to,
    next: function () {
      if (this.nextIndex <= this.last) {
        return { done: false, value: this.nextIndex++ };
      } else {
        return { done: true };
      }
    },
  };
};

for (it of iter2) console.log(it);
console.log(...iter2);
// console.log(iter2.next()) // error iter2.next not function

// #############
const iter3 = {
  to: 4,
  // 이터레이터 생성자
  [Symbol.iterator]() {
    this.nextIndex = 0;
    return this;
  },
  // next() 메서드
  next: function () {
    if (this.nextIndex <= this.to) {
      return { done: false, value: this.nextIndex++ };
    } else {
      return { done: true };
    }
  },
};
for (it of iter3) console.log(it);
console.log(...iter3);
console.log(iter3.next());

// 반복자 (이터레이터) 함수 생성
// 이터러블 객체 반환x
function makerIterator(array) {
  let nextIndex = 0;
  return {
    next() {
      return nextIndex < array.length
        ? { done: false, vlaue: [array[nextIndex++]] }
        : { done: true };
    },
  };
}
const it2 = makerIterator(["test1", "test2"]);

console.log(it2);
console.log(it2.next());
console.log(it2.next());
console.log(it2.next());

// for( it of it2) console.log(it)

// #########################
// 제너레이터
// #########################
function* generator() {
  yield 1;
  yield 2;
  yield 3;

  let index = 3;
  while (index <= 5) {
    yield index++;
  }
}

const gen = generator(); // "Generator { }"

console.log(gen.next());
console.log(gen.next());
console.log(gen.next());
console.log(gen.next());
console.log(gen.next());
console.log(gen.next());
console.log(gen.next());

const gen2 = generator();

for (it of gen2) console.log(it);
