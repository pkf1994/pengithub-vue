<template>
    <Container class="container">
        <textarea ref="textarea" v-model="content" class="form-control" placeholder="Leave a comment" rows="5" style="width: 100%"></textarea>
        <div class="text-right">
            <button class="btn mt-2" @click="() => $emit('cancel')" :disabled="loading">Cancel</button>
            <button class="btn mt-2 ml-1 btn-primary" @click="network_addReply" :disabled="loading">{{loading ? 'Trying...' : 'Add reply'}}</button>
        </div>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {authRequiredPost,authRequiredGitHubGraphqlApiQuery} from '@/network'
    import  * as api from '@/network/api'
    import * as graphql from './graphql.js'
    import {mapMutations} from 'vuex'
    import { MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_CREATED_REVIEW_COMMENT } from '@/store/modules/pullRequestDetail/mutationTypes'
    export default {
        inject: ['reviewProvided'],
        props: {
            rootReviewComment: {
                type: Object,
                required: true
            }
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
        },
        activated() {
            this.$refs.textarea.focus()
        },
        methods: {
            ...mapMutations({
                mutation_pushNewCreatedReviewComment: MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_CREATED_REVIEW_COMMENT
            }),
            network_addReply() {
                if(this.reviewProvided().state && this.reviewProvided().state.toLowerCase() == 'pending') {
                    this.network_addReplyByGraphql()
                    return 
                }
                this.network_addReplyByRest()
            },
            async network_addReplyByRest() {
                try {
                    this.loading = true
                    let url = api.API_CREATE_REVIEW_REPLY({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number,
                        commentId: this.rootReviewComment.id
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

                    this.mutation_pushNewCreatedReviewComment(res.data)

                    /* let event = new CustomEvent('review-comment-created',{bubbles:true,detail:res.data})
                    this.$el.dispatchEvent(event) */
                    this.content = ''
                    this.$emit('cancel')
                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loading = false
                }
            },
            async network_addReplyByGraphql() {
                try {
                    this.loading = true
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_ADD_PULL_REQUEST_REVIEW_COMMENT,
                        {
                            variables: {
                                input: {
                                    body: this.content,
                                    inReplyTo: this.rootReviewComment.node_id,
                                    pullRequestReviewId: this.reviewProvided().node_id,
                                }
                            }
                        }
                    )

                    try {
                        let returnComment = res.data.data.addPullRequestReviewComment.comment
                        let createdReviewCommemt =  {
                                        ...returnComment,
                                        id: returnComment.databaseId,
                                        node_id: returnComment.id,
                                        created_at: returnComment.createdAt,
                                        in_reply_to_id: returnComment.replyTo.databaseId,
                                        pull_request_review_id: returnComment.pullRequestReview.databaseId,
                                        user: {
                                            login: returnComment.author.login,
                                            avatar_url: returnComment.author.avatarUrl
                                        },
                                        reactions: {
                                            '+1': returnComment.THUMBS_UP.totalCount,
                                            '-1': returnComment.THUMBS_DOWN.totalCount,
                                            hooray: returnComment.HOORAY.totalCount,
                                            confused: returnComment.CONFUSED.totalCount,
                                            eyes: returnComment.EYES.totalCount,
                                            heart: returnComment.HEART.totalCount,
                                            laugh: returnComment.LAUGH.totalCount,
                                            rocket: returnComment.ROCKET.totalCount,
                                            total_count: returnComment.reactions.totalCount
                                        }
                                    }
                        this.mutation_pushNewCreatedReviewComment(createdReviewCommemt)

                        let event = new CustomEvent('review-comment-created',{bubbles:true,detail:createdReviewCommemt})
                        this.$el.dispatchEvent(event)

                        this.content = ''
                        this.$emit('cancel')
                    } catch (e) {
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