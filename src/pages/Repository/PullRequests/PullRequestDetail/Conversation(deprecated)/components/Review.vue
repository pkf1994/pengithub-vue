<template>
    <Container v-show="!isSubmitted && !deleted" class="p-3 relative container" :id="propsData.id">
        <Header class="d-flex position-relative pl-4">
            
            <div class="pr-simple-timeline-icon-wrapper">
                <svg v-if="statusAction == 'approved'" class="octicon octicon-check" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                <svg v-else class="octicon octicon-eye" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"></path></svg>
            </div>
           
            <WhoDidWhat class="flex-grow-1">
                <router-link :to="`/${propsData.user.login}`" class="d-inline-block">
                    <ImgWrapper class="avatar mr-1">
                        <img :src="propsData.user.avatar_url" :alt="`@${propsData.user.login}`" class="avatar" height="16" width="16">
                    </ImgWrapper>
                </router-link>
                <router-link  :to="`/${propsData.user.login}`" class="text-bold link-gray-dark">
                    {{propsData.user.login}}
                </router-link>
                {{statusAction}}
                <span class="no-wrap">{{propsData.submitted_at | getDateDiff}}</span>

                <button v-if="extraData.viewerCanUpdate" @click="triggerShowReivewBodyEditor" :disabled="showReviewBodyEditor" type="button" class="btn-link muted-link js-comment-edit-button float-right">
                    <svg class="octicon octicon-pencil" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.249.249 0 00.108-.064l6.286-6.286z"></path></svg>
                </button>

            </WhoDidWhat>
          
            <!-- <Label class="ml-1 no-wrap" :name="propsData.state" :color="propsData.state == 'pending' ? '#fffbdd' : '#ffffff'" style="font-size: 10px;color:#735c0f" ></Label> -->
        </Header>

        <Body class="bubble mt-3" v-if="bodyHTML">
            <BodyHTML v-if="!showReviewBodyEditor" class="markdown-body p-3" style="font-size:15px">
                <div v-html="bodyHTML">

                </div>
            </BodyHTML>
            <ReviewBodyEditor v-else :review="updatedReview || propsData" @review-updated="reviewUpdatedHook" @cancel="() => triggerShowReivewBodyEditor(false)"></ReviewBodyEditor>
        </Body>
       
        <!-- <LoadingWrapper v-if="reviewComments.loading" class="loading-wrapper pt-3 d-flex flex-justify-center flex-items-center">
            Loading...
        </LoadingWrapper> -->

        <ReviewCommentGroup v-for="item in rootReviewComments" :key="item.id" :rootReviewComment="item"/>
        
        <!-- <HiddenItemLoading v-if="reviewComments.pageInfo.next" style="padding-bottom:0px!important" :loading="reviewComments.loading" :dataGetter="network_getReviewComments">
            {{reviewComments.totalCount - data.length}} {{reviewComments.totalCount - data.length > 1 ? 'reviewComments' : 'comment'}} remained.
        </HiddenItemLoading> -->
      
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {LoadingIconEx,AnimatedHeightWrapper,Popover,Label,ImgWrapper} from '@/components'
    import {util_markdownParse} from '@/util'
    import ReviewCommentGroup from './ReviewCommentGroup'
    import HiddenItemLoading from './HiddenItemLoading'
    import * as graphql from '../../graphql'
    import * as api from '@/network/api'
    import Comment from './Comment'
    import ReviewBodyEditor from './ReviewBodyEditor'
    import {authRequiredGet,authRequiredGitHubGraphqlApiQuery} from '@/network'
    import {mapMutations, mapState} from 'vuex'
    import { MUTATION_PULL_REQUEST_DETAIL_UPDATED_NEW_CREATED_REVIEW_COMMENT } from '@/store/modules/pullRequestDetail/mutationTypes'
    let parse = require('parse-link-header')
    export default {
        mixins: [Comment],
        inject: ['reviewCommentsProvided'],
        provide() {
            return {
                reviewProvided: () => this.propsData,
                reviewCommentsOfPendingReview: () => this.reviewComments.data,
                //pendingReviewCommentRepliesDeletedHook: () => this.pendingReviewCommentRepliesDeletedHook
            }
        },
        data() {
            return {
                reviewComments: {
                    data: [],
                    loading: false,
                    pageInfo: {},
                    totalCount: 0,
                },
                reactions: {
                    data: {},
                    loading: false
                },
                updatedReview: undefined,
                showReviewBodyEditor: false,
                deleted: false
            }
        },
        computed: {
            ...mapState({
                state_newSubmittedReviews: state => state.pullRequestDetail.newSubmittedReviews,
                state_deletedReviewComments: state => state.pullRequestDetail.deletedReviewComments,
                state_newCreatedReviewComments: state => state.pullRequestDetail.newCreatedReviewComments
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
            statusAction() {
                let status = 'approved'
                switch(this.propsData.state.toLowerCase()) {
                    case 'changes_requested':
                        status = 'request changes'
                        break
                    case 'commented':
                        status = 'reviewed'
                        break
                    case 'pending':
                        status = 'start a review'
                    default:
                }
                return status
            },
            bodyHTML() {
                return util_markdownParse.markdownToHTML(this.updatedReview && this.updatedReview.body || this.propsData.body)
            },
            isSubmitted() {
                return this.propsData.state && this.propsData.state.toLowerCase() == 'pending' && this.state_newSubmittedReviews.some(i => i.id == this.propsData.id)
            },
            rootReviewComments() {
                return [...this.reviewComments.data, ...this.reviewCommentsProvided(),...this.state_newCreatedReviewComments].filter(i => i.pull_request_review_id == this.propsData.id && !i.in_reply_to_id).filter(i => !this.state_deletedReviewComments.some(i_ => i_.id == i.id)).sort((a,b) => a.created_at > b.created_at)
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            ...mapMutations({
                mutation_updateNewCreatedReviewComment: MUTATION_PULL_REQUEST_DETAIL_UPDATED_NEW_CREATED_REVIEW_COMMENT
            }),
            network_getData() {
                if(this.propsData.state && this.propsData.state.toLowerCase() == 'pending') this.network_getReviewComments()
                //this.network_getReviewCommentsCount()
            },
            async network_getReviewComments() {
                try{
                    this.reviewComments.loading = true
                    
                    let pageInfo
                    let reviewComments = []
                    while(!pageInfo || pageInfo.next) {
                        let url = api.API_REVIEW_COMMENTS_OF_REVIEW({
                            repo: this.repo,
                            owner: this.owner,
                            number: this.number,
                            reviewId: this.propsData.id,
                            params: {
                                sort: 'created',
                                direction: 'asc',
                                per_page: 100
                            }
                        })

                        let res = await authRequiredGet(
                            url,
                            {
                                headers: {
                                    "accept" :"application/vnd.github.squirrel-girl-preview+json"
                                }
                            }
                        )
                        pageInfo = parse(res.headers.link) || {}

                        reviewComments = reviewComments.concat(res.data)
                    }

                    this.reviewComments.data = reviewComments

                    //this.network_getReviewCommentsExtraData(this.reviewComments.data)
                }catch(e) {
                    console.log(e)
                }finally{
                    this.reviewComments.loading = false
                }
            },
            async network_getReviewCommentsCount() {
                try{
                    let url = api.API_REVIEW_COMMENTS_OF_REVIEW({
                            repo: this.repo,
                            owner: this.owner,
                            number: this.number,
                            reviewId: this.propsData.id,
                            params: {
                                per_page: 1
                            }
                        })

                    let res = await authRequiredGet(url)

                    let pageInfo = parse(res.headers.link) || {}

                    this.reviewComments.count = pageInfo.last ? pageInfo.last.page : res.data.length

                }catch(e) {
                    console.log(e)
                }
            },
            triggerShowReivewBodyEditor(flag = true) {
                this.showReviewBodyEditor = flag
            },
            reviewUpdatedHook(payload) {
                this.showReviewBodyEditor = false
                this.updatedReview = payload
            },
            /* pendingReviewCommentRepliesDeletedHook(event) {
                if(this.reviewComments.data.length == 1) {
                    this.deleted = true
                }else{
                    this.network_getReviewComments()
                }
            }, */
           /*  async network_getCommentsOfPendingReview() {
                try{
                    this.reviewCommentsOfPendingReview.loading = true

                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_PR_REVIEW_COMMENTS,
                        {
                            variables: {
                                id: this.propsData.node_id,
                                after: this.reviewCommentsOfPendingReview.pageInfo.hasNextPage ? this.reviewCommentsOfPendingReview.pageInfo.endCursor : undefined,
                                first: 100
                            }
                        }
                    )
                   
                    try{
                        this.reviewCommentsOfPendingReview.data = this.reviewCommentsOfPendingReview.data.concat(res.data.data.node.reviewComments.nodes)
                        this.reviewCommentsOfPendingReview.pageInfo = res.data.data.node.reviewComments.pageInfo
                        this.reviewCommentsOfPendingReview.totalCount = res.data.data.node.reviewComments.totalCount
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                    
                }catch(e) {
                    console.log(e)
                }finally{
                    this.reviewCommentsOfPendingReview.loading = false
                }
            } */
        },
        watch: {
            state_deletedReviewComments(newOne, oldOne) {
                if(newOne.length == 0) return
                let deletedReviewComment = newOne[newOne.length - 1]
                if(deletedReviewComment.in_reply_to_id) return 
                if(deletedReviewComment.pull_request_review_id != this.propsData.id)  return

                let replies = [
                    ...this.reviewComments.data,
                    ...this.state_newCreatedReviewComments,
                    ...this.reviewCommentsProvided()
                    ].filter(i => i.in_reply_to_id == deletedReviewComment.id).filter(i => !this.state_deletedReviewComments.some(i_ => i_.id == i.id)).sort((a,b) => a.created_at > b.created_at)

                if(replies.length == 0) return

                this.state_newCreatedReviewComments.forEach(i => {
                    if(i.id == replies[0].id) {
                        this.mutation_updateNewCreatedReviewComment({
                            ...i,
                            in_reply_to_id: undefined
                        })
                    }else if(i.in_reply_to_id == deletedReviewComment.id) {
                        this.mutation_updateNewCreatedReviewComment({
                            ...i,
                            in_reply_to_id: replies[0].id
                        })
                    }
                })

                this.reviewCommentsProvided().forEach(i => {
                    if(i.id == replies[0].id) {
                         i.in_reply_to_id = undefined
                    }else if(i.in_reply_to_id == deletedReviewComment.id) {
                        i.in_reply_to_id = replies[0].id
                    }
                })

                this.reviewComments.data.forEach(i => {
                     if(i.id == replies[0].id) {
                         i.in_reply_to_id = undefined
                    }else if(i.in_reply_to_id == deletedReviewComment.id) {
                        i.in_reply_to_id = replies[0].id
                    }
                })

                /* replies.forEach((i,index) => {
                    if(index > 0) {
                        i.in_reply_to_id = replies[0].index
                    }
                }) */

               /*  this.state_newCreatedReviewComments.forEach((i,index) => {
                    if(i.id == deletedReviewComment.id && !i.in_reply_to_id) {
                        let replies = this.state_newCreatedReviewComments.data.filter(i_ => i_.in_reply_to_id == i.id)
                        if(replies.length == 0) return 
                        this.mutation_updateNewCreatedReviewComment({
                            ...replies[0],
                            in_reply_to_id: undefined
                        })
                        replies.forEach(i__ => {
                             this.mutation_updateNewCreatedReviewComment({
                                ...i__,
                                in_reply_to_id: replies[0].id
                            })
                        })
                    }
                })

                this.reviewComments.data.forEach((i,index) => {
                    if(i.id == deletedReviewComment.id && !i.in_reply_to_id) {
                        let replies = this.reviewComments.data.filter(i_ => i_.in_reply_to_id == i.id)
                        if(replies.length == 0) return 
                        replies[0].in_reply_to_id = undefined
                        replies.forEach(i__ => {
                            if(i__.in_reply_to_id) {
                                i__.in_reply_to_id = replies[0].id
                            } 
                        })
                    }
                }) */
            },
            rootReviewComments(newOne) {
                if(this.propsData.state.toLowerCase() == 'pending' && newOne.length == 0) {
                    let event = new CustomEvent('timeline-item-deleted')
                    this.$el.dispatchEvent(event)
                    this.deleted = true
                }
            }
         },
        components: {
            LoadingIconEx,
            AnimatedHeightWrapper,
            Popover,
            ImgWrapper,
            ReviewCommentGroup,
            HiddenItemLoading,
            Label,
            ReviewBodyEditor,
            Container: styled.div``,
            Header: styled.div``,
            WhoDidWhat: styled.div``,
            Body: styled.div``,
            BodyHTML: styled.div``,
            LoadingWrapper: styled.div``,
        }
    }
</script>

<style>
.pr-simple-timeline-icon-wrapper{
    position: absolute;
    top: 1px;
    left: 1px;
    margin-right: 10px;
    color: #959da5;
}
</style>

<style scoped lang="scss">
.container{
    padding: 15px;
    font-size: 13px;
    color: #586069;
}

.body {
    min-width: 0;
    max-width: 100%;
    margin-top: 4px;
    color: #444d56;
    flex: auto;
}

.reaction-item{
    font-size: 12px!important;
    padding-top: 4px!important;
    padding-bottom: 4px!important;
    padding-right: 8px!important;
    padding-left: 8px!important;
    display: block;
    margin-top: 4px!important;
    margin-bottom: 4px!important;
    margin-right: 8px!important;
    border-radius: 3px!important;
    border: 1px solid #e1e4e8!important;
}

.loading-wrapper{
    font-weight: 600;
    animation: breathe 1s linear infinite alternate;
}

@keyframes breathe {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

</style>