<template> 
    <Container class="bg-white" :class="{deleting:loadingDeleteThis}">

        <FileHeader v-if="isRoot && showDiff" class="file-header" :class="{pending: extraData && extraData.state && extraData.state.toLowerCase() == 'pending'}">
            <button class="btn-link text-gray float-right f6 d-block" v-if="reviewComment.outdated" @click="triggerShowOutdated">
                <svg class="octicon octicon-fold position-relative mr-1" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 9l3 3H8v3H6v-3H4l3-3zm3-6H8V0H6v3H4l3 3 3-3zm4 2c0-.55-.45-1-1-1h-2.5l-1 1h3l-2 2h-7l-2-2h3l-1-1H1c-.55 0-1 .45-1 1l2.5 2.5L0 10c0 .55.45 1 1 1h2.5l1-1h-3l2-2h7l2 2h-3l1 1H13c.55 0 1-.45 1-1l-2.5-2.5L14 5z"></path></svg>
                {{showOutdated ? 'Hide outdated' : 'Show outdated'}}
            </button> 
            <router-link to="/" class="link-gray-dark">
                {{path}}
            </router-link> 

            <span v-if="outdated" title="Label: Outdated" class="Label Label--yellow ">
                Outdated
            </span>
        </FileHeader>

        <div>
            <DiffView v-if="isRoot && showDiff" class="diff-view" style="font-size: 0px;">
                <div :class="{'d-inline-block':!isProseFileType}" style="min-width: 100%;">
                    <LinesNotShown class="text-shadow-light d-flex width-full" v-if="diffHunkEntries.hidden.length > 0 && !showHiddenDiffHunk" @click="triggerShowHiddenDiffHunk">
                        <BlobNum class="blob-num position-sticky bg-white"  style="left:0px" data-line-number="..."></BlobNum>
                        <BlobNum class="blob-num position-sticky bg-white" style="left:50px" data-line-number="..."></BlobNum>
                        <BlobCode class="blob-code" :class="{'prose': isProseFileType}">{{diffHunkEntries.hidden.length}} lines not shown</BlobCode>
                    </LinesNotShown>
                    <CodeLine v-for="(item,index) in showHiddenDiffHunk ? diffHunkEntries.hidden : []" :key="index + 'hidden'" class="d-flex width-full">
                        <BlobNum    class="blob-num position-sticky"  
                                    style="left:0px" 
                                    :data-line-number="item.deletionLineIndex == 0 ? '...' : item.deletionLineIndex" 
                                    :class="{
                                        'blob-num-addition':item.type === 'addition',
                                        'blob-num-deletion':item.type === 'deletion',
                                        'blob-num-context':item.type === 'context',
                                        'blob-num-hunk':index === 0 && diffHunkEntries.hidden.length === 0 || (diffHunkEntries.deletionStartLineIndex === item.deletionLineIndex && diffHunkEntries.additionStartLineIndex === item.additionLineIndex)}"></BlobNum>

                        <BlobNum    class="blob-num position-sticky" 
                                    style="left:50px" 
                                    :data-line-number="item.additionLineIndex == 0 ? '...' : item.additionLineIndex" 
                                    :class="{'blob-num-addition':item.type === 'addition',
                                            'blob-num-deletion':item.type === 'deletion',
                                            'blob-num-context':item.type === 'context',
                                            'blob-num-hunk':index === 0 && diffHunkEntries.hidden.length === 0 || (diffHunkEntries.deletionStartLineIndex === item.deletionLineIndex && diffHunkEntries.additionStartLineIndex === item.additionLineIndex)}"></BlobNum>

                        <BlobCode   class="blob-code" 
                                    :class="{
                                        'prose': isProseFileType,
                                        'blob-code-addition':item.type === 'addition',
                                        'blob-code-deletion':item.type === 'deletion',
                                        'blob-code-context':item.type === 'context',
                                        'blob-code-hunk':index === 0 && diffHunkEntries.hidden.length === 0 || (diffHunkEntries.deletionStartLineIndex === item.deletionLineIndex && diffHunkEntries.additionStartLineIndex === item.additionLineIndex)}">{{item.code}}</BlobCode>
                    </CodeLine>
                    <CodeLine v-for="(item,index) in diffHunkEntries.showDefault" :key="index + 'showDefault'" class="d-flex width-full">
                        <BlobNum    class="blob-num position-sticky" 
                                    style="left:0px" 
                                    :data-line-number="index == 0 ? '...' : item.deletionLineIndex" 
                                    :class="{
                                        'blob-num-addition':item.type === 'addition',
                                        'blob-num-deletion':item.type === 'deletion',
                                        'blob-num-context':item.type === 'context',
                                        'blob-num-hunk':index === 0 && diffHunkEntries.hidden.length === 0 || (diffHunkEntries.deletionStartLineIndex === item.deletionLineIndex && diffHunkEntries.additionStartLineIndex === item.additionLineIndex)}"></BlobNum>

                        <BlobNum    class="blob-num position-sticky" 
                                    style="left:50px" 
                                    :data-line-number="index == 0 ? '...' : item.additionLineIndex" 
                                    :class="{
                                        'blob-num-addition':item.type === 'addition',
                                        'blob-num-deletion':item.type === 'deletion',
                                        'blob-num-context':item.type === 'context',
                                        'blob-num-hunk':index === 0 && diffHunkEntries.hidden.length === 0 || (diffHunkEntries.deletionStartLineIndex === item.deletionLineIndex && diffHunkEntries.additionStartLineIndex === item.additionLineIndex)}"></BlobNum>

                        <BlobCode   class="blob-code" 
                                    :class="{
                                        'prose': isProseFileType,
                                        'blob-code-addition':item.type === 'addition',
                                        'blob-code-deletion':item.type === 'deletion',
                                        'blob-code-context':item.type === 'context',
                                        'blob-code-hunk':index === 0 && diffHunkEntries.hidden.length === 0 || (diffHunkEntries.deletionStartLineIndex === item.deletionLineIndex && diffHunkEntries.additionStartLineIndex === item.additionLineIndex)}">{{item.code}}</BlobCode>
                    </CodeLine>
                </div>
            </DiffView>

             <CommentContent>
                <div class="px-3 py-2" v-show="!showReviewCommentEditor">
                    <WhoDidWhatAt class="d-flex flex-row position-relative">
                        <div class="flex-auto">
                            <router-link :to="`/${reviewComment.user.login}`" class="d-inline-block">
                                <ImgWrapper class="avatar avatar-user mr-2" style="margin-top:2px">   
                                    <img class="avatar avatar-user v-align-top" style="margin-top:2px" :src="reviewComment.user.avatar_url" :alt="`@${reviewComment.user.login}`" width="28" height="28">
                                </ImgWrapper>
                            </router-link>
                            <router-link :to="`/${reviewComment.user.login}`" class="f5 text-bold link-gray-dark">{{reviewComment.user.login}}</router-link> 
                            <span class="text-gray"> • {{reviewComment.created_at | getDateDiff}}</span>
                            <span v-if="pullRequestProvided().user && pullRequestProvided().user.login == reviewComment.user.login" style="font-weight: 500" class="ml-1 timeline-comment-label">
                                Author
                            </span>
                            <span v-if="reviewComment.author_association" style="font-weight: 500" class="ml-1 timeline-comment-label">
                                {{reviewComment.author_association | capitalize}}
                            </span>

                            <span v-if="extraData.state && extraData.state.toLowerCase() == 'pending'" style="font-weight: 500" class="ml-1 timeline-comment-label label-pending">
                                Pending
                            </span>
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

                    <CommentBody v-html="markdownToHTML" class="markdown-body p-0 pt-2 f5">
                    </CommentBody>
                    
                    <Reactions  class="mt-3"
                                style="border:none!important"
                                :reactionItemStyle="{padding: '0 8px',
                                                    marginRight: '8px',
                                                    fontSize: '12px',
                                                    lineHeight: '26px',
                                                    border: '1px solid #d2dff0',
                                                    borderRadius: '6px'}" 
                                :reactionsHost="reviewComment" 
                                :viewerCanReact="extraData.viewerCanReact"
                                reactionsHostType="reviewComment">
                    </Reactions>
                </div>

                <ReviewCommentEditor v-show="showReviewCommentEditor" :comment="reviewComment" @cancel="() => triggerShowReviewCommentEditor(false)"></ReviewCommentEditor>
            </CommentContent>
        </div> 
       
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_dateFormat,util_analyseFileType,util_markdownParse} from '@/util'
    import ReviewCommentEditor from './ReviewCommentEditor'
    import {Popover, ImgWrapper} from '@/components'
    import {mapState,mapMutations} from 'vuex'
    import {Reactions} from '../../../../../../../../Issues/IssueDetail/components'
    import * as api from '@/network/api'
    import { authRequiredGitHubGraphqlApiQuery,authRequiredGet,authRequiredDelete} from '@/network'
    import { MUTATION_PULL_REQUEST_DETAIL_PUSH_DELETED_REVIEW_COMMENT } from '@/store/modules/pullRequestDetail/mutationTypes'
    export default {
        inject: ['pullRequestProvided','repoOwnerType','viewerIsCollaborator','reviewCommentsExtraData'],
        data() {
            return {
                showHiddenDiffHunk: false,
                showOutdated: false,
                reactions: {
                    data: {},
                    loading: false
                },
                loadingDeleteThis: false,
                showReviewCommentEditor: false,
            }
        },
        props: {
            reviewComment: {
                type: Object,
                required: true
            },
            isRoot: {
                type: Boolean,
                default: false
            },
            showDiff: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            ...mapState({
                updatedReviewComments: state => state.pullRequestDetail.updatedReviewComments
            }),
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            extraData() {
                return this.reviewCommentsExtraData().filter(i => i.id == this.reviewComment.node_id)[0] || {}
            },
            diffHunkEntries() {
                let diffHunk = this.reviewComment.diffHunk || this.reviewComment.diff_hunk
                let hunkStatistic = (diffHunk.split('@@')[1]).replace(/@/g,'').trim().split(' ')
                let deletionLineIndex,deletionStartLineIndex,addititonLineIndex,additionStartLineIndex
                deletionLineIndex = deletionStartLineIndex = parseInt(hunkStatistic[0].split(',')[0].replace(/[-|\+]/g,'')) - 1
                addititonLineIndex = additionStartLineIndex = parseInt(hunkStatistic[1].split(',')[0].replace(/[-|\+]/g,'')) - 1
                let lines = diffHunk.split(/\n/)
                let diffHunkEntries = []
                lines.forEach(item => {
                    switch(item[0]) {
                        case '+':
                            diffHunkEntries.push({
                                type: 'addition',
                                code: '+' + item.substring(1,item.length),
                                additionLineIndex: addititonLineIndex
                            })
                            addititonLineIndex += 1
                            break
                        case '-':
                            diffHunkEntries.push({
                                type: 'deletion',
                                code: '-' + item.substring(1,item.length),
                                deletionLineIndex: deletionLineIndex
                            })
                            deletionLineIndex += 1
                            break
                        default:
                             diffHunkEntries.push({
                                type: 'context',
                                code: item,
                                additionLineIndex: addititonLineIndex,
                                deletionLineIndex: deletionLineIndex
                            })
                            addititonLineIndex += 1
                            deletionLineIndex += 1
                    }
                }) 
                let showDefault = diffHunkEntries.reverse().slice(0,16).reverse()
                let hidden = diffHunkEntries.slice(16,diffHunkEntries.length).reverse()
                
                return {
                        showDefault,
                        hidden,
                        deletionStartLineIndex,
                        additionStartLineIndex,
                    }
            },
            path() {
                if((this.reviewComment.path.match(/\//g) || []).length <= 3) return this.reviewComment.path
                return `...${this.reviewComment.path.match(/(\/(([^\/])+)){3}$/g)[0]}`
            },
            isProseFileType() {
                if(!this.reviewComment.path) return 
                return util_analyseFileType.isProse(this.reviewComment.path)
            },
            outdated() {
                return this.extraData.outdated
            },
            markdownToHTML() {
                let updatedReviewComment = this.updatedReviewComments.filter(i => i.id == this.reviewComment.id)[0]
                return util_markdownParse.markdownToHTML(updatedReviewComment ? updatedReviewComment.body : this.reviewComment.body)
            }
        },
        created() {
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
                if(this.reviewComment.reactions) return 
                try {
                    this.reactions.loading = true
                    let url = api.API_REVIEW_COMMENT_OF_PULL_REQUEST({
                        repo: this.repo,
                        owner: this.owner,
                        commentId: this.reviewComment.id
                    })
                    let res = await authRequiredGet(
                        url,
                        {
                            headers: {
                                "accept":"application/vnd.github.comfort-fade-preview+json,application/vnd.github.squirrel-girl-preview"
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
                    
                    if(this.isRoot) {
                        this.$el.dispatchEvent(new CustomEvent('root-review-comment-deleting',{bubbles:true}))
                    }else{
                        this.loadingDeleteThis = true
                    }
                    let url = api.API_REVIEW_COMMENT_OF_PULL_REQUEST({
                        repo: this.repo,
                        owner: this.owner,
                        commentId: this.reviewComment.id
                    })
                    await authRequiredDelete(
                        url,
                        {
                            headers: {
                                "accept":"application/vnd.github.v3+json"
                            }
                        }
                    )

                    this.mutation_pushDeletedReviewComment(this.reviewComment)

                    this.$el.dispatchEvent(new CustomEvent('review-comment-deleted',{bubbles:true,detail:this.reviewComment}))

                    /* if(this.reviewProvided().state.toLowerCase() == 'pending') {
                        await this.pendingReviewCommentRepliesDeletedHook()()
                    }else if(!this.reply.in_reply_to_id) {
                        await this.reviewCommentsReplyHostDeletedHook()()
                    } */

                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loadingDeleteThis = false
                }
            },
            triggerShowHiddenDiffHunk() {
                this.showHiddenDiffHunk = true
            },
            triggerShowPopover(flag = true) {
                this.$refs.popover.show = flag
            },
            triggerShowOutdated() {
                this.showOutdated = !this.showOutdated
            },
            triggerShowReviewCommentEditor(flag = true) {
                this.closeModal()
                this.showReviewCommentEditor = flag
            },
        },
        components: {
            Popover,
            Reactions,
            ImgWrapper,
            ReviewCommentEditor,
            Container: styled.div``,
            CommentContent: styled.div``,
            FileHeader: styled.div``,
            DiffView: styled.div``,
            LinesNotShown: styled.div``,
            CodeLine: styled.div``,
            BlobNum: styled.div``,
            BlobCode: styled.div``,
            Comment: styled.div``,
            WhoDidWhatAt: styled.div``,
            CommentBody: styled.div``,
            ResolveConversation: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/labels/index.scss';
@import 'node_modules/@primer/css/dropdown/index.scss';
.deleting{
    opacity: .4;
}

.dropdown-item{
    min-width: 140px;
}

.file-header{
    border-top: 0;
    border-radius: 3px 3px 0 0;
    padding: 3px 10px 5px;
    background-color: #f6f8fa;
    a{
        font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
        font-size: 12px;
    }
}

.diff-view{
    position: relative;
    border-top: 1px solid #d1d5da;
    border-bottom: 1px solid #d1d5da;
    overflow-y: hidden;
    overflow-x: auto;
}

.blob-num{
    font-size: 12px;
    min-width: 50px;
    padding: 0px 10px;
    font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    line-height: 22px;
    color: rgba(27,31,35,.3);
    text-align: right;
    white-space: nowrap;
    vertical-align: top;
    flex-shrink: 0;
}

.blob-num:before {
    content: attr(data-line-number);
}

.blob-code{
    font-size: 12px;
    font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    color: #24292e;
    width: 100%;
    white-space: pre;
    padding-right: 10px;
    padding-left: 10px;
    word-wrap: normal;
    line-height: 22px;
    flex: auto;
    padding-right: 10px;
    padding-left: 10px;
}

.blob-code-addition {
    background-color: #e6ffed;
}
.blob-code-deletion {
    background-color: #ffeef0;
}
.blob-code-hunk {
    padding-top: 4px;
    padding-bottom: 4px;
    background-color: rgb(241, 248, 255);
    color: rgba(27, 31, 35, 0.7);
}
.blob-num-addition {
    background-color: #cdffd8;
    border-color: #bef5cb;
}
.blob-num-deletion {
    background-color: #ffdce0;
    border-color: #fdaeb7;
}
.blob-num-context {
    background-color: white;
}
.blob-num-hunk {
    padding-top: 4px;
    padding-bottom: 4px;
    background-color: rgb(219, 237, 255);
    
}
.reply{
    padding: 10px 15px;
}

.loading-wrapper{
    height: 120px;
}

.pending{
    background-color: #fffbdd;
}

.prose{
    white-space: pre-wrap;
}

.timeline-comment-label {
    display: inline-block;
    padding: 0 7px;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    border-radius: 2em;
    border: 1px solid transparent;
    border-color: rgb(225, 228, 232);
}

.label-pending{
    color: var(--color-auto-yellow-9);
    border-color: var(--color-auto-yellow-6);
    background-color: var(--color-bg-warning)!important;
}
</style>