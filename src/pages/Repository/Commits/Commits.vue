<template>
    <Container class="p-3">
        <transition name="fade" appear>
            <button v-if="firstLoadedFlag" :disabled="refType.loading || !refType.data" class="btn css-truncate btn-sm">
                <i>{{refType.data || 'branch'}}:</i>
                <span class="css-truncate-target" v-if="ref">{{ref}}</span>
                <span class="dropdown-caret"></span>
            </button>
        </transition>
        
        <transition-group name="fade-group" appear>
            <CommitGroup v-for="item in commitGroups" class="the-commit-group" :key="item[0].node_id" :commitGroup="item"></CommitGroup>
        </transition-group>

        <transition name="fade" appear>
            <CommonLoading  v-if="loading || graphqlData.loading"
                            :position="loading ? 'center' : 'corner'"
                            :preventClickEvent="false"/>
        </transition> 
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoading} from '@/components'
    import {authRequiredGet,authRequiredGitHubGraphqlApiQuery} from '@/network'
    import CommitGroup from './CommitGroup'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import {RouteUpdateAwareMixin} from '@/mixins'
    var parse = require('parse-link-header');
    export default {
        name: 'repository_commits_page',
        mixins: [RouteUpdateAwareMixin],
        inject: ['repoBasicInfo'],
        provide() {
            return {
                graphqlDataProvided: () => this.graphqlData.data
            }
        },
        data() {
            return {
                data: [],
                loading: false,
                pageInfo: {},
                perPage: 20,
                paramIsBranch: true,
                refType: {
                    data: undefined,
                    loading: false
                },
                graphqlData: {
                    data: [],
                    loading: false
                },
                firstLoadedFlag: false
            }
        },
        computed: {
            ref() {
                return this.$route.params.ref || (this.repoBasicInfo().defaultBranchRef && this.repoBasicInfo().defaultBranchRef.name)
            },
            owner() {
                return this.$route.params.owner
            },
            repo() {
                return this.$route.params.repo
            },
            refTypeUpdateFlag() {
                return `${this.ref}-${this.owner}-${this.repo}`
            },
            commitGroups() {
                let commitGroups = []
                this.data.forEach(i => {
                    if(commitGroups.length == 0) {
                        commitGroups.push([i])
                        return false
                    }
                    let commitDate = new Date(i.commit.committer.date)
                    let prevCommitDate = new Date(commitGroups[commitGroups.length - 1][0].commit.committer.date)
                    if(commitDate.getFullYear() == prevCommitDate.getFullYear() && commitDate.getMonth() == prevCommitDate.getMonth() && commitDate.getDate() == prevCommitDate.getDate()) {
                        commitGroups[commitGroups.length - 1].push(i)
                    } else {
                        commitGroups.push([i])
                    }
                })
                return commitGroups
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_REPOSITORY_COMMITS(this.owner,this.repo,{
                        perPage: this.perPage,
                        ...this.$route.query,
                        sha: this.branchOrTag,
                    })
                    let res = await authRequiredGet(url,{cancelToken})

                    this.data = res.data
                    this.pageInfo = parse(res.headers.link) || {}

                    this.network_getGraphqlData(this.data)
                    this.firstLoadedFlag = true
                    this.loading = false
                }catch(e) {
                    console.log(e)
                    this.loading = false
                }
            },
            async network_getGraphqlData(payload) {
                try{
                    this.graphqlData.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_graphql_data')
                    
                    let graphql_ = graphql.GRAPHQL_COMMITS(payload)

                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_,{cancelToken})

                    let graphqlData = []
                    for(let key in res.data.data){
                        graphqlData.push(res.data.data[key])
                    }
                    this.graphqlData.data = graphqlData

                    this.graphqlData.loading = false
                }catch(e) {
                    console.log(e)
                    this.graphqlData.loading = false
                }
            },
            async network_determineRefType() {
                try{
                    this.refType.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' determine_ref_type')
                    let graphql_determineRefType = graphql.GRAPHQL_BRANCH_OR_TAG({
                        owner: this.owner,
                        repo: this.repo,
                        ref: this.ref
                    })
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_determineRefType,{cancelToken})
                    if(!res.data.data.repository.ref) {
                        throw new Error('404')
                    }
                    let refPrefix = res.data.data.repository.ref.prefix
                    if(refPrefix == 'refs/tags/') {
                        this.refType.data = 'tag'
                    } else {
                        this.refType.data = 'branch'
                    }

                    this.refType.loading = false
                }catch(e) {
                    console.log(e)
                    this.refType.loading = false
                }
            }
        },
        watch: {
            refTypeUpdateFlag() {
                this.network_determineRefType()
            }
        },
        components: {
            CommonLoading,
            CommitGroup,
            Container: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/truncate/index.scss';
@import 'node_modules/@primer/css/dropdown/index.scss';
.the-commit-group:first-child{
    padding-top: 0px;
    margin-top: 15px;
}
</style>