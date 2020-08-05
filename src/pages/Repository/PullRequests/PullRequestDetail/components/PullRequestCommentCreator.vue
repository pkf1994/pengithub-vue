<template>
    <Container class="container flex-column flex-items-stretch">
        <textarea  rows="6" 
                    :placeholder="placeholder"
                    class="d-block form-control" 
                    id="textarea"
                    :disabled="locked || loadingCreatePullRequestComment" 
                    v-model="commentTextValue"></textarea>
       
        <Action class="d-flex flex-justify-end mt-2">
            <button class="btn" v-if="pullRequestProvided().viewerCanUpdate" :disabled="loadingCreatePullRequestComment">
                <svg class="octicon octicon-issue-closed text-red v-align-text-bottom" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 10h2v2H7v-2zm2-6H7v5h2V4zm1.5 1.5l-1 1L12 9l4-4.5-1-1L12 7l-1.5-1.5zM8 13.7A5.71 5.71 0 012.3 8c0-3.14 2.56-5.7 5.7-5.7 1.83 0 3.45.88 4.5 2.2l.92-.92A6.947 6.947 0 008 1C4.14 1 1 4.14 1 8s3.14 7 7 7 7-3.14 7-7l-1.52 1.52c-.66 2.41-2.86 4.19-5.48 4.19v-.01z"></path></svg>
                <span>Close pull request</span>
            </button>
            <button class="btn btn-primary ml-1" :disabled="commentTextValue === '' || loadingCreatePullRequestComment" @click="network_createPullRequestComment">
                <span>{{loadingCreatePullRequestComment ? 'Trying...' : 'Comment'}}</span>
            </button>
        </Action>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {authRequiredPost} from '@/network'
    import * as api from '@/network/api'
    export default {
        inject: ['pullRequestProvided'],
       
        data() {
            return {
                commentTextValue: '',
                loadingCreatePullRequestComment: false
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

                    this.$emit('create-comment-success',res.data)
                    Object.assign(this.$data,this.$options.data())
                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loadingCreatePullRequestComment = false
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

#textarea{
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