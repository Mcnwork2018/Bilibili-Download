/*
 * Name: store.js
 * content: 封装localstorage
 */

let store = {
  setValue: function(key, value){
    localStorage.setItem(key, JSON.stringify(value));
    console.log("[store]: set successful");
    return 1;
  },
  getValue: function(key){
    let result = localStorage.getItem(key);
    console.log("[store]: get successful");
    return JSON.parse(result);
  }
};

module.exports = store;