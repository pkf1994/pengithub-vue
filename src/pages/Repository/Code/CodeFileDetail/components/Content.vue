<template>
    <ComplexBubble>
        <template v-slot:title>
            <AnimatedHeightWrapper>
                <Header class="Box-header py-2 d-flex flex-column flex-shrink-0">
                    <Pane class="d-flex py-1 py-md-0 flex-auto flex-justify-between">
                        <BtnGroup class="BtnGroup">
                            <a v-if="contentType == 'html' || contentType == 'text'" :href="raw" class="btn btn-sm BtnGroup-item">
                                Raw
                            </a>
                            <router-link v-if="contentType == 'html' || contentType == 'text'" :to='blameRouterLink' class="btn btn-sm BtnGroup-item">
                                Blame
                            </router-link>
                            <a v-else :href="contentType = 'binary'" class="btn btn-sm BtnGroup-item">
                                Download
                            </a>
                        </BtnGroup>
                            
                        <EditOrDelete class="d-flex">
                            <button v-if="contentType == 'html' || contentType == 'text'" class="d-block btn-octicon">
                                <svg viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 12v3h3l8-8-3-3-8 8zm3 2H1v-2h1v1h1v1zm10.3-9.3L12 6 9 3l1.3-1.3a.996.996 0 011.41 0l1.59 1.59c.39.39.39 1.02 0 1.41z"></path></svg>
                            </button>
                            <button class="d-block btn-octicon">
                                <svg viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11 2H9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1H2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1v9c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V5c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 12H3V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9zm1-10H2V3h9v1z"></path></svg>
                            </button>
                        </EditOrDelete>
                    </Pane>
                    <div v-if="fileSize" class="text-mono f6 flex-auto pt-2 pr-3 text-normal">
                        {{fileSize.number}} {{fileSize.unit}}
                    </div>
                </Header>
            </AnimatedHeightWrapper>
            
        </template>
       
        <Content class="Box-body content markdown-body" v-if="contentType == 'html'" v-html="content">
        </Content>

        <Content class="Box-body p-0 content" v-else-if="contentType == 'text'">
            <BlobRow class="d-flex" v-for="(item,index) in fileDetailRows" :key="item + index">
                <BlobNumber class="blob-num">{{index + 1}}</BlobNumber>
                <BlobCode class="blob-code">{{item}}</BlobCode>
            </BlobRow>
        </Content>

        <Content class="text-center p-3" v-else>
            <a :href="raw">View raw</a>
        </Content>

    </ComplexBubble>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ComplexBubble,AnimatedHeightWrapper,ImgWrapper} from '@/components'
    import {mapState,mapGetters} from 'vuex'
    import {util_fileSize} from '@/util'
    export default {
        props: {
            contentType: String,
            content: String,
            currentRef: String,
            path: String,
            byteSize: Number,
        },
        computed: {
            fileDetailRows() {
                let rows = this.content && this.content.split(/\n/)
                if(!rows[rows.length - 1]) {
                    rows.pop()
                }
                return rows || []
            },
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            raw() {
                let pathFragment = this.$route.params.pathMatch
                return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${pathFragment}`
            },
            historyRouterLink() {
                return `/${this.owner}/${this.repo}/commits/${this.currentRef}/${this.path}`
            },
            blameRouterLink() {
                return `/${this.owner}/${this.repo}/blame/${this.currentRef}/${this.path}`
            },
            fileSize() {
                if(this.byteSize) return util_fileSize.getFileSizeWithNumberAndUnit(this.byteSize)
            }
        },
        components: {
            ImgWrapper,
            ComplexBubble,
            AnimatedHeightWrapper,
            Header: styled.div``,
            Pane: styled.div``,
            LineAndSize: styled.div``,
            BtnGroup: styled.div``,
            EditOrDelete: styled.div``,
            Content: styled.div``,
            BlobRow: styled.div``,
            BlobNumber: styled.div``,
            BlobCode: styled.div``,
            ByteSize: styled.div``
        }
    }
</script>

<style lang="scss">
@import 'node_modules/@primer/css/markdown/index.scss';
</style>

<style scoped lang='scss'>
@import 'node_modules/@primer/css/box/index.scss';
button{
    svg{
        display: block;
        fill: currentColor;
    }
}
.content{
    overflow-x: auto;
    overflow-y: hidden;
}
.blob-num{
    width: 1%;
    min-width: 50px;
    padding-right: 10px;
    padding-left: 10px;
    font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    font-size: 12px;
    line-height: 20px;
    color: rgba(27,31,35,.3);
    text-align: right;
    white-space: nowrap;
    vertical-align: top;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.blob-code{
    overflow: visible;
    font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    font-size: 12px;
    color: #24292e;
    word-wrap: normal;
    white-space: pre;
    position: relative;
    padding-right: 10px;
    padding-left: 10px;
    line-height: 20px;
    vertical-align: top;
}

.file-info-divider {
    display: inline-block;
    width: 1px;
    height: 18px;
    margin-right: 3px;
    margin-left: 3px;
    vertical-align: middle;
    background-color: #ddd;
}
</style>