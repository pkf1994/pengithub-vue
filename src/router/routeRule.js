const Home = () => import('../pages/Home/Home.vue')
const TrendingPage = () => import('../pages/TrendingPage/TrendingPage.vue')
const Hola = () => import('../pages/Hola/Hola.vue')

export const ROUTE_HOME = 'route-home'
export const ROUTE_TRENDING = 'route-trendingPage'

export default [
    {
        path: '/',
        redirect: 'home'
    },
    {
        path: '/home',
        name: ROUTE_HOME,
        component: Hola
    },
    {
        path: '/trending',
        name: ROUTE_TRENDING,
        component: TrendingPage
    }
]