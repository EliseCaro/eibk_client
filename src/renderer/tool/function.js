
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