// process.env.UV_THREADPOOL_SIZE = 5;

const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const start = Date.now();

const sendRequest = () => {
  https
    .request('https://www.naver.com', (res) => {
      res.on('data', () => {});
      res.on('end', () => {
        console.log(`네트워크: ${Date.now() - start}`);
      });
    })
    .end();
};

function computeHash() {
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log(`해시: ${Date.now() - start}`);
  });
}

sendRequest();

fs.readFile('tasks.js', 'utf8', () => {
  console.log(`파일 시스템: ${Date.now() - start}`);
});

computeHash();
computeHash();
computeHash();
computeHash();

// 로그가 출력되는 순서.
// 네트워크: 135
// 해시: 1352
// 파일 시스템: 1353
// 해시: 1389
// 해시: 1399
// 해시: 1424
