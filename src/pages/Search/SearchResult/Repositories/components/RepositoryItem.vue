<template>
    <Container class="py-4 mx-3 d-flex flex-justify-start">
        
        <IconColumn class="flex-shrink-0 mr-2">
            <svg height="16"
                 style="color: #6a737d"
                 class="d-inline-block v-align-text-bottom"
                 fill="currentColor"
                 viewBox="0 0 12 16"
                 version="1.1"
                 width="12"
                 aria-hidden="true">
                <path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"></path></svg>
        </IconColumn>

        <Main class="mt-n1">
            <FullName class="f4 text-normal">
                <router-link :to="`/${repository.full_name}`" :meta="randomMeta">{{repository.full_name}}</router-link>
            </FullName>
            <Description class="mb-1" :meta="randomMeta">
                {{repository.description}}
            </Description>
            
            <Topics>
                <router-link :meta="randomMeta" 
                                :key="item + randomMeta"
                                to="/search"
                                class="topic-item d-inline-block topic-tag f6 px-2 mx-0 mr-1"
                                v-for="item in repository.topics">
                    {{item}}
                </router-link>
            </Topics>

            <MultiInfo class="d-flex flex-wrap text-small text-gray">
                <Stargazers class="mr-3">
                    <router-link class="muted-link"
                                 to="/search">
                        <svg aria-label="star" class="v-align-text-bottom d-inline-block" fill="currentColor" viewBox="0 0 14 16" version="1.1" width="14" height="16" role="img"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>
                        {{stars}}
                    </router-link>
                </Stargazers>
                <Language class="mr-3"  v-if="repository.language">
                    <span>
                        <span v-if="languageColor" class="repo-language-color" :style="{backgroundColor: languageColor}"></span>
                        <span>{{repository.language}}</span>
                    </span>
                </Language>
                <License class="mr-3" v-if="repository.license">
                    {{repository.license.spdx_id}} license
                </License>
                <UpdateAt class="mr-3">
                    Updated
                    <span class="no-wrap">
                        {{date}}
                    </span>
                </UpdateAt>
                <HelpWantedIssues v-if="repository.helpWantedIssuesCount > 0">
                    <router-link class="muted-link" to='/search'>
                        {{repository.helpWantedIssuesCount}} {{repository.helpWantedIssuesCount > 1 ? "issues" : "issue"}} need help
                    </router-link>
                </HelpWantedIssues>
            </MultiInfo>
        </Main>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_numberFormat, util_dateFormat, util_adjustStyle} from '@/util'
    import {mapState} from "vuex";
    import {util_analyseFileType} from '@/util'
    import {
        AnimatedHeightWrapper} from '@/components'
    import {
        WithRandomMetaMixin} from '@/mixins'
    export default {
        mixins: [WithRandomMetaMixin],
        inject: ['queryProvided'],
        props: {
            repository: {
                type: Object,
                required: true
            }
        },
        computed: {
            stars: function () {
                return util_numberFormat.thousands2K2M(this.repository.stargazers_count)
            },
            date: function () {
                return util_dateFormat.dateFormat("zzz dd, yyyy",new Date(this.repository.updated_at))
            },
            topics: function () {
                let topics = []
                if(this.repository.topics) {
                    this.repository.topics.forEach(item => {
                        if(item.topic)topics.push(item.topic.name)
                    })
                }
                return topics
            },
            languageColor: function () {
                return util_analyseFileType.getColorOfLanguage(this.repository.language)
            }
        },
        mounted() {
            util_adjustStyle.highlightKeyword(`[meta=${this.randomMeta}]`,this.queryProvided())
        },
        watch: {
            /* topics() {
                this.$nextTick(() => {
                    util_adjustStyle.adjustInlineBlockStyle(`.topic-item[meta=${this.randomMeta}]`)
                })
            } */
        },
        components: {
            AnimatedHeightWrapper,
            Container: styled.div``,
            IconColumn: styled.div``,
            Main: styled.div``,
            FullName: styled.div``,
            Description: styled.p``,
            Topics: styled.div``,
            MultiInfo: styled.div``,
            Stargazers: styled.div``,
            Language: styled.div``,
            License: styled.div``,
            UpdateAt: styled.div``,
            HelpWantedIssues: styled.div``,
        }
    }
</script>

<style scoped>
.topic-tag{
    display: inline-block;
    padding: .3em .9em;
    margin: 0 .5em .5em 0;
    white-space: nowrap;
    background-color: #f1f8ff;
    border-radius: 3px
}
.repo-language-color{
    position: relative;
    top: 1px;
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
}
</style>