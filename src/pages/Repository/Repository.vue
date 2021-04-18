<template>
    <WithTopNoticeWrapper theKey="repository" @viewer-blocked.native="() => {viewerBlocked = true}">
        <AnimatedHeightWrapper>
            <OrganizationDataAccessRestrictNotice v-if="showOrganizationDataAccessRestrictNotice" class="p-3 flash flash-full">
                 <button @click="() => {showOrganizationDataAccessRestrictNotice = false}" class="flash-close" type="button">
                    <svg class="octicon octicon-x" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>
                </button>
                <div class="px-2">
                    Some features will not be available for 
                    <HyperlinkWrapper>
                        <a href="https://docs.github.com/en/github/setting-up-and-managing-organizations-and-teams/restricting-access-to-your-organizations-data">OAuth App access restrictions</a>
                    </HyperlinkWrapper>
                    to the organization({{data.owner.login}})'s data.
                </div>
            </OrganizationDataAccessRestrictNotice>
        </AnimatedHeightWrapper>
        

        <RepoBasicInfo class="bg-gray-light pb-0 pt-3 border-0">
            <RepoFullName class="mb-3 px-3 f3">
                <h1 class="d-flex flex-wrap flex-items-center break-word f3 text-normal">
                    <svg v-if="data.private" class="octicon octicon-lock repo-private-icon flex-shrink-0 text-gray" aria-label="Repository" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M4 4v2h-.25A1.75 1.75 0 002 7.75v5.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-5.5A1.75 1.75 0 0012.25 6H12V4a4 4 0 10-8 0zm6.5 2V4a2.5 2.5 0 00-5 0v2h5zM12 7.5h.25a.25.25 0 01.25.25v5.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-5.5a.25.25 0 01.25-.25H12z"></path></svg>
                    <svg v-else-if="data.fork" class="octicon octicon-repo-forked text-gray" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
                    <svg v-else class="octicon octicon-repo text-gray" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path></svg>
                    <span v-if="data.node_id">
                        <router-link class="ml-2" :to="`${data.owner && data.owner.type == 'Organization' ? '/orgs' : ''}/${owner}`">{{owner}}</router-link>
                        <span class="mx-1">/</span>
                        <strong>
                            <router-link :to="`/${owner}/${repo}`">{{repo}}</router-link>
                        </strong>
                    </span>
                    
                    <span v-if="data.private" class="Label Label--outline v-align-middle ">Private</span>
                </h1>
               
                <ForkFlag class="fork-flag mt-1 text-small" v-if="data.fork && data.parent">
                    <span>
                        forked from
                        <router-link :to="`/${data.parent.full_name}`">{{data.parent.full_name}}</router-link>
                    </span>
                </ForkFlag>
            </RepoFullName>

            <AnimatedHeightWrapper>
                <div v-show="showRepoMeta">
                    <Description v-if="data.description" class="f4 px-3 mb-3">
                        {{data.description | parseEmoji}}
                    </Description>

                    <RepoMeta class="px-3 pb-3 repo-meta" v-if="data.id">
                        <!-- homePage -->
                        <div v-if="data.homepage" class="mb-2 d-flex flex-items-center">
                            <svg height="16" class="flex-shrink-0 mr-2" mr="2" class_names="flex-shrink-0" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg>
                            <span class="flex-auto min-width-0 css-truncate css-truncate-target width-fit">
                                <HyperlinkWrapper>
                                    <a :title="data.homepage" class="text-bold" style="color:var(--color-text-link)" :href="data.homepage">{{data.homepage.replace(/https:\/\/|http:\/\//g,'')}}</a>
                                </HyperlinkWrapper>
                            </span>
                        </div>

                        <!-- license -->
                        <div v-if="data.license" class="mb-2 d-flex flex-items-center">
                            <router-link :to="`/${data.full_name}/blob/${data.default_branch}/LICENSE`">
                                <svg height="16" class="octicon-law mr-2 v-align-text-bottom" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z"></path></svg>
                                {{data.license.name}}
                            </router-link>
                        </div>

                        <!-- star and fork -->
                        <div v-if="data.id">
                            <router-link class="link-gray no-underline mr-3" :to="`/${owner}/${repo}/stargazers`">
                                <svg height="16" class="octicon-star mr-1 v-align-text-bottom" mr="1" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
                                <span class="text-bold">{{data.stargazers_count | thousands2K2M}}</span>
                                {{data.stargazers_count > 1 ? 'stars' : 'star'}}
                            </router-link>
                            <span v-if="!data.fork" class="no-underline">
                                <svg height="16" class="octicon-repo-forked mr-1 v-align-text-bottom" mr="1" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
                                <span class="text-bold">{{data.forks_count | thousands2K2M}}</span>
                                {{data.forks_count > 1 ? 'forks' : 'fork'}}
                            </span>
                            <span v-else class="no-underline">
                                <svg height="16" class="octicon-repo-forked mr-1 v-align-text-bottom" mr="1" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
                                <span class="text-bold">{{data.network_count | thousands2K2M}}</span>
                                {{data.forks_count > 1 ? 'forks' : 'fork'}}
                            </span>
                        </div>

                    </RepoMeta>

                    <StarOrWatch class="d-flex px-3 pb-1" v-if="data.id">
                        <StarBtn  class="btn btn-sm btn-block flex-1 mr-2" :repoProp="repo" :ownerProp="owner" :viewerHasStarred="viewerHasStarred"></StarBtn>
                        <button class="btn btn-sm btn-block flex-1" :disabled="subscription.loading" @click="() => showModal('notificationsModal')">        
                            <span v-if="!subscription.loading">
                                <svg v-if="subscription.data.ignored && !subscription.data.subscribed" height="16" class="octicon octicon-mute mr-1" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2.75a.75.75 0 00-1.238-.57L3.472 5H1.75A1.75 1.75 0 000 6.75v2.5C0 10.216.784 11 1.75 11h1.723l3.289 2.82A.75.75 0 008 13.25V2.75zM4.238 6.32L6.5 4.38v7.24L4.238 9.68a.75.75 0 00-.488-.18h-2a.25.25 0 01-.25-.25v-2.5a.25.25 0 01.25-.25h2a.75.75 0 00.488-.18zm7.042-1.1a.75.75 0 10-1.06 1.06L11.94 8l-1.72 1.72a.75.75 0 101.06 1.06L13 9.06l1.72 1.72a.75.75 0 101.06-1.06L14.06 8l1.72-1.72a.75.75 0 00-1.06-1.06L13 6.94l-1.72-1.72z"></path></svg>
                                <svg v-else height="16" class="octicon octicon-eye mr-1" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z"></path></svg>
                            </span>
                            {{subscription.loading ? 'Updating...' : subscribeBtnTitle}}
                            <span v-if="!subscription.loading" class="dropdown-caret d-inline-block"></span>
                        </button>
                    </StarOrWatch>
                </div>
            </AnimatedHeightWrapper>
           
            
        </RepoBasicInfo>

        <ComplexTopTab :tabs="tabs" class="px-3 mb-5 UnderlineNav" style="background:#fafbfc"></ComplexTopTab>

        <keep-alive>
            <router-view></router-view>
        </keep-alive>

        <Modal ref="notificationsModal" title="Notifications">
            <SelectMenuItem v-for="item in availableSettings" :key="item.title" :iconStyle="{top:'16px'}" :selected="item.selected" @click.native="() => network_setSubscription(item.subscribed,item.ignored)">
                <div>
                    <span class="notification-item-heading">{{item.title}}</span>
                    <span>{{item.description | parseEmoji }}</span>
                </div>
            </SelectMenuItem>
        </Modal>
    </WithTopNoticeWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import { mapState } from 'vuex'
    import {HeaderDetachTopTab,WithTopNoticeWrapper,ComplexTopTab,HyperlinkWrapper,AnimatedHeightWrapper,StarBtn,Modal,SelectMenuItem} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import * as api from '@/network/api'
    import {authRequiredGet,authRequiredPut,authRequiredDelete } from '@/network'
    import * as graphql from './graphql'
    import {util_markdownParse} from '@/util'
    export default {
        name: 'repository_page',
        mixins: [RouteUpdateAwareMixin],
        data() {
            return {
                data: {},
                loading: false,
                activeTab: "Code",
                viewerPermission: {
                    data: 'READ',
                    loading: false
                },
                subscription: {
                    data: {},
                    loading: false
                },
                resetBeforeUpdate: true,
                showOrganizationDataAccessRestrictNotice: false,
                viewerBlocked: false
            }
        },
        provide() {
            return {
                owner: () => this.owner,
                repo: () => this.repo,
                repoBasicInfo: () => this.data,
                repoOwnerType: () => this.data.owner && this.data.owner.type,
                viewerPermission: () => this.viewerPermission.data,
                viewerCanManageIssue: () => this.viewerCanManageIssue,
                topNoticeShow: () => this.topNoticeShow,
                repoSubscription: () => this.subscription.data,
                graphqlWritePermission: () => this.graphqlWritePermission,
                viewerBlocked: () => this.viewerBlocked,
            }
        },
       /*  beforeRouteUpdate(to, from, next) {
            console.log('beforeRouteUpdate++++++++++++++++ repositories')
            next()
        }, */
        computed: {
            ...mapState({
                viewerLogin: state => state.oauth.viewerInfo.login
            }),
            nodeId() {
                return this.data.node_id
            },
            params() {
                return this.$route.params
            },
            owner: function() {
                return this.$route.params.owner
            },
            repo: function() {
                return this.$route.params.repo
            },
            graphqlWritePermission() {
                return this.data.owner && this.data.owner.type == 'User'
            },
            openIssuesCount() {
                return this.graphqlData.issues && this.graphqlData.issues.totalCount
            },
            openPullRequestsCount() {
                return this.graphqlData.pullRequests && this.graphqlData.pullRequests.totalCount
            },
            viewerHasStarred() {
                 return this.graphqlData.viewerHasStarred
            },
            tabs: function() {
                let path = `/${this.owner}/${this.repo}`
                return [
                    {
                        label: "Code",
                        to: path,
                        exact: true,
                        active: [
                            `${path}/tree`,
                            `${path}/blob`,
                            `${path}/releases`,
                            `${path}/tags`,
                            `${path}/branches`,
                            `${path}/branches/all`,
                            `${path}/branches/stale`,
                            `${path}/find`,
                            `${path}/compare`,
                        ].some(i => {
                            return this.$route.path.indexOf(i) == 0
                        })
                    },
                    {
                        label: "Issues",
                        to: `${path}/issues`,
                        disabled: !this.data.has_issues,
                        meta: this.openIssuesCount,
                        active: [
                            `${path}/labels`,
                            `${path}/milestones`,
                        ].filter(i => {
                            return this.$route.path.indexOf(i) != -1
                        }).length > 0
                    },
                    {
                        label: "Pull requests",
                        to: `${path}/pulls`,
                        active: [
                            `${path}/pull`
                        ].filter(i => {
                            return this.$route.path.indexOf(i) != -1
                        }).length > 0,
                        meta: this.openPullRequestsCount
                    },
                    {
                        label: "Insights",
                        to: `${path}/pulse`,
                        active: [
                            `${path}/contributors`
                        ].some(i => {
                            return this.$route.path.indexOf(i) != -1
                        })
                    },
                    {
                        label: "Community",
                        to: `${path}/community`
                    }
                ]
            },
            showRepoMeta() {
                let regExp = new RegExp(`\/${this.owner}\/${this.repo}(\/|\/tree\/${this.data.default_branch}(\/)?)?$`)
                if(this.$route.path.match(regExp) !== null) {
                    return true
                }
                return false
            },
            availableSettings() {
                return [
                    {
                        title: 'Not watching',
                        description: 'Be notified only when participating or @mentioned.',
                        selected: !this.subscription.data.subscribed && !this.subscription.data.ignored,
                        subscribed: false,
                        ignored: false,
                    },
                    {
                        title: 'Watching',
                        description: 'Be notified of all conversations.',
                        selected: this.subscription.data.subscribed && !this.subscription.data.ignored,
                        subscribed: true,
                        ignored: false,
                    },
                    {
                        title: 'Ignoring',
                        description: 'Never be notified.',
                        selected: !this.subscription.data.subscribed && this.subscription.data.ignored,
                        subscribed: false,
                        ignored: true,
                    },
                ]
            },
            subscribeBtnTitle() {
                if(!this.subscription.data.ignored && this.subscription.data.subscribed) return 'Unwatch'
                if(this.subscription.data.ignored && !this.subscription.data.subscribed) return 'Stop ignoring'
                return 'Watch'
            },
            viewerCanManageIssue() {
                return this.viewerPermission.data == 'ADMIN' || this.viewerPermission.data == 'TRIAGE'  || this.viewerPermission.data == 'WRITE'
            },
            repoDescHTML() {
                return util_markdownParse.markdownToHTML(this.data.description)
            }
        },
        created() {
            this.network_getData()
        },
        beforeRouteEnter(to, from, next) {
            next()
        },
        methods: {
            async network_getData() {
                await this.network_getRepoBasicInfo()
                if(this.data.node_id) this.action_getGraphqlData({
                    id: this.data.node_id,
                    graphql: graphql.REPOSITORY
                })
            },
            //获取仓库基本信息
            async network_getRepoBasicInfo() {

                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url_repo = api.API_REPO(`${this.owner}/${this.repo}`)
                    let res = await authRequiredGet(
                        url_repo,
                        {
                            cancelToken,
                            headers: {
                                "Accept":  "application/vnd.github.mercy-preview+json"
                            }
                        }
                    )
                    this.data = res.data
                }catch(e) {
                    this.handleError(e,{
                        httpErrorHandler: {
                            404: () => this.$router.replace('/404')
                        }
                    })
                }finally{
                    this.loading = false
                }

            },
            async network_ifViewerACollaborator() {
                if(!this.accessToken) return
                try{
                    this.viewerIsCollaborator.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.name + ' check_if_viewer_a_collaborator')
                    let url = api.API_CHECK_IF_COLLABORATOR({
                        login: this.viewer.login,
                        repo: this.repo,
                        owner: this.owner
                    })
                    let res = await authRequiredGet(url,{cancelToken})
                    this.viewerIsCollaborator.data = true
                }catch(e) {
                    if(e.response && e.response.status == 403) {
                        console.log('viewer is not collaborator')
                    }else{
                        console.log(e)
                    }
                }finally{
                    this.viewerIsCollaborator.loading = false
                }
            },
            generateRouterMeta() {
                return `${this.$route.params.owner}/${this.$route.params.repo}`
            },
            
            async network_getSubscription() {
                try{
                    this.subscription.loading = true
                    let url = api.API_REPOSITORY_SUBSCRIPTION({
                        repo: this.repo,
                        owner: this.owner
                    })

                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_subscription')
                        }
                    )
                    this.subscription.data = res.data
                }catch(e) {
                    console.log(e)
                }finally{
                    this.subscription.loading = false
                }
            },
            async network_setSubscription(subscribed,ignored) {
                this.closeModal()
                try{
                    this.subscription.loading = true
                    
                    let url = api.API_REPOSITORY_SUBSCRIPTION({
                        repo: this.repo,
                        owner: this.owner
                    })

                    let res 
                    if(subscribed || ignored) {
                        res = await authRequiredPut(
                            url,
                            {
                                subscribed,
                                ignored
                            }
                        )
                    }else{
                        res = await authRequiredDelete(url)
                    }
                    
                    this.subscription.data = res.data
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.subscription.loading = false
                }   
            }
        }, 
       
        components: {
            HeaderDetachTopTab,
            WithTopNoticeWrapper,
            ComplexTopTab,
            HyperlinkWrapper,
            AnimatedHeightWrapper,
            StarBtn,
            Modal,
            SelectMenuItem,
            Container: styled.div``,
            RepoBasicInfo: styled.div``,
            RepoFullName: styled.div``,
            ForkFlag: styled.span``,
            Description: styled.p``,
            RepoMeta: styled.div``,
            StarOrWatch: styled.div``,
            OrganizationDataAccessRestrictNotice: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/labels/index.scss';
@import 'node_modules/@primer/css/dropdown/index.scss';
@import 'node_modules/@primer/css/navigation/index.scss';
@import 'node_modules/@primer/css/alerts/index.scss';
.octicon{
    color: #959da5;
}

.fork-flag{
    display: block;
    font-size: 11px;
    line-height: 10px;
    white-space: nowrap;
}

.notification-item{
    padding-top: 16px;
    padding-bottom: 16px;
    padding-left: 40px;
    border-bottom: 1px solid #eaecef;
}

.notification-item-heading{
    display: block;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 600;
}

.repo-meta, .repo-meta a{
    color: var(--color-text-secondary);
    svg{
        fill: currentColor
    }
}
</style>