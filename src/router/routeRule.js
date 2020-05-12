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
const RepositoryReleases = () => import('../pages/Repository/Releases/Releases.vue')
const SignOut = () => import('../pages/SignOut/SignOut.vue')
const Notifications = () => import('../pages/Notifications/Notifications.vue')
const NotFoundPage = () => import('../pages/NotFoundPage/NotFoundPage.vue')


export default [
    
    {
        path: '/',
        name: 'home',
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
        name: 'pulls',
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
        name: 'issues',
        components: {
            default: HomeIssues,
            header: LogoHeader,
            footer: SimpleFooter
        },
    },
    {
        path: '/oauth_redirect',
        name: 'redirect',
        component: OauthRedirectPage
    },
    {
        path: '/sign_out',
        name: 'signOut',
        meta: {
            authRequired: true
        },
        component: SignOut
    },
    {
        path: '/notifications',
        name: 'notifications',
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
        name: 'explore',
        components: {
            default: Explore,
            header: LogoHeader,
            footer: SimpleFooter
        },
        children: [
            {
                path: '/',
                name: 'exploreMain',
                components: {ExploreMain},
            },
            {
                path: 'trending/developers/:language?',
                name: 'exploreTrendingDevelopers',
                components: {ExploreTrending},
                
            },
            {
                path: 'trending/:language?',
                name: 'exploreTrendingRepositories',
                components: {ExploreTrending}
            },
            {
                path: 'collections/:collection',
                name: 'exploreCollectionDetail',
                components: {ExploreCollectionDetail},
            },
            {
                path: 'collections',
                name: 'exploreCollectionBrowser',
                components: {ExploreCollectionsBrowser},
            },
            {
                path: 'topics',
                name: 'exploreTopicsBrowser',
                components: {ExploreTopicsBrowser},
            },
            {
                path: 'topics/:topic',
                name: 'exploreTopicDetail',
                components: {ExploreTopicDetail},
            }
        ]
    },
    {
        path: '/search',
        name: 'search',
        components: {
            default: Search,
            header: LogoHeader,
            footer: LabelsFooter
        },
        children: [
            {
                path: '/',
                name: 'searchRepositories',
                component: SearchResultRepositories
            },
            {
                path: 'code',
                name: 'searchCode',
                component: SearchResultCode
            },
            {
                path: 'commits',
                name: 'searchCommits',
                component: SearchResultCommit
            },
            {
                path: 'issues',
                name: 'searchIssues',
                component: SearchResultIssues
            },
            {
                path: 'topics',
                name: 'searchTopics',
                component: SearchResultTopics
            },
            {
                path: 'users',
                name: 'searchUsers',
                component: SearchResultUsers
            }
        ]
    },
    {
        path: '/404',
        name: 'NotFound',
        components: {
            default: NotFoundPage,
            header: LogoHeader,
            footer: ComplexFooter
        }
    },
    {
        path: '/:login',
        name: 'user',
        components: {
            default: User,
            header: LogoHeader,
            footer: SimpleFooter
        },
        children: [
            {
                path: '/',
                name: 'userOverview',
                component: UserOverview
            },
            {
                path: 'repositories',
                name: 'userRepositories',
                component: UserRepositories
            },
            {
                path: 'projects',
                name: 'userProjects',
                component: UserProjects
            },
            {
                path: 'stars',
                name: 'userStars',
                component: UserStars
            },
            {
                path: 'followers',
                name: 'userFollowers',
                component: UserFollowers
            },
            {
                path: 'following',
                name: 'userFollowing',
                component: UserFollowing
            },
        ]
    },
    {
        path: '/orgs/:organization',
        name: 'organization',
        components: {
            default: Organization,
            footer: SimpleFooter
        },
        children: [
            {
                path: '/',
                name: 'organizationRepositories',
                component: OrganizationRepositories
            },
            {
                path: 'people',
                name: 'organizationPeople',
                component: OrganizationPeople
            }
        ]
    },
    {
        path:'/:owner/:repo/projects/:number',
        name: 'repositoryProjectDetail',
        components: {
            default: RepositoryProjectDetail,
            footer: SimpleFooter
        },
    },
    {
        path: '/:owner/:repo',
        name: 'repository',
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
                name: 'repositoryCode',
                component: RepositoryCode,
                children: [
                    {
                        path: '/',
                        name: 'repositoryCodeMain',
                        components: {
                            RepositoryCodeMain: RepositoryCodeMain
                        }
                    },
                    {
                        path: 'tree/(\.*)+',
                        name: 'repositoryCodeFileBrowser',
                        components: {
                            RepositoryCodeFileBrowser: RepositoryCodeFileBrowser
                        }
                    },
                    {
                        path: 'blob/(\.*)+',
                        name: 'repositoryCodeFileDetail',
                        components: {
                            RepositoryCodeFileDetail: RepositoryCodeFileDetail
                        }
                    }
                ]
            },
            {
                path: 'issues',
                name: 'repositoryIssues',
                component: RepositoryIssues,
                children: [
                    {
                        path: '/',
                        name: 'repositoryIssuesBrowser',
                        components: {
                            RepositoryIssuesBrowser:RepositoryIssuesBrowser
                        }
                    },
                    {
                        path: ':number',
                        name: 'repositoryIssueDetail',
                        components: {
                            RepositoryIssueDetail:RepositoryIssueDetail
                        }
                    }
                ]
            },
            {
                path: 'pulls',
                name: 'repositoryPullRequestsBrowser',
                component: RepositoryPullRequestsBrowser,
            },
            {   
                path: 'pull/:number',
                name: 'repositoryPullRequestDetail',
                component: RepositoryPullRequestDetail,
                children: [
                    {
                        path: '/',
                        name: 'repositoryPullRequestConversation',
                        component: RepositoryPullRequestConversation
                    },
                    {
                        path: 'commits',
                        name: 'repositoryPullRequestCommits',
                        component: RepositoryPullRequestCommits
                    },
                    {
                        path: 'files',
                        name: 'repositoryPullRequestChanges',
                        component: RepositoryPullRequestChanges
                    },
                ]
            },
            {
                path: 'projects',
                name: 'repositoryProjects',
                component: RepositoryProjects,
            },
            {
                path: 'pulse',
                name: 'repositoryPulse',
                component: RepositoryPulse,
            },
            {
                path: 'community',
                name: 'repositoryCommunity',
                component: RepositoryCommunity,
            },
            {
                path: 'commit/:sha',
                name: 'repositoryCommit',
                component: RepositoryCommit,
            },
            {
                path: 'commits/(\.*)?',
                name: 'repositoryCommits',
                component: RepositoryCommits,
            },
            {
                path: 'find/:sha',
                name: 'repositoryFindFile',
                component: RepositoryFindFile
            },
            {   
                path: 'branches',
                name: 'repositoryBranches',
                component: RepositoryBranches,
                children: [
                    {
                        path: '/',
                        name: 'repositoryBranchesOverview',
                        component: RepositoryBranchesOverview
                    },
                    {
                        path: 'all',
                        name: 'repositoryBranchesAll',
                        component: RepositoryBranchesAll
                    },
                    {
                        path: 'stale',
                        name: 'repositoryBranchesStale',
                        component: RepositoryBranchesStale
                    },
                ]
            },
            {
                path: 'releases',
                name: 'repositoryReleases',
                component: RepositoryReleases
            }
        ]
    },
    {
        path: '*',
        name: 'unknow',
        components: {
            default: NotFoundPage,
            header: LogoHeader,
            footer: ComplexFooter
        }
    },
]