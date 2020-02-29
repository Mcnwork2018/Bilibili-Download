const { remote } = require('electron');
const { Menu } = require('electron').remote;

let menus = [
  {
    label: '文件',
    submenu: [
      {
        label: '新建文件',
        accelerator: 'ctrl+n',
        click: function(){
          console.log('新建文件');
        }
      },
      {
        label: '新建窗口',
        accelerator: 'ctrl+a',
        click: function(){
          console.log('新建窗口');
        }
      }
    ]
  },
  {
    label: '编辑',
    submenu: [
      {
        label: '复制',
        role: 'copy'
      },
      {
        label: '剪切',
        role: 'cut'
      }
    ]
  },
  {
    label: '视图',
    submenu: [
      {
        label: '浏览'
      },
      {
        label: '搜索'
      },
      {
        label: '帮助'
      }
    ]
  }
];

let m = Menu.buildFromTemplate(menus);

window.addEventListener('contextmenu',(e)=>{
  e.preventDefault();
  m.popup({
    window: remote.getCurrentWindow()
  });
},false);