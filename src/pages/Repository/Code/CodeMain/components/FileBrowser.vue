<template>
    <Container>
        <AnimatedHeightWrapper>
            <div v-if="currentRef && defaultRef && (currentRef != defaultRef) && (compareWithDefaultRef.data.status || compareWithDefaultRef.message)" class="pb-3">
                <CompareWithDefaultRef class="Box Box-body bg-gray-light">
                    <div v-if="compareWithDefaultRef.data.status">
                        This branch is
                        <span v-if="compareWithDefaultRef.data.ahead_by > 0">{{compareWithDefaultRef.data.ahead_by}} {{compareWithDefaultRef.data.ahead_by > 1 ? 'commits' : 'commit'}} ahead</span><span v-if="compareWithDefaultRef.data.ahead_by && compareWithDefaultRef.data.behind_by">,</span>
                        <span v-if="compareWithDefaultRef.data.behind_by > 0">{{compareWithDefaultRef.data.behind_by}} {{compareWithDefaultRef.data.behind_by > 1 ? 'commits' : 'commit'}} behind</span> 
                        dev.
                    </div>
                    <div v-else-if="compareWithDefaultRef.message" class="d-flex flex-auto">
                        {{compareWithDefaultRef.message}}
                    </div>
                </CompareWithDefaultRef>
            </div>
        </AnimatedHeightWrapper>
        
        <div class="Box">
            <div class="Box-header Box-header--blue position-relative">
                <Skeleton v-if="!latestCommit.data.node_id || latestCommit.loading" class="d-flex flex-items-center">
                    <SkeletonCircle :diameter="24" color="#EEEEEE"></SkeletonCircle>
                    <SkeletonRectangle :height="14" color="#EEEEEE" class="flex-grow-1 ml-2 mr-6"></SkeletonRectangle>
                </Skeleton> 

                <div v-else class="d-flex flex-items-center flex-wrap">
                    <div style="height: 24px" class="AvatarStack flex-self-start AvatarStack--two" v-if="latestCommit.data.author && latestCommit.data.committer && latestCommit.data.author.login != latestCommit.data.committer.login">
                        <div class="AvatarStack-body">
                            <router-link style="height: 24px;width: 24px;border-radius:2em!important;overflow:hidden;background:transparent" v-if="latestCommit.data.author && latestCommit.data.author.avatar_url" class="avatar avatar-user" :to="`/${latestCommit.data.author.login}`">
                                <img width="24" height="24" :src="latestCommit.data.author.avatar_url" :alt="`@${latestCommit.data.author.login}`">
                            </router-link>
                            <router-link style="height: 24px;width: 24px;border-radius:2em!important;overflow:hidden;background:transparent" v-if="latestCommit.data.committer && latestCommit.data.committer.avatar_url" class="avatar avatar-user" :to="`/${latestCommit.data.author.login}`">
                                <img width="24" height="24" :src="latestCommit.data.committer.avatar_url" :alt="`@${latestCommit.data.committer.login}`">
                            </router-link>
                        </div>
                    </div>
                    
                    <router-link v-else-if="latestCommit.data.author && latestCommit.data.author.avatar_url" class="avatar avatar-user" :to="`/${latestCommit.data.author.login}`">
                        <ImgWrapper>
                            <img width="24" height="24" :src="latestCommit.data.author.avatar_url" :alt="`@${latestCommit.data.author.login || latestCommit.data.author.name || 'Unknow'}`">
                        </ImgWrapper>
                    </router-link>

                    <div class="flex-1 d-flex flex-items-center ml-2 min-width-0">
                        <div class="css-truncate css-truncate-overflow text-gray" v-if="latestCommit.data.node_id">
                            <router-link v-if="latestCommit.data.author && latestCommit.data.author.login" class="user-mention" :to="`/${latestCommit.data.author.login}`">
                                {{latestCommit.data.author.login}}
                            </router-link>
                        </div>
                        <button v-if="latestCommit.data.commit && latestCommit.data.commit.message" class="ellipsis-expander js-details-target ml-2 d-inline-block " @click="triggerShowLatestCommitMessage">
                            …
                        </button>
                        <svg v-if="latestCommit.status == 'SUCCESS'" class="octicon text-green octicon-check v-align-middle flex-shrink-0 ml-2" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                        <svg v-else-if="latestCommit.status == 'FAILURE'" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true" class="octicon octicon-x v-align-middle text-red flex-shrink-0 ml-2"><path data-v-74bab622="" fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
                        <span class="no-wrap ml-2" v-if="latestCommit.data.commit">{{latestCommit.data.commit.committer.date | getDateDiff}}</span>
                    </div>

                    <router-link v-if="commitCount.data !== undefined" :to="`/${owner}/${repo}/commits/${currentRef}`" class="link-gray-dark no-underline d-block ml-3">
                        <svg height="16" class="octicon octicon-history text-gray" text="gray" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.643 3.143L.427 1.927A.25.25 0 000 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 00.177-.427L2.715 4.215a6.5 6.5 0 11-1.18 4.458.75.75 0 10-1.493.154 8.001 8.001 0 101.6-5.684zM7.75 4a.75.75 0 01.75.75v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.75.75 0 017 8.25v-3.5A.75.75 0 017.75 4z"></path></svg>
                        <span>
                            <strong>
                                {{commitCount.data | thousands}}
                            </strong>
                            <!-- {{commitCount.data > 1 ? 'commits' : 'commit'}} -->
                        </span>
                    </router-link>

                    <!-- commit message -->
                    <div class="pl-5 mt-2 width-full" v-if="latestCommit.data.commit && latestCommit.data.commit.message && latestCommit.showMessage">
                        <router-link class="link-gray-dark" :to="`/${owner}/${repo}/commits/${latestCommit.data.sha}`">
                            {{latestCommit.data.commit.message}}
                        </router-link>
                        <div class="d-flex flex-items-center">
                            <span class="text-gray-dark text-mono px-1 rounded-1 text-small mt-2" style="background-color: rgba(27,31,35,.15);">{{latestCommit.data.sha.slice(0,7)}}</span>
                            <router-link v-if="latestCommit.data.sha" class="no-wrap link-gray no-underline ml-2 mt-2 text-inherit d-lg-none" :to="`/${owner}/${repo}/commits/${latestCommit.data.sha}`">
                                <svg class="octicon octicon-comment" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.75 2.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 01.75.75v2.19l2.72-2.72a.75.75 0 01.53-.22h4.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25H2.75zM1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0113.25 12H9.06l-2.573 2.573A1.457 1.457 0 014 13.543V12H2.75A1.75 1.75 0 011 10.25v-7.5z"></path></svg>
                                {{latestCommit.data.commit.comment_count}}
                            </router-link>
                        </div>
                    </div>
                </div>
                
            </div>

            <div class="position-relative" :style="{minHeight: contents.show ? '120px':'auto'}" style="background:#fafbfc">
                <div v-if="!contents.show" class="Details-content--shown Box-footer d-md-none p-0" @click="showContents">
                    <button class="d-block btn-link js-details-target width-full px-3 py-2">
                        View code
                    </button>
                </div>
                
                <transition-group name="fade-group" appear>
                    <ContentListItem v-for="item in (contents.show ? contents.data : [])" :key="item.sha || item.type" :content="item" :currentRef="currentRef()"></ContentListItem>
                </transition-group>

                <div v-if="contents.loading && contents.show" class="loading-contents">
                    <div class="loading-contents-inner d-flex flex-justify-center flex-items-center">
                        <LoadingIconEx class="loading-icon"></LoadingIconEx>
                    </div>
                </div>
            </div> 
        </div> 
        
    </Container>
