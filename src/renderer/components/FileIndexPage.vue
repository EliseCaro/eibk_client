<template>
    <transition name="fade">
        <div id="wrapper" class="file_index">
            <div class="index_user_content_title" style="height: 49px;">
                <i-button @click="up_Box_modal = true" style="margin-top: 6px;"><Icon type="plus"></Icon> 上传文件</i-button>
            </div>
            <Row :gutter="10" class="file_index_list_box">
                <i-col v-for='v, k in $store.state.file.list.items' span="4">
                    <Card class="file_index_list_box_card" style="width:100%">
                        <div style="text-align:center">
                            <Icon class="file_index_list_init_icon" :type="file_type_icon[v.ext]"></Icon>
                            <h3 class="file_index_list_init_font">{{v.title}}</h3>
                        </div>
                        <div class="file_index_list_box_card_fix">
                            <p>
                                <Button @click="edit_Box_modal_click(k)" >编辑</Button>&nbsp;
                                <Button @click="delete_click(v.id)">删除</Button>
                            </p>
                            <p>
                                <Button @click="dowload_click(v.path,v.title+'.'+v.ext)">下载</Button>&nbsp;
                                <Button disabled>查看</Button>
                            </p>
                        </div>
                    </Card>
                </i-col>
            </Row>
             <div class="file_index_list_page">
                 <Page
                         :page-size="$store.state.file.list.limit"
                         :total="$store.state.file.list.total_items"
                         :current="$store.state.file.list.current"
                         @on-change="init"
                 ></Page>
             </div>

            <Modal
                    v-model="up_Box_modal"
                    :transition-names="['ease', 'fade']"
                    class-name="file_up_center_modal"
                    :closable="false"
            >
                <div class="file_up_center_modal_body">
                    <Row>
                        <i-col class="file_up_center_modal_body_left" span="12">
                            <Upload
                                    type="drag"
                                    :data="up_parameters.data"
                                    :format="up_parameters.format"
                                    :action="up_parameters.action"
                                    :on-progress="OnProgress"
                                    :on-success="OnSuccess"
                                    :on-error="OnError"
                                    :show-upload-list="false"
                                    class="file_up_center_modal_body_left_upload_file"
                            >
                                <div class="file_up_center_modal_body_left_btn">
                                    <Icon type="ios-cloud-upload-outline" />
                                    <div>
                                        <h3>选择文件</h3>
                                        <p>{{up_parameters._textMsg}}</p>
                                    </div>
                                </div>
                            </Upload>
                        </i-col>
                        <i-col class="file_up_center_modal_body_right" span="12">
                            <Input v-model="up_input.desc" type="textarea" placeholder="是否为文件添加一点点描述呢..." />
                            <div class="file-mag-select_open">
                                <div class="file-mag-select_title">文件标题（用于快速查找）：</div>
                                <Input v-model="up_input.title" placeholder="请输入您的标题..." />
                            </div>
                            <div style="width: 90%; text-align: center;">
                                <Button @click="submit()" type="primary">提交文件</Button>
                            </div>
                        </i-col>
                    </Row>
                </div>
                <div class="file_up_center_modal_footer" slot="footer"></div>
            </Modal>
            <Modal
                    v-model="edit_Box_modal"
                    :transition-names="['ease', 'fade']"
                    class-name="file_edit_center_modal"
                    :closable="false"
            >
                <div class="file_edit_center_modal_body">
                    <Input v-model="edit_input.desc" type="textarea" placeholder="是否为文件添加一点点描述呢..." />
                    <Input v-model="edit_input.title" placeholder="文件标题..." />
                    <Select v-model="edit_input.open_status">
                        <Option v-for="item in edit_status_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <div style="text-align: center;padding-top: 16px;">
                        <Button @click="edit_submit()" type="primary">提交编辑</Button>
                    </div>
                </div>
                <div class="file_edit_center_modal_footer" slot="footer"></div>
            </Modal>

        </div>
    </transition>
</template>

<script>
  import '../../../static/css/file/index.scss'
  import {NoticeWarning, NoticeInfo} from '../tool/function';
  import { Modal } from 'iview';
  export default {
    name: 'file-index-page',
    data: function () {
      return {
        up_Box_modal: false,
        edit_Box_modal: false,
        up_parameters: {data: {}, format: [], action: '', _textMsg: '或将文件拖到此处'},
        up_input: {file_id: 0, desc: '', title: '', open_status: '0'},
        edit_input: {id: 0, desc: '', title: '', open_status: '0'},
        edit_status_list: [{value: '1', label: '公开'}, {value: '0', label: '私有'}],
        file_type_icon: []
      }
    },
    methods: {
      init(page) {
        this.$post('/file/index', {page: page || 1, kw: this.$route.query.kw || ''}).then((response) => {
          if (response.status === true) {
            this._data.up_parameters = {
              action: response.data.up_url,
              data: {
                token: response.data.u_token
              },
              format: response.data.u_accept,
              _textMsg: '或将文件拖到此处'
            };
            this._data.file_type_icon = response.data.accept_icon;
            this.$store.commit('file_update_list', response.data.data_list);
          }
        });
      },
      submit() {
        this.$post('/file/Save', this._data.up_input).then((response) => {
          if (response.status === true) {
            this.init();
            NoticeInfo('上传成功', '文件上传成功，后台正在处理，请稍等片刻！！！');
            this._data.up_parameters._textMsg = '或将文件拖到此处';
            this._data.up_input = {file_id: 0, desc: '', title: '', open_status: '0'};
            this._data.up_Box_modal = false;
          } else {
            NoticeWarning(response.msg);
          }
        });
      },
      edit_Box_modal_click(k) {
        const obj = this.$store.state.file.list.items[k];
        this.edit_input = {
          id: obj.id,
          desc: obj.description,
          title: obj.title,
          open_status: obj.status
        };
        this.edit_Box_modal = true;
      },
      edit_submit() {
        this.$post('/file/SaveEditor', this.edit_input).then((response) => {
          if (response.status === true) {
            this.edit_Box_modal = false;
            this.init();
            NoticeInfo('编辑文件成功', '编辑文件成功！！！');
          } else {
            NoticeWarning(response.msg);
          }
        });
      },
      delete_click(id) {
        Modal.confirm({
          title: '删除提示',
          content: '<p>您确定要删除吗？删除以后将无法恢复。。。</p>',
          loading: true,
          onOk: () => {
            this.$post('/file/Del', {id: id}).then((response) => {
              Modal.remove();
              if (response.status === true) {
                this.init();
                NoticeInfo('文件已经删除。。。');
              } else {
                NoticeWarning(response.msg);
              }
            });
          }
        });
      },
      dowload_click(path, name) {
        const url = this.$ProcessingPic(path) + '?attname=' + name;
        this.$emit('electron_dowload_insertDb', url);
      },
      OnProgress(res) { this._data.up_parameters._textMsg = '上传中: ' + Math.ceil(res.percent) + ' %'; },
      OnSuccess(res, file) {
        this._data.up_input.desc = file.name;
        this._data.up_input.title = file.name;
        this._data.up_input.file_id = res.file_id;
        this._data.up_parameters._textMsg = '上传成功！';
      },
      OnError() { this._data.up_parameters._textMsg = '失败！稍后再试！'; }
    },
    mounted() {
      this.init();
    }
  }

</script>