<template>
    <Container>
        <Editor class="pt-2 px-2 pb-1" 
                v-model="markdownRaw"
                ref="editor"
                :disabled="editCommentLoading"
                :uniqueId="comment.id.toString()"
                :withGidelines="false"
                :textareaStyle="{height: '240px',maxHeight:'300px'}"
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
    import {authRequiredPatch,cancelAndUpdateAxiosCancelTokenSource} from '@/network'
    import * as api from '@/network/api'
    export default {
        name: 'repository_issue_comment_edit_pane',
        inject: ['issueGetter'],
        props: {
            comment: {
                type: Object,
                required: true
            },
            updateHook: Function
        },
        data() {
            return {
                markdownRaw: '',
                editCommentLoading: false,
            }
        },
        mounted() {
            this.$refs.editor.focus()
        },
        methods: {
            append(payload) {
                this.markdownRaw = this.markdownRaw + payload
            },
            async network_updateComment() {
                if(this.editCommentLoading) return
                try{
                    this.editCommentLoading = true
                    if(this.updateHook) {
                        await this.updateHook(this.markdownRaw)
                    } else {
                         let url = api.API_ISSUE_COMMENT({
                            ...this.$route.params,
                            commentId: this.comment.id
                        })

                        let res = await authRequiredPatch(
                            url,
                            {
                                body: this.markdownRaw
                            },
                        )

                        this.$emit('update-comment',res.data)
                    }
                   
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