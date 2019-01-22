
const state = {
  list: {
    items: []
  },
  item: {},
  play_status: {
    is_play: false,
    duration: 0,
    progress: 0,
    volume: 0,
    leftTime: 0,
    repeat_type: 'cycle'
  }
};

const mutations = {
  music_update_item(state, value) { state.item = value; },
  music_update_list(state, value) { state.list = value; },
  music_update_items(state, value) { state.list.items = value; },

  music_update_is_play(state, value) { state.play_status.is_play = value; },
  music_update_duration(state, value) { state.play_status.duration = value; },
  music_update_progress(state, value) { state.play_status.progress = value; },
  music_update_volume(state, value) { state.play_status.volume = value; },
  music_update_leftTime(state, value) { state.play_status.leftTime = value; },
  music_update_repeat(state, value) { state.play_status.repeat_type = value; }

};

const actions = {};

export default {
  state,
  mutations,
  actions
}