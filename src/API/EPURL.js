/**
 * Name: epToAid.js
 * content: 输入开头为ep的url, 爬取页面获取视频aid
 */

const https = require('https');
const cheerio = require('cheerio');
const zlib = require('zlib');
const parsingUrl = require('../utils/parsingUrl');
const SSURL = require('../API/SSURL');

module.exports = function (id) {
  let url = `https://www.bilibili.com/bangumi/play/ep${id}`;
  return new Promise(function(resolve, reject){
    let ep = https.get(url, function(res){
      let data = [];
      res.on('data',function(chunk){
        data.push(chunk);
      });
      res.on('end', function(){
        data = Buffer.concat(data);
        zlib.gunzip(data, function(err, decoded){
          let $ = cheerio.load(decoded.toString());
          let videoId = SSURL(parsingUrl($('meta[property="og:url"]')[0].attribs.content).id);
          videoId.then((res) => {
            resolve(res);
          },(error) => {
            reject(error);
          })          
        });
      });
    });
    ep.on('error', (error) => {
      reject(error);
    });
  });
};

