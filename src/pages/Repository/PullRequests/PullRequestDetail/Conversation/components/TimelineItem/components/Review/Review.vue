<template>
    <Other :data="reviewTimeline">
        <template v-slot:icon>
            <svg class="octicon octicon-eye" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z"></path></svg>
        </template>
        <template v-slot:action>
            {{statusAction}} 
            <span class="no-wrap">
                on {{reviewTimeline.submitted_at | dateFormat('dd zzz yyyy')}}
            </span>
        </template>
        <template v-slot:additional>
            <div class="mt-2">
                <router-link class="btn btn-sm btn-outline" :to="`/${owner}/${repo}/pull/${number}/files/${reviewTimeline.commit_id}`">
                View changes
                </router-link>
            </div>
            <Comment v-if="reviewTimeline.body" :data="reviewTimeline" style="margin-left:-40px"></Comment>
            <ReviewCommentGroup v-for="item in rootReviewComments" :key="item.id" :rootReviewComment="item"/>
        </template>
    </Other>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Other,Comment} from '../../../../../../../Issues/IssueDetail/components/TimelineItem/components'
    import * as api from '@/network/api'
    import {ReviewCommentGroup,ReviewBodyEditor} from './components'
    import {authRequiredGet} from '@/network'
    import {mapMutations, mapState} from 'vuex'
    import { MUTATION_PULL_REQUEST_DETAIL_UPDATED_NEW_CREATED_REVIEW_COMMENT } from '@/store/modules/pullRequestDetail/mutationTypes'
    let parse = require('parse-link-header')
    export default {
        inject: ['reviewCommentsProvided'],
        provide() {
            return {
                reviewProvided: () => this.reviewTimeline,
                reviewCommentsOfPendingReview: () => this.reviewComments.data,
            }
        },
        props: {
            reviewTimeline: {
                type: Object,
                required: true
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
                let status = 'approved these changes'
                switch(this.reviewTimeline.state.toLowerCase()) {
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
            isSubmitted() {
                return this.reviewTimeline.state && this.reviewTimeline.state.toLowerCase() == 'pending' && this.state_newSubmittedReviews.some(i => i.id == this.reviewTimeline.id)
            },
            rootReviewComments() {
                return [...this.reviewComments.data, ...this.reviewCommentsProvided(),...this.state_newCreatedReviewComments].filter(i => i.pull_request_review_id == this.reviewTimeline.id && !i.in_reply_to_id).filter(i => !this.state_deletedReviewComments.some(i_ => i_.id == i.id)).sort((a,b) => a.created_at > b.created_at)
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
                if(this.reviewTimeline.state && this.reviewTimeline.state.toLowerCase() == 'pending') this.network_getReviewComments()
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
                            reviewId: this.reviewTimeline.id,
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
                            reviewId: this.reviewTimeline.id,
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
        },
        watch: {
            state_deletedReviewComments(newOne, oldOne) {
                if(newOne.length == 0) return
                let deletedReviewComment = newOne[newOne.length - 1]
                if(deletedReviewComment.in_reply_to_id) return 
                if(deletedReviewComment.pull_request_review_id != this.reviewTimeline.id)  return

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
            },
            rootReviewComments(newOne) {
                if(this.reviewTimeline.state.toLowerCase() == 'pending' && newOne.length == 0) {
                    let event = new CustomEvent('timeline-item-deleted')
                    this.$el.dispatchEvent(event)
                    this.deleted = true
                }
            }
         },
        components: {
            ReviewCommentGroup,
            ReviewBodyEditor,
            Other,
            Comment,
            Container: styled.div``,
            Header: styled.div``,
            WhoDidWhat: styled.div``,
            Body: styled.div``,
            BodyHTML: styled.div``,
            LoadingWrapper: styled.div``,
        }
    }
</script>

<style scoped lang="scss">

</style>