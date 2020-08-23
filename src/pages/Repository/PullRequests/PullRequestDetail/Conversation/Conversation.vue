<template>
    <Container class="flex-grow-1">
            <Header  class="px-3 pt-3">
               <!--  <HeaderActions class="d-flex flex-justify-between flex-items-center">
                   <State class="State mr-2 d-inline-flex flex-items-center" 
                        :class="{'State--green':pullRequestProvided().data.state === 'open' && !pullRequestProvided().data.draft || !pullRequestProvided().data.node_id,'State--red':pullRequestProvided().data.state === 'closed'}" 
                        style="text-transform:capitalize;border-radius:2em;padding: 5px 12px;min-width: 70px">
                        <IssueIcon color="#fff" :issue="pullRequestProvided().data"></IssueIcon>
                        &nbsp;{{pullRequestProvided().data.draft ? 'Draft' : pullRequestProvided().data.state}}
                    </State>   

                    <a href="javascript:return false" @click="scrollToBottom">Jump to bottom</a>
                </HeaderActions>
 -->
                <Skeleton v-if="!pullRequestProvided().data.title">
                    <div class="d-flex flex-items-center mt-3 pb-3 border-bottom">
                        <SkeletonCircle :diameter="32" class="mr-2"></SkeletonCircle>
                        <SkeletonRectangle :height="14" class="flex-grow-1"></SkeletonRectangle>
                    </div>
                    <SkeletonRectangle :height="16" class="ml-6 mt-3"></SkeletonRectangle>
                    <SkeletonRectangle :height="16" class="mt-3"></SkeletonRectangle>
                    <SkeletonRectangle :height="16" class="mr-6 my-3"></SkeletonRectangle>
                </Skeleton>

                <div v-else>
                    <!-- <HeaderTitle class="title" style="font-weight: bold; margin-top:10px">
                        {{pullRequestProvided().data.title}}
                        <span class="text-normal text-gray">#{{pullRequestProvided().data.number}}</span>
                    </HeaderTitle>

                    <Branch class="branch">
                        <span class="inner">
                            <svg class="octicon octicon-git-branch" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 5c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v.3c-.02.52-.23.98-.63 1.38-.4.4-.86.61-1.38.63-.83.02-1.48.16-2 .45V4.72a1.993 1.993 0 00-1-3.72C.88 1 0 1.89 0 3a2 2 0 001 1.72v6.56c-.59.35-1 .99-1 1.72 0 1.11.89 2 2 2 1.11 0 2-.89 2-2 0-.53-.2-1-.53-1.36.09-.06.48-.41.59-.47.25-.11.56-.17.94-.17 1.05-.05 1.95-.45 2.75-1.25S8.95 7.77 9 6.73h-.02C9.59 6.37 10 5.73 10 5zM2 1.8c.66 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm0 12.41c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm6-8c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                            {{pullRequestProvided().data.head && pullRequestProvided().data.head.label}}
                        </span>    
                    </Branch> -->

                    <AuthorAndLastEdit class="author-and-last-edit d-flex">
                        <div class="flex-auto">
                            <div class="avatar-parent-child float-left">
                                <ImgWrapper>
                                    <img class="avatar" :src="pullRequestProvided().data.user && pullRequestProvided().data.user.avatar_url" width="32" height="32" :alt="`@${pullRequestProvided().data.user && pullRequestProvided().data.user.login}`">
                                </ImgWrapper>
                            </div>

                            <div style="margin-left:42px;">
                                <router-link :to="`/${pullRequestProvided().data.user && pullRequestProvided().data.user.login}`">
                                    <strong>{{pullRequestProvided().data.user && pullRequestProvided().data.user.login}}</strong>
                                </router-link>  
                                opened this pull request
                                <br>
                                {{pullRequestProvided().data.created_at | getDateDiff}}
                            </div>
                        </div> 

                    </AuthorAndLastEdit>
                </div> 

            </Header>
        
        <div v-if="pullRequestProvided().data.node_id">

            <Info  class="pt-3 px-3 bg-white " 
                v-if="pullRequestProvided().data.labels && pullRequestProvided().data.labels.length !== 0"
                    >
                <!-- label --> 
                <div class="pb-3" v-if="pullRequestProvided().data.labels && pullRequestProvided().data.labels.length !== 0">
                    <div class="my-1 f6">Labels</div>    
                    <router-link to="/" v-for="item in pullRequestProvided().data.labels" :key="item.name">
                        <Label  class="mr-1 mt-1"
                                :style="{height:'18px',fontSize:'10px'}"
                                :name="item.name"
                                :color="`#${item.color}`"></Label> 
                    </router-link>
                </div> 
            </Info>

            <PullRequestBody   
                        :extraData="extraData.data"
                        class="bg-white" />

            <transition-group tag="div" appear name="fade-group">
                <div v-for="(item,index) in timeline.data" :key="(item.id || '') + index">
                    <TimelineItem :data="item" class="border-top" style="background:#fafbfc"/>
                </div> 
            </transition-group>

            <HiddenItemLoading v-if="(timeline.pageInfo.next && timeline.pageInfo.next.page != timeline.pageInfo.last.page) || timeline.loading"
                                class="border-top"
                                :loading="timeline.loading"
                                :dataGetter="loadingMore">
                <span v-if="timelineRemainedCount > 0">{{timelineRemainedCount}} {{timelineRemainedCount > 1 ? 'items' : 'item'}} remained.</span>    
            </HiddenItemLoading>

             <transition-group tag="div" appear name="fade-group">
                <div v-for="(item,index) in timeline.newestTimeline.data" :key="(item.id || '') + index">
                    <TimelineItem :data="item" class="border-top" style="background:#fafbfc"/>
                </div> 
            </transition-group>


            <MergePull v-if="extraData.data.viewerCanUpdate && pullRequestProvided().data.merged == false" >
                <Header class="header" v-if="extraData.data.id">
                    Merge this pull request
                </Header>
                <div v-if="pullRequestProvided().data.mergeable_state == 'clean'" class="branch-action branch-action-with-icon">
                    <svg class="octicon octicon-check branch-action-icon text-green" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                    <h3 class="branch-action-heading">This branch has no conflicts with the base branch.</h3>
                        Merging can be performed automatically.
                </div>
                <div v-else-if="pullRequestProvided().data.mergeable_state == 'dirty'" class="branch-action branch-action-with-icon">
                    <svg class="octicon octicon-x branch-action-icon" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>
                    <h3 class="branch-action-heading">This branch has conflicts that must be resolved.</h3>
                    Use the command line to resolve conflicts before continuing.
                </div>
                <div class="p-3 branch-action">
                    <button :disabled="!pullRequestProvided().data.mergeable_state == 'clean' || !pullRequestProvided().data.mergeable" class="btn btn-block js-mergeable-state-check">
                        <svg class="octicon octicon-git-merge" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M5 3.254V3.25v.005a.75.75 0 110-.005v.004zm.45 1.9a2.25 2.25 0 10-1.95.218v5.256a2.25 2.25 0 101.5 0V7.123A5.735 5.735 0 009.25 9h1.378a2.251 2.251 0 100-1.5H9.25a4.25 4.25 0 01-3.8-2.346zM12.75 9a.75.75 0 100-1.5.75.75 0 000 1.5zm-8.5 4.5a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
                        <span class="mergeable-state-loading"></span>
                        <span>Merge pull request</span>
                    </button>
                </div> 
            </MergePull>

            <div>
                <Header class="header">
                    Comment on pull request
                </Header>
                <PullRequestCommentCreator 
                        @create-comment-success="createCommentHandler"
                        class="m-3">
                </PullRequestCommentCreator>
            </div>

            <div v-if="extraData.data.viewerSubscription">
                <Header class="header" >
                    Notifications for this thread
                </Header>

                <IssueNotificationSettingPane class="p-3" :viewerSubscriptionInfo="extraData.data"></IssueNotificationSettingPane>
            </div> 

            <LockIssueButton 
                class="p-3 border-top"
                v-if="extraData.data.viewerCanUpdate" 
                :issue="pullRequestProvided().data" 
                @change-lock-status-success="changeLockStatusSuccessPostHandler"></LockIssueButton>

        </div>

        <transition name="fade" appear>
            <CommonLoading v-if="!pullRequestProvided().data.node_id || timeline.loading || timeline.extraData.loading || reviewCommentReplies.loading"
                            :preventClickEvent="false"
                            :position="loading ? 'center' : 'corner'"/>
        </transition>  

        <transition name="fade" appear>
            <StickyTop v-if="scrollTop > 300" class="sticky-top px-3 py-2">
                <StickyTopContent class="d-flex flex-items-center flex-justify-between">
                    <State class="State mr-2 d-inline-flex flex-items-center flex-shrink-0" :class="{'State--green':pullRequestProvided().data.state === 'open','State--red':pullRequestProvided().data.state === 'closed'}" style="text-transform:capitalize; border-radius:2em">
                        <IssueIcon color="#fff" :issue="pullRequestProvided().data" class="mr-1"></IssueIcon>
                        <span style="line-height:auto">
                            {{pullRequestProvided().data.state}}
                        </span>    
                    </State>   

                    <div class="min-width-0">
                        <h1 class="d-flex text-bold f5">
                            <router-link to="/" class="css-truncate css-truncate-target link-gray-dark width-fit">
                                {{pullRequestProvided().data.title}}
                            </router-link>
                            <span class="text-gray-light pl-1 no-wrap text-normal">#{{pullRequestProvided().data.number}}</span>
                        </h1>
                        <div class="meta text-gray-light css-truncate css-truncate-target d-block width-fit f6">
                            <router-link to="/" class="text-bold link-gray">{{pullRequestProvided().data.user && pullRequestProvided().data.user.login}}</router-link>  opened this pull request
                            <span class="no-wrap">{{createdAt}}</span>
                            · {{pullRequestProvided().data.comments}} {{pullRequestProvided().data.comments > 1 ? 'comments' : 'comment'}}
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
    import {TimelineItem,Comment,HiddenItemLoading,PullRequestCommentCreator,ProjectCard,PullRequestBody} from './components'
    import {IssueNotificationSettingPane,LockIssueButton} from '../../../components'
    import {util_dateFormat} from '@/util'
    import {
        authRequiredGet,
        authRequiredGitHubGraphqlApiQuery} from '@/network'
    import * as api from '@/network/api'
    import * as graphql from '../graphql'
    import {mapState,mapActions} from 'vuex'
    var parse = require('parse-link-header');
    var parse = require('parse-link-header');
    export default {
        name: 'pullRequest_detail_conversation',
        inject: ['pullRequestProvided'],
        mixins: [ScrollTopListenerMixin,RouteUpdateAwareMixin],
        provide() {
            return {
                timelineExtraDataProvided: () => this.timeline.extraData.data,
                reviewCommentReplies: () => this.reviewCommentReplies.data,
                pullRequestProvided: () => Object.assign({},this.extraData.data,this.pullRequestProvided().data)
            }
        },
        data() {
            return {
                extraData: {
                    data: {},
                    loading: false
                },
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
                    pageInfo: {},
                    count: {
                        data: 0,
                        loading: false
                    },
                    newestTimeline: {
                        data: [],
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
                    },
                    {
                        graphql:'REVIEW_REQUESTED_EVENT',
                        rest:'review_requested',
                    }
                ],
                commentsJustCreated: []
            }
        },
       
        computed: {
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            number() {
                return this.$route.params.number
            },
            createdAt() {
                let dateStr = util_dateFormat.getDateDiffOrDateFormatDependOnGap('on dd zzz yyyy', new Date(this.pullRequestProvided().data.created_at), 1000 * 60 * 60 * 24 * 365)
                return dateStr
            },
            updatedAt() {
                return util_dateFormat.dateFormat('dd zzz yyyy', new Date(this.pullRequestProvided().data.updated_at))
            },
            viewerCannotComment() {
                return this.pullRequestProvided().data.locked && !this.extraData.data.viewerCanUpdate
            },
            timelineRemainedCount() {
                let alreadyCount = 0
                this.timeline.data.forEach(item => {
                    if(this.timelineTypes.some(_item => {
                        return _item.rest === item.event
                    })){
                        alreadyCount ++
                    }
                })
                this.timeline.newestTimeline.data.forEach(item => {
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
            },
            newCreatedTimelineItem() {
                return this.$route.query.new_created_timeline_item
            }

            /* subscriptionNotice() {
                return this.viewerSubscription.toLowerCase()
            } */
        },
        created() {
            this.network_getData()
        },
        methods: {
            loadingMore() {
                if(this.timeline.loading) return
                this.network_getTimeline()
            },
           
            async network_getData() {
                if(this.accessToken) await this.network_getPullRequestExtraData()

                //获取timeline(异步)
                this.network_getTimeline()

                //获取review comment replies
                this.network_getReviewCommentReplies()

                if(this.accessToken) this.network_getTimelineCount()
            },
            async network_getPullRequestExtraData() {
                try {
                    this.extraData.loading = true
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_PR,
                        {   
                            variables: {
                                name: this.repo,
                                owner: this.owner,
                                number: parseInt(this.number),
                            },
                            cancelToken:this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_pull_request_extra_data')
                        }
                    )

                    try{
                        this.extraData.data = res.data.data.repository.pullRequest
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                } catch(e){
                    this.handleError(e)
                }finally{
                    this.extraData.loading = false
                }
            },
            async network_getTimeline() {
                try{
                    this.timeline.loading = true
                    let url_timeline
                    if(this.timeline.pageInfo.next) {
                        url_timeline = this.timeline.pageInfo.next.url
                    } else {
                        url_timeline = api.API_ISSUE_TIMELINE({
                            repo: this.repo,
                            owner: this.owner,
                            number: this.number
                        }) + `?per_page=${this.timeline.perPage}`
                    }

                    let config = {
                        cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_timeline'),
                        headers:{
                            'Accept': 'application/vnd.github.mockingbird-preview,application/vnd.github.starfox-preview+json'
                        }   
                    }
                    
                    let res_timeline = await authRequiredGet(url_timeline,config)


                    this.timeline.pageInfo = parse(res_timeline.headers.link) || {}

                    this.timeline.data = this.timeline.data.concat(res_timeline.data)

                    this.timeline.loading = false

                    if(res_timeline.data.length > 0) this.network_getTimelineExtraData(res_timeline.data)

                    if(this.timeline.pageInfo.next && this.timeline.pageInfo.next.page == 2) {
                        await this.network_getNewestTimeline()
                    }

                    if(this.newCreatedTimelineItem) this.scrollToNewestTimelineItem()

                }catch(e){
                    this.handleError(e)
                }finally{
                    this.timeline.loading = false
                    this.timeline.extraData.loading = false
                }
            },
            async network_getNewestTimeline() {
                 try{
                    this.timeline.newestTimeline.loading = true
                    let url_timeline = api.API_ISSUE_TIMELINE({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number,
                        params: {
                            per_page: this.timeline.perPage,
                            page: this.timeline.pageInfo.last.page
                        }
                    })

                    let config = {
                        cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_newest_timeline'),
                        headers:{
                            'Accept': 'application/vnd.github.mockingbird-preview,application/vnd.github.starfox-preview+json'
                        }   
                    }
                    
                    let res_timeline = await authRequiredGet(url_timeline,config)

                    this.timeline.newestTimeline.data = res_timeline.data

                    

                    if(this.timeline.newestTimeline.data.length > 0) this.network_getTimelineExtraData(this.timeline.newestTimeline.data)

                }catch(e){
                    this.handleError(e)
                }finally{
                    this.timeline.newestTimeline.loading = false
                }
            },
            async network_getTimelineExtraData(timeline) {
                let ids = timeline && timeline.map(i => i.node_id).filter(i => i)
                try {
                    this.timeline.extraData.loading = true
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_PULL_TIMELINE,
                        {
                            variables: {
                                ids: ids ? ids : this.timeline.data
                            },
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_timeline_extra_data')
                        }
                    )
                    try{
                        let extraData = Object.values(res.data.data.nodes)
                        this.timeline.extraData.data = this.timeline.extraData.data.concat(extraData)
                    }catch(e) { 
                        this.handleGraphqlError(res)
                    }
                } catch (e) {
                     console.log(e)
                } finally {
                    this.timeline.extraData.loading = false
                }
            },
            async network_getTimelineCount() {
                try{
                    this.timeline.count.loading = true

                    let timelineTypes_graphql = []
                    this.timelineTypes.forEach(item => {
                        timelineTypes_graphql.push(item.graphql)
                    })
                    let graphql_timelineCount = graphql.GRAPHQL_PR_TIMELINE_COUNT(
                            {
                                timelineTypes: timelineTypes_graphql,
                                nodeId: this.pullRequestProvided().data.node_id
                            }
                        )

                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql_timelineCount,
                        {
                            cancelToken:this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + '_timeline_count')
                        }
                    )

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
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_review_comment_replies')

                    this.reviewCommentReplies.loading = true

                    let pageInfo
                    let reviewComments = []

                    while((!pageInfo || (pageInfo && pageInfo.next)) && reviewComments.length < 300) {
                        let url 
                        if(pageInfo) {
                            url = pageInfo.next.url
                        } else {
                            url = api.API_REVIEW_COMMENTS_OF_PULL_REQUEST({
                                repo: this.repo,
                                owner: this.owner,
                                number: this.number,
                                params: {
                                    per_page: 100
                                }
                            })
                        }

                        let res = await authRequiredGet(
                            url,
                            {
                                cancelToken,
                                headers: {
                                    "accept": "application/vnd.github.squirrel-girl-preview"
                                }
                            }
                        )
                        reviewComments = reviewComments.concat(res.data.filter(i => i.in_reply_to_id))

                        pageInfo = parse(res.headers.link) || {}
                    }
                 
                    this.reviewCommentReplies.data = reviewComments
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
            createCommentHandler(payload) {
                this.commentsJustCreated.push(payload)
                this.network_getTimelineExtraData([payload])
            },
            changeLockStatusSuccessPostHandler(payload) {
                this.pullRequestProvided().data.locked = payload
            },
            generateRouterMeta() {
                return this.$route.path
            },
            routeUpdateHook() {
                this.network_getData()
            },
            routeResetHook() {
                Object.assign(this.$data, this.$options.data())
            },
            scrollToNewestTimelineItem() {
                if(this.newCreatedTimelineItem) {
                    setTimeout(() => {
                        let theEl = document.getElementById(this.newCreatedTimelineItem)
                        theEl && theEl.scrollIntoView({block:'center'})
                    },0)
                }
            }
        },
        watch: {
            newCreatedTimelineItem(newOne, oldOne) {
                if(this.timeline.data.length > 0 && !this.timeline.pageInfo.next) {
                    this.scrollToTop()
                    this.network_getTimeline()
                    return 
                }
                if(this.timeline.pageInfo.last) {
                    this.scrollToTop()
                    this.network_getNewestTimeline()
                }
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
            PullRequestCommentCreator,
            Subscription,
            ImgWrapper,
            Progress,
            PullRequestBody,
            IssueIcon,
            SkeletonCircle,
            SkeletonRectangle,
            IssueNotificationSettingPane,
            LockIssueButton,
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
            MergePull: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/labels/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
@import 'node_modules/@primer/css/truncate/index.scss';
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

.branch-action {
    padding: 15px;
    font-size: 12px;
    color: #586069;
    background-color: #fff;
    border-top: 1px solid #e1e4e8;
}

.branch-action-with-icon {
    padding-left: 35px;
}

.discussion-block-header+.branch-action {
    border-top-color: #dfe2e5;
}

.branch-action-heading {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 14px;
    color: #24292e;
}

.branch-action-icon {
    float: left;
    width: 16px;
    margin-left: -23px;
    text-align: center;
}
</style>