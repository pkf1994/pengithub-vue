<template>
  <router-view/>
</template>

<script>
import {Home} from './pages'
export default {
  name: 'app',
  data: () => ({

  }),

}
</script>

<style lang="scss">
  @import "./scss/index";
  @include with-theme();
</style>
