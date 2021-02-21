<template>
    <ComplexEditorProto ref="editor" :uniqueId="comment.url" class="container" v-model="content" :disabled="loading">
        <div class="text-right">
            <button class="btn mt-2 d-block width-full" @click="() => $emit('cancel')" :disabled="loading">Cancel</button>
            <button class="btn mt-2 btn-primary d-block width-full" @click="network_updateComment" :disabled="loading">{{loading ? 'Updating...' : 'Update Comment'}}</button>
        </div>
    </ComplexEditorProto>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ComplexEditorProto} from '../../../../../../../../components'
    import {authRequiredPost,authRequiredGitHubGraphqlApiQuery} from '@/network'
    import  * as api from '@/network/api'
    import * as graphql from './graphql.js'
    import { mapMutations } from 'vuex'
    import { MUTATION_PULL_REQUEST_DETAIL_PUSH_UPDATED_REVIEW_COMMENT } from '@/store/modules/pullRequestDetail/mutationTypes.js'
    export default {
        inject: ['reviewCommentsExtraData'],
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
            commentExtraData() {
                return this.reviewCommentsExtraData().filter(i => i.id == this.comment.node_id)[0]
            }
        },
        mounted() {
            this.$refs.editor.focus()
            this.content = this.comment.body
        },
        activated() {
            this.$refs.editor.focus()
        },
        methods: {
            ...mapMutations({
                mutation_pushUpdatedReviewComments: MUTATION_PULL_REQUEST_DETAIL_PUSH_UPDATED_REVIEW_COMMENT
            }),
            network_updateComment() {
                if(this.commentExtraData.state.toLowerCase() == 'pending') {
                    this.network_updateCommentByGraphql()
                    return
                }
                this.network_updateCommentByRest()
            },
            async network_updateCommentByRest() {
                try {
                    this.loading = true
                    let url = this.comment.url
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

                    this.$el.dispatchEvent(new CustomEvent('cancel',{bubbles: true}))
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

                        this.$el.dispatchEvent(new CustomEvent('cancel',{bubbles: true}))
                        
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
            ComplexEditorProto,
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