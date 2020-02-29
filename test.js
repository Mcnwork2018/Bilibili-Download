const https = require("https");
const download = require("./src/API/download");
const url = "https://api.bilibili.com/pgc/player/web/playurl?cid=122607747&qn=80&type=&otype=json&avid=70157581&ep_id=285888&fourk=1&fnver=0&fnval=16&session=444722417c1866b0a4e5349c27907bdb";
const videoSign = require("./src/API/videoSign");

https.get(url, (res)=>{
  res.setEncoding('utf-8');
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", async () => {
    let urls = JSON.parse(data).result.dash.audio[0];
    console.log(urls);
    // 视频下载需要的etag和contentRange
    videoSign(urls)
    .then(async (data) => {
      // console.log(data);
      let reg = /\d+/g;
      // console.log(data.contentRange.match(reg));
      // 分块大小 1M = 1024 * 1024
      let blockUnit = 1024 * 1024;
      // 分块数
      let blockNums = Math.floor(data.contentRange.match(reg)[2] / blockUnit);
      // 下载列表
      let downloadList = [];
      //起始块
      let startBlock = 0;
      for (let i = 0; i < blockNums; i++) {
        downloadList.push({
          headers:{
            hostname: new URL(urls.baseUrl).hostname,
            range: `${startBlock}-${startBlock + blockUnit}`,
            etag: data.etag
          },
          url: urls.baseUrl,
          blockId: i
        });
        startBlock= startBlock + blockUnit + 1;
      }
      downloadList.push({
        headers:{
          hostname: new URL(urls.baseUrl).hostname,
          range: `${startBlock}-${data.contentRange.match(reg)[2]}`,
          etag: data.etag
        },
        url: urls.baseUrl,
        blockId: blockNums
      });
      console.log("Download start!");
      (async () => {
        for (const item of downloadList){
          let data = await download("test", item);
          console.log(data);
        }
      })();
    }, (error) => {
      console.log(error);
    });
  });
});
