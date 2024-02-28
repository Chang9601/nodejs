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
        console.log(`network: ${Date.now() - start}`);
      });
    })
    .end();
};

function computeHash() {
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log(`hash: ${Date.now() - start}`);
  });
}

sendRequest();

fs.readFile('tasks.js', 'utf8', () => {
  console.log(`filesystem: ${Date.now() - start}`);
});

computeHash();
computeHash();
computeHash();
computeHash();

// 로그가 출력되는 순서는?
// network: 135
// hash: 1352
// filesystem: 1353
// hash: 1389
// hash: 1399
// hash: 1424
