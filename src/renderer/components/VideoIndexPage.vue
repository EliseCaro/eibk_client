<template>
    <transition name="fade">
        <div id="wrapper" class="video_index">
            <div class="index_user_content_title" style="height: 45px; text-align: center;line-height: 45px;">
                <Icon type="social-youtube-outline"></Icon> 我的视频
            </div>

            <Row :gutter="10" class="video_index_list_box">

                <i-col v-for='v, k in $store.state.video.data.items' span="6">
                    <Card @click.native="$router.push({ path: '/video/detail',query:{id:v.id} })" style="width:100%">
                        <div class="video_index_list_init_images" style="text-align:center">
                            <img class="video_index_list_init_img" :onerror="$onError('error_video.jpg')" :src="$ProcessingPic(v.thumb,'?imageMogr2/gravity/Center/crop/216x111')" />
                            <div class="video_index_list_init_foucs">
                                <Icon style="font-size:50px;margin: 15px 0 15px 0;" type="social-youtube-outline"></Icon>
                                <h3 class="video_index_list_init_font">{{v.title}}</h3>
                            </div>
                            <h3 class="video_index_list_init_botton_font">{{v.title}}</h3>
                        </div>
                    </Card>
                </i-col>


            </Row>
            <div class="video_index_list_page">
                <Page
                        :page-size="$store.state.video.data.limit"
                        :total="$store.state.video.data.total_items"
                        :current="$store.state.video.data.current"
                        @on-change="init"
                ></Page>
            </div>
        </div>
    </transition>
</template>

<script>
  import '../../../static/css/video/index.scss'
  export default {
    name: 'video-index-page',
    props: ['app'],
    data: function () {
      return {}
    },
    methods: {
      init(page) {
        let o = this;
        this.$post('/api/video/videoList', {page: page || 1})
          .then((response) => {
            if (response.status === true) {
              o.$store.commit('video_update_data', response.data);
            }
          });
      }
    },
    mounted() {
      this.init();
    }
  }

</script>