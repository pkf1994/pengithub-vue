import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './assets/iconfont/iconfont.css'
import './directives'
import './scss'
import './css'
import plugin_toast from './plugin/toast'
import plugin_themeColor from './plugin/themeColors'
import plugin_modal from './plugin/modal'
Vue.use(plugin_toast)
Vue.use(plugin_themeColor)
Vue.use(plugin_modal)
Vue.config.productionTip = false
console.log(process.env.NODE_ENV)
new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
