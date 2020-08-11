<template> 
    <Container  class="border-gray-dark d-flex flex-justify-start flex-wrap mt-2">
        <div v-for="item in availableReactionContent" :key="item.label">
            <button @click="() => showReactionCreatorsModal(item.content)" class="reaction-item btn-link" v-if="reactions[item.content] > 0">
                <span class="emoj mr-1">{{item.label}}</span>        
                {{reactions[item.content]}}
            </button>
        </div>
        <button class="reaction-item btn-link muted-link" v-if="accessToken && !disabled" :disabled="disabled" @click="() => showModal('pickReactionModal')">
            <svg class="octicon octicon-plus-small add-reaction-plus-icon" viewBox="0 0 7 16" version="1.1" width="7" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 4H3v3H0v1h3v3h1V8h3V7H4V4z"></path></svg>        
            <svg class="octicon octicon-smiley" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm4.81 12.81a6.72 6.72 0 01-2.17 1.45c-.83.36-1.72.53-2.64.53-.92 0-1.81-.17-2.64-.53-.81-.34-1.55-.83-2.17-1.45a6.773 6.773 0 01-1.45-2.17A6.59 6.59 0 011.21 8c0-.92.17-1.81.53-2.64.34-.81.83-1.55 1.45-2.17.62-.62 1.36-1.11 2.17-1.45A6.59 6.59 0 018 1.21c.92 0 1.81.17 2.64.53.81.34 1.55.83 2.17 1.45.62.62 1.11 1.36 1.45 2.17.36.83.53 1.72.53 2.64 0 .92-.17 1.81-.53 2.64-.34.81-.83 1.55-1.45 2.17zM4 6.8v-.59c0-.66.53-1.19 1.2-1.19h.59c.66 0 1.19.53 1.19 1.19v.59c0 .67-.53 1.2-1.19 1.2H5.2C4.53 8 4 7.47 4 6.8zm5 0v-.59c0-.66.53-1.19 1.2-1.19h.59c.66 0 1.19.53 1.19 1.19v.59c0 .67-.53 1.2-1.19 1.2h-.59C9.53 8 9 7.47 9 6.8zm4 3.2c-.72 1.88-2.91 3-5 3s-4.28-1.13-5-3c-.14-.39.23-1 .66-1h8.59c.41 0 .89.61.75 1z"></path></svg>
        </button>
        <Modal ref="pickReactionModal" :noHeader="true">
            <div class="d-flex flex-wrap">
                <div v-for="item in availableReactionContent" :key="item.label" class="col-3 lh-default">
                    <button class="width-full btn-text pt-4 pb-2 f0-light border-right border-bottom" @click="() => network_createReaction(item.content)">
                        {{item.label}}
                        <span class="f6 d-block mt-1 text-gray">{{item.content}}</span>
                    </button>
                </div>
            </div>
        </Modal>
        <Modal ref="reactionCreatorsModal" :noHeader="true">
            <div v-if="reactionCreators.loading.some(i => i == reactionCreators.showing)" style="height: 120px" class="d-flex flex-items-center flex-justify-center">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <div v-else-if="reactionCreators.showing" class="p-3">
                <span v-for="(item,index) in reactionCreators.data[reactionCreators.showing]" :key="item">
                    {{item}}<span v-if="index < reactionCreators.data[reactionCreators.showing].length - 1">,</span>  
                </span>
                <span v-if="data[reactionCreators.showing] - reactionCreators.data[reactionCreators.showing].length > 0">
                    and {{data[reactionCreators.showing] - reactionCreators.data[reactionCreators.showing].length}} more
                </span>
                created with {{reactionCreators.showing}} emoji
            </div> 
        </Modal>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Modal,LoadingIconEx} from '@/components'
    import * as api from '@/network/api'
    import {authRequiredPost,authRequiredGet} from '@/network'
    import Vue from 'vue'
    export default {
        props: {
            data: {
                type: Object,
                required: true
            },
            disabled: {
                type: Boolean,
                default: false
            },
            commentType: String,
            commentId: [String,Number]
        },
        data() {
            return {
                reactionCreators: {
                    data: {},
                    loading: [],
                    showing: undefined
                },
                availableReactionContent: [
                    {
                        label: '👍',
                        content: '+1'
                    },
                    {
                        label: '👎',
                        content: '-1'
                    },
                    {
                        label: '😄',
                        content: 'laugh'
                    },
                    {
                        label: '🎉',
                        content: 'hooray'
                    },
                    {
                        label: '😕',
                        content: 'confused'
                    },
                    {
                        label: '❤️',
                        content: 'heart'
                    },
                    {
                        label: '🚀',
                        content: 'rocket'
                    },
                    {
                        label: '👀',
                        content: 'eyes'
                    },
                ],
                reactions: {},
                loading: false
            }
        },
        created() {
            this.reactions = this.data
        },
        computed: {
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            number() {
                return this.$route.params.number
            },
        },
        methods: {
            async network_createReaction(content) {
                this.closeModal()
                try {
                    this.loading = true
                    let url
                    if(this.commentId) {
                        if(this.commentId == 'reviewComment') {
                            url = api.API_ISSUE_COMMENT_REACTIONS({
                                repo: this.repo,
                                owner: this.owner,
                                commentId: this.commentId
                            })
                        }else {
                            url = api.API_PULL_REVIEW_COMMENT_REACTIONS({
                                repo: this.repo,
                                owner: this.owner,
                                commentId: this.commentId
                            })
                        }
                    }else {
                        url = api.API_ISSUE_REACTIONS({
                            repo: this.repo,
                            owner: this.owner,
                            number: this.number
                        })
                    }

                    this.reactions[content] += 1
                    await authRequiredPost(
                        url,
                        {
                            content
                        },
                        {
                            headers: {
                                "accept": "application/vnd.github.squirrel-girl-preview+json"
                            }
                        }
                    )
                    
                } catch (e) {
                    this.handleError(e)
                    this.reactions[content] -= 1
                } finally {
                    this.loading = false
                }
            },
            async network_getReactionCreators(content) {
                if(this.reactionCreators.loading.some(i => i == content)) return 
                if(this.reactionCreators.data[content]) return 
                try {
                    this.reactionCreators.loading.push(content)
                    let url
                    if(this.commentId) {
                        url = api.API_ISSUE_COMMENT_REACTIONS({
                            repo: this.repo,
                            owner: this.owner,
                            commentId: this.commentId,
                            params: {
                                content,
                                per_page: 10
                            }
                        })
                    }else{
                        url = api.API_ISSUE_REACTIONS({
                            repo: this.repo,
                            owner: this.owner,
                            number: this.number,
                            params: {
                                content,
                                per_page: 10
                            }
                        })
                    }

                    let res = await authRequiredGet(
                        url,
                        {
                            headers: {
                                "accept": "application/vnd.github.squirrel-girl-preview"
                            }
                        }
                    )

                    Vue.set(this.reactionCreators.data,content,res.data.map(i => i.user.login))
                } catch (e) {
                    this.handleError(e)
                } finally {
                    let idx = this.reactionCreators.loading.indexOf(content)
                    this.reactionCreators.loading.splice(idx,1)
                }
            },
            showReactionCreatorsModal(content) {
                this.reactionCreators.showing = content
                this.network_getReactionCreators(content)
                this.showModal('reactionCreatorsModal')
            }
        },
        watch: {
            data() {
                this.reactions = this.data
            }
        },
        components: {
            Modal,
            LoadingIconEx,
            Container: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import "node_modules/@primer/css/layout/index.scss";
.reaction-item{
    font-size: 12px!important;
    padding-top: 4px!important;
    padding-bottom: 4px!important;
    padding-right: 8px!important;
    padding-left: 8px!important;
    display: block;
    margin-top: 4px!important;
    margin-bottom: 4px!important;
    margin-right: 8px!important;
    border-radius: 3px!important;
    border: 1px solid #e1e4e8!important;
}

button[disabled] {
    opacity: .4;
}
</style>