/*
  파일 경로 해석과 로딩(NodeJS가 어떤 모듈을 로드할지 결정하는 방법. 즉, require() 함수 작동 방법.).
  1. 핵심 모듈(e.g., http, fs, ...)을 로드하려고 시도한다. NodeJS는 자동으로 해당 모듈의 경로를 찾아내고 로드한다.
  2. 경로가 './' 또는 '../'으로 시작하는 경우 사용자 정의 모듈이라는 것을 의미한다. NodeJS는 해당 파일을 로드한다. 만약 해당 이름의 파일이 없는 경우에는 index.js가 있는 디렉토리를 로드한다. 
  3. 제삼자 모듈인 경우 node_modules 디렉터리에 저장되어 있으므로 NodeJS는 해당 디렉터리로 이동하여 모듈을 찾아내고 로드한다. 
  4. 파일을 어디에서도 찾을 수 없는 경우에는 오류가 발생하고 애플리케이션의 실행이 중지된다.

  포장(wrapping).
  모듈이 로드된 후 모듈의 코드가 특별한 함수로 포장된다. 여기서 require() 함수가 어디에서 오는지와 왜 접근할 수 있는지에 대한 답을 얻을 수 있다. 
  이것은 NodeJS는 모듈의 코드를 가져와서 즉시 실행 함수(IIFE)에 넣는다. 따라서 NodeJS는 파일에 다시 쓴 코드를 직접 실행하지 않고 모듈의 코드를 포함하는 포장 함수를 실행한다.
  포장 함수에 experts 객체, require() 함수, module 객체, __filename 객체, __dirname 객체를 전달하기에 모든 모듈에서 5개의 객체를 사용할 수 있다. 즉, 5개의 객체는 각 모듈에 주입되는 전역 변수와 같다.
  1. require() 모듈을 가져오는 함수.
  2. module은 현재 모듈에 대한 참조.
  3. exports는 모듈에서 객체를 내보내는 데 사용되는 module.exports에 대한 참조.
  4. __filename은 현재 모듈 파일의 절대 경로.
  5. __dirname은 현재 모듈의 디렉토리 이름.

  NodeJS는 이를 통해 두 가지 매우 중요한 것을 달성한다. 
  1. 개발자는 5개의 객체를 사용할 수 있다.
  2. 모듈에서 정의한 최상위 변수를 비공개로 유지한다. 따라서, 모든 것을 전역 객체로 노출시키는 대신 현재 모듈에만 스코프가 지정된다.

  실행.
  모듈의 포장 함수의 코드가 NodeJS에 의해 실행된다. 이 지점까지 require() 함수가 모듈 이름을 인자로 받아 모듈 파일의 경로가 파일로 해결되고 모든 코드가 포장 함수로 포장되어 실행되었다.

  내보내기(exports) 반환.
  require() 함수는 모듈의 내보내기를 반환한다. 내보내기는 module.exports 객체에 저장된다.
  내보내고 싶은 변수를 module.exports 객체 또는 exports 객체에 할당한다. exports 객체는 module.exports 객체의 포인터이다.
  하나의 변수 즉, 하나의 클래스 또는 하나의 함수만 내보내려는 경우 일반적으로 module.exports에 대입한다.
  여러 개의 명명(named) 변수 즉, 여러 개의 함수를 내보내려는 경우 export에 대입한다.
  이를 통해 한 모듈에서 다른 모듈로 데이터를 내보내고 가져온다.

  캐싱.
  모듈이 로드된 후에는 캐시된다. 동일한 모듈을 여러 번 요구하는 경우 항상 동일한 결과를 얻는다. 
  모듈의 코드는 실제로 첫 번째 호출에서만 실행되며 후속 호출에서는 결과가 캐시에서 검색된다.
*/

// arguments는 배열로 함수에 전달된 모든 값을 포함한다(즉, require, module, exports, __filename, __dirname).
console.log(arguments);
// 포장 함수를 저장하고 있는 wrapper 속성.
console.log(require('module').wrapper);

// module.exports
const Math = require('./math1');
const math1 = new Math();
console.log(math1.add(1, 1));

// exports
// const math2 = require('./math2');
// console.log(math2.sub(1, 1));
const { add, sub } = require('./math2');
console.log(sub(1, 1));

// 캐싱
// 모듈이 한 번 로드되었기에 '로그 모듈' 출력을 한 번만 출력된다.
require('./log')();
require('./log')();
require('./log')();

// 포장 함수를 호출할 때 this 예약어가 exports 객체를 참조한다.
console.log(this === module.exports); // true.

/*
  브라우저의 전역 객체인 window 객체와 상응하는 global 객체가 NodeJS에 존재한다.
  NodeJS를 터미널에서 실행하면 코드를 모듈로 포장하지 않는다.
  따라서, 터미널에서 NodeJS를 사용하면 전역 스코프에 있으며 this 예약어는 전역 객체인 global을 참조한다.
*/
console.log(this === global); // 파일에서는 false.

/*
  process 객체는 global 객체의 속성으로 애플리케이션 전체에서 사용할 수 있으며 NodeJS 애플리케이션의 환경에 대한 정보를 알고 싶을 때 유용하다.
  process 객체의 argv 속성은 NodeJS 애플리케이션을 시작할 때 전달하는 명령줄 인자를 포함하는 배열을 포함한다
  1번 원소는 process.execPath으로 NodeJS 애플리케이션을 시작한 파일의 절대 경로를 포함한다.
  2번 원소는 실행된 JavaScript 파일의 경로이다.
  나머지 process.argv 요소들은 추가적인 명령줄 인자이다.
*/
process.argv.forEach((arg) => console.log(arg));
