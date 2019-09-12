<template>
    <transition name="fade">
        <div id="wrapper" class="images_detail">
            <Row class="images_detail_header">
                <i-col :style="{backgroundImage:get_backgurond($store.state.images.detail_cate.cover,'?imageMogr2/thumbnail/500x/gravity/Center/crop/460x328')}" class="images_detail_header_left" span="9">
                    <h1>{{$store.state.images.detail_cate.name}}</h1>
                    <h2 >{{$formatDate($store.state.images.detail_cate.update_time,"Y-m-d")}} </h2>
                    <div class="icon_list">
                        <Icon type="ios-star-outline"></Icon>
                        <Poptip
                                confirm
                                title="您确认删除这个相册吗？"
                                @on-ok="delete_images_box"
                                >
                            <Icon type="ios-trash-outline"></Icon>
                        </Poptip>
                        <Icon @click.native="edit_Box_modal_click" type="ios-compose-outline"></Icon>

                    </div>
                    <p>{{$store.state.images.detail_cate.description}}</p>
                </i-col>
                <i-col span="15" style="padding: 0 !important;">
                    <div class="images_detail_header_right">

                        <div class="images_detail_header_right-upload-list" v-for='v, k in $store.state.images.detail.items' v-if="k < 11">
                            <img :src="$ProcessingPic(v.path,'?imageMogr2/thumbnail/300x/gravity/Center/crop/78x86')">
                            <div class="images_detail_header_right-upload-list-upload-list-cover">
                                <Icon type="arrow-expand" @click="browse(k)"></Icon>
                                <Icon type="close-round" @click="deleteImg(v.id)"></Icon>
                            </div>
                        </div>

                        <Upload
                                ref:upload
                                :show-upload-list="false"
                                multiple
                                :action="up_config.action"
                                :data="up_config.data"
                                :on-success="OnSuccess"
                                :on-error="OnError"
                                type="drag"
                                :format="['jpg','jpeg','png','gif']"
                                style="display:inline-block;width:92px;">
                            <div style="width:92px;height:97px;line-height:122px;text-align:center">
                                <Icon type="camera" size="50"></Icon>
                            </div>
                        </Upload>
                        <Modal
                                v-model="browse_Box_modal"
                                :transition-names="['ease', 'fade']"
                                class-name="browse_edit_center_modal"
                                :closable="false"
                        >
                            <div class="browse_edit_center_modal_body" :style="{width:browse_data.width,height: browse_data.height}">
                                <img style="width: 100%;height: 100%" :src="$ProcessingPic(browse_data.ts_obj.path)"/>
                                <div class="browse_edit_center_modal_btn">
                                    <Icon class="l" v-if="browse_data.pv_obj != false" @click.native="browse(browse_data.pv_obj)" type="ios-arrow-left"></Icon>
                                    <Icon class="r" v-if="browse_data.nx_obj != false" @click.native="browse(browse_data.nx_obj)" type="ios-arrow-right"></Icon>
                                </div>
                            </div>
                            <div class="browse_edit_center_modal_footer" slot="footer"></div>
                        </Modal>
                    </div>
                </i-col>

            </Row>

            <Row class="images_detail_box" :gutter="8">
                <i-col v-for='v, k in $store.state.images.detail.items' class="images_detail_list_init" span="4">
                    <img @click="browse(k)" :src="$ProcessingPic(v.path,'?imageMogr2/thumbnail/300x/gravity/Center/crop/157x175')">
                    <div class="images_detail_list_init_foucs">
                        <Icon type="arrow-expand" @click="browse(k)"></Icon>
                        <Icon type="close-round" @click="deleteImg(v.id)"></Icon>
                        <Icon type="gear-a" @click="settingImg(v.file_id)"></Icon>
                    </div>
                </i-col>
                <div class="images_detail_list_page">
                    <Page
                            :page-size="$store.state.images.detail.limit"
                            :total="$store.state.images.detail.total_items"
                            :current="$store.state.images.detail.current"
                            @on-change="init"
                    ></Page>
                </div>
            </Row>

            <Modal
                    v-model="edit_Images_Box_modal"
                    :transition-names="['ease', 'fade']"
                    class-name="images_edit_center_modal"
                    :closable="false"
            >
                <div class="images_edit_center_modal_body">
                    <Input v-model="edit_input.desc" type="textarea" placeholder="是否添加一点点描述呢..." />
                    <Input v-model="edit_input.title" placeholder="标题..." />
                    <Select v-model="edit_input.open_status">
                        <Option v-for="item in edit_status_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <div style="text-align: center;padding-top: 16px;">
                        <Button @click="edit_submit()" type="primary">提交编辑</Button>
                    </div>
                </div>
                <div class="images_edit_center_modal_footer" slot="footer"></div>
            </Modal>

        </div>
    </transition>
