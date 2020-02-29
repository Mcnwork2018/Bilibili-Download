/**
 * Name: videoSign.js
 * Content: 获取断点续传视频需要的etag和Content-Range
 */

const https = require('https');
const UserAgent = require("../utils/userAgent");

module.exports = function(opt) {
  let hostname = new URL(opt.baseUrl).host;
  let defaultOptions = {
    headers: {
      'User-Agent': UserAgent,
      'Accept': '*/*',
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Host": hostname,
      "Referer": "https://www.bilibili.com/bangumi/play/ss28320",
      'Origin': 'https://www.bilibili.com',
      'Range': `bytes=${opt.segment_base.initialization}`,
      'Connection': 'keep-alive',
    }
  };
  return new Promise((resolve, reject) => {
    let res = https.get(opt.baseUrl, defaultOptions, (res) => {
      let data = "";
      res.on("data", (chuck) => {
        data += chuck;
      })
      res.on("data", () => {
        resolve({
          etag: res.headers.etag,
          contentRange: res.headers["content-range"]
        });
      });
    });
    res.on("error", (error) => {
      reject(error);
    });
  });
}