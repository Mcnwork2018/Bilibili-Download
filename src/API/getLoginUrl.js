/*
 *  Name: getLoginUrl.js
 *  Content: 二维码登录
 */

const https = require('https');
const LoginUrl = 'https://passport.bilibili.com/qrcode/getLoginUrl';

let getLoginUrl = function (){
  return new Promise(function(resolve, reject){
    https.get(LoginUrl, (res)=>{
      let data = '';
      res.on('data',(chunk)=>{
        data += chunk;
      });
      res.on('end',()=>{
        resolve(JSON.parse(data));
      });
    }).on('error',(e)=>{
       reject(e); 
    });
  });
};

module.exports = getLoginUrl;