</template>

<script>
  import '../../../static/css/images/detail.scss'
  import {NoticeWarning, NoticeInfo, getImg, ProcessingPic} from '../tool/function';
  import { Modal } from 'iview';
  export default {
    name: 'images-detail-page',
    data: function () {
      return {
        cid: '',
        edit_input: {id: 0, desc: '', title: '', open_status: '0'},
        edit_Images_Box_modal: false,
        up_config: {data: {}, action: ''},
        browse_Box_modal: false,
        browse_data: {pv_obj: false, ts_obj: false, nx_obj: false, width: '960px', height: '650px'},
        edit_status_list: [{value: '1', label: '公开'}, {value: '0', label: '私有'}]
      }
    },
    methods: {
      init(page) {
        this.$post('/photos/GetData', {cid: this.cid, page: page || 1}).then((response) => {
          if (response.status === true) {
            this.up_config = {
              action: response.data.up_url,
              data: {
                token: response.data.token
              }
            };
            this.$store.commit('image_update_detail', response.data.list);
            this.$store.commit('image_update_detail_cate', response.data.cate);
          }
        });
      },
      browse(k) {
        let c = this.$store.state.images.detail.items[k].path;
        const o = this;
        getImg(ProcessingPic(c), 960, 650, function (w) {
          o.browse_data = {
            pv_obj: o.$store.state.images.detail.items[k - 1] ? k - 1 : false,
            ts_obj: o.$store.state.images.detail.items[k],
            nx_obj: o.$store.state.images.detail.items[k + 1] ? k + 1 : false,
            height: w.height + 'px',
            width: w.width + 'px'
          };
          o.browse_Box_modal = true;
        });
      },
      deleteImg(id) {
        Modal.confirm({
          title: '删除提示',
          content: '<p>您确定要删除吗？删除以后将无法恢复。。。</p>',
          loading: true,
          onOk: () => {
            this.$post('/photos/delPhotos', {id: id}).then((response) => {
              Modal.remove();
              if (response.status === true) {
                NoticeInfo('删除图片成功！！');
                this.init();
              } else {
                NoticeWarning(response.msg);
              }
            });
          }
        });
      },
      settingImg(id) {
        this.$post('/photos/settingPhotos', {id: id, cate: this.cid}).then((response) => {
          if (response.status === true) {
            NoticeInfo('设置成功', '您的设置已经生效。。');
            this.init();
          } else {
            NoticeWarning(response.msg);
          }
        });
      },
      edit_Box_modal_click() {
        const obj = this.$store.state.images.detail_cate;
        this.edit_input = {
          id: obj.id,
          desc: obj.description,
          title: obj.name,
          open_status: obj.status
        };
        this.edit_Images_Box_modal = true;
      },
      edit_submit() {
        this.$post('/photos/EditCover', this.edit_input).then((response) => {
          if (response.status === true) {
            this.edit_Images_Box_modal = false;
            this.init();
            NoticeInfo('编辑成功');
          } else {
            NoticeWarning(response.msg);
          }
        });
      },
      delete_images_box() {
        this.$post('/photos/delCover', {id: this.cid}).then((response) => {
          if (response.status === true) {
            NoticeInfo('删除成功！');
            this.$router.push({path: '/images/index'});
          } else {
            NoticeWarning(response.msg);
          }
        });
      },
      get_backgurond(path, size) { return 'url(' + path + size + ')' },
      OnSuccess(res) { if (res && res.ret === 'success') { this.init(); } },
      OnError() { NoticeWarning('上传失败', '您的图片上传失败！请联系管理员或稍后再试！') }
    },
    mounted() {
      this.cid = this.$route.query.id;
      this.init();
    }
  }

</script>
