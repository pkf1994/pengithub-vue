<template>
    <Container>
        <Editor class="pt-2 px-2 pb-1" 
                v-model="markdownRaw"
                ref="editor"
                :disabled="editCommentLoading"
                :uniqueId="comment.id.toString()"
                :withGidelines="false"
                :textareaStyle="{height: '180px',maxHeight:'300px'}"
                >
            <div class="py-2 d-flex flex-justify-end">
                <button class="btn" :disabled="editCommentLoading" @click="() => $emit('cancel',markdownRaw)">
                    Cancel
                </button>
                <button class="btn btn-primary ml-1" @click="network_updateComment" :disabled="editCommentLoading">
                    {{editCommentLoading ? 'Updating...' : 'Update comment'}}
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
        name: 'repository_issue_comment_edit_pane',
        inject: ['issueGetter'],
        props: {
            comment: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                markdownRaw: '',
                editCommentLoading: false,
            }
        },
        methods: {
            append(payload) {
                this.markdownRaw = this.markdownRaw + payload
            },
            async network_updateComment() {
                if(this.editCommentLoading) return
                try{
                    this.editCommentLoading = true
                    let cancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' update_issue_comment')
                    let url = api.API_HANDLE_ISSUE_COMMENT({
                        ...this.$route.params,
                        comment: this.comment.id
                    })

                    let res = await authRequiredAjax(
                        url,
                        {
                            cancelToken,
                            body: this.markdownRaw
                        },
                        'patch'
                    )

                    this.$emit('update-comment',res.data)
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.editCommentLoading = false
                }
            },
        },
        components: {
            Editor,
            Container: styled.div``
        }
    }
</script>
<style scoped>
</style>