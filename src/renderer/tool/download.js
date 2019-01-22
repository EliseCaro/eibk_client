import { ipcRenderer, remote } from 'electron';
import db from './datastore';
let download = {
/**
 * msg
 */
  message: '',
/**
 * 初始化
 * @param path
 * @returns {boolean}
 */
  init: function (path) {
    if (!path) {
      this.message = '下载地址不合法！！！';
      return false;
    }
    ipcRenderer.send('download', { 'path': path, 'savePath': this.savePath() });
    ipcRenderer.on('dwo', function(event, arg) {
      console.log(arg);
/*      if (arg) {
        switch (arg.Type) {
          case 'updated':
            dowload.updated(arg);
            break;
          case 'done':
            dowload.done(arg);
            break;
        }
      } */
    });
  },
/**
 * 下载中处理
 */
  updated: function (o) {
    db.dow.findOne({
      ETag: o.ETag,
      Filename: o.Filename
    }, (_, ret) => {
      if (ret) {
        db.dow.update({
          ETag: o.ETag,
          Filename: o.Filename
        }, {$set: o});
      } else {
        db.dow.insert(o);
      }
    });
  },
/**
 * 下载完成或失败处理
 */
  done: function (o) {
    db.dow.update({
      ETag: o.ETag,
      Filename: o.Filename
    }, {$set: {
      'Type': o.Type,
      'State': o.State
    }}, (_, ret) => {
      if (ret) {
        console.log(o.Filename + '下载完成！！！');
      }
    });
  },
/**
 * 获取保存路径
 */
  savePath: function () {
    let savePath = localStorage.getItem('dowSavePath');
    if (!savePath || this.readdir(savePath)) {
      remote.dialog.showOpenDialog({
        defaultPath: '../',
        properties: ['openDirectory'],
        filters: [{name: 'All', extensions: ['*']}]
      }, function (res) {
        savePath = res[0];
        localStorage.setItem('dowSavePath', savePath);
        return localStorage.getItem('dowSavePath');
      });
    } else {
      return savePath;
    }
  },
/**
 * 暂停下载
 */
  pause: function(ETag) {
    ipcRenderer.send('download_pause', {'ETag': ETag});
  },
/**
 * 恢复暂停的下载
 */
  resume: function (ETag) {
    ipcRenderer.send('download_resume', {'ETag': ETag});
  },
/**
 * 取消下载不可恢复
 */
  cancel: function (ETag) {
    console.log('download_cancel');
    ipcRenderer.send('download_cancel', {'ETag': ETag});
  },
/**
* 读取文件夹
*/
  readdir: function (path) {
    require('fs').readdir(path, function(err, files) {
      if (err) {
        return false;
      } else {
        return files;
      }
    });
  }

};
export default download;