<template> 
    <Container v-if="!deleted" class="p-3" :class="{deleting: loadingDeleteThis}">
        <div class="bubble m-0 bg-white">
            <HideAndShowPane v-if="extraData.isMinimized" class="p-3 d-flex flex-justify-between p-3 text-gray text-small border-bottom">
                <span class="text-italic">
                    This comment was marked as {{extraData.minimizedReason}}.
                </span>

                <button class="btn-link text-gray" @click="triggerShowMinimized">
                    <svg class="octicon octicon-fold" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 9l3 3H8v3H6v-3H4l3-3zm3-6H8V0H6v3H4l3 3 3-3zm4 2c0-.55-.45-1-1-1h-2.5l-1 1h3l-2 2h-7l-2-2h3l-1-1H1c-.55 0-1 .45-1 1l2.5 2.5L0 10c0 .55.45 1 1 1h2.5l1-1h-3l2-2h7l2 2h-3l1 1H13c.55 0 1-.45 1-1l-2.5-2.5L14 5z"></path></svg>
                        {{showMinimized ? 'Hide' : 'Show'}}
                </button>
            </HideAndShowPane>
            <div v-show="showMinimized || !extraData.isMinimized">
                <Header class="header " :style="headerStyle">
                    <Action v-if="(extraData.viewerCanUpdate || extraData.viewerCanDelete) && repoOwnerType() == 'User'" class="float-right mt-2 ml-2" @click="() => showModal('popover')">
                        <svg class="octicon octicon-kebab-horizontal" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
                    </Action>
                    
                    <Avatar class="float-left relative">
                        <ImgWrapper>
                            <img class="avatar" height="32" width="32" :alt="`@${propsData.user.login}`" :src="propsData.user.avatar_url">
                        </ImgWrapper>
                    </Avatar>
                    
                    <Meta class="meta">
                        <router-link :to="`/${propsData.user.login}`">
                            {{propsData.user.login}}
                        </router-link><br>
                        commented 
                        {{propsData.created_at | getDateDiff}}
                    </Meta>

                    <Popover ref="popover" :popoverStyle="{top: 'calc(100% - 4px)',right: '4px',paddingTop: '8px',paddingBottom: '8px',width:'120px'}">
                        <div v-if="extraData.viewerCanUpdate" class="dropdown-item py-2 btn-link">
                            Edit
                        </div>
                        <div v-if="extraData.viewerCanMinimize" class="dropdown-item py-2 btn-link" @click="triggerShowMinimizePane">
                            Hide
                        </div>
                        <UnminimizeButton   :comment="propsData" 
                                            v-if="extraData.viewerCanMinimize && extraData.isMinimized" 
                                            @unminimize-comment="unminimizePostHandler"
                                            class="dropdown-item py-2 btn-link"></UnminimizeButton>
                         <div v-if="extraData.viewerCanUpdate" class="division border-top my-1"></div> 
                        <CommentDeleteButton v-if="extraData.viewerCanDelete" commentType="reviewComment" class="text-red btn-link dropdown-item py-2 danger" :comment="propsData" @delete-comment="() => {deleted = true}"></CommentDeleteButton>  
                    </Popover>

                </Header>

                <MinimizePane v-if="showMinimizePane" :comment="propsData" @cancel="() => triggerShowMinimizePane(false)" @minimize-comment="minimizePostHandler"></MinimizePane>

                <Body class="pb-2 p-3" >
                    <BodyHTML v-html="bodyHTML"  class="markdown-body f5 p-0">

                    </BodyHTML>

                    <Reactions   :data="propsData.reactions" 
                                :commentId="propsData.id"
                                commentType="reviewComment"
                                :disabled="!extraData.viewerCanReact"></Reactions>
                </Body>

                <LoadingWrapper v-if="!propsData.id" class="loading-wrapper flex flex-justify-center flex-items-center">
                    <LoadingIconEx/>
                </LoadingWrapper>
                
            </div>
        </div>
       
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_dateFormat,util_markdownParse} from '@/util'
    import {LoadingIconEx,Popover,ImgWrapper} from '@/components'
    import {authRequiredGitHubGraphqlApiQuery} from '@/network'
    import ClipboardJS from 'clipboard';
    import {Reactions} from '../../components'
    import {ReviewCommentEditor} from '../../Conversation/components'
    import {MinimizePane,UnminimizeButton,CommentDeleteButton} from '../../../../components'
    import * as graphql from '../../graphql.js'
    export default {
        inject: ['reviewCommentsExtraData','repoOwnerType'],
        data() {
            return {
                showMinimized: false,
                showMinimizePane: false,
                loadingDeleteThis: false,
                loadingUnminimizeComment: false,
                deleted: false,
                handledComment: {},
                extraDataOfNewCreatedComment: {
                    data: {},
                    loading: false
                }
            }
        },
        props: {
            propsData: {
                type: Object,
                default: () => ({})
            },
            headerStyle: {
                type: Object,
                required: false
            },
            newCreated: Boolean
        },
        computed: {
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            extraData() {
                if(this.newCreated) return this.extraDataOfNewCreatedComment.data
                return {
                    ...this.reviewCommentsExtraData().filter(i => i.id == this.propsData.node_id)[0] || {},
                    ...this.handledComment
                }
            },
            bodyHTML() {
                return util_markdownParse.markdownToHTML(this.propsData.body)
            }
        },
        created() {
            if(this.newCreated) this.network_getExtraDataForNewCreatedComment()
        },
        methods: {
            async network_getExtraDataForNewCreatedComment() {
                try {
                    this.extraDataOfNewCreatedComment.loading = true
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_PR_REVIEW_COMMENTS,
                        {
                            variables: {
                                ids: [this.propsData.node_id]
                            }
                        }
                    )
                    try{
                        this.extraDataOfNewCreatedComment.data = res.data.data.nodes[0]
                    }catch(e) {
                        this.handleGraphqlError(e)
                    } 
                } catch (e) {
                    console.log(e)
                } finally {
                    this.extraDataOfNewCreatedComment.loading = false
                }
            },
            triggerShowMinimized() {
                this.showMinimized = !this.showMinimized
            },
            triggerShowMinimizePane(flag = true) {
                this.closeModal()
                this.showMinimizePane = flag
            },
            minimizePostHandler(payload) {
                this.triggerShowMinimizePane(false)
                this.handledComment = payload.info
            },
            unminimizePostHandler(payload) {
                this.closeModal()
                this.handledComment = payload.info
            }
        },
        components: {
            LoadingIconEx,
            Popover,
            ImgWrapper,
            Reactions,
            MinimizePane,
            UnminimizeButton,
            ReviewCommentEditor,
            CommentDeleteButton,
            Container: styled.div``,
            Inner: styled.div``,
            Header: styled.div``,
            Avatar: styled.div``,
            Meta: styled.div``,
            LoadingWrapper: styled.div``,
            HeaderInner: styled.div``,
            Main: styled.div``,
            Body: styled.div``,
            BodyHTML: styled.div``,
            Action: styled.div``,
            AuthorAssociation: styled.span``,
            StretchCommentBtn: styled.div``,
            HideAndShowPane: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/dropdown/index.scss';
.header{
    position: relative;
    padding: 10px 15px;
    font-size: 12px;
    line-height: 16px;
    color: #586069;
    background-color: #fff;
    border-bottom: 1px solid #e1e4e8;
    .meta{
        margin-left: 42px;
        a{
            font-weight: 600;
            color: #444d56;
        }
    }
}

.deleting{
    opacity: .4s;
    pointer-events: none;
}

.dropdown-item{
    font-size: 14px;
}
</style>