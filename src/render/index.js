const { ipcRenderer } = require('electron');
const { BrowserWindow } = require('electron').remote;

const Msearch = require('../components/indexComponent/search');

let downloadPath = {
  id: BrowserWindow.getFocusedWindow().id,
  path: `file://${__dirname}/download.html`
};

new Vue({
  el:"#app",
  data(){
    return {
      
    }
  },
  methods:{
    
  },
  components: {
    Msearch: Msearch
  }
})