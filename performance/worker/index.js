const { Worker } = require('worker_threads');

const express = require('express');

const app = express();

const PORT = 3000;

app.get('/hi', (req, res) => {
  // 외부에서 선언된 변수에 접근할 수 없다.
  // 콜백 함수는 문자열로 변환되고 컴퓨터의 완전히 별도의 영역으로 전송된다.
  // 두 곳 사이의 클로저 스코프에 자유롭게 쉽게 접근할 수 없다.
  const worker = new Worker('./worker.js');

  // onmessage는 함수를 할당하는 속성으로 반대편에서 postMessage() 함수를 호출할 때마다 호출된다.
  // 즉, 일꾼 스레드가 애플리케이션에 메시지를 보낼 때마다 이 함수가 호출된다.
  worker.on('message', function (message) {
    console.log(message);
    res.send(`${message}`);
  });

  // 실행 중인 일꾼 스레드로 데이터를 전송할 수 있다.
  worker.postMessage('실행 시작');
});

app.get('/bye', (req, res) => {
  res.send('잘가!');
});

app.listen(PORT);
