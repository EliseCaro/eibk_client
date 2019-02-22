<template>
    <transition name="fade">
        <div id="wrapper" class="del_video_play_box">
            <div class="del_videoIndex_title">
                <h1>{{$store.state.video.detail.info.title}}</h1>
                <p>——————— {{$store.state.video.detail.info.description}}</p>
            </div>
            <div style="position: relative;margin: 0 28px;margin-top: -35px;">
                <Icon @click.navite="init($store.state.video.detail.btn.prev)" class="del_videoIndex_btn_left" style="left: 0;" type="ios-arrow-left"></Icon>
                <div class="del_videoIndex_box">
                    <video-player  class="video-player-box"
                                   ref="videoPlayer"
                                   :options="playerOptions"
                                   :playsinline="true"
                                   customEventName="customstatechangedeventname"
                                   @ended="onPlayerEnded($event)"
                    >
                    </video-player>
                </div>
                <Icon @click.navite="init($store.state.video.detail.btn.next)" class="del_videoIndex_btn_right" style="right: 0;" type="ios-arrow-right"></Icon>
            </div>
        </div>
    </transition>
</template>

<script>
    import '../../../static/css/video/play.scss'
    import { videoPlayer } from 'vue-video-player'
    import 'video.js/dist/video-js.css'
    import 'vue-video-player/src/custom-theme.css'
    import {ProcessingPic} from '../tool/function';
    export default {
      name: 'video-detail-page',
      props: ['app'],
      data() {
        return {
          playerOptions: {}
        }
      },
      components: {videoPlayer},
      mounted() {
        this.init(this.$route.query.id);
        if (this.$store.state.music.play_status.is_play) {
          this.$emit('jplayer_play_pause', 'pause');
        }
      },
      computed: {},
      methods: {
        init(id) {
          if (!id) { return false; }
          let o = this;
          this.$post('/video/videoDetails', {id: id})
            .then((response) => {
              if (response.status === true) {
                o.$store.commit('video_update_detail', response.data);
                o._data.playerOptions = {
                  autoplay: true, // 自动播放
                  muted: false, // 是否静音
                  loop: false, // 是否重复！！！
                  language: 'zh-CN', // 语言
                  fluid: true, // "自适应容器"
                  playbackRates: [0.7, 1.0, 1.5, 2.0],
                  sources: [{
                    type: 'video/mp4',
                    src: ProcessingPic(o.$store.state.video.detail.info.path, '')
                  }],
                  poster: ProcessingPic(o.$store.state.video.detail.info.thumb, '?imageMogr2/blur/20x10'),
                  controlBar: {
                    timeDivider: true,
                    durationDisplay: true,
                    remainingTimeDisplay: false,
                    fullscreenToggle: true  // 全屏按钮
                  }
                };
                this.$emit('change_background', 'url(' + ProcessingPic(o.$store.state.video.detail.info.thumb, '?imageMogr2/blur/20x10') + ')');
              }
            });
        },
        onPlayerEnded: function () {
          this.init(this.$store.state.video.detail.btn.next);
        }
      }
    }
</script>
