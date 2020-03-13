<template>
    <Container class="container flex-column">
        <HeaderDetachTopTab :tabs="tabs" :activeTab="activeTab"></HeaderDetachTopTab>
        <router-view name="RepositoryPullRequestDetail"></router-view>
        <router-view name="RepositoryCommit"></router-view>
        <keep-alive>
            <router-view name="RepositoryCode"></router-view>
        </keep-alive>
        <keep-alive>
            <router-view name="RepositoryIssues"></router-view>
        </keep-alive>
        <keep-alive>
            <router-view name="RepositoryPullRequestsBrowser"></router-view>
        </keep-alive>
        <keep-alive>
            <router-view name="RepositoryProjects"></router-view>
        </keep-alive>
        <keep-alive>
            <router-view name="RepositoryPulse"></router-view>
        </keep-alive>
        <keep-alive>
            <router-view name="RepositoryCommunity"></router-view>
        </keep-alive>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import { mapState,mapActions } from 'vuex'
    import {HeaderDetachTopTab} from '../../components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import * as graphql from './graphql'
    import { ACTION_REPOSITORY_REQUEST_BASIC_DATA } from '../../store/modules/repository/actionTypes'
    import { cancelAndUpdateAxiosCancelTokenSource,authRequiredGitHubGraphqlApiQuery } from '@/network'
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
            }
        },
        provide() {
            return {
                owner: () => this.owner,
                repo: () => this.repo,
                repoBasicInfo: () => this.data
            }
        },
        computed: {
            //deprecated
            ...mapState({
                topTabCountData: state => state.repository.basic.data
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
                        ]
                    },
                    {
                        label: TAB_ISSUES,
                        routerLink: `${path}/issues`,
                        disable: !this.data.hasIssuesEnabled,
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
                        disable: !this.data.hasProjectsEnabled,
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
        },
        methods: {
            //deprecated
            ...mapActions({
                action_getBasicData: ACTION_REPOSITORY_REQUEST_BASIC_DATA
            }),
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
            routeUpdateHook() {
                this.network_getData()
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