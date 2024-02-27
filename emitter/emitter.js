// 이벤트를 발생시킬 수 있는 객체를 이미터(emitter)라고 부르며 이미터를 듣고 콜백 함수인 리스너(listener)를 사용하여 반응할 수 있다.
const EventEmmiter = require('events');

const eventEmitter = new EventEmmiter();

// on() 메서드로 EventEmmiter 클래스의 인스턴스에 객체에 하나 이상의 함수를 연결할 수 있다.
// on() 메서드는 addEventListener() 메서드의 별칭이며 두 메서드는 동일한 방식으로 작동한다.
// EventEmitter 클래스 인스턴스는 리스너를 동기적으로 호출한다.
// 함수를 호출할 때마다 해당 함수의 컨텍스트가 호출 스택의 맨 위에 푸시되고 함수가 종료되면 컨텍스트가 스택에서 제거된다.
// 하나의 함수 내에서 다른 함수를 호출하면 데이터가 호출 스택에 쌓일 수 있고, 결국 스택 오버플로우를 유발할 수 있다.
// setTimeout() 함수와 같은 비동기 함수를 사용하면 콜백 함수를 이벤트 루프의 끝으로 넘기기 때문에 호출 스택이 초과되지 않는다.
eventEmitter.on('meal', function (data) {
  console.log(`아침 ${data}는 빵과 계란`);
});

eventEmitter.on('meal', function (data) {
  console.log(`점심 ${data}는 햄버거`);
  console.log(this === eventEmitter); // true
});

// emit() 메서드는 명시된 이름의 이벤트를 발생시키고 모든 EventEmmiter 클래스 인스턴스가 해당 이벤트의 리스너를 호출한다.
// emit() 메서드를 사용하면 리스너 함수에 인수를 전달할 수 있으며 리스너 함수 내에서 this 예약어 EventEmitter 클래스의 인스턴스를 참조한다.
eventEmitter.emit('meal', '식사');

// EventEmitter 클래스 인스턴스가 더 이상 리스너를 호출하지 않기를 원한다면, removeListener() 메서드를 사용할 수 있다.
// 이 메서드를 호출하여 특정 이벤트에서 리스너를 제거한다. 이벤트의 이름과 콜백 함수에 대한 참조를 제공해야 한다.
// 만약 하나 이상의 리스너 인스턴스를 추가했다면 해당 리스너를 제거하려면 여러 번 호출해야 한다.
// 혹은 removeAllListeners() 메서드를 사용하여 특정 이벤트에 대한 모든 리스너를 제거할 수 있다.
const listener = function () {
  console.log('안녕!');
};

eventEmitter.on('hi', listener);
eventEmitter.emit('hi'); // 안녕!

eventEmitter.removeListener('hi', listener);

eventEmitter.emit('hi'); // 리스너가 제거되어서 아무것도 출력되지 않는다.

// on() 메서드 혹은 addEventListener() 메서드를 사용하여 리스너를 등록하면 EventEmitter는 해당 이벤트를 발생할 때마다 리스너를 호출한다.
// once() 메서드를 사용하면 특정 이벤트에 대해 EventEmitter가 해당 리스너를 한 번 이상 호출하지 않도록 등록할 수 있다.
eventEmitter.once('repetition', () => {
  console.log('1번만 호출!');
});

eventEmitter.emit('repetition');
eventEmitter.emit('repetition');
