<template>
    <transition name="fade">
        <div id="wrapper" style="margin: 25px;">
            <Row>
                <Col span="8" class="note_left">
                    <Row class="note_left_box">
                        <Col span="24" class="note_left_box_init" style="border-top-left-radius: 10px;border-top-right-radius: 10px;">
                                <span class="note_left_box_title">
                                    <Icon style="font-size: 18px;" type="ios-star"></Icon>
                                   我的笔迹
                                </span>
                                <div class="note_left_box_add_icon">
                                    <Icon @click.native="note_create()" type="compose"></Icon>
                                </div>
                        </Col>
                        <Col style="cursor: pointer" span="24">

                            <Card v-for='v, k in $store.state.note.list.items' @click.native="note_info(v.id)" :bordered="false">
                                <div slot="title" class="note_left_int_title">
                                    <div class="note_left_int_title_text">{{v.title}}</div>
                                    <div class="note_left_int_title_icon">
                                        <div v-if="id == v.id" style="border: 1px solid #0eae81;color: #0eae81;"> <Icon type="edit"></Icon></div>
                                        <div v-else> <Icon type="edit"></Icon></div>
                                        <div><Icon type="eye"></Icon></div>
                                        <div><Icon @click.native="note_del(v.id)" type="trash-a"></Icon></div>
                                    </div>
                                </div>
                                <div>
                                    <p class="note_left_box_desc_">{{v.descriptions}}</p>
                                    <p>
                                        <Icon type="calendar"></Icon>
                                        <span>{{$formatDate(v.update_time,"Y-m-d")}}</span>
                                    </p>
                                </div>
                            </Card>

                        </Col>
                        <Col span="24" class="note_left_box_init">
                            <Page class="note_left_page"
                                  simple
                                  :page-size="$store.state.note.list.limit"
                                  :total="$store.state.note.list.total_items"
                                  :current="$store.state.note.list.current"
                                  @on-change="init"
                            ></Page>
                        </Col>
                    </Row>
                </Col>
                <Col span="16">
                    <div @keyup.ctrl.83="save()">
                        <Upload
                                :action="header.up_url"
                                :data="header"
                                :multiple="false"
                                :paste="false"
                                :show-upload-list="false"
                                type="select"
                                :format="header.format"
                                :before-upload="beforeUpload"
                                :on-success="uploadSuccess"
                                :on-error="uploadError"
                                class="edit_upload_img"
                        >
                        </Upload>
                        <quill-editor
                                v-model="content"
                                ref="myQuillEditor"
                                :options="editorOption"
                                @blur="onEditorBlur($event)"
                                @focus="onEditorFocus($event)"
                                @change="onEditorChange($event)"
                                @ready="onEditorReady($event)">
                        </quill-editor>
                    </div>
                </Col>
            </Row>
        </div>
    </transition>
</template>

<script>
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import '../../../static/css/note/index.scss'
  import { quillEditor } from 'vue-quill-editor'
  import {NoticeWarning, NoticeInfo, NoticeError} from '../tool/function';
  import { Modal } from 'iview';
  const toolbarOptions = [['bold', 'italic', 'underline', 'strike'], ['blockquote', 'code-block'], [{ header: 1 }, { header: 2 }], [{ list: 'ordered' }, { list: 'bullet' }], [{ script: 'sub' }, { script: 'super' }], [{ indent: '-1' }, { indent: '+1' }], [{'direction': 'rtl'}], [{ header: [1, 2, 3, 4, 5, 6, false] }], [{ color: [] }, { background: [] }], [{ font: [] }], [{ align: [] }], ['clean'], ['link', 'image']];
  export default {
    name: 'note-index-page',
    props: ['app'],
    components: {quillEditor},
    data () {
      return {
        id: 0,
        content: '',
        page: 1,
        header: {
          token: '',
          up_url: '',
          format: ['jpg', 'png', 'gif']
        },
        editorOption: {
          theme: 'snow',
          placeholder: '您想说点什么？',
          modules: {
            toolbar: {
              container: toolbarOptions,
              handlers: {
                image: function (value) {
                  if (value) {
                    document.querySelector('.edit_upload_img input').click();
                  } else {
                    this.quill.format('image', false);
                  }
                },
                link: function(value) {
                  if (value) {
                    var href = prompt('请输入url');
                    this.quill.format('link', href);
                  } else {
                    this.quill.format('link', false);
                  }
                }
              }
            }
          }
        }
      }
    },
    mounted() { this.init(); },
    computed: {},
    methods: {
      note_info(id) {
        this._data.id = id; this.init(this._data.page);
        this.$post('/api/note/EditContent', {id: this._data.id}).then((response) => {
          if (response.status === true) {
            this._data.content = response.data.content;
          }
        });
      },
      note_create() {
        this._data.id = 0;
        this._data.content = '您想说点什么？';
      },
      note_del(id) {
        Modal.confirm({
          title: '删除提示',
          content: '<p>您确定要删除吗？删除以后将无法恢复。。。</p>',
          loading: true,
          onOk: () => {
            this.$post('/api/note/Del', {id: id}).then((response) => {
              Modal.remove();
              if (response.status === true) {
                NoticeInfo('笔记删除成功！！');
                this.init(this._data.page);
              } else {
                NoticeWarning(response.msg);
              }
            });
          }
        });
      },
      save() {
        this.$post('/api/note/add', {id: this._data.id || '', text: this._data.content}).then((response) => {
          if (response.status === true) {
            NoticeInfo('笔记保存成功！！');
            this.note_info(response.data.id);
          } else {
            NoticeWarning(response.msg);
          }
        });
      },
      init(page) {
        this._data.page = page;
        this.$post('/api/note/index', {page: this._data.page}).then((response) => {
          if (response.status === true) {
            this.$store.commit('note_update_list', response.data);
            this._data.header.token = response.data.token;
            this._data.header.up_url = response.data.up_url;
          }
        });
      },
      uploadSuccess(res) {
        let quill = this.$refs.myQuillEditor.quill;
        if (res.ret === 'success') {
          let length = quill.getSelection().index;
          quill.insertEmbed(length, 'image', res.path);
          quill.setSelection(length + 1);
        } else {
          NoticeError('图插入失败', '图片插入失败了，请稍后再试或尝试联系管理员。。。');
        }
      },
      beforeUpload() { },
      uploadError() { NoticeError('图插入失败', '图片插入失败了，请稍后再试或尝试联系管理员。。。'); },
      onEditorChange() { this._data.content = this.content; },
      onEditorBlur() {},
      onEditorFocus() {},
      onEditorReady() {}
    }
  }
</script>