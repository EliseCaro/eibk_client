<template>
    <div :style="{backgroundImage: background}" :ks="background" id="app">
        <template v-if="$store.state.login.token === ''">
            <router-view
                    v-bind:app="this"
                    @userInfo="userInfo"
                    @jplayer_play_pause="jplayer_play_pause"
            ></router-view>
        </template>
        <template v-else>
            <Row>
                <Col class="app_left" span="5">
                    <Row class="app_left_top">
                        <Col @click.native="$router.back(-1)" class="app_left_top_init" span="6"><Avatar icon="android-arrow-back" size="large" /></Col>
                        <Col @click.native="isCollapsed = !isCollapsed" class="app_left_top_init" span="6">
                            <template v-if="isCollapsed">
                                <Avatar :style="{'background':'#2d8cf0'}" icon="arrow-down-a" size="large" />
                            </template>
                            <template v-else>
                                <Avatar icon="arrow-down-a" size="large" />
                            </template>
                        </Col>
                        <Col @click.native="isCollapsed = !isCollapsed" class="app_left_top_init" span="6">
                            <Avatar icon="chatboxes" size="large" />
                        </Col>
                        <Col @click.native="$router.push({ path: '/setting/index' })" class="app_left_top_init" span="6">
                            <Avatar icon="ios-gear" size="large" />
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <div class="app_avatar_box">
                                <Upload
                                        :action="up_avatar.up_url"
                                        :data="up_avatar"
                                        :multiple="false"
                                        :paste="false"
                                        :show-upload-list="false"
                                        type="select"
                                        :format="up_avatar.format"
                                        :before-upload="beforeUpload"
                                        :on-success="uploadSuccess"
                                        :on-error="uploadError"
                                        class="up_upload_avatar_obj"
                                >
                                    <Avatar :src="$ProcessingPic($store.state.main.user.avatar,'')" />
                                </Upload>
                                <div class="app_avatar_box_nickname">{{$store.state.main.user.nickname}}</div>
                            </div>
                            <Menu class="app_menu_box" :style="{width:'100%',color: '#ffffff'}" :theme="theme2" active-name="1-1" :open-names="['1']" accordion>

                                <Submenu name="1">
                                    <template slot="title">
                                        <Icon type="ios-paper"></Icon>
                                        控制面板
                                    </template>
                                    <MenuItem @click.native="$router.push({ path: '/'})" name="1-1">我的主页</MenuItem>
                                </Submenu>

                                <Submenu name="2">
                                    <template slot="title">
                                        <Icon type="ios-paper"></Icon>
                                        视频管理
                                    </template>
                                    <MenuItem @click.native="$router.push({ path: '/video/push'})" name="1-1">发布视频</MenuItem>
                                    <MenuItem @click.native="$router.push({ path: '/video/index'})" name="1-2">全部视频</MenuItem>
                                </Submenu>

                                <Submenu name="3">
                                    <template slot="title">
                                        <Icon type="ios-paper"></Icon>
                                        我的笔记
                                    </template>
                                    <MenuItem name="1-1" @click.native="$router.push({ path: '/note/index'})">最新笔记</MenuItem>
                                    <MenuItem name="1-2" @click.native="$router.push({ path: '/file/index'})">文件管理</MenuItem>
                                </Submenu>

                                <Submenu name="4">
                                    <template slot="title">
                                        <Icon type="ios-paper"></Icon>
                                        图集管理
                                    </template>
                                    <MenuItem @click.native="$router.push({ path: '/images/index'})" name="1-1">我的图集</MenuItem>
                                </Submenu>

                                <Submenu name="5">
                                    <template slot="title">
                                        <Icon type="ios-paper"></Icon>
                                        音乐频道
                                    </template>
                                    <MenuItem @click.native="$router.push({ path: '/music/index'})" name="1-1">我的收藏</MenuItem>
                                </Submenu>

                            </Menu>
                        </Col>
                    </Row>
                </Col>
                <Col :style="{'width':'auto'}" span="19">
                    <Layout :style="{background:'none'}">
                        <Header class="app_header">


                            <div v-if="music_mini === true" class="music_mini">
                                 <div class="music_mini_p">
                                     <Icon @click.native="jplayer_next('prev')" type="skip-backward"></Icon>
                                 </div>
                                <i-circle
                                        class="music_mini_p_cover"
                                        :percent="100"
                                        :stroke-width="4"
                                        :trail-width="3"
                                        :size="48"
                                        stroke-color="#00a988"
                                        trail-color="#fff"
                                        :style="{backgroundImage:'url('+$ProcessingPic($store.state.music.item.cover)+')'}"
                                >
                                    <template v-if="$store.state.music.play_status.is_play">
                                        <Icon @click.native="jplayer_play_pause('pause')" type="pause"></Icon>
                                    </template>
                                    <template v-else >
                                        <Icon @click.native="jplayer_play_pause('play')"  type="play"></Icon>
                                    </template>
                                </i-circle>
                                 <div class="music_mini_n">
                                     <Icon @click.native="jplayer_next('next')" type="skip-forward"></Icon>
                                 </div>
                                <div class="music_mini_p_right">
                                     <marquee  class="music_mini_p_right_title">{{$store.state.music.item.title}} - {{$store.state.music.item.artist}}</marquee >
                                    <div class="music_mini_p_right_progress">
                                        <Progress
                                                :percent="100"
                                                @click.native="jplayer_change_progress_handler_child"
                                                hide-info
                                                :stroke-width="1"
                                                class="music_mini-high-progress"
                                        ></Progress>
                                    </div>
                                    <div class="music_mini_p_right_icon">
                                        <div class="music-volume-container">
                                            <Icon type="volume-high"></Icon>
                                            <Progress
                                                    class="volume-high-progress"
                                                    :percent="$store.state.music.play_status.volume"
                                                    hide-info
                                                    :stroke-width="3"
                                                    @click.native="jplayer_change_volume_handler_child"
                                            ></Progress>
                                        </div>
                                        <Icon @click.native="jplayer_music_post_plus($store.state.music.item.id)" type="ios-heart-outline"></Icon> <!--<Icon type="ios-heart"></Icon>-->
                                        <Icon @click.native="jplayer_music_downlod($store.state.music.item.file,$store.state.music.item.title)" type="ios-cloud-download-outline"></Icon>

                                    </div>
                                </div>
                            </div>
                            <div class="index_input">
                                <i-input>
                                    <i-select :model.sync="select1" slot="prepend" style="width: 80px">
                                        <i-option value="note">笔记</i-option>
                                        <i-option value="file">文件</i-option>
                                        <i-option value="video">视频</i-option>
                                    </i-select>
                                    <i-button slot="append" icon="ios-search"></i-button>
                                </i-input>
                            </div>
                            <div class="index_header_right">
                                <div @click="$electron.remote.getCurrentWindow().minimize()" class="index_header_right_mini">
                                    <Icon type="minus"></Icon>
                                </div>
                                <div @click="$electron.remote.getCurrentWindow().close()" class="index_header_right_close">
                                    <Icon type="close"></Icon>
                                </div>
                            </div>
                        </Header>
                        <Layout :style="{'width':'1040px','background':'none'}">
                            <Content class="app_content">
                                <router-view
                                        v-bind:app="this"
                                        @electron_dowload_insertDb="electron_dowload_insertDb"
                                        @jplayer_start="jplayer_start"
                                        @jplayer_next="jplayer_next"
                                        @jplayer_play_pause="jplayer_play_pause"
                                        @jplayer_change_repeat="jplayer_change_repeat"
                                        @jplayer_change_volume_handler="jplayer_change_volume_handler"
                                        @jplayer_change_progress_handler="jplayer_change_progress_handler"
                                ></router-view>
                            </Content>
                            <transition name="slide-fade">
                                <Sider v-if="isCollapsed" :style="{width:'231px','max-width':'231px',flex: '0 0 231px'}" class="app_right">
                                    <Tabs class="app_right_tables" type="card">
                                        <TabPane label="下载">

                                             <div v-for='v, k in downloadList' class="app_right_tables_dow_init">
                                                 <p class="app_right_tables_dow_init_text">{{v.name}}</p>
                                                 <div class="app_right_tables_dow_init_i">
                                                     <Icon v-if="v.save_path" @click.native="open_foledr(v.save_path)" style="font-size: 20px;" type="ios-navigate-outline"></Icon>
                                                     <Icon v-else style="font-size: 20px;" type="android-arrow-dropright-circle"></Icon>
                                                     <Icon @click.native="delete_download(v._id)" style="font-size: 20px;" type="ios-close-outline"></Icon>
                                                 </div>
                                                 <Progress :percent="v.percentage" :stroke-width="2" hide-info />
                                             </div>

                                        </TabPane>
                                        <TabPane label="消息"><!--标签二的内容--></TabPane>
                                    </Tabs>
                                </Sider>
                            </transition>
                        </Layout>
                    </Layout>
                </Col>
            </Row>
        </template>
    </div>
