<template>
    <Container>
        <div v-if="accessToken" class="flex-column flex-items-stretch"> 
            <textarea  rows="6" 
                    :placeholder="placeholder"
                    class="d-block form-control" 
                    :disabled="locked || loading" 
                    v-model="commentTextValue"></textarea>
        
            <Action class="d-flex flex-justify-end mt-2">
                <button class="btn" @click="network_changePullRequestState" v-if="pullRequestProvided().viewerCanUpdate" :disabled="loading">
                    <span v-if="pullRequestProvided().state == 'open'">{{loadingChangePullRequestState ? 'Trying...' : 'Close pull request'}}</span>
                    <span v-else-if="pullRequestProvided().state == 'closed'">{{loadingChangePullRequestState ? 'Trying...' : 'Reopen pull request'}}</span>
                </button>
                <button class="btn btn-primary ml-1" :disabled="commentTextValue === '' || loading" @click="network_createPullRequestComment">
                    <span>{{loadingCreatePullRequestComment ? 'Trying...' : 'Comment'}}</span>
                </button>
            </Action>
        </div>
        
        <div v-else>
            <button class="btn btn-block" @click="() => signIn()">Sign in to comment</button>
        </div>
    </Container>

</template>

<script>
    import styled from 'vue-styled-components'
    import {authRequiredPost,authRequiredPatch} from '@/network'
    import * as api from '@/network/api'
    export default {
        inject: ['pullRequestProvided','commentCreatedHook'],
        data() {
            return {
                commentTextValue: '',
                loadingCreatePullRequestComment: false,
                loadingChangePullRequestState: false
            }
        },
        computed:{
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            number() {
                return this.$route.params.number
            },
            locked() {
                return this.pullRequestProvided().locked && !this.pullRequestProvided().viewerCanUpdate
            },
            lockedReason() {
                return this.pullRequestProvided().activeLockReason
            },
            placeholder() {
                if(!this.locked) return 'Leave a comment'
                return `This conversation has been locked ${this.lockedReason} and limited to collaborators.`
            },
            loading() {
                return this.loadingCreatePullRequestComment || this.loadingChangePullRequestState
            }
        },
        methods: {
            async network_createPullRequestComment() {
                try {
                    this.loadingCreatePullRequestComment = true
                    let url = api.API_CREATE_ISSUE_COMMENT({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number
                    })

                    let res = await authRequiredPost(
                        url,
                        {
                            body: this.commentTextValue
                        },
                        {
                            headers: {
                                "accept": "application/vnd.github.v3+json"
                            }
                        }
                    )

                    this.commentCreatedHook()({
                        ...res.data,
                        event: 'commented',
                    })
                    Object.assign(this.$data,this.$options.data())
                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loadingCreatePullRequestComment = false
                }
            },
            async network_changePullRequestState() {
                try {
                    this.loadingChangePullRequestState = true
                    let url = api.API_PULLREQUEST({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number
                    })

                    let res = await authRequiredPatch(
                        url,
                        {
                            state: this.pullRequestProvided().state == 'open' ? 'closed' : 'open'
                        },
                        {
                            headers: {
                                "accept": "application/vnd.github.v3+json"
                            }
                        }
                    )

                    let pullRequestUpdatedEvent = new CustomEvent('pull-request-updated',{bubbles: true, detail: res.data})
                    this.$el.dispatchEvent(pullRequestUpdatedEvent)

                    let pullRequestStateChangedEvent = new CustomEvent(
                        'pull-request-state-changed',
                        {
                            bubbles: true, 
                            detail: {
                                created_at: (new Date()).toISOString(),
                                id: (new Date()).getTime(),
                                event: res.data.state == 'closed' ? 'closed' : 'reopened',
                                actor: {
                                    login: this.viewer.login,
                                    avatar_url: this.viewer.avatarUrl
                                }
                            }
                        }
                    )
                    this.$el.dispatchEvent(pullRequestStateChangedEvent)
                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loadingChangePullRequestState = false
                }
            }
        },
        components: {
            Container: styled.div``,
            Header: styled.div``,
            Action: styled.div``,
        }
    }
</script>

<style scoped lang='scss'>
@import 'node_modules/@primer/css/forms/index.scss';
.header{
    padding: 25px 15px 7.5px;
    font-size: 12px;
    font-weight: 600;
    color: #586069;
    border-top: 1px solid #dfe2e5;
    border-bottom: 1px solid #dfe2e5;
}

textarea{
    max-height: 451.2px;
    border-bottom: 1px solid #e1e4e8;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    display: block;
    min-height: 100px;
    padding: 8px;
    resize: vertical;
    width: 100%;
    margin: 0;
    line-height: 1.6;
    background-color: #fafbfc;
    overflow: auto;
    height: 100px;
}

</style>