</template>
<script>
    import styled from 'vue-styled-components'
    import{LoadingIconEx,SkeletonCircle,SkeletonRectangle,ImgWrapper,AnimatedHeightWrapper} from '@/components'
    import * as api from '@/network/api'
    import * as graphql from '../graphql'
    import {authRequiredGet,authRequiredGitHubGraphqlApiQuery,commonGet,cancelAndUpdateAxiosCancelTokenSource } from '@/network'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import ContentListItem from './ContentListItem'
    let parse = require('parse-link-header')
    import Vue from 'vue'
    export default {
        name: 'repository_code_main_file_browser',
        inject: ['repoBasicInfo','path','currentRef'],
        mixins: [RouteUpdateAwareMixin],
        data() {
            return {
                contents: {
                    show: false,
                    data: [],
                    loading: false,
                    loadingLastUpdateDate: false,
                },
                latestCommit: {
                    data: {},
                    status: null,
                    loading: false,
                    showMessage: false
                },
                commitCount: {
                    data: undefined,
                    loading: false
                },
                compareWithDefaultRef: {
                    data: {},
                    message: '',
                    loading: false
                },
            }
        },
        computed: {
            owner() {
                return this.$route.params.owner
            },
            repo() {
                return this.$route.params.repo
            },
            theCurrentRef() {
                return this.currentRef()
            },
            defaultRef() {
                return this.repoBasicInfo().default_branch
            },
            repoAndRef() {
                return `${this.owner}-${this.repo}-${this.currentRef()}`
            },
            currentRouterPath() {
                return this.$route.path
            },
        },
        created() {
            this.network_getData()
        },
        methods: {
            network_getData() {
                if(!this.currentRef()) return
                this.network_getContents()
                this.network_getLatestCommit()
                this.network_getCommitsCount()
                if(this.defaultRef && this.currentRef() && (this.currentRef() != this.defaultRef)) {
                    this.network_getCompareWithDefaultRef()
                }
            },
            async network_getLatestCommit() {
                try{
                    this.latestCommit.loading = true
                    let url = api.API_COMMITS({
                        repo: this.repo,
                        owner: this.owner,
                        params: {
                            path: this.path(),
                            sha: this.currentRef(),
                            per_page: 1
                        }
                    })

                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_latest_commit').cancelToken
                        }
                    )

                    this.latestCommit.data = res.data[0]
                    this.network_getLatestCommitStatus()
                }catch(e) {
                    console.log(e)
                }finally{
                    this.latestCommit.loading = false
                }
            },
            async network_getLatestCommitStatus() {
                try{
                    let url = api.API_PROXY_COMMIT_STATUS({
                        repo: this.repo,
                        owner: this.owner,
                        sha: this.latestCommit.data.sha
                    })

                    let res = await commonGet(
                        url,
                        {
                            cancelToken: cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_latest_commit_status').cancelToken
                        }
                    )

                    if(res.data) this.parseLatestCommitStatus(res.data)
                   
                }catch(e) {
                    console.log(e)
                }
            },
            triggerShowLatestCommitMessage() {
                this.latestCommit.showMessage = !this.latestCommit.showMessage
            },
            async network_getCommitsCount() {
               
                try{
                    this.commitCount.loading = true
                    let url = api.API_COMMITS({
                        repo: this.repo,
                        owner: this.owner,
                        params: {
                            sha: this.currentRef(),
                            per_page: 1
                        }
                    })
                    
                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_commit_count').cancelToken
                        }
                    )

                    let commitCountHolder = parse(res.headers.link) || {}
                    this.commitCount.data = commitCountHolder.last ? commitCountHolder.last.page : res.data.length
                }catch(e) {
                    console.log(e)
                }finally{
                    this.commitCount.loading = false
                }       
            },
            async network_getContents() {
                try{
                    this.contents.loading = true 
                    let url = api.API_CONTENTS({
                        path: this.path() && this.path().replace(/^\//,''),
                        owner: this.owner,
                        repo: this.repo,
                        ref: this.currentRef()
                    })
                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_contents').cancelToken
                        }
                    )

                    let contents = res.data.sort((a,b) => {
                        return (b.type == 'dir' ? 1 : 0) - (a.type == 'dir' ? 1 : 0)
                    })
                    if(this.path()) contents.unshift({
                        name: '. .',
                        type: 'prevLink'
                    })
                    this.contents.data = contents
                    if(this.path()) this.contents.show = true
                    if(this.accessToken) {
                        this.network_getContentsLastUpdateInfo()
                    }
                }catch(e) {
                    this.handleError(e)
                    if(e.response && e.response.status == 404) {
                        this.emitNotFoundEvent(this.$el)
                    }
                }finally{
                    this.contents.loading = false
                }
            },
            async network_getContentsLastUpdateInfo() {
                try{
                    this.contents.loadingLastUpdateDate = true 

                    let graphQL_contentsLastUpdateInfo = graphql.GRAPHQL_REPOSITORY_LAST_COMMITDATE_BY_PATH({
                        path: this.path(),
                        contents: this.contents.data,
                        owner: this.owner,
                        repo: this.repo,
                        branch: this.currentRef()
                    }) 
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphQL_contentsLastUpdateInfo,
                        {
                            cancelToken: cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_contents_last_update_date').cancelToken
                        }
                    )

                    let dataHolder
                    try{
                        dataHolder = res.data.data.repository.object
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                    let i = 0
                    for(let key in dataHolder) {
                       Vue.set(this.contents.data[i],'committedDate',dataHolder[key].nodes[0] && dataHolder[key].nodes[0].committedDate)
                        i += 1
                    }
                }catch(e) {
                    console.log(e)
                }finally{
                    this.contents.loadingLastUpdateDate = false
                }
            },
            async network_getCompareWithDefaultRef() {
                try{
                    this.compareWithDefaultRef.loading = true
                    let url = api.API_COMMITS_COMPARE({
                        repo: this.repo,
                        owner: this.owner,
                        baseHead: `${this.defaultRef}...${this.currentRef()}`
                    })

                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_compare_with_default_ref').cancelToken
                        }
                    )

                    this.compareWithDefaultRef.data = res.data
                }catch(e) {
                    console.log(e)
                    if(e.response) {
                        this.compareWithDefaultRef.message = e.response.data.message
                    }
                }finally{
                    this.compareWithDefaultRef.loading = false
                }
            },
            showContents() {
                this.contents.show = true
            },
            parseLatestCommitStatus(HTML) {
                let failurePattern = /octicon-x/g
                let successPattern = /octicon-check/g
                if(HTML.match(failurePattern) != null) {
                    this.latestCommit.status = 'FAILURE'
                }else if(HTML.match(successPattern) != null) {
                    this.latestCommit.status = 'SUCCESS'
                }
            },
            routeUpdateHook() {
                this.network_getContents()
                this.network_getLatestCommit()
            }
        },  
        beforeRouteEnter(to,from,next) {
            next(vm => {
                if(to.query.update_file_browser) {
                    vm.network_getData()
                }
            })
        },
        watch: {
            theCurrentRef(newOne,oldOne) {
                if(newOne && !oldOne){
                    this.componentActive && this.network_getContents() 
                }
            },
            defaultRef(newOne,oldOne) {
                if(newOne && !oldOne){
                    if(this.defaultRef && this.currentRef() && (this.currentRef() != this.defaultRef)) {
                        this.componentActive && this.network_getCompareWithDefaultRef()
                    } 
                }
            },
            repoAndRef(newOne,oldOne) {
                this.componentActive && this.network_getLatestCommit()
                this.componentActive && this.network_getCommitsCount()
                if(this.defaultRef && this.currentRef() && (this.currentRef() != this.defaultRef)) {
                    this.componentActive && this.network_getCompareWithDefaultRef()
                }
            },
        },
        components: {
            LoadingIconEx,
            ContentListItem,
            SkeletonCircle,
            ImgWrapper,
            SkeletonRectangle,
            AnimatedHeightWrapper,
            Container: styled.div``,
            Skeleton: styled.div``,
            CompareWithDefaultRef: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/truncate/index.scss';
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
.user-mention {
    font-weight: 600;
    color: #24292e;
    white-space: nowrap;
}

.loading-contents{
    background: white;
    opacity: .4;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.loading-contents-inner{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    max-height: 240px;
}

</style>
