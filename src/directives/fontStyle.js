import Vue from 'vue'

Vue.directive('h1', {
    inserted: function (el) {
        // 聚焦元素
        el.style.fontSize = '30px'
    }
})