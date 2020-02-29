const { ipcRenderer } = require('electron');
const { BrowserWindow } = require('electron').remote;

const jointUrl = require('../utils/jointUrl');
const store = require('../utils/store');
const getLoginInfo = require('../API/getLoginInfo');

let indexPath = {
  id: BrowserWindow.getFocusedWindow().id,
  path: `file://${__dirname}/index.html`
};

let sessdata = store.getValue('SESSDATA');

console.log(sessdata);

if(sessdata !== null && ((new Date()).valueOf() - sessdata.ts * 1000) < 2592000000)
{
  ipcRenderer.send('RTM-ToIndex', indexPath);
}

let qrcode = document.querySelector('#qrcode');

let qr = null;

let LoginData = {
  oauthKey: '',
  gourl: encodeURIComponent('https://www.bilibili.com/')
}

if(LoginData.oauthKey === '')
{
  ipcRenderer.send('RTM-getLoginUrl');
}

ipcRenderer.on('MTR-getLoginUrl', (event, data) => {
  if(data.code === 0)
  {
    if(qr === null)
    {
      qr = new QRCode(qrcode, {
        text: data.data.url,
        width: 140,
        height: 140,
        colorDark : "#000000",
        colorLight : "#ffffff"
      });
    }
    else
    {
      qr.makeCode(data.data.url);
    }
    LoginData.oauthKey = data.data.oauthKey;
    let status = setInterval(function(data) {
      getLoginInfo(data).then((data) => {
        console.log(data);
        if(data.data === -2){
          ipcRenderer.send('RTM-getLoginUrl');
          clearInterval(status);
        }
        if(data.code === 0)
        {
          let sessdata = {
            ts: data.ts,
            data: encodeURIComponent(new URL(data.data.url).searchParams.get("SESSDATA"))
          };
          store.setValue("SESSDATA", sessdata);
          ipcRenderer.send("RTM-normalToIndex", indexPath);
          clearInterval(status);
        }
      },(error)=>{
        console.log(error);
      });
    }, 1000, jointUrl(LoginData));
  }
});