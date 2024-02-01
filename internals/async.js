const https = require('https');

const start = Date.now();

// 일부 NodeJS 표준 라이브러리는 libuv 라이브러리의 스레드 풀을 사용하는 함수뿐만 아니라 libuv 라이브러리를 통해 운영체제에 내장된 코드를 사용하는 함수도 있다.
// 네트워크 요청의 경우 libuv 라이브러리는 요청을 만드는 것을 운영체제에 위임한다. 따라서 실제 HTTP 요청을 하는 것은 운영체제 자체이다.
// 다시말해, libuv 라이브러리는 요청을 하고 운영체제가 응답이 도착했다는 것을 알리는 것을 기다린다.
// 따라서 libuv 라이브러리가 작업을 운영체제에 위임하고 있기 때문에 운영체제가 새 스레드를 만들지 여부를 결정하거나 일반적으로 요청을 만드는 전체 과정을 처리하는 방법을 결정한다.
// 요청을 하는 것은 운영체제이기 때문에 코드 내에서 블로킹이 발생하지 않고 전혀 스레드 풀에 영향을 주지 않는다.
const sendRequest = () => {
  https
    .request('https://www.naver.com', (res) => {
      res.on('data', () => {});
      res.on('end', () => {
        console.log(Date.now() - start);
      });
    })
    .end();
};

// 대략 0.16초 - 0.2초(6개의 호출이 거의 동시에 완료.).
// 기본적으로 스레드 풀은 4개의 스레드를 가지고 있으므로 동시에 처리될 수 있는 작업은 4개 뿐인에 6개의 작업이 동시에 모두 완료된다.
// 어떻게 이게 가능할까?
sendRequest();
sendRequest();
sendRequest();
sendRequest();
sendRequest();
sendRequest();
