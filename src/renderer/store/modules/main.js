
const state = {
  data: {comment: {items: []}},
  user: {}
};

const mutations = {
  main_update_data(state, value) { state.data = value; },
  main_update_user(state, value) { state.user = value; }
};

const actions = {};

export default {
  state,
  mutations,
  actions
}