const fs = require('fs');
const { Readable } = require('stream');

// 스트림은 한 번에 모든 데이터가 사용 가능하지 않을 수 있는 데이터 컬렉션을 처리하는 방법으로 모든 데이터가 메모리에 맞지 않아도 되므로 대량의 데이터를 처리할 때 효율적이다.
// 또한, 데이터의 일부만 사용 가능하면 전체 데이터가 사용 가능할 때까지 기다리지 않고도 데이터를 처리할 수 있다.
// fs 패키지의 readFile() 메서드는 비동기적으로 읽어도 전체 파일이 메모리로 로드될 때까지 어떠한 작업도 수행하지 않기 때문에 효율적이지 않다.
// 각각의 스트림은 EventEmitter 클래스의 인스턴스로 EventEmitter 클래스의 API를 사용할 수 있다.
// 버퍼를 문자열로 변환하는 데는 몇 가지 옵션이 있는데 버퍼에 직접 toString() 메서드 혹은 StringDecoder 클래스를 사용할 수 있다. 혹은, createReadStream() 메서드의 인자에서 인코딩을 지정할 수 있다.
const stream = fs.createReadStream(
  './file.txt' /*{
  encoding: 'utf-8',
}*/
);

// 파일은 여러 덩어리로 분할되며 스트림은 데이터의 덩어리를 방출할 때마다 data 이벤트를 발생시킨다. 덩어리는 Buffer 인스턴스이다.
// 흐르는 모드에서는 데이터가 기본 시스템에서 자동으로 읽혀 이벤트를 통해 EventEmitter 인터페이스를 통해 애플리케이션으로 가능한 빨리 제공된다.
// 일시 중단 모드에서는 stream.read() 메서드를 명시적으로 호출하여 스트림에서 데이터 덩어리를 읽어야 한다.
// 모든 읽기 가능한 스트림은 일시 중단 모드에서 시작하지만 다음 중 하나의 방법으로 흐르는 모드로 전환할 수 있다.
// 1.'data' 이벤트 핸들러 추가.
// 2. stream.resume() 메서드 호출.
// 3. stream.pipe() 메서드를 사용하여 데이터를 Writable로 보내기.

// 데이터를 받기 시작하기 전에 스트림을 흐르는 모드로 전환한다.
// 읽기 가능한 스트림을 핸들러가 준비되지 않은 상태에서 흐르는 모드로 전환하면 데이터가 손실된다.
// 즉, 3초라는 시간 동안 data 이벤트가 발생하면 아직 이벤트 리스너가 설정되지 않았기 때문에 로그 출력을 볼 수 없다.
stream.resume(); // 주석 해제 시 로그 출력 없음!
setTimeout(() => {
  stream.on('data', (chunk) => {
    console.log(chunk);
  });
}, 3000);

const readStream1 = new Readable({ encoding: 'utf-8' });
// push() 메서드는 데이터가 내부 큐에 추가되어 사용자가 소비할 수 있다. null을 전달하면 스트림이 데이터 출력을 완료했음을 나타낸다.
readStream1.push('오늘 점심은');
readStream1.push('맛있는 국수!');
readStream1.push('배부르다~');
readStream1.push(null);

// 스트림은 생성 시 일시 중단된 모드에 있기 때문에 data 이벤트 리스너로 덩어리를 받기 때문에 데이터가 손실 방지를 위해 data 이벤트 전에 데이터를 푸시한다.
readStream1.on('data', (chunk) => {
  console.log(chunk);
});

const readStream2 = new Readable({ encoding: 'utf-8' });
readStream2.push('오늘 점심은');
readStream2.push('맛있는 국수!');
readStream2.push('배부르다~');
readStream2.push(null);

// 일시 중단 모드에 있는 읽기 가능한 스트림에서 데이터를 읽으려면 먼저 스트림이 데이터를 읽을 수 있음을 나타내는 readable 이벤트를 방출할 때까지 기다려야 한다.
// stream.read() 메서드를 명시적으로 호출하여 스트림에서 데이터 덩어리를 읽는다.
// 스트림은 end 이벤트가 발생하기 직전에 readable 이벤트를 방출한다.
readStream2.on('readable', () => {
  let chunk;
  while (null !== (chunk = readStream2.read())) {
    console.log(`${chunk}`);
  }
});
