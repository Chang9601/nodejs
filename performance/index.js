const cluster = require('cluster');

// NodeJS를 실행하면 Node는 파일의 내용을 실행하고 클러스터 관리자라고 하는 NodeJS의 복사본을 시작한다.
// 클러스터 관리자는 항상 isMaster 속성이 true로 설정되어 있다. 하지만 일꾼 인스턴스를 만들기 시작하면 false로 설정된다.
// 다시 말해, 클러스터 관리자의 경우 isMaster는 true로 모든 워커 인스턴스의 경우 isMaster는 false로 설정되어 있다.
console.log(cluster.isMaster);

// index.js 파일을 처음 실행할 때 index.js 파일이 주인 모드에서 실행되고 있으며 if 문의 cluster.fork() 메서드를 호출한다.
if (cluster.isMaster) {
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
  // index.js는 다시 실행되는데 노예 모드에서 실행된다. 만약 파일이 노예 모드라면, else 문에 케이스에 진입하고 서버로 작동한다.
  // cluster.fork() 메서드를 4번 호출하고 있기에 이는 index.js 파일이 4번 더 실행될 것이며 각각의 경우 isMaster 속성은 false로 설정된다.
} else {
  const express = require('express');

  const app = express();

  const PORT = 3000;
  const DURATION = 5000;

  // 가능한 한 많은 CPU 처리 능력을 사용하려고 하는 함수.
  const blockEventLoop = (duration) => {
    const start = Date.now();

    while (Date.now() - start < duration) {}
  };

  app.get('/hi', (req, res) => {
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

  app.get('/bye', (req, res) => {
    // /hi 주소 호출 후 /bye 호출 시
    // 클러스터를 사용하지 않거나 일꾼 인스턴스가 1개 밖에 없으면 1번째 요청(/hi)이 완료될 때까지 이벤트 루프가 다른 작업을 수행할 수 없기 때문에 대략 5초 정도 기다려야 한다.
    // 하지만 일꾼 인스턴스가 2개 이상이면 개별 서버가 각각 요청을 처리하기 때문에 1번째 요청은 5초 정도가 걸려도 2번째 요청은 0.17초 정도로 굉장히 빠르게 완료된다.

    // 애플리케이션 내에 처리 시간이 오래 걸리는 몇 가지 경로가 있지만 매우 빠른 다른 경로도 있는 경우
    // 클러스터링을 사용하면 여러 인스턴스를 시작할 수 있으며 들어오는 모든 요청을 보다 고르게 처리할 수 있다.
    res.send('잘가');
  });

  app.listen(PORT);
}
