<template>
    <Container class="the-container" :class="{loading:!this.file.sha}">
        <Header class="header d-flex flex-column">
            <Info class="info flex-auto min-width-0 mb-md-0 mb-2">
                <button class="btn-octicon" style="width: 22px;" @click="triggerStretch">
                    <svg v-if="stretch" class="octicon octicon-chevron-down Details-content--hidden" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6l-5 5z"></path></svg>
                    <svg v-else class="octicon octicon-chevron-right Details-content--shown" viewBox="0 0 8 16" version="1.1" width="8" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3l5 5z"></path></svg>
                </button>

                <!-- file changing count -->
                <Diffstat class="diffstat">
                    {{lineCount}} 
                    <span v-for="(item,index) in ['deleted','deleted','deleted','deleted','deleted']" :key="index" :class="item" class="diffstat-item"></span>    
                </Diffstat>

                <span class="link-gray-dark">
                    {{file.path}}
                </span>

                <svg v-if="clippyFlag" class="octicon octicon-clippy d-inline-block mx-1" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"></path></svg>
                <svg v-else class="octicon octicon-check js-clipboard-check-icon mx-1 d-inline-block text-green d-none" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
            </Info>    

            <Actions class="actions pt-0 mb-2 flex-shrink-0 text-right position-relative" @click="openPopover">
                <svg aria-label="Show options" class="octicon octicon-kebab-horizontal mx-2" viewBox="0 0 13 16" version="1.1" width="13" height="16" role="img"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
                <Popover ref="popover" class="f5" :popoverStyle="{right:0}">
                    <router-link :to="viewFileRouterLink" class="pl-5 btn-link py-2 dropdown-item">
                        View file
                    </router-link>
                </Popover>
            </Actions>
        </Header>

        <div v-if="!showDiff" class="p-4 d-flex flex-column flex-items-center flex-justify-center" @click="triggerShowDiff">
           <div class="text-bold f4 js-button-text" style="color: #0366d6;">Load diff</div>
           <p class="hidden-diff-reason text-gray-light f6 mb-0 text-center">
                This file was deleted.
            </p>
        </div>

        <DiffView v-else-if="stretch"  class="diff-view">
            <div class="d-inline-block">
                <CodeLine class="d-flex width-full">
                    <BlobNum    class="blob-num blob-num-hunk" 
                                data-line-number="..."></BlobNum>
                    <BlobNum    class="blob-num blob-num-hunk" 
                                 data-line-number="..."
                                ></BlobNum>
                    <BlobCode   class="blob-code blob-code-hunk" 
                                >@@ -1,{{fileContentEntries.length}} +0,0 @@</BlobCode>
                </CodeLine>
                <CodeLine v-for="(item,index) in fileContentEntries" :key="`${index}_${item.code}`" class="d-flex width-full">
                    <BlobNum    class="blob-num blob-code-deletion" 
                                :data-line-number="item.index"></BlobNum>
                    <BlobNum    class="blob-num blob-code-deletion" 
                                ></BlobNum>
                    <BlobCode   class="blob-code blob-code-deletion" 
                                >&nbsp;- {{item.code}}</BlobCode>
                </CodeLine>
                <CodeLine class="d-flex width-full">
                    <BlobNum    class="blob-num blob-num-hunk" 
                                data-line-number="..."></BlobNum>
                    <BlobNum    class="blob-num blob-num-hunk" 
                                 data-line-number="..."
                                ></BlobNum>
                    <BlobCode   class="blob-code blob-code-hunk" 
                                ></BlobCode>
                </CodeLine>
            </div>
        </DiffView>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper,Popover} from '@/components'
    import {authRequiredGet} from '@/network'
    import {util_json} from '@/util'
    export default {
        props: {
            file: {
                type: Object,
                required: true
            },
            currentRef: String,
            path: String
        },
        data() {
            return {
                showDiff: false,
                stretch: true,
                loading: false,
                clippyFlag: true,
                patch: '',
                lazyLoadedLines:[]
            }
        },
        computed: {
            fileContent() {
                if(!this.file.content) return 
                return window.atob(this.file.content)
            },
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            lineCount() {
                return this.fileContentEntries.length
            },
            fileContentEntries() {
                if(!this.fileContent) return []
                return this.fileContent.split('\n').map((i,index) => {
                    return {
                        index: index + 1,
                        code: i
                    }
                })
            },
            viewFileRouterLink() {
                return `/${this.owner}/${this.repo}/blob/${this.currentRef}/${this.path}`
            }
        },
        created() {
            //console.log(window.atob(this.file.content))
        },
        methods: {
            triggerStretch(){
                this.stretch = !this.stretch
            },
            openPopover() {
                this.$refs.popover.show = true
            },
            triggerShowDiff(payload = true) {
                if(!this.file.sha) return 
                this.showDiff = payload
            }
        },
        components: {
            AnimatedHeightWrapper,
            Popover,
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
@import 'node_modules/@primer/css/dropdown/index.scss';
.loading {
    opacity: .4;
    pointer-events: none;
}

.the-container{
    position: relative;
    margin-top: 16px;
    margin-bottom: 16px;
    border: 1px solid #ddd;
    border-radius: 3px;
    transition: all .4s ease;
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

.deleted {
    background-color: #cb2431;
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

.blob-code-deletion {
    background-color: #ffeef0;
}

.blob-code-hunk {
    background-color: #f1f8ff;
    color: rgba(27,31,35,.7);
    padding-top:4px;
    padding-bottom: 4px;
    padding-left: 8px;
}

.blob-num-deletion {
    background-color: #ffdce0;
    border-color: #fdaeb7;
}

.blob-num-hunk {
    background-color: #dbedff;
}


/* .blob-code-addition~.blob-code-lazy-loaded,
.blob-code-deletion~.blob-code-lazy-loaded,
.blob-code-hunk~.blob-code-lazy-loaded {
    border-top: 1px solid #eaecef;
} */


.type-mark{
    width:20px;
    font-size: 12px;
    padding-left: 6px;
}

.type-mark-split{
    width:20px;
    font-size: 12px;
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