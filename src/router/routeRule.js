import {SimpleFooter,LogoHeader,RepoHeader,LabelsFooter} from '../components'

const Home = () => import('../pages/Home/Home.vue')
const OauthRedirectPage = () => import('../pages/OauthRedirectPage/OauthRedirectPage.vue')
const Dashboard = () => import('../pages/Home/LoginedHome/Dashboard/index.vue')
const HomePullRequests = () => import('../pages/Home/LoginedHome/PullRequests.vue')
/* const HomePullRequestsCreated = () => import('../pages/Home/LoginedHome/PullRequests/Created.vue')
const HomePullRequestsAssigned = () => import('../pages/Home/LoginedHome/PullRequests/Assigned.vue')
const HomePullRequestsMentioned = () => import('../pages/Home/LoginedHome/PullRequests/Mentioned.vue') */
const HomeIssues = () => import('../pages/Home/LoginedHome/Issues.vue')
/* const HomeIssuesCreated = () => import('../pages/Home/LoginedHome/Issues/Created.vue')
const HomeIssuesAssigned = () => import('../pages/Home/LoginedHome/Issues/Assigned.vue')
const HomeIssuesMentioned = () => import('../pages/Home/LoginedHome/Issues/Mentioned.vue') */
const Search = () => import('../pages/Search/Search.vue')
const SearchResultRepositories = () => import('../pages/Search/SearchResult/Repositorires/Repositories.vue')
const SearchResultCode = () => import('../pages/Search/SearchResult/Code/Code.vue')
const SearchResultCommit = () => import('../pages/Search/SearchResult/Commits/Commits.vue')
const SearchResultIssues = () => import('../pages/Search/SearchResult/Issues/Issues.vue')
const SearchResultTopics = () => import('../pages/Search/SearchResult/Topics/Topics.vue')
const SearchResultUsers = () => import('../pages/Search/SearchResult/Users/Users.vue')
const Repository = () => import('../pages/Repository/Repository.vue')
const RepositoryCode = () => import('../pages/Repository/Code/Code.vue')
const RepositoryCodeMain = () => import('../pages/Repository/Code/CodeMain/CodeMain.vue')
const RepositoryCodeFileBrowser = () => import('../pages/Repository/Code/CodeFile/FileBrowser/FileBrowser.vue')
const RepositoryCodeFileDetail = () => import('../pages/Repository/Code/CodeFile/FileDetail/FileDetail.vue')
const RepositoryIssues = () => import('../pages/Repository/Issues/Issues.vue')
const RepositoryIssuesBrowser = () => import('../pages/Repository/Issues/IssuesBrowser.vue')
const RepositoryIssueDetail = () => import('../pages/Repository/Issues/IssueDetail/IssueDetail.vue')
/* const RepositoryIssuesOpen = () => import('../pages/Repository/Issues/Open.vue')
const RepositoryIssuesClosed = () => import('../pages/Repository/Issues/Closed.vue')
const RepositoryIssuesYours = () => import('../pages/Repository/Issues/Yours.vue') */
const RepositoryPullRequests = () => import('../pages/Repository/PullRequests/PullRequests.vue')
/* const RepositoryPullRequestsOpen = () => import('../pages/Repository/PullRequests/Open.vue')
const RepositoryPullRequestsClosed = () => import('../pages/Repository/PullRequests/Closed.vue')
const RepositoryPullRequestsYours = () => import('../pages/Repository/PullRequests/Yours.vue') */
const RepositoryProjects = () => import('../pages/Repository/Projects/Projects.vue')
const RepositoryPulse = () => import('../pages/Repository/Pulse/Pulse.vue')
const RepositoryCommunity = () => import('../pages/Repository/Community/Community.vue')
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
                path: 'pulls/:meta?',
                component: HomePullRequests,
                /* children: [
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
                ] */
            },
            {
                path: 'issues/:meta?',
                component: HomeIssues,
               /*  children: [
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
                ] */
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
            default: Repository,
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
                component: RepositoryCode,
                children: [
                    {
                        path: '/',
                        components: {
                            RepositoryCodeMain: RepositoryCodeMain
                        }
                    },
                    {
                        path: 'tree/:branch/(\.*)?',
                        components: {
                            RepositoryCodeFileBrowser: RepositoryCodeFileBrowser
                        }
                    },
                    {
                        path: 'blob/:branch/(\.*)?',
                        components: {
                            RepositoryCodeFileDetail: RepositoryCodeFileDetail
                        }
                    }
                ]
            },
            {
                path: 'issues',
                component: RepositoryIssues,
                children: [
                    {
                        path: '/',
                        components: {
                            RepositoryIssuesBrowser:RepositoryIssuesBrowser
                        }
                    },
                    {
                        path: ':number',
                        components: {
                            RepositoryIssueDetail:RepositoryIssueDetail
                        }
                    }
                ]
            },
            {
                path: 'pulls',
                component: RepositoryPullRequests
                /* children: [
                    {
                        path: '/',
                        component: RepositoryPullRequestsOpen
                    },
                    {
                        path: 'closed',
                        component: RepositoryPullRequestsClosed
                    },
                    {
                        path: 'yours',
                        component: RepositoryPullRequestsYours
                    },
                ] */
            },
            {
                path: 'projects',
                component: RepositoryProjects,
            },
            {
                path: 'pulse',
                component: RepositoryPulse,
            },
            {
                path: 'community',
                component: RepositoryCommunity,
            }
        ]
    },
    
]