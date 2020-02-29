/**
 * Name: jointUrl.js
 * content: 拼接data对象中的数据
 */

function jointUrl (data){
  let dataToStringArray = [];
  for( let item in data ){
    let a = item + '=' + data[item];
    dataToStringArray.push(a);
  }
  return dataToStringArray.join('&');
}

module.exports = jointUrl;