<template>
    <Container>
        <Header class="header d-flex">
            <Branches :class="{disable: !currentBranch}"  class="branches d-flex flex-grow-1 flex-shrink-1" style="font-weight:600">
                <svg class="branch-icon mr-2" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 5c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v.3c-.02.52-.23.98-.63 1.38-.4.4-.86.61-1.38.63-.83.02-1.48.16-2 .45V4.72a1.993 1.993 0 00-1-3.72C.88 1 0 1.89 0 3a2 2 0 001 1.72v6.56c-.59.35-1 .99-1 1.72 0 1.11.89 2 2 2 1.11 0 2-.89 2-2 0-.53-.2-1-.53-1.36.09-.06.48-.41.59-.47.25-.11.56-.17.94-.17 1.05-.05 1.95-.45 2.75-1.25S8.95 7.77 9 6.73h-.02C9.59 6.37 10 5.73 10 5zM2 1.8c.66 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm0 12.41c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm6-8c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                <SummaryAndDetail ref="summaryAndDetail" class="d-flex-grow-1 width-full">
                    <template v-slot:summary>
                            <span>{{currentBranch ? currentBranch : "loading..."}}</span>
                    </template>
                        <router-link @click.native="triggerSummaryAndDetail" :to="`/${owner()}/${repo()}/tree/${item.name}`" class="branch-item d" v-for="item in otherBranches" :key="item.name">
                            {{item.name}}
                        </router-link>
                        <router-link to="/" class="to-all-branches">View more branches</router-link>
                </SummaryAndDetail>  
            </Branches>
            <AnimatedWidthWrapper class="flex-shrink-0">
                <Commits v-show="!countOfCommitsByBranch.loading && codeBasicInfo().id && countOfCommitsByBranch.data > 0" class="commits height-full flex flex-items-center no-wrap">
                    <svg class="d-inline-block mr-1 v-align-middle" fill="currentColor" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 13H6V6h5v2H8v5zM7 1C4.81 1 2.87 2.02 1.59 3.59L0 2v4h4L2.5 4.5C3.55 3.17 5.17 2.3 7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-.34.03-.67.09-1H.08C.03 7.33 0 7.66 0 8c0 3.86 3.14 7 7 7s7-3.14 7-7-3.14-7-7-7z"></path></svg>
                    <router-link to="/">{{processedCountOfCommits}} commits</router-link>
                </Commits>
            </AnimatedWidthWrapper>   
        </Header>

        <CurrentPath class="path" style="border-bottom: 1px solid #eaecef;">
            <router-link class="text-gray" :to="`/${owner()}/${repo()}/tree/${currentBranch}`">
                {{repo()}}</router-link>/<Breadcrumb :path="path"/>
        </CurrentPath>    

        <transition-group name="slide-up" appear>
            <router-link class="d-block bg-white list-item" 
                         v-for="item in sortedContents" 
                        :to="adjustPath(`/${owner()}/${repo()}/${item.type}/${currentBranch}/` + path + '/' + item.name)"
                        :key="item.oid" >
                <FileItem   :branch="currentBranch"
                            :file="item"/>
            </router-link> 
        </transition-group>

        <transition name="fade" appear>
            <CommonLoading v-if="loading || !codeBasicInfo().id || loadingContentsLastUpdateInfo" :position="loading ? 'center' : 'corner'"></CommonLoading>
        </transition>      
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {
        AnimatedHeightWrapper,
        AnimatedWidthWrapper,
        SummaryAndDetail,
        CommonLoading,
        Breadcrumb} from '@/components'
    import {
        ComponentActiveAwareMixin} from '@/mixins'
    import {util_numberFormat} from '@/util'
    import FileItem from './FileItem'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import * as graphql from '../../graphql'
    import { cancelAndUpdateAxiosCancelTokenSource } from '@/network'
