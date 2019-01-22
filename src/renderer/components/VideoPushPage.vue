<template>
    <transition name="fade">
       <div id="wrapper">
           <Row class="video_push_top">
               <Col span="15" class="video_push_top_left">
                   <Upload
                           type="drag"
                           :data="up_config.data"
                           :format="up_config.format"
                           :action="up_config.action"
                           :on-progress="progress"
                           :on-success="success"
                           :on-error="error"
                           :show-upload-list="false"
                   >
                           <div class="video_push_ul_box">
                               <div class="video_push_top_left_btn_box">
                                   <Icon class="video_push_top_left_btn_box_i" type="android-folder-open"></Icon>
                                   <div class="video_push_top_left_btn_box_text">
                                       <p>选择视频</p>
                                       <p>{{up_config._textMsg}}</p>
                                   </div>
                               </div>
                               <p class="video_push_top_left_box_text">上传单个文件最大2G。支持上传格式：{{up_config._accept_text}}</p>
                           </div>
                   </Upload>
                   <p class="video_push_top_left_text">禁止发布的视频内容 | 高清、超高清视频标识 | 传视频赚外快</p>
               </Col>
               <Col span="9" class="video_push_top_right">
                 <Input :rows="5" v-model="up_input.desc" class="video_push_top_right_desc" type="textarea" placeholder="对你的视频描述点什么吧~~" />
                  <div class="video_push_top_right_btn">
                      <div class="video_push_top_right_btn_title">视频标题（用于快速查找）：</div>
                      <Input v-model="up_input.title" placeholder="输入您的标题..." clearable class="video_push_top_right_btn_1" />
                      <div class="video_push_top_right_btn_title">公开程度（公开视频将所有人可见）：</div>
                      <Select v-model="up_input.open_status" class="video_push_top_right_btn_status">
                          <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                  </div>
                  <div style="width: 92%;text-align: center;margin-bottom: 19px;"><Button @click="submit()" type="primary">提交</Button></div>
               </Col>
           </Row>
           <div class="video_push_btn_box">
               <div class="index_user_content_title" style="background: none">
                  <span style="margin-left: 0" class="index_user_content_title_span">
                      <Icon type="ios-star"></Icon>
                      最新视频动态
                  </span>
               </div>
               <Carousel class="video_push_btn" v-model="carousel" :dots='dots' loop>


                   <CarouselItem>
                       <Row :gutter="4">
                           <Col v-for='v, k in $store.state.video.push.lists' v-if="k < 4" span="6">
                               <Card @click.native="$router.push({ path: '/video/detail',query:{id:v.id} })" style="padding: 0;margin: 0;">
                                   <img height="169" width="100%" :onerror="$onError('error_video.jpg')" :src="$ProcessingPic(v.thumb,'?imageMogr2/gravity/Center/crop/216x111')">
                                   <div class="video_push_btn_titleBox">
                                       <h3>{{v.title}}</h3>
                                       <p>{{v.description}}</p>
                                   </div>
                               </Card>
                           </Col>
                           <Col v-else></Col>
                       </Row>
                   </CarouselItem>

                   <CarouselItem>
                       <Row :gutter="4">
                           <Col v-for='v, k in $store.state.video.push.lists' v-if="k > 4 && k < 9" span="6">
                               <Card @click.native="$router.push({ path: '/video/detail',query:{id:v.id} })" style="padding: 0;margin: 0;">
                                   <img height="169" width="100%" :onerror="$onError('error_video.jpg')" :src="$ProcessingPic(v.thumb,'?imageMogr2/gravity/Center/crop/216x111')">
                                   <div class="video_push_btn_titleBox">
                                       <h3>{{v.title}}</h3>
                                       <p>{{v.description}}</p>
                                   </div>
                               </Card>
                           </Col>
                           <Col v-else></Col>
                       </Row>
                   </CarouselItem>

                   <CarouselItem>
                       <Row :gutter="4">
                           <Col v-for='v, k in $store.state.video.push.lists' v-if="k > 9 && k < 15" span="6">
                               <Card @click.native="$router.push({ path: '/video/detail',query:{id:v.id} })" style="padding: 0;margin: 0;">
                                   <img height="169" width="100%" :onerror="$onError('error_video.jpg')" :src="$ProcessingPic(v.thumb,'?imageMogr2/gravity/Center/crop/216x111')">
                                   <div class="video_push_btn_titleBox">
                                       <h3>{{v.title}}</h3>
                                       <p>{{v.description}}</p>
                                   </div>
                               </Card>
                           </Col>
                           <Col v-else></Col>
                       </Row>
                   </CarouselItem>


               </Carousel>
           </div>

       </div>
    </transition>
</template>

<script>
    import '../../../static/css/video/push.scss'
    import {NoticeWarning, NoticeInfo} from '../tool/function';
    export default {
      name: 'video-push-page',
      props: ['app'],
      data: function () {
        return {
          up_config: {data: {}, format: [], action: '', _accept_text: '', _textMsg: '或将视频拖到此处'},
          up_input: {
            file_id: 0,
            desc: '',
            title: '',
            open_status: '0'
          },
          statusList: [{value: '1', label: '公开'}, {value: '0', label: '私有'}],
          carousel: 0,
          dots: 'none'
        }
      },
      methods: {
        init() {
          this.$post('/api/video/index', {})
              .then((response) => {
                if (response.status === true) {
                  this._data.up_config.format = response.data.up_config.file_accept;
                  this._data.up_config.action = response.data.up_config.up_path;
                  this._data.up_config.data = {token: response.data.up_config.qiniu_token};
                  this._data.up_config._accept_text = response.data.up_config._accept_text;
                  this.$store.commit('video_update_up_config', response.data.up_config);
                  this.$store.commit('video_update_lists', response.data.up_list);
                }
              });
        },
        submit() {
          let data = this._data.up_input;
          if (!data.file_id) { NoticeWarning('请上传视频。。。'); return false; }
          if (!data.title) { NoticeWarning('输入您的标题。。。'); return false; }
          if (!data.desc) { NoticeWarning('对你的视频描述点什么吧。。。'); return false; }
          this.$post('/api/video/Push', data)
            .then((response) => {
              if (response.status === true) {
                NoticeInfo('发布成功', '视频发布成功，后台正在处理，请稍等片刻！！！');
                this.init();
                this.$router.push({ path: '/video/index' });
              } else {
                NoticeWarning(response.msg);
              }
              this._data.up_config._textMsg = '或将视频拖到此处';
            });
        },
        progress(res) { this._data.up_config._textMsg = '上传中: ' + Math.ceil(res.percent) + ' %'; },
        success(res, file) {
          this._data.up_input.desc = file.name;
          this._data.up_input.title = file.name;
          this._data.up_config._textMsg = '上传成功！';
          this._data.up_input.file_id = res.file_id;
        },
        error() { this._data.up_config._textMsg = '失败！稍后再试！'; }
      },
      mounted() {
        this.init();
      }
    }

</script>