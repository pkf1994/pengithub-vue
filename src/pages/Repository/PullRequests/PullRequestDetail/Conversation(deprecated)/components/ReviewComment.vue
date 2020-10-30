<template> 
    <Container class="bg-white" :class="{deleting:loadingDeleteThis}">

        <FileHeader v-if="isRoot" class="file-header" :class="{pending:reviewProvided().state && reviewProvided().state.toLowerCase() == 'pending'}">
            <button class="btn-link text-gray float-right f6 d-block" v-if="reviewComment.outdated" @click="triggerShowOutdated">
                <svg class="octicon octicon-fold position-relative mr-1" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 9l3 3H8v3H6v-3H4l3-3zm3-6H8V0H6v3H4l3 3 3-3zm4 2c0-.55-.45-1-1-1h-2.5l-1 1h3l-2 2h-7l-2-2h3l-1-1H1c-.55 0-1 .45-1 1l2.5 2.5L0 10c0 .55.45 1 1 1h2.5l1-1h-3l2-2h7l2 2h-3l1 1H13c.55 0 1-.45 1-1l-2.5-2.5L14 5z"></path></svg>
                {{showOutdated ? 'Hide outdated' : 'Show outdated'}}
            </button> 
            <router-link to="/" class="link-gray-dark">
                {{path}}
            </router-link> 

            <button v-if="outdated" @click="triggerShowOutdated" type="button" class="btn-link text-gray float-right f6 outdated-comment-label show-outdated-button">
                <svg class="octicon octicon-unfold position-relative mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.177.677l2.896 2.896a.25.25 0 01-.177.427H8.75v1.25a.75.75 0 01-1.5 0V4H5.104a.25.25 0 01-.177-.427L7.823.677a.25.25 0 01.354 0zM7.25 10.75a.75.75 0 011.5 0V12h2.146a.25.25 0 01.177.427l-2.896 2.896a.25.25 0 01-.354 0l-2.896-2.896A.25.25 0 015.104 12H7.25v-1.25zm-5-2a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM6 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 016 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM12 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 0112 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5z"></path></svg>
                {{showOutdated ? 'Hide' : 'Show'}} outdated
            </button>
        </FileHeader>

        <div v-if="!outdated || showOutdated ">
            <DiffView v-if="isRoot" class="diff-view">
                <div :class="{'d-inline-block':!isProseFileType}" style="min-width: 100%;">
                    <LinesNotShown class="text-shadow-light d-flex width-full" v-if="diffHunkEntries.hidden.length > 0 && !showHiddenDiffHunk" @click="triggerShowHiddenDiffHunk">
                        <BlobNum class="blob-num position-sticky bg-white"  style="left:0px" data-line-number="..."></BlobNum>
                        <BlobNum class="blob-num position-sticky bg-white" style="left:26px" data-line-number="..."></BlobNum>
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
                                    style="left:26px" 
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
                                        'blob-num-hunk':index === 0 && diffHunkEntries.hidden.length === 0 || (diffHunkEntries.deletionStartLineIndex === item.deletionLineIndex && diffHunkEntries.additionStartLineIndex === item.additionLineIndex)}">{{item.code}}</BlobCode>
                    </CodeLine>
                    <CodeLine v-for="(item,index) in diffHunkEntries.showDefault" :key="index + 'showDefault'" class="d-flex width-full">
                        <BlobNum    class="blob-num position-sticky" 
                                    style="left:0px" 
                                    :data-line-number="item.deletionLineIndex == 0 ? '...' : item.deletionLineIndex" 
                                    :class="{
                                        'blob-num-addition':item.type === 'addition',
                                        'blob-num-deletion':item.type === 'deletion',
                                        'blob-num-context':item.type === 'context',
                                        'blob-num-hunk':index === 0 && diffHunkEntries.hidden.length === 0 || (diffHunkEntries.deletionStartLineIndex === item.deletionLineIndex && diffHunkEntries.additionStartLineIndex === item.additionLineIndex)}"></BlobNum>

                        <BlobNum    class="blob-num position-sticky" 
                                    style="left:26px" 
                                    :data-line-number="item.additionLineIndex == 0 ? '...' : item.additionLineIndex" 
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
                                        'blob-num-hunk':index === 0 && diffHunkEntries.hidden.length === 0 || (diffHunkEntries.deletionStartLineIndex === item.deletionLineIndex && diffHunkEntries.additionStartLineIndex === item.additionLineIndex)}">{{item.code}}</BlobCode>
                    </CodeLine>
                </div>
            </DiffView>

             <CommentContent>
                <div class="px-3 pt-3 pb-2" v-show="!showReviewCommentEditor">
                    <WhoDidWhatAt class="d-flex flex-row position-relative">
                        <div class="flex-auto">
                            <router-link :to="`/${reviewComment.user.login}`" class="d-inline-block">
                                <ImgWrapper>   
                                    <img class="v-align-top" style="margin-top:2px" :src="reviewComment.user.avatar_url" :alt="`@${reviewComment.user.login}`" width="16" height="16">
                                </ImgWrapper>
                            </router-link>
                            <router-link :to="`/${reviewComment.user.login}`" class="f5 text-bold link-gray-dark">{{reviewComment.user.login}}</router-link> 
                            <span class="text-gray"> • {{reviewComment.created_at | getDateDiff}}</span>
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
                    
                    <Reactions class="mt-2" :data="reviewComment.reactions || reactions.data || {}" :disabled="!extraData.viewerCanReact" commentType="reviewComment">
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
    import {Reactions} from '../../components'
    import * as api from '@/network/api'
    import { authRequiredGitHubGraphqlApiQuery,authRequiredGet,authRequiredDelete} from '@/network'
    import { MUTATION_PULL_REQUEST_DETAIL_PUSH_DELETED_REVIEW_COMMENT } from '@/store/modules/pullRequestDetail/mutationTypes'
    export default {
        inject: ['reviewProvided','pullRequestProvided','repoOwnerType','viewerIsCollaborator','reviewCommentsExtraData'],
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
                                code: item.substring(1,item.length),
                                additionLineIndex: addititonLineIndex
                            })
                            addititonLineIndex += 1
                            break
                        case '-':
                            diffHunkEntries.push({
                                type: 'deletion',
                                code: item.substring(1,item.length),
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
                    this.loadingDeleteThis = true
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
    min-width: 26px;
    padding: 2px 3px;
    font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    font-size: 12px;
    line-height: 18px;
    color: rgba(27,31,35,.3);
    text-align: right;
    white-space: nowrap;
    vertical-align: top;
    flex-shrink: 0
}

.blob-num:before {
    content: attr(data-line-number);
}

.blob-code{
    font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    color: #24292e;
    width: 100%;
    white-space: pre;
    padding-right: 10px;
    padding-left: 10px;
    word-wrap: normal;
    font-size: 12px;
    line-height: 20px;
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
    background-color: #f8f5ff;
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
    background-color: #f8f5ff;
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
</style>