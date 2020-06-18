import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import routes from './routeRule'

import store from '@/store'

const routerCreator = () => new Router({
    mode: 'history',
    routes: routes,
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
          return savedPosition
        } else {
          return { x: 0, y: 0 }
        }
    }
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

