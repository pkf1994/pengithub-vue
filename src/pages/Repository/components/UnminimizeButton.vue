<template> 
    <button :disabled="loading" @click="network_unminimizeThisComment">
        {{loading ? 'Trying...' : 'Unhide'}}
    </button>
</template>

<script>
    import {authRequiredGitHubGraphqlApiQuery} from '@/network'
    import * as graphql from './graphql'
    export default {
        data() {
            return {
                loading: false
            }
        },
        props: {
            comment: {
                type: Object,
                default: () => ({})
            },
        },
        methods: {
            async network_unminimizeThisComment() {
                if(this.loading) return
                try{
                    this.loading = true
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_MUTATION_UNMINIMIZE_COMMENT,
                        {
                            variables: {
                                subjectId: this.comment.node_id,
                            }
                        }
                    )
                    
                    try{
                        this.$emit('unminimize-comment',{
                            comment: this.comment,
                            info: res.data.data.unminimizeComment.unminimizedComment
                        })
                        this.closeModal()
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }

                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
        },
       
    }
</script>
