/**
 * Name: getLoginInfo.js
 * Content: 获取登录状态
 */

'use strict'

const https = require('https');

function getLoginInfo(data){
  let headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'Host': 'passport.bilibili.com',
    'Origin': 'https://passport.bilibili.com',
    'Referer': 'https://passport.bilibili.com/login',
    'X-Requested-With': 'XMLHttpRequest'
  };
  let options = {
    protocol:'https:',
    hostname:'passport.bilibili.com',
    path:'/qrcode/getLoginInfo',
    port: 443,
    method: 'POST',
    headers: headers
  };
  return new Promise(function(resolve, reject){
    let post_req = https.request(options, (res)=>{
      let data = '';
      res.on('data',(chunk)=>{
        data += chunk;
      });
      res.on('end',()=>{
        resolve(JSON.parse(data));
      })
    });
    post_req.on('error',(error)=>{
      reject(error);
    })
    post_req.write(data);
    post_req.end();
  });
}

module.exports = getLoginInfo;