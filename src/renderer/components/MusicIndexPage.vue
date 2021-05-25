<template>
    <transition name="fade">
        <div id="wrapper" class="music_index">
            <Row class="music_index_header">
                <i-col span="13" class="music_index_header_left">
                    <div class="music_index_header_left_music">
                        <Row class="music_index_header_left_music_left_box">
                            <i-col span="17" class="music_index_header_left_music_left">
                                <h2 class="music_index_header_left_music_left_title">{{$store.state.music.item.title}}</h2>
                                <p class="music_index_header_left_music_left_auth">{{$store.state.music.item.artist}} - {{$store.state.music.item.title}}</p>
                                <div class="music-left_progress">
                                    <div class="music-progress_top">
                                        <span class="music-progress_time">{{$store.state.music.play_status.leftTime}}</span>
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
                                        <div class="music-progress-icon">
                                            <Icon @click.native="post_plus($store.state.music.item.id)" type="plus"></Icon>
                                           <!-- <Icon type="star"></Icon>-->
                                            <Icon type="paper-airplane"></Icon>
                                        </div>
                                    </div>
                                    <Progress
                                            class="music-left_progress_init"
                                            :stroke-width="1"
                                            hide-info
                                            :percent="$store.state.music.play_status.progress"
                                            @click.native="jplayer_change_progress_handler_child"
                                    ></Progress>
                                </div>
                                <div class="music-left_btn">
                                    <Icon @click.native="post_plus($store.state.music.item.id)" type="ios-close-outline"></Icon>
                                    <template v-if="$store.state.music.play_status.repeat_type === 'random'">
                                         <i @click="$emit('jplayer_change_repeat', 'cycle')" class="icon repeat-random"></i>
                                    </template>
                                    <template v-else-if="$store.state.music.play_status.repeat_type === 'once'">
                                        <i @click="$emit('jplayer_change_repeat', 'random')" class="icon repeat-once"></i>
                                    </template>
                                    <template v-else >
                                        <i @click="$emit('jplayer_change_repeat', 'once')" class="icon repeat-cycle"></i>
                                    </template>
                                    <!--<Icon type="more"></Icon>-->
                                    <Icon @click.native="$emit('jplayer_next', 'prev')" type="skip-backward"></Icon>
                                    <template v-if="$store.state.music.play_status.is_play">
                                        <Icon @click.native="$emit('jplayer_play_pause','pause')" type="pause"></Icon>
                                    </template>
                                    <template v-else >
                                        <Icon @click.native="$emit('jplayer_play_pause','play')"  type="play"></Icon>
                                    </template>
                                    <Icon @click.native="$emit('jplayer_next', 'next')" type="skip-forward"></Icon>
                                </div>
                            </i-col>
                            <i-col span="7" class="music_index_header_left_music_right">
                                <img :src="$ProcessingPic($store.state.music.item.cover)">
                            </i-col>
                        </Row>
                    </div>
                </i-col>
                <i-col span="11" class="music_index_header_right">
                    <div class="music_index_header_right_box">
                        <div class="music_index_header_right_box_input_">
                            <div class="music_index_header_right_box_input_box">
                                <AutoComplete
                                        v-model="search_kw"
                                        @on-select="on_search_ok"
                                        @on-change="on_search_change()"
                                        icon="ios-search"
                                        class="on_search_page_box"
                                        placeholder="请输入音乐名称/歌手名"
                                        style="width:300px;padding-bottom: 100px;">
                                    <Option v-for="option in searchItems" :value="option.title+'-'+option.artist">
                                        <span class="demo-auto-complete-title">{{ option.title }} - {{option.artist}}</span>
                                    </Option>
                                    <div v-if="searchItems.length > 12" class="on_search_page">
                                        <Icon @click.native="on_search_change_page" style="font-size: 25px;cursor: pointer" type="android-arrow-forward"></Icon>
                                    </div>
                               </AutoComplete>
                            </div>
                        </div>
                        <div class="music_index_header_right_box_Carousel_">
                            <Carousel>
                                <Carousel-item>
                                    <Row :gutter="16" class="music_index_header_right_box_Carousel_init">
                                        <i-col style="cursor: pointer;" v-for='v, k in $store.state.music.list.items' v-if="k < 4" @click.native="$emit('jplayer_start', $store.state.music.list.items[k])" span="6">
                                            <img :src="$ProcessingPic(v.cover)" />
                                            <h2>{{v.title}}</h2>
                                            <h2>{{v.artist}}</h2>
                                        </i-col>
                                    </Row>
                                </Carousel-item>
                                <Carousel-item>
                                    <Row :gutter="16" class="music_index_header_right_box_Carousel_init">
                                        <i-col style="cursor: pointer;" v-for='v, k in $store.state.music.list.items' v-if="k < 8 && k > 3" @click.native="$emit('jplayer_start', $store.state.music.list.items[k])" span="6">
                                            <img :src="$ProcessingPic(v.cover)" />
                                            <h2>{{v.title}}</h2>
                                            <h2>{{v.artist}}</h2>
                                        </i-col>
                                    </Row>
                                </Carousel-item>
                            </Carousel>
                        </div>
                    </div>
                </i-col>
            </Row>

            <Row class="music_index_list" :gutter="16">

                <i-col v-for='v, k in $store.state.music.list.items' @click.native="$emit('jplayer_start', $store.state.music.list.items[k])" class="music_index_list_init" span="3">
                    <img :src="$ProcessingPic(v.cover)" />
                    <h2>{{v.title}}</h2>
                    <h2>{{v.artist}}</h2>
                </i-col>

                <div class="music_index_list_page">
                    <Page
                            :page-size="$store.state.music.list.limit"
                            :total="$store.state.music.list.total_items"
                            :current="$store.state.music.list.current"
                            @on-change="init"
                    ></Page>
                </div>
            </Row>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </div>
    </transition>
