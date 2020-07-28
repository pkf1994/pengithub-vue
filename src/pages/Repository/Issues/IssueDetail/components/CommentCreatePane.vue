<template>
    <Container>
        <Editor class="pt-3 mb-5" 
                v-model="markdownRaw"
                style="border-top: 2px solid #e1e4e8;" 
                ref="editor"
                uniqueId="issue-comment-create-pane"
                :disabled="closeIssueLoading || createCommentLoading"
                :textareaStyle="{height: '180px',maxHeight:'300px'}"
                :locked="locked && !viewerIsCollaborator" 
                :lockedReason="lockedReason">
            <div class="py-2 d-flex flex-justify-end" v-if="viewerIsCollaborator || viewerDidAuthor">
                <button class="btn" :disabled="createCommentLoading || closeIssueLoading" v-if="issueGetter().state == 'open'">
                    <svg class="octicon octicon-issue-closed text-red v-align-text-bottom" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 10h2v2H7v-2zm2-6H7v5h2V4zm1.5 1.5l-1 1L12 9l4-4.5-1-1L12 7l-1.5-1.5zM8 13.7A5.71 5.71 0 012.3 8c0-3.14 2.56-5.7 5.7-5.7 1.83 0 3.45.88 4.5 2.2l.92-.92A6.947 6.947 0 008 1C4.14 1 1 4.14 1 8s3.14 7 7 7 7-3.14 7-7l-1.52 1.52c-.66 2.41-2.86 4.19-5.48 4.19v-.01z"></path></svg>
                    <span class="">{{closeIssueLoading ? 'Closing...' : 'Close issue'}}</span>
                </button>
                <button class="btn btn-primary ml-1" @click="network_createIssueComment" :disabled="!markdownRaw || createCommentLoading">
                    <span class="">{{createCommentLoading ? 'Trying...' : 'Comment'}}</span>
                </button>
            </div>
            <div class="py-2 d-flex flex-justify-end" v-else>
                <button class="btn btn-primary ml-1" @click="network_createIssueComment" :disabled="!markdownRaw || createCommentLoading">
                    <span class="">{{createCommentLoading ? 'Trying...' : 'Comment'}}</span>
                </button>
            </div>
        </Editor>
    </Container>
</template>
<script>
    import styled from 'vue-styled-components'
    import {Editor} from '@/components'
    import {authRequiredAjax,cancelAndUpdateAxiosCancelTokenSource} from '@/network'
    import * as api from '@/network/api'
    export default {
        name: 'repository_issue_create_comment_pane',
        inject: ['issueGetter'],
        props: {
            locked: Boolean,
            viewerIsCollaborator: Boolean,
            viewerDidAuthor: Boolean,
            lockedReason: String,
        },
        data() {
            return {
                markdownRaw: '',
                createCommentLoading: false,
                closeIssueLoading: false
            }
        },
        methods: {
            append(payload) {
                this.markdownRaw = this.markdownRaw + payload
            },
            async network_createIssueComment() {
                if(this.createCommentLoading) return
                try{
                    this.createCommentLoading = true
                    let cancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' create_issue_comment')
                    let url = api.API_CREATE_ISSUE_COMMENT(this.$route.params)

                    let res = await authRequiredAjax(
                        url,
                        {
                            cancelToken,
                            body: this.markdownRaw
                        },
                        'post'
                    )

                    this.markdownRaw = ''

                    this.$emit('create-comment',res.data)
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.createCommentLoading = false
                }
            },
            async network_closeIssue() {
                if(this.closeIssueLoading) return
                try{
                    this.closeIssueLoading = true
                    let url = api.API_ISSUE(this.$route.params)
                    let res = await authRequiredAjax(
                        url,
                        {
                            state: 'close'
                        },
                        'patch'
                    )
                    this.$emit('close-issue',res.data)
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.closeIssueLoading = false
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