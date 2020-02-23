<template>
    <Container class="px-3 pt-3 bg-white flex-grow-1">
        <AnimatedHeightWrapper>
            <Header v-if="data.id">
                <HeaderActions class="flex flex-justify-between flex-items-center mb-3">
                    <router-link to="/" class="btn btn-primary d-inline-block btn-sm">
                        New issue
                    </router-link>

                    <a href="javascript:return false">Jump to bottom</a>
                </HeaderActions>

                <HeaderTitle class="title f1">
                    {{data.title}}
                    <span class="number">#{{data.number}}</span>
                </HeaderTitle>

                <HeaderMeta class="flex mt-2 mb-3 flex-items-center header-meta">
                    <State class="State State--green mr-2" :class="{'State--green':data.state === 'open','State--red':data.state === 'closed'}" style="text-transform:capitalize;">
                        <svg height="16" class="octicon" viewBox="0 0 14 16" version="1.1" width="14" aria-hidden="true"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>
                        {{data.state}}
                    </State>   

                    <MetaContent class="meta-content">
                        <router-link to="/" class="text-bold link-gray">{{data.user && data.user.login}}</router-link>
                        {{data.state}} this issue
                        <span class="no-wrap">on {{createdAt}}</span>&nbsp;· {{data.comments}} {{data.comments > 1 ? 'comments' : 'comment'}} 
                    </MetaContent>
                </HeaderMeta>
            </Header>
        </AnimatedHeightWrapper>
        

        <Info   class="border-bottom border-top pt-3 mt-3" 
                v-if="(data.assignees && data.assignees.length !== 0) || (data.labels && data.labels.length !== 0) || (projects.data.length > 0) || (data.milestone && data.milestone !== null)"
                >
            <!-- assignee -->
                 <div class="flex pb-3" v-if="data.assignees && data.assignees.length !== 0">
                    <span class="text-gray text-bold flex-shrink-0 col-3 f6">Assignees</span>    
                    <div class="min-width-0 flex flex-wrap mt-n1 flex-wrap">
                        <img class="avatar mr-1" v-for="item in data.assignees" 
                        :key="item.id" :src="item.avatar_url" height="20" width="20"> 
                    </div>
                </div> 
           
            <!-- label -->
            <AnimatedHeightWrapper>
                <div class="flex pb-3" v-if="data.labels && data.labels.length !== 0">
                    <span class="text-gray text-bold flex-shrink-0 col-3 f6">Labels</span>    
                    <div class="min-width-0 flex flex-wrap mt-n1">
                        <Label  v-for="item in data.labels" 
                                class="mr-1 mt-1"
                                :name="item.name"
                                :color="item.color"
                                :key="item.name"></Label> 
                    </div>
                </div> 
            </AnimatedHeightWrapper>
            <!-- project -->
            <AnimatedHeightWrapper>
                <div class="flex pb-3" v-if="projects.data.length !== 0">
                    <span class="text-gray text-bold flex-shrink-0 col-3 f6">Projects</span>    
                    <div class="min-width-0 flex flex-wrap mt-n1 f6">
                        <router-link v-for="item in projects.data" :key="item.project.name" to="/" class="d-inline-block text-bold mr-2 link-gray-dark">
                            <svg class="octicon octicon-project text-gray p-0" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 00-1 1v14a1 1 0 001 1h13a1 1 0 001-1V1a1 1 0 00-1-1z"></path></svg>
                            {{item.project.name}}
                        </router-link> 
                    </div>
                </div> 
            </AnimatedHeightWrapper>
            <!-- milestone -->
            <AnimatedHeightWrapper>
                <div class="flex pb-3" v-if="data.milestone && data.milestone !== null">
                    <span class="text-gray text-bold flex-shrink-0 col-3 f6">Milestone</span>    
                    <div class="min-width-0 flex flex-wrap mt-n1 f6">
                        <router-link to="/" class="d-inline-block text-bold mr-2 link-gray-dark">
                            <svg class="octicon octicon-milestone text-gray" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2H6V0h2v2zm4 5H2c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h10l2 2-2 2zM8 4H6v2h2V4zM6 16h2V8H6v8z"></path></svg>
                            {{data.milestone.title}}
                        </router-link> 
                    </div>
                </div> 
            </AnimatedHeightWrapper>
        </Info>

        <Comment    :data="data"
                    v-if="data.user" 
                    style="padding-top:0px!important;margin-top:16px;"
                    :reactionStatistic="body.reactionStatistic"
                    :bodyHTML="body.data" 
                    :loading="body.loading"/>

        <AnimatedHeightWrapper :stretch="timeline.loading && (!timeline.pageInfo.next)">
            <LoadingTimeline class="loading-timeline flex flex-items-center flex-justify-center">
                <LoadingIconEx/>
            </LoadingTimeline> 
        </AnimatedHeightWrapper>   
         

        <transition-group tag="div" appear name="fade">
            <TimelineItem v-for="item in timeline.data" :data="item" :key="item.id"/>
        </transition-group>

        <HiddenItemLoading v-if="timeline.pageInfo && timeline.pageInfo.next && timeline.pageInfo.next.page !== timeline.pageInfo.last.page"
                            :loading="timeline.loading"
                            :dataGetter="loadingMore">
            {{hiddenItemCount}}
        </HiddenItemLoading>

        <transition-group tag="div" appear name="fade">
                <TimelineItem v-for="item in timeline.lastData" :data="item" :key="item.id"/>
        </transition-group>

        <transition name="fade" appear>
            <CommonLoading v-if="loading || timeline.loading || timeline.commentBodyHTMLAndReactions.loading || projects.loading"
                            :preventClickEvent="false"
                            :position="loading ? 'center' : 'corner'"/>
        </transition>  
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoading,Label,AnimatedHeightWrapper,LoadingIconEx} from '../../../../components'
    import {TimelineItem,Comment,HiddenItemLoading} from './components'
    import {util_dateFormat} from '../../../../util'
    import {
        authRequiredGet,
        authRequiredGitHubGraphqlApiQuery,
        cancelAndUpdateAxiosCancelTokenSource} from '@/network'
    import * as api from '@/network/api'
    import * as graphql from '@/network/graphql'
    import {ACTION_REPOSITORY_REQUEST_ISSUE_DETAIL_DATA, ACTION_REPOSITORY_REQUEST_ISSUE_TIMELINE} from '../../../../store/modules/repository/actionTypes'
    import {mapState,mapActions} from 'vuex'
    var parse = require('parse-link-header');
    var parse = require('parse-link-header');
    export default {
        name: 'issueDetail',
        inject: ['owner','repo'],
        provide() {
            return {
                commentBodyHTMLAndReactionsGetter: () => this.timeline.commentBodyHTMLAndReactions.data,
            }
        },
        data() {
            return {
                data: {},
                loading: false,
                loadingAdditionalData: false,
                body: {
                    data: '',
                    reactionStatistic: {},
                    loading: false
                },
                timeline: {
                    data: [],
                    loading: false,
                    commentBodyHTMLAndReactions: {
                        data: [],
                        loading: false
                    },
                    perPage: 20,
                    lastData: [],
                    pageInfo: {},
                },
                projects: {
                    data: [],
                    loading: false
                }
            }
        },
       
        computed: {
            ...mapState({
                // data: state => state.repository.issue.issueDetail.data,
                //timelineData: state => state.repository.issue.issueDetail.timeline.data,
                //timelineLastData: state => state.repository.issue.issueDetail.timeline.lastData,
                //timelinePageInfo: state => state.repository.issue.issueDetail.timeline.pageInfo,
                //timelinePerPage: state => state.repository.issue.issueDetail.timeline.perPage,
                //issueBodyHTMLAndReactions: state => state.repository.issue.issueDetail.body.data,
                //projects: state => state.repository.issue.issueDetail.//.data,
                //loadingProjects: state => state.repository.issue.issueDetail.projects.loading,
                //loading: state => state.repository.issue.issueDetail.loading,
                //loadingTimeline: state => state.repository.issue.issueDetail.timeline.loading,
                //loadingIssueBody: state => state.repository.issue.issueDetail.body.loading,
                //loadingTimelineCommentDetail: state => state.repository.issue.issueDetail.timeline.commentBodyHTMLAndReactions.loading,
            }),
            number() {
                return this.$route.params.number
            },
            createdAt() {
                return util_dateFormat.dateFormat('dd zzz yyyy', new Date(this.data.created_at))
            },
            updatedAt() {
                return util_dateFormat.dateFormat('dd zzz yyyy', new Date(this.data.updated_at))
            },
            hiddenItemCount() {
                if(!this.timeline.pageInfo.last) return 0
                let totalCount = (this.timeline.pageInfo.last.page - 1) * this.timeline.perPage
                let alreadyShowCount = (this.timeline.pageInfo.next.page - 1) * this.timeline.perPage
                return totalCount - alreadyShowCount
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            ...mapActions({
                action_getData: ACTION_REPOSITORY_REQUEST_ISSUE_DETAIL_DATA,
                action_getTimeline:ACTION_REPOSITORY_REQUEST_ISSUE_TIMELINE,
            }),
            loadingMore() {
                if(this.timeline.loading) return
                this.network_getTimeline({
                    changePage: true
                })
            },
            async network_getData() {
               
                try{
                    let cancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name)

                    //获取issue基本数据
                    this.loading = true
                    let url_issue = api.API_ISSUE({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number
                    })
                    let res_issue = await authRequiredGet(url_issue,{cancelToken})
                    this.data = res_issue.data
                    this.loading = false

                    //获取issue timeline
                    this.network_getTimeline()

                    //获取issue bodyHTML
                    this.body.loading = true
                    let graphql_issueBodyHTML = graphql.GRAPHQL_ISSUE_BODY({nodeId:res_issue.data.node_id})
                    let res_issueBodyHTML = await authRequiredGitHubGraphqlApiQuery(graphql_issueBodyHTML,{cancelToken})
                    let reactionStatistic = {}
                    for(let key in res_issueBodyHTML.data.data.node) {
                        switch(key) {
                            case 'THUMBS_UP':
                            case 'THUMBS_DOWN':
                            case 'LAUGH':
                            case 'HOORAY':
                            case 'CONFUSED':
                            case 'HEART':
                            case 'ROCKET':
                            case 'EYES':
                                reactionStatistic[key] = res_issueBodyHTML.data.data.node[key].totalCount
                                break
                            default:
                        }
                    }
                    this.body.data = res_issueBodyHTML.data.data.node.bodyHTML
                    this.body.reactionStatistic = reactionStatistic
                    this.body.loading = false

                    //获取issue projects
                    this.projects.loading = true
                    let graphql_projects = graphql.GRAPHQL_ISSUE_PROJECTS({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number
                    })
                    let res_projects = await authRequiredGitHubGraphqlApiQuery(graphql_projects,{cancelToken})
                    this.projects.data = res_projects.data.data.repository.issue.projectCards.nodes
                    this.projects.loading = false
                    
                    
                }catch(e){
                    this.loading = false
                    this.body.loading = false
                    this.projects.loading = false
                    console.log(e)
                }
            },
            async network_getTimeline(payload) {
                 payload = {
                    changePage: false,
                    ...payload
                }
                try{
                    this.timeline.loading = true

                    let url_timeline
                    if(payload.changePage) {
                        url_timeline = this.timeline.pageInfo.next.url
                    } else {
                        url_timeline = api.API_ISSUE_TIMELINE({
                            repo: this.repo,
                            owner: this.owner,
                            number: this.number
                        }) + `?per_page=${this.timeline.perPage}`
                    }

                    let cancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name + '_timeline_' + url_timeline)
                    this.cancelTokenArr_timeline = [
                        ...(this.cancelTokenArr_timeline || []),
                        cancelToken
                    ]

                    let config = {
                        cancelToken,
                        headers:{
                            'Accept': 'application/vnd.github.mockingbird-preview,application/vnd.github.starfox-preview+json,application/vnd.github.VERSION.html'
                        }   
                    }
                    
                    let res_timeline = await authRequiredGet(url_timeline,config)

                    if(payload.changePage) {
                        this.timeline.data = this.timeline.data.concat(res_timeline.data)
                    }else{
                        this.timeline.data = res_timeline.data
                    }
                    this.timeline.pageInfo = parse(res_timeline.headers.link)
                    if((!payload.changePage) && this.timeline.pageInfo && this.timeline.pageInfo.last) {
                        let res_issueTimeline_last = await authRequiredGet(this.timeline.pageInfo.last.url,config)
                        this.timeline.lastData = res_issueTimeline_last.data
                    }

                    this.timeline.loading = false

                    //获取comment bodyHTML 以及 comment reactions
                    this.timeline.commentBodyHTMLAndReactions.loading = true
                       
                    let comments = []
                    this.timeline.data.forEach(item => {
                        if(item.event === 'commented') {
                            comments.push(item)
                        }
                    })

                    let graphql_issueCommentBodyAndReactions = graphql.GRAPHQL_ISSUE_COMMENT_BODY_AND_REACTIONS(comments)
                    let res_issueCommentBodyAndReactions = await authRequiredGitHubGraphqlApiQuery(graphql_issueCommentBodyAndReactions,{cancelToken})

                    if(!payload.changePage) this.timeline.commentBodyHTMLAndReactions.data = []
                    for(let key in res_issueCommentBodyAndReactions.data.data) {
                        this.timeline.commentBodyHTMLAndReactions.data.push(res_issueCommentBodyAndReactions.data.data[key])
                    }

                    this.timeline.commentBodyHTMLAndReactions.loading = false
                }catch(e){
                    this.timeline.loading = false
                    this.timeline.commentBodyHTMLAndReactions.loading = false
                    console.log(e)
                }
            },
            cancelNetwork() {
                this.cancelTokenArr_timeline.forEach(item => {
                    item.cancel()
                })
            }
        },
        watch: {
            repo() {
                this.cancelNetwork()
            },
            owner() {
                this.cancelNetwork()
            },
            number() {
                this.cancelNetwork()
            }
        },
        components: {
            CommonLoading,
            Label,
            Comment,
            TimelineItem,
            HiddenItemLoading,
            LoadingIconEx,
            AnimatedHeightWrapper,
            Container: styled.div``,
            Header: styled.div``,
            HeaderActions: styled.div``,
            HeaderTitle: styled.h1``,
            HeaderMeta: styled.div``,
            State: styled.div``,
            MetaContent: styled.div``,
            Info: styled.div``,
            Labels: styled.div``,
            LoadingTimeline: styled.div``
        }
    }
</script>

<style scoped lang="scss">
.title{
    margin-bottom: 0;
    font-weight: 400;
    line-height: 1.125;
    .number{
        font-weight: 300;
        color: #6a737d;
    }
}

.header-meta{
    font-size: 14px;
    color: #586069;
    .meta-content{
        word-wrap: break-word;
        white-space: normal;
    }
}
.loading-timeline{
    height: 200px;
}

</style>