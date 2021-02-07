<template>
    <Container>
        <Editor class="pt-3 mb-5" 
                v-model="markdownRaw"
                style="border-top: 2px solid #e1e4e8;" 
                ref="editor"
                uniqueId="issue-comment-create-pane"
                :disabled="loadingChangeIssueState || loadingCreateComment"
                :textareaStyle="{height: '180px',maxHeight:'300px'}"
                :locked="locked" 
                :lockedReason="lockedReason">
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
        </Editor>
    </Container>
</template>
<script>
    import styled from 'vue-styled-components'
    import {Editor} from '@/components'
    import {authRequiredPost,authRequiredPatch,cancelAndUpdateAxiosCancelTokenSource} from '@/network'
    import * as api from '@/network/api'
    export default {
        name: 'repository_issue_create_comment_pane',
        inject: ['issue','graphqlWritePermission','viewerCanManageIssue'],
        props: {
            locked: Boolean,
            lockedReason: String,
        },
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
            }
        },
        methods: {
            append(payload) {
                this.markdownRaw = this.markdownRaw + payload
            },
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
                }finally{
                    this.loadingChangeIssueState = false
                }
            }   
        },
        components: {
            Editor,
            Container: styled.div``
        }
    }
</script>
<style scoped>
</style>