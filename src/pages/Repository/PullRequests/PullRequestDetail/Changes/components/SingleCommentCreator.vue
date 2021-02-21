<template>
    <ComplexEditorProto ref="textarea" :uniqueId="path + line + side" class="px-3 pt-2 pb-3" v-model="content" :disabled="loadingStartReview || loadingAddComment">
        <div class="text-right position-relative no-wrap">
            <button class="btn mt-2 d-block width-full" @click.stop="() => $emit('cancel')" :disabled="loadingStartReview || loadingAddComment">Cancel</button>
            <button class="btn mt-2 btn-primary truncate d-block width-full" @click.stop="network_addSingleComment" :disabled="loadingStartReview || loadingAddComment || !content || pendingReview().loading">
                {{loadingAddComment ? 'Trying...' : 'Add comment'}}
            </button>
            <button class="btn mt-2 btn-primary d-block width-full" v-if="!(pendingReview().data && pendingReview().data.databaseId)" @click.stop="network_startAReview" :disabled="loadingStartReview || loadingAddComment || !content">
                {{loadingStartReview ? 'Trying...' : 'Start a review'}}
            </button>
        </div>
    </ComplexEditorProto>
</template>

<script>
    import ReviewCommentReplyCreator from './ReviewCommentReplyCreator'
    import {ComplexEditorProto} from '../../../../components'
    import {authRequiredGitHubGraphqlApiQuery} from '@/network'
    import * as graphql  from '../../graphql.js'
    import {MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_SUBMITTED_REVIEW,MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_CREATED_REVIEW_COMMENT} from '@/store/modules/pullRequestDetail/mutationTypes'
    import {mapMutations} from 'vuex'
    export default {
        mixins: [ReviewCommentReplyCreator],
        inject: ['pendingReview','commentReviewCreatedHook'],
        data() {
            return { 
                loadingAddComment: false
            }
        },
        methods: {
            ...mapMutations({
                mutation_pushNewCreatedReviewComments: MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_CREATED_REVIEW_COMMENT,
                mutation_pushNewSubmittedReview: MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_SUBMITTED_REVIEW
            }),
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

                    let res = await this.network_createReview('COMMENT')
                    
                    await this.commentReviewCreatedHook()(res.data)

                    this.mutation_pushNewSubmittedReview({
                        ...res.data,
                        event: "reviewed"
                    })

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
                                    line: this.line,
                                    side: this.side
                                }
                            }
                        }
                    )

                    try {
                        let comment = res.data.data.addPullRequestReviewComment.comment
                        this.mutation_pushNewCreatedReviewComments(
                            {
                                ...comment,
                                id: comment.databaseId,
                                node_id: comment.id,
                                created_at: comment.createdAt,
                                pull_request_review_id: comment.pullRequestReview.databaseId,
                                user: {
                                    login: comment.author.login,
                                    avatar_url: comment.author.avatarUrl
                                },
                                reactions: {
                                    '+1': comment.THUMBS_UP.totalCount,
                                    '-1': comment.THUMBS_DOWN.totalCount,
                                    hooray: comment.HOORAY.totalCount,
                                    confused: comment.CONFUSED.totalCount,
                                    eyes: comment.EYES.totalCount,
                                    heart: comment.HEART.totalCount,
                                    laugh: comment.LAUGH.totalCount,
                                    rocket: comment.ROCKET.totalCount,
                                    total_count: comment.reactions.totalCount
                                }
                            }
                        )
                        this.content = ''
                        this.$emit('cancel')
                    } catch (e) {
                        console.log(e)
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
            ComplexEditorProto
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