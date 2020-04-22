<template>
    <Container class="px-3 pt-3 bg-white flex-grow-1">
        <AnimatedHeightWrapper>
            <Header v-if="data.id" @click="() => {$router.push('/vuejs/vue/issues/11256')}">
                <HeaderActions class="d-flex flex-justify-between flex-items-center mb-3">
                    <router-link to="/" class="btn btn-primary d-inline-block btn-sm">
                        New issue
                    </router-link>

                    <a href="javascript:return false">Jump to bottom</a>
                </HeaderActions>

                <HeaderTitle class="title f1">
                    {{data.title}}
                    <span class="number">#{{data.number}}</span>
                </HeaderTitle>

                <HeaderMeta class="d-flex mt-2 mb-3 flex-items-center header-meta">
                    <State class="State State--green mr-2 d-inline-flex flex-items-center" :class="{'State--green':data.state === 'open','State--red':data.state === 'closed'}" style="text-transform:capitalize;">
                        <IssueIcon color="#fff" :issue="data"></IssueIcon>
                        &nbsp;{{data.state}}
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
                v-if="(data.assignees && data.assignees.length !== 0) || (data.labels && data.labels.length !== 0) || (projects.length > 0) || (data.milestone && data.milestone !== null)"
                >
            <!-- assignee -->
                 <div class="d-flex pb-3" v-if="data.assignees && data.assignees.length !== 0">
                    <span class="text-gray text-bold flex-shrink-0 col-3 f6">Assignees</span>    
                    <div class="min-width-0 d-flex flex-wrap mt-n1 flex-wrap">
                        <ImgWrapper>
                            <img class="avatar mr-1" v-for="item in data.assignees" 
                            :key="item.id" :src="item.avatar_url" height="20" width="20"> 
                        </ImgWrapper>
                    </div>
                </div> 
           
            <!-- label -->
            <AnimatedHeightWrapper>
                <div class="d-flex pb-3" v-if="data.labels && data.labels.length !== 0">
                    <span class="text-gray text-bold flex-shrink-0 col-3 f6">Labels</span>    
                    <div class="min-width-0 d-flex flex-wrap mt-n1">
                        <router-link to="/" v-for="item in data.labels" :key="item.name">
                            <Label  class="mr-1 mt-1"
                                    :name="item.name"
                                    :color="`#${item.color}`"></Label> 
                        </router-link>
                    </div>
                </div> 
            </AnimatedHeightWrapper>
            <!-- project -->
            <AnimatedHeightWrapper>
                <div class="d-flex pb-3" v-if="projects.length !== 0">
                    <span class="text-gray text-bold flex-shrink-0 col-3 f6">Projects</span>    
                    <div class="min-width-0 d-flex flex-wrap mt-n1 f6">
                        <router-link v-for="item in projects" :key="item.project.name" to="/" class="d-inline-block text-bold mr-2 link-gray-dark">
                            <svg class="octicon octicon-project text-gray p-0" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 00-1 1v14a1 1 0 001 1h13a1 1 0 001-1V1a1 1 0 00-1-1z"></path></svg>
                            {{item.project.name}}
                        </router-link> 
                    </div>
                </div> 
            </AnimatedHeightWrapper>
            <!-- milestone -->
            <AnimatedHeightWrapper>
                <div class="d-flex pb-3" v-if="data.milestone && data.milestone !== null">
                    <span class="text-gray text-bold flex-shrink-0 col-3 f6">Milestone</span>    
                    <div class="min-width-0 d-flex flex-wrap mt-n1 f6">
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
                    :headerStyle="{
                        backgroundColor:'#f1f8ff',
                        borderBottomColor:'#c0d3eb'}"
                    :extraData="extraData.data" 
                    :loading="extraData.loading"/>

        <transition-group tag="div" appear name="fade">
            <TimelineItem v-for="(item,index) in mergedTimelineData(timeline.data)" :data="item" :key="(item.id || '') + index"/>
        </transition-group>

        <AnimatedHeightWrapper :stretch="timeline.loading && (timeline.data.length === 0)">
            <LoadingTimeline class="loading-timeline d-flex flex-items-center flex-justify-center">
                <LoadingIconEx/>
            </LoadingTimeline> 
        </AnimatedHeightWrapper>   

        <HiddenItemLoading v-if="(timeline.pageInfo) && (timeline.pageInfo.next) && (timeline.pageInfo.next.page < timeline.pageInfo.last.page - 1) && (timeline.data.length !== 0)"
                            :loading="timeline.loading"
                            :dataGetter="loadingMore">
            {{hiddenItemCount}}
        </HiddenItemLoading>

        <transition-group tag="div" appear name="fade">
                <TimelineItem v-for="(item,index) in mergedTimelineData(timeline.lastData)" :data="item" :key="(item.id || '') + index"/>
        </transition-group>

        <Editor v-if="data.id" 
                class="pt-3 mb-5" 
                style="border-top: 2px solid #e1e4e8;" 
                :locked="viewerCannotComment" 
                :lockedReason="extraData.data.activeLockReason"></Editor>


        <InfoBottom v-if="data.id">
            <!-- assignee -->
            <InfoBottomItem class="info-bottom-item">
                <InfoBottomItemTitle class="info-bottom-item-title">
                    Assignees
                    <svg v-if="data.assignees && data.assignees.length > 0" class="octicon octicon-gear" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14 8.77v-1.6l-1.94-.64-.45-1.09.88-1.84-1.13-1.13-1.81.91-1.09-.45-.69-1.92h-1.6l-.63 1.94-1.11.45-1.84-.88-1.13 1.13.91 1.81-.45 1.09L0 7.23v1.59l1.94.64.45 1.09-.88 1.84 1.13 1.13 1.81-.91 1.09.45.69 1.92h1.59l.63-1.94 1.11-.45 1.84.88 1.13-1.13-.92-1.81.47-1.09L14 8.75v.02zM7 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path></svg>
                </InfoBottomItemTitle>
                <div style="margin-bottom:10px" v-for="item in data.assignees.slice(0,21)" :key="item.id">
                    <router-link to="/">
                        <ImgWrapper>
                            <img class="avatar" :src="item.avatar_url" width="20" height="20" :alt="`@${item.login}`"> 
                        </ImgWrapper>
                        <span class="assignee-login">{{item.login}}</span>    
                    </router-link> 
                </div>
                <span v-if="!(data.assignees && data.assignees.length > 0)">No one assigneed</span>    
                <span v-if="data.assignees.length > 21">and others</span>    
            </InfoBottomItem>

             <!-- labels -->
            <InfoBottomItem class="info-bottom-item">
                <InfoBottomItemTitle class="info-bottom-item-title">
                    Labels
                    <svg v-if="data.labels && data.labels.length > 0" class="octicon octicon-gear" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14 8.77v-1.6l-1.94-.64-.45-1.09.88-1.84-1.13-1.13-1.81.91-1.09-.45-.69-1.92h-1.6l-.63 1.94-1.11.45-1.84-.88-1.13 1.13.91 1.81-.45 1.09L0 7.23v1.59l1.94.64.45 1.09-.88 1.84 1.13 1.13 1.81-.91 1.09.45.69 1.92h1.59l.63-1.94 1.11-.45 1.84.88 1.13-1.13-.92-1.81.47-1.09L14 8.75v.02zM7 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path></svg>
                </InfoBottomItemTitle>
                <router-link class="d-block mt-1" to="/" v-for="item in data.labels.slice(0,21)" :key="item.id">
                    <Label class="width-full" :name="item.name" :color="`#${item.color}`"></Label>      
                </router-link> 
                <span v-if="!(data.labels && data.labels.length > 0)">None yet</span>    
                <span v-if="data.labels.length > 21">and others</span> 
            </InfoBottomItem>

             <!-- projects -->
            <InfoBottomItem class="info-bottom-item">
                <InfoBottomItemTitle class="info-bottom-item-title">
                    Projects
                    <svg v-if="projects.length > 0" class="octicon octicon-gear" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14 8.77v-1.6l-1.94-.64-.45-1.09.88-1.84-1.13-1.13-1.81.91-1.09-.45-.69-1.92h-1.6l-.63 1.94-1.11.45-1.84-.88-1.13 1.13.91 1.81-.45 1.09L0 7.23v1.59l1.94.64.45 1.09-.88 1.84 1.13 1.13 1.81-.91 1.09.45.69 1.92h1.59l.63-1.94 1.11-.45 1.84.88 1.13-1.13-.92-1.81.47-1.09L14 8.75v.02zM7 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path></svg>
                </InfoBottomItemTitle>
                <ProjectCard v-for="item in projects.slice(0,21)" :key="item.id" :data="item"></ProjectCard>
                <span v-if="!(projects.length > 0)">None yet</span>  
                <span v-if="projects.length > 21">and others</span>   
            </InfoBottomItem>

             <!-- milestones -->
            <InfoBottomItem class="info-bottom-item">
                <InfoBottomItemTitle class="info-bottom-item-title">
                    Milestone
                    <svg v-if="data.milestone" class="octicon octicon-gear" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14 8.77v-1.6l-1.94-.64-.45-1.09.88-1.84-1.13-1.13-1.81.91-1.09-.45-.69-1.92h-1.6l-.63 1.94-1.11.45-1.84-.88-1.13 1.13.91 1.81-.45 1.09L0 7.23v1.59l1.94.64.45 1.09-.88 1.84 1.13 1.13 1.81-.91 1.09.45.69 1.92h1.59l.63-1.94 1.11-.45 1.84.88 1.13-1.13-.92-1.81.47-1.09L14 8.75v.02zM7 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path></svg>
                </InfoBottomItemTitle>
                <Progress v-if="data.milestone" :donePercent="data.milestone.closed_issues / (data.milestone.closed_issues + data.milestone.open_issues)"></Progress>
                <router-link to="/" v-if="data.milestone" class="link-gray mt-1 d-block text-bold css-truncate">
                    <strong class="d-inline-block v-align-text-top css-truncate-target">{{data.milestone.title}}</strong>
                </router-link>
                <span v-else>No milestone</span>    
            </InfoBottomItem>

             <!-- notifications -->
            <InfoBottomItem class="info-bottom-item">
                <InfoBottomItemTitle class="info-bottom-item-title d-flex flex-justify-between">
                    Notifications
                    <span class="text-normal">Customize</span>
                </InfoBottomItemTitle>
               <button type="submit" class="btn btn-block btn-sm d-block width-full" data-disable-with="">
                    <svg class="octicon octicon-mute" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2.81v10.38c0 .67-.81 1-1.28.53L3 10H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h2l3.72-3.72C7.19 1.81 8 2.14 8 2.81zm7.53 3.22l-1.06-1.06-1.97 1.97-1.97-1.97-1.06 1.06L11.44 8 9.47 9.97l1.06 1.06 1.97-1.97 1.97 1.97 1.06-1.06L13.56 8l1.97-1.97z"></path></svg> Unsubscribe
                </button>
                <span class="mt-1 d-inline-block" v-if="extraData.data.viewerSubscription">You're {{extraData.data.viewerSubscription.toLowerCase()}} to this thread.</span>
            </InfoBottomItem>

            <!-- participants -->
            <InfoBottomItem class="info-bottom-item">
                <InfoBottomItemTitle class="info-bottom-item-title">
                    {{extraData.data.participants && extraData.data.participants.totalCount}} participants
                </InfoBottomItemTitle>
                <div style="margin-bottom:10px" class="d-flex flex-wrap">
                    <router-link to="/" v-for="item in extraData.data.participants ? extraData.data.participants.nodes : []" :key="item.id" class="mt-1 ml-1">
                        <ImgWrapper>
                            <img class="avatar" :src="item.avatarUrl" width="26" height="26" :alt="`@${item.login}`"> 
                        </ImgWrapper>
                    </router-link> 
                </div>
                <span v-if="extraData.data.participants && (extraData.data.participants.totalCount > 21)">and others</span>    
            </InfoBottomItem>
        </InfoBottom>

        <transition name="fade" appear>
            <CommonLoading v-if="loading || timeline.loading || timeline.commentExtraGraphqlData.loading"
                            :preventClickEvent="false"
                            :position="loading ? 'center' : 'corner'"/>
        </transition>  

        <transition name="fade" appear>
            <StickyTop v-if="scrollTop > 300" class="sticky-top px-3 py-2">
                <StickyTopContent class="d-flex flex-items-center flex-justify-between">
                    <State class="State mr-2 d-inline-flex flex-items-center flex-shrink-0" :class="{'State--green':data.state === 'open','State--red':data.state === 'closed'}" style="text-transform:capitalize;">
                        <IssueIcon color="#fff" :issue="data"></IssueIcon>
                        &nbsp;{{data.state}}
                    </State>   

                    <div class="min-width-0">
                        <h1 class="d-flex text-bold f5">
                            <router-link to="/" class="css-truncate css-truncate-target link-gray-dark width-fit">
                                {{data.title}}
                            </router-link>
                            <span class="text-gray-light pl-1 no-wrap text-normal">#{{data.number}}</span>
                        </h1>
                        <div class="meta text-gray-light css-truncate css-truncate-target d-block width-fit f6">
                            <router-link to="/" class="text-bold link-gray">{{data.user && data.user.login}}</router-link>  opened this issue
                            <span class="no-wrap">{{createdAt}}</span>
                            · {{data.comments}} {{data.comments > 1 ? 'comments' : 'comment'}}
                        </div>
                    </div> 

                </StickyTopContent>
            </StickyTop>
        </transition>     
        
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoading,
            Label,
            AnimatedHeightWrapper,
            LoadingIconEx,
            Progress,
            IssueIcon,
            ImgWrapper,
            Editor,
            HiddenItemLoading} from '@/components'
    import {ScrollTopListenerMixin,RouteUpdateAwareMixin} from '@/mixins'
    import {TimelineItem,Comment,ProjectCard} from './components'
    import {util_dateFormat} from '@/util'
    import {
        authRequiredGet,
        authRequiredGitHubGraphqlApiQuery,
        cancelAndUpdateAxiosCancelTokenSource} from '@/network'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import {mapState,mapActions} from 'vuex'
    var parse = require('parse-link-header');
    var parse = require('parse-link-header');
    export default {
        name: 'issueDetail',
        inject: ['owner','repo'],
        mixins: [ScrollTopListenerMixin,RouteUpdateAwareMixin],
        provide() {
            return {
                commentExtraGraphqlDataGetter: () => this.timeline.commentExtraGraphqlData.data,
                issueGetter: () => Object.assign({},this.data,this.extraData.data)
            }
        },
        data() {
            return {
                data: {},
                loading: false,
                loadingAdditionalData: false,
                //bodyHTML reactions viewerAssociation
                extraData: {
                    data: {},
                    loading: false
                },
                timeline: {
                    data: [],
                    loading: false,
                    commentExtraGraphqlData: {
                        data: [],
                        loading: false
                    },
                    perPage: 20,
                    lastData: [],
                    pageInfo: {},
                    count: {
                        data: 0,
                        loading: false
                    }
                },
                projects: [],
                timelineTypes: [
                    {
                        graphql:'CROSS_REFERENCED_EVENT',
                        rest:'cross-referenced',
                    },
                    {
                        graphql:'REFERENCED_EVENT',
                        rest:'referenced',
                    },
                    {
                        graphql:'ISSUE_COMMENT',
                        rest:'commented',
                    },
                    {
                        graphql:'ASSIGNED_EVENT',
                        rest:'assigned',
                    },
                    {
                        graphql:'UNASSIGNED_EVENT',
                        rest:'unassigned',
                    },
                    {
                        graphql:'CLOSED_EVENT',
                        rest:'closed',
                    },
                    {
                        graphql:'REOPENED_EVENT',
                        rest:'reopened',
                    },
                    {
                        graphql:'COMMENT_DELETED_EVENT',
                        rest:'comment_deleted',
                    },
                    {
                        graphql:'MILESTONED_EVENT',
                        rest:'milestoned',
                    },
                    {
                        graphql:'DEMILESTONED_EVENT',
                        rest:'demilestoned',
                    },
                    {
                        graphql:'LABELED_EVENT',
                        rest:'labeled',
                    },
                    {
                        graphql:'UNLABELED_EVENT',
                        rest:'unlabeled',
                    },
                    {
                        graphql:'LOCKED_EVENT',
                        rest:'locked',
                    },
                    {
                        graphql:'UNLOCKED_EVENT',
                        rest:'unlocked',
                    },
                    {
                        graphql:'MARKED_AS_DUPLICATE_EVENT',
                        rest:'marked_as_duplicate',
                    },
                    {
                        graphql:'UNMARKED_AS_DUPLICATE_EVENT',
                        rest:'unmarked_as_duplicate',
                    },
                    {
                        graphql:'MOVED_COLUMNS_IN_PROJECT_EVENT',
                        rest:'moved_columns_in_project',
                    },
                    {
                        graphql:'PINNED_EVENT',
                        rest:'pinned',
                    },
                    {
                        graphql:'UNPINNED_EVENT',
                        rest:'unpinned',
                    },
                    {
                        graphql:'RENAMED_TITLE_EVENT',
                        rest:'renamed',
                    },
                    {
                        graphql:'TRANSFERRED_EVENT',
                        rest:'transferred',
                    },
                    {
                        graphql:'USER_BLOCKED_EVENT',
                        rest:'user_blocked',
                    }
                ]
            }
        },
       
        computed: {
           
            number() {
                return this.$route.params.number
            },
            createdAt() {
                return util_dateFormat.dateFormat('dd zzz yyyy', new Date(this.data.created_at))
            },
            updatedAt() {
                return util_dateFormat.dateFormat('dd zzz yyyy', new Date(this.data.updated_at))
            },
            viewerCannotComment() {
                return this.data.locked && !this.extraData.data.viewerCanUpdate
            },
            hiddenItemCount() {
                let alreadyCount = 0
                this.timeline.data.forEach(item => {
                    if(this.timelineTypes.some(_item => {
                        return _item.rest === item.event
                    })){
                        alreadyCount ++
                    }
                })
                this.timeline.lastData.forEach(item => {
                    if(this.timelineTypes.some(_item => {
                        return _item.rest === item.event
                    })){
                        alreadyCount ++
                    }
                })
                
                return this.timeline.count.data - alreadyCount
            },
            /* subscriptionNotice() {
                return this.extraData.viewerSubscription.toLowerCase()
            } */
        },
        created() {
            this.network_getData()
        },
        methods: {
            loadingMore() {
                if(this.timeline.loading) return
                this.network_getTimeline({
                    changePage: true
                })
            },
            async network_getData() {
               
                try{
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.name).cancelToken

                    //获取issue基本数据
                    this.loading = true
                    let url_issue = api.API_ISSUE({
                        repo: this.repo(),
                        owner: this.owner(),
                        number: this.number
                    })
                    let res_issue = await authRequiredGet(url_issue,{cancelToken})
                    this.data = res_issue.data
                    this.loading = false

                    //获取issue timeline(异步)
                    this.network_getTimeline()

                    //获取issue bodyHTML & projects
                    this.extraData.loading = true
                    let graphql_extraData = graphql.GRAPHQL_ISSUE_BODY_HTML_AND_REACTIONS_AND_PROJECTS({nodeId:res_issue.data.node_id})
                    let res_extraData = await authRequiredGitHubGraphqlApiQuery(graphql_extraData,{cancelToken})
                    this.extraData.data = res_extraData.data.data.node
                    this.projects = res_extraData.data.data.node.projectCards.nodes
                    this.extraData.loading = false

                    //获取issue projects
                  /*   this.projects.loading = true
                    let graphql_projects = graphql.GRAPHQL_ISSUE_PROJECTS({
                        repo: this.repo(),
                        owner: this.owner(),
                        number: this.number
                    })
                    let res_projects = await authRequiredGitHubGraphqlApiQuery(graphql_projects,{cancelToken})
                    this.projects.data = res_projects.data.data.repository.issue.projectCards.nodes
                    this.projects.loading = false */
                    
                    
                }catch(e){
                    this.loading = false
                    this.extraData.loading = false
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
                        if(this.timeline.pageInfo.next.page > this.timeline.pageInfo.last.page - 2) {
                            throw new Error("No data avaliable.")
                        }
                        url_timeline = this.timeline.pageInfo.next.url
                    } else {
                        url_timeline = api.API_ISSUE_TIMELINE({
                            repo: this.repo(),
                            owner: this.owner(),
                            number: this.number
                        }) + `?per_page=${this.timeline.perPage}`
                    }

                    let cancelTokenAndSource = this.cancelAndUpdateAxiosCancelTokenSource(this.name + '_timeline_' + url_timeline)
                    this.cancelTokenArr_timeline = [
                        ...(this.cancelTokenArr_timeline || []),
                        cancelTokenAndSource
                    ]

                    let config = {
                        cancelToken:cancelTokenAndSource.cancelToken,
                        headers:{
                            'Accept': 'application/vnd.github.mockingbird-preview,application/vnd.github.starfox-preview+json'
                        }   
                    }
                    
                    let res_timeline = await authRequiredGet(url_timeline,config)

                    this.timeline.pageInfo = parse(res_timeline.headers.link)

                    //获取末端数据
                    if((!payload.changePage) && this.timeline.pageInfo && this.timeline.pageInfo.last) {
                        let res_issueTimeline_last = await authRequiredGet(this.timeline.pageInfo.last.url,config)
                        let lastData = res_issueTimeline_last.data

                        let pageInfo_atLast = parse(res_issueTimeline_last.headers.link)
                        if(pageInfo_atLast.prev.page > 1) {
                           //获取issue timeline count(异步)
                            this.network_getTimelineCount()
                            let res_issueTimeline_lastButOne = await authRequiredGet(pageInfo_atLast.prev.url,config)
                            lastData = res_issueTimeline_lastButOne.data.concat(lastData)
                        }
                        this.timeline.lastData = lastData
                    }

                    if(payload.changePage) {
                        this.timeline.data = this.timeline.data.concat(res_timeline.data)
                    }else{
                        this.timeline.data = res_timeline.data
                    }

                    this.timeline.loading = false

                    //获取comment bodyHTML 以及 comment reactions
                    this.timeline.commentExtraGraphqlData.loading = true
                       
                    let comments = []
                    this.timeline.data.forEach(item => {
                        if(item.event === 'commented') {
                            comments.push(item)
                        }
                    })
                    this.timeline.lastData.forEach(item => {
                        if(item.event === 'commented') {
                            comments.push(item)
                        }
                    })

                    let graphql_issueCommentBodyAndReactions = graphql.GRAPHQL_ISSUE_COMMENT_BODY_AND_REACTIONS(comments)
                    let res_issueCommentBodyAndReactions = await authRequiredGitHubGraphqlApiQuery(graphql_issueCommentBodyAndReactions,{cancelToken:cancelTokenAndSource.cancelToken})

                    if(!payload.changePage) this.timeline.commentExtraGraphqlData.data = []
                    for(let key in res_issueCommentBodyAndReactions.data.data) {
                        this.timeline.commentExtraGraphqlData.data.push(res_issueCommentBodyAndReactions.data.data[key])
                    }

                    this.timeline.commentExtraGraphqlData.loading = false
                }catch(e){
                    this.timeline.loading = false
                    this.timeline.commentExtraGraphqlData.loading = false
                    console.log(e)
                }
            },
            async network_getTimelineCount() {
                try{
                    this.timeline.count.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.name + '_timeline_count').cancelToken
                    
                    let timelineTypes_graphql = []
                    this.timelineTypes.forEach(item => {
                        timelineTypes_graphql.push(item.graphql)
                    })
                    let graphql_timelineCount = graphql.GRAPHQL_ISSUE_TIMELINE_COUNT(
                            {
                                timelineTypes: timelineTypes_graphql,
                                nodeId: this.data.node_id
                            }
                        )

                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_timelineCount,{cancelToken})

                    let timelineCount = 0

                    for(let key in res.data.data.node) {
                        timelineCount = timelineCount + res.data.data.node[key].totalCount
                    }

                    this.timeline.count.data = timelineCount

                    this.timeline.count.loading = false
                }catch(e){
                    this.timeline.count.loading = false
                    console.log(e)
                }
            },
            mergedTimelineData(timelineData) {
                let mergedTimelineData = []
                let lastOne = {}
                timelineData.forEach(item => {
                    //console.log(lastOne)
                    switch(item.event) {
                        case 'assigned':
                        case 'unassigned':
                            if(lastOne.event === 'assigned' || lastOne.event === 'unassigned') {
                                if(mergedTimelineData[mergedTimelineData.length - 1].event === 'assigned' || mergedTimelineData[mergedTimelineData.length - 1].event === 'unassigned') {
                                    let prev_assignedEvent = mergedTimelineData.pop()
                                    let assignedEvent_merged = {
                                        ...prev_assignedEvent,
                                        event: 'assigned_merged',
                                        assignee_added: [],
                                        assignee_removed: [],
                                    }
                                    mergedTimelineData.push(assignedEvent_merged)
                                    if(prev_assignedEvent.event === 'assigned') {
                                        mergedTimelineData[mergedTimelineData.length - 1].assignee_added.push(prev_assignedEvent.assignee)
                                    }else{
                                        mergedTimelineData[mergedTimelineData.length - 1].assignee_removed.push(prev_assignedEvent.assignee)
                                    }
                                }
                                if(item.event === 'assigned') {
                                    mergedTimelineData[mergedTimelineData.length - 1].assignee_added.push(item.assignee)
                                }else{
                                    mergedTimelineData[mergedTimelineData.length - 1].assignee_removed.push(item.assignee)
                                }
                            }else{
                                mergedTimelineData.push(item)
                            }
                            lastOne = item
                            break
                        case 'milestoned':
                        case 'demilestoned':
                            if(lastOne.event === 'milestoned' || lastOne.event === 'demilestoned') {
                                if(mergedTimelineData[mergedTimelineData.length - 1].event === 'milestoned' || mergedTimelineData[mergedTimelineData.length - 1].event === 'demilestoned') {
                                    let prev_milestonedEvent = mergedTimelineData.pop()
                                    let milestonedEvent_merged = {
                                        ...prev_milestonedEvent,
                                        event: 'milestoned_merged',
                                        milestones: [],
                                    }
                                    mergedTimelineData.push(milestonedEvent_merged)
                                    mergedTimelineData[mergedTimelineData.length - 1].milestones.push(prev_milestonedEvent.milestone)
                                }
                                if(!mergedTimelineData[mergedTimelineData.length - 1].milestones.some(_item => {
                                    return _item.title === item.milestone.title
                                })) {
                                    mergedTimelineData[mergedTimelineData.length - 1].milestones.push(item.milestone)
                                }
                            }else{
                                mergedTimelineData.push(item)
                            }
                            lastOne = item
                            break
                        case 'labeled':
                        case 'unlabeled':
                            if(lastOne.event === 'labeled' || lastOne.event === 'unlabeled') {
                                if(mergedTimelineData[mergedTimelineData.length - 1].event === 'labeled' || mergedTimelineData[mergedTimelineData.length - 1].event === 'unlabeled') {
                                    let prev_labeledEvent = mergedTimelineData.pop()
                                    let labeledEvent_merged = {
                                        ...prev_labeledEvent,
                                        event: 'labeled_merged',
                                        labels_added: [],
                                        labels_removed: [],
                                    }
                                    mergedTimelineData.push(labeledEvent_merged)
                                    if(prev_labeledEvent.event === 'labeled') {
                                        mergedTimelineData[mergedTimelineData.length - 1].labels_added.push(prev_labeledEvent.label)
                                    }else{
                                        mergedTimelineData[mergedTimelineData.length - 1].labels_removed.push(prev_labeledEvent.label)
                                    }
                                }
                                if(item.event === 'labeled') {
                                    mergedTimelineData[mergedTimelineData.length - 1].labels_added.push(item.label)
                                }else{
                                    mergedTimelineData[mergedTimelineData.length - 1].labels_removed.push(item.label)
                                }
                            }else{
                                mergedTimelineData.push(item)
                            }
                            lastOne = item
                            break
                        case 'commented': 
                            if(lastOne.event === 'commented' && lastOne.user.login === item.user.login && lastOne.body === item.body) {
                                mergedTimelineData.push({
                                    id: item.id,
                                    event:'similar_comment',
                                    comments: [item]
                                })
                                lastOne = mergedTimelineData[mergedTimelineData.length - 1]
                            }else if(lastOne.event === 'similar_comment' && lastOne.comments[0].user.login === item.user.login && lastOne.comments[0].body === item.body){
                                mergedTimelineData[mergedTimelineData.length - 1].comments.push(item)
                                lastOne = mergedTimelineData[mergedTimelineData.length - 1]
                            }else{
                                mergedTimelineData.push(item)
                                lastOne = item
                            }
                            break
                        default:
                            mergedTimelineData.push(item)
                            lastOne = item
                    }
                })
                return mergedTimelineData
            },
        },
       
        components: {
            CommonLoading,
            Label,
            Comment,
            TimelineItem,
            HiddenItemLoading,
            LoadingIconEx,
            ImgWrapper,
            AnimatedHeightWrapper,
            Editor,
            Progress,
            IssueIcon,
            ProjectCard,
            Container: styled.div``,
            Header: styled.div``,
            HeaderActions: styled.div``,
            HeaderTitle: styled.h1``,
            HeaderMeta: styled.div``,
            State: styled.div``,
            MetaContent: styled.div``,
            Info: styled.div``,
            Labels: styled.div``,
            LoadingTimeline: styled.div``,
            InfoBottom: styled.div``,
            InfoBottomItem: styled.div``,
            InfoBottomItemTitle: styled.div``,
            StickyTop: styled.div``,
            StickyTopContent: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/labels/index.scss';
@import 'node_modules/@primer/css/layout/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
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

.info-bottom-item:first-child{
     margin-top: 0px;
    border-top: 0px;
}

.info-bottom-item{
    padding-top: 16px;
    font-size: 12px;
    color: #586069;
    margin-top: 16px;
    border-top: 1px solid #e1e4e8;
    .info-bottom-item-title{
        margin-bottom: 8px;
        font-size: 12px;
        color: #586069;
        font-weight: 600!important;
        svg{
            float: right;
            color: #959da5;
            margin-top: 2px;
        }
        
    }

    .assignee-login{
            max-width: 110px;
            display: inline-block;
            vertical-align: top;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: 600;
            color: #24292e;
            font-size: 12px;
        }
    
}

.sticky-top{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 109;
    display: block;
    background-color: #fff;
    border-bottom: 1px solid rgba(0,0,0,.15);
}
</style>