</template>

<script>
  import '../../../static/css/music/index.scss'
  import {NoticeError, NoticeInfo, NoticeWarning} from '../tool/function';
  export default {
    name: 'music-index-page',
    props: ['app'],
    data: function () {
      return {
        search_kw: '',
        searchItems: [],
        spinShow: false,
        s_page: 2
      }
    },
    methods: {
      jplayer_change_volume_handler_child(e) {
        let progressBar = this.$el.querySelector('.volume-high-progress');
        let progress = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth;
        this.$emit('jplayer_change_volume_handler', progress);
      },
      jplayer_change_progress_handler_child(e) {
        let progressBar = this.$el.querySelector('.music-left_progress_init');
        let progress = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth;
        this.$emit('jplayer_change_progress_handler', progress);
      },
      on_search_change(page) {
        if (!this.search_kw) {
          this.s_page = 2;
          return false;
        }
        this.$post('/music/Search', {
          kw: this.search_kw,
          type: false,
          s_page: page
        }).then((response) => {
          if (response.status === true) {
            this.searchItems = response.data;
            if (page) this.s_page++;
          }
        })
      },
      on_search_change_page() {
        this.on_search_change(this.s_page);
      },
      on_search_ok(v) {
        this.search_kw = v;
        if (!this.search_kw) return false;
        this.spinShow = true;
        this.$post('/music/Search', {
          kw: this.search_kw,
          type: true
        }).then((response) => {
          if (response.status === true) {
            if (response.data.length < 1) {
              this.spinShow = false;
              NoticeWarning('没有结果', '您的输入没有搜索到任何结果，请尝试填写正确在次搜索！！');
            }
            this.$emit('jplayer_play_pause', 'pause')
            this.$store.commit('music_update_item', response.data[0]);
            this.$store.commit('music_update_repeat', 'once');
            this.$emit('jplayer_start', response.data[0]);
          } else {
            NoticeError('搜索错误', '搜索出了一些问题，请尝试联系管理员或稍后再试！');
          }
          this.spinShow = false;
        })
      },
      post_plus(id) {
        this.$post('/music/collect', {id: id}).then((response) => {
          if (response.status === true) {
            NoticeInfo(response.msg);
            this.init();
          } else {
            NoticeError('收藏错误', '出了一些问题，请尝试联系管理员或稍后再试！');
          }
        })
      },
      init(page) {
        this.$post('/music/index', {page: page || 1}).then((response) => {
          if (response.status === true) {
            this.$store.commit('music_update_list', response.data._list);
            this.$store.commit('music_update_items', response.data._list.items);
            if (!this.$store.state.music.play_status.is_play) {
              this.$emit('jplayer_start', this.$store.state.music.list.items[0]);
              if (this.$route.query.true_play === 1) {
                this.$router.back(-1);
              } else {
                this.$emit('jplayer_play_pause', 'pause');
              }
            }
          }
        });
      }
    },
    mounted() {
      this.init();
      this.app.music_mini = false
    }
  }
</script>