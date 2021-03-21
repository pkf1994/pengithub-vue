import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Router from 'vue-router'
import i18n from './i18n'
import './assets/iconfont/iconfont.css'
import './directives'
import './filter'
import './assets/scss'
import plugin_toast from './plugin/toast'
import plugin_themeColor from './plugin/themeColors'
import plugin_modal from './plugin/modal'
import plugin_loading from './plugin/loading'
import plugin_common from './plugin/common'
import plugin_githubBusiness from './plugin/githubBusiness'
import plugin_topNotice from './plugin/topNotice'
import VueClipboard from 'vue-clipboard2'
Vue.use(Router)
Vue.use(VueClipboard)
Vue.use(plugin_themeColor)
Vue.use(plugin_modal)
Vue.use(plugin_toast)
Vue.use(plugin_loading)
Vue.use(plugin_common)
Vue.use(plugin_githubBusiness)
Vue.use(plugin_topNotice)
Vue.config.productionTip = false
console.log(process.env.NODE_ENV)
new Vue({
  store,
  router,
  i18n,
  render: h => h(App),
}).$mount('#app');
