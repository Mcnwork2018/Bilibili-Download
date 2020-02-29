/**
 * Name: download.js
 * content: 
 */

const https = require('https');
const fs = require('fs');
const UserAgent = require("../utils/userAgent");
const defaultDownloadDirPath = require("../utils/defaultDownloadDirPath");

module.exports = function (dirpath, opt) {
  let default_options = {
    headers: {
      'User-Agent': UserAgent,
      'Accept': '*/*',
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Host": opt.headers.hostname,
      "If-Range": opt.headers.etag,
      "Referer": "https://www.bilibili.com/bangumi/play/ss28320",
      "Origin": 'https://www.bilibili.com',
      "Range": `bytes=${opt.headers.range}`,
      "Connection": 'keep-alive',
    }
  };
  return new Promise((resolve, reject) => {
    https.get(opt.url, default_options , (res) => {
      let writerStream = fs.createWriteStream(`${defaultDownloadDirPath}/${dirpath}/${opt.blockId}.mp4`);
      // // 视频总大小
      // let size =  opt.size;
      // // 1M = 1048576B
      // let total = (size / 1048576).toFixed(2);
      // // 视频下载完成大小
      // let cur = 0;
      // // 视频完成比例
      // let curPercent = 0.00;
      res.on('data', (chunk) => {
        writerStream.write(chunk);
        // cur += chunk.length;
        // let nowPercent = (100.0 * cur / size).toFixed(2);
        // if (nowPercent - curPercent > 1.00) {
        //   curPercent = nowPercent;
        //   console.log("Downloading" + nowPercent + '% ' + (cur / 1048576).toFixed(2) + 'MB, 共 ' + total + ' MB')
        // }
      });
      res.on('end', () => {
        writerStream.end();
        writerStream.on('finish', () => {
          resolve(`${opt.blockId} Download omplete!`);
        });
        writerStream.on('error', (error) => {
          reject(error);
        });
      })
    });
  });
}