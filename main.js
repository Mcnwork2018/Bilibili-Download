const {app, BrowserWindow} = require('electron');

let win = null;

function createWindow(){
  require('./src/main/ipcMain');
  win = new BrowserWindow({ 
    width: 964, 
    height: 670,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
    } 
  });

  win.loadURL(`file://${ __dirname }/src/components/login.html`);

  win.webContents.openDevTools();
  win.on('closed', function(){
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function(){
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate',function(){
  if(win === null){
    createWindow();
  }
});
