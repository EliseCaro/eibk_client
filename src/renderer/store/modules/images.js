
const state = {
  list: {items: []},
  detail: {items: []},
  detail_cate: []
};

const mutations = {
  images_update_list(state, value) { state.list = value; },
  image_update_detail(state, value) { state.detail = value; },
  image_update_detail_cate(state, value) { state.detail_cate = value; }
};

const actions = {};

export default {
  state,
  mutations,
  actions
}