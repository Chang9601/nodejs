const http = require('http');

const ERROR = 300;
const option = {
  host: 'jsonplaceholder.typicode.com',
  path: '/users',
  method: 'GET',
};

const doRequest = function (option) {
  return new Promise((resolve, reject) => {
    http
      .request(
        option,
        // 콜백 함수의 1번 인자는 응답을 나타내는 IncomingMessage 클래스 인스턴스로 받은 응답에 관한 정보(상태, 헤더 및 데이터)를 포함한다.
        (response) => {
          const { headers, statusCode } = response;

          if (statusCode >= ERROR) {
            reject(new Error('네트워크 오류 발생!'));
          }

          const chunks = [];

          // IncomingMessage 클래스는 읽기 가능한 스트림을 상속하며 수신된 HTTP 헤더 및 페이로드를 구문 분석하고 방출하기 위해 별도로 생성된다.
          response.on('data', (chunk) => {
            chunks.push(chunk);
          });

          response.on('end', () => {
            const rawData = Buffer.concat(chunks).toString('utf-8');
            const data = JSON.parse(rawData);
            const metadata = headers;

            resolve({ metadata, data });
          });
        }
      )
      // request() 메서드를 사용할 때는 항상 end() 메서드를 호출하여 요청의 끝을 나타내야 한다.
      // 이는 요청 본문에 데이터를 작성하지 않는 경우에도 끝을 표시해야 한다.
      .end();
  });
};

doRequest(option)
  .then((response) => console.log(response))
  .catch((error) => console.log(error));

// request() 메서드는 http.ClientRequest 클래스의 인스턴스를 반환한다. ClientRequest 클래스는 쓰기 가능한 스트림이다.
// POST 요청으로 파일을 업로드해야 한다면, ClientRequest 객체를 사용한다.
const request = http.request(
  {
    host: 'localhost',
    port: 3000,
    path: '/carts',
    method: 'POST',
  },
  (response) => {}
);

request.write(
  JSON.stringify({
    item: 'Spring 책',
    price: 23000,
    quantity: 1,
    userId: 10,
  })
);

request.end();
