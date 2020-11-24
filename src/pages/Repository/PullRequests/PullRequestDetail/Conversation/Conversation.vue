<template>
    <CommonLoadingWrapper :loading="pullRequestProvided().loading || timeline.loading || timeline.extraData.loading || reviewComments.loading" 
    :position="pullRequestProvided().loading ? 'center' : 'corner'"
    class="flex-grow-1 px-3">

            <IssueBody :data="{...pullRequestProvided(),...pullRequestReactions.data}"
                    style="padding-top:0px!important;margin-top:16px;"
                    :extraData="pullRequestProvided()" 
                    :issueUpdateFunc="updatePullRequestFunc()"
                    @quote="quoteReply"
                    :loading="extraData.loading"></IssueBody>

            <transition-group tag="div" appear name="fade-group">
                <div v-for="(item,index) in handledTimeline" :key="(item.id || '') + index">
                    <TimelineItem @timeline-item-deleted.native.stop="timelineItemDeletedHook" :data="item" class=""/>
                </div> 
            </transition-group>

            <LoadMore v-if="(timeline.pageInfo.next || timeline.loading) && !noMoreTimelineToLoad" :disabled="timeline.bufferTimeline.loading" :loading="timeline.loading" :dataGetter="loadingMore" :hiddenItemCount="timelineRemainedCount"></LoadMore>

             <transition-group tag="div" appear name="fade-group">
                <div v-for="(item,index) in newCreatedTimelines" :key="(item.id || '') + index">
                    <TimelineItem :data="item" />
                </div> 
            </transition-group>

            <PullMerger v-if="pullRequestProvided().id && !pullRequestProvided().merged" style="border-top: 2px solid rgb(225, 228, 232)"></PullMerger>


            <!-- <MergePull v-if="pullRequestProvided().viewerCanUpdate && pullRequestProvided().merged == false && pullRequestProvided().state == 'open'" >
                <Header class="header" v-if="pullRequestProvided().id">
                    Merge this pull request
                </Header>
                <div v-if="pullRequestProvided().mergeable_state == 'clean'" class="branch-action branch-action-with-icon">
                    <svg class="octicon octicon-check branch-action-icon text-green mt-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                    <h3 class="branch-action-heading">This branch has no conflicts with the base branch.</h3>
                        Merging can be performed automatically.
                </div>
                <div v-else-if="pullRequestProvided().mergeable_state == 'dirty'" class="branch-action branch-action-with-icon">
                    <svg class="octicon octicon-x branch-action-icon mt-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>
                    <h3 class="branch-action-heading">This branch has conflicts that must be resolved.</h3>
                    Use the command line to resolve conflicts before continuing.
                </div>
                <div class="p-3 branch-action">
                    <button :disabled="pullRequestProvided().mergeable_state != 'clean' || !pullRequestProvided().mergeable" class="btn btn-block js-mergeable-state-check">
                        <svg class="octicon octicon-git-merge" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M5 3.254V3.25v.005a.75.75 0 110-.005v.004zm.45 1.9a2.25 2.25 0 10-1.95.218v5.256a2.25 2.25 0 101.5 0V7.123A5.735 5.735 0 009.25 9h1.378a2.251 2.251 0 100-1.5H9.25a4.25 4.25 0 01-3.8-2.346zM12.75 9a.75.75 0 100-1.5.75.75 0 000 1.5zm-8.5 4.5a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
                        <span class="mergeable-state-loading"></span>
                        <span>Merge pull request</span>
                    </button>
                </div> 
            </MergePull> -->

            <CommentCreatePane class="mb-5 comment-create-edit-pane" 
                    ref="commentEditor"
                    @comment-created.native.stop="createCommentPostHook"
                    v-if="pullRequestProvided().id"
                    :locked="pullRequestProvided().locked"
                    :viewerDidAuthor="pullRequestProvided().viewerDidAuthor" 
                    :lockedReason="pullRequestProvided().activeLockReason" ></CommentCreatePane>

            <div v-if="pullRequestProvided().viewerSubscription">
                <Header class="header" >
                    Notifications for this thread
                </Header>

                <IssueNotificationSettingPane class="p-3" :viewerSubscriptionInfo="pullRequestProvided()"></IssueNotificationSettingPane>
            </div> 

            <LockIssueButton 
                @lock-status-changed.native="lockStatusChangedHook"
                class="p-3 border-top"
                v-if="pullRequestProvided().viewerCanUpdate" 
                :issue="pullRequestProvided()" 
                @lock-status-changed="changeLockStatusSuccessPostHandler"></LockIssueButton>


        <StickyTop :data="pullRequestProvided()"></StickyTop>     
        
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoadingWrapper,
            Label,
            AnimatedHeightWrapper,
            ImgWrapper,
            LoadingIconEx,
            Progress,
            IssueIcon,
            Subscription,
            SkeletonCircle,
            SkeletonRectangle,
            Popover} from '@/components'
    import {ScrollTopListenerMixin,RouteUpdateAwareMixin} from '@/mixins'
    import {Comment,HiddenItemLoading,PullRequestCommentCreator,ProjectCard,PullRequestBody,PullMerger} from './components'
    import TimelineItem from './components/TimelineItem/TimelineItem.vue'
    import {IssueNotificationSettingPane,LockIssueButton} from '../../../components'
    import {IssueBody,LoadMore,CommentCreatePane,StickyTop} from '../../../Issues/IssueDetail/components'
    import {util_dateFormat} from '@/util'
    import {
        authRequiredGet,
        authRequiredGitHubGraphqlApiQuery} from '@/network'
    import * as api from '@/network/api'
    import * as graphql from '../graphql'
    import {mapState,mapMutations} from 'vuex'
    import {MUTATION_PULL_REQUEST_DETAIL_RESET_STATE } from '@/store/modules/pullRequestDetail/mutationTypes'
    var parse = require('parse-link-header');
    export default {
        name: 'pullRequest_detail_conversation',
        inject: ['pullRequestProvided','repoOwnerType','updatePullRequestFunc'],
        mixins: [ScrollTopListenerMixin,RouteUpdateAwareMixin],
        provide() {
            return {
                timelineExtraDataProvided: () => this.timeline.extraData.data,
                commentExtraDataProvided: () => this.timeline.extraData.data,
                reviewCommentsProvided: () => this.reviewComments.data,
                timelineItemDeletedHook: () => this.timelineItemDeletedHook,
                reviewCommentsReplyHostDeletedHook: () => this.network_getReviewCommentReplies
            }
        },
        data() {
            return {
                pullRequestReactions: {
                    data: {},
                    loading: false
                },
                extraData: {
                    data: {},
                    loading: false
                },
                loading: false,
                reviewComments: {
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
                    perPage: 5,
                    pageInfo: {},
                    graphqlCount: {
                        data: 0,
                        loading: false
                    },
                    restCount: {
                        data: 0,
                        loading: false
                    },
                    newestTimelines: {
                        data: [],
                        loading: false
                    },
                    //处理删除timeline产生的副作用
                    bufferTimeline: {
                        data: [],
                        loading: false
                    },
                    newCreatedTimelinesCreatedAtConversations: [],
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
                    },
                    {
                        graphql:'HEAD_REF_FORCE_PUSHED_EVENT',
                        rest:'head_ref_force_pushed',
                    },
                    {
                        graphql:'BASE_REF_FORCE_PUSHED_EVENT',
                        rest:'base_ref_force_pushed',
                    },
                    {
                        graphql:'PULL_REQUEST_COMMIT',
                        rest:'committed',
                    }
                ],
                loadingUpdatePullRequestBody: false,
            }
        },
       
        computed: {
            ...mapState({
                state_newStartedReviews: state => state.pullRequestDetail.newStartedReviews,
                state_newSubmittedReviews: state => state.pullRequestDetail.newSubmittedReviews,
                state_deletedReviewComments: state => state.pullRequestDetail.deletedReviewComments
            }), 
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            number() {
                return this.$route.params.number
            },
            timelineRemainedCount() {
                let alreadyCount = 0
                this.timeline.data.forEach(item => {
                    if(this.timelineTypes.some(_item => {
                        return _item.rest == item.event
                    })){
                        alreadyCount ++
                    }
                })
                this.timeline.newestTimelines.data.forEach(item => {
                    if(this.timelineTypes.some(_item => {
                        return _item.rest == item.event
                    })){
                        alreadyCount ++
                    }
                })
                return this.timeline.graphqlCount.data - alreadyCount
            },
            newCreatedTimelines() {
                let allNewCreatedTimelines = [
                    ...this.state_newSubmittedReviews,
                    ...this.state_newStartedReviews,
                    ...this.timeline.newCreatedTimelinesCreatedAtConversations
                ].sort((a,b) => (a.submitted_at || a.created_at) > (b.submitted_at || b.created_at))

                let deDuplicatedAllNewCreatedTimelines = []

                let magicArray = [
                    ...this.timeline.newestTimelines.data,
                    ...allNewCreatedTimelines
                ]
                magicArray.forEach(i => {
                    if(!deDuplicatedAllNewCreatedTimelines.some(i_ => i_.id == i.id)) {
                        deDuplicatedAllNewCreatedTimelines.push(i)
                    }
                })
                return deDuplicatedAllNewCreatedTimelines
            },
            newCreatedTimelineItem() {
                return this.$route.query.new_created_timeline_item
            },
            noMoreTimelineToLoad() {
                if(!this.timeline.pageInfo.next) return true
                return this.timeline.restCount.data <= (this.timeline.data.length + this.timeline.newestTimelines.data.length)
            },
            handledTimeline() {
                try{
                    let timeline = this.timeline.data.filter(i => !this.timeline.newestTimelines.data.some(i_ => i_.created_at == i.created_at))
                    return timeline
                }catch(e) {
                    console.log(e)
                }
                
            }
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
                this.network_getPullRequestReactions()
                this.network_getTimeline()
                this.network_getReviewComments()
                this.network_getTimelineRestCount()
                if(this.accessToken) this.network_getTimelineGraphqlCount()
            },
            async network_getTimeline() {
                try{
                    this.timeline.loading = true
                    let url_timeline
                    if(this.timeline.pageInfo.next) {
                        url_timeline = this.timeline.pageInfo.next.url
                    } else {
                        url_timeline = api.API_ISSUE_TIMELINES({
                            repo: this.repo,
                            owner: this.owner,
                            number: this.number,
                            params: {
                                per_page: this.timeline.perPage
                            }
                        })
                    }

                    let config = {
                        cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_timeline'),
                        headers:{
                            'Accept': 'application/vnd.github.mockingbird-preview,application/vnd.github.starfox-preview+json'
                        }   
                    }
                    
                    let res_timeline = await authRequiredGet(url_timeline,config)


                    this.timeline.pageInfo = parse(res_timeline.headers.link) || {}

                    if(this.timeline.bufferTimeline.data.length > 0) {
                        this.timeline.data = this.timeline.data.concat(this.timeline.bufferTimeline.data)
                        this.timeline.bufferTimeline.data = []
                    }

                    this.timeline.data = this.timeline.data.concat(res_timeline.data)

                    this.timeline.loading = false

                    if(res_timeline.data.length > 0) this.network_getTimelineExtraData(res_timeline.data)

                    if(this.timeline.pageInfo.next && this.timeline.pageInfo.next.page == 2) {
                        await this.network_getNewestTimelines()
                    }

                    if(this.newCreatedTimelineItem) this.scrollToNewestTimelineItem()


                }catch(e){
                    this.handleError(e)
                }finally{
                    this.timeline.loading = false
                    this.timeline.extraData.loading = false
                }
            },
            async network_getNewestTimelines() {
                if(!this.timeline.pageInfo.last) return
                 try{ 
                    this.timeline.newestTimelines.loading = true
                    let url = this.timeline.pageInfo.last.url

                    let config = {
                        cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_newest_timelines'),
                        headers:{
                            'Accept': 'application/vnd.github.mockingbird-preview,application/vnd.github.starfox-preview+json'
                        }   
                    }
                    
                    let res = await authRequiredGet(url,config)

                    this.timeline.newestTimelines.data = res.data

                    this.$nextTick(() => {
                        this.scrollToNewestTimelineItem()
                    })

                    if(this.timeline.newestTimelines.data.length > 0) this.network_getTimelineExtraData(this.timeline.newestTimelines.data)

                }catch(e){
                    this.handleError(e)
                }finally{
                    this.timeline.newestTimelines.loading = false
                }
            },
            //deprecated
            async network_getNewestTimeline() {
                let url_pageInfo = api.API_ISSUE_TIMELINES({
                    repo: this.repo,
                    owner: this.owner,
                    number: this.number,
                    params: {
                        per_page: 1
                    }
                })

                let res_pageInfo = await authRequiredGet(
                    url_pageInfo,
                    {
                        headers: {
                            "accept": "application/vnd.github.mockingbird-preview,application/vnd.github.starfox-preview+json"
                        }
                    }
                )

                let pageInfo = parse(res_pageInfo.headers.link) || {}

                if(!pageInfo.last) return

                let url = pageInfo.last.url

                let res = await authRequiredGet(
                    url,
                    {
                        headers: {
                            "accept": "application/vnd.github.mockingbird-preview"
                        }
                    }
                )

                res.data[0] && this.timeline.newestTimelines.data.push(res.data[0])
                res.data[0] && this.network_getTimelineExtraData(res.data)
            },
            async network_getTimelineExtraData(timeline) {
                let ids = []
                if(timeline) {
                    timeline.forEach(i => {
                        if(i.event == 'commit-commented') {
                            i.comments && i.comments.forEach(i_ => {
                                ids.push(i_.node_id)
                            })
                        }else{
                            ids.push(i.node_id)
                        }
                    })
                }
                ids = ids.filter(i => i)
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

                        this.$nextTick(() => {
                            this.scrollToNewestTimelineItem()
                        })
                    }catch(e) { 
                        this.handleGraphqlError(res)
                    }
                } catch (e) {
                     console.log(e)
                } finally {
                    this.timeline.extraData.loading = false
                }
            },
            async network_getTimelineRestCount() {
                try {
                    this.timeline.restCount.loading = true

                    let url = api.API_ISSUE_TIMELINES({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number,
                        params: {
                            per_page: 1
                        }
                    })  

                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_timeline_rest_count'),
                                headers: {
                                "accept": "application/vnd.github.mockingbird-preview"
                            }
                        }
                    )

                    let countHolder = parse(res.headers.link) || {}
                    this.timeline.restCount.data = countHolder.last ? countHolder.last.page : res.data.length
                } catch (e) {
                    console.log(e)
                } finally {
                    this.timeline.restCount.loading = false
                }
            },
            async network_getTimelineGraphqlCount() {
                try{
                    this.timeline.graphqlCount.loading = true

                    let itemTypes = this.timelineTypes.map(i => i.graphql)
                    
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_PR_TIMELINE_COUNT,
                        {
                            variables: {
                                itemTypes,
                                repo: this.repo,
                                owner: this.owner,
                                number: parseInt(this.number)
                            },
                            cancelToken:this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + '_timeline_graphql_count')
                        }
                    )
                    try{
                        this.timeline.graphqlCount.data = res.data.data.repository.pullRequest.timelineItems.totalCount
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }

                }catch(e){
                    console.log(e)
                }finally{
                    this.timeline.graphqlCount.loading = false
                }
            },
            //此处无法获取state为pending的review comment reply, 即使viewer为该review comment reply的author, 该数据可以在review组件中通过graphql api获取
            async network_getReviewComments() {
                try{
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_review_comments')

                    this.reviewComments.loading = true

                    let pageInfo

                    while((!pageInfo || (pageInfo && pageInfo.next)) && this.reviewComments.data.length < 300) {
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
                        this.reviewComments.data = this.reviewComments.data.concat(res.data)

                        pageInfo = parse(res.headers.link) || {}
                    }
                 
                }catch(e){
                    console.log(e)
                }finally{
                    this.reviewComments.loading = false
                }
            },
            /* mergedTimelineData(timelineData) {
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
            }, */
            async network_getBufferTimeline() {
                try {
                    this.timeline.bufferTimeline.loading = true
                    let url = api.API_ISSUE_TIMELINES({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number,
                        params: {
                            per_page: 1,
                            page: this.timeline.data.length
                        }
                    })

                    let res = await authRequiredGet(
                        url,
                        {
                            headers: {
                                "accept": "application/vnd.github.mockingbird-preview,application/vnd.github.starfox-preview+json"
                            }
                        }
                    )

                    res.data[0] && this.timeline.bufferTimeline.data.push(res.data[0])

                } catch (e) {
                    console.log(e)
                } finally {
                    this.timeline.bufferTimeline.loading = false
                }
            },
            async timelineItemDeletedHook() {
                //console.log("commentDeletedHook")
                if(this.noMoreTimelineToLoad) return
                await this.network_getBufferTimeline()
            },
            async createCommentPostHook(e) {
                this.timeline.newCreatedTimelinesCreatedAtConversations.push(e.detail) 
                this.network_getTimelineExtraData([e.detail])
            },
            changeLockStatusSuccessPostHandler(payload) {
                this.pullRequestProvided().locked = payload
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
                        theEl && theEl.scrollIntoView()
                    },0)
                }
            },
            lockStatusChangedHook(payload) {
                this.timeline.newCreatedTimelinesCreatedAtConversations.push(payload.detail)
            },
            pullRequestStateChangedHook(payload) {
                this.timeline.newCreatedTimelinesCreatedAtConversations.push(payload.detail)
            },
            quoteReply(e) {
                let commentCreateOrEditPaneTextarea = document.querySelector('textarea')
                commentCreateOrEditPaneTextarea.focus()
                commentCreateOrEditPaneTextarea.value = commentCreateOrEditPaneTextarea.value + e
                commentCreateOrEditPaneTextarea.dispatchEvent(new Event('input'))
            },
        },
        watch: {
          /*   state_deletedReviewComments(newOne, oldOne) {
                if(newOne.length == 0) return
                this.reviewComments.data.forEach((i,index) => {
                    if(i.id == newOne[newOne.length - 1].id) {
                        this.reviewComments.data.splice(index,1)
                        let replies = this.reviewComments.data.filter(i_ => i_.in_reply_to_id == i.id).sort((a,b) => a.created_at > b.created_at)

                        replies[0].in_reply_to_id = undefined
                        replies.forEach(i__ => {
                            if(i__.in_reply_to_id) {
                                i__.in_reply_to_id = replies[0].id
                            } 
                        })
                    }
                })
            }, */
        },
        activated() {
            this.scrollToNewestTimelineItem()
        },
        components: {
            CommonLoadingWrapper,
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
            Popover,
            IssueBody,
            LoadMore,
            CommentCreatePane,
            PullMerger,
            StickyTop,
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
@import 'node_modules/@primer/css/dropdown/index.scss';
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

.timeline-truncation-title {
    margin-top: 0;
    margin-bottom: 5px;
    font-weight: 600;
    color: #586069;
}

    
</style>