import { authRequiredGitHubGraphqlApiQuery } from '@/network'
import Vue from 'vue'
    export default {
        name: 'repository_code_file_browser_page',
        mixins: [ComponentActiveAwareMixin,RouteUpdateAwareMixin],
        inject: ['owner','repo','codeBasicInfo'],
        provide() {
            return {
                path:() => this.path
            }
        },
        data() {
            return {
                cachedBranch: '',
                data: [],
                loading: false,
                loadingContentsLastUpdateInfo: false,
                countOfCommitsByBranch: {
                    data: 0,
                    loading: false
                },
            }
        },
        computed: {
            activeBranchList() {
                let activeBranchList = []
                if(this.codeBasicInfo().refs) {
                    this.codeBasicInfo().refs.nodes.forEach(item => {
                        let lastCommitDate = new Date(item.target.history.nodes[0].committedDate)
                        if(Date.parse(new Date()) - Date.parse(lastCommitDate) < 90 * 24 * 3600000 ) {
                            activeBranchList.push(item)
                        }
                    })
                }
                return activeBranchList
            },
            sortedContents() {
                let sortedContents =[...this.data]
                sortedContents.sort((a,b) => {
                    let aIndex = a.type === 'tree' ? 1 : 0
                    let bIndex = b.type === 'tree' ? 1 : 0
                    return bIndex - aIndex
                })
                return sortedContents
            },
            path() {
                if(!this.$route.params.pathMatch) return
                if(this.$route.params.pathMatch.indexOf('/') === -1) return ''
                if(!this.currentBranch) return undefined
                return this.$route.params.pathMatch.replace(this.currentBranch,'')
            },
            currentBranch() {
                if(!this.$route.params.pathMatch) return 
                if(this.$route.params.pathMatch.match(/^[^\/]+\/?$/)) return this.$route.params.pathMatch.replace('/','')
                if(!this.codeBasicInfo().refs) return undefined
                   
                let branch
                let routePathMatch = this.$route.params.pathMatch
                //if(routePathMatch[routePathMatch.length - 1] !== '/') routePathMatch = `${routePathMatch}/`
                this.codeBasicInfo().refs.nodes.forEach(item => {
                    let regExp =  new RegExp(`^(${item.name})(\/\.*)?`)
                    let branchMatch = routePathMatch.match(regExp)
                    if(branchMatch){
                        if(!branch) branch = branchMatch[1]
                        if(branchMatch[1].length > branch.length) branch = branchMatch[1]
                    }
                })
                return branch
            },
            processedCountOfCommits() {
                return  util_numberFormat.thousands(this.countOfCommitsByBranch.data) 
            },
            otherBranches() {
                let otherBranches = []
                this.activeBranchList.forEach(item => {
                    if(item.name !== this.currentBranch) {
                        otherBranches.push(item)
                    }
                })
                return otherBranches.slice(0,5)
            },
            computedCodeBasicInfo() {
                return this.codeBasicInfo()
            }
        },
        created() {
            console.log(this.$route)
            this.network_getData()
        },
        methods: {
            triggerSummaryAndDetail() {
                this.$refs.summaryAndDetail.triggerStretch()
            },
        
            async network_getData() {
                  if(!this.currentBranch){
                    this.loading = true
                    return
                }
                try{
                    this.loading = true 
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name)
                    this.cancelSources.push(sourceAndCancelToken.source)
                    let graphql_contents = graphql.GRAPHQL_REPOSITORY_CONTENTS({
                        path: this.path,
                        owner: this.owner(),
                        repo: this.repo(),
                        branch: this.currentBranch
                    }) 
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_contents,{cancelToken:sourceAndCancelToken.cancelToken})
                    try{
                        this.data = res.data.data.repository.object.entries
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                    this.network_getContentsLastUpdateInfo()
                    this.network_getCommitsCountByBranch()
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            async network_getContentsLastUpdateInfo() {
                try{
                    this.loadingContentsLastUpdateInfo = true 
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name + ' get_contents_last_update_info')
                    this.cancelSources.push(sourceAndCancelToken.source)

                    let graphQL_contentsLastUpdateInfo = graphql.GRAPHQL_REPOSITORY_LAST_COMMITDATE_BY_PATH({
                        path: this.path,
                        contents: this.data,
                        owner: this.owner(),
                        repo: this.repo(),
                        branch: this.currentBranch
                    }) 
                    let res = await authRequiredGitHubGraphqlApiQuery(graphQL_contentsLastUpdateInfo,{cancelToken:sourceAndCancelToken.cancelToken})
                    let dataHolder
                    try{
                        dataHolder = res.data.data.repository.object
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                    let i = 0
                    for(let key in dataHolder) {
                       Vue.set(this.data[i],'committedDate',dataHolder[key].nodes[0].committedDate)
                        i += 1
                    }
                }catch(e) {
                    console.log(e)
                }finally{
                    this.loadingContentsLastUpdateInfo = false
                }
            },
            async network_getCommitsCountByBranch(){
                try{
                    if(this.cachedBranch === JSON.stringify({
                        owner: this.owner(),
                        repo: this.repo(),
                        branch: this.currentBranch
                    }))return
                    this.countOfCommitsByBranch.loading = true 
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name + ' get_count_of_commits_by_branch')
                    this.cancelSources.push(sourceAndCancelToken.source)

                    let graphQL_countOfCommitsByBranch = graphql.GRAPHQL_REPOSITORY_COMMITS_COUNT_BY_BRANCH({
                        owner: this.owner(),
                        repo: this.repo(),
                        branch: this.currentBranch
                    }) 
                    let res = await authRequiredGitHubGraphqlApiQuery(graphQL_countOfCommitsByBranch,{cancelToken:sourceAndCancelToken.cancelToken})

                    try{
                        this.countOfCommitsByBranch.data = res.data.data.repository.ref.target.history.totalCount
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }

                    this.cachedBranch = JSON.stringify({
                        owner: this.owner(),
                        repo: this.repo(),
                        branch: this.currentBranch
                    })

                }catch(e) {
                    console.log(e)
                }finally{
                    this.countOfCommitsByBranch.loading = false
                }
            },
            adjustPath(path) {
                let reg = /\/\//g
                return path.replace(reg,'/')
            },
            routeUpdateHook() {
                if(this.componentActive) {
                    this.network_getData()
                }
            },
            /* analyseBranch(){
                if(this.$route.params.pathMatch.indexOf('/') === -1) return this.$route.params.pathMatch
                if(!this.codeBasicInfo().refs) return undefined
                   
                let branch
                this.codeBasicInfo().refs.nodes.forEach(item => {
                    let regExp =  new RegExp(`^${item.name}\/`)
                    let branchMatch = this.$route.params.pathMatch.match(regExp)
                    if(branchMatch){
                        if(!branch) branch = branchMatch[0]
                        if(branchMatch[0].length > branch.length) branch = branchMatch[0]
                    }
                })
                return branch
            } */
        },
        watch: {
            computedCodeBasicInfo:function(newOne,oldOne) {
                if(newOne.refs && !oldOne.refs && this.$route.params.pathMatch.indexOf('/') > -1) {
                    this.network_getData()
                }
            }
        },
        components: {
            AnimatedHeightWrapper,
            AnimatedWidthWrapper,
            SummaryAndDetail,
            FileItem,
            Breadcrumb,
            CommonLoading,
            Container: styled.div``,
            Header: styled.div``,
            Branches: styled.div``,
            Commits: styled.div``,
            CurrentPath: styled.div``
        }
    }
</script>

<style scoped>
.header{
    max-width: 100%;
    border-bottom: 1px solid #dfe2e5;
}
.branches{
    padding: 15px;
    border-right: 1px solid #dfe2e5;
}
.branch-icon{
    top: 1px;
    left: 0;
    width: 16px;
    margin-right: 2px;
    margin-left: -3px;
    color: #586069;
    text-align: center;
    vertical-align: text-bottom;
    display: inline-block;
    fill: currentColor;
}
.branch-item{
    display: block;
    padding: 6px 0;
    font-size: 14px;
    font-weight: 600;
}
.commits{
    padding: 15px;
    font-size: 12px;
    font-weight: 600;
    color: #586069;
    vertical-align: top;
}

.path{
    position: relative;
    padding: 7px 15px;
    clear: both;
    font-size: 12px;
    font-weight: 600;
    color: #586069;
    background-color: #f6f8fa;
    border-top: 1px solid #eaecef;
}

.disable{
    position: relative
}
.disable::after{
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    content: ' ';
    background: white;
    opacity: 0.7;
}

.to-all-branches{
    font-size: 13px;
    font-weight: 400;
}

.list-item{
    border-top: none;
    border-bottom: 1px solid #eaecef;
}
</style>