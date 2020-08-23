<template> 
    <button :disabled="loading" @click="network_deleteThisComment">
        {{loading ? 'Trying...' : 'Delete'}}
    </button>
</template>

<script>
    import {authRequiredDelete} from '@/network'
    import * as api from '@/network/api'
    export default {
        data() {
            return {
                loading: false
            }
        },
        props: {
            commentType: String,
            beginDeleteHook: {
                type: Function,
                default: () => {}
            },
            comment: {
                type: Object,
                default: () => ({})
            },
        },
        computed: {
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
        },
        methods: {
            async network_deleteThisComment() {
                if(this.loading) return
                if(!confirm("Are you sure you want to delete this comment?")) return
                this.beginDeleteHook()
                try {
                    this.loading = true
                     let url
                    if(this.commentType == 'reviewComment') {
                        url = api.API_REVIEW_COMMENT_OF_PULL_REQUEST({
                            repo: this.repo,
                            owner: this.owner,
                            commentId: this.comment.id
                        })
                    }else {
                        url = api.API_ISSUE_COMMENT({
                            repo: this.repo,
                            owner: this.owner,
                            commentId: this.comment.id
                        })
                    }
                    await authRequiredDelete(
                        url,
                        {
                            headers: {
                                "accept":"application/vnd.github.v3+json"
                            }
                        }
                    )
                    let event = new CustomEvent('comment-deleted',{bubbles:true,detail: this.comment})
                    this.$el.dispatchEvent(event)
                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loading = false
                }
            },
        },
       
    }
</script>
