/**
 *  Name: SSURL.js
 *  content: 解析开头为ss的url，获取整季的aid和cid
 */

const https = require('https');
const jointUrl = require('../utils/jointUrl');

module.exports = function (id) {
  let url = "https://api.bilibili.com/pgc/web/season/section";
  let options = {
    "season_id": id,
    "season_type": 1
  };
  return new Promise(function (resolve, reject) {
    let ss = https.get(url + '?' +jointUrl(options), (res) => {
      let data  = '';
      res.on('data',(chuck) => {
        data += chuck;
      });
      res.on('close', () => {
        resolve(JSON.parse(data).result);
      });
    });
    ss.on('error', (error) => {
      reject(error);
    });
  });
}

