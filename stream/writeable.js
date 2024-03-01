const fs = require('fs');
const { Writable } = require('stream');

// fs 패키지의 writeFile() 메서드는 비동기적으로 파일을 작성해도 데이터의 크기가 매우 클 경우 성능이 그다지 좋지 않다.
// 또한 동일한 파일에 대해 writeFile() 메서드를 여러 번 사용하는 경우 안전하게 사용하려면 이전 작업이 완료될 때까지 기다려야 한다.
// 이러한 경우 createWriteStream() 메서드를 사용하는 것이 권장되는데 이 메서드는 쓰기 가능한(writable) 스트림을 생성한다.
const stream = fs.createWriteStream('./meal.txt');

// finish 이벤트는 end() 함수를 호출하고 모든 데이터가 전송된 후에 스트림에서 발생한다.
stream.on('finish', () => {
  console.log('파일 작성 완료!');
});

stream.write('오늘 저녁은 ');
stream.write('집밥');
stream.end();

const readStream = fs.createReadStream('./read.txt');
const writeStream = fs.createWriteStream('./write.txt');
// pipe() 메서드는 읽기 가능한 스트림에 사용할 수 있는 메서드로 쓰기 가능한 스트림이 제공되면 이를 읽기 가능한 스트림에 연결하고 데이터를 쓰기 가능한 스트림으로 전송한다.
// 모든 데이터가 전송되고 읽기 가능한 스트림이 end 이벤트를 방출하면 쓰기 가능한 스트림은 end() 함수로 닫힌다.
// 이 동작은 { end: false } 옵션으로 변경할 수 있다.
// 주의해야 할 점은 파이프 중에 오류가 발생하면 쓰기 가능한 스트림이 자동으로 닫히지 않으므로 수동으로 추적하고 닫아야 한다.
readStream.pipe(writeStream);

// createWriteStream() 메서드 이외에 직접 쓰기 가능한 스트림을 만들 수 있다.
// 모든 쓰기 가능한 스트림은 데이터를 스트림에 쓸 때 간접적으로 호출되는 _write() 메서드를 구현해야 한다.
const writable = new Writable();

// encoding은 데이터의 인코딩을 포함할 수 있는 문자열이다.
// callback() 함수를 호출하면 데이터 덩어리가 플러시(flush)되었음을 나타내며 처리를 완료했다는 것을 의미한다.
// _write() 메서드는 Writable 생성자에 전달하거나 Writable 클래스를 확장하여 사용할 수 있다.
writable._write = function (chunk, encoding, callback) {
  console.log(chunk);
  callback();
};

writable.write('오늘 점심은 양이 좀 많았다.');
