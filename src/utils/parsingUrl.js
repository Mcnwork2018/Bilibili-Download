/**
 * Name: parsingUrl.js
 * content: 解析url返回url的type和id
 */

module.exports = function (url) {
  let epUrlArray = new URL(url).pathname.match(/(ss|ep|av)(\d*)/);
  return {
    type: epUrlArray[1],
    id: epUrlArray[2]
  };
};