<template>
  <div id="app" :theme="currentTheme">
    <img alt="Vue logo" src="./assets/logo.png">
    <div  @click="swithTheme">switch</div>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <input v-model.number="number" type="number" step="20">
    <AnimatedNumber :value="number"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import {AnimatedNumber} from './components'
/* eslint-disable */
import {LIGHT_THEME,DARK_THEME} from "./constant/theme";

export default {
  name: 'app',
  data: () => {
      return {
          currentTheme: LIGHT_THEME,
          number: 0
      }
  },
  components: {
    HelloWorld,
    AnimatedNumber
  },
  methods: {
    swithTheme(){
      if(this.currentTheme == DARK_THEME) {
        this.currentTheme = LIGHT_THEME;
        return
      }
      this.currentTheme = DARK_THEME
    }
  }
}
</script>

<style lang="scss">
@import "scss/index";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}
@include with-theme();

</style>
