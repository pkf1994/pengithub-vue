<template>
    <ComplexEditorProto 
        class="px-2 pt-2" 
        :uniqueId="comment.id"
        v-model="markdownRaw" 
        :disabled="loading" 
        ref="editor" 
        :textareaStyle="{maxHeight:'327px',height:'142px'}">
        <div class="py-2 d-flex flex-justify-end">
            <button class="btn" :disabled="loading" @click="cancel">
                Cancel
            </button>
            <button class="btn btn-primary ml-1" @click="network_updateComment" :disabled="loading">
                {{loading ? 'Updating...' : 'Update comment'}}
            </button>
        </div>
    </ComplexEditorProto>
</template>
<script>
    import styled from 'vue-styled-components'
    import {ComplexEditorProto} from '../../../../../components'
    import {authRequiredPatch} from '@/network'
    import * as api from '@/network/api'
    export default {
        name: 'repository_issue_comment_edit_pane',
        props: {
            comment: {
                type: Object,
                required: true
            },
            commentType: {
                type: String,
                default: 'issueComment'
            },
            updateHook: Function
        },
        data() {
            return {
                markdownRaw: '',
                loading: false,
            }
        },
        mounted() {
            this.markdownRaw = this.comment.content
            this.$refs.editor.focus()
        },
        methods: {
            async network_updateComment() {
                if(this.loading) return
                try{
                    this.loading = true
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

                        this.$el.dispatchEvent(new CustomEvent('comment-updated',{bubbles:true,detail:res.data}))
                    }
                   
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            cancel() {
                this.$el.dispatchEvent(new CustomEvent('cancel',{bubbles:true,detail: this.markdownRaw}))
            }
        },
        components: {
            ComplexEditorProto,
            Container: styled.div``
        }
    }
</script>
<style scoped>
</style>