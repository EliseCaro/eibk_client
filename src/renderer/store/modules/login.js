
import {getCookie, setCookie} from '../../tool/function';

const state = {
  token: getCookie('token') ? getCookie('token') : '',
  avatar: require('../../assets/default_user.jpg')
};

const mutations = {
  login_update_avatar(state, value) { state.avatar = value; },
  login_update_token(state, value) {
    setCookie('token', value);
    state.token = value;
  }
};

const actions = {};

export default {
  state,
  mutations,
  actions
}