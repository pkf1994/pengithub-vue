<template>
    <Container class="container bg-white">
        <textarea :disabled="loading" ref="textarea" v-model="content" class="form-control input-contrast" placeholder="Leave a comment" rows="5" style="width: 100%"></textarea>

        <EventSelectPane class="bubble mt-3" v-if="!viewerIsPullRequestOwner">
            <label for="review-comment" class="list-item">
                <input v-model="event" type="radio" id="review-comment" class="merge-option-radio" value="COMMENT">
                Comment
                <small class="byline">Submit general feedback without explicit approval.</small>
            </label>
            <label for="review-approve" class="list-item">
                <input v-model="event" type="radio" id="review-approve" class="merge-option-radio" value="APPROVE">
                Approve
                <small class="byline">
                    Submit feedback and approve merging these changes.
                </small>
            </label>
            <label for="review-reject" class="list-item">
                <input v-model="event" type="radio" id="review-reject" class="merge-option-radio" value="REQUEST_CHANGES">
                Request changes
                <small class="byline">
                    Submit feedback that must be addressed before merging.
                </small>
            </label>
        </EventSelectPane>
        <button class="btn btn-primary btn-block mt-3" @click.stop="network_submitReview" :disabled="loading || pendingReview().loading || ( !content && !pendingReview().data.databaseId ) ">
            {{loading ? 'Trying...' : 'Submit review'}}
        </button>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {authRequiredPost,authRequiredGitHubGraphqlApiQuery} from '@/network'
    import * as api from '@/network/api'
    import * as graphql  from '../../graphql.js'
    import {mapMutations} from 'vuex'
    import {MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_SUBMITTED_REVIEW} from '@/store/modules/pullRequestDetail/mutationTypes'
    export default {
        inject: ['pendingReview','pullRequestProvided'],
        props: {
            commentId: [String,Number],
            path: String,
        },
        data() {
            return {
                content: '',
                event: 'COMMENT',
                loading: false,
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
            viewerIsPullRequestOwner() {
                return this.viewer.login == (this.pullRequestProvided().data.user && this.pullRequestProvided().data.user.login)
            }
        },
        methods: {
            ...mapMutations({
                mutation_pushNewSubmittedReview: MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_SUBMITTED_REVIEW
            }),
            async network_submitReview() {
                try {
                    this.loading = true

                    let url 
                    if(this.pendingReview().data.databaseId) {
                        url = api.API_SUBMIT_REVIEW({
                            repo: this.repo,
                            owner: this.owner,
                            number: this.number,
                            reviewId: this.pendingReview().data.databaseId
                        })
                    }else {
                        url = api.API_CREATE_REVIEW({
                            repo: this.repo,
                            owner: this.owner,
                            number: this.number,
                        })
                    }
               
                    let res = await authRequiredPost(
                        url,
                        {
                            body: this.content,
                            event: this.viewerIsPullRequestOwner ? 'COMMENT' : this.event
                        },
                        {
                            headers: {
                                "accept": "application/vnd.github.squirrel-girl-preview"
                            }
                        }
                    )

                    this.mutation_pushNewSubmittedReview({
                        ...res.data,
                        event: "reviewed"
                    })

                    //this.reviewSubmittedHook()(res.data)

                    this.$router.push(`/${this.owner}/${this.repo}/pull/${this.number}?new_created_timeline_item=${res.data.id}`)
                    
                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loading = false
                }
            },
        },
        components: {
            Container: styled.div``,
            EventSelectPane: styled.div``,
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
    font-size: 12px;
    color: #586069;
}

.bubble {
    padding: 0;
    margin: 0 15px 15px;
    margin-right: 0;
    margin-left: 0;
    color: #24292e;
    overflow: hidden;
    word-break: break-word;
    word-wrap: break-word;
    white-space: normal;
    background: #fff;
    border: 1px solid #d1d5da;
    border-radius: 6px;
}

.list-item{
    position: relative;
    display: block;
    width: 100%;
    padding: 14px 15px 14px 35px;
    padding-top: 10px;
    padding-bottom: 10px;
    overflow-wrap: break-word;
    line-height: inherit;
    text-align: left;
    .byline {
        display: block;
        margin: 0;
        font-size: 12px;
        color: #586069;
        font-weight: 400;
    }
}

.merge-option-radio {
    position: absolute;
    top: 12px;
    left: 12px;
    margin-right: 3px;
}
</style>