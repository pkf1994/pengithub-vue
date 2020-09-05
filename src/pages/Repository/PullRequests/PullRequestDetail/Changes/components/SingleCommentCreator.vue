<template>
    <Container class="the-container">
        <textarea :disabled="loadingStartReview || loadingAddComment" ref="textarea" v-model="content" class="form-control" placeholder="Leave a comment" rows="5" style="width: 100%"></textarea>
        <div class="text-right position-relative no-wrap d-flex flex-justify-end">
            <button class="btn mt-2 flex-shrink-0 d-block" @click.stop="() => $emit('cancel')" :disabled="loadingStartReview || loadingAddComment">Cancel</button>
            <button class="btn mt-2 ml-1 btn-primary flex-shrink-1 truncate d-block" @click.stop="network_addSingleComment" :disabled="loadingStartReview || loadingAddComment || !content || pendingReview().loading">
                {{loadingAddComment ? 'Trying...' : 'Add comment'}}
            </button>
            <button class="btn mt-2 ml-1 btn-primary flex-shrink-0 d-block" v-if="!(pendingReview().data && pendingReview().data.databaseId)" @click.stop="network_startAReview" :disabled="loadingStartReview || loadingAddComment || !content">
                {{loadingStartReview ? 'Trying...' : 'Start a review'}}
            </button>
        </div>
    </Container>
</template>

<script>
    import ReviewCommentReplyCreator from './ReviewCommentReplyCreator'
    import {Popover} from '@/components'
    import {authRequiredGitHubGraphqlApiQuery} from '@/network'
    import * as graphql  from '../../graphql.js'
    export default {
        mixins: [ReviewCommentReplyCreator],
        inject: ['commentReviewCreatedHook','pendingReview'],
        data() {
            return {
                loadingAddComment: false
            }
        },
        methods: {
            network_addSingleComment() {
                if(this.pendingReview().emptyFlag) {
                    this.network_createCommentReview()
                } else {
                    this.network_addReviewCommentToPendingReview()
                }
            },
            async network_createCommentReview() {
                try {
                    this.loadingAddComment = true

                    await this.network_createReview('COMMENT')
                    await this.commentReviewCreatedHook()()
                    
                    this.content = ''
                    this.$emit('cancel')
                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loadingAddComment = false
                }
            },
            async network_addReviewCommentToPendingReview() {
                try{
                    this.loadingAddComment = true
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_ADD_PULL_REQUEST_REVIEW_COMMENT,
                        {
                            variables: {
                                input: {
                                    body: this.content,
                                    pullRequestReviewId: this.pendingReview().data.id,
                                    path: this.path,
                                    position: this.position,
                                }
                            }
                        }
                    )

                    try {
                        let comment = res.data.data.addPullRequestReviewComment.comment
                        await this.reviewCommentCreatedHook()(comment)
                        this.content = ''
                        this.$emit('cancel')
                    } catch (e) {
                        this.handleGraphqlError(res)
                    }
                    
                } catch (e) {
                    if(e.response && e.response.status == 422) {
                        this.$toast(this.$t("pullRequestDetailFileChangesPage.pendingReviewExistNotice"),'error')
                    }else{
                        this.handleError(e)
                    }
                } finally {
                    this.loadingAddComment = false
                }
            }
        },
        components: {
            Popover
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/dropdown/index.scss';
.the-container{
    padding-right: 15px;
    padding-left: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: #fafbfc;
    border: solid #dfe2e5;
    border-width: 1px 0;
}
.truncate{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>