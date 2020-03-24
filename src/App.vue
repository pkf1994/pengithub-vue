<template>
  <Container id="app-container" class="flex flex-column flex-grow-1">
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
