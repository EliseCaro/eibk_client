<template>
    <transition name="fade">
        <div id="wrapper" class="sing_login" @keyup.enter="login()">
              <div class="login_box_header_">
                  <div @click="$electron.remote.getCurrentWindow().minimize()" class="index_header_right_mini">
                      <Icon type="minus"></Icon>
                  </div>
                  <div @click="$electron.remote.getCurrentWindow().close()" class="index_header_right_close">
                      <Icon type="close"></Icon>
                  </div>
              </div>

               <div class="login_box_box_">
                   <div class="login_box_avatar">
                       <img :src="$store.state.login.avatar">
                       <p>贝壳云笔记</p>
                   </div>
                   <div class="login_box_input">
                       <Icon type="person" style="padding-top:1px;"></Icon>
                       <input @blur="onblur()" v-model="_data._input.username" type="text" placeholder="管理员账户">
                   </div>
                   <div class="login_box_input">
                       <Icon style="font-size: 20px;padding-top:4px;" type="locked"></Icon>
                       <input type="password" v-model="_data._input.password" placeholder="管理员密码">
                   </div>
                   <div @click="login()" class="login_box_btn">立即登录</div>
<!--                   <div @click="$electron.ipcRenderer.send('open-devtools')" class="login_box_btn">打开F12</div>-->
                   <div class="login_box_btn_text">贝壳云笔记<br>www.eibk.com</div>
               </div>

        </div>
    </transition>
</template>

<script>
  import '../../../static/css/sing/login.scss';
  import {NoticeWarning} from '../tool/function';
  export default {
    name: 'sing_login-page',
    props: ['app'],
    data: function () {
      return {
        _input: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      login() {
        let o = this;
        this.$post('/api/sing/login', o._data._input)
        .then((response) => {
          if (response.status === true) {
            this.$store.commit('login_update_token', response.data.token);
            this.$emit('userInfo');
            this.$router.push({name: 'IndexPage'});
          } else {
            NoticeWarning(response.msg);
          }
        });
      },
      onblur: function () {
        let o = this;
        this.$post('/api/sing/getAvatar', {
          username: o._data._input.username
        })
        .then((response) => {
          if (response.status === true) {
            o.$store.commit('login_update_avatar', this.$ProcessingPic(response.data.avatar, ''));
          } else {
            o.$store.commit('login_update_avatar', require('../assets/default_user.jpg'));
          }
        })
      }
    },
    mounted() {
      if (this.$store.state.music.play_status.is_play) {
        this.$emit('jplayer_play_pause', 'pause');
      }
    }
  }
</script>