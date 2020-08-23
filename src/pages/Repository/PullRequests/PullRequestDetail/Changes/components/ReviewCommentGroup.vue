<template>
    <Container>
        <ReviewComment style="max-width: 100vw;border-right: 1px solid #d1d5da;" :propsData="rootReviewComment"></ReviewComment>
        
        <ReviewComment class="border-top" v-for="commentItem in reviewCommentsProvided().filter(i => i.in_reply_to_id == rootReviewComment.id)" style="max-width: 100vw;border-right: 1px solid #d1d5da;" :propsData="commentItem" :key="commentItem.id"></ReviewComment>

        <div class="comment-btn-wrapper" v-if="repoOwnerType() == 'User'" style="border-right: 1px solid #d1d5da;">
            <div class="px-3 pb-3" v-if="!showReviewCommentCreator">
                <button :disabled="replyButtonDisabled" type="button" class="btn btn-block" @click="triggerShowReviewCommentCreator">
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
    width: 100vw;
    padding-top: 0px;
    background-color: #fafbfc;
}
</style>