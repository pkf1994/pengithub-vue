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
                <div v-for="(item,index) in handledTimelines" :key="(item.id || '') + index">
                    <TimelineItem :data="item"
                                    @quote="quoteReply" 
                                    @unminimize-comment="unminimizeCommentHook"
                                    @comment-updated.native="commentUpdatedHook"   
                                    @minimize-comment="minimizeCommentHook"/>
                </div> 
            </transition-group>

            <LoadMore v-if="(timeline.pageInfo.next || timeline.loading) && !noMoreTimelineToLoad" 
                :disabled="timeline.bufferTimeline.loading" 
                :loading="timeline.loading" 
                :dataGetter="network_getTimeline" 
                :hiddenItemCount="timelineRemainedCount"></LoadMore>

             <transition-group tag="div" appear name="fade-group">
                <div v-for="(item,index) in newCreatedTimelines" :key="(item.id || '') + index">
                    <TimelineItem :data="item" 
                                    @quote="quoteReply" 
                                    @unminimize-comment="unminimizeCommentHook"
                                    @comment-updated.native="commentUpdatedHook"
                                    @minimize-comment="minimizeCommentHook"/>
                </div> 
            </transition-group>

            <div class="divider mb-3" style="border-top: 2px solid rgb(225, 228, 232)"></div> 

            <PullMerger v-if="pullRequestProvided().id && !pullRequestProvided().merged && (pullRequestProvided().state && pullRequestProvided().state.toLowerCase() == 'open')" ></PullMerger>

            <CommentCreatePane class="mb-5 comment-create-edit-pane" 
                    ref="commentEditor"
                    @new-timeline-item-created.native.stop="newTimelineItemCreatedHook"
                    v-if="pullRequestProvided().id"
                    :locked="pullRequestProvided().locked"
                    :viewerDidAuthor="pullRequestProvided().viewerDidAuthor" 
                    :lockedReason="pullRequestProvided().activeLockReason" ></CommentCreatePane>

            <BottomInfoRows :data="pullRequest"></BottomInfoRows>


        <StickyTop :data="pullRequestProvided()"></StickyTop>     
        
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoadingWrapper} from '@/components'
    import {ScrollTopListenerMixin,RouteUpdateAwareMixin} from '@/mixins'
    import {
            BottomInfoRows,
            PullMerger
                } from './components'
    import TimelineItem from './components/TimelineItem/TimelineItem.vue'
    import {IssueBody,LoadMore,CommentCreatePane,StickyTop} from '../../../Issues/IssueDetail/components'
    import IssueDetailProtoMixin from '../../../Issues/IssueDetail/IssueDetailProtoMixin.vue'
    import {
        authRequiredGet,
        authRequiredGitHubGraphqlApiQuery} from '@/network'
    import * as api from '@/network/api'
    import * as graphql from '../graphql'
    import {mapState} from 'vuex'
    var parse = require('parse-link-header');
    export default {
        name: 'pullRequest_detail_conversation',
        inject: ['pullRequestProvided','repoOwnerType','updatePullRequestFunc'],
        mixins: [ScrollTopListenerMixin,RouteUpdateAwareMixin,IssueDetailProtoMixin],
        provide() {
            return {
                reviewCommentsProvided: () => this.reviewComments.data,
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
            }
        },
       
        computed: {
            ...mapState({
                state_newStartedReviews: state => state.pullRequestDetail.newStartedReviews,
                state_newSubmittedReviews: state => state.pullRequestDetail.newSubmittedReviews,
                state_deletedReviewComments: state => state.pullRequestDetail.deletedReviewComments
            }), 
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
            pullRequest() {
                return this.pullRequestProvided()
            }
        },
        created() {
            this.network_getData()
            this.data = this.pullRequestProvided()
        },
        methods: {
            async network_getData() {
                this.network_getTimeline()
                this.network_getReviewComments()
                this.network_getTimelineRestCount()
                if(this.accessToken) this.network_getTimelineGraphqlCount()
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
            async createCommentHook(e) {
                this.timeline.newCreatedTimelinesCreatedAtConversations.push(e.detail) 
                this.network_getTimelineExtraData([e.detail])
            },
            lockStatusChangedHook(event) {
                this.timeline.newestTimelines.data.push(event.detail)
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
            pullRequest() {
                this.data = this.pullRequestProvided()
            }
        },
        activated() {
            this.scrollToNewestTimelineItem()
        },
        components: {
            CommonLoadingWrapper,
            TimelineItem,
            IssueBody,
            LoadMore,
            CommentCreatePane,
            PullMerger,
            StickyTop,
            BottomInfoRows,
            Container: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/labels/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
@import 'node_modules/@primer/css/truncate/index.scss';
@import 'node_modules/@primer/css/dropdown/index.scss';
</style>