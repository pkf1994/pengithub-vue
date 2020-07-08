<template>
    <Container class="flex-grow-1">
            <Header  class="px-3 pt-3">
                <HeaderActions class="d-flex flex-justify-between flex-items-center">
                   <State class="State State--green mr-2 d-inline-flex flex-items-center" 
                        :class="{'State--green':pullRequestProvided().state === 'open','State--red':pullRequestProvided().state === 'closed'}" 
                        style="text-transform:capitalize;border-radius:2em;padding: 5px 12px;min-width: 70px">
                        <IssueIcon color="#fff" :issue="pullRequestProvided()"></IssueIcon>
                        &nbsp;{{pullRequestProvided().state}}
                    </State>   

                    <a href="javascript:return false">Jump to bottom</a>
                </HeaderActions>

                <Skeleton v-if="!pullRequestProvided().title">
                    <SkeletonRectangle :height="18" style="width:100%;" class="mt-3"></SkeletonRectangle>
                    <SkeletonRectangle :height="18" style="width:60%;margin-top:12px"></SkeletonRectangle>
                    <div  class="d-flex flex-items-center" style="margin-top:12px">
                        <SkeletonRectangle :height="14" :width="12" class="mr-2"></SkeletonRectangle> 
                        <SkeletonRectangle :height="14" style="width:40%"></SkeletonRectangle>
                    </div> 
                    <div class="d-flex flex-items-center mt-3 pb-3 border-bottom">
                        <SkeletonCircle :diameter="32" class="mr-2"></SkeletonCircle>
                        <SkeletonRectangle :height="14" class="flex-grow-1"></SkeletonRectangle>
                    </div>
                    <SkeletonRectangle :height="16" class="ml-6 mt-3"></SkeletonRectangle>
                    <SkeletonRectangle :height="16" class="mt-3"></SkeletonRectangle>
                    <SkeletonRectangle :height="16" class="mr-6 mt-3"></SkeletonRectangle>
                </Skeleton>

                <div v-else>
                    <HeaderTitle class="title" style="font-weight: bold; margin-top:10px">
                        {{pullRequestProvided().title}}
                        <span class="text-normal text-gray">#{{pullRequestProvided().number}}</span>
                    </HeaderTitle>

                    <Branch class="branch">
                        <span class="inner">
                            <svg class="octicon octicon-git-branch" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 5c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v.3c-.02.52-.23.98-.63 1.38-.4.4-.86.61-1.38.63-.83.02-1.48.16-2 .45V4.72a1.993 1.993 0 00-1-3.72C.88 1 0 1.89 0 3a2 2 0 001 1.72v6.56c-.59.35-1 .99-1 1.72 0 1.11.89 2 2 2 1.11 0 2-.89 2-2 0-.53-.2-1-.53-1.36.09-.06.48-.41.59-.47.25-.11.56-.17.94-.17 1.05-.05 1.95-.45 2.75-1.25S8.95 7.77 9 6.73h-.02C9.59 6.37 10 5.73 10 5zM2 1.8c.66 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm0 12.41c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm6-8c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                            {{pullRequestProvided().head && pullRequestProvided().head.label}}
                        </span>    
                    </Branch>

                    <AuthorAndLastEdit class="author-and-last-edit d-flex">
                        <div class="flex-auto">
                            <div class="avatar-parent-child float-left">
                                <ImgWrapper>
                                    <img class="avatar" :src="pullRequestProvided().user && pullRequestProvided().user.avatar_url" width="32" height="32" :alt="`@${pullRequestProvided().user && pullRequestProvided().user.login}`">
                                </ImgWrapper>
                            </div>

                            <div style="margin-left:42px;">
                                <router-link :to="`/${pullRequestProvided().user && pullRequestProvided().user.login}`">
                                    <strong>{{pullRequestProvided().user && pullRequestProvided().user.login}}</strong>
                                </router-link>  
                                {{editHistory}}
                            </div>
                        </div> 

                        <!-- <div class="ml-2">
                            <svg class="octicon octicon-kebab-horizontal" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
                        </div>   -->
                    </AuthorAndLastEdit>
                </div> 

                

            </Header>
        

        <Info  class="pt-3 px-3 bg-white " 
                v-if="pullRequestProvided().labels && pullRequestProvided().labels.length !== 0"
                >
            <!-- label --> 
            <AnimatedHeightWrapper class=" border-bottom">
                <div class="pb-3" v-if="pullRequestProvided().labels && pullRequestProvided().labels.length !== 0">
                    <div class="my-1 f6">Labels</div>    
                    <router-link to="/" v-for="item in pullRequestProvided().labels" :key="item.name">
                        <Label  class="mr-1 mt-1"
                                :style="{height:'18px',fontSize:'10px'}"
                                :name="item.name"
                                :color="`#${item.color}`"></Label> 
                    </router-link>
                </div> 
            </AnimatedHeightWrapper>
        </Info>

        <PullRequestBody   :data="pullRequestProvided()"
                    class="bg-white "
                    v-if="pullRequestProvided().user" 
                    :headerStyle="{display: 'none'}"
                    :extraData="data" 
                    :loading="loading"/>

        <transition-group tag="div" appear name="fade-group">
            <div v-for="(item,index) in timeline.data" :key="(item.id || '') + index">
                <TimelineItem :data="item" class="border-top"/>
            </div> 
        </transition-group>

        <AnimatedHeightWrapper :stretch="timeline.loading && (timeline.data.length === 0)">
            <LoadingTimeline class="loading-timeline d-flex flex-items-center flex-justify-center">
                <LoadingIconEx/>
            </LoadingTimeline> 
        </AnimatedHeightWrapper>   

        <HiddenItemLoading v-if="(timeline.pageInfo) && (timeline.pageInfo.next) && (timeline.pageInfo.next.page < timeline.pageInfo.last.page - 1) && (timeline.data.length !== 0)"
                            class="border-top"
                            :loading="timeline.loading"
                            :dataGetter="loadingMore">
            {{hiddenItemCount}} item{{hiddenItemCount > 1 ? 's' : ''}} not shown.
        </HiddenItemLoading>

        <transition-group tag="div" appear name="fade-group">
            <div v-for="(item,index) in timeline.lastData" :key="(item.id || '') + index">
                <TimelineItem :data="item" class="border-top"/>
            </div> 
        </transition-group>

        <Header class="header" v-if="data.id">
            Comment on pull request
        </Header>
        <Editor v-if="data.id" 
                ref="editor"
                class="m-3"
                :lockedReason="pullRequestProvided().activeLockReason"
                :locked="pullRequestProvided().locked && !pullRequestProvided().viewerCanUpdate">
            <button class="btn btn-mobile" v-if="data.viewerCanUpdate">
                <svg class="octicon octicon-issue-closed text-red v-align-text-bottom" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 10h2v2H7v-2zm2-6H7v5h2V4zm1.5 1.5l-1 1L12 9l4-4.5-1-1L12 7l-1.5-1.5zM8 13.7A5.71 5.71 0 012.3 8c0-3.14 2.56-5.7 5.7-5.7 1.83 0 3.45.88 4.5 2.2l.92-.92A6.947 6.947 0 008 1C4.14 1 1 4.14 1 8s3.14 7 7 7 7-3.14 7-7l-1.52 1.52c-.66 2.41-2.86 4.19-5.48 4.19v-.01z"></path></svg>
                <span>Close pull request</span>
            </button>
            <button class="btn  btn-primary btn-mobile ml-1" :disabled="!$refs.editor || $refs.editor.commentTextValue === ''">
                <span>Comment</span>
            </button>
        </Editor>

        <Header class="header"  v-if="data.viewerSubscription">
            Notifications for this thread
        </Header>

        <Subscription class="p-3 bg-white" v-if="data.viewerSubscription" :viewerSubscription="data.viewerSubscription"></Subscription>

        <transition name="fade" appear>
            <CommonLoading v-if="!pullRequestProvided().node_id || timeline.loading || timeline.extraData.loading || reviewCommentReplies.loading"
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
    import {CommonLoading,Label,AnimatedHeightWrapper,ImgWrapper,LoadingIconEx,Progress,IssueIcon,Subscription,SkeletonCircle,SkeletonRectangle} from '@/components'
    import {ScrollTopListenerMixin,RouteUpdateAwareMixin} from '@/mixins'
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
        inject: ['owner','repo','number','pullRequestProvided'],
        mixins: [ScrollTopListenerMixin,RouteUpdateAwareMixin],
        provide() {
            return {
                timelineExtraDataProvided: () => this.timeline.extraData.data,
                reviewCommentReplies: () => this.reviewCommentReplies.data,
                pullRequestProvided: () => Object.assign({},this.data,this.pullRequestProvided())
            }
        },
        data() {
            return {
                data: {},
                loading: false,
                reviewCommentReplies: {
                    data: [],
                    loading: false
                },
                timeline: {
                    data: [],
                    loading: false,
                    extraData: {
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
            createdAt() {
                let dateStr = util_dateFormat.getDateDiffOrDateFormatDependOnGap('on dd zzz yyyy', new Date(this.pullRequestProvided().created_at), 1000 * 60 * 60 * 24 * 365)
                return dateStr
            },
            updatedAt() {
                return util_dateFormat.dateFormat('dd zzz yyyy', new Date(this.pullRequestProvided().updated_at))
            },
            viewerCannotComment() {
                return this.pullRequestProvided().locked && !this.data.viewerCanUpdate
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
                return `opened this pull request ${this.createdAt} ${this.data.userContentEdits && this.data.userContentEdits.totalCount > 0 ? ' • edited ' + util_dateFormat.getDateDiff(this.data.userContentEdits.nodes[0].editedAt) : ''}`
            },

            /* subscriptionNotice() {
                return this.viewerSubscription.toLowerCase()
            } */
        },
        async created() {
            this.network_getData()

           /*  let url = "https://api.github.com/repos/pkf1994/pengblog-react/pulls/1/comments"

            let res = await authRequiredGet(url)
            console.log(res.data) */
            
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
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    this.cancelSources.push(sourceAndCancelToken.source)

                     //获取bodyHTML以及其他来自graphql的数据
                    this.loading = true
                    let graphql_bodyHTML = graphql.GRAPHQL_PR_BODY_HTML_AND_REACTIONS({
                        repo: this.repo(),
                        owner: this.owner(),
                        number: this.number(),
                    })
                    let res_bodyHTML = await authRequiredGitHubGraphqlApiQuery(graphql_bodyHTML,{cancelToken:sourceAndCancelToken.cancelToken})

                    try{
                        this.data = res_bodyHTML.data.data.repository.pullRequest
                    }catch(e) {
                        this.handleGraphqlError(res_bodyHTML)
                    }
                    

                    //获取timeline(异步)
                    this.network_getTimeline()

                    //获取review comment replies
                    this.network_getReviewCommentReplies()

                }catch(e){
                    this.handleError()
                }finally{
                    this.loading = false
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
                            number: this.number()
                        }) + `?per_page=${this.timeline.perPage}`
                    }

                    let cancelTokenAndSource = cancelAndUpdateAxiosCancelTokenSource(this.$options.name + '_timeline_' + url_timeline)
                    this.cancelSources.push(cancelTokenAndSource.source)

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
                    this.timeline.extraData.loading = true
                       
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

                    if(!payload.changePage) this.timeline.extraData.data = []
                    let dataHolder
                    try{
                        dataHolder = res_commentsAndReviewExtraData.data.data
                    }catch(e) {
                        this.handleGraphqlError(res_commentsAndReviewExtraData)
                    }
                    for(let key in res_commentsAndReviewExtraData.data.data) {
                        this.timeline.extraData.data.push(res_commentsAndReviewExtraData.data.data[key])
                    }
                }catch(e){
                    this.handleError(e)
                }finally{
                    this.timeline.loading = false
                    this.timeline.extraData.loading = false
                }
            },
            async network_getTimelineCount() {
                try{
                    this.timeline.count.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name + '_timeline_count')
                    this.cancelSources.push(sourceAndCancelToken.source)
                    
                    let timelineTypes_graphql = []
                    this.timelineTypes.forEach(item => {
                        timelineTypes_graphql.push(item.graphql)
                    })
                    let graphql_timelineCount = graphql.GRAPHQL_PR_TIMELINE_COUNT(
                            {
                                timelineTypes: timelineTypes_graphql,
                                nodeId: this.pullRequestProvided().node_id
                            }
                        )

                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_timelineCount,{cancelToken:sourceAndCancelToken.cancelToken})

                    let dataHolder
                    try{
                        dataHolder = res.data.data.node
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }

                    let timelineCount = 0

                    for(let key in dataHolder) {
                        timelineCount = timelineCount + dataHolder[key].totalCount
                    }

                    this.timeline.count.data = timelineCount

                }catch(e){
                    console.log(e)
                }finally{
                    this.timeline.count.loading = false
                }
            },
            //此处无法获取state为pending的review comment reply, 即使viewer为该review comment reply的author, 该数据可以在review组件中通过graphql api获取
            async network_getReviewCommentReplies() {
                try{
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_review_comment_replies')
                    this.cancelSources.push(sourceAndCancelToken.source)

                    this.reviewCommentReplies.loading = true
                    let url_reviewComment = api.API_PULL_REQUEST_REVIEW_COMMENT({
                        repo: this.repo(),
                        owner: this.owner(),
                        number: this.number(),
                        perPage: 100
                    })
                    let res_pullRequest = await authRequiredGet(url_reviewComment,{cancelToken:sourceAndCancelToken.cancelToken})

                    let replies = []
                    res_pullRequest.data.forEach(item => {
                        if(item.in_reply_to_id) replies.push(item)
                    })
                    this.reviewCommentReplies.data = replies
                }catch(e){
                    console.log(e)
                }finally{
                    this.reviewCommentReplies.loading = false
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
            routeUpdateHook() {
                this.network_getData()
            },
            routeResetHook() {
                Object.assign(this.$data, this.$options.data())
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
            Subscription,
            ImgWrapper,
            Progress,
            PullRequestBody,
            IssueIcon,
            SkeletonCircle,
            SkeletonRectangle,
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
            Skeleton: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/labels/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
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

.header{
    padding: 25px 15px 7.5px;
    font-size: 12px;
    font-weight: 600;
    color: #586069;
    background-color: #f6f8fa;
    border-top: 1px solid #dfe2e5;
    border-bottom: 1px solid #dfe2e5;
}
</style>