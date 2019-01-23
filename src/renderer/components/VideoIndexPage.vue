<template>
    <transition name="fade">
        <div id="wrapper" class="video_index">
            <div class="index_user_content_title" style="height: 45px; text-align: center;line-height: 45px;">
                <Icon type="social-youtube-outline"></Icon> 我的视频
            </div>

            <Row :gutter="10" class="video_index_list_box">

                <i-col v-for='v, k in $store.state.video.data.items' span="6">
                    <Card style="width:100%">
                        <div class="video_index_list_init_images" style="text-align:center">
                            <img class="video_index_list_init_img" :onerror="$onError('error_video.jpg')" :src="$ProcessingPic(v.thumb,'?imageMogr2/gravity/Center/crop/216x111')" />
                            <div class="video_index_list_init_foucs">
                                <Icon @click.native="edit_Box_cg(k)" type="compose" style="font-size: 25px;margin-right: 15px"></Icon>
                                <Icon @click.native="$router.push({ path: '/video/detail',query:{id:v.id} })" style="font-size:50px;margin: 15px 0 15px 0;" type="social-youtube-outline"></Icon>
                                <Icon @click.native="delete_video(v.id)" type="trash-a" style="font-size: 25px;margin-left: 15px"></Icon>
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

            <Modal
                    v-model="edit_Box_modal"
                    :transition-names="['ease', 'fade']"
                    class-name="video_edit_center_modal"
                    :closable="false"
            >
                <div class="video_edit_center_modal_body">
                    <Input v-model="edit_input.desc" type="textarea" placeholder="是否为视频添加一点点描述呢..." />
                    <Input v-model="edit_input.title" placeholder="视频标题..." />
                    <Select v-model="edit_input.open_status">
                        <Option v-for="item in edit_status_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <div style="text-align: center;padding-top: 16px;">
                        <Button @click="edit_submit()" type="primary">提交编辑</Button>
                    </div>
                </div>
                <div class="video_edit_center_modal_footer" slot="footer"></div>
            </Modal>

        </div>
    </transition>
</template>

<script>
  import '../../../static/css/video/index.scss'
  import {NoticeWarning, NoticeInfo} from '../tool/function';
  import { Modal } from 'iview';
  export default {
    name: 'video-index-page',
    props: ['app'],
    data: function () {
      return {
        edit_input: {
          id: 0,
          desc: '',
          title: '',
          open_status: 1
        },
        edit_status_list: [{value: '1', label: '公开'}, {value: '0', label: '私有'}],
        edit_Box_modal: false
      }
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
      },
      edit_Box_cg(k) {
        const o = this.$store.state.video.data.items[k];
        this.edit_input = {
          id: o.id,
          desc: o.description,
          title: o.title,
          open_status: o.status
        };
        this.edit_Box_modal = true;
      },
      edit_submit() {
        this.$post('/api/video/Edit', this.edit_input).then((response) => {
          if (response.status === true) {
            NoticeInfo('视频编辑成功啦！！！');
            this.edit_Box_modal = false;
            this.init();
          } else {
            NoticeWarning(response.msg);
          }
        });
      },
      delete_video(id) {
        Modal.confirm({
          title: '删除提示',
          content: '<p>您确定要删除吗？删除以后将无法恢复。。。</p>',
          loading: true,
          onOk: () => {
            this.$post('/api/video/Del', {id: id}).then((response) => {
              Modal.remove();
              if (response.status === true) {
                NoticeInfo('视频删除成功啦！！！');
                this.init();
              } else {
                NoticeWarning(response.msg);
              }
            });
          }
        });
      }
    },
    mounted() {
      this.init();
    }
  }

</script>