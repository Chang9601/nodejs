// require() 함수로 가져오기(CommonJS 모듈).
const { add, sub } = require('./math');

// NodeJS가 사용하는 모듈 시스템인 CommonJS에서 하나의 파일은 하나의 모듈이다.
// 내부적으로 NodeJS는 모듈을 다음과 같은 함수로 감싼다.
// (function (exports, require, module, __filename, __dirname) {
//   코드
// })
// 덕분에 최상위 레벨 변수들은 모듈에 지역적으로 적용되어 전체 프로젝트 전역에서 사용되지 않는다.
console.log('잠~');

console.log(add(1, 2));
console.log(sub(1, 1));

// NodeJS는 모듈을 감싸는 함수를 호출할 때 this 예약어가 exports 객체를 참조하도록 한다.
console.log(this === module.exports); // true

// 브라우저의 전역 객체인 window 객체와 상응하는 global 객체가 NodeJS에 존재한다.
// NodeJS를 터미널에서 실행하면 코드를 모듈로 감싸지 않는다.
// 따라서, 터미널에서 NodeJS를 사용하면 전역 스코프에 있으며 this 예약어는 전역 객체인 global을 참조한다.
console.log(this === global); // 파일에서는 false

// process 객체는 global 객체의 속성으로 애플리케이션 전체에서 사용할 수 있으며 NodeJS 애플리케이션의 환경에 대한 정보를 알고 싶을 때 유용하다.
// process 객체의 argv 속성은 NodeJS 애플리케이션을 시작할 때 전달하는 명령줄 인자를 포함하는 배열을 포함한다
// 1번 원소는 process.execPath으로 NodeJS 애플리케이션을 시작한 파일의 절대 경로를 포함한다.
// 2번 원소는 실행된 JavaScript 파일의 경로이다.
// 나머지 process.argv 요소들은 추가적인 명령줄 인자이다.
process.argv.forEach((arg) => console.log(arg));
