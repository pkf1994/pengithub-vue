<template>
    <Container v-if="!deleted" class="border-top" :class="{deleting:loadingDeleteRootReviewComment}">
        
        <ReviewComment :showDiff="false" 
                        :class="{'border-top':index > 0}"
                        @root-review-comment-deleting.native="() => loadingDeleteRootReviewComment = true" 
                        @review-comment-deleted.native.stop="reviewCommentDeletedHook"
                        :isRoot="index == 0" 
                        v-for="(commentItem,index) in reviewCommentGroup" 
                        :reviewComment="commentItem" 
                        :key="commentItem.id"></ReviewComment>

        <button @click="triggerShowReviewCommentCreator" v-if="!(pullRequestProvided().locked && !viewerIsCollaborator().data) && !showReviewCommentCreator && repoOwnerType() == 'User'" class="border-top reply btn-link text-bold text-left muted-link btn-block">
            Reply...
        </button>

        <div class="comment-btn-wrapper border-bottom" v-if="repoOwnerType() == 'User'">
            <ReviewCommentReplyCreator  class="p-2"
                                        :comment="rootReviewComment"
                                        :path="rootReviewComment.path" 
                                        @cancel="() => triggerShowReviewCommentCreator(false)" 
                                        v-if="showReviewCommentCreator"></ReviewCommentReplyCreator>
        </div>
    </Container>
</template>
<script>
    import styled from 'vue-styled-components'
    import {ReviewComment} from '../../Conversation/components/TimelineItem/components/Review/components'
    import ReviewCommentReplyCreator from './ReviewCommentReplyCreator'
    import {mapState} from 'vuex'
    export default {
        inject: ['reviewCommentsProvided','repoOwnerType','pullRequestProvided','viewerIsCollaborator'],
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
                loadingDeleteRootReviewComment: false,
                deleted: false
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
            },
            reviewCommentDeletedHook(event) {
                if(event.detail.id == this.rootReviewComment.id) {
                    this.deleted = true
                }
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

.reply{
    padding: 10px 15px;
}

.deleting{
    pointer-events: none;
    opacity: .4;
}
</style>