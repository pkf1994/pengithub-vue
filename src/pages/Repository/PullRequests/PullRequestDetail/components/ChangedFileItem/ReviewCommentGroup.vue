<template>
    <Container>
        <Comment style="max-width: 100vw;border-right: 1px solid #d1d5da;" :propsData="rootReviewComment"></Comment>

        <Comment class="border-top" v-for="commentItem in reviewCommentsProvided().filter(i => i.in_reply_to_id == rootReviewComment.id)" style="max-width: 100vw;border-right: 1px solid #d1d5da;" :propsData="commentItem" :key="commentItem.id"></Comment>

        <Comment :newCreated="true" class="border-top" v-for="commentItem in repliesJustCreated" style="max-width: 100vw;border-right: 1px solid #d1d5da;" :propsData="commentItem" :key="commentItem.id"></Comment>

        <div class="comment-btn-wrapper" v-if="repoOwnerType() == 'User'" style="border-right: 1px solid #d1d5da;">
            <div class="px-3 pb-3" v-if="!showReviewCommentCreator">
                <button type="button" class="btn btn-block" @click="triggerShowReviewCommentCreator">
                    Add an additional review comment
                </button>
            </div>

            <ReviewOrReviewCommentReplyCreator @reply-success="replyCreatedPostHandler" @cancel="() => triggerShowReviewCommentCreator(false)" v-if="showReviewCommentCreator" :commentId="rootReviewComment.id"></ReviewOrReviewCommentReplyCreator>
        </div>
    </Container>
</template>
<script>
    import styled from 'vue-styled-components'
    import Comment from './Comment'
    import ReviewOrReviewCommentReplyCreator from './ReviewOrReviewCommentReplyCreator'
    export default {
        inject: ['reviewCommentsProvided','repoOwnerType'],
        props: {
            rootReviewComment: Object
        },
        data() {
            return {
                showReviewCommentCreator: false,
                repliesJustCreated: []
            }
        },
        methods: {
            triggerShowReviewCommentCreator(flag = true) {
                this.showReviewCommentCreator = flag
            },
            replyCreatedPostHandler(payload) {
                this.showReviewCommentCreator = false
                this.repliesJustCreated.push(payload)
            }
        },
        components: {
            Comment,
            ReviewOrReviewCommentReplyCreator,
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