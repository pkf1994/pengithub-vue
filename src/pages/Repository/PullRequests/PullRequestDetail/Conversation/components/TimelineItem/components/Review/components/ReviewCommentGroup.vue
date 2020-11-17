<template> 
    <Container v-show="reviewCommentGroup.length > 0" class="bubble bg-white" style="margin-top:15px" :class="{pending:reviewProvided().state && reviewProvided().state.toLowerCase() == 'pending'}">
        
        <ReviewComment :class="{'border-top':index > 0}" v-for="(item,index) in reviewCommentGroup" :isRoot="index == 0" :reviewComment="item" :key="item.id"></ReviewComment>

        <button @click="triggerShowReviewCommentCreator" v-if="!(pullRequestProvided().locked && !viewerIsCollaborator().data) && !showReviewCommentCreator && repoOwnerType() == 'User'" class="border-top reply btn-link text-bold text-left muted-link btn-block">
            Reply...
        </button>

        <ReviewCommentCreator v-if="showReviewCommentCreator" class="border-top" :rootReviewComment="rootReviewComment" @cancel="() => triggerShowReviewCommentCreator(false)"></ReviewCommentCreator>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {mapState} from 'vuex'
    import ReviewComment from './ReviewComment'
    import ReviewCommentCreator from './ReviewCommentCreator'
    import * as graphql from './graphql'
    import { authRequiredGitHubGraphqlApiQuery } from '@/network'
    export default {
        inject: ['reviewCommentsProvided','reviewCommentsOfPendingReview','pullRequestProvided','repoOwnerType','viewerIsCollaborator','reviewProvided'],
        provide() {
            return {
                reviewCommentsExtraData: () => this.reviewCommentsExtraData.data,
            }
        },
        data() {
            return {
                showOutdated: false,
                showReviewCommentCreator: false,
                reviewCommentsExtraData: {
                    data: [],
                    loading: false
                },
            }
        },
        props: {
            rootReviewComment: {
                type: Object,
                required: true
            },
        },
        computed: {
            ...mapState({
                state_newCreatedReviewComments: state => state.pullRequestDetail.newCreatedReviewComments,
                state_deletedReviewComments: state => state.pullRequestDetail.deletedReviewComments,
            }),
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            reviewCommentGroup() {
                let replies = [...this.reviewCommentsProvided(),...this.reviewCommentsOfPendingReview(),...this.state_newCreatedReviewComments].filter(item => {
                    return item.in_reply_to_id == this.rootReviewComment.id
                }).sort((a,b) => a.created_at > b.created_at)

                let deDuplicatedReplies = []
                replies.forEach(i => {
                    if(!deDuplicatedReplies.some(i_ => i_.id == i.id)) {
                        deDuplicatedReplies.push(i)
                    }
                })
                return [
                        this.rootReviewComment,
                        ...deDuplicatedReplies
                    ].filter(item => !this.state_deletedReviewComments.some(i => i.id == item.id))
            },
        },
        created() {
            this.network_getReviewCommentsExtraData()
        },
        methods: {
            async network_getReviewCommentsExtraData() {
                let reviewCommentsNeedToGetExtraData = []
                this.reviewCommentGroup.forEach(i => {
                    if(!this.reviewCommentsExtraData.data.some(i_ => i_.id == i.node_id)) {
                        reviewCommentsNeedToGetExtraData.push(i.node_id)
                    }
                })
                if(reviewCommentsNeedToGetExtraData.length == 0) return 
                try{
                    this.reviewCommentsExtraData.loading = true
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_PR_REVIEW_COMMENTS,
                        {
                            variables: {
                                ids:reviewCommentsNeedToGetExtraData
                            }
                        }
                    )

                    try{
                        this.reviewCommentsExtraData.data = this.reviewCommentsExtraData.data.concat(res.data.data.nodes)
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                    
                }catch(e) {
                    console.log(e)
                }finally{
                    this.reviewCommentsExtraData.loading = false
                }
            },
            triggerShowReviewCommentCreator(flag = true) {
                this.showReviewCommentCreator = flag
            },
        },
        watch: {
          reviewCommentGroup(newOne) {
              if(newOne.length == 0) return 
              this.network_getReviewCommentsExtraData()
          }
        },
        components: {
            ReviewComment,
            ReviewCommentCreator,
            Container: styled.div``,
            Replies: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
.reply{
    padding: 10px 15px;
}

.pending{
    border-color: #f9c513;
}
</style>