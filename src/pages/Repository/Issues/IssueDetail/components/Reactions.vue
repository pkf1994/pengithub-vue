<template>
    <div v-if="viewerCanReact || (reactionsData && reactionsData.some(i => i.totalCount > 0))" class="border-top">
        <div class="reactions">
            <button class="reaction-item btn-link" 
                :style="reactionItemStyle"
                :class="{'user-has-reacted':item.viewerHasReacted}" 
                v-for="item in reactionsData.filter(i => i.totalCount > 0)" 
                :key="item.content" 
                :disabled="!viewerCanReact || loadingCreateReaction" @click="() => network_createReaction(item)">
                {{item.label}}    
                {{item.totalCount}}  
            </button>
            <button v-if="viewerCanReact" :disabled="loadingCreateReaction" class="reaction-item muted-link d-inline-block position-relative" style="border-color:transparent;padding-right:4px;padding-left:4px" @click="() => showModal('pickReactionModal')">
                <span style="color:transparent">👍1</span>    
                <div class="position-absolute d-flex flex-justify-center flex-items-center" style="top:0;left:0;right:0;bottom:0">  
                    <svg class="octicon octicon-smiley" style="margin-top:2px" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM5 8a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zM5.32 9.636a.75.75 0 011.038.175l.007.009c.103.118.22.222.35.31.264.178.683.37 1.285.37.602 0 1.02-.192 1.285-.371.13-.088.247-.192.35-.31l.007-.008a.75.75 0 111.222.87l-.614-.431c.614.43.614.431.613.431v.001l-.001.002-.002.003-.005.007-.014.019a1.984 1.984 0 01-.184.213c-.16.166-.338.316-.53.445-.63.418-1.37.638-2.127.629-.946 0-1.652-.308-2.126-.63a3.32 3.32 0 01-.715-.657l-.014-.02-.005-.006-.002-.003v-.002h-.001l.613-.432-.614.43a.75.75 0 01.183-1.044h.001z"></path></svg>
                </div>
                <div v-if="loadingCreateReaction" class="position-absolute bg-white d-flex flex-justify-center flex-items-center" style="top:0;left:0;right:0;bottom:0">  
                    <LoadingIcon :size="22" v-if="true"></LoadingIcon>
                </div>
            </button>
            
        </div>

        <Modal ref="pickReactionModal" title="Pick your reaction">
            <div class="d-flex flex-wrap mx-2 py-1">
                <button :class="{'border-gray-dark bg-blue-light':item.viewerHasReacted}" 
                        :disabled="loadingCreateReaction" 
                        :value="item.content" 
                        v-for="item in reactionsData" 
                        @click="() => network_createReaction(item)" 
                        :key="item.label" 
                        class="btn-link col-3 d-flex flex-justify-center flex-items-center no-underline add-reactions-options-item">
                    {{item.label}}
                </button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Modal,LoadingIcon} from '@/components'
    import * as api from '@/network/api'
    import {authRequiredGet,authRequiredPost,authRequiredDelete,authRequiredGitHubGraphqlApiQuery} from '@/network'
    import * as graphql from './TimelineItem/components/graphql'
    import * as actionTypes from '@/store/modules/graphqlData/actionTypes'
    import {mapState,mapActions} from 'vuex'
    export default {
        data() {
            return {
                reactions:{
                    data: {},
                    loading: false
                },
                availableReaction: [
                    {
                        label: "👍",
                        content: "+1"
                    },
                    {
                        label: "👎",
                        content: "-1"
                    },
                    {
                        label: "😄",
                        content: "laugh"
                    },
                    {
                        label: "🎉",
                        content: "hooray"
                    },
                    {
                        label: "😕",
                        content: "confused"
                    },
                    {
                        label: "❤️",
                        content: "heart"
                    },
                    {
                        label: "🚀",
                        content: "rocket"
                    },
                    {
                        label: "👀",
                        content: "eyes"
                    },
                ],
                loadingCreateReaction: false,
                reactionsViewerHasReacted: []
            }
        },
        props: {
            reactionsHost: {
                type: Object,
                default: true
            },
            reactionsHostType: {
                type: String,
                default: 'issueComment'
            },
            reactionItemStyle: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            nodeId() {
                return this.reactionsHost.node_id
            },
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            viewerCanReact() {
                if(this.graphqlData) return this.graphqlData.viewerCanReact
            },
            reactionsData() {
                if(this.graphqlData) return [
                    {
                    label: "👍",
                    content: "+1",
                    ...this.graphqlData.THUMBS_UP
                },
                {
                    label: "👎",
                    content: "-1",
                    ...this.graphqlData.THUMBS_DOWN
                },
                {
                    label: "😄",
                    content: "laugh",
                    ...this.graphqlData.LAUGH
                },
                {
                    label: "🎉",
                    content: "hooray",
                    ...this.graphqlData.HOORAY
                },
                {
                    label: "😕",
                    content: "confused",
                    ...this.graphqlData.CONFUSED
                },
                {
                    label: "❤️",
                    content: "heart",
                    ...this.graphqlData.HEART
                },
                {
                    label: "🚀",
                    content: "rocket",
                    ...this.graphqlData.ROCKET
                },
                {
                    label: "👀",
                    content: "eyes",
                    ...this.graphqlData.EYES
                },
                ]
            }
        },
        methods: {
            ...mapActions({
                action_GetIssueCommentGraphqlData: actionTypes.GET_NODES
            }),
            async network_createReaction({viewerHasReacted,content}) {
                this.closeModal()
                
                try{
                    this.loadingCreateReaction = true
                    let url
                    switch(this.reactionsHostType) {
                        case 'issueComment':
                            url = api.API_ISSUE_COMMENT_REACTIONS({
                                repo: this.repo,
                                owner: this.owner,
                                commentId: this.reactionsHost.id
                            })
                            break;
                        case 'issue':
                            url = api.API_ISSUE_REACTIONS({
                                repo: this.repo,
                                owner: this.owner,
                                number: this.reactionsHost.number
                            })
                            break;
                        case 'reviewComment':
                            url = api.API_PULL_REVIEW_COMMENT_REACTIONS({
                                repo: this.repo,
                                owner: this.owner,
                                comment: this.reactionsHost.id
                            })
                            break;
                        case 'commitComment':
                            url = api.API_COMMIT_COMMENT_REACTIONS({
                                repo: this.repo,
                                owner: this.owner,
                                commentId: this.reactionsHost.id
                            })
                            break;
                        default:
                    }
                    if(!url) return

                    let res = await authRequiredPost(
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

                    if(viewerHasReacted) {
                        await this.network_deleteReaction(res.data)
                        return 
                    }

                    await this.action_GetIssueCommentGraphqlData({
                        id: this.reactionsHost.node_id,
                        graphql: graphql.NODES_ISSUE_COMMENT,
                        sync: true
                    })

                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loadingCreateReaction = false
                }
            },
            async network_deleteReaction(reaction) {
                let url
                switch(this.reactionsHostType) {
                    case 'issueComment':
                        url = api.API_ISSUE_COMMENT_REACTION({
                            repo: this.repo,
                            owner: this.owner,
                            commentId: this.reactionsHost.id,
                            reactionId: reaction.id,
                        })
                        break;
                    case 'issue':
                        url = api.API_ISSUE_REACTION({
                            repo: this.repo,
                            owner: this.owner,
                            number: this.reactionsHost.number,
                            reactionId: reaction.id
                        })
                        break;
                    case 'reviewComment':
                        url = api.API_REVIEW_COMMENT_REACTION({
                            repo: this.repo,
                            owner: this.owner,
                            commentId: this.reactionsHost.id,
                            reactionId: reaction.id,
                        })
                        break;
                    case 'commitComment':
                        url = api.API_COMMIT_COMMENT_REACTION({
                            repo: this.repo,
                            owner: this.owner,
                            commentId: this.reactionsHost.id,
                            reactionId: reaction.id,
                        })
                        break;
                    default:
                }
                if(!url) return

                await authRequiredDelete(
                    url,
                    {
                        headers: {
                            'accept': 'application/vnd.github.squirrel-girl-preview+json'
                        }
                    }
                )

                await this.action_GetIssueCommentGraphqlData({
                    id: this.reactionsHost.node_id,
                    graphql: graphql.NODES_ISSUE_COMMENT,
                    sync: true
                })
            },
        },
        components: {
            Modal,
            LoadingIcon
        }
    }
</script>


<style scoped lang="scss">
@import 'node_modules/@primer/css/layout/index.scss';
.reactions{
    .reaction-item{
        padding: 9px 15px 7px;
        line-height: 18px;
        border-right: 1px solid #e1e4e8;
    }
    .emoj{
        font-family: Apple Color Emoji,Segoe UI,Segoe UI Emoji,Segoe UI Symbol;
        font-size: 1em;
        font-style: normal!important;
        font-weight: 400;
        line-height: 20px;
        vertical-align: middle;
    }
}

.add-reactions-options-item {
    height: 20vw;
    margin-top: -1px;
    margin-right: -1px;
    line-height: 29px;
    font-size: 16px;
    border: 1px solid transparent;
}

.add-reactions-options-item:hover{
    transform:scale(1.2)
}

.user-has-reacted{
    background: rgb(241, 248, 255);
}
</style>