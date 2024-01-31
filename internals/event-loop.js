// NodeJS 애플리케이션이 시작할 때 발생하는 일련의 작업들을 작성한다(즉, NodeJS 라이프사이클).

// NodeJS 애플리케이션을 시작한다(node app.js).

// NodeJS는 JavaScript 코드에서 3개의 확인 사항에 해당하는 작업이나 타이머를 자동으로 감지한다.
// 자동 감지는 app.js를 처음 실행하는 동안에도 발생한다. 따라서, 밑의 배열들은 프로그램을 시작하는 즉시 생성된다.
// 배열들은 타이머를 호출하거나 서버를 시작하거나 파일 시스템 모듈을 사용할 때마다 요소가 추가된다.
const pendingTimers = [];
const pendingOsTasks = [];
const pendingLongRunningOperations = [];

// 의사코드
// NodeJS가 시작할 때 이벤트 루프가 즉시 실행되지 않는다. 대신 NodeJS는 파일(app.js)의 내용을 가져와서 실행한다.
app.executeContents();

// 이벤트 루프가 실행될 때마다 NodeJS는 본문의 반복을 진행할지 여부를 결정한다.
// NodeJS가 이벤트 루프에 진입하면 안 되거나 다시 실행하면 안되면 이벤트 루프의 본문 전체를 생략하고 프로그램은 터미널로 돌아간다.
function checkLoopCondition() {
  // NodeJS는 이벤트 루프가 계속 진행해야 하는지 여부를 결정하는 세 가지 확인을 수행한다.
  // 1번째 확인: setTimeout, setInterval 또는 setImmediate로 등록된 실행되어야 하는 함수가 있는지 확인한다.
  // 2번째 확인: 대기 중인 운영 체제 작업이 있는지 확인한다(e.g., 포트에 수신 중인 서버.).
  // 3번째 확인: 대기 중인 긴 실행 중인 작업이 있는지 확인한다(e.g., 파일 시스템.).

  return (
    pendingTimers.length ||
    pendingOsTasks.length ||
    pendingLongRunningOperations.length
  );
}

// 이벤트 루프(while 루프)는 계속해서 실행된다.
// 즉, 이벤트 루프의 본문이 계속 실행되며 이벤트 루프 본문의 한 번의 실행을 틱(tick)이라고 한다.
while (checkLoopCondition()) {
  // 1. NodeJS는 대기 중인 타이머(setTimeout() 및 setInterval())를 살펴보고 타이머가 만료되었다면 NodeJS는 각각에 연결된 콜백함수를 호출한다.
  // 2. NodeJS는 대기 중인 운영 체제 작업 및 대기 중인 긴 실행 작업을 살펴보고 관련 콜백함수를 호출한다.
  // 3. NodeJS는 실행을 일시 중지하고 다음 조건 중 하나가 충족될 때 다시 실행을 계속한다.
  //   - 새로운 대기 중인 운영 체제 작업이 완료될 때
  //   - 새로운 대기 중인 긴 실행 작업이 완료될 때
  //   - 타이머가 완료되기 직전일 때
  // 4. NodeJS는 대기 중인 타이머(setImmediate())를 살펴보고 타이머가 만료되었다면 콜백함수를 호출한다.
  // 5. NodeJS는 close 이벤트를 처리한다.
}

// 터미널로 돌아가기
