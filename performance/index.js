const express = require('express');

const app = express();

const PORT = 3000;
const DURATION = 5000;

// 가능한 한 많은 CPU 처리 능력을 사용하려고 하는 함수.
const blockEventLoop = (duration) => {
  const start = Date.now();

  while (Date.now() - start < duration) {}
};

app.get('/', (req, res) => {
  // 코드는 이벤트 루프 내에서 실행되며 스레드 풀 혹은 운영체제가 처리하지 않는다.
  // 상수 Duration의 값만큼 while 루프를 실행하는 동안 이벤트 루프는 다른 작업을 수행할 수 없다.
  // 즉, 다른 요청을 처리할 수 없으며 데이터베이스 쿼리나 파일 쓰기 같은 다른 작업을 수행할 수 없다.
  // 다시 말해, blockEventLoop() 함수가 이벤트 루프를 블록킹 한다!

  // 브라우저의 Inspect의 Network에 들어가서 Time을 보면 대략 5초가 걸린다.
  // http://localhost:3000을 주소로 두 개의 탭을 동시에 클릭하면 하나는 5초에 끝나고 다른 하나는 거의 10초에 끝난다.
  // 따라서, NodeJS 내에서 실행 시간이 오래 걸리거나 연산 집약적인 코드는 성능에 치명적인 영향을 줄 수 있다.
  blockEventLoop(DURATION);
  res.send('안녕!');
});

app.listen(PORT);
