<template>
    <Container>
        
        <ReviewComment class="border-top" v-for="commentItem in reviewCommentGroup" :propsData="commentItem" :key="commentItem.id"></ReviewComment>

        <div class="comment-btn-wrapper border-bottom" v-if="repoOwnerType() == 'User'">
            <div class="px-3 pb-3 bg-white" v-if="!showReviewCommentCreator && reviewCommentGroup.length > 0">
                <button :disabled="replyButtonDisabled" type="button" class="btn btn-block " @click="triggerShowReviewCommentCreator">
                    Add an additional review comment
                </button>
            </div>

            <ReviewCommentReplyCreator :position="rootReviewComment.position" 
                                        :comment="rootReviewComment"
                                        :path="rootReviewComment.path" 
                                        @cancel="() => triggerShowReviewCommentCreator(false)" 
                                        v-if="showReviewCommentCreator" 
                                        :commentId="rootReviewComment.id"></ReviewCommentReplyCreator>
        </div>
    </Container>
</template>
<script>
    import styled from 'vue-styled-components'
    import ReviewComment from './ReviewComment'
    import ReviewCommentReplyCreator from './ReviewCommentReplyCreator'
    import {mapState} from 'vuex'
    export default {
        inject: ['reviewCommentsProvided','repoOwnerType'],
        provide() {
            return {
                triggerReplyButtonDisabled:() => this.triggerReplyButtonDisabled
            }
        },
        props: {
            rootReviewComment: Object,
        },
        data() {
            return {
                showReviewCommentCreator: false,
                replyButtonDisabled: false,
            }
        },
        computed: {
            ...mapState({
                state_newCreatedReviewComments: state => state.pullRequestDetail.newCreatedReviewComments,
                state_deletedReviewComments: state => state.pullRequestDetail.deletedReviewComments,
            }),
            reviewCommentGroup() {
                let ret = [
                    this.rootReviewComment,
                    ...[...this.reviewCommentsProvided(),...this.state_newCreatedReviewComments].filter(i => i.in_reply_to_id == this.rootReviewComment.id)
                ].filter(i => {
                    return !this.state_deletedReviewComments.some(i_ => i_.id == i.id)
                })

                let DeduplicateRet = []

                ret.forEach(i => {
                    if(!DeduplicateRet.some(i_ => i_.id == i.id)) {
                        DeduplicateRet.push(i)
                    }
                })
                
                return DeduplicateRet.sort((a,b) => a.created_at > b.created_at)
            }
        },
        methods: {
            triggerShowReviewCommentCreator(flag = true) {
                this.showReviewCommentCreator = flag
            },
            triggerReplyButtonDisabled(flag = true) {
                this.replyButtonDisabled = flag
            }
        },
        components: {
            ReviewComment,
            ReviewCommentReplyCreator,
            Container: styled.div``
        }
    }
</script>
<style scoped>
.comment-btn-wrapper{
    padding-top: 0px;
    background-color: #fafbfc;
}
</style>