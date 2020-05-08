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

        <DiffView v-if="viewStyle == 'unified' && stretch"  class="diff-view">
            <div class="d-inline-block">
                <CodeLine v-for="(item,index) in diffHunkEntries" :key="`${index}_${item.type}_${item.code}`" class="d-flex width-full" :data-type="lazyLoadedLines.indexOf(item.additionLineIndex) > -1 ? 'lazyLoaded' :item.type">
                    <BlobNum    v-if="item.type !== 'hunk' || item.additionLineIndex == 0"
                                class="blob-num" 
                                :data-line-number="item.deletionLineIndex === 0 ? '...' : item.deletionLineIndex" 
                                :class="{'blob-num-lazy-loaded':lazyLoadedLines.indexOf(item.additionLineIndex) > -1,'blob-num-addition':item.type === 'addition','blob-num-deletion':item.type === 'deletion','blob-num-context':item.type === 'context','blob-num-hunk':item.type == 'hunk'}"></BlobNum>
                    <BlobNum    class="blob-num" 
                                v-if="item.type !== 'hunk'  || item.additionLineIndex == 0"
                                :data-line-number="item.additionLineIndex === 0 ? '...' : item.additionLineIndex" 
                                :class="{'blob-num-lazy-loaded':lazyLoadedLines.indexOf(item.additionLineIndex) > -1,'blob-num-addition':item.type === 'addition','blob-num-deletion':item.type === 'deletion','blob-num-context':item.type === 'context','blob-num-hunk':item.type == 'hunk'}"></BlobNum>
                    
                    <div class="stretch-btn" v-else-if="item.type === 'hunk' && item.additionLineIndex != 0 && index > 0 && index < diffHunkEntries.length - 1 && (diffHunkEntries[index + 1].additionLineIndex - diffHunkEntries[index - 1].additionLineIndex > 21)">
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
                                :class="{'blob-code-lazy-loaded':lazyLoadedLines.indexOf(item.additionLineIndex) > -1,'blob-code-addition':item.type === 'addition','blob-code-deletion':item.type === 'deletion','blob-code-context':item.type === 'context','blob-code-hunk':item.type == 'hunk'}">{{item.code.replace(/^\+/," ").replace(/^-/," ")}}</BlobCode>
                </CodeLine>
            </div>
        </DiffView>

        <DiffView v-else-if="stretch"  class="diff-view-split">
            <div>
                <CodeLine class="d-flex" style="background-color: #fafbfc;" v-for="(item,index) in diffHunkEntries" :key="`${index}_${item.type}_${item.code}`" :data-type="lazyLoadedLines.indexOf(item.additionLineIndex) > -1 ? 'lazyLoaded' :item.type">
                    

                    <!-- hunk -->
                    <BlobNum    v-if="item.additionLineIndex == 0" 
                                class="blob-num text-center" 
                                data-line-number="..." 
                                :class="{'blob-num-lazy-loaded':lazyLoadedLines.indexOf(item.additionLineIndex) > -1,'blob-num-addition':item.type === 'addition','blob-num-deletion':item.type === 'deletion','blob-num-context':item.type === 'context','blob-num-hunk':item.type == 'hunk'}"
                                style="min-width:40px"></BlobNum>

                    <div class="stretch-btn" style="min-width:40px" v-else-if="item.type === 'hunk' && item.additionLineIndex != 0 && index > 0 && index < diffHunkEntries.length - 1 && (diffHunkEntries[index + 1].additionLineIndex - diffHunkEntries[index - 1].additionLineIndex > 21)">
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
                            style="min-width:40px"
                            class="stretch-btn d-inline-flex flex-items-center flex-justify-center"
                            v-else-if="item.type === 'hunk'">
                        <svg v-if="index === 0" class="octicon octicon-fold-up" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 6L7 3 4 6h2v6h2V6h2zm4 0c0-.55-.45-1-1-1h-2.5l1 1h1l-2 2H9v1h1.5l2 2H9v1h4c.55 0 1-.45 1-1l-2.5-2.5L14 6zM3.5 8H5v1H3.5l-2 2H5v1H1c-.55 0-1-.45-1-1l2.5-2.5L0 6c0-.55.45-1 1-1h2.5l-1 1h-1l2 2z"></path></svg>
                        <svg v-else-if="index === diffHunkEntries.length - 1" class="octicon octicon-fold-down" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 11l3 3 3-3H8V5H6v6H4zm-4 0c0 .55.45 1 1 1h2.5l-1-1h-1l2-2H5V8H3.5l-2-2H5V5H1c-.55 0-1 .45-1 1l2.5 2.5L0 11zm10.5-2H9V8h1.5l2-2H9V5h4c.55 0 1 .45 1 1l-2.5 2.5L14 11c0 .55-.45 1-1 1h-2.5l1-1h1l-2-2z"></path></svg>
                        <svg v-else class="octicon octicon-unfold" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.5 7.5L14 10c0 .55-.45 1-1 1H9v-1h3.5l-2-2h-7l-2 2H5v1H1c-.55 0-1-.45-1-1l2.5-2.5L0 5c0-.55.45-1 1-1h4v1H1.5l2 2h7l2-2H9V4h4c.55 0 1 .45 1 1l-2.5 2.5zM6 6h2V3h2L7 0 4 3h2v3zm2 3H6v3H4l3 3 3-3H8V9z"></path></svg>
                    </button>

                    <BlobCode   v-if="item.type == 'hunk'"
                                :class="{'blob-code-lazy-loaded':lazyLoadedLines.indexOf(item.additionLineIndex) > -1,'blob-code-addition':item.type === 'addition','blob-code-deletion':item.type === 'deletion','blob-code-context':item.type === 'context','blob-code-hunk':item.type === 'hunk'}"
                                class="blob-code-split">{{item.code}}</BlobCode>

                    <!-- context -->
                    <Column v-if="item.type !== 'hunk'" class="d-flex" style="width:50%">
                        <BlobNum    v-if="item.type !== 'addition'" 
                                    class="blob-num text-center" 
                                    :class="{'blob-num-lazy-loaded':lazyLoadedLines.indexOf(item.additionLineIndex) > -1,'blob-num-addition':item.type === 'addition','blob-num-deletion':item.type === 'deletion','blob-num-context':item.type === 'context'}"
                                    style="min-width:40px">{{item.deletionLineIndex}}</BlobNum>
                        <BlobCode   v-if="item.type !== 'addition'"
                                    style="min-width:0"
                                    :class="{'blob-code-lazy-loaded':lazyLoadedLines.indexOf(item.additionLineIndex) > -1,'blob-code-addition':item.type === 'addition','blob-code-deletion':item.type === 'deletion','blob-code-context':item.type === 'context'}"
                                    class="blob-code-split"><span class="type-mark-split d-inline-block">{{item.type == 'deletion' ? '-':' '}}</span>{{item.code.replace(/^\+/," ").replace(/^-/," ")}}</BlobCode>
                    </Column>
                    <Column v-if="item.type !== 'hunk'" class="d-flex" style="width:50%;border-left: 1px solid #f6f8fa;">
                        <BlobNum    v-if="item.type !== 'deletion'" 
                                    class="blob-num"
                                    :class="{'blob-num-lazy-loaded':lazyLoadedLines.indexOf(item.additionLineIndex) > -1,'blob-num-addition':item.type === 'addition','blob-num-deletion':item.type === 'deletion','blob-num-context':item.type === 'context'}"
                                    style="min-width:40px">{{item.additionLineIndex}}</BlobNum>
                        <BlobCode   v-if="item.type !== 'deletion'" 
                                    class="blob-code-split"
                                    style="min-width:0"
                                    :class="{'blob-code-lazy-loaded':lazyLoadedLines.indexOf(item.additionLineIndex) > -1,'blob-code-addition':item.type === 'addition','blob-code-deletion':item.type === 'deletion','blob-code-context':item.type === 'context'}"
                        ><span class="type-mark-split d-inline-block">{{item.type == 'addition' ? '+':' '}}</span>{{item.code.replace(/^\+/," ").replace(/^-/," ")}}</BlobCode>
                    </Column>
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
                patch: {
                    unified: '',  
                    split: '',  
                },
                lazyLoadedLines:[]
            }
        },
        computed: {
            diffHunkEntries() {
                if(!this.patch[this.viewStyle]) return []
                let reg = new RegExp(/@{2}([0-9]|\+|-|,|\s)+?@{2}/g)
                let patch = this.patch[this.viewStyle].replace(/\n@@/g,'@@') 
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
                    //let showDefault = entries.reverse().slice(0,16).reverse()
                    //let hidden = entries.slice(16,entries.length).reverse()
                    //if(entries[0].code.trim() === '') entries.shift()
                    diffHunkEntries = diffHunkEntries.concat(entries)
                })

                if( diffHunkEntries[diffHunkEntries.length - 1].additionLineIndex < this.fileContentEntries.length) {
                    diffHunkEntries.push({
                        type: 'hunk',
                        code: '',
                        additionLineIndex: diffHunkEntries[diffHunkEntries.length - 1].additionLineIndex + 1,
                        additionStartLineIndex: diffHunkEntries[diffHunkEntries.length - 1].additionLineIndex + 1,
                        deletionLineIndex: diffHunkEntries[diffHunkEntries.length - 1].deletionLineIndex + 1
                    })
                }

                if(diffHunkEntries[diffHunkEntries.length - 1].additionLineIndex == this.fileContentEntries.length) {
                    if(diffHunkEntries[diffHunkEntries.length - 1].code.trim() == '') diffHunkEntries.pop()
                }

                return diffHunkEntries
            },
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
                if(!this.fileContent) return []
                let lines = this.fileContent.split('\n')
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
            this.patch.unified = this.file.patch
            this.patch.split = this.file.patch.replace(/\n /g,'\n').replace(/\+ /g,'+').replace(/- /g,'-')
            this.network_getData()
        },
        methods: {
            triggerStretch(){
                this.stretch = !this.stretch
            },
            showHiddenCode(hunkLine,stretchUpward,stretchable) {
                if(!stretchable) return
                let startLineIndexToSliceFileContentEntries
                let endLineIndexToSliceFileContentEntries


                this.diffHunkEntries.forEach((item,index) => {
                    if(item.additionLineIndex == hunkLine.additionLineIndex) {
                        if(index == 0) {
                            startLineIndexToSliceFileContentEntries = 0
                            endLineIndexToSliceFileContentEntries = hunkLine.additionLineIndex - 1
                        }else if(index == this.diffHunkEntries.length - 1){
                            startLineIndexToSliceFileContentEntries = hunkLine.additionLineIndex    
                            endLineIndexToSliceFileContentEntries = this.fileContentEntries.length
                        }else{
                            startLineIndexToSliceFileContentEntries = this.diffHunkEntries[index - 1].additionLineIndex + 1
                            endLineIndexToSliceFileContentEntries = hunkLine.additionLineIndex - 1
                        }
                    }
                })

                
                let entiesToShow = this.fileContentEntries.filter(item => {
                    return item.additionLineIndex <= endLineIndexToSliceFileContentEntries + 1 && item.additionLineIndex >= startLineIndexToSliceFileContentEntries
                })

                let newHunkStr

                if(stretchUpward) {
                    if(entiesToShow.length > 20 || (entiesToShow.length <= 20 && entiesToShow[0].additionLineIndex === 1)) {
                        entiesToShow = entiesToShow.reverse().slice(0,20).reverse()
                        let reg = new RegExp(/@{2}([0-9]|\+|-|,|\s)+?@{2}/g)
                        let hunkStrMatch = hunkLine.code.match(reg)
                        let hunkStr
                        if(hunkStrMatch) {
                            hunkStr = hunkStrMatch[0]
                            let execPattern = /[0-9]+/g
                            let execResult
                            let hunkData = []
                            while((execResult = execPattern.exec(hunkStr)) != null) {
                                hunkData.push(execResult[0])
                            }
                            newHunkStr = `@@ -${parseInt(hunkData[0]) - entiesToShow.length},${parseInt(hunkData[1]) + entiesToShow.length} +${parseInt(hunkData[2]) - entiesToShow.length},${parseInt(hunkData[3]) + entiesToShow.length} @@`
                        }
                    } 

                    let fileContentRawToShowArr = []
                    let lazyLoadedLines = []
                    entiesToShow.forEach(item => {
                        fileContentRawToShowArr.push(item.code)
                        lazyLoadedLines.push(item.additionLineIndex)
                    })

                    if(newHunkStr) fileContentRawToShowArr.splice(0,0,newHunkStr)
                    

                    this.lazyLoadedLines = this.lazyLoadedLines.concat(lazyLoadedLines)

                    let fileContentRawToShow
                    if(this.viewStyle == 'unified') {
                        fileContentRawToShow = ` ${fileContentRawToShowArr.join('\n ')}`
                    } else {
                        fileContentRawToShow = `${fileContentRawToShowArr.join('\n')}`
                    }

                    this.patch[this.viewStyle] = this.patch[this.viewStyle].replace(hunkLine.code,fileContentRawToShow)

                } else {
                    let fileContentRawToShowArr = []
                    let lazyLoadedLines = []
                    
                    entiesToShow.slice(0,20).forEach(item => {
                        fileContentRawToShowArr.push(item.code)
                        lazyLoadedLines.push(item.additionLineIndex)
                    })

                    console.log(entiesToShow.slice(0,20))

                    this.lazyLoadedLines = this.lazyLoadedLines.concat(lazyLoadedLines)

                    let fileContentRawToShow
                    if(this.viewStyle == 'unified') {
                        fileContentRawToShow = ` ${fileContentRawToShowArr.join('\n ')}`
                    } else {
                        fileContentRawToShow = `${fileContentRawToShowArr.join('\n')}`
                    }

                    if(hunkLine.code != '') {
                        if(entiesToShow.length > 20) {
                            this.patch[this.viewStyle] = this.patch[this.viewStyle].split(hunkLine.code)[0] + fileContentRawToShow + '\n' + hunkLine.code + this.patch[this.viewStyle].split(hunkLine.code)[1]
                        }else{
                            this.patch[this.viewStyle] = this.patch[this.viewStyle].replace(hunkLine.code,fileContentRawToShow) 
                        }
                    }else {
                        
                         //console.log(this.patch[this.viewStyle])
                        // console.log(fileContentRawToShow)
                         //console.log(fileContentRawToShowArr)
                        this.patch[this.viewStyle] = this.patch[this.viewStyle] + '\n' + fileContentRawToShow
                       
                    }

                    
                }

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
                }catch(e) {
                    console.log(e)
                }finally{
                    this.loading = false
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
            Column: styled.div``,
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
    white-space: pre;
    padding-right: 10px;
    padding-left: 4px;
    word-wrap: normal;
    font-size: 12px;
    flex: auto;
    display: flex;
    align-items: center;
    padding-top: 2px;
    padding-bottom: 2px;
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
</style>