<template>
    <Container class="container flex-column flex-items-stretch">
        <textarea  rows="5" 
                    ref="textarea"
                    placeholder="Leave a comment"
                    class="d-block form-control" 
                    v-model="commentTextValue"></textarea>
       
        <Action class="d-flex flex-justify-end mt-2">
            <button class="btn" v-if="pullRequestProvided().viewerCanUpdate" @click="() => this.$emit('cancel')" :disabled="loadingUpdatePullRequestComment">
                Cancel
            </button>
            <button class="btn btn-primary ml-1" :disabled="commentTextValue === '' || loadingUpdatePullRequestComment" @click="network_updatePullRequestComment">
                {{loadingUpdatePullRequestComment ? 'Updating...' : 'Update Comment'}}
            </button>
        </Action>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {authRequiredPatch} from '@/network'
    import * as api from '@/network/api'
    export default {
        inject: ['pullRequestProvided'],

        props: {
            comment: Object
        },
        data() {
            return {
                commentTextValue: '',
                loadingUpdatePullRequestComment: false
            }
        },
        created() {
            this.commentTextValue = this.comment.body
        },
        mounted() {
            this.$refs.textarea.focus()
        },
        computed:{
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
        },
        methods: {
            async network_updatePullRequestComment() {
                try {
                    this.loadingUpdatePullRequestComment = true
                    let url = api.API_ISSUE_COMMENT({
                        repo: this.repo,
                        owner: this.owner,
                        comment: this.comment.id
                    })

                    let res = await authRequiredPatch(
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

                    this.$emit('update-comment-success',res.data)
                    Object.assign(this.$data,this.$options.data())
                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loadingUpdatePullRequestComment = false
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
    font-size: 14px;
}

</style>