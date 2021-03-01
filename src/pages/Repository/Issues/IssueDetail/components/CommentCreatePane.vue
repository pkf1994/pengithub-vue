<template>
    <div v-if="accessToken">
        <ComplexEditorProto v-if="viewerCanComment" v-model="markdownRaw" :disabled="loadingCreateComment || loadingChangeIssueState"  uniqueId="issue-comment-creator">
            <div class="py-2 d-flex flex-justify-end">
                <button class="btn" :disabled="loadingCreateComment || loadingChangeIssueState" v-if="issue().state == 'open' && viewerCanManageIssue()" @click="network_changeIssueState">
                    <svg class="octicon octicon-issue-closed text-red v-align-text-bottom" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 10h2v2H7v-2zm2-6H7v5h2V4zm1.5 1.5l-1 1L12 9l4-4.5-1-1L12 7l-1.5-1.5zM8 13.7A5.71 5.71 0 012.3 8c0-3.14 2.56-5.7 5.7-5.7 1.83 0 3.45.88 4.5 2.2l.92-.92A6.947 6.947 0 008 1C4.14 1 1 4.14 1 8s3.14 7 7 7 7-3.14 7-7l-1.52 1.52c-.66 2.41-2.86 4.19-5.48 4.19v-.01z"></path></svg>
                    <span class="">{{loadingChangeIssueState ? 'Closing...' : `${issue().head ? 'Close pull request' : 'close issue'}`}}</span>
                </button>
                <button class="btn" :disabled="loadingCreateComment || loadingChangeIssueState" v-if="issue().state == 'closed' && viewerCanManageIssue()" @click="network_changeIssueState">
                    <svg class="octicon octicon-issue-closed text-red v-align-text-bottom" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 10h2v2H7v-2zm2-6H7v5h2V4zm1.5 1.5l-1 1L12 9l4-4.5-1-1L12 7l-1.5-1.5zM8 13.7A5.71 5.71 0 012.3 8c0-3.14 2.56-5.7 5.7-5.7 1.83 0 3.45.88 4.5 2.2l.92-.92A6.947 6.947 0 008 1C4.14 1 1 4.14 1 8s3.14 7 7 7 7-3.14 7-7l-1.52 1.52c-.66 2.41-2.86 4.19-5.48 4.19v-.01z"></path></svg>
                    <span class="">{{loadingChangeIssueState ? 'Reopenning...' : `${issue().head ? 'Reopen pull request' : 'Reopen issue'}`}}</span>
                </button>
                <button class="btn btn-primary ml-1" @click="network_createIssueComment" :disabled="!markdownRaw || loadingCreateComment">
                    <span class="">{{loadingCreateComment ? 'Trying...' : 'Comment'}}</span>
                </button>
            </div>
        </ComplexEditorProto>

        <lockedNotice v-else-if="issue().locked" class="locked-notice">
            <svg class="octicon octicon-lock blankslate-icon" height="32" viewBox="0 0 24 24" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M6 9V7.25C6 3.845 8.503 1 12 1s6 2.845 6 6.25V9h.5a2.5 2.5 0 012.5 2.5v8a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 19.5v-8A2.5 2.5 0 015.5 9H6zm1.5-1.75C7.5 4.58 9.422 2.5 12 2.5c2.578 0 4.5 2.08 4.5 4.75V9h-9V7.25zm-3 4.25a1 1 0 011-1h13a1 1 0 011 1v8a1 1 0 01-1 1h-13a1 1 0 01-1-1v-8z"></path></svg>
            <p v-if="viewerBlocked()">You are blocked.</p>
            <p v-else-if="issue().activeLockReason">This conversation has been locked <span>as</span> <strong>{{issue().activeLockReason}}</strong> and limited to collaborators.</p>
            
        </lockedNotice>
    </div>

    <SignInNotice v-else class="flash flash-warn">
        <button class="btn btn-primary" @click="() => signIn()">Sign in</button>
        <strong>to join this conversation on GitHub.</strong>
    </SignInNotice>
</template>
<script>
    import styled from 'vue-styled-components'
    import {ComplexEditorProto} from '../../../components'
    import {authRequiredPost,authRequiredPatch} from '@/network'
    import * as api from '@/network/api'
    export default {
        name: 'repository_issue_create_comment_pane',
        inject: ['issue','viewerCanManageIssue','viewerBlocked','viewerPermission'],
        data() {
            return {
                markdownRaw: '',
                loadingCreateComment: false,
                loadingChangeIssueState: false
            }
        },
        computed: {
            issueState() {
                return this.issue().state
            },
            viewerCanComment() {
                if(this.viewerBlocked()) return false
                if(this.viewerPermission() == 'ADMIN' || this.viewerPermission() == 'TRIAGE'  || this.viewerPermission() == 'WRITE') return true
                if(!this.issue().locked) return true
                return false
            },
        },
        methods: {
          
            async network_createIssueComment() {
                if(this.loadingCreateComment) return
                try{
                    this.loadingCreateComment = true
                    let url = api.API_CREATE_ISSUE_COMMENT(this.$route.params)

                    let res = await authRequiredPost(
                        url,
                        {
                            body: this.markdownRaw
                        },
                    )

                    this.markdownRaw = ''

                    let event = new CustomEvent('new-timeline-item-created',{bubbles:true,detail:{...res.data,event:'commented'}})
                    this.$el.dispatchEvent(event)

                }catch(e) {
                    this.handleError(e)
                    if(e.response && e.response.data.message == 'Blocked') {
                        this.$el.dispatchEvent(new CustomEvent('viewer-blocked',{bubbles:true}))
                    }
                }finally{
                    this.loadingCreateComment = false
                }
            },
            async network_changeIssueState() {
                if(this.loadingChangeIssueState) return
                try{
                    this.loadingChangeIssueState = true
                    let url = api.API_ISSUE(this.$route.params)
                    let res = await authRequiredPatch(
                        url,
                        {
                            state: this.issueState == 'open' ? 'closed' : 'open'
                        },
                    )

                    this.$el.dispatchEvent(new CustomEvent('new-timeline-item-created',{bubbles:true,detail:{
                        event: this.issueState == 'open' ? 'closed' : 'reopened',
                        id: (new Date()).getTime(),
                        created_at: (new Date()).toISOString(),
                        actor: this.viewer
                    }}))

                    this.$el.dispatchEvent(new CustomEvent('issue-updated',{bubbles:true,detail:{state:res.data.state}}))

                }catch(e) {
                    this.handleError(e)
                    if(e.response && e.response.status == 422) {
                        this.$toast(`${this.$t("pullRequestDetailConversation.error.reopenFailed") + this.$t("common.error.actionResultValidationFailed")}`,'error')
                    }
                }finally{
                    this.loadingChangeIssueState = false
                }
            }   
        },
        components: {
            ComplexEditorProto,
            Container: styled.div``,
            lockedNotice: styled.div``,
            SignInNotice: styled.div``
        }
    }
</script>
<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/alerts/index.scss';
.locked-notice{
    padding: 20px 0 10px;
    margin: 15px;
    text-align: center;
    position: relative;
    svg{
        margin-right: 4px;
        margin-bottom: 8px;
        margin-left: 4px;
        color: #a3aab1;
    }
}
</style>