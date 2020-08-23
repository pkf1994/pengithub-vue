import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

import messages from './messages'

export default new VueI18n({
    locale: 'ch', // 设置地区
    messages, // 设置地区信息
})