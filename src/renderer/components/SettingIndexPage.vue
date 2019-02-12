<template>
    <transition name="fade">
        <div id="wrapper" class="setting_index">
            <Row class="setting_index_box" :gutter="16">
                <i-col class="setting_index_left" span="7">

                    <div class="index_user_content_title" style="margin-bottom: 15px;">
                      <span style="margin-left: 15px;" class="index_user_content_title_span">
                         <Icon type="android-settings"></Icon>
                          个人资料管理
                      </span>
                    </div>
                    <i-input v-model="userInfo.nickname" placeholder="你的昵称..."></i-input>
                    <i-input v-model="userInfo.email" placeholder="你的邮箱..."></i-input>
                    <i-input v-model="userInfo.mobile" placeholder="你的手机号码..."></i-input>
                    <i-input v-model="userInfo.old_password" placeholder="你的原密码..."></i-input>
                    <i-input v-model="userInfo.password1" placeholder="你的新密码..."></i-input>
                    <i-input v-model="userInfo.password2" placeholder="确认你的新密码..."></i-input>
                    <i-input type="textarea" v-model="userInfo.sing" :rows="4" placeholder="请输入个性签名..."></i-input>
                    <div class="setting_index_left_btn">
                        <i-button @click.native="submit()" type="info">提交修改</i-button>
                        <i-button style="margin-left: 15px" @click.native="quit()" type="warning">退出登录</i-button>
                    </div>
                </i-col>
                <i-col class="setting_index_right" span="17">

                    <Row class="personalIndex_right_open_api">
                        <i-col span="8">接口密钥</i-col>
                        <i-col span="16">
                            <p>AP：<span>{{userInfo.api_openid}}</span></p>
                            <p>SK：<span>{{userInfo.api_secret}}</span></p>
                        </i-col>
                    </Row>

                    <div class="personalIndex_right_bg">
                        <div class="index_user_content_title" style="margin-bottom: 3px;">
                          <span style="margin-left: 15px;" class="index_user_content_title_span">
                             <Icon type="android-settings"></Icon>
                              主题模板选择
                          </span>
                        </div>

                        <Row class="personalIndex_right_bg_list" :gutter="12">
                            <i-col v-for='v, k in coverList.items' @click.native="browse_theme(k)" class="personalIndex_right_bg_list_init" span="8">
                                <img :src="v.cover" class="personalIndex_right_bg_img">
                            </i-col>
                        </Row>
                        <div class="setting_index_list_page">
                            <Page
                                    :page-size="coverList.limit"
                                    :total="coverList.total_items"
                                    :current="coverList.current"
                                    @on-change="init"
                             ></Page>
                        </div>
                    </div>
                </i-col>
            </Row>

            <Modal
                    :transition-names="['ease', 'fade']"
                    v-model="modalBG"
                    class-name="modalBG_center_modal"
                    :closable="false"
            >
                <div :style="{backgroundImage:'url('+browse_theme_p.cover+')'}" class="modalBG_body">
                     <div class="personalIndex_modal_bg_msk"></div>
                     <div class="personalIndex_modal_bg_o">
                         <div class="personalIndex_modal_bg_b">
                             <img :src="browse_theme_p.browse">
                         </div>
                         <div class="personalIndex_modal_bg_button">
                             <p>{{browse_theme_p.title}}</p>
                             <Button size="default" type="primary" @click.nitave="theme_setting(browse_theme_p.cover,false)">立即预览</Button>
                             <Button type="primary" @click.nitave="theme_setting(browse_theme_p.cover,true)">立即设置</Button>
                         </div>
                         <div @click="modalBG = false" class="personalIndex_modal_bg_close">
                             <Icon type="close-round"></Icon>
                         </div>
                     </div>
                </div>
                <div slot="footer" class="modalBG_footer"></div>
            </Modal>

        </div>

    </transition>
</template>

<script>
  import '../../../static/css/setting/index.scss'
  import {NoticeWarning, NoticeInfo} from '../tool/function';
  export default {
    name: 'setting-index-page',
    props: ['app'],
    data: function () {
      return {
        modalBG: false,
        userInfo: {
          old_password: '',
          password1: '',
          password2: '',
          nickname: '',
          email: '',
          mobile: '',
          sing: '',
          api_openid: '',
          api_secret: ''
        },
        coverList: {items: []},
        browse_theme_p: {
          browse: '',
          cover: '',
          shortdesc: '',
          title: ''
        }
      }
    },
    methods: {
      init(page) {
        this.$post('/personal/index', {page: page || 1}).then((response) => {
          if (response.status === true) {
            this.userInfo.nickname = response.data.userInfo.nickname;
            this.userInfo.email = response.data.userInfo.email;
            this.userInfo.mobile = response.data.userInfo.mobile;
            this.userInfo.sing = response.data.userInfo.sing;
            this.userInfo.api_openid = response.data.userInfo.api_openid;
            this.userInfo.api_secret = response.data.userInfo.api_secret;
            this.coverList = response.data.coverList
            this.$store.commit('main_update_user', response.data.userInfo);
          }
        });
      },
      submit() {
        this.$post('/personal/SaveUserInfo', this.userInfo).then((response) => {
          if (response.status === true) {
            NoticeInfo(response.msg);
            this.init();
          } else {
            NoticeWarning(response.msg);
          }
        })
      },
      quit() {
        this.$store.commit('login_update_token', '');
      },
      browse_theme(k) {
        this.browse_theme_p = this.coverList.items[k];
        this.modalBG = true;
      },
      theme_setting(url, isOk) {
        this.app.background = 'url(' + url + ')';
        if (isOk) {
          this.$post('/personal/browseSave', {url: url}).then((response) => {
            if (response.status === true) {
              this.init();
            } else {
              NoticeWarning(response.msg);
            }
          })
        }
        this.modalBG = false;
      }
    },
    mounted() {
      this.init();
    }
  }
</script>