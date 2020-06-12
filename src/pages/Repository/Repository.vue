<template>
    <Container>
        <HeaderDetachTopTab :tabs="tabs" :activeTab="activeTab"></HeaderDetachTopTab>
        <WithTopNoticeWrapper theKey="repository">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </WithTopNoticeWrapper>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import { mapState } from 'vuex'
    import {HeaderDetachTopTab,WithTopNoticeWrapper} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import * as api from '@/network/api'
    import { cancelAndUpdateAxiosCancelTokenSource,authRequiredGet } from '@/network'
    let parse = require('parse-link-header')
    export default {
        name: 'repository_page',
        mixins: [RouteUpdateAwareMixin],
        data() {
            return {
                data: {},
                loading: false,
                activeTab: "Code",
                openIssuesCount: 0,
                openPullRequestsCount: 0,
                openProjectsCount: 0,
                viewerIsCollaborator: {
                    data: false,
                    loading: true
                },
                viewerHasStarred: false,
            }
        },
        provide() {
            return {
                owner: () => this.owner,
                repo: () => this.repo,
                repoBasicInfo: () => this.data,
                viewerIsCollaborator: () => this.viewerIsCollaborator,
                viewerIsCollaboratorGetter: () => this.network_ifViewerACollaborator,
                topNoticeShow: () => this.topNoticeShow
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
                        label: "Code",
                        routerLink: path,
                        exact: true,
                        active: [
                            `${path}/tree`,
                            `${path}/blob`,
                            `${path}/branches`,
                            `${path}/branches/all`,
                            `${path}/branches/stale`,
                        ].filter(i => {
                            return this.$route.path.indexOf(i) != -1
                        }).length > 0
                    },
                    {
                        label: "Issues",
                        routerLink: `${path}/issues`,
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
                        routerLink: `${path}/pulls`,
                        active: [
                            `${path}/pull`
                        ].filter(i => {
                            return this.$route.path.indexOf(i) != -1
                        }).length > 0,
                        meta: this.openPullRequestsCount
                    },
                    {
                        label: "Pulse",
                        routerLink: `${path}/pulse`
                    },
                    {
                        label: "Community",
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
            network_getData() {
                this.loading = true
                let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                let url_repo = api.API_REPO(`${this.owner}/${this.repo}`)
                authRequiredGet(
                    url_repo,
                    {
                        cancelToken,
                        headers: {
                            "Accept":  "application/vnd.github.mercy-preview+json"
                        }
                    }
                ).then(res => {
                    this.data = res.data
                }).catch(e => {
                    this.handleError(e,{handle404:true})
                }).finally(() =>  this.loading = false)

                //获取open issues count
                let url_openIssuesCount = api.API_SEARCH({
                    type: 'issues',
                    params: {
                        q:`repo:${this.owner}/${this.repo} state:open is:issue`,
                        per_page: 1
                    }
                })
                authRequiredGet(url_openIssuesCount).then(res => {
                    this.openIssuesCount = res.data.total_count
                }).catch(e => {
                    console.log(e)
                })

                 //获取open pull requests count
                let url_openPullRequestsCount = api.API_SEARCH(
                    {
                        type: 'issues',
                        params: {
                            q:`repo:${this.owner}/${this.repo} state:open is:pr`,
                            per_page: 1
                        }
                    })
                authRequiredGet(url_openPullRequestsCount).then(res => {
                    this.openPullRequestsCount = res.data.total_count
                }).catch(e => {
                    console.log(e)
                })

                 //获取project count
                let url_projectsCount = api.API_REPO_PROJECTS(`${this.owner}/${this.repo}`,{
                    per_page: 1
                })
                authRequiredGet(
                    url_projectsCount,
                    {
                        headers: {
                            'Accept': "application/vnd.github.inertia-preview+json"
                        }
                    }
                ).then(res => {
                    let openProjectsCountHolder = parse(res.headers.link) || {}
                    this.openProjectsCount = openProjectsCountHolder.last ? openProjectsCountHolder.last.page : res.data.length
                }).catch(e => {
                    console.log(e)
                })

            },
            async network_ifViewerACollaborator() {
                if(!this.accessToken) return
                try{
                    this.viewerIsCollaborator.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.name + ' check_if_viewer_a_collaborator')
                    let url = api.API_CHECK_IF_COLLABORATOR({
                        login: this.viewerLogin,
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
          
        }, 
       
        components: {
            HeaderDetachTopTab,
            WithTopNoticeWrapper,
            Container: styled.div``
        }
    }
</script>

<style scoped>

</style>