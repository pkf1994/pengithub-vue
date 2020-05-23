<template>
    <WithSignInNoticeWrapper ref="signInNotice">
        <PaddingPageTopTab :tabs="topTabData"></PaddingPageTopTab>
        <router-view></router-view>
    </WithSignInNoticeWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {PaddingPageTopTab,WithSignInNoticeWrapper} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {authRequiredGitHubGraphqlApiQuery } from '@/network'
    import * as graphql from './graphql.js'
    export default {
        name: 'repository_branches_page',
        inject: ['owner','repo'],
        mixins: [RouteUpdateAwareMixin],
        provide() {
            return {
                defaultBranchProvided: () => this.defaultBranch,
                allBranchesProvided: () => this.allBranches
            }
        },
        data() {
            return {
                defaultBranch: {},
                allBranches: [],
                loading: false
            }
        },
        computed: {
            topTabData() {
                return [
                    {
                        to: `/${this.owner()}/${this.repo()}/branches`,
                        label: 'Overview',
                        activeFlag: this.$route.path.match(/branches$/) != null
                    },
                    {
                        to: `/${this.owner()}/${this.repo()}/branches/all`,
                        label: 'All branches',
                        activeFlag: this.$route.path.match(/all$/) != null
                    }
                ]
            }
        },
        mounted() {
            
            this.network_getData()
        },
        methods: {
            async network_getData() {
                if(!this.accessToken) {
                    this.$refs.signInNotice.show()
                    return 
                }
                try{
                    this.loading = true
                    let sourceAndCancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let graphql_activeAndStaleBranches = graphql.GRAPHQL_ACTIVE_AND_STALE_BRANCHES({
                        repo: this.repo(),
                        owner: this.owner(),
                    })
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_activeAndStaleBranches,{cancelToken:sourceAndCancelToken.cancelToken})
                    try{
                        this.defaultBranch = res.data.data.repository.defaultBranchRef
                        this.allBranches = res.data.data.repository.refs.nodes
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                }catch(e) {
                    this.handleError(e)
                    if(e.response && e.response.status == 401) {
                        this.$refs.signInNotice.show()
                    }
                }finally{
                    this.loading = false
                }
            },
        },
        components: {
            PaddingPageTopTab,
            WithSignInNoticeWrapper,
            Container: styled.div``,
        }
    }
</script>

<style scoped>

</style>