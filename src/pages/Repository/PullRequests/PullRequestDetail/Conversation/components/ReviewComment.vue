<template> 
    <Container class="bubble bg-white" style="margin-top:15px">

        <FileHeader class="file-header" :class="{pending:reviewProvided().state.toLowerCase() == 'pending'}">
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

        <div v-if="!outdated || showOutdated">
             <DiffView class="diff-view">
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

            <ReviewCommentReply :reply="reviewComment"></ReviewCommentReply>

            <!-- replies -->
            <Replies>
                <ReviewCommentReply v-for="item in replies" :reply="item" :key="item.id"></ReviewCommentReply>
            </Replies>

            <button @click="triggerShowReviewCommentReplyCreator" v-if="!(pullRequestProvided().locked && !viewerIsCollaborator().data) && !showReviewCommentReplyCreator && repoOwnerType() == 'User'" class="border-top reply btn-link text-bold text-left muted-link btn-block">
                Reply...
            </button>

            <ReviewCommentReplyCreator v-if="showReviewCommentReplyCreator" class="border-top" :commentId="reviewComment.id" @cancel="() => triggerShowReviewCommentReplyCreator(false)" @reply-success="createReplySuccessHandler"></ReviewCommentReplyCreator>
        </div> 
       
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_dateFormat,util_analyseFileType,util_markdownParse} from '@/util'
    import {LoadingIconEx,AnimatedHeightWrapper,Popover,SimpleDiffView, ImgWrapper} from '@/components'
    import {HiddenItemLoading} from '../../components'
    import {mapState} from 'vuex'
    import ClipboardJS from 'clipboard';
    import {Reactions} from '../../components'
    import ReviewCommentReply from './ReviewCommentReply'
    import ReviewCommentReplyCreator from './ReviewCommentReplyCreator'
    import * as graphql from '../../graphql'
    import * as api from '@/network/api'
    import { authRequiredGitHubGraphqlApiQuery,authRequiredGet } from '@/network'
    export default {
        inject: ['reviewCommentReplies','reviewCommentsOfPendingReview','reviewProvided','pullRequestProvided','repoOwnerType','viewerIsCollaborator'],
        provide() {
            return {
                repliesExtraData: () => this.repliesExtraData.data,
            }
        },
        data() {
            return {
                showHiddenDiffHunk: false,
                showOutdated: false,
                repliesExtraData: {
                    data: [],
                    loading: false
                },
                reactions: {
                    data: {},
                    loading: false
                },
                repliesReactions: {
                    data: [],
                    loading: false
                },
                repliesJustCreated: [],
                showReviewCommentReplyCreator: false,
                
            }
        },
        props: {
            reviewComment: {
                type: Object,
                required: true
            },
        },
        computed: {
            ...mapState({
                newCreatedReviewComments: state => state.pullRequestDetail.newCreatedReviewComments.changes
            }),
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            location() {
                return location
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
            replies() {
                let replies_ = [...this.reviewCommentReplies(),...this.reviewCommentsOfPendingReview(),...this.repliesJustCreated,...this.newCreatedReviewComments].filter(item => {
                    return item.in_reply_to_id == this.reviewComment.id
                }).sort((a,b) => a.created_at > b.created_at)

                let replies = []
                replies_.forEach(i => {
                    if(!replies.some(i_ => i_.id == i.id)) {
                        replies.push(i)
                    }
                })
                return replies
            },
            isProseFileType() {
                if(!this.reviewComment.path) return 
                return util_analyseFileType.isProse(this.reviewComment.path)
            },
            outdated() {
                return this.repliesExtraData.data[0] && this.repliesExtraData.data[0].outdated
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            network_getData() {
                this.network_getRepliesExtraData(this.replies)
                this.network_getRepliesExtraData([this.reviewComment])
                this.network_getReactions()
            },
            async network_getReactions() {
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
            async network_getRepliesExtraData(replies) {
                let nodeIds = []
                replies.forEach(i => nodeIds.push(i.node_id))
                if(nodeIds.length == 0) return 
                try{
                    this.repliesExtraData.loading = true
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_PR_REVIEW_COMMENTS,
                        {
                            variables: {
                                ids:nodeIds
                            }
                        }
                    )

                    try{
                        this.repliesExtraData.data = this.repliesExtraData.data.concat(res.data.data.nodes)
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                    
                }catch(e) {
                    console.log(e)
                }finally{
                    this.repliesExtraData.loading = false
                }
            },
            dateFormat(date) {
                return util_dateFormat.getDateDiff(date)
            },
            markdownToHTML(markdown) {
                return util_markdownParse.markdownToHTML(markdown)
            },
            showActionPopover() {
                this.$refs.actionPopover.show = true
            },
            initClipboard() {
                let clip = new ClipboardJS('#file-detail-copy-btn');
                clip.on('success',e => {
                    this.$toast("Clip OK!")
                })
            },
            triggerShowHiddenDiffHunk() {
                this.showHiddenDiffHunk = true
            },
            triggerShowOutdated() {
                this.showOutdated = !this.showOutdated
            },
            triggerShowReviewCommentReplyCreator(flag = true) {
                this.showReviewCommentReplyCreator = flag
            },
            createReplySuccessHandler(payload) {
                this.showReviewCommentReplyCreator = false
                this.repliesJustCreated.push(payload)
            },
            
        },
        watch: {
            replies(newValue,oldValue) {
                let additions = newValue.filter(i => {
                    return !oldValue.some(i_ => i_.node_id == i.node_id)
                })
                if(additions.length > 0) this.network_getRepliesExtraData(additions)
            }
        },
        components: {
            LoadingIconEx,
            AnimatedHeightWrapper,
            Popover,
            Reactions,
            HiddenItemLoading,
            SimpleDiffView,
            ImgWrapper,
            ReviewCommentReply,
            ReviewCommentReplyCreator,
            Container: styled.div``,
            Main: styled.div``,
            FileHeader: styled.div``,
            DiffView: styled.div``,
            LinesNotShown: styled.div``,
            CodeLine: styled.div``,
            BlobNum: styled.div``,
            BlobCode: styled.div``,
            Comment: styled.div``,
            WhoDidWhatAt: styled.div``,
            CommentBody: styled.div``,
            Replies: styled.div``,
            ResolveConversation: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
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