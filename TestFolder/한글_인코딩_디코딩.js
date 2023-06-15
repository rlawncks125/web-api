const 한글아이디 = "김주찬";

// 방법1
const ec1 = Buffer.from(한글아이디).toString("base64");
console.log(ec1); // 6rmA7KO87LCs
const dc1 = Buffer.from(ec1, "base64").toString();
console.log(dc1); // "김주찬"

// 방법2
const ec2 = btoa(unescape(encodeURIComponent(한글아이디)));
console.log(ec2); // 6rmA7KO87LCs
const dc2 = decodeURIComponent(escape(atob(ec2)));
console.log(dc2); // "김주찬"

// 방법3
const ec3 = btoa(encodeURIComponent(한글아이디));
console.log(ec3); // JUVBJUI5JTgwJUVDJUEzJUJDJUVDJUIwJUFD
const dc3 = decodeURIComponent(atob(ec3));
console.log(dc3); // "김주찬"

// 방법4
const ec4 = encodeURI(한글아이디);
console.log(ec4); // %EA%B9%80%EC%A3%BC%EC%B0%AC
const dc4 = decodeURI(ec4);
console.log(dc4); // 김주찬
