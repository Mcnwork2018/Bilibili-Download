/**
 * Name: AVURL.js
 * Content: 解析开头为AV的url，因为AV号后跟的就是aid，直接获取获取cid号
 */

const https = require('https');
const jointUrl = require('../utils/jointUrl');

module.exports = function (id) {
  let url = "https://api.bilibili.com/x/player/pagelist";
  let options = {
    aid: id,
    jsonp: "jsonp"
  };
  return new Promise(function (resolve, reject) {
    let av = https.get(url + '?' + jointUrl(options), (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("close", () => {
        resolve(JSON.parse(data));
      });
    });
    av.on('error', (error) => {
      reject(error);
    })
  });
}


