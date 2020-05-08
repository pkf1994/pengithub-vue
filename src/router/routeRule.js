import {SimpleFooter,LogoHeader,RepoHeader,LabelsFooter,ComplexFooter} from '@/components'

const Home = () => import('../pages/Home/Home.vue')
const OauthRedirectPage = () => import('../pages/OauthRedirectPage/OauthRedirectPage.vue')
const Dashboard = () => import('../pages/Home/LoginedHome/Dashboard/Dashboard.vue')
const HomePullRequests = () => import('../pages/Home/LoginedHome/PullRequests.vue')
const HomeIssues = () => import('../pages/Home/LoginedHome/Issues.vue')
const Explore = () => import('../pages/Explore/Explore.vue')
const ExploreMain = () => import('../pages/Explore/ExploreMain/ExploreMain.vue')
const ExploreTrending = () => import('../pages/Explore/Trending/Trending.vue')
const ExploreCollectionsBrowser = () => import('../pages/Explore/Collections/CollectionsBrowser.vue')
const ExploreCollectionDetail = () => import('../pages/Explore/Collections/CollectionDetail.vue')
const ExploreTopicsBrowser = () => import('../pages/Explore/Topics/TopicsBrowser.vue')
const ExploreTopicDetail = () => import('../pages/Explore/Topics/TopicDetail.vue')
const Search = () => import('../pages/Search/Search.vue')
const SearchResultRepositories = () => import('../pages/Search/SearchResult/Repositories/Repositories.vue')
const SearchResultCode = () => import('../pages/Search/SearchResult/Code/Code.vue')
const SearchResultCommit = () => import('../pages/Search/SearchResult/Commits/Commits.vue')
const SearchResultIssues = () => import('../pages/Search/SearchResult/Issues/Issues.vue')
const SearchResultTopics = () => import('../pages/Search/SearchResult/Topics/Topics.vue')
const SearchResultUsers = () => import('../pages/Search/SearchResult/Users/Users.vue')
const User = () => import('../pages/User/User.vue')
const UserOverview = () => import('../pages/User/Overview/Overview.vue')
const UserRepositories = () => import('../pages/User/Repositories/Repositories.vue')
const UserProjects = () => import('../pages/User/Projects/Projects.vue')
const UserStars = () => import('../pages/User/Stars/Stars.vue')
const UserFollowers = () => import('../pages/User/Followers/Followers.vue')
const UserFollowing = () => import('../pages/User/Following/Following.vue')
const Organization = () => import('../pages/Organization/Organization.vue')
const OrganizationRepositories = () => import('../pages/Organization/Repositories/Repositories.vue')
const OrganizationPeople = () => import('../pages/Organization/People/People.vue')
//const OrganizationPackages = () => import('../pages/Organization/Packages/Packages.vue')
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
const RepositoryProjectDetail = () => import('../pages/Repository/ProjectDetail/ProjectDetail.vue')
const RepositoryPulse = () => import('../pages/Repository/Pulse/Pulse.vue')
const RepositoryCommunity = () => import('../pages/Repository/Community/Community.vue')
const RepositoryCommit = () => import('../pages/Repository/Commit/Commit.vue')
const RepositoryCommits = () => import('../pages/Repository/Commits/Commits.vue')
const RepositoryBranches = () => import('../pages/Repository/Branches/Branches.vue')
const RepositoryBranchesOverview = () => import('../pages/Repository/Branches/Overview.vue')
const RepositoryBranchesAll = () => import('../pages/Repository/Branches/All.vue')
const RepositoryBranchesStale = () => import('../pages/Repository/Branches/Stale.vue')
const RepositoryFindFile = () => import('../pages/Repository/FindFile/FindFile.vue')
const Logout = () => import('../pages/Logout/Logout.vue')
const Notifications = () => import('../pages/Notifications/Notifications.vue')
const NotFoundPage = () => import('../pages/NotFoundPage/NotFoundPage.vue')


export default [
    
    {
        path: '/',
        components: {
            default: Home,
            header: LogoHeader,
            footer: SimpleFooter
        },
    },
    {
        path: '/pulls/:meta?',
        meta: {
            authRequired: true
        },
        components: {
            default: HomePullRequests,
            header: LogoHeader,
            footer: SimpleFooter
        },
    },
    {
        path: '/issues/:meta?',
        meta: {
            authRequired: true
        },
        components: {
            default: HomeIssues,
            header: LogoHeader,
            footer: SimpleFooter
        },
    },
    {
        path: '/oauth_redirect',
        component: OauthRedirectPage
    },
    {
        path: '/logout',
        meta: {
            authRequired: true
        },
        component: Logout
    },
    {
        path: '/notifications',
        meta: {
            authRequired: true
        },
        components: {
            default: Notifications,
            header: LogoHeader,
            footer: SimpleFooter
        },
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
                components: {ExploreMain},
            },
            {
                path: 'trending/developers/:language?',
                components: {ExploreTrending},
                
            },
            {
                path: 'trending/:language?',
                components: {ExploreTrending}
            },
            {
                path: 'collections/:collection',
                components: {ExploreCollectionDetail},
            },
            {
                path: 'collections',
                components: {ExploreCollectionsBrowser},
            },
            {
                path: 'topics',
                components: {ExploreTopicsBrowser},
            },
            {
                path: 'topics/:topic',
                components: {ExploreTopicDetail},
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
        path: '/404',
        components: {
            default: NotFoundPage,
            header: LogoHeader,
            footer: ComplexFooter
        }
    },
    {
        path: '/:login',
        components: {
            default: User,
            header: LogoHeader,
            footer: SimpleFooter
        },
        children: [
            {
                path: '/',
                component: UserOverview
            },
            {
                path: 'repositories',
                component: UserRepositories
            },
            {
                path: 'projects',
                component: UserProjects
            },
            {
                path: 'stars',
                component: UserStars
            },
            {
                path: 'followers',
                component: UserFollowers
            },
            {
                path: 'following',
                component: UserFollowing
            },
        ]
    },
    {
        path: '/orgs/:organization',
        components: {
            default: Organization,
            footer: SimpleFooter
        },
        children: [
            {
                path: '/',
                component: OrganizationRepositories
            },
            {
                path: 'people',
                component: OrganizationPeople
            }
        ]
    },
    {
        path:'/:owner/:repo/projects/:number',
        components: {
            default: RepositoryProjectDetail,
            footer: SimpleFooter
        },
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
                path: 'commits/(\.*)?',
                component: RepositoryCommits,
            },
            {
                path: 'find/:sha',
                component: RepositoryFindFile
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
    {
        path: '*',
        components: {
            default: NotFoundPage,
            header: LogoHeader,
            footer: ComplexFooter
        }
    },
]