<template>
     <Container class="the-container">
        <Header class="header d-flex flex-column">
            <Info class="info flex-auto min-width-0 mb-md-0 mb-2">
                <button class="btn-octicon" style="width: 22px;" @click="triggerStretch">
                    <svg v-if="stretch" class="octicon octicon-chevron-down Details-content--hidden" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6l-5 5z"></path></svg>
                    <svg v-else class="octicon octicon-chevron-right Details-content--shown" viewBox="0 0 8 16" version="1.1" width="8" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3l5 5z"></path></svg>
                </button>

                <!-- file changing count -->
                <Diffstat class="diffstat">
                    {{file.changes}} 
                    <span v-for="(item,index) in diffstat" :key="index" :class="item" class="diffstat-item"></span>    
                </Diffstat>

                <span class="link-gray-dark">
                    {{file.filename}}
                </span>

                <svg v-if="clippyFlag" class="octicon octicon-clippy d-inline-block mx-1" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"></path></svg>
                <svg v-else class="octicon octicon-check js-clipboard-check-icon mx-1 d-inline-block text-green d-none" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
            </Info>    

            <Actions class="actions pt-0 mb-2 flex-shrink-0 text-right position-relative" @click="openPopover">
                <svg aria-label="Show options" class="octicon octicon-kebab-horizontal mx-2" viewBox="0 0 13 16" version="1.1" width="13" height="16" role="img"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
                <Popover ref="popover" class="f5 py-2" :popoverStyle="{right:'-4px',top: '25px'}" style="width:185px">
                    <button @click.stop="triggerShowComments" class="pl-5 btn-link py-2 dropdown-item">
                        <span v-if="showComments" class="position-absolute" style="margin-left:-20px">
                            <svg class="octicon octicon-check" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                        </span>
                        <span>Show comments</span>
                    </button>
                    <div class="dropdown-divider"></div>
                    <router-link :to="viewFileRouterLink" class="pl-5 btn-link py-2 dropdown-item">
                        View file
                    </router-link>
                </Popover>
            </Actions>
        </Header>

        <DiffView v-if="stretch"  class="diff-view" style="overflow-x:auto">
            <div class="d-inline-block" style="min-width:100%">
                <CodeLine v-for="(item,index) in diffHunkEntries" :key="`${index}_${item.type}_${item.code}`" class="width-full" :data-type="lazyLoadedLines.indexOf(item.additionLineIndex) > -1 ? 'lazyLoaded' :item.type">
                    <div class="d-flex">
                        <BlobNum    v-if="item.type !== 'hunk' || item.additionLineIndex == 0"
                                    class="blob-num" 
                                    :data-line-number="item.deletionLineIndex <= 0 ? '...' : item.deletionLineIndex" 
                                    :class="{'blob-num-lazy-loaded':lazyLoadedLines.indexOf(item.additionLineIndex) > -1,'blob-num-addition':item.type === 'addition','blob-num-deletion':item.type === 'deletion','blob-num-context':item.type === 'context','blob-num-hunk':item.type == 'hunk'}"></BlobNum>
                        <BlobNum    class="blob-num" 
                                    v-if="item.type !== 'hunk'  || item.additionLineIndex == 0"
                                    :data-line-number="item.additionLineIndex <= 0 ? '...' : item.additionLineIndex" 
                                    :class="{'blob-num-lazy-loaded':lazyLoadedLines.indexOf(item.additionLineIndex) > -1,'blob-num-addition':item.type === 'addition','blob-num-deletion':item.type === 'deletion','blob-num-context':item.type === 'context','blob-num-hunk':item.type == 'hunk'}"></BlobNum>
                        
                        <div class="stretch-btn" 
                            v-else-if="item.type === 'hunk' && item.additionLineIndex != 0 && index > 0 && index < diffHunkEntries.length - 1 && (diffHunkEntries[index + 1].additionLineIndex - diffHunkEntries[index - 1].additionLineIndex > 21)" 
                            >
                            <button @click="() => showHiddenCode(item,false,item.additionLineIndex === item.additionStartLineIndex && item.additionLineIndex !== 0)"  
                                    :disabled="fileContent === ''"
                                    v-if="item.type === 'hunk'" 
                                    class="d-flex width-full flex-items-center flex-justify-center">
                                <svg class="octicon octicon-fold-down" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 11l3 3 3-3H8V5H6v6H4zm-4 0c0 .55.45 1 1 1h2.5l-1-1h-1l2-2H5V8H3.5l-2-2H5V5H1c-.55 0-1 .45-1 1l2.5 2.5L0 11zm10.5-2H9V8h1.5l2-2H9V5h4c.55 0 1 .45 1 1l-2.5 2.5L14 11c0 .55-.45 1-1 1h-2.5l1-1h1l-2-2z"></path></svg>
                            </button>
                            <button @click="() => showHiddenCode(item,true,item.additionLineIndex === item.additionStartLineIndex && item.additionLineIndex !== 0)"  
                                    :disabled="fileContent === ''"
                                    v-if="item.type === 'hunk'" 
                                    class="d-flex width-full flex-items-center flex-justify-center">
                                <svg class="octicon octicon-fold-up" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 6L7 3 4 6h2v6h2V6h2zm4 0c0-.55-.45-1-1-1h-2.5l1 1h1l-2 2H9v1h1.5l2 2H9v1h4c.55 0 1-.45 1-1l-2.5-2.5L14 6zM3.5 8H5v1H3.5l-2 2H5v1H1c-.55 0-1-.45-1-1l2.5-2.5L0 6c0-.55.45-1 1-1h2.5l-1 1h-1l2 2z"></path></svg>
                            </button>
                        </div>
                        <button @click="() => showHiddenCode(item,index !== diffHunkEntries.length - 1,item.additionLineIndex === item.additionStartLineIndex && item.additionLineIndex !== 0)"  
                                :disabled="fileContent === ''"
                                class="stretch-btn d-inline-flex flex-items-center flex-justify-center"
                                v-else>
                            <svg v-if="index === 0" class="octicon octicon-fold-up" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 6L7 3 4 6h2v6h2V6h2zm4 0c0-.55-.45-1-1-1h-2.5l1 1h1l-2 2H9v1h1.5l2 2H9v1h4c.55 0 1-.45 1-1l-2.5-2.5L14 6zM3.5 8H5v1H3.5l-2 2H5v1H1c-.55 0-1-.45-1-1l2.5-2.5L0 6c0-.55.45-1 1-1h2.5l-1 1h-1l2 2z"></path></svg>
                            <svg v-else-if="index === diffHunkEntries.length - 1" class="octicon octicon-fold-down" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 11l3 3 3-3H8V5H6v6H4zm-4 0c0 .55.45 1 1 1h2.5l-1-1h-1l2-2H5V8H3.5l-2-2H5V5H1c-.55 0-1 .45-1 1l2.5 2.5L0 11zm10.5-2H9V8h1.5l2-2H9V5h4c.55 0 1 .45 1 1l-2.5 2.5L14 11c0 .55-.45 1-1 1h-2.5l1-1h1l-2-2z"></path></svg>
                            <svg v-else class="octicon octicon-unfold" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.5 7.5L14 10c0 .55-.45 1-1 1H9v-1h3.5l-2-2h-7l-2 2H5v1H1c-.55 0-1-.45-1-1l2.5-2.5L0 5c0-.55.45-1 1-1h4v1H1.5l2 2h7l2-2H9V4h4c.55 0 1 .45 1 1l-2.5 2.5zM6 6h2V3h2L7 0 4 3h2v3zm2 3H6v3H4l3 3 3-3H8V9z"></path></svg>
                        </button>

                        <TypeMark   :data-type="item.type" 
                                    v-if="item.type == 'addition' || item.type == 'deletion' || item.type == 'context' || item.type == 'lazyLoaded'"
                                    class="type-mark text-center"
                                    :class="{'blob-code-lazy-loaded':lazyLoadedLines.indexOf(item.additionLineIndex) > -1,'blob-code-addition':item.type === 'addition','blob-code-deletion':item.type === 'deletion','blob-code-context':item.type === 'context','blob-code-hunk':item.type == 'hunk'}">
                            
                        </TypeMark>
                        <BlobCode   class="blob-code"
                                    @click.stop="triggerShowSingleCommentCreator(index)"
                                    :class="{'blob-code-lazy-loaded':lazyLoadedLines.indexOf(item.additionLineIndex) > -1,'blob-code-addition':item.type === 'addition','blob-code-deletion':item.type === 'deletion','blob-code-context':item.type === 'context','blob-code-hunk':item.type == 'hunk'}">{{item.code.replace(/^\+/," ").replace(/^-/," ")}}</BlobCode>
                    </div>
                    

                    <div v-if="showComments">
                        <ReviewCommentGroup class="review-comment-wrapper" v-for="rootReviewCommentItem in getRootReviewComments(index)" :key="rootReviewCommentItem.id" :rootReviewComment="rootReviewCommentItem"></ReviewCommentGroup>
                    </div>

                    <SingleCommentCreator :path="file.filename" :position="index" v-if="showSingleCommentCreatorAt.some(i => i == index)" @cancel="() => triggerShowSingleCommentCreator(index,false)"></SingleCommentCreator>
                    
                    
                </CodeLine>
            </div>
                
        </DiffView>

    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_analyseFileType} from '@/util'
    import ReviewCommentGroup from './ReviewCommentGroup'
    import SingleCommentCreator from './SingleCommentCreator'
    import {Diff} from '../../../../components'
    import { authRequiredGet } from '@/network'
    import {mapState} from 'vuex'
    export default {
        inject: ['reviewCommentsProvided','pendingReviewComments'],
        mixins: [Diff],
        data() {
            return {
                showSingleCommentCreatorAt: [],
                showComments: true
            }
        },
        computed: {
            ...mapState({
                state_newCreatedReviewComments: state => state.pullRequestDetail.newCreatedReviewComments,
                state_deletedReviewComments: state => state.pullRequestDetail.deletedReviewComments
            }),
            rootReviewCommentsHolder() {
                let commentArr = [...this.reviewCommentsProvided(),...this.state_newCreatedReviewComments].filter(item => {
                    return item.path == this.file.filename && item.position && !item.in_reply_to_id
                })
                let deDuplicatedCommentArr = []
                commentArr.forEach(i => {
                    if(!deDuplicatedCommentArr.some(i_ => i_.id == i.id)) {
                        deDuplicatedCommentArr.push(i)
                    }
                })
                let reviewCommentsHolder = {}
                deDuplicatedCommentArr.forEach(i => {
                    if(!reviewCommentsHolder[i.position]) {
                        reviewCommentsHolder[i.position] = [i]
                    }else{
                        reviewCommentsHolder[i.position].push(i)
                    }
                })
                return reviewCommentsHolder
            },
        },
        methods: {
            getRootReviewComments(index) {
                return this.rootReviewCommentsHolder[index] && this.rootReviewCommentsHolder[index].sort((a,b) => a.created_at - b.created_at)
            },
            triggerShowSingleCommentCreator(payload,flag = true) {
                if(payload == 0) return 
                let idx = this.showSingleCommentCreatorAt.indexOf(payload)
                if(flag) {
                    if(idx == -1) this.showSingleCommentCreatorAt.push(payload)
                } else {
                    if(idx !== undefined) this.showSingleCommentCreatorAt.splice(idx,1)
                }
            },
            triggerShowComments() {
                this.showComments = !this.showComments
                this.closeModal()
            }
        },
        components: {
            SingleCommentCreator,
            ReviewCommentGroup,
            Container: styled.div``,
            DiffHeader: styled.div``,
            DiffView: styled.div``,
            DiffPath: styled.span``,
            CodeLine: styled.div``,
            BlobNum: styled.div``,
            BlobCode: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/dropdown/index.scss';
.the-container{
    position: relative;
    margin-top: 16px;
    margin-bottom: 16px;
    border: 1px solid #ddd;
    border-radius: 3px
}

.header{
    position: sticky;
    top: 60px;
    z-index: 9;
    padding: 5px 10px;
    background-color: #fafbfc;
    border-bottom: 1px solid #e1e4e8;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;   
    .info{
        font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
        font-size: 12px;
        line-height: 32px;
        .diffstat{
            font-size: 12px;
            font-weight: 600;
            color: #586069;
            white-space: nowrap;
            cursor: default;
            .diffstat-item{
                display: inline-block;
                width: 8px;
                height: 8px;
                margin-left: 1px;
            }
        }
    }
    .actions{
        font-size: 13px;
    }
}


.added {
    background-color: #2cbe4e;
}
.deleted {
    background-color: #cb2431;
}
.neutral {
    background-color: #d1d5da;
}

.diff-view{
    position: relative;
    border-top: 1px solid #d1d5da;
    border-bottom: 1px solid #d1d5da;
}
.diff-view-split{
    position: relative;
    border-top: 1px solid #d1d5da;
    border-bottom: 1px solid #d1d5da;
    
}

.blob-num{
    min-width: 50px;
    padding-left: 10px;
    padding-right: 10px;
    font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    font-size: 12px;
    line-height: 20px;
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
    
    padding-right: 10px;
    padding-left: 4px;
    word-wrap: normal;
    font-size: 12px;
    flex: auto;
    display: flex;
    align-items: center;
    padding-top: 2px;
    padding-bottom: 2px;
    white-space: pre-wrap;
}

.blob-code-split{
    font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    position: relative;
    padding-right: 10px;
    padding-left: 10px;
    line-height: 20px;
    vertical-align: top;
    font-size: 12px;
    color: #24292e;
    white-space: pre-wrap;
    flex-grow: 1;
}

.blob-code-context{
    background-color: white;
}

.blob-code-addition {
    background-color: #e6ffed;
}
.blob-code-deletion {
    background-color: #ffeef0;
}
.blob-code-lazy-loaded {
    background-color: #fafbfc;
}
.blob-code-hunk {
    background-color: #f1f8ff;
    color: rgba(27,31,35,.7);
    padding-top:4px;
    padding-bottom: 4px;
    padding-left: 8px;
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
    background-color: #dbedff;
}
.blob-num-lazy-loaded {
    background-color: #fafbfc;
}

/* .blob-code-addition~.blob-code-lazy-loaded,
.blob-code-deletion~.blob-code-lazy-loaded,
.blob-code-hunk~.blob-code-lazy-loaded {
    border-top: 1px solid #eaecef;
} */

[data-type="lazyLoaded"]+[data-type="addition"],
[data-type="lazyLoaded"]+[data-type="deletion"],
[data-type="lazyLoaded"]+[data-type="context"],
[data-type="lazyLoaded"]+[data-type="hunk"],
[data-type="addition"]+[data-type="lazyLoaded"],
[data-type="deletion"]+[data-type="lazyLoaded"],
[data-type="context"]+[data-type="lazyLoaded"],
[data-type="hunk"]+[data-type="lazyLoaded"]{
    border-top: 1px solid #eaecef;
}

.type-mark{
    width:20px;
    font-size: 12px;
    padding-left: 6px;
}

.type-mark-split{
    width:20px;
    font-size: 12px;
}

.type-mark[data-type="addition"]:before {
    content: '+';
}
.type-mark[data-type="deletion"]:before {
    content: '-';
}
.type-mark[data-type="context"]:before {
    content: ' ';
}
.type-mark[data-type="lazy-loaded"]:before {
    content: ' ';
}

.stretch-btn{
    min-width: 100px;
    padding-top: 4px;
    padding-bottom: 4px;
    display: block;
    width: auto;
    height: auto;
    margin-right: -1px;
    color: #586069;
    cursor: pointer;
    background-color: #dbedff;
}

.stretch-btn:hover{
    color: #fff;
    text-shadow: none;
    background-color: #0366d6;
    border-color: #0366d6;
}

button[disabled] {
    color:#d1d5da
}

.white-space-pre{
    white-space: pre;
}
</style>