<template>
        <Container class="py-4 px-3 d-flex">
            <img class="rounded-1 v-align-middle mr-1 flex-shrink-0"
                :src="code.repository.owner.avatar_url"
                width="20"
                height="20">
            <Main style="min-width:0" class="flex-auto">
                <FullName class="text-small text-bold">
                    <router-link to="/search" class="link-gray">{{code.repository.full_name}}</router-link>
                </FullName>
                <ThePath class="f4 text-normal">
                    <router-link to="/search">{{code.path}}</router-link>
                </ThePath>
                <MatchesContent class="matches-content my-1 font-mono"
                                :meta="randomMeta">
                    <div v-for="(item,index) in code.text_matches || []" :key="index" class="flex-column">
                        <div v-for="(_item,_index) in item.fragment.split('\n')" :key="_index" class="d-flex">
                            <div class="blob-num">·</div>
                            <div class="blob-code">{{_item}}</div>
                        </div>
                        <FlagmentDivision class="d-flex" v-if="index !== code.text_matches.length - 1">
                            <div class="blob-num divider">…</div>
                            <div class="blob-code divider flex-auto"></div>
                        </FlagmentDivision>
                    </div>
                </MatchesContent>

                <MultiInfo class="d-flex flex-wrap text-small text-gray">
                    <Language class="mr-3" v-if="fileTypeAndColor.type !== 'Unknow'">
                    <span>
                        <span class="repo-language-color" :style="{backgroundColor: fileTypeAndColor.color}"></span>
                        <span>{{fileTypeAndColor.type}}</span>
                    </span>
                    </Language>
                    <MatchesNumber>
                        Showing the top {{matchCount}} {{matchCount > 1 ? "matches" : "match"}}
                    </MatchesNumber>
                </MultiInfo>
            </Main>
        </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import axios from 'axios'
    import {mapState} from "vuex";
    import {util_dateFormat,util_analyseFileType,util_adjustStyle} from '@/util'
    import {
        AnimatedHeightWrapper,AnimatedWidthWrapper} from '@/components'
    import {
        WithRandomMetaMixin,
        CancelNetworkOnDestroyMixin} from '@/mixins'
    import {handleException} from "@/store/modules/util";
    import {authRequiredGet} from "@/store/modules/network";
    export default {
        mixins: [WithRandomMetaMixin,CancelNetworkOnDestroyMixin],
        inject: ['query'],
        props: {
            code: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
            }
        },
        computed: {
            fileTypeAndColor: function() {
               return util_analyseFileType.anaylseCodeLanguageByExtensions(this.code.path)
            },
            matchCount: function() {
                let count = 0
                if(!this.code.text_matches) return count
                this.code.text_matches.forEach(item => {
                    count += item.matches.length
                })
                return count
            },
           /*  processTextMatches() {
                let processTextMatches = []
                this.code.text_matches.forEach(item => {
                    item.matches.reverse().forEach(_item => {
                        item.fragment = `${item.fragment.substring(0,_item.indices[0])}<strong>${_item.text}</strong>${item.fragment.substring(_item.indices[1],item.fragment.length)}`
                    })
                    processTextMatches.push
                })
                return processTextMatches
            }, */
            matchesContent: function () {
                let content = ""
                if(!this.code.text_matches) return ""
                this.code.text_matches.forEach(item => {
                    content = `${content}${item.fragment}`
                })

                return content.split('\n')
           }
        },
        created(){
        },
        mounted() {
            util_adjustStyle.highlightKeyword(`[meta=${this.randomMeta}]`,this.query(),"background-color: #fff5b1!important;")
        },
        components: {
            AnimatedHeightWrapper,
            AnimatedWidthWrapper,
            Container: styled.div``,
            Main: styled.div``,
            FullName: styled.div``,
            ThePath: styled.p``,
            MatchesContent: styled.div``,
            MultiInfo: styled.div``,
            Language: styled.div``,
            MatchesNumber: styled.div``,
            FlagmentDivision: styled.div``,
        }
    }
</script>

<style scoped>

.repo-language-color{
    position: relative;
    top: 1px;
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
}
.matches-content{
    border: 1px solid #e1e4e8;
    border-radius: 3px;
    overflow-x: auto;
    font-size: 12px;
    overflow-y: hidden;
    line-height: 20px;
}
.blob-num{
    min-width: 50px;
    font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    font-size: 12px;
    line-height: 20px;
    color: rgba(27,31,35,.3);
    text-align: right;
}
.blob-code{
    position: relative;
    padding-right: 10px;
    padding-left: 10px;
    line-height: 20px;
    vertical-align: top;
    overflow: visible;
    font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    font-size: 12px;
    color: #24292e;
    word-wrap: normal;
    white-space: pre-wrap;
}
.divider{
    height: 18px;
    padding: 0 10px;
    line-height: 15px;
    background-color: #f0f5fa;
}
.divider .blob-code{
    padding-top: 0;
    padding-bottom: 0;
    cursor: default;
    background-color: #f8fafd;
}
</style>