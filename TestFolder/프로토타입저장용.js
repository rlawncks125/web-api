// __proto__ = [[Prototype]] 으로 표기되나봄?

// 오브젝트
// 모든 오브젝트 객체는 Object를 상속받음
const obj1 = {
  name: "오브젝트",
};

console.log(obj1.hasOwnProperty("name"));

console.log("hasOwnProperty" in obj1);
console.log("hasOwnProperty" in Object.prototype);

// __proto__ 프로퍼티는 자신 부모 객체의 prototype 을 가르킴
console.log(obj1.__proto__ === Object.prototype);
console.log(obj1.__proto__);
console.log(obj1.prototype);

// function
// 모든 함수는 Function을 상속받음
function Person(name) {
  this.name = name;
}
Person.prototype.test = () => {
  return "test funtion";
};

var foo = new Person("Lee");

console.log(Person.__proto__ === Function.prototype);
console.log(foo.__proto__ === Person.prototype);

// Person() 생성자 함수에 의해 생성된 객체를 생성한 객체는 Person() 생성자 함수이다.
console.log(Person.prototype.constructor === Person);

// foo 객체를 생성한 객체는 Person() 생성자 함수이다.
console.log(foo.constructor === Person);

// Person() 생성자 함수를 생성한 객체는 Function() 생성자 함수이다.
console.log(Person.constructor === Function);

console.log(Function.prototype);
console.log(Person.__proto__);
console.log(Person.constructor);
console.log(Person.prototype);
console.log(foo.__proto__);
console.log(foo.constructor);
console.log(foo.prototype);
console.log("test" in foo);
console.log(foo.test);
