
const state = {
  data: {items: []},
  detail: {info: {}, btn: {}},
  push: {
    up_config: {},
    lists: {}
  }
};

const mutations = {
  video_update_data(state, value) { state.data = value; },
  video_update_detail(state, value) { state.detail = value; },
  video_update_up_config(state, value) { state.push.up_config = value; },
  video_update_lists(state, value) { state.push.lists = value; }
};

const actions = {};

export default {
  state,
  mutations,
  actions
}