<template>
    <ComplexBubble :loading="loading()" :delay="2000">
        <template v-slot:title>
            <AnimatedHeightWrapper>
                <Header class="Box-header py-2 d-flex flex-column flex-shrink-0">
                    <Pane class="d-flex py-1 py-md-0 flex-auto flex-justify-between">
                    <BtnGroup class="BtnGroup">
                        <router-link to='/' class="btn btn-sm BtnGroup-item">
                            Raw
                        </router-link>
                        <router-link to='/' class="btn btn-sm BtnGroup-item">
                            Blame
                        </router-link>
                        <router-link to='/' class="btn btn-sm BtnGroup-item">
                            History
                        </router-link>
                    </BtnGroup>
                        
                    <EditOrDelete class="flex">
                        <button class="d-block btn-octicon">
                            <svg viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 12v3h3l8-8-3-3-8 8zm3 2H1v-2h1v1h1v1zm10.3-9.3L12 6 9 3l1.3-1.3a.996.996 0 011.41 0l1.59 1.59c.39.39.39 1.02 0 1.41z"></path></svg>
                        </button>
                        <button class="d-block btn-octicon">
                            <svg viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11 2H9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1H2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1v9c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V5c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 12H3V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9zm1-10H2V3h9v1z"></path></svg>
                        </button>
                    </EditOrDelete>
                    </Pane>
                    <LineAndSize v-show="!loading() && !(fileDetailRows.length === 0)" class="text-mono f6 flex-auto pt-2 pr-3 text-normal">
                    {{fileDetailRows.length}} lines 
                    </LineAndSize>

                </Header>
            </AnimatedHeightWrapper>
            
        </template>

       
         <Content class="Box-body p-0 content" v-if="isImage && !isSvg">
            <div class="p-3">
                <img :src="raw" class='d-block mx-auto width-fit'> 
            </div>
        </Content>

        <Content class="Box-body p-0 content" v-else-if="isBook" v-html="html()">
        </Content>

        <Content class="Box-body p-3 content text-center" v-else-if="isSvg" v-html="data()">
        </Content>

         <Content class="Box-body p-0 content" v-else>
            <BlobRow class="flex" v-for="(item,index) in fileDetailRows" :key="item + index">
                <BlobNumber class="blob-num">{{index + 1}}</BlobNumber>
                <BlobCode class=" blob-code">{{item}}</BlobCode>
            </BlobRow>
        </Content>

    </ComplexBubble>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ComplexBubble,AnimatedHeightWrapper} from '../../../../../../components'
    import {mapState,mapGetters} from 'vuex'
    import {util_analyseFileType} from '../../../../../../util'
    export default {
        inject: ['data','html','loading'],
        data() {
            return {
            }
        },
        created() {
        },
        computed: {
           /*  ...mapState({
                loading: state => state.repository.code.codeFile.fileDetail.loading,
                data: state => state.repository.code.codeFile.fileDetail.data,
                html: state => state.repository.code.codeFile.fileDetail.html
            }), */
           /*  ...mapGetters([
                'fileDetailRows'
            ]), */
            fileDetailRows() {
                let rows = this.data() && this.data().split(/\n/)
                return rows || []
            },
            isBook() {
                let fileName = this.$route.path.replace(/.*?\//gi,'')
                if(util_analyseFileType.analyseContentTypeByFileName(fileName) === 'book') {
                    return true
                }
                return false
            },
            isImage() {
                let fileName = this.$route.path.replace(/.*?\//gi,'')
                if(util_analyseFileType.analyseContentTypeByFileName(fileName) === 'image') {
                    return true
                }
                return false
            },
            isSvg() {
                let fileName = this.$route.path.replace(/.*?\//gi,'')
                let indexOfLastDot = fileName.lastIndexOf(".")
                let extensions = fileName.substring(indexOfLastDot)
                if(extensions === '.svg') return true
                return false
            },
            raw() {
                let pathFragment = this.$route.path.replace('/blob','')
                return `https://raw.githubusercontent.com${pathFragment}`
            }
        },
        components: {
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
        }
    }
</script>

<style scoped lang='scss'>
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
</style>