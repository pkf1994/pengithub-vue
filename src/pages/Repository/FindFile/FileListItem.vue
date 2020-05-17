<template>
    <router-link :to="`/${owner}/${repo}/file/${sha}/${file.path}`" class="list-item">
        <svg class="octicon octicon-file" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6 5H2V4h4v1zM2 8h7V7H2v1zm0 2h7V9H2v1zm0 2h7v-1H2v1zm10-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5z"></path></svg>
        <span class="filename css-truncate css-truncate-target js-filename" v-html="highlightedHTML"></span>
    </router-link>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoading} from '@/components'
    export default {
        props: {
            highlightStr: {
                type: String,
                required: false
            },
            file: {
                type: Object,
                required: true
            }
        },
        computed: {
            owner() {
                return this.$route.params.owner
            },
            repo() {
                return this.$route.params.repo
            },
            sha() {
                return this.$route.params.sha
            },
            highlightedHTML() {
                if(!this.highlightStr) return this.file.path
                let highlightedHTML = this.file.path
                let highlightStrEx
                if(this.highlightStr.charAt(0).match(/[A-Z]/)) {
                    highlightStrEx = this.highlightStr.charAt(0).toLowerCase() + this.highlightStr.slice(1)
                }else if(this.highlightStr.charAt(0).match(/[a-z]/)) {
                    highlightStrEx = this.highlightStr.charAt(0).toUpperCase() + this.highlightStr.slice(1)
                }
                let reg = new RegExp(this.highlightStr,"g")
                if(reg.test(highlightedHTML)) {
                    highlightedHTML = highlightedHTML.replace(reg,`<strong>$&</strong>`)
                }
                if(highlightStrEx) {
                    let reg2 = new RegExp(highlightStrEx,"g")
                    if(reg2.test(highlightedHTML)) {
                        highlightedHTML = highlightedHTML.replace(reg2,`<strong>$&</strong>`)
                    }
                }
                return highlightedHTML
            }
        },
        components: {
            CommonLoading,
            Container: styled.div``,
            SearchInput: styled.div``,
            Main: styled.div``,
            FileListItem: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/truncate/index.scss';
.list-item {
    border-top: 1px solid #eaecef;
    position: relative;
    width: 100%;
    padding: 14px 15px 14px 35px;
    overflow-wrap: break-word;
    line-height: inherit;
    text-align: left;
    svg{
        top: 16px;
        color: rgba(3,47,98,.5);
        position: absolute;
        top: 16px;
        left: 12px;
        width: 16px;
        text-align: center;
        vertical-align: bottom;
    }
    .filename {
        max-width: 100%;
    }
}
</style>