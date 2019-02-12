import axios from 'axios';
import Qs from 'qs';
import {LoadingBar} from 'iview';
import config from './config'
import router from '../router'
import store from '../store'

axios.defaults.timeout = 50000;
axios.defaults.baseURL = config.host;
LoadingBar.config({
  color: '#0EAE81',
  failedColor: '#0EAE81',
  height: 2
});
axios.interceptors.request.use(
  config => {
    config.data = Qs.stringify(config.data);
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    config.params = config.params || {};
    if (store.state.login.token) {
      config.params = {'token': store.state.login.token}
    }
    config.params.is_client = 1;
    return config;
  }
);

axios.interceptors.response.use(
  response => {
    if (parseInt(response.data.code) === 2) {
      store.commit('login_update_token', '');
      router.push({
        path: '/sing/login',
        querry: {redirect: router.currentRoute.fullPath}
      })
    }
    return response;
  },
  error => {
    return Promise.reject(error)
  }
);

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    LoadingBar.start();
    axios.post(url, data).then(response => {
      LoadingBar.finish();
      resolve(response.data);
      LoadingBar.error();
    }, err => {
      reject(err)
    })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}