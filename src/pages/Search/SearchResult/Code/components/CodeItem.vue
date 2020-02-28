<template>
        <Container class="py-4 px-3 flex">
            <AnimatedWidthWrapper class="mr-1" style="flex-shrink:0">
                <img class="rounded-1 v-align-middle"
                    :src="code.repository.owner.avatar_url"
                    width="20"
                    height="20">
            </AnimatedWidthWrapper>
            <Main style="min-width:0">
                <FullName class="text-small text-bold">
                    <router-link to="/search" class="link-gray">{{code.repository.full_name}}</router-link>
                </FullName>
                <ThePath class="f4 text-normal">
                    <router-link to="/search">{{code.path}}</router-link>
                </ThePath>
                <MatchesContent class="matches-content my-1 pl-4 font-mono"
                                :meta="randomMeta"
                                style="white-space: pre">{{matchesContent}}</MatchesContent>

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
                    <AnimatedHeightWrapper>
                        <LastIndexOn v-show="lastCommitAt" class="mr-3">
                            Last indexed on
                            <span class="no-wrap">
                            {{lastCommitAt}}
                        </span>
                        </LastIndexOn>
                    </AnimatedHeightWrapper>
                </MultiInfo>
            </Main>
        </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import axios from 'axios'
    import {mapState} from "vuex";
    import {util_dateFormat,util_analyseFileType,util_adjustStyle} from '../../../../../util'
    import {
        AnimatedHeightWrapper,AnimatedWidthWrapper} from '../../../../../components'
    import {
        WithRandomMetaMixin,
        CancelNetworkOnDestroyMixin} from '../../../../../mixins'
    import {handleException} from "../../../../../store/modules/util";
    import {authRequiredGet} from "../../../../../store/modules/network";
    export default {
        mixins: [WithRandomMetaMixin,CancelNetworkOnDestroyMixin],
        props: {
            code: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                lastCommitAt: undefined,
                loadingLastCommit: false,
                loadingContent: false,
                source: axios.CancelToken.source()
            }
        },
        computed: {
            ...mapState({
                searchQuery: state => state.search.searchQuery
            }),
            fileTypeAndColor: function() {
               return util_analyseFileType.anaylseCodeLanguageByExtensions(this.code.path)
            },
            lastCommitApi: function () {
                return `https://api.github.com/repos/${this.code.repository.full_name}/commits?path=${this.code.path}&page=1&per_page=1`
            },
            matchCount: function() {
                let count = 0
                this.code.text_matches.forEach(item => {
                    count += item.matches.length
                })
                return count
            },
            matchesContent: function () {
               let content = ""
               this.code.text_matches.forEach(item => {
                   content = `${content}${item.fragment}`
               })
               return content
           }
        },
        created(){
            this.getLastCommitNetwork()
        },
        mounted() {
            util_adjustStyle.highlightKeyword(`[meta=${this.randomMeta}]`,this.searchQuery,"background-color: #fff5b1!important;")
        },
        methods: {
            async getLastCommitNetwork() {
                try{
                    this.loadingLastCommit = true
                    const config = {cancelToken: this.source.token}
                    const res = await authRequiredGet(this.lastCommitApi,config)
                    this.lastCommitAt = util_dateFormat.dateFormat("dd zzz, yyyy",new Date(res.data[0].commit.committer.date))
                    this.loadingLastCommit = false
                }catch(e) {
                    handleException(e)
                    this.loadingLastCommit = false
                }
            }
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
            LastIndexOn: styled.div``,
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

</style>