<template>
  <Container class="flex-column-center">
    <router-view class="router-view"/>
  </Container>
</template>

<script>
import {Home} from './pages'
import styled from 'vue-styled-components'
export default {
  name: 'app',
  data: () => ({

  }),
  components: {
      Container: styled.div``
  }
}
</script>

<style lang="scss">
  @import "./scss/index";
  @include with-theme();
  @include init-padding();
  @include init-margin();
  @include init-titleFontSize();
  @include init-paragraphFontSize();
  @include init-fontWeight();
  @include init-lineHeight();

  .router-view{
    max-width: 600px;
  }
</style>
