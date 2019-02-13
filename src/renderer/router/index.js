import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'IndexPage',
      component: require('@/components/IndexPage'),
      meta: {auth: true}
    },

    {
      path: '/video/index',
      name: 'VideoIndexPage',
      component: require('@/components/VideoIndexPage'),
      meta: {auth: true}
    },
    {
      path: '/video/detail',
      name: 'VideoDetailPage',
      component: require('@/components/VideoDetailPage'),
      meta: {auth: true}
    },
    {
      path: '/video/push',
      name: 'VideoPushPage',
      component: require('@/components/VideoPushPage'),
      meta: {auth: true}
    },

    {
      path: '/note/index',
      name: 'NoteIndexPage',
      component: require('@/components/NoteIndexPage'),
      meta: {auth: true}
    },
    {
      path: '/file/index',
      name: 'FileIndexPage',
      component: require('@/components/FileIndexPage'),
      meta: {auth: true}
    },
    {
      path: '/images/index',
      name: 'ImagesIndexPage',
      component: require('@/components/ImagesIndexPage'),
      meta: {auth: true}
    },
    {
      path: '/images/detail',
      name: 'ImagesDetailPage',
      component: require('@/components/ImagesDetailPage'),
      meta: {auth: true}
    },
    {
      path: '/music/index',
      name: 'MusicIndexPage',
      component: require('@/components/MusicIndexPage'),
      meta: {auth: true}
    },
    {
      path: '/setting/index',
      name: 'SettingIndexPage',
      component: require('@/components/SettingIndexPage'),
      meta: {auth: true}
    },
    {
      path: '/sing/login',
      name: 'SingLoginPage',
      component: require('@/components/SingLoginPage')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
