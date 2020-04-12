<template>
    <Container class="container flex-column">
        <HeaderDetachTopTab :tabs="tabs" :activeTab="activeTab"></HeaderDetachTopTab>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import { mapState } from 'vuex'
    import {HeaderDetachTopTab} from '../../components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import * as graphql from './graphql'
    import * as api from '@/network/api'
    import { ACTION_REPOSITORY_REQUEST_BASIC_DATA } from '../../store/modules/repository/actionTypes'
    import { cancelAndUpdateAxiosCancelTokenSource,authRequiredGitHubGraphqlApiQuery,authRequiredGet } from '@/network'
    const TAB_CODE = "Code"
    const TAB_ISSUES = "Issues"
    const TAB_PULLS = "Pull requests"
    const TAB_PROJECTS = "Projects"
    const TAB_WIKI = "Wiki"
    const TAB_SECURITY = "Security"
    const TAB_PULSE = "Pulse"
    const TAB_COMMUNITY = "Community"
    export default {
        name: 'repository_page',
        mixins: [RouteUpdateAwareMixin],
        data() {
            return {
                data: {},
                loading: false,
                activeTab: TAB_CODE,
                viewerIsCollaborator: {
                    data: false,
                    loading: true
                }
            }
        },
        provide() {
            return {
                owner: () => this.owner,
                repo: () => this.repo,
                repoBasicInfo: () => this.data,
                viewerIsCollaborator: () => this.viewerIsCollaborator,
            }
        },
        computed: {
            ...mapState({
                viewerLogin: state => state.oauth.viewerInfo.login
            }),
            
            owner: function() {
                return this.$attrs.owner
            },
            repo: function() {
                return this.$attrs.repo
            },
            tabs: function() {
                let path = `/${this.owner}/${this.repo}`
                return [
                    {
                        label: TAB_CODE,
                        routerLink: path,
                        exact: true,
                        extraActiveRouterLinks: [
                            `${path}/tree`,
                            `${path}/blob`,
                            `${path}/branches`,
                            `${path}/branches/all`,
                            `${path}/branches/stale`,
                        ]
                    },
                    {
                        label: TAB_ISSUES,
                        routerLink: `${path}/issues`,
                        disabled: !this.data.hasIssuesEnabled,
                        meta: this.data.issues && this.data.issues.totalCount
                    },
                    {
                        label: TAB_PULLS,
                        routerLink: `${path}/pulls`,
                        extraActiveRouterLinks: [
                            `${path}/pull`
                        ],
                         meta: this.data.pullRequests && this.data.pullRequests.totalCount
                    },
                    {
                        label: TAB_PROJECTS,
                        routerLink: `${path}/projects`,
                        disabled: !this.data.hasProjectsEnabled,
                        meta: this.data.projects && this.data.projects.totalCount
                    },
                    {
                        label: TAB_PULSE,
                        routerLink: `${path}/pulse`
                    },
                    {
                        label: TAB_COMMUNITY,
                        routerLink: `${path}/community`
                    }
                ]
            }
        },
        created() {
            this.network_getData()
            this.network_ifViewerACollaborator()
        },
        methods: {
            //获取仓库基本信息
            async network_getData() {
                try{
                    this.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name)
                    this.cancelSources.push(sourceAndCancelToken.source)
                    let graphql_repoBasicInfo = graphql.GRAPHQL_REPOSITORY_BASIC_INFO(this.owner,this.repo)
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_repoBasicInfo,{cancelToken:sourceAndCancelToken.cancelToken})
                    this.data = res.data.data.repository
                    this.loading = false
                }catch(e) {
                    console.log(e)
                    this.loading = false
                }
            },
            async network_ifViewerACollaborator() {
                try{
                    this.viewerIsCollaborator.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name + ' check_if_viewer_a_collaborator')
                    this.cancelSources.push(sourceAndCancelToken.source)
                    let url = api.API_CHECK_IF_COLLABORATOR({
                        login: this.viewerLogin,
                        repo: this.repo,
                        owner: this.owner
                    })
                    let res = await authRequiredGet(url,{cancelToken:sourceAndCancelToken.cancelToken})

                    this.viewerIsCollaborator.data = true
                    this.viewerIsCollaborator.loading = false
                }catch(e) {
                    console.log(e)
                    this.viewerIsCollaborator.loading = false
                }
            },
            generateRouterMeta() {
                return `${this.$route.params.owner}/${this.$route.params.repo}`
            },
        },
        components: {
            HeaderDetachTopTab,
            Container: styled.div``
        }
    }
</script>

<style scoped>

</style>