
const state = {
  list: {items: []},
  detail: {}
};

const mutations = {
  note_update_list(state, value) { state.list = value; },
  note_update_detail(state, value) { state.detail = value; }
};

const actions = {};

export default {
  state,
  mutations,
  actions
}