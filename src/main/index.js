'use strict';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
import { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage } from 'electron';
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
var appTray = null;
let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1280,
    minHeight: 800,
    minWidth: 1280,
    frame: false,
    resizable: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#0E2037',
    show: false,
    skipTaskbar: false
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL(winURL);

  mainWindow.on('closed', (event) => {
    mainWindow = null;
  });
  mainWindow.on('close', (event) => {
    mainWindow.hide();
    event.preventDefault();
  });
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click: function () {
        mainWindow.destroy();
      }
    }
  ]);
  appTray = new Tray(nativeImage.createFromPath(__static + '/img/icon.ico'));
  appTray.setToolTip('贝壳云笔记');
  appTray.setContextMenu(contextMenu);
  appTray.on('click', function() {
    mainWindow.show();
  });
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * 测试使用
 */
ipcMain.on('open-devtools', () => {
  mainWindow.openDevTools();
});
/**
   进程通知||下载文件
 **/
ipcMain.on('download', (evt, args) => {
  mainWindow.webContents.downloadURL(args);
  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        // mainWindow.webContents.send('downStateInterrupted', item);
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          // mainWindow.webContents.send('downStateInterrupted', item);
        } else {
          const obj = {
            url: item.getURL(),
            name: item.getFilename(),
            updated: item.getState(),
            file_size: item.getTotalBytes(),
            this_size: item.getReceivedBytes(),
            done: '',
            state: 'updated',
            percentage: 0,
            save_path: ''
          };
          mainWindow.webContents.send('downStateInterrupted', JSON.stringify(obj));
        }
      }
    });
    item.once('done', (event, state) => {
      const obj = {
        name: item.getFilename(),
        state: 'done',
        done: state,
        save_path: item.getSavePath()
      };
      event.preventDefault();
      mainWindow.webContents.send('downStateDone', JSON.stringify(obj))
    })
  });
});
/**
 end
 */

/**
 * 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
 */

const {autoUpdater} = require('electron-updater');
const message = {
  error: '0', // 检查更新出错
  checking: '1', // 正在检查更新
  updateAva: '2', // 检测到新版本，正在下载……
  updateNotAva: '3'// 现在使用的就是最新版本，不用更新
};
autoUpdater.on('error', function (_error) {
  console.log(autoUpdater.error);
  sendUpdateMessage(message.error)
});
autoUpdater.on('checking-for-update', function () {
  sendUpdateMessage(message.checking)
});
autoUpdater.on('update-available', function (info) {
  sendUpdateMessage(message.updateAva)
});
autoUpdater.on('update-not-available', function (info) {
  sendUpdateMessage(message.updateNotAva)
});
autoUpdater.on('download-progress', function (progressObj) {
  mainWindow.webContents.send('downloadProgress', progressObj)
});
autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
  ipcMain.on('isUpdateNow', (e, arg) => {
    autoUpdater.quitAndInstall();
  });
  mainWindow.webContents.send('isUpdateNow')
});
ipcMain.on('checkForUpdate', () => {
  autoUpdater.checkForUpdates();
});

function sendUpdateMessage(text) {
  mainWindow.webContents.send('update_message', text)
}