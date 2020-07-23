import Vue from 'vue'
import Router from 'vue-router'
import routes from './routeRule'
import store from '@/store'
import * as api from '@/network/api'
import {util_ramdonString} from '@/util'

const routerCreator = () => new Router({
    mode: 'history',
    routes: routes,
   /*  scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
          return savedPosition
        } else {
          return { x: 0, y: 0 }
        }
    } */
})

const router = routerCreator()

router.beforeEach((to,from,next) => {
    /* console.log(to)
    console.log(from)
    console.log(to.meta) */
    //鉴权
    if(to.meta.authRequired && !store.state.oauth.accessToken.accessToken) {
        signIn(to.fullPath)
        return
    }
    next()
})

const signIn = (signInFromPath) => {
    let state = util_ramdonString.randomString()
    sessionStorage.setItem('state',state)
    sessionStorage.setItem('signInFromPath',signInFromPath)
    let oauthHref = api.API_OAUTH2({
        state
    })
    location.href = oauthHref
}

export default router

