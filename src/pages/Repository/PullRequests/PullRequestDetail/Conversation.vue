<template>
    <Container class="pt-3 flex-grow-1">
        <AnimatedHeightWrapper>
            <Header v-if="data.id" class="px-3 bg-white ">
                <HeaderActions class="flex flex-justify-between flex-items-center">
                   <State class="State State--green mr-2 d-inline-flex flex-items-center" :class="{'State--green':data.state === 'open','State--red':data.state === 'closed'}" style="text-transform:capitalize;">
                        <IssueIcon color="#fff" :issue="data"></IssueIcon>
                        &nbsp;{{data.state}}
                    </State>   

                    <a href="javascript:return false">Jump to bottom</a>
                </HeaderActions>

                <HeaderTitle class="title" style="font-weight: bold; margin-top:10px">
                    {{data.title}}
                    <span class="text-normal text-gray">#{{data.number}}</span>
                </HeaderTitle>

                <Branch class="branch">
                    <span class="inner">
                        <svg class="octicon octicon-git-branch" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 5c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v.3c-.02.52-.23.98-.63 1.38-.4.4-.86.61-1.38.63-.83.02-1.48.16-2 .45V4.72a1.993 1.993 0 00-1-3.72C.88 1 0 1.89 0 3a2 2 0 001 1.72v6.56c-.59.35-1 .99-1 1.72 0 1.11.89 2 2 2 1.11 0 2-.89 2-2 0-.53-.2-1-.53-1.36.09-.06.48-.41.59-.47.25-.11.56-.17.94-.17 1.05-.05 1.95-.45 2.75-1.25S8.95 7.77 9 6.73h-.02C9.59 6.37 10 5.73 10 5zM2 1.8c.66 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm0 12.41c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm6-8c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                        {{data.head && data.head.label}}
                    </span>    
                </Branch>

                <AuthorAndLastEdit class="author-and-last-edit d-flex">
                    <div class="flex-auto">
                        <div class="avatar-parent-child float-left">
                            <img class="avatar" :src="data.user && data.user.avatar_url" width="32" height="32" :alt="`@${data.user && data.user.login}`">
                        </div>

                        <div style="margin-left:42px;">
                            <router-link :to="`/${data.user && data.user.login}`">
                                <strong>{{data.user && data.user.login}}</strong>
                            </router-link>  
                            {{editHistory}}
                        </div>
                    </div> 

                    <div class="ml-2">
                        <svg class="octicon octicon-kebab-horizontal" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
                    </div>  
                </AuthorAndLastEdit>

            </Header>
        </AnimatedHeightWrapper>
        

        <Info  class="pt-3 px-3 bg-white " 
                v-if="data.labels && data.labels.length !== 0"
                >
            <!-- label --> 
            <AnimatedHeightWrapper class=" border-bottom">
                <div class="pb-3" v-if="data.labels && data.labels.length !== 0">
                    <div class="my-1 f6">Labels</div>    
                    <router-link to="/" v-for="item in data.labels" :key="item.name">
                        <Label  class="mr-1 mt-1"
                                :style="{height:'18px',fontSize:'10px'}"
                                :name="item.name"
                                :color="`#${item.color}`"></Label> 
                    </router-link>
                </div> 
            </AnimatedHeightWrapper>
        </Info>

        <PullRequestBody   :data="data"
                    class="bg-white "
                    v-if="data.user" 
                    :headerStyle="{display: 'none'}"
                    :extraData="extraData.data" 
                    :loading="extraData.loading"/>

        <transition-group tag="div" appear name="fade">
            <div v-for="(item,index) in timeline.data" :key="(item.id || '') + index">
                <TimelineItem :data="item" class="border-top"/>
            </div> 
        </transition-group>

        <AnimatedHeightWrapper :stretch="timeline.loading && (timeline.data.length === 0)">
            <LoadingTimeline class="loading-timeline flex flex-items-center flex-justify-center">
                <LoadingIconEx/>
            </LoadingTimeline> 
        </AnimatedHeightWrapper>   

        <HiddenItemLoading v-if="(timeline.pageInfo) && (timeline.pageInfo.next) && (timeline.pageInfo.next.page < timeline.pageInfo.last.page - 1) && (timeline.data.length !== 0)"
                            class="border-top"
                            :loading="timeline.loading"
                            :dataGetter="loadingMore">
            {{hiddenItemCount}} item{{hiddenItemCount > 1 ? 's' : ''}} not shown.
        </HiddenItemLoading>

        <transition-group tag="div" appear name="fade">
                <div v-for="(item,index) in timeline.lastData" :key="(item.id || '') + index">
                    <TimelineItem :data="item" class="border-top"/>
                </div> 
        </transition-group>

        <Editor v-if="data.id" class="pt-3 mb-5" :locked="viewerCannotComment" :lockedReason="extraData.data.activeLockReason"></Editor>


        <InfoBottom v-if="data.id">
        
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

        </InfoBottom>

        <transition name="fade" appear>
            <CommonLoading v-if="loading || timeline.loading || timeline.commentsAndReviewsExtraGraphqlData.loading"
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
    import {CommonLoading,Label,AnimatedHeightWrapper,LoadingIconEx,Progress,IssueIcon} from '@/components'
    import {ScrollTopListenerMixin} from '@/mixins'
    import {TimelineItem,Comment,HiddenItemLoading,Editor,ProjectCard,PullRequestBody} from './components'
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
        name: 'pullRequestDetail',
        inject: ['owner','repo'],
        mixins: [ScrollTopListenerMixin],
        provide() {
            return {
                commentsAndReviewsExtraGraphqlDataGetter: () => this.timeline.commentsAndReviewsExtraGraphqlData.data,
                issueGetter: () => this.data
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
                    commentsAndReviewsExtraGraphqlData: {
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
                    },
                    {
                        graphql:'PULL_REQUEST_REVIEW',
                        rest:'reviewed',
                    }
                ]
            }
        },
       
        computed: {
           
            number() {
                return this.$route.params.number
            },
            createdAt() {
                let dateStr = util_dateFormat.getDateDiffOrDateFormatDependOnGap('on dd zzz yyyy', new Date(this.data.created_at), 1000 * 60 * 60 * 24 * 365)
                return dateStr
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
            editHistory() {
                return `opened this pull request ${this.createdAt} ${this.extraData.data.userContentEdits && this.extraData.data.userContentEdits.totalCount > 0 ? ' • edited ' + util_dateFormat.getDateDiff(this.extraData.data.userContentEdits.nodes[0].editedAt) : ''}`
            }
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
                    let cancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name).cancelToken

                    //获取基本数据
                    this.loading = true
                    let url_pullRequest = api.API_PULLREQUEST({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number
                    })
                    let res_pullRequest = await authRequiredGet(url_pullRequest,{cancelToken})
                    this.data = res_pullRequest.data
                    this.loading = false

                    //获取timeline(异步)
                    this.network_getTimeline()
                    

                    //获取bodyHTML
                    this.extraData.loading = true
                    let graphql_extraData = graphql.GRAPHQL_PR_BODY_HTML_AND_REACTIONS({nodeId:res_pullRequest.data.node_id})
                    let res_extraData = await authRequiredGitHubGraphqlApiQuery(graphql_extraData,{cancelToken})
                    this.extraData.data = res_extraData.data.data.node
                    this.extraData.loading = false

                    //获取issue projects
                  /*   this.projects.loading = true
                    let graphql_projects = graphql.GRAPHQL_PR_PROJECTS({
                        repo: this.repo,
                        owner: this.owner,
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
                            repo: this.repo,
                            owner: this.owner,
                            number: this.number
                        }) + `?per_page=${this.timeline.perPage}`
                    }

                    let cancelTokenAndSource = cancelAndUpdateAxiosCancelTokenSource(this.name + '_timeline_' + url_timeline)
                    this.cancelTokenArr_timeline = [
                        ...(this.cancelTokenArr_timeline || []),
                        cancelTokenAndSource.cancelToken
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
                    //获取 review: bodyHTML reactions comments
                    this.timeline.commentsAndReviewsExtraGraphqlData.loading = true
                       
                    let commentsAndReviews = []
                    this.timeline.data.forEach(item => {
                        if(item.event === 'commented' || item.event === 'reviewed') {
                            commentsAndReviews.push(item)
                        }
                    })
                    this.timeline.lastData.forEach(item => {
                        if(item.event === 'commented' || item.event === 'reviewed') {
                            commentsAndReviews.push(item)
                        }
                    })

                    let graphql_commentsAndReviewExtraData = graphql.GRAPHQL_PR_COMMENT_AND_REVIEW_EXTRA_DATA(commentsAndReviews)
                    let res_commentsAndReviewExtraData = await authRequiredGitHubGraphqlApiQuery(graphql_commentsAndReviewExtraData,{cancelToken:cancelTokenAndSource.cancelToken})

                    if(!payload.changePage) this.timeline.commentsAndReviewsExtraGraphqlData.data = []
                    for(let key in res_commentsAndReviewExtraData.data.data) {
                        this.timeline.commentsAndReviewsExtraGraphqlData.data.push(res_commentsAndReviewExtraData.data.data[key])
                    }

                    this.timeline.commentsAndReviewsExtraGraphqlData.loading = false
                }catch(e){
                    this.timeline.loading = false
                    this.timeline.commentsAndReviewsExtraGraphqlData.loading = false
                    console.log(e)
                }
            },
            async network_getTimelineCount() {
                try{
                    this.timeline.count.loading = true
                    let cancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name + '_timeline_count').cancelToken
                    
                    let timelineTypes_graphql = []
                    this.timelineTypes.forEach(item => {
                        timelineTypes_graphql.push(item.graphql)
                    })
                    let graphql_timelineCount = graphql.GRAPHQL_PR_TIMELINE_COUNT(
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
            cancelNetwork() {
                this.cancelTokenArr_timeline.forEach(item => {
                    item.source.cancel()
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
            Editor,
            Progress,
            PullRequestBody,
            IssueIcon,
            Container: styled.div``,
            Header: styled.div``,
            HeaderActions: styled.div``,
            HeaderTitle: styled.h1``,
            Branch: styled.div``,
            AuthorAndLastEdit: styled.div``,
            State: styled.div``,
            Info: styled.div``,
            Labels: styled.div``,
            LoadingTimeline: styled.div``,
            InfoBottom: styled.div``,
            InfoBottomItem: styled.div``,
            InfoBottomItemTitle: styled.div``,
            StickyTop: styled.div``,
            StickyTopContent: styled.div``,
            Body: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
.title{
    margin-bottom: 0;
    font-size: 16px;
    word-wrap: break-word;
}

.branch{
    padding: 7.5px 0;
    margin: 0;
    font-size: 12px;
    color: #959da5;
    cursor: pointer;
    .inner{
        position: relative;
        display: inline-block;
        padding-left: 20px;
        font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
        color: #586069;
    }
    svg{
        position: absolute;
        top: 0;
        left: 0;
        width: 16px;
        text-align: left;
    }
}

.author-and-last-edit{
    padding: 10px 0 15px;
    position: relative;
    font-size: 12px;
    line-height: 16px;
    color: #586069;
    background-color: #fff;
    border-bottom: 1px solid #e1e4e8;
    a{
        font-weight: 600;
        color: #444d56;
    }
}

.body{
    background: #fff;
    border-bottom: 1px solid #dfe2e5;
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