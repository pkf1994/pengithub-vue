<template>
  <Container id="app-container" class="flex flex-column fix-full-scrollable">
    <router-view class="router-view header" name="header"></router-view>
    <router-view class="router-view flex-grow-1"/>
    <router-view class="router-view footer" name="footer"/>
  </Container>
</template>

<script>
import styled from 'vue-styled-components'
export default {

  components: {
      Container: styled.div``
  }
}
</script>

<style lang="scss">
  .router-view{
    max-width: 600px;
  }
  .footer{
    position: sticky;
    top: 100%;
  }
</style>
