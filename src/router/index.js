import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import routes from './routeRule'

const routerCreator = () => new Router({
    mode: 'history',
    routes: routes,
})

const router = routerCreator()

export default router

//重新实例化一个新的路由表
export function resetRouter() {
    const newRouter = routerCreator()
    router.matcher = newRouter.matcher
}