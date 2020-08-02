<template> 
    <Container class="bubble bg-white" style="margin-top:15px">
        <FileHeader class="file-header" :class="{pending:reviewProvided().state == 'pending'}">
            <button class="btn-link text-gray float-right f6 d-block" v-if="reviewComment.outdated" @click="triggerShowOutdated">
                <svg class="octicon octicon-fold position-relative mr-1" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 9l3 3H8v3H6v-3H4l3-3zm3-6H8V0H6v3H4l3 3 3-3zm4 2c0-.55-.45-1-1-1h-2.5l-1 1h3l-2 2h-7l-2-2h3l-1-1H1c-.55 0-1 .45-1 1l2.5 2.5L0 10c0 .55.45 1 1 1h2.5l1-1h-3l2-2h7l2 2h-3l1 1H13c.55 0 1-.45 1-1l-2.5-2.5L14 5z"></path></svg>
                {{showOutdated ? 'Hide outdated' : 'Show outdated'}}
            </button> 
            <router-link to="/" class="link-gray-dark">
                {{path}}
            </router-link> 
        </FileHeader>

        
            <DiffView class="diff-view" v-if="!reviewComment.outdated || showOutdated">
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
                <ReviewCommentReply v-for="item in reviewProvided().state == 'pending' ? replies : replies.slice(0,repliesExtraData.cursor)" :reply="item" :key="item.id"></ReviewCommentReply>
            </Replies>
            
           <!--  <Replies v-else>
                <Comment class="px-3 pt-3 pb-2" v-for="item in commentsOfPendingReview().filter(i => i.replyTo && i.replyTo.id == reviewComment.id)" :key="item.id">

                    <WhoDidWhatAt class="d-flex flex-row">
                        <div class="flex-auto">
                            <router-link :to="`/${item.author.login}`" class="d-inline-block">
                                <ImgWrapper>
                                    <img :src="item.author.avatarUrl" :alt="`@${item.author.login}`" width="16" height="16">
                                </ImgWrapper>
                            </router-link>
                            <router-link :to="`/${item.author.login}`" class="f5 text-bold link-gray-dark">{{item.author.login}}</router-link> 
                        </div>

                        <div class="ml-2 btn-link height-full">
                            <svg class="octicon octicon-kebab-horizontal" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
                        </div>
                    </WhoDidWhatAt>

                    <CommentBody    v-html="item.bodyHTML" 
                                    class="markdown-body p-0 pt-2 f5">
                    </CommentBody>
                    <Reaction class="mt-2" :data="item" :disabled="!reviewComment.viewerCanReact">
                    </Reaction>

                </Comment>
            </Replies> -->
            

            <HiddenItemLoading v-if="repliesExtraData.cursor < replies.length && reviewProvided().state != 'pending'" style="padding-bottom:0px!important" :loading="repliesExtraData.loading" :dataGetter="network_getData">
                {{replies.length - repliesExtraData.cursor}} {{replies.length - repliesExtraData.cursor > 1 ? 'replies' : 'reply'}} remained.
            </HiddenItemLoading>

            <div v-if="pullRequestProvided().viewerCanUpdate" class="border-top reply btn-link text-bold text-left muted-link btn-block">
                Reply...
            </div>

       
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_dateFormat,util_analyseFileType,util_markdownParse} from '@/util'
    import {LoadingIconEx,AnimatedHeightWrapper,Popover,SimpleDiffView, ImgWrapper} from '@/components'
    import HiddenItemLoading from './HiddenItemLoading'
    import {mapState} from 'vuex'
    import ClipboardJS from 'clipboard';
    import Reaction from './Reaction'
    import ReviewCommentReply from './ReviewCommentReply'
    import * as graphql from '../graphql'
    import * as api from '@/network/api'
    import { authRequiredGitHubGraphqlApiQuery,authRequiredGet } from '@/network'
    export default {
        inject: ['reviewCommentReplies','commentsOfPendingReview','reviewProvided','pullRequestProvided'],
        provide() {
            return {
                repliesExtraData: () => [...this.repliesExtraData.data,this.extraData.data]
            }
        },
        data() {
            return {
                showHiddenDiffHunk: false,
                showOutdated: false,
                repliesExtraData: {
                    cursor: 0,
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
                extraData: {
                    data: {},
                    loading: false
                }
            }
        },
        props: {
            reviewComment: {
                type: Object,
                required: true
            },
        },
        computed: {
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            pullRequestProvided_() {
                return this.pullRequestProvided()
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
                let replies = [...this.reviewCommentReplies(),...this.commentsOfPendingReview()].filter(item => {
                    return item.in_reply_to_id == this.reviewComment.id
                })
                return replies || []
            },
            isProseFileType() {
                if(!this.reviewComment.path) return 
                return util_analyseFileType.isProse(this.reviewComment.path)
            },
        },
        created() {
            this.network_getData()
        },
        methods: {
            network_getData() {
                this.network_getRepliesExtraData()
                this.network_getReviewCommentExtraData()
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
            async network_getRepliesExtraData() {
                if(this.reviewProvided().state == 'pending') return
                if(this.repliesExtraData.loading || this.replies.length === 0) return
                if(this.repliesExtraData.cursor >= this.replies.length) return
                let nodeIds = []
                this.replies.forEach(i => nodeIds.push(i.node_id))
                try{
                    this.repliesExtraData.loading = true
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_PR_REVIEW_COMMENTS_WITH_NODE_ID,
                        {
                            variables: {
                                ids: nodeIds.slice(this.repliesExtraData.cursor,this.repliesExtraData.cursor + 5)
                            }
                        }
                    )

                    try{
                        this.repliesExtraData.data = this.repliesExtraData.data.concat(res.data.data.nodes)
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                    
                    this.repliesExtraData.cursor += 5
                }catch(e) {
                    console.log(e)
                }finally{
                    this.repliesExtraData.loading = false
                }
            },
            async network_getReviewCommentExtraData() {
                try {
                    this.extraData.loading = true

                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_PR_REVIEW_COMMENTS_WITH_NODE_ID,
                        {
                            variables: {
                                ids: [this.reviewComment.node_id]
                            }
                        }
                    )

                     try{
                        this.extraData.data = res.data.data.nodes[0]
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                } catch (e) {
                    console.log(e)
                } finally {
                    this.extraData.loading = false
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
        },
        watch: {
            replies(newValue,oldValue) {
                if(newValue.length > 0 && oldValue.length === 0) this.network_getData()
            }
        },
        components: {
            LoadingIconEx,
            AnimatedHeightWrapper,
            Popover,
            Reaction,
            HiddenItemLoading,
            SimpleDiffView,
            ImgWrapper,
            ReviewCommentReply,
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