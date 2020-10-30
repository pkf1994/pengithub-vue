<template>
    <Container class="container flex-column flex-items-stretch">
        <textarea  rows="5" 
                    ref="textarea"
                    placeholder="Leave a pullRequestBody"
                    class="d-block form-control" 
                    v-model="pullRequestBodyTextValue"></textarea>
       
        <Action class="d-flex flex-justify-end mt-2">
            <button class="btn" v-if="pullRequestProvided().viewerCanUpdate" @click="() => this.$emit('cancel')" :disabled="loadingUpdatePullRequestBody">
                Cancel
            </button>
            <button class="btn btn-primary ml-1" :disabled="pullRequestBodyTextValue === '' || loadingUpdatePullRequestBody" @click="network_updatePullRequestBody">
                {{loadingUpdatePullRequestBody ? 'Updating...' : 'Update pull request body'}}
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
        data() {
            return {
                pullRequestBodyTextValue: '',
                loadingUpdatePullRequestBody: false
            }
        },
        created() {
            this.pullRequestBodyTextValue = this.pullRequestProvided().body
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
            async network_updatePullRequestBody() {
                try {
                    this.loadingUpdatePullRequestBody = true
                    let url = api.API_PULLREQUEST({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.pullRequestProvided().number
                    })

                    let res = await authRequiredPatch(
                        url,
                        {
                            body: this.pullRequestBodyTextValue
                        },
                        {
                            headers: {
                                "accept": "application/vnd.github.v3+json"
                            }
                        }
                    )

                    let event = new CustomEvent('pull-request-updated',{bubbles:true,detail:res.data})
                    this.$el.dispatchEvent(event)
                    this.$emit('cancel')

                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loadingUpdatePullRequestBody = false
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