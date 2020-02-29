/**
 * name: mergeM4s.js
 * content: 合并所有的m4s到一个m4s中
 */

const fs = require("fs");
const defaultDownloadDirPath = require("../utils/defaultDownloadDirPath");
let writerStream = fs.createWriteStream(`${defaultDownloadDirPath}/test/output.mp3`);
for (let i = 0; i < 56; i++) {
  let messsage = fs.readFileSync(`${defaultDownloadDirPath}/test/${i}.m4s`);
  writerStream.write(messsage);
}
writerStream.end();
writerStream.on('finish', () => {
  console.log("合并完成");
});
writerStream.on('error', (error) => {
  console.log(error);
});