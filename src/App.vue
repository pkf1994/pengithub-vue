<template>
  <WithNotFoundNoticeWrapper ref="notFoundWrapper" v-on:not-found.native="go404" id="app-container"  class="d-flex flex-column flex-grow-1" data-theme="light">
    <router-view class="router-view header" name="header"/>
    <keep-alive>
      <router-view class="router-view flex-grow-1"/>
    </keep-alive>
    <router-view class="router-view footer" name="footer"/>
  </WithNotFoundNoticeWrapper>
</template>

<script>
import styled from 'vue-styled-components'
import {WithNotFoundNoticeWrapper} from '@/components'
import {mapState,mapActions} from 'vuex'
import {ACTION_GET_UNREAD_NOTIFICATIONS_COUNT} from '@/store/modules/notifications/actionTypes.js'
import {ACTION_OAUTH_REQUEST_VIEWER_INFO } from '@/store/modules/oauth/actionTypes.js'
export default {
  computed: {
    ...mapState({
      login: state => state.oauth.viewerInfo.login
    })
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions({
        action_getNotificationsCount: ACTION_GET_UNREAD_NOTIFICATIONS_COUNT,
        action_oauth_requestViewerInfo: ACTION_OAUTH_REQUEST_VIEWER_INFO
    }),
    async init() {
      if(!this.login && this.accessToken){
        await this.action_oauth_requestViewerInfo()
      }
      this.action_getNotificationsCount()
    },
    go404(e) {
      console.log(e.detail)
      this.$refs.notFoundWrapper.notFoundFlag = true
    }
  },
  watch: {
    login() {
      this.action_getNotificationsCount()
    }
  },
  components: {
      WithNotFoundNoticeWrapper,
      Container: styled.div``
  },
}
</script>

<style>
html{
  height: 100%;
}
body{
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

<style lang="scss">
  .app-container{
    min-height: calc(100%);
  }

  .router-view{
    max-width: 600px;
  }
  .footer{
    position: sticky;
    top: 100%;
  }
</style>
