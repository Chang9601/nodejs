const { StringDecoder } = require('string_decoder');

const stringDecoder = new StringDecoder('utf8');

// Buffer는 NodeJS에서 이진 데이터를 다루는 데 도움을 주기 위해 존재한다.
// Buffer는 메모리의 덩어리이며 바이트 배열로 생성 시 크기를 설정하고 이후에는 변경할 수 없다.
// 하나의 바이트에 저장할 수 있는 최대 숫자가 255이다. 값이 255보다 큰 경우 256으로 나누어 나머지가 요소에 할당된다.
// 바이트에 음수를 할당하려고 하면 2의 보수를 사용하여 변환된다.
const buffer = Buffer.alloc(10);

buffer[0] = 123;
buffer[1] = 256;
buffer[2] = -20;

console.log(buffer[0]); // 123
console.log(buffer[1]); // 0 === 256 % 256
console.log(buffer[2]); // 236

// Buffer는 바이트 데이터를 저장하기 때문에 문자열의 경우도 작동한다. 기본적으로 UTF-8 인코딩을 사용한한다.
// from() 메서드에 전달하는 2번 인자를 사용하여 인코딩을 변경할 수 있다. 읽기의 경우 toString() 메서드를 사용하여 쉽게 읽을 수 있다.
const lunch = Buffer.from('오늘 점심은 돼지국밥!');
console.log(lunch.toString());

// Buffer 사용 시 UTF-8 문자 중에는 하나의 바이트만으로 표현되지 않는 경우가 많아서 이로 인해 문제가 발생할 수 있다.
// 예를 들어, 긴 텍스트 파일을 해석할 때 덩어리(chunk)로 구문을 분석하는 경우 하나의 덩어리에 문자의 일부만 포함될 수 있다. 참고로, 각 버퍼는 별도로 처리된다.
// 이 경우 StringDecoder를 사용하여 문제를 해결할 수 있다. StringDecoder는 Buffer 객체를 문자열로 복호화하는 API를 제공하는 동시에 다중바이트 문자를 보존한다.
const music = [
  Buffer.from('Zack Hemsey의 명곡!'),
  Buffer.from('The Way'),
  Buffer.from([0b11110000, 0b10011111, 0b10100100, 0b10011001]),
];

const result1 = music.reduce(
  (total, piece) => `${total.toString() + piece.toString()}`
);

console.log(result1); // Zack Hemsey의 명곡!The Way???

const result2 = music.reduce(
  (total, piece) => `${total}${stringDecoder.write(piece)}`,
  ''
);

console.log(result2); // Zack Hemsey의 명곡!The Way🤙
