<template>
        <Container class="py-4 mx-3 flex">
            <svg height="16"
                 v-if="issueType === 'issue'"
                 class="d-inline-block v-align-text-bottom flex-shrink-0"
                 :style="{color: issue.state === 'open' ? '#28a745' : '#cb2431'}"
                 fill="currentColor"
                 viewBox="0 0 14 16"
                 version="1.1"
                 width="14"
                 aria-hidden="true"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>
            <svg height="16"
                 v-else="issueType === 'pullRequest'"
                 class="d-inline-block v-align-text-bottom flex-shrink-0"
                 :style="{color: issue.state === 'open' ? '#28a745' : '#6f42c1'}"
                 fill="currentColor"
                 viewBox="0 0 12 16"
                 version="1.1"
                 width="12"
                 aria-hidden="true"><path fill-rule="evenodd" d="M11 11.28V5c-.03-.78-.34-1.47-.94-2.06C9.46 2.35 8.78 2.03 8 2H7V0L4 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0010 15a1.993 1.993 0 001-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zM4 3c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v6.56A1.993 1.993 0 002 15a1.993 1.993 0 001-3.72V4.72c.59-.34 1-.98 1-1.72zm-.8 10c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>

            <Main class="ml-1">
                <FullName class="flex-shrink-0 text-small text-bold">
                    <router-link to="/search" class="link-gray">{{fullName}}
                        <span class="text-normal">#{{issue.number}}</span>
                    </router-link>
                </FullName>
                <Title class="f4 text-normal">
                    <router-link to="/search" :meta="randomMeta">{{issue.title}}</router-link>
                </Title>


                <Labels class="text-gray">
                    <span v-for="item in issue.labels"
                          :style="{background:'#' + item.color,
                          color:isLight('#' + item.color) ? 'inherit' : 'white'}"
                          :meta="randomMeta"
                          class="label d-inline-block v-align-text-top"
                          :key="item.url">{{item.name}}</span>
                </Labels>

                <MultiInfo class="d-flex flex-wrap text-small text-gray">
                    <OpenByAndDate class="mr-3">
                        <strong>{{issue.user.login}}</strong> opened
                        <span class="no-wrap">
                        {{openAt}}
                        </span>
                    </OpenByAndDate>

                    <CommentCount v-if="issue.comments > 0" class="mr-3">
                        {{issue.comments}} {{issue.comments > 1 ? 'comments' : 'comment'}}
                    </CommentCount>
                </MultiInfo>
            </Main>
        </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import marked from 'marked'
    import DOMPurify from 'dompurify'
    import {mapState} from "vuex";
    import {util_dateFormat,util_color,util_adjustStyle} from '../../../../../util'
    import {
        AnimatedHeightWrapper} from '../../../../../components'
    import {
        WithRandomMetaMixin} from '../../../../../mixins'
    export default {
        mixins: [WithRandomMetaMixin],
        props: {
            issue: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
            }
        },
        computed: {
            ...mapState({
                searchQuery: state => state.search.searchQuery
            }),
            issueType: function() {
                return this.issue.pull_request ? "pullRequest" : "issue"
            },
            fullName: function () {
                return this.issue.repository_url.replace("https://api.github.com/repos/","")
            },
            openAt: function () {
                return util_dateFormat.dateFormat( "zzz d, yyyy",new Date(this.issue.created_at))
            },
          /*  bodyHTML: function () {
                let bodyHTML = marked(this.issue.body)
                return DOMPurify.sanitize(bodyHTML)
            }*/
        },
        created(){
        },
        mounted() {
            util_adjustStyle.highlightKeyword(`[meta=${this.randomMeta}]`,this.searchQuery)
            util_adjustStyle.adjustInlineBlockStyle(`span[meta=${this.randomMeta}]`)
        },
        methods: {
            isLight(str) {
                return util_color.isLight(str)
            }
        },
        components: {
            AnimatedHeightWrapper,
            Container: styled.div``,
            Main: styled.div``,
            FullName: styled.div``,
            Title: styled.div``,
            MultiInfo: styled.div``,
            Labels: styled.div``,
            OpenByAndDate: styled.div``,
            CommentCount: styled.div``,
        }
    }
</script>

<style scoped>
.label{
    height: 20px;
    padding: .15em 4px;
    font-size: 12px;
    font-weight: 600;
    line-height: 15px;
    border-radius: 2px;
    box-shadow: inset 0 -1px 0 rgba(27,31,35,.12);
    margin-top:2px;
    margin-bottom:2px;
}
</style>