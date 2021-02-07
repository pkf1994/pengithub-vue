<template>
    <Container class="file">
        <DiffHeader class="file-header d-flex" :class="{target:$route.hash == `#diff-${file.sha}`}">
            <div class="file-info min-width-0 flex-auto">
                <button class="btn-octicon">
                    <svg v-if="stretch" class="octicon" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12.78 6.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.22 7.28a.75.75 0 011.06-1.06L8 9.94l3.72-3.72a.75.75 0 011.06 0z"></path></svg>
                    <svg v-else class="octicon" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z"></path></svg>
                </button>
                <span class="diffstat">
                    {{file.changes}}
                    <span v-for="(statItem,index) in diffState" :key="index" :class="{'diffstat-block-deleted':statItem == 'deleted','diffstat-block-added':statItem == 'added','diffstat-block-neutral':statItem == 'neutral'}"></span>
                </span>

                <router-link to="/" class="link-gray-dark">
                    {{file.filename}}
                </router-link>

                
            </div>

            <details class="px-2 float-right">
                    <summary class="link-gray height-full d-flex flex-items-center">
                        <svg aria-label="Show options" class="octicon" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path d="M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm13 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>
                    </summary>
            </details>
        </DiffHeader>

        <DiffView class="diff-view">
            <div :class="{'d-inline-block':!isProseFileType}" style="min-width: 100%;">
                <CodeLine  v-for="(item,index) in diffHunkEntries" :key="index" class="width-full">
                    <div @click.stop="triggerShowSingleCommentCreator(index)" class="d-flex">
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

                    <ReviewCommentGroup class="review-comment-wrapper" v-for="rootReviewCommentItem in getRootReviewComments(index)" :key="rootReviewCommentItem.id" :rootReviewComment="rootReviewCommentItem"></ReviewCommentGroup>

                    <!--  <ReviewCommentGroup class="review-comment-wrapper" v-for="pendingRootReviewCommentItem in getPendingRootReviewComments(index)" :key="pendingRootReviewCommentItem.id" :rootReviewComment="pendingRootReviewCommentItem" :pending="true"></ReviewCommentGroup> -->

                    <SingleCommentCreator style="width:100vw" :path="file.filename" :position="index" v-if="showSingleCommentCreatorAt.some(i => i == index)" @cancel="() => triggerShowSingleCommentCreator(index,false)"></SingleCommentCreator>
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
    import { authRequiredGet } from '@/network'
    import {mapState} from 'vuex'
    export default {
        inject: ['reviewCommentsProvided','pendingReviewComments'],
        props: {
            file: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                stretch: true,
                showSingleCommentCreatorAt: []
            }
        },
        computed: {
            ...mapState({
                state_newCreatedReviewComments: state => state.pullRequestDetail.newCreatedReviewComments,
                state_deletedReviewComments: state => state.pullRequestDetail.deletedReviewComments
            }),
           diffState() {
                let additionCount = this.file.additions
                let deletionCount = this.file.deletions
                let sum = additionCount + deletionCount

                if(sum <= 5) {
                    let diffstat = []
                    for(let i = 0; i < additionCount; i++) {
                        diffstat.push('added')
                    }
                    for(let i = 0; i < deletionCount; i++) {
                        diffstat.push('deleted')
                    }
                    while(diffstat.length < 5) {
                        diffstat.push('neutral')
                    }
                    return diffstat
                }

                if(additionCount == 0) {
                    return [
                        'deleted',
                        'deleted',
                        'deleted',
                        'neutral',
                        'neutral',
                    ]
                }else if(deletionCount == 0) {
                    return [
                        'added',
                        'added',
                        'added',
                        'neutral',
                        'neutral',
                    ]
                }else if(additionCount > deletionCount) {
                    return [
                        'added',
                        'added',
                        'added',
                        'deleted',
                        'neutral',
                    ]
                }else if(deletionCount > additionCount) {
                    return [
                        'added',
                        'deleted',
                        'deleted',
                        'deleted',
                        'neutral',
                    ]
                }else if(deletionCount == additionCount) {
                    return [
                        'added',
                        'added',
                        'deleted',
                        'deleted',
                        'neutral',
                    ]
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
         /*    pendingRootReviewCommentsHolder() {
                let commentArr = [...this.pendingReviewComments(),...this.state_newCreatedReviewComments].filter(item => {
                    return item.path == this.file.filename && item.position && !item.in_reply_to_id
                })
                let reviewCommentsHolder = {}
                commentArr.forEach(i => {
                    if(!reviewCommentsHolder[i.position]) {
                        reviewCommentsHolder[i.position] = [i]
                    }else{
                        reviewCommentsHolder[i.position].push(i)
                    }
                })
                return reviewCommentsHolder
            } */
        },
        methods: {
            getRootReviewComments(index) {
                return this.rootReviewCommentsHolder[index] && this.rootReviewCommentsHolder[index].sort((a,b) => a.created_at - b.created_at)
            },
          /*   getPendingRootReviewComments(index) {
                return this.pendingRootReviewCommentsHolder[index]
            }, */
            triggerShowSingleCommentCreator(payload,flag = true) {
                if(payload == 0) return 
                let idx = this.showSingleCommentCreatorAt.indexOf(payload)
                if(flag) {
                    if(idx == -1) this.showSingleCommentCreatorAt.push(payload)
                } else {
                    if(idx !== undefined) this.showSingleCommentCreatorAt.splice(idx,1)
                }
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
@import 'node_modules/@primer/css/labels/index.scss';
@import 'node_modules/@primer/css/buttons/index.scss';

.file{
    position: relative;
    margin-bottom: 20px;
    border: 1px solid rgb(225, 228, 232);
    border-radius: 6px;
    .file-header{
        position: sticky;
        top: 60px;
        padding: 5px 10px;
        background-color: rgb(250, 251, 252);
        border-bottom: 1px solid rgb(225, 228, 232);
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        z-index: 2;
        .file-info{
            font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
            line-height: 32px;
            font-size: 12px;
        }
    }
}

.file:target{
    border-color: rgb(33, 136, 255);
    box-shadow: 0 0 0 .2em rgb(200, 225, 255);
}


.diffstat{
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


details summary::-webkit-details-marker{display:none;}
                        
</style>