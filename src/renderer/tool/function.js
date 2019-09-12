
import { Notice } from 'iview';
import config from './config'

export function ProcessingPic(name, string) {
  if (!name) {
    return require('../assets/error_video.jpg');
  }
  if (string) {
    return config.qiniuPath + name + string;
  } else {
    return config.qiniuPath + name
  }
}

export function getImg(src, maxWidth, maxHeight, func) {
  let image = new Image();
  image.src = src;
  image.onload = function () {
    // 用于设定图片的宽度和高度
    var tempWidth;
    var tempHeight;
    // 原图片宽高比例 大于 指定的宽高比例，这就说明了原图片的宽度必然 > 高度
    if (image.width / image.height >= maxWidth / maxHeight) {
      if (image.width > maxWidth) {
        tempWidth = maxWidth;
        // 按原图片的比例进行缩放
        tempHeight = (image.height * maxWidth) / image.width;
      } else {
        // 按原图片的大小进行缩放
        tempWidth = image.width;
        tempHeight = image.height;
      }
    } else { // 原图片的高度必然 > 宽度
      if (image.height > maxHeight) {
        tempHeight = maxHeight;
        // 按原图片的比例进行缩放
        tempWidth = (image.width * maxHeight) / image.height;
      } else {
        // 按原图片的大小进行缩放
        tempWidth = image.width;
        tempHeight = image.height;
      }
    }
    func({
      width: tempWidth,
      height: tempHeight
    })
  }
}

export function randomRange(under, over) {
  return Math.ceil(Math.random() * (over - under) + under);
}

export function onError(name) {
  let path = require('../assets/' + name);
  let str = 'this.src="' + path + '"';
  return str
}
export function formatDate(now, fmt) {
  var date = new Date(parseInt(now + '000'));
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return (fmt === 'Y-m-d') ? Y + M + D : Y + M + D + h + m + s;
}

export function NoticeInfo(title, content) {
  Notice.info({
    title: title || '',
    desc: content || ''
  });
}

export function NoticeWarning(title, content) {
  Notice.warning({
    title: title || '',
    desc: content || ''
  });
}

export function NoticeSuccess(title, content) {
  Notice.success({
    title: title || '',
    desc: content || ''
  });
}

export function NoticeError(title, content) {
  Notice.error({
    title: title || '',
    desc: content || ''
  });
}

export function getCookie(key) {
  return localStorage.getItem(key);
}

export function setCookie(key, val) {
  return localStorage.setItem(key, val);
}

export function deleteCookie(key) {
  return localStorage.removeItem(key)
}
