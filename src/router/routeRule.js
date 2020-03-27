import {SimpleFooter,LogoHeader,RepoHeader,LabelsFooter} from '../components'

const Home = () => import('../pages/Home/Home.vue')
const OauthRedirectPage = () => import('../pages/OauthRedirectPage/OauthRedirectPage.vue')
const Dashboard = () => import('../pages/Home/LoginedHome/Dashboard/index.vue')
const HomePullRequests = () => import('../pages/Home/LoginedHome/PullRequests.vue')
const HomeIssues = () => import('../pages/Home/LoginedHome/Issues.vue')
const Explore = () => import('../pages/Explore/Explore.vue')
const ExploreMain = () => import('../pages/Explore/ExploreMain/ExploreMain.vue')
const ExploreTrending = () => import('../pages/Explore/Trending/Trending.vue')
const ExploreCollections = () => import('../pages/Explore/Collections/Collections.vue')
const Search = () => import('../pages/Search/Search.vue')
const SearchResultRepositories = () => import('../pages/Search/SearchResult/Repositories/Repositories.vue')
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
const RepositoryPullRequestsBrowser = () => import('../pages/Repository/PullRequests/PullRequestsBrowser.vue')
const RepositoryPullRequestDetail = () => import('../pages/Repository/PullRequests/PullRequestDetail/PullRequestDetail.vue')
const RepositoryPullRequestConversation = () => import('../pages/Repository/PullRequests/PullRequestDetail/Conversation.vue')
const RepositoryPullRequestCommits = () => import('../pages/Repository/PullRequests/PullRequestDetail/Commits.vue')
const RepositoryPullRequestChanges = () => import('../pages/Repository/PullRequests/PullRequestDetail/Changes.vue')
const RepositoryProjects = () => import('../pages/Repository/Projects/Projects.vue')
const RepositoryPulse = () => import('../pages/Repository/Pulse/Pulse.vue')
const RepositoryCommunity = () => import('../pages/Repository/Community/Community.vue')
const RepositoryCommit = () => import('../pages/Repository/Commit/Commit.vue')
const RepositoryBranches = () => import('../pages/Repository/Branches/Branches.vue')
const RepositoryBranchesOverview = () => import('../pages/Repository/Branches/Overview.vue')
const RepositoryBranchesAll = () => import('../pages/Repository/Branches/All.vue')
const RepositoryBranchesStale = () => import('../pages/Repository/Branches/Stale.vue')
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
            },
            {
                path: 'issues/:meta?',
                component: HomeIssues,
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
        path: '/explore',
        components: {
            default: Explore,
            header: LogoHeader,
            footer: SimpleFooter
        },
        children: [
            {
                path: '/',
                component: ExploreMain
            },
            {
                path: 'trending/developers/:language?',
                component: ExploreTrending
            },
            {
                path: 'trending/:language?',
                component: ExploreTrending
            },
            {
                path: 'collections',
                component: ExploreCollections
            }
        ]
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
                path: 'repositories',
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
                        path: 'tree/(\.*)+',
                        components: {
                            RepositoryCodeFileBrowser: RepositoryCodeFileBrowser
                        }
                    },
                    {
                        path: 'blob/(\.*)+',
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
                component: RepositoryPullRequestsBrowser,
            },
            {   
                path: 'pull/:number',
                component: RepositoryPullRequestDetail,
                children: [
                    {
                        path: '/',
                        component: RepositoryPullRequestConversation
                    },
                    {
                        path: 'commits',
                        component: RepositoryPullRequestCommits
                    },
                    {
                        path: 'files',
                        component: RepositoryPullRequestChanges
                    },
                ]
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
            },
            {
                path: 'commit/:sha',
                component: RepositoryCommit,
            },
            {   
                path: 'branches',
                component: RepositoryBranches,
                children: [
                    {
                        path: '/',
                        component: RepositoryBranchesOverview
                    },
                    {
                        path: 'all',
                        component: RepositoryBranchesAll
                    },
                    {
                        path: 'stale',
                        component: RepositoryBranchesStale
                    },
                ]
            },
        ]
    },
    
]