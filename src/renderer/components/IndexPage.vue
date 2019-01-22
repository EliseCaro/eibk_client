<template>
    <transition name="fade">
          <div id="wrapper">
              <Row class="index_left_title">
                  <Col v-for='v, k in $store.state.main.data.count' span="6" @click.native="$router.push({ path: v.url})" >
                      <div class="index_left_title_init">
                          <p class="index_left_title_init_p1">{{v.count}}</p>
                          <p class="index_left_title_init_p2">{{v.title}}</p>
                      </div>
                  </Col>
              </Row>
              <Card class="index_left_music">
                  <div class="index_user_content_title">
                      <span class="index_user_content_title_span">
                          <Icon type="ios-star"></Icon>
                          我的音乐
                      </span>
                  </div>
                  <Row class="index_left_music_box">
                      <Col @click.native="$router.push({ path: '/music/index'})" v-for='v, k in $store.state.main.data.music' span="4" class="index_left_music_init">
                          <img :src="$ProcessingPic(v.cover,'?imageMogr2/thumbnail/300x/gravity/Center/crop/200x200')" />
                          <p>{{v.title}} - {{v.artist}}</p>
                      </Col>
                  </Row>
              </Card>
              <Row class="index_left_button_box">
                  <Col class="index_left_button_box_left" span="9">
                     <div class="index_left_button_box_left_box">
                         <div class="index_user_content_title" style="background: rgba(250, 250, 250, 0.4);">
                             <span class="index_user_content_title_span">
                                 <Icon type="ios-star"></Icon>
                                 我的相册
                             </span>
                         </div>
                         <div class="index_left_button_photos">

                             <Row v-for='v, k in $store.state.main.data.cover' v-if="k === 0" @click.native="$router.push({ path: '/images/detail',query:{id:v.id} })">
                                 <Col class="index_left_button_photos_max" span="12">
                                    <div class="index_left_button_photos_max_bg" :style="{backgroundImage: $ProcessingPic(v.cover,'?imageMogr2/thumbnail/300x/gravity/Center/crop/200x200/blur/20x10')}"></div>
                                    <div class="index_left_button_photos_max_avt"><img :src="$ProcessingPic(v.cover,'?imageMogr2/thumbnail/300x/gravity/Center/crop/200x200')"></div>
                                 </Col>
                                 <Col class="index_left_button_photos_right" span="12">
                                     <div class="index_left_button_photos_right_top">
                                         <p>{{v.name}}</p>
                                         <p>
                                             <Icon type="calendar"></Icon>&nbsp;
                                             {{$formatDate(v.update_time,"Y-m-d")}}
                                         </p>
                                     </div>
                                     <div class="index_left_button_photos_right_top_left_icon"></div>
                                     <div class="index_left_button_photos_right_top" style="padding-top:2px">
                                         <Row class="index_left_button_photos_right_top_list">
                                             <Col v-for='vs, ks in v.child' span="12">
                                                <img :src="$ProcessingPic(vs.path,'?imageMogr2/thumbnail/300x/gravity/Center/crop/200x200')" />
                                             </Col>
                                         </Row>
                                     </div>
                                  </Col>
                             </Row>
                             <Row  v-else @click.native="$router.push({ path: '/images/detail',query:{id:v.id} })">
                                  <Col span="12" class="index_left_button_photos_right">
                                     <div class="index_left_button_photos_right_top">
                                         <Row class="index_left_button_photos_right_top_list">
                                             <Col v-for='vs, ks in v.child' span="12">
                                               <img :src="$ProcessingPic(vs.path,'?imageMogr2/thumbnail/300x/gravity/Center/crop/200x200')">
                                             </Col>
                                         </Row>
                                     </div>
                                     <div class="index_left_button_photos_right_top">
                                         <p>{{v.name}}</p>
                                         <p>
                                             <Icon type="calendar"></Icon>&nbsp;
                                             {{$formatDate(v.update_time,"Y-m-d")}}
                                         </p>
                                     </div>
                                     <div class="index_left_button_photos_right_top_left_icon"></div>
                                  </Col>
                                 <Col span="12" class="index_left_button_photos_max">
                                     <div class="index_left_button_photos_max_bg" :style="{backgroundImage: $ProcessingPic(v.cover,'?imageMogr2/thumbnail/300x/gravity/Center/crop/200x200/blur/20x10')}"></div>
                                     <div class="index_left_button_photos_max_avt">
                                         <img :src="$ProcessingPic(v.cover,'?imageMogr2/thumbnail/300x/gravity/Center/crop/200x200')">
                                     </div>
                                 </Col>
                             </Row>
                         </div>
                     </div>
                  </Col>
                  <Col span="15" class="index_left_button_box_right">
                      <div class="index_left_button_box_right_box">
                          <div class="index_user_content_title" style="background: none;">
                              <span class="index_user_content_title_span">
                                  <Icon type="ios-star"></Icon>
                                  最新评论
                              </span>
                          </div>
                          <div class="index_comment">
                               <div v-for='v, k in $store.state.main.data.comment.items' class="index_comment_init">
                                   <div class="index_comment_init_avatar">
                                       <img :src="$ProcessingPic(v.path,'?imageMogr2/gravity/Center/crop/200x200')">
                                   </div>
                                   <div class="index_comment_init_right">
                                       <div class="index_comment_init_right_nickname">{{v.nickname}} <span> {{$formatDate(v.update_time,"Y-m-d")}} </span></div>
                                       <p class="index_comment_init_right_content">{{v.content}}</p>
                                   </div>
                               </div>
                              <div class="index_comment_page">
                                  <Page
                                          :page-size="$store.state.main.data.comment.limit"
                                          :total="$store.state.main.data.comment.total_items"
                                          :current="$store.state.main.data.comment.current"
                                          @on-change="init"
                                  ></Page>
                              </div>
                          </div>
                      </div>
                  </Col>
              </Row>
          </div>
    </transition>
</template>

<script>
    import '../../../static/css/index/index.scss'
    export default {
      name: 'index-page',
      props: ['app'],
      data: function () {
        return {}
      },
      methods: {
        init(page) {
          let o = this;
          this.$post('/api/index/index', {page: page || 1})
            .then((response) => {
              if (response.status === true) {
                o.$store.commit('main_update_data', response.data);
              }
            });
        }
      },
      mounted() {
        this.init();
      }
    }
</script>
