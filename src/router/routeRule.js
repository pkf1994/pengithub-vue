const Home = () => import('../pages/Home/Home.vue')
const OauthRedirectPage = () => import('../pages/OauthRedirectPage/OauthRedirectPage.vue')
const PullRequests = () => import('../pages/Home/components/LoginedHome/components/PullRequests.vue')
const Dashboard = () => import('../pages/Home/components/LoginedHome/components/Dashboard.vue')
const Issues = () => import('../pages/Home/components/LoginedHome/components/Issues.vue')
const Logout = () => import('../pages/Logout/Logout.vue')

export const ROUTE_HOME = 'route-home'
export const ROUTE_OAUTH_REDIRECT = 'route-oauthRedirect'
export const ROUTE_LOGOUT = 'route-logout'

export default [
    {
        path: '/',
        name: ROUTE_HOME,
        component: Home,
        children: [
            {
                path: 'pulls',
                component: PullRequests
            },
            {
                path: 'issues',
                component: Issues
            },
            {
                path: '/',
                component: Dashboard
            }
        ]
    },
    {
        path: '/oauth_redirect',
        name: ROUTE_OAUTH_REDIRECT,
        component: OauthRedirectPage
    },
    {
        path: '/logout',
        component: Logout
    }
]