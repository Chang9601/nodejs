const add = (n1, n2) => {
  return n1 + n2;
};

const sub = (n1, n2) => {
  return n1 - n2;
};

// exports 객체로 내보내기(CommonJS 모듈).
module.exports = {
  add,
  sub,
};
