/**
 * Name: getVideoList.js
 * content: 获取视频实际下载URL
 */

const https = require("https");
const UserAgent = require("../utils/userAgent");
const store = require("../utils/store");

// 视频下载接口
const b_download_URL = 'https://api.bilibili.com/x/player/playurl';

// 请求头需要携带信息
const headers = {
  "User-Agent": UserAgent,
  "Cookie": store.getValue("SESSDATA").data,
  "Host": "api.bilibili.com"
};

module.exports = function (aid, cid, qn = 80) {
  return new Promise((resolve, reject) => {
    https.get(`${b_download_URL}?avid=${aid}&cid=${cid}&qn=${qn}`, { headers: headers },(res)=>{
      // 设置编码
      res.setEncoding('utf-8');
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end",() =>{
        resolve(JSON.parse(data).data);
      });
    }).on("error",(error) => {
      reject(error);
    });
  })
}