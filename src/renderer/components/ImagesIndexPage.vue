<template>
    <transition name="fade">
        <div id="wrapper" class="images_index">
            <div class="images_index_header">

                <h3>我的相册【<Icon @click.navite="create_up_modal = true" style="cursor: pointer" type="android-add"></Icon>】</h3>
                <p>———————轻轻挥别，匆匆岁月</p>
            </div>
            <Row class="pic-details-image-wrapper">

                <i-col v-for='v, k in $store.state.images.list.items' v-if="k === 0"  @click.native="$router.push({ path: '/images/detail',query:{id:v.id} })" class="pic-details-image-wrapper_init" span="6">
                    <div class="pic-details-image-wrapper_init_avt">
                        <img :src="$ProcessingPic(v.path,'?imageMogr2/thumbnail/300x/gravity/Center/crop/200x200')">
                    </div>
                    <div class="pic-details-image-wrapper_init_bg" :style="{backgroundImage:get_backgurond(v.path,'?imageMogr2/thumbnail/300x/gravity/Center/crop/200x200/blur/20x10')}"></div>
                </i-col>

                <i-col v-for='v, k in $store.state.images.list.items' v-if="k === 0" class="pic-details-image-wrapper_init" span="6">
                    <div @click="$router.push({ path: '/images/detail',query:{id:v.id} })" class="pic-details-image-wrapper_init_recommend-infobox text_left">
                            <div class="pic-details-image-wrapper_init_recommend-data">{{v.name}}</div>
                            <h2><Icon type="ios-calendar-outline"></Icon> {{$formatDate(v.update_time,"Y-m-d")}} </h2>
                            <p>{{v.description}}</p>
                    </div>
                    <div class="info-tra-left"></div>
                    <div @click="$router.push({ path: '/images/detail',query:{id:$store.state.images.list.items[1].id} })" v-if="$store.state.images.list.items.length > 1" class="pic-details-image-wrapper_init_recommend-infobox text_right">
                            <div class="pic-details-image-wrapper_init_recommend-data">{{$store.state.images.list.items[1].name}}</div>
                            <h2><Icon type="ios-calendar-outline"></Icon> {{$formatDate($store.state.images.list.items[1].update_time,"Y-m-d")}} </h2>
                            <p>{{$store.state.images.list.items[1].description}}</p>
                    </div>
                    <div class="info-tra-right"></div>
                </i-col>


                <i-col @click.native="$router.push({ path: '/images/detail',query:{id:$store.state.images.list.items[1].id} })" v-if="$store.state.images.list.items.length > 1" class="pic-details-image-wrapper_init rotateXz90" span="6">
                    <Carousel
                            :autoplay="CarouselSetting.autoplay"
                            :dots="CarouselSetting.dots"
                            :arrow="CarouselSetting.arrow"
                            :autoplay-speed="CarouselSetting.autoplaySpeed"
                    >
                        <template v-if="$store.state.images.list.items[1].child.length > 0">
                            <Carousel-item  v-for='vc, kc in $store.state.images.list.items[1].child' >
                                <img class="rotateXz180" :src="$ProcessingPic(vc.path,'?imageMogr2/thumbnail/600x/gravity/Center/crop/400x400')"/>
                            </Carousel-item>
                        </template>
                        <template v-else>
                            <Carousel-item>
                                <img class="rotateXz180" :src="$ProcessingPic($store.state.images.list.items[1].path,'?imageMogr2/thumbnail/600x/gravity/Center/crop/400x400')"/>
                            </Carousel-item>
                        </template>
                    </Carousel>
                </i-col>


                <i-col @click.native="$router.push({ path: '/images/detail',query:{id:$store.state.images.list.items[2].id} })" v-if="$store.state.images.list.items.length > 2" class="pic-details-image-wrapper_init" span="6">
                    <div class="pic-details-image-wrapper_init_avt">
                        <img :src="$ProcessingPic($store.state.images.list.items[2].path,'?imageMogr2/thumbnail/300x/gravity/Center/crop/200x200')">
                    </div>
                    <div class="pic-details-image-wrapper_init_bg" :style="{backgroundImage:get_backgurond($store.state.images.list.items[2].path,'?imageMogr2/thumbnail/300x/gravity/Center/crop/200x200/blur/20x10')}" ></div>
                </i-col>


                <i-col @click.native="$router.push({ path: '/images/detail',query:{id:$store.state.images.list.items[3].id} })" v-if="$store.state.images.list.items.length > 3" class="pic-details-image-wrapper_init rotateXz90" span="6">
                    <img class="rotateXz180" :src="$ProcessingPic($store.state.images.list.items[3].path,'?imageMogr2/thumbnail/600x/gravity/Center/crop/400x400')" />
                </i-col>

                <i-col @click.native="$router.push({ path: '/images/detail',query:{id:$store.state.images.list.items[4].id} })" v-if="$store.state.images.list.items.length > 4" class="pic-details-image-wrapper_init" span="6">
                    <div class="pic-details-image-wrapper_init_avt">
                        <img :src="$ProcessingPic($store.state.images.list.items[4].path,'?imageMogr2/thumbnail/300x/gravity/Center/crop/200x200')" >
                    </div>
                    <div class="pic-details-image-wrapper_init_bg" :style="{backgroundImage:get_backgurond($store.state.images.list.items[2].path,'?imageMogr2/thumbnail/300x/gravity/Center/crop/200x200/blur/20x10')}" ></div>
                </i-col>


                <i-col v-if="$store.state.images.list.items.length > 4" class="pic-details-image-wrapper_init" span="6">
                    <div @click="$router.push({ path: '/images/detail',query:{id:$store.state.images.list.items[4].id} })" class="pic-details-image-wrapper_init_recommend-infobox text_left">
                        <div class="pic-details-image-wrapper_init_recommend-data">{{$store.state.images.list.items[4].name}}</div>
                        <h2><Icon type="ios-calendar-outline"></Icon> {{$formatDate($store.state.images.list.items[4].update_time,"Y-m-d")}} </h2>
                        <p>{{$store.state.images.list.items[4].description}}</p>
                    </div>
                    <div class="info-tra-left"></div>
                    <div @click="$router.push({ path: '/images/detail',query:{id:$store.state.images.list.items[5].id} })" v-if="$store.state.images.list.items.length > 5" class="pic-details-image-wrapper_init_recommend-infobox text_right">
                        <div class="pic-details-image-wrapper_init_recommend-data">{{$store.state.images.list.items[5].name}}</div>
                        <h2><Icon type="ios-calendar-outline"></Icon> {{$formatDate($store.state.images.list.items[5].update_time,"Y-m-d")}} </h2>
                        <p>{{$store.state.images.list.items[5].description}}</p>
                    </div>
                    <div class="info-tra-right"></div>
                </i-col>


                <i-col @click.native="$router.push({ path: '/images/detail',query:{id:$store.state.images.list.items[5].id} })" v-if="$store.state.images.list.items.length > 5" class="pic-details-image-wrapper_init rotateXz90" span="6">
                    <Carousel
                        :autoplay="CarouselSetting.autoplay"
                        :dots="CarouselSetting.dots"
                        :arrow="CarouselSetting.arrow"
                        :autoplay-speed="CarouselSetting.autoplaySpeed"
                        :easing="CarouselSetting.easing"
                    >
                        <template v-if="$store.state.images.list.items[5].child.length > 0">
                            <Carousel-item  v-for='vc, kc in $store.state.images.list.items[5].child' >
                                <img class="rotateXz180" :src="$ProcessingPic(vc.path,'?imageMogr2/thumbnail/600x/gravity/Center/crop/400x400')"/>
                            </Carousel-item>
                        </template>
                        <template v-else>
                            <Carousel-item>
                                <img class="rotateXz180" :src="$ProcessingPic($store.state.images.list.items[5].path,'?imageMogr2/thumbnail/600x/gravity/Center/crop/400x400')"/>
                            </Carousel-item>
                        </template>

                    </Carousel>
                </i-col>

            </Row>
            <div class="images_index_list_page">
                <Page
                    :page-size="$store.state.images.list.limit"
                    :total="$store.state.images.list.total_items"
                    :current="$store.state.images.list.current"
                    @on-change="init"
                    >
                </Page>
            </div>

            <Modal
                    v-model="create_up_modal"
                    :transition-names="['ease', 'fade']"
                    class-name="images_up_center_modal"
                    :closable="false"
            >
                <div class="images_up_center_modal_body">
                    <Row>
                        <i-col class="images_up_center_modal_body_left" span="9">
                            <Upload
                                    type="drag"
                                    :data="up_parameters.data"
                                    :format="up_parameters.format"
                                    :action="up_parameters.action"
                                    :on-success="OnSuccess"
                                    :on-error="OnError"
                                    :show-upload-list="false"
                                    class="images_up_center_modal_body_left_upload_file"
                            >
                                <div class="images_up_center_modal_body_left_btn" :style="{backgroundImage:up_box_bg}">
                                    <Icon type="images"></Icon>
                                    <p>选择封面</p>
                                </div>
                            </Upload>
                        </i-col>
                        <i-col class="images_up_center_modal_body_right" span="15">
                            <Input v-model="up_input.desc" type="textarea" placeholder="是否为相册添加一点点描述呢..." />
                            <Input v-model="up_input.title" placeholder="请输入您相册标题..." />
                            <Select v-model="up_input.open_status">
                                <Option v-for="item in add_status_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <div style="width: 90%; text-align: center;">
                                <Button @click="submit()" type="primary">提交文件</Button>
                            </div>
                        </i-col>
                    </Row>
                </div>
                <div class="images_up_center_modal_footer" slot="footer"></div>
            </Modal>

        </div>
    </transition>
