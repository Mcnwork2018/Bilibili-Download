/**
 * name: defaultDownloadDirPath.js
 * content: 获取用户默认的下载目录
 */

const os = require('os');

let defaultDownloadDirPath = null;

// Linux download dir path
if (os.type() === "Linux") {
  defaultDownloadDirPath = `/home/${os.hostname()}/Downloads`;
}

// Windows download dir path
if (os.type() === "Windows_NT") {
  defaultDownloadDirPath = `C:\\Users\\${os.hostname()}\\Downloads`;
}

module.exports = defaultDownloadDirPath;