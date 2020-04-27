import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import routes from './routeRule'

import store from '@/store'

const routerCreator = () => new Router({
    mode: 'history',
    routes: routes,
})

const router = routerCreator()

router.beforeEach((to,from,next) => {
    /* console.log(to)
    console.log(from)
    console.log(to.meta) */
    //鉴权
    if(to.meta.authRequired && !store.state.oauth.accessToken.accessToken) {
        next('/404')
    }
    next()
})

export default router

