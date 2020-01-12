import {SimpleFooter,LogoHeader,RepoHeader,LabelsFooter} from '../components'

const Home = () => import('../pages/Home/Home.vue')
const OauthRedirectPage = () => import('../pages/OauthRedirectPage/OauthRedirectPage.vue')
const Dashboard = () => import('../pages/Home/LoginedHome/Dashboard/index.vue')
const HomePullRequests = () => import('../pages/Home/LoginedHome/PullRequests/index.vue')
const HomePullRequestsCreated = () => import('../pages/Home/LoginedHome/PullRequests/Created.vue')
const HomePullRequestsAssigned = () => import('../pages/Home/LoginedHome/PullRequests/Assigned.vue')
const HomePullRequestsMentioned = () => import('../pages/Home/LoginedHome/PullRequests/Mentioned.vue')
const HomeIssues = () => import('../pages/Home/LoginedHome/Issues/index.vue')
const HomeIssuesCreated = () => import('../pages/Home/LoginedHome/Issues/Created.vue')
const HomeIssuesAssigned = () => import('../pages/Home/LoginedHome/Issues/Assigned.vue')
const HomeIssuesMentioned = () => import('../pages/Home/LoginedHome/Issues/Mentioned.vue')
const Search = () => import('../pages/Search/Search.vue')
const SearchResultRepositories = () => import('../pages/Search/SearchResult/Repositorires/Repositories.vue')
const SearchResultCode = () => import('../pages/Search/SearchResult/Code/Code.vue')
const SearchResultCommit = () => import('../pages/Search/SearchResult/Commits/Commits.vue')
const SearchResultIssues = () => import('../pages/Search/SearchResult/Issues/Issues.vue')
const SearchResultTopics = () => import('../pages/Search/SearchResult/Topics/Topics.vue')
const SearchResultUsers = () => import('../pages/Search/SearchResult/Users/Users.vue')
const Respository = () => import('../pages/Repository/Repository.vue')
const RespositoryCode = () => import('../pages/Repository/Code/Code.vue')
const RespositoryIssues = () => import('../pages/Repository/Issues/Issues.vue')
const RespositoryIssuesOpen = () => import('../pages/Repository/Issues/Open.vue')
const RespositoryIssuesClosed = () => import('../pages/Repository/Issues/Closed.vue')
const RespositoryIssuesYours = () => import('../pages/Repository/Issues/Yours.vue')
const RespositoryPullRequests = () => import('../pages/Repository/PullRequests/PullRequests.vue')
const RespositoryPullRequestsOpen = () => import('../pages/Repository/PullRequests/Open.vue')
const RespositoryPullRequestsClosed = () => import('../pages/Repository/PullRequests/Closed.vue')
const RespositoryPullRequestsYours = () => import('../pages/Repository/PullRequests/Yours.vue')
const RespositoryProjects = () => import('../pages/Repository/Projects/Projects.vue')
const RespositoryPulse = () => import('../pages/Repository/Pulse/Pulse.vue')
const RespositoryCommunity = () => import('../pages/Repository/Community/Community.vue')
const Logout = () => import('../pages/Logout/Logout.vue')

export const ROUTE_HOME = 'route-home'
export const ROUTE_OAUTH_REDIRECT = 'route-oauthRedirect'
export const ROUTE_LOGOUT = 'route-logout'

export default [
    {
        path: '/',
        name: ROUTE_HOME,
        components: {
            default: Home,
            header: LogoHeader,
            footer: SimpleFooter
        },
        children: [
            {
                path: 'pulls',
                component: HomePullRequests,
                children: [
                    {
                        path: '/',
                        component: HomePullRequestsCreated
                    },
                    {
                        path: 'assigned',
                        component: HomePullRequestsAssigned
                    },
                    {
                        path: 'mentioned',
                        component: HomePullRequestsMentioned
                    }
                ]
            },
            {
                path: 'issues',
                component: HomeIssues,
                children: [
                    {
                        path: '/',
                        component: HomeIssuesCreated
                    },
                    {
                        path: 'assigned',
                        component: HomeIssuesAssigned
                    },
                    {
                        path: 'mentioned',
                        component: HomeIssuesMentioned
                    }
                ]
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
    },
    {
        path: '/search',
        components: {
            default: Search,
            header: LogoHeader,
            footer: LabelsFooter
        },
        children: [
            {
                path: '/',
                component: SearchResultRepositories
            },
            {
                path: 'code',
                component: SearchResultCode
            },
            {
                path: 'commits',
                component: SearchResultCommit
            },
            {
                path: 'issues',
                component: SearchResultIssues
            },
            {
                path: 'topics',
                component: SearchResultTopics
            },
            {
                path: 'users',
                component: SearchResultUsers
            }
        ]
    },
    {
        path: '/:owner/:repo',
        components: {
            default: Respository,
            header: RepoHeader,
            footer: SimpleFooter
        },
        props: {
            default: true,
            header: false
        },
        children: [
            {
                path: '/',
                component: RespositoryCode
            },
            {
                path: 'issues',
                component: RespositoryIssues,
                children: [
                    {
                        path: '/',
                        component: RespositoryIssuesOpen
                    },
                    {
                        path: 'closed',
                        component: RespositoryIssuesClosed
                    },
                    {
                        path: 'yours',
                        component: RespositoryIssuesYours
                    },
                ]
            },
            {
                path: 'pulls',
                component: RespositoryPullRequests,
                children: [
                    {
                        path: '/',
                        component: RespositoryPullRequestsOpen
                    },
                    {
                        path: 'closed',
                        component: RespositoryPullRequestsClosed
                    },
                    {
                        path: 'yours',
                        component: RespositoryPullRequestsYours
                    },
                ]
            },
            {
                path: 'projects',
                component: RespositoryProjects,
            },
            {
                path: 'pulse',
                component: RespositoryPulse,
            },
            {
                path: 'community',
                component: RespositoryCommunity,
            }
        ]
    },
    
]