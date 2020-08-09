<template>
<Container class="flash flash-warn flash-full" style="padding-bottom: 8px">
    <button class="flash-close" :disabled="loading" @click="() => $emit('cancel')" type="button">
        <svg aria-label="Cancel hiding comment" class="octicon octicon-x" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>
    </button>
    <h3 class="f4">Choose a reason for hiding this comment</h3>
    <p class="mb-3">
        The reason will be displayed to describe this comment to others. 
        <HyperlinkWrapper>
            <a href="https://help.github.com/articles/managing-disruptive-comments/#hiding-a-comment">
                Learn more
            </a>
        </HyperlinkWrapper>
        .
    </p>

    <div class="d-flex flex-wrap">
        <select name="classifier" class="form-select mb-2 mr-2" required v-model="reason" :disabled="loading">
            <option value="">
                Choose a reason
            </option>
            <option value="SPAM">Spam</option>
            <option value="ABUSE">Abuse</option>
            <option value="OFF_TOPIC">Off Topic</option>
            <option value="OUTDATED">Outdated</option>
            <option value="DUPLICATE">Duplicate</option>
            <option value="RESOLVED">Resolved</option>
        </select>

        <button type="submit" class="btn" style="height:34px;" :disabled="!reason || loading" @click="network_minimizeThisComment">
            {{loading ? 'Trying...' : 'Hide comment'}}
        </button>
    </div>
</Container>
</template>
<script>
    import {authRequiredGitHubGraphqlApiQuery } from '@/network'
    import {HyperlinkWrapper} from '@/components'
    import * as graphql from './graphql'
    import styled from 'vue-styled-components'
    export default {
        props: {
            comment: Object
        },
        data() {
            return {
                reason: '',
                loading: false,
                unminimizeLoading: false,
            }
        },
        methods: {
            async network_minimizeThisComment() {
                if(this.loading) return
                if(!this.reason) {
                    this.$toast('Please choose a minimize reason.')
                    return 
                }
                try{
                    this.loading = true
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_MUTATION_MINIMIZE_COMMENT,
                        {
                            variables: {
                                subjectId: this.comment.node_id,
                                classifier: this.reason
                            }
                        }
                    )
                    
                    try{
                        this.$emit('minimize-comment',{
                            comment: this.comment,
                            info: res.data.data.minimizeComment.minimizedComment
                        })
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
        components: {
            HyperlinkWrapper,
            Container: styled.div``,
        }
    }
</script>
<style scoped lang="scss">
@import 'node_modules/@primer/css/alerts/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
</style>