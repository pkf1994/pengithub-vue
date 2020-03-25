<template>
    <Container>
        <PaddingPageTopTab :tabs="topTabData"></PaddingPageTopTab>
        <router-view></router-view>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {PaddingPageTopTab} from '@/components'
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
          created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let sourceAndCancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let graphql_activeAndStaleBranches = graphql.GRAPHQL_ACTIVE_AND_STALE_BRANCHES({
                        repo: this.repo(),
                        owner: this.owner(),
                    })
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_activeAndStaleBranches,{cancelToken:sourceAndCancelToken.cancelToken})
                    this.defaultBranch = res.data.data.repository.defaultBranchRef
                    this.allBranches = res.data.data.repository.refs.nodes
                    this.loading = false
                }catch(e) {
                    console.log(e)
                    this.loading = false
                }
            }
        },
        components: {
            PaddingPageTopTab,
            Container: styled.div``,
        }
    }
</script>

<style scoped>

</style>