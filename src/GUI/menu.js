const { Menu, BrowserWindow } = require('electron');

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
      },
      {
        label: '打开开发者工具',
        accelerator:'F12',
        click: function () {
          const winid = BrowserWindow.getFocusedWindow().id;
          let win = BrowserWindow.fromId(winid);
          win.webContents.openDevTools();
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
Menu.setApplicationMenu(m);