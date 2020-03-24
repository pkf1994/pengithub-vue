<template> 
    <DiffView class="diff-view">
        <div :class="{'d-inline-block':!isProseFileType}" style="min-width: 100%;">
            <CodeLine v-for="(item,index) in diffHunkEntries.entries" :key="index" class="flex width-full">
                <BlobNum    class="blob-num position-sticky"  
                            style="left:0px" 
                            :data-line-number="item.type === 'hunk' ? '...' : item.deletionLineIndex" 
                            :class="{
                                'blob-num-addition':item.type === 'addition',
                                'blob-num-deletion':item.type === 'deletion',
                                'blob-num-context':item.type === 'context',
                                'blob-num-hunk':item.type === 'hunk'
                            }"></BlobNum>

                <BlobNum    class="blob-num position-sticky" 
                            style="left:26px" 
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
            </CodeLine>
        </div>
    </DiffView>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_analyseFileType} from '@/util'
    export default {
        data() {
            return {
               
            }
        },
        props: {
            diffPatch: {
                type: String,
                default: ''
            },
            path: {
                type: String,
                required: false
            }
        },
        computed: {
            diffHunkEntries() {
                if(!this.diffPatch) return []
                let reg = new RegExp(/@{2}([0-9]|\+|-|,|\s)+?@{2}/g)
                let patch = this.diffPatch.replace(/\n@@/g,'@@') 
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
                                    code: item,
                                    additionLineIndex: additionLineIndex,
                                    additionStartLineIndex,
                                    deletionStartLineIndex
                                })
                                additionLineIndex += 1
                                break
                            case '-':
                                entries.push({
                                    type: 'deletion',
                                    code: item,
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
                    let showDefault = entries.reverse().slice(0,16).reverse()
                    let hidden = entries.slice(16,entries.length).reverse()
                    //if(entries[0].code.trim() === '') entries.shift()
                    diffHunkEntries = diffHunkEntries.concat(entries.reverse())
                })
                return diffHunkEntries
            },
            isProseFileType() {
                if(!this.path) return 
                return util_analyseFileType.isProse(this.path)
            }
        },
        components: {
            DiffView: styled.div``,
            LinesNotShown: styled.div``,
            CodeLine: styled.div``,
            BlobNum: styled.div``,
            BlobCode: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
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
</style>