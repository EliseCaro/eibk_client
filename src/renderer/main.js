import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import db from './tool/datastore'
import {post} from './tool/http'
import {ProcessingPic, formatDate, onError} from './tool/function';
import iView from 'iview'

import '../../static/css/reset.scss'
import 'iview/dist/styles/iview.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.prototype.$db = db;
Vue.prototype.$post = post;
Vue.prototype.$ProcessingPic = ProcessingPic;
Vue.prototype.$formatDate = formatDate;
Vue.prototype.$onError = onError;
Vue.config.productionTip = false;

console.log(store.state.login.token);
// 定义全局变量
Vue.use(iView);
router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.auth)) {
    if (store.state.login.token === '') {
      next({path: '/sing/login'});
    } else {
      next();
    }
  } else {
    next();
  }
});
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app');
