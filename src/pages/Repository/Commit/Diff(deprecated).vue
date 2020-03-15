<template>
    <Container class="container">
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

            <Actions class="actions pt-0 mb-2 flex-shrink-0 text-right">
                <svg aria-label="Show options" class="octicon octicon-kebab-horizontal mx-2" viewBox="0 0 13 16" version="1.1" width="13" height="16" role="img"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
            </Actions>
        </Header>

        <DiffView v-show="stretch"  class="diff-view">
        <div class="d-inline-block">
            <CodeLine v-for="(item,index) in diffHunkEntries" :key="index" class="flex width-full" :data-type="item.type">
                <BlobNum    v-if="item.type !== 'hunk'"
                            class="blob-num" 
                            :data-line-number="item.deletionLineIndex === 0 ? '...' : item.deletionLineIndex" 
                            :class="{'blob-num-lazy-loaded':item.type === 'lazyLoaded','blob-num-addition':item.type === 'addition','blob-num-deletion':item.type === 'deletion','blob-num-context':item.type === 'context','blob-num-hunk':index === 0 && diffHunkEntries.length === 0 || (item.deletionStartLineIndex === item.deletionLineIndex && item.additionStartLineIndex === item.additionLineIndex)}"></BlobNum>
                <BlobNum    class="blob-num" 
                            v-if="item.type !== 'hunk'"
                            :data-line-number="item.additionLineIndex === 0 ? '...' : item.additionLineIndex" 
                            :class="{'blob-num-lazy-loaded':item.type === 'lazyLoaded','blob-num-addition':item.type === 'addition','blob-num-deletion':item.type === 'deletion','blob-num-context':item.type === 'context','blob-num-hunk':index === 0 && diffHunkEntries.length === 0 || (item.deletionStartLineIndex === item.deletionLineIndex && item.additionStartLineIndex === item.additionLineIndex)}"></BlobNum>
                <button @click="() => showHiddenCode(item,item.additionLineIndex === item.additionStartLineIndex && item.additionLineIndex !== 0)"  
                        :disabled="fileContent === ''"

                        v-if="item.type === 'hunk'" class="stretch-btn d-inline-flex flex-items-center flex-justify-center">
                    <svg class="octicon octicon-unfold" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.5 7.5L14 10c0 .55-.45 1-1 1H9v-1h3.5l-2-2h-7l-2 2H5v1H1c-.55 0-1-.45-1-1l2.5-2.5L0 5c0-.55.45-1 1-1h4v1H1.5l2 2h7l2-2H9V4h4c.55 0 1 .45 1 1l-2.5 2.5zM6 6h2V3h2L7 0 4 3h2v3zm2 3H6v3H4l3 3 3-3H8V9z"></path></svg>
                </button>
                <TypeMark   :data-type="item.type" 
                            v-if="item.type == 'addition' || item.type == 'deletion' || item.type == 'context' || item.type == 'lazyLoaded'"
                            class="type-mark text-center"
                            :class="{'blob-code-lazy-loaded':item.type === 'lazyLoaded','blob-code-addition':item.type === 'addition','blob-code-deletion':item.type === 'deletion','blob-code-context':item.type === 'context','blob-code-hunk':index === 0 && diffHunkEntries.length === 0 || (item.deletionStartLineIndex === item.deletionLineIndex && item.additionStartLineIndex === item.additionLineIndex)}">
                    
                </TypeMark>
                <BlobCode   class="blob-code" 
                            :class="{'blob-code-lazy-loaded':item.type === 'lazyLoaded','blob-code-addition':item.type === 'addition','blob-code-deletion':item.type === 'deletion','blob-code-context':item.type === 'context','blob-code-hunk':index === 0 && diffHunkEntries.length === 0 || (item.deletionStartLineIndex === item.deletionLineIndex && item.additionStartLineIndex === item.additionLineIndex)}">{{item.code.replace(/^(\+|-)/,' ')}}</BlobCode>
            </CodeLine>
        </div>
    </DiffView>
       
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper} from '@/components'
    import {authRequiredGet} from '@/network'
    export default {
        props: {
            file: {
                type: Object,
                required: true
            },
            viewStyle: {
                type: String,
                default: 'unified'
            }
        },
        data() {
            return {
                stretch: true,
                fileContent: '',
                loading: false,
                clippyFlag: true,
                diffHunkEntries: []
            }
        },
        computed: {
            diffstat() {
                let additionCount = 0
                let deletionCount = 0
                let sum = 0
                this.diffHunkEntries.forEach(item => {
                    if(item.type === 'addition') additionCount += 1
                    if(item.type === 'deletion') deletionCount += 1
                    sum = additionCount + deletionCount
                })

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
            fileContentEntries() {
                let lines = this.fileContent.split(/\n/)
                let entries = []
                lines.forEach((item,index) => {
                    entries.push({
                        type: 'lazyLoaded',
                        code: item,
                        additionLineIndex:index + 1
                    })
                })
                return entries
            },
            splitDiffHunkEntries() {

            }
        },
        created() {
            this.network_getData()
            this.generateDiffHunkEntries()
        },
        methods: {
            triggerStretch(){
                this.stretch = !this.stretch
            },
            generateSplitDiffHunkEntries(patchArr) {

            },
            generateDiffHunkEntries() {
                if(!this.file.patch) return []
                let reg = new RegExp(/@{2}([0-9]|\+|-|,|\s)+?@{2}/g)
                let patch = this.file.patch
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
                    let hunkStatistic = (patchItem.split('@@')[1]).replace(/@/g,'').trim().split(' ')
                    let deletionLineIndex,deletionStartLineIndex,addititonLineIndex,additionStartLineIndex
                    deletionLineIndex = deletionStartLineIndex = parseInt(hunkStatistic[0].split(',')[0].replace(/[-|\+]/g,'')) - 1
                    addititonLineIndex = additionStartLineIndex = parseInt(hunkStatistic[1].split(',')[0].replace(/[-|\+]/g,'')) - 1
                    let lines = patchItem.split(/\n/)
                    let entries = []
                    lines.forEach(item => {
                        switch(item[0]) {
                            case '+':
                                entries.push({
                                    type: 'addition',
                                    code: item,
                                    additionLineIndex: addititonLineIndex,
                                    additionStartLineIndex,
                                    deletionStartLineIndex
                                })
                                addititonLineIndex += 1
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
                                        additionLineIndex: addititonLineIndex,
                                        deletionLineIndex: deletionLineIndex,
                                        additionStartLineIndex,
                                        deletionStartLineIndex
                                    })
                                }else {
                                    entries.push({
                                        type: 'context',
                                        code: item,
                                        additionLineIndex: addititonLineIndex,
                                        deletionLineIndex: deletionLineIndex,
                                        additionStartLineIndex,
                                        deletionStartLineIndex
                                    })
                                }
                                
                                addititonLineIndex += 1
                                deletionLineIndex += 1
                        }
                    }) 
                    let showDefault = entries.reverse().slice(0,16).reverse()
                    let hidden = entries.slice(16,entries.length).reverse()
                    if(entries[0].code.trim() === '') entries.shift()
                    diffHunkEntries = diffHunkEntries.concat(entries.reverse())
                })

                this.diffHunkEntries = diffHunkEntries
            },
            showHiddenCode(hunkLine,stretchable) {
                if(!stretchable) return
                let startLineIndexToSliceFileContentEntries
                let endLineIndexToSliceFileContentEntries

                this.diffHunkEntries.forEach((item,index) => {
                    if(item.additionLineIndex == hunkLine.additionLineIndex) {
                        if(index == 0) {
                            startLineIndexToSliceFileContentEntries = 0
                            endLineIndexToSliceFileContentEntries = hunkLine.additionLineIndex - 1
                        } else {
                            startLineIndexToSliceFileContentEntries = this.diffHunkEntries[index - 1].additionLineIndex + 1
                            endLineIndexToSliceFileContentEntries = hunkLine.additionLineIndex - 1
                        }
                    }
                })
                
                let entiesToShow = this.fileContentEntries.filter(item => {
                    return item.additionLineIndex <= endLineIndexToSliceFileContentEntries + 1 && item.additionLineIndex >= startLineIndexToSliceFileContentEntries
                })

                entiesToShow.reverse().forEach((item,index) => {
                    item.additionLineIndex = hunkLine.additionLineIndex - index
                    item.deletionLineIndex = hunkLine.deletionLineIndex - index
                })

                let spliceIndex
                this.diffHunkEntries.forEach((item,index) => {
                    if(item.additionLineIndex == startLineIndexToSliceFileContentEntries - 1) spliceIndex = index
                })
                this.diffHunkEntries.splice(spliceIndex + 1, 1)
                this.diffHunkEntries.splice(spliceIndex + 1, 0 ,...entiesToShow)

               
            },
            async network_getData() {
                try{
                    this.loading = true
                    let url = this.file.contents_url
                    let res = await authRequiredGet(
                        url,
                        {
                            headers: {
                                "Accept":"application/vnd.github.VERSION.raw"
                            }
                        }
                    )
                    this.fileContent = res.data
                    this.loading = false
                }catch(e) {
                    this.loading = false
                    console.log(e)
                }
            },
        },
        components: {
            AnimatedHeightWrapper,
            Container: styled.div``,
            Header: styled.div``,
            Info: styled.div``,
            Actions: styled.div``,
            Content: styled.div``,
            Diffstat: styled.span``,
            DiffView: styled.div``,
            CodeLine: styled.div``,
            BlobNum: styled.div``,
            BlobCode: styled.div``,
            TypeMark: styled.div``
        }
    }
</script>

<style scoped lang="scss">
.container{
    position: relative;
    margin-top: 16px;
    margin-bottom: 16px;
    border: 1px solid #ddd;
    border-radius: 3px
}

.header{
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
    overflow-x: auto;
    overflow-y: hidden;
    
}

.blob-num{
    min-width: 40px;
    padding: 2px 3px;
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
    white-space: pre;
    padding-right: 10px;
    padding-left: 10px;
    word-wrap: normal;
    font-size: 12px;
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
    background-color: #f1f8ff;
    padding-top:4px;
    padding-bottom: 4px;
}
.blob-code-lazy-loaded {
    background-color: #fafbfc;
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
    padding-right: 6px;
    padding-left: 6px;
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
    min-width: 80px;
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

button[disabled] {
    color:#d1d5da
}
</style>