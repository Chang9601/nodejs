const http = require('http');

const port = 3000;
const NOT_FOUND = 404;

// createServer() 메서드는 Server 클래스의 인스턴스를 반환하며 프로토타입 중 하나는 EventEmitter 클래스이다.
// request 이벤트는 서버로 요청이 전송될 때마다 발생하며 createServer() 메서드에 제공하는 리스너는 자동으로 request 이벤트에 연결된다.
// 리스너는 2개의 인자(request와 response)를 가지며 인자 모두 스트림을 상속하며 헤더, 요청 URL, 요청 HTTP 메서드와 같은 중요한 정보를 포함한다.
const server = http.createServer((request, response) => {
  // 인자 request은 IncomingMessage 클래스의 인스턴스로 읽기 가능한 스트림을 상속한다.
  // 요청에 관한 정보(상태, 메서드, URL, ...)를 가지고 있다.
  const { url, method } = request;

  if (url === '/items' && method === 'GET') {
    // HTTP 헤더는 메타 정보를 전달하고 요청 및 응답 모두에 추가된다.
    // JSON 형태로 전송하기 때문에 자원의 유형을 표현하는 Content-Type 헤더를 사용한다.
    response.setHeader('Content-Type', 'application/json');
    // 인자 response는 ServerResponse 클래스의 인스턴스로 스트림을 상속하기 때문에 end() 메서드를 사용할 수 있다.
    response.end(
      JSON.stringify([
        {
          item: 'Spring 책',
          author: '홍길똥',
          price: 23000,
          stock: 10,
          category: 'technology',
        },
      ])
    );
  } else if (url === '/items' && method === 'POST') {
  }

  response.statusCode = NOT_FOUND;
  response.end();
});

server.listen(port, (error) => {});
