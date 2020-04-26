<template>
  <Container id="app-container" class="d-flex flex-column flex-grow-1">
    <router-view class="router-view header" name="header"></router-view>
    <keep-alive>
      <router-view class="router-view flex-grow-1"/>
    </keep-alive>
    <router-view class="router-view footer" name="footer"/>
  </Container>
</template>

<script>
import styled from 'vue-styled-components'
import {mapState,mapActions} from 'vuex'
import {ACTION_GET_UNREAD_NOTIFICATIONS_COUNT} from '@/store/modules/notifications/actionTypes.js'
export default {
  computed: {
    ...mapState({
      login: state => state.oauth.viewerInfo.login
    })
  },
  created() {
    if(this.login)this.action_getNotificationsCount()
  },
  methods: {
    ...mapActions({
        action_getNotificationsCount: ACTION_GET_UNREAD_NOTIFICATIONS_COUNT
    }),
  },
  watch: {
    login() {
      this.action_getNotificationsCount()
    }
  },
  components: {
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