</template>

<script>
import {NoticeError, NoticeInfo, randomRange} from './tool/function';
import '../../static/css/app.scss';
export default {
  name: 'eibk',
  data: function () {
    return {
      theme2: 'light',
      isCollapsed: false,
      up_avatar: {
        token: '',
        up_url: '',
        format: ['jpg', 'png', 'gif']
      },
      downloadList: [],
      background: this.$store.state.main.user.bg ? 'url(' + this.$store.state.main.user.bg + ')' : 'url(' + require('./assets/userbg.png') + ')',
      music_mini: false,
      select1: 'note'
    }
  },
  methods: {
    userInfo() {
      this.$post('/api/personal/index', {}).then((response) => {
        if (response.status === true) {
          this.$store.commit('main_update_user', response.data.userInfo);
          this._data.up_avatar.token = response.data.userInfo.avatar_up_token;
          this._data.up_avatar.up_url = response.data.userInfo.avatar_up_url;
        }
      });
    },
    uploadSuccess(res) {
      if (res.ret === 'success') {
        this.userInfo();
      } else {
        NoticeError('上传头像失败', '上传头像失败了，请稍后再试或尝试联系管理员。。。');
      }
      this._data.spinShow = false;
    },
    beforeUpload() { this._data.spinShow = true; },
    uploadError() { this._data.spinShow = false; NoticeError('上传头像失败', '上传头像失败了，请稍后再试或尝试联系管理员。。。'); },

    electron_dowload_status() {
      this.$electron.ipcRenderer.on('downStateDone', (event, arg) => {
        const o = this;
        let json = JSON.parse(arg);
        if (json.done === 'cancelled') {
          this.$db.download.remove({name: json.name}, {}, function(_err, numRemoved) {
            o.electron_dowload_list();
            o.isCollapsed = false;
          });
        }
        if (json.done === 'interrupted') {
          NoticeError('下载已失败', '下载失败，请稍后再试或尝试联系管理员。。。');
          o.isCollapsed = false;
        }
        if (json.done === 'completed') {
          // NoticeInfo('下载完成', '您的' + json.name + '下载已经完成！请打开下载列表查看！！！');
          this.$db.download.update(
          {name: json.name},
          {$set: json},
          {},
          function() {
            o.electron_dowload_list();
          });
          o.isCollapsed = false;
        }
      });
      this.$electron.ipcRenderer.on('downStateInterrupted', (event, arg) => {
        const o = this;
        let json = JSON.parse(arg);
        json.percentage = Math.ceil(json.this_size / (json.file_size / 100));
        this.$db.download.update(
          {name: json.name},
          {$set: json},
          {},
          function() {
            o.electron_dowload_list();
          });
      })
    },
    electron_dowload_insertDb(url) {
      const o = this;
      let name = url.split('=')[url.split('=').length - 1];
      this.$db.download.insert({
        url: url,
        name: name,
        updated: '',
        file_size: 0,
        this_size: 0,
        done: '',
        state: '',
        percentage: 0,
        save_path: ''
      }, function(_err, ret) {
        if (ret && ret._id) {
          o.electron_dowload_list();
          o.isCollapsed = true;
          o.$electron.ipcRenderer.send('download', ret.url);
        } else {
          NoticeError('下载错误', '下载失败，请稍后再试或尝试联系管理员。。。');
        }
      });
    },
    delete_download(id) {
      const o = this;
      this.$db.download.remove({_id: id}, {}, function(_err, numRemoved) {
        o.electron_dowload_list();
      });
    },
    open_foledr(path) {
      this.$electron.shell.showItemInFolder(path);
    },
    electron_dowload_list() {
      const o = this;
      this.$db.download.find({}, function(_err, res) {
        if (res) { o._data.downloadList = res; }
      });
    },

    jplayer_init() {
      $('#player').jPlayer({
        supplied: 'mp3',
        wmode: 'window',
        useStateClassSkin: true
      });
      $('#player').bind($.jPlayer.event.timeupdate, (e) => {
        this.$store.commit('music_update_duration', e.jPlayer.status.duration);
        this.$store.commit('music_update_progress', e.jPlayer.status.currentPercentAbsolute);
        this.$store.commit('music_update_volume', e.jPlayer.options.volume * 100);
        this.$store.commit('music_update_leftTime', this.jplayer_format_time(e.jPlayer.status.duration * (1 - e.jPlayer.status.currentPercentAbsolute / 100)));
      });
      $('#player').bind($.jPlayer.event.ended, (e) => {
        this.$store.commit('music_update_is_play', false);
        if (this.$store.state.music.play_status.repeat_type === 'random') {
          let index = this.jplayer_find_music_index(this.$store.state.music.item);
          let randomIndex = randomRange(0, this.$store.state.music.list.items.length - 1);
          while (randomIndex === index) {
            randomIndex = randomRange(0, this.$store.state.music.list.items.length - 1);
          }
          this.jplayer_start(this.$store.state.music.list.items[randomIndex]);
        } else if (this.$store.state.music.play_status.repeat_type === 'once') {
          this.jplayer_start(this.$store.state.music.item);
        } else {
          this.jplayer_next();
        }
      });
    },
    jplayer_start(item) {
      $('#player').jPlayer('setMedia', {
        mp3: this.$ProcessingPic(item.file)
      }).jPlayer('play');
      this.$store.commit('music_update_item', item);
      this.$store.commit('music_update_is_play', true);
    },
    jplayer_next(type = 'next') {
      let index = this.jplayer_find_music_index(this.$store.state.music.item);
      if (type === 'next') {
        index = (index + 1) % this.$store.state.music.list.items.length;
      } else {
        index = (index + this.$store.state.music.list.items.length - 1) % this.$store.state.music.list.items.length;
      }
      let musicItem = this.$store.state.music.list.items[index];
      this.jplayer_start(musicItem);
    },
    jplayer_find_music_index(music) {
      let index = this.$store.state.music.list.items.indexOf(music);
      return Math.max(0, index);
    },
    jplayer_play_pause() {
      if (this.$store.state.music.play_status.is_play) {
        $('#player').jPlayer('pause');
      } else {
        $('#player').jPlayer('play');
      }
      this.$store.commit('music_update_is_play', !this.$store.state.music.play_status.is_play);
    },
    jplayer_format_time(time) {
      time = Math.floor(time);
      let miniute = Math.floor(time / 60);
      let seconds = Math.floor(time % 60);
      return miniute + ':' + (seconds < 10 ? '0' + seconds : seconds);
    },
    jplayer_change_repeat(type) {
      this.$store.commit('music_update_repeat', type);
    },
    jplayer_change_volume_handler(progress) {
      $('#player').jPlayer('volume', progress);
    },
    jplayer_change_progress_handler(progress) {
      let duration = this.$store.state.music.play_status.duration;
      $('#player').jPlayer('play', duration * progress);
      this.$store.commit('music_update_is_play', true);
    },
    jplayer_change_volume_handler_child(e) {
      let progressBar = this.$el.querySelector('.volume-high-progress');
      let progress = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth;
      this.jplayer_change_volume_handler(progress);
    },
    jplayer_change_progress_handler_child(e) {
      let progressBar = this.$el.querySelector('.music_mini-high-progress');
      let progress = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth;
      this.jplayer_change_progress_handler(progress);
    },
    jplayer_music_post_plus(id) {
      this.$post('/api/music/collect', {id: id}).then((response) => {
        if (response.status === true) {
          NoticeInfo(response.msg);
        } else {
          NoticeError('收藏错误', '出了一些问题，请尝试联系管理员或稍后再试！');
        }
      })
    },
    jplayer_music_downlod(path, name) {
      const url = this.$ProcessingPic(path) + '?attname=' + name + '.mp3';
      this.electron_dowload_insertDb(url);
    },
    routeCg() {
      if (this.$route.path != '/video/detail' && this.$route.path != '/setting/index') {
        let bg = this.$store.state.main.user.bg ? this.$store.state.main.user.bg : require('./assets/userbg.png');
        this.background = 'url(' + bg + ')';
      }
      if (this.$route.path != '/music/index' && this.$store.state.music.play_status.is_play === true) {
        this.music_mini = true
      }
    }
  },
  computed: {},
  mounted: function() {
    this.userInfo();
    this.electron_dowload_status();
    this.electron_dowload_list();
    this.jplayer_init();
    this.jplayer_change_volume_handler(0.5);
  },
  watch: {
    '$route': 'routeCg'
  }
}
</script>
