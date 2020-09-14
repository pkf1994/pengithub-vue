<template>
    <Container class="container">
        <textarea :disabled="loadingCreateReply || loadingStartReview" ref="textarea" v-model="content" class="form-control" placeholder="Leave a comment" rows="5" style="width: 100%"></textarea>
        <div class="text-right">
            <button class="btn mt-2" @click.stop="() => $emit('cancel')" :disabled="loadingCreateReply || loadingStartReview">Cancel</button>
            <button class="btn mt-2 ml-1" @click.stop="network_addReply" :disabled="loadingCreateReply || loadingStartReview">{{loadingCreateReply ? 'Trying...' : 'Add reply'}}</button>
            <button class="btn mt-2 ml-1 btn-primary" v-if="(!pendingReview().data && !pendingReview.loading) || loadingStartReview" @click.stop="network_createReview" :disabled="loadingCreateReply || loadingStartReview">{{loadingStartReview ? 'Trying...' : 'Start a review'}}</button>
        </div>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {authRequiredPost,authRequiredGet,authRequiredGitHubGraphqlApiQuery} from '@/network'
    import * as api from '@/network/api'
    import * as graphql  from '../../graphql.js'
    import {mapMutations} from 'vuex'
    import {MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_STARTED_REVIEW,MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_CREATED_REVIEW_COMMENT} from '@/store/modules/pullRequestDetail/mutationTypes'
    export default {
        inject: ['pendingReview','reviewStartedHook','reviewCommentCreatedHook','pullRequestProvided'],
        props: {
            comment: Object,
            path: String,
            position: [String,Number],
        },
        data() {
            return {
                content: '',
                loadingCreateReply: false,
                loadingStartReview: false,
                review: undefined
            }
        },
        computed: {
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            number() {
                return this.$route.params.number
            },
        },
        mounted() {
            this.$refs.textarea.focus()
        },
        activated() {
            this.$refs.textarea.focus()
        },
        methods: {
            ...mapMutations({
                mutation_pushNewCreatedReviewComments: MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_CREATED_REVIEW_COMMENT,
                mutation_pushNewStartedReview: MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_STARTED_REVIEW,
            }),
            async network_addReply() {
                try {
                    this.loadingCreateReply = true
                    /* let url = api.API_CREATE_REVIEW_REPLY({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number,
                        commentId: this.commentId
                    })
                    let res = await authRequiredPost(
                        url,
                        {
                            body: this.content
                        },
                        {
                            headers: {
                                "accept": "application/vnd.github.squirrel-girl-preview"
                            }
                        }
                    )

                    let event = new CustomEvent('reply-created',{detail: res.data,bubbles:true})
                    this.$el.dispatchEvent(event)
                    this.content = ''
                    this.$emit('cancel') */

                    await this.network_getReviewTheCommentBelongTo()

                    //使用graphql进行该操作是因为rest api会报错，原因未知
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_ADD_PULL_REQUEST_REVIEW_COMMENT,
                        {
                            variables: {
                                input: {
                                    body: this.content,
                                    inReplyTo: this.comment.node_id,
                                    pullRequestReviewId: this.review.node_id,
                                }
                            }
                        }
                    )

                    try {
                        let comment = res.data.data.addPullRequestReviewComment.comment
                        this.mutation_pushNewCreatedReviewComments({from:'changes',reviewComment: comment})
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
                    this.loadingCreateReply = false
                }
            },
            async network_getReviewTheCommentBelongTo() {
                if(this.review) return 
                let url = api.API_REVIEW({
                    repo: this.repo,
                    owner: this.owner,
                    number: this.number,
                    reviewId: this.comment.pull_request_review_id
                })

                let res = await authRequiredGet(url)
                this.review = res.data
               
            },
            /* async network_getTheCommentJustCreated(commentId) {
                let url = api.API_REVIEW_COMMENT_OF_PULL_REQUEST({
                    repo: this.repo,
                    owner: this.owner,
                    number: this.number,
                    commentId
                })

                let res = await authRequiredGet(url)
                return res.data
            }, */

            async network_startAReview() {
                try {
                    this.loadingStartReview = true
                    let res = await this.network_createReview()
                    
                    await this.reviewStartedHook()()
                    this.mutation_pushNewStartedReview({
                        ...res.data,
                        event: "reviewed"
                    })
                    this.content = ''
                    this.$emit('cancel')
                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loadingStartReview = false
                }
            },

            async network_createReview(event) {
                let url = api.API_CREATE_REVIEW({
                    repo: this.repo,
                    owner: this.owner,
                    number: this.number
                })

                let res = await authRequiredPost(
                    url,
                    {
                        event,
                        comments: [
                            {
                                path: this.path,
                                position: this.position,
                                body: this.content
                            }
                        ]
                    }
                )
                return res
            }
        },
        components: {
            Container: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
.container{
    padding-right: 15px;
    padding-left: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: #fafbfc;
    border: solid #dfe2e5;
    border-width: 1px 0;
}
</style>