<template> 
    <Container v-if="!deleted" class="p-3 position-relative">
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
                    <Action v-if="(extraData.viewerCanUpdate || extraData.viewerCanDelete) && repoOwnerType() == 'User'" class="float-right mt-2 ml-2" @click="() => showModal('modal')">
                        <svg class="octicon octicon-kebab-horizontal" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
                    </Action>

                    <span v-if="extraData.state == 'PENDING'" class="Label--outline bg-yellow-light float-right mt-1 ml-2" style="border-radius:2em;padding: 2px 7px">Pending</span>
                    
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

        

        <DeletingCovor v-if="loadingDeleteThis" class="position-absolute bg-white" style="top:0;left:0;right:0;bottom:0;opacity:.4" ></DeletingCovor>

        <Modal :noHeader="true" ref="modal">
            <div class="py-2">
                <div v-if="extraData.viewerCanUpdate" class="dropdown-item py-2 btn-link border-bottom">
                    Edit
                </div>
                <div v-if="extraData.viewerCanMinimize" class="dropdown-item py-2 btn-link border-bottom" @click="triggerShowMinimizePane">
                    Hide
                </div>
                <UnminimizeButton   :comment="propsData" 
                                    v-if="extraData.viewerCanMinimize && extraData.isMinimized" 
                                    @unminimize-comment="unminimizePostHandler"
                                    class="dropdown-item py-2 btn-link border-bottom"></UnminimizeButton>
                <button v-if="extraData.viewerCanDelete" class="text-red btn-link dropdown-item py-2 danger" @click="network_deleteThisComment">
                    Delete
                </button>  
            </div>
            
        </Modal>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_dateFormat,util_markdownParse} from '@/util'
    import {LoadingIconEx,Popover,ImgWrapper,Modal} from '@/components'
    import {authRequiredGitHubGraphqlApiQuery,authRequiredDelete } from '@/network'
    import ClipboardJS from 'clipboard';
    import {Reactions} from '../../components'
    import {ReviewCommentEditor} from '../../Conversation/components'
    import {MinimizePane,UnminimizeButton} from '../../../../components'
    import * as graphql from '../../graphql.js'
    import { mapMutations } from 'vuex'
    import * as api from '@/network/api'
    import { MUTATION_PULL_REQUEST_DETAIL_PUSH_DELETED_REVIEW_COMMENT } from '@/store/modules/pullRequestDetail/mutationTypes'
    export default {
        inject: ['pendingReview','reviewCommentsExtraData','repoOwnerType','triggerReplyButtonDisabled','reviewCommentDeletedHook','pendingReviewCommentDeletedHook'],
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
            newCreated: Boolean,
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
            ...mapMutations({
                mutation_pushDeletedReviewComment: MUTATION_PULL_REQUEST_DETAIL_PUSH_DELETED_REVIEW_COMMENT
            }),
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
             async network_deleteThisComment() {
                if(this.loadingDeleteThis) return
                if(!confirm("Are you sure you want to delete this comment?")) return
                this.closeModal()
                try {
                    this.triggerReplyButtonDisabled()()
                    this.loadingDeleteThis = true
                     let url = api.API_REVIEW_COMMENT_OF_PULL_REQUEST({
                        repo: this.repo,
                        owner: this.owner,
                        commentId: this.propsData.id
                    })

                    await authRequiredDelete(
                        url,
                        {
                            headers: {
                                "accept":"application/vnd.github.v3+json"
                            }
                        }
                    )

                    this.mutation_pushDeletedReviewComment({
                        from: 'changes',
                        reviewComment: this.propsData
                    })

                    if(this.pendingReview().reviewComments.data.length == 1) {
                        let event = new CustomEvent('review-deleted',{bubbles:true,detail:this.pendingReview().data})
                        this.$el.dispatchEvent(event)
                    }

                    if(this.extraData.state == 'PENDING') {
                        await this.pendingReviewCommentDeletedHook()()
                    }else{
                        await this.reviewCommentDeletedHook()()
                    }
                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.triggerReplyButtonDisabled()(false)
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
            },
            deletedPostHandler() {
                this.deleted = true
                this.$emit('delete-comment')
            }
        },
        components: {
            LoadingIconEx,
            Popover,
            Modal,
            ImgWrapper,
            Reactions,
            MinimizePane,
            UnminimizeButton,
            ReviewCommentEditor,
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
            HideAndShowPane: styled.div``,
            DeletingCovor: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/dropdown/index.scss';
@import 'node_modules/@primer/css/labels/index.scss';
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
    opacity: .4;
    pointer-events: none;
}

.dropdown-item{
    font-size: 14px;
}
</style>