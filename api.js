/**
 * Name: bilibili视频下载器
 * Author: machunning
 * Date: 2019-10-20
 */

'use strict'
const https = require('https');
const http = require('http');
const fs = require('fs');

const defaultHeaders ={
  UserAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
}

let aid = '80758461';

let download_options = {
  headers:{
    'User-Agent': defaultHeaders.UserAgent,
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Range': 'bytes=0-',
    'Referer': 'https://www.bilibili.com/video/av' + aid,
    'Origin': 'https://www.bilibili.com',
    'Connection': 'keep-alive'
  }
};

// 请求头需要携带信息
let headers = {
  'User-Agent': defaultHeaders.UserAgent,
  'Cookie':'SESSDATA=19a5290e%2C1574498919%2C1656cfa1',
  'Host':'api.bilibili.com'
};

function get_cid(aid){
  // cid 获取接口
  const b_cid_URL = 'https://api.bilibili.com/x/web-interface/view';

  https.get(b_cid_URL + '?aid=' + aid , (res) => {
    res.setEncoding('utf-8');
    let finaldata = '';
    res.on('data', (chunk) => {
      finaldata += chunk;
    });
    res.on('end',()=>{
      finaldata = JSON.parse(finaldata).data;
      fs.readFile('./json/videoMessage.json', function(err, data){
        if (err) {
          console.log('读文件出错\n', err);
        }
        let oldvalue = JSON.parse(data.toString());
        oldvalue = {
          aid: finaldata.aid,
          cid: finaldata.cid,
          title: finaldata.title
        };
        let newValue = JSON.stringify(oldvalue);
        fs.writeFile('./json/videoMessage.json', newValue, function(err){
          if (err) {
            console.log('写文件出错\n', err);
          }
          get_video_list();
        });
      });
    });
  });
}

function get_video_list(){
  // 视频下载接口
  const b_download_URL = 'https://api.bilibili.com/x/player/playurl';
  let options = {};
  fs.readFile('./json/videoMessage.json', function(err, data){
    if (err) {
      console.log('读取文件失败\n', err);
    }
    console.log('读取文件成功');
    options = JSON.parse(data.toString());
    https.get(b_download_URL + '?avid=' + options.aid + '&cid=' + options.cid + '&qn=80', { headers: headers },(res)=>{
      // 设置编码
      res.setEncoding('utf-8');
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end',() =>{
        let finalData = JSON.parse(data).data;
        // console.log(finalData);
        fs.readFile('./json/videoMessage.json', function(err, data){
          if (err) {
            console.log(err);
          }
          let oldValue = JSON.parse(data.toString());
          oldValue.qn = finalData.accept_quality;
          oldValue.list = finalData.durl;
          let newValue = JSON.stringify(oldValue);
          fs.writeFile('./json/videoMessage.json', newValue, function(err){
            if (err) {
              console.log('视频下载列表写入失败');
            }
            main();
          })
        });
      });
    });
  });
}

function download(dirpath, opt){
  http.get(opt.url, download_options, (res)=> {
    let writerStream = fs.createWriteStream('./video/' + dirpath + '/' + opt.order + '.flv');
    // 视频总大小
    let size =  opt.size;
    // 1M = 1048576B
    let total = (size / 1048576).toFixed(2);
    // 视频下载完成大小
    let cur = 0;
    // 视频完成比例
    let curPercent = 0.00;
    console.log('开始下载');
    res.on('data', (chunk) =>{
      writerStream.write(chunk);
      cur += chunk.length;
      let nowPercent = (100.0 * cur / size).toFixed(2);
      if (nowPercent - curPercent > 1.00) {
        curPercent = nowPercent;
        console.log("Downloading" + nowPercent + '% ' + (cur / 1048576).toFixed(2) + 'MB, 共 ' + total + ' MB')
      }
    });
    res.on('end',()=>{
      writerStream.end();
      writerStream.on('finish', function(){
        console.log('Downloading complete!');
      });
      writerStream.on('error', function(error){
        console.log(error);
      });
    })
  });
}

function main(){
  fs.readFile('./json/videoMessage.json',function(err, data){
    if (err) {
      console.log('视频下载列表获取失败');
    }
    let videolist = JSON.parse(data.toString());
    fs.mkdir('./video/' + videolist.title, function (error) {
      if(error){
        console.log(error);
        return false;
      }
      console.log('创建目录 ['+ videolist.title +'] 成功');
    });
    for(let i = 0; i < videolist.list.length; i++){
      download(videolist.title, videolist.list[i]);
    }
  });
}

get_cid(aid);
