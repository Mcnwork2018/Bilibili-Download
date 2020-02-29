const { ipcMain, dialog, BrowserWindow } = require("electron");
const fs = require("fs");
const getLoginUrl = require("../API/getLoginUrl");
const AVURL = require("../API/AVURL")
const EPURL = require("../API/EPURL");
const SSURL = require("../API/SSURL");
const download = require("../API/download");
const defaultDownloadDirPath = require("../utils/defaultDownloadDirPath");

// 获取登录key
ipcMain.on('RTM-getLoginUrl', (event) => {
  function success(data) {
    console.log(data);
    event.sender.send('MTR-getLoginUrl', data);
  }
  function fail(error) {
    console.log(error);
  }
  getLoginUrl().then(success, fail);
});

// SESSDATA存在,跳转到index.html页面
ipcMain.on('RTM-ToIndex', (event, data) => {
    let index = dialog.showMessageBox({
      type: 'info',
      title: '跳转主界面',
      message: 'SESSDATA存在且未过期,无需登录',
      buttons: ['确定', '取消']
    });
    index.then((value) => {
      if (value.response === 0){
        BrowserWindow.fromId(data.id).loadURL(data.path);
      }
      if (value.response === 1){
        event.returnValue = '用户选择正常登录';
      }
    }, (error)=>{
      console.log(error);
    });
});

// 正常登录,跳转到index.html页面事件
ipcMain.on('RTM-normalToIndex', (event, data)=>{
  BrowserWindow.fromId(data.id).loadURL(data.path);
});

// 通过url获取视频的aid和cid的信息
ipcMain.on('RTM-getVideoId', (event, data) =>{
  console.log(data);
  switch (data.type) {
    case 'av':
      AVURL(data.id).then((res) => {
        event.sender.send('MTR-reVideoMsg', res);
      }, (error) => {
        console.log(error);
      });
      break;
    case 'ep':
      EPURL(data.id).then((res) => {
        event.sender.send('MTR-reVideoMsg', res);
        console.log(res);
      }, (error) => {
        console.log(error);
      });
      break;
    case 'ss':
      SSURL(data.id).then((res) => {
        event.sender.send('MTR-reVideoMsg', res);
      }, (error) => {
        console.log(error);
      });
      break;
    default:
      console.log('parsing Error');
  }
});

// 通过url获取视频的aid和cid的信息
ipcMain.on("RTM-videoDownload", (event, data) => {
    console.log(data.title);
    console.log(data.url)
    fs.mkdir(`${defaultDownloadDirPath}/${data.title}`, function (error) {
      if(error){
        console.log(error);
        return false;
      }
      console.log(`${data.title} Dir was created`);
      // 下载视频
      download(data.title , data.url[0]);
    });
});