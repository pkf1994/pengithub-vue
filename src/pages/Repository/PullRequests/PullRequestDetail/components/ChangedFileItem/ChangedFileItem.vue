<template>
    <Container class="diff">
        <DiffHeader class="diff-header" :class="{target:$route.hash == `#diff-${file.sha}`}">
            <div>
                <span class="diffstat">
                    <span v-for="(statItem,index) in diffState" :key="index" :class="{'diffstat-block-deleted':statItem == 'deletion','diffstat-block-added':statItem == 'addition','diffstat-block-neutral':statItem == 'neutral'}"></span>
                </span>

                <DiffPath class="diff-path">
                    <router-link to="/"> 
                        {{file.filename}}
                    </router-link>
                </DiffPath>
            </div>
        </DiffHeader>

        <DiffView class="diff-view">
            <div :class="{'d-inline-block':!isProseFileType}" style="min-width: 100%;">
                <CodeLine v-for="(item,index) in diffHunkEntries" :key="index" class="width-full">
                    <div class="d-flex">
                        <BlobNum    class="blob-num"  
                                    :data-line-number="item.type === 'hunk' ? '...' : item.deletionLineIndex" 
                                    :class="{
                                        'blob-num-addition':item.type === 'addition',
                                        'blob-num-deletion':item.type === 'deletion',
                                        'blob-num-context':item.type === 'context',
                                        'blob-num-hunk':item.type === 'hunk'
                                    }"></BlobNum>

                        <BlobNum    class="blob-num" 
                                    :data-line-number="item.type === 'hunk' ? '...' : item.additionLineIndex" 
                                    :class="{
                                        'blob-num-addition':item.type === 'addition',
                                        'blob-num-deletion':item.type === 'deletion',
                                        'blob-num-context':item.type === 'context',
                                        'blob-num-hunk':item.type === 'hunk'
                                    }"></BlobNum>
                                    
                        <BlobCode   class="blob-code" 
                                    :class="{
                                        'prose': isProseFileType,
                                        'blob-code-addition':item.type === 'addition',
                                        'blob-code-deletion':item.type === 'deletion',
                                        'blob-code-context':item.type === 'context',
                                        'blob-code-hunk':item.type === 'hunk'
                                    }">{{item.code}}</BlobCode> 
                    </div>

                    <ReviewCommentGroup class="review-comment-wrapper" v-for="item in getRootReviewComments(item)" :key="item.id" :rootReviewComment="item"></ReviewCommentGroup>

                </CodeLine>
            </div>
        </DiffView>

    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
     import {util_analyseFileType} from '@/util'
    import ReviewCommentGroup from './ReviewCommentGroup'
    import { authRequiredGet } from '@/network'
    export default {
        inject: ['reviewCommentsProvided','pendingReviewComments'],
        props: {
            file: {
                type: Object,
                required: true
            }
        },
        computed: {
            diffState() {
                if(this.file.additions == this.file.deletions) {
                    return ['addition','deletion']
                }else if(this.file.additions == 0) {
                    if(this.file.deletions == 1) return ['deletion','neutral']
                    return ['deletion','deletion']
                }else if(this.file.deletions == 0) {
                    if(this.file.additions == 1) return ['addition','neutral']
                    return ['addition','addition'] 
                }else if(this.file.additions > this.file.deletions) {
                    return ['addition','neutral']
                }else{
                   return ['deletion','neutral']
                }
            },
             isProseFileType() {
                if(!this.file.filename) return 
                return util_analyseFileType.isProse(this.file.filename)
            },
             diffHunkEntries() {
                if(!this.file.patch) return []
                let reg = new RegExp(/@{2}([0-9]|\+|-|,|\s)+?@{2}/g)
                let patch = this.file.patch.replace(/\n@@/g,'@@') 
                let markFlagArr = patch.match(reg)
                if(!markFlagArr) return patch
                let splitFlag = (new Date()).toString()
                markFlagArr.forEach(item => {
                    patch = patch.replace(item,splitFlag)
                })
                let patchArr = patch.split(splitFlag).filter(item => {
                    return item.trim() !== ''
                })
                patchArr.forEach((item,index) => {
                    patchArr[index] = `${markFlagArr[index]}${item}`
                })

                //console.log(patchArr)

                let diffHunkEntries = []

                patchArr.forEach( patchItem => {
                    //console.log(patchItem)
                    let hunkStatistic = (patchItem.split('@@')[1]).replace(/@/g,'').trim().split(' ')
                    let deletionLineIndex,deletionStartLineIndex,additionLineIndex,additionStartLineIndex
                    deletionLineIndex = deletionStartLineIndex = parseInt(hunkStatistic[0].split(',')[0].replace(/[-|\+]/g,'')) - 1
                    additionLineIndex = additionStartLineIndex = parseInt(hunkStatistic[1].split(',')[0].replace(/[-|\+]/g,'')) - 1
                    let lines = patchItem.split(/\n/)
                    let entries = []
                    lines.forEach(item => {
                        switch(item[0]) {
                            case '+':
                                entries.push({
                                    type: 'addition',
                                    code: item.replace(/^\+/,' '),
                                    additionLineIndex: additionLineIndex,
                                    additionStartLineIndex,
                                    deletionStartLineIndex
                                })
                                additionLineIndex += 1
                                break
                            case '-':
                                entries.push({
                                    type: 'deletion',
                                    code: item.replace(/^-/,' '),
                                    deletionLineIndex: deletionLineIndex,
                                    additionStartLineIndex,
                                    deletionStartLineIndex
                                })
                                deletionLineIndex += 1
                                break
                            default:
                                if(item.match(/^@{2}([0-9]|\+|-|,|\s)+?@{2}/)) {
                                     entries.push({
                                        type: 'hunk',
                                        code: item,
                                        additionLineIndex: additionLineIndex,
                                        deletionLineIndex: deletionLineIndex,
                                        additionStartLineIndex,
                                        deletionStartLineIndex
                                    })
                                }else {
                                    entries.push({
                                        type: 'context',
                                        code: item,
                                        additionLineIndex: additionLineIndex,
                                        deletionLineIndex: deletionLineIndex,
                                        additionStartLineIndex,
                                        deletionStartLineIndex
                                    })
                                }
                                
                                additionLineIndex += 1
                                deletionLineIndex += 1
                        }
                    }) 
                   
                    diffHunkEntries = diffHunkEntries.concat(entries)
                })
                return diffHunkEntries
            },
            reviewCommentsAtRightSideHolder() {
                let commentArr = this.reviewCommentsProvided().filter(item => {
                    return item.path == this.file.filename && item.line && !item.in_reply_to_id && item.side == 'RIGHT'
                })
                let reviewCommentsHolder = {}
                commentArr.forEach(i => {
                    if(!reviewCommentsHolder[i.line]) {
                        reviewCommentsHolder[i.line] = [i]
                    }else{
                        reviewCommentsHolder[i.line].push(i)
                    }
                })
                return reviewCommentsHolder
            },
            reviewCommentsAtLeftSideHolder() {
                let commentArr = this.reviewCommentsProvided().filter(item => {
                    return item.path == this.file.filename && item.line && !item.in_reply_to_id && item.side == 'LEFT'
                })
                let reviewCommentsHolder = {}
                commentArr.forEach(i => {
                    if(!reviewCommentsHolder[i.line]) {
                        reviewCommentsHolder[i.line] = [i]
                    }else{
                        reviewCommentsHolder[i.line].push(i)
                    }
                })
                return reviewCommentsHolder
            },
        },
        methods: {
            getRootReviewComments(diffHunkEntry) {
                return this.reviewCommentsAtRightSideHolder[diffHunkEntry.additionLineIndex] || this.reviewCommentsAtLeftSideHolder[diffHunkEntry.deletionLineIndex]
            }
        },
        components: {
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
@import 'node_modules/@primer/css/labels/index.scss';
.diff{
    position: relative;
    margin-bottom: 15px;
    border-top: 1px solid #d1d5da;
    border-bottom: 1px solid #d1d5da;
    .diff-header{
        padding: 5px 10px 3px;
        font-size: 12px;
        color: #444d56;
        text-align: left;
        text-shadow: 0 1px 0 #fff;
        background-image: linear-gradient(#fff,#f6f8fa);
        border-bottom: 1px solid #d1d5da;
        div{
            position: relative;
            padding: 6px 0 6px 30px;
            font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
            line-height: 1.2;
            a{
                color: inherit;
            }
        }
    }
}


.diffstat{
    position: absolute;
    top: 4px;
    left: 0;
    font-size: 12px;
    font-weight: 600;
    color: #586069;
    white-space: nowrap;
    cursor: default;
    .diffstat-block-deleted {
        background-color: #cb2431;
    }
    .diffstat-block-added {
        background-color: #2cbe4e;
    }
    .diffstat-block-neutral {
        background-color: #d1d5da;
    }
}

.diff-path{
    padding-left: 0;
    margin-left: 0;
    word-break: break-all;
    border-left-width: 0;
    box-shadow: inset 0 0 0 transparent;
}

.diff-view{
    position: relative;
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

.prose{
    white-space: pre-wrap;
}

.blob-code-addition {
    background-color: #e6ffed;
}
.blob-code-deletion {
    background-color: #ffeef0;
}
.blob-code-hunk {
    background-color: #f8f5ff;;
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

.review-comment-wrapper{
    padding-top: 1px;
    padding-bottom: 1px;
    background-color: #fafbfc;
    border: solid #dfe2e5;
    border-width: 1px 0;
}

.comment-btn-wrapper{
    width: 100vw;
    padding-top: 0px;
    background-color: #fafbfc;
}

.btn {
    display: inline-block;
    padding: 9px 15px;
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.5;
    white-space: nowrap;
    vertical-align: middle;
    background-repeat: repeat-x;
    background-position: -1px -1px;
    background-size: 110% 110%;
    border: 1px solid rgba(27,31,35,.2);
    border-radius: .25em;
    appearance: none;
}
.target{
    background-color: #fff5b1;
    background-image: none!important;
}
</style>