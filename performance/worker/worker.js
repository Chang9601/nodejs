const { parentPort } = require('worker_threads');

// 애플리케이션이 postMessage() 함수를 호출할 때 실행되는 함수.
parentPort.on('message', (message) => {
  console.log(message);

  let cnt = 0;
  while (cnt < 1e9) {
    cnt++;
  }

  // 일꾼 스레드에서 애플리케이션으로 데이터를 전달한다.
  parentPort.postMessage(`${cnt}`);
});