</template>

<script>
  import '../../../static/css/images/index.scss'
  import {NoticeWarning, NoticeInfo} from '../tool/function';
  export default {
    name: 'images-index-page',
    props: ['app'],
    data: function () {
      return {
        CarouselSetting: {autoplay: true, dots: 'none', arrow: 'never', autoplaySpeed: 5000, easing: 'linear'},
        create_up_modal: false,
        up_parameters: {data: {}, format: [], action: ''},
        up_input: {file_id: '', desc: '', title: '', open_status: '0'},
        up_box_bg: '',
        add_status_list: [{value: '1', label: '公开'}, {value: '0', label: '私有'}]
      }
    },
    methods: {
      init(page) {
        this.$post('/photos/CoverList', {page: page || 1}).then((response) => {
          if (response.status === true) {
            this.up_parameters = {
              action: response.data.u_url,
              data: {
                token: response.data.u_token
              },
              format: response.data.u_accept
            };
            this.$store.commit('images_update_list', response.data.data_list);
          }
        });
      },
      submit() {
        this.$post('/photos/CoverAdd', this.up_input).then((response) => {
          if (response.status === true) {
            NoticeInfo('添加成功', '相册添加成功！！！');
            this.init();
            this.create_up_modal = false;
            this.up_box_bg = '';
          } else {
            NoticeWarning(response.msg);
          }
        });
      },
      OnSuccess(res) {
        if (res && res.ret === 'success') {
          this.up_input.file_id = res.file_id;
          this.up_box_bg = 'url(' + res.file_path + '?imageMogr2/thumbnail/300x/gravity/Center/crop/200x200)';
        }
      },
      OnError() { NoticeWarning('上传失败', '您的图片上传失败！请联系管理员或稍后再试！') },
      get_backgurond(path, size) {
        return 'url(' + this.$ProcessingPic(path, size) + ')'
      }
    },
    mounted() {
      this.init();
    }
  }

</script>