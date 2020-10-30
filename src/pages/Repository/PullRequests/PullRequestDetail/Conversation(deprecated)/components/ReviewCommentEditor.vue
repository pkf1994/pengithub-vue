<template>
    <Container class="container">
        <textarea ref="textarea" v-model="content" class="form-control" placeholder="Leave a comment" rows="5" style="width: 100%"></textarea>
        <div class="text-right">
            <button class="btn mt-2" @click="() => $emit('cancel')" :disabled="loading">Cancel</button>
            <button class="btn mt-2 ml-1 btn-primary" @click="network_updateComment" :disabled="loading">{{loading ? 'Updating...' : 'Update Comment'}}</button>
        </div>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {authRequiredPost,authRequiredGitHubGraphqlApiQuery} from '@/network'
    import  * as api from '@/network/api'
    import * as graphql from '../../graphql.js'
import { mapMutations } from 'vuex'
import { MUTATION_PULL_REQUEST_DETAIL_PUSH_UPDATED_REVIEW_COMMENT } from '../../../../../../store/modules/pullRequestDetail/mutationTypes.js'
    export default {
        inject: ['reviewProvided'],
        props: {
            comment: Object
        },
        data() {
            return {
                content: '',
                loading: false
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
            this.content = this.comment.body
        },
        activated() {
            this.$refs.textarea.focus()
        },
        methods: {
            ...mapMutations({
                mutation_pushUpdatedReviewComments: MUTATION_PULL_REQUEST_DETAIL_PUSH_UPDATED_REVIEW_COMMENT
            }),
            network_updateComment() {
                if(this.reviewProvided().state && this.reviewProvided().state.toLowerCase() == 'pending') {
                    this.network_updateCommentByGraphql()
                    return
                }
                this.network_updateCommentByRest()
            },
            async network_updateCommentByRest() {
                try {
                    this.loading = true
                    let url = api.API_REVIEW_COMMENT_OF_PULL_REQUEST({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number,
                        commentId: this.comment.id
                    })
                    let res = await authRequiredPost(
                        url,
                        {
                            body: this.content
                        },
                        {
                            headers: {
                                "accept": "application/vnd.github.v3+json"
                            }
                        }
                    )

                     this.mutation_pushUpdatedReviewComments(res.data)

                      this.$emit('cancel')
                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loading = false
                }
            },
            async network_updateCommentByGraphql() {
                try {
                    this.loading = true
                    let url = api.API_REVIEW_COMMENT_OF_PULL_REQUEST({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number,
                        commentId: this.comment.id
                    })
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_UPDATE_PULL_REVIEW_COMMENT,
                        {
                            variables: {
                                input: {
                                    body: this.content,
                                    pullRequestReviewCommentId: this.comment.node_id
                                }
                            }
                        }
                    )

                    try{
                        let graphqlReturnComment = res.data.data.updatePullRequestReviewComment.pullRequestReviewComment
                    
                        let updatedComment = {
                            ...graphqlReturnComment,
                            id: graphqlReturnComment.databaseId,
                            node_id: graphqlReturnComment.id,
                            created_at: graphqlReturnComment.createdAt,
                            in_reply_to_id: graphqlReturnComment.replyTo.databaseId,
                            pull_request_review_id: graphqlReturnComment.pullRequestReview.databaseId,
                            user: {
                                login: graphqlReturnComment.author.login,
                                avatar_url: graphqlReturnComment.author.avatarUrl
                            },
                            reactions: {
                                '+1': graphqlReturnComment.THUMBS_UP.totalCount,
                                '-1': graphqlReturnComment.THUMBS_DOWN.totalCount,
                                hooray: graphqlReturnComment.HOORAY.totalCount,
                                confused: graphqlReturnComment.CONFUSED.totalCount,
                                eyes: graphqlReturnComment.EYES.totalCount,
                                heart: graphqlReturnComment.HEART.totalCount,
                                laugh: graphqlReturnComment.LAUGH.totalCount,
                                rocket: graphqlReturnComment.ROCKET.totalCount,
                                total_count: graphqlReturnComment.reactions.totalCount
                            }

                        }
                        
                        this.mutation_pushUpdatedReviewComments(updatedComment)

                        this.$emit('cancel')
                        
                    }catch(e) {
                        console.log(e)
                        this.handleGraphqlError(res)
                    }
                    
                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loading = false
                }
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
}
</style>