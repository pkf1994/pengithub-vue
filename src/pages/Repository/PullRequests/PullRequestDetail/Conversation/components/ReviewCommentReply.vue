<template> 
    <Container v-if="!deleted">
        <div class="px-3 pt-3 pb-2" :class="{deleting:loadingDeleteThis}" v-show="!showReviewCommentEditor">
            <WhoDidWhatAt class="d-flex flex-row position-relative">
                <div class="flex-auto">
                    <router-link :to="`/${data.user.login}`" class="d-inline-block">
                        <ImgWrapper>   
                            <img class="v-align-top" style="margin-top:2px" :src="reply.user.avatar_url" :alt="`@${reply.user.login}`" width="16" height="16">
                        </ImgWrapper>
                    </router-link>
                    <router-link :to="`/${data.user.login}`" class="f5 text-bold link-gray-dark">{{data.user.login}}</router-link> 
                    <span class="text-gray"> • {{data.created_at | getDateDiff}}</span>
                </div>

                <button class="ml-2 height-full" :disabled="loadingDeleteThis" @click="triggerShowPopover" v-if="(extraData.viewerCanUpdate || extraData.viewerCanDelete) && repoOwnerType() == 'User'">
                    <svg class="octicon octicon-kebab-horizontal" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
                </button>

                <Popover ref="popover" :popoverStyle="{top: 'calc(100% + 4px)',right: '-10px',paddingTop: '4px',paddingBottom: '4px'}">
                    <div v-if="extraData.viewerCanUpdate" class="dropdown-item" @click="triggerShowReviewCommentEditor">
                        Edit
                    </div>
                    <div v-if="extraData.viewerCanUpdate" class="division border-top my-1"></div> 
                    <div v-if="extraData.viewerCanDelete" class="dropdown-item danger" @click="network_tryToDeleteThis">
                        Delete
                    </div>
                </Popover>
            </WhoDidWhatAt>

            <CommentBody v-html="bodyHTML" class="markdown-body p-0 pt-2 f5">
            </CommentBody>
            
            <Reactions class="mt-2" :data="reply.reactions || reactions.data || {}" :disabled="!extraData.viewerCanReact" commentType="reviewComment">
            </Reactions>
        </div>

        <ReviewCommentEditor v-show="showReviewCommentEditor" :comment="data" @cancel="() => triggerShowReviewCommentEditor(false)" @update-success="reviewCommentUpdateSuccessHandler"></ReviewCommentEditor>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_markdownParse} from '@/util'
    import {ImgWrapper,Popover} from '@/components'
    import {Reactions} from '../../components'
    import ReviewCommentEditor from './ReviewCommentEditor'
    import {authRequiredGet,authRequiredDelete} from '@/network'
    import * as api from '@/network/api'
    import {MUTATION_PULL_REQUEST_DETAIL_PUSH_DELETED_REVIEW_COMMENT} from '@/store/modules/pullRequestDetail/mutationTypes'
    import {mapState,mapMutations } from 'vuex'
    export default {
        inject: ['repliesExtraData','repoOwnerType','reviewProvided','reviewCommentsReplyHostDeletedHook','pendingReviewCommentRepliesDeletedHook'],
        data() {
            return {
                data: {},
                reactions: {
                    data: undefined,
                    loading: false,
                },
                showReviewCommentEditor: false,
                loadingDeleteThis: false,
            }
        },
        props: {
            reply: {
                type: Object,
                required: true
            },
        },
        computed: {
            ...mapState({
                deletedReviewComments: state => state.pullRequestDetail.deletedReviewComments.changes
            }),
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            bodyHTML() {
                return util_markdownParse.markdownToHTML(this.data.body)
            },
            extraData() {
                return this.repliesExtraData().filter(i => i.id == this.data.node_id)[0] || {}
            },
            deleted() {
                return this.deletedReviewComments.some(i => i.id == this.reply.id)
            }
        },
        created() {
            this.data = this.reply
            this.network_getData()
        },
        methods: {
            ...mapMutations({
                mutation_pushDeletedReviewComment: MUTATION_PULL_REQUEST_DETAIL_PUSH_DELETED_REVIEW_COMMENT
            }),
            network_getData() {
                this.network_getReactions()
            },
            async network_getReactions() {
                if(this.reply.reactions) return 
                try {
                    this.reactions.loading = true
                    let url = api.API_REVIEW_COMMENT_OF_PULL_REQUEST({
                        repo: this.repo,
                        owner: this.owner,
                        commentId: this.data.id
                    })
                    let res = await authRequiredGet(
                        url,
                        {
                            headers: {
                                "accept":"application/vnd.github.squirrel-girl-preview"
                            }
                        }
                    )

                    this.reactions.data = res.data.reactions
                } catch (e) {
                    console.log(e)
                }finally{
                    this.reactions.loading = false
                }
            },
            async network_tryToDeleteThis() {
                this.closeModal()
                if(!confirm("Are you sure you want to delete this comment?")) return
                try {
                    this.loadingDeleteThis = true
                    let url = api.API_REVIEW_COMMENT_OF_PULL_REQUEST({
                        repo: this.repo,
                        owner: this.owner,
                        commentId: this.data.id
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
                        from: 'conversation',
                        reviewComment: this.reply
                    })

                    if(this.reviewProvided().state.toLowerCase() == 'pending') {
                        await this.pendingReviewCommentRepliesDeletedHook()()
                    }else if(!this.reply.in_reply_to_id) {
                        await this.reviewCommentsReplyHostDeletedHook()()
                    }

                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loadingDeleteThis = false
                }
            },
            triggerShowPopover(flag = true) {
                this.$refs.popover.show = flag
            },
            triggerShowReviewCommentEditor(flag = true) {
                this.closeModal()
                this.showReviewCommentEditor = flag
            },
            reviewCommentUpdateSuccessHandler(payload) {
                this.showReviewCommentEditor = false
                this.data = payload
            } 
        },
        components: {
            ImgWrapper,
            Reactions,
            ReviewCommentEditor,
            Popover,
            Container: styled.div``,
            WhoDidWhatAt: styled.div``,
            CommentBody: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/dropdown/index.scss';
.dropdown-item{
    min-width: 140px;
}

.deleting{
    opacity: .4;
}
</style>