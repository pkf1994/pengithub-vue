<template>
    <Container class="py-4 border-bottom">

        <Name class="mb-1 wb-break-all">
            <router-link :to="`/${repository.owner.login}/${repository.name}`">{{repository.name}}</router-link>
        </Name>

        <ForkFromInfo v-if="graphqlData.parent" class="f6 text-gray mb-1">
            Forked from {{graphqlData.parent.nameWithOwner}}
        </ForkFromInfo>

        <AnimatedHeightWrapper>
            <Description v-if="graphqlData.descriptionHTML" class="text-gray mb-2 pr-4" v-html="graphqlData.descriptionHTML">
            </Description>

            <Description v-if="!accessToken" class="text-gray mb-2 pr-4">
                {{repository.description}}
            </Description>
        </AnimatedHeightWrapper>

        <Topics class="flex-wrap flex-items-center f6 my-1">
            <router-link :to="`/topics/${item}`" v-for="item in repository.topics.slice(0,5)" :key="item" class="topic-tag topic-tag-link f6 my-1">{{item}}</router-link>
        </Topics>

        <TheMeta class="f6 text-gray mt-2">
            <PrimaryLanguage class="mr-3" v-if="repository.language">
                <transition name="fade" appear>
                    <span v-if="graphqlData.primaryLanguage" class="repo-language-color" :style="{backgroundColor: graphqlData.primaryLanguage.color || '#ccc'}"></span>
                </transition>
                {{repository.language}}
            </PrimaryLanguage>

            <License v-if="repository.license" class="mr-3">
                <svg class="octicon octicon-law mr-1" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 4c-.83 0-1.5-.67-1.5-1.5S6.17 1 7 1s1.5.67 1.5 1.5S7.83 4 7 4zm7 6c0 1.11-.89 2-2 2h-1c-1.11 0-2-.89-2-2l2-4h-1c-.55 0-1-.45-1-1H8v8c.42 0 1 .45 1 1h1c.42 0 1 .45 1 1H3c0-.55.58-1 1-1h1c0-.55.58-1 1-1h.03L6 5H5c0 .55-.45 1-1 1H3l2 4c0 1.11-.89 2-2 2H2c-1.11 0-2-.89-2-2l2-4H1V5h3c0-.55.45-1 1-1h4c.55 0 1 .45 1 1h3v1h-1l2 4zM2.5 7L1 10h3L2.5 7zM13 10l-1.5-3-1.5 3h3z"></path></svg>
                {{repository.license.spdx_id}}
            </License>

            <ForkStatistic class="mr-3">
                <svg aria-label="fork" class="octicon octicon-repo-forked" viewBox="0 0 10 16" version="1.1" width="10" height="16" role="img"><path fill-rule="evenodd" d="M8 1a1.993 1.993 0 00-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 002 1a1.993 1.993 0 00-1 3.72V6.5l3 3v1.78A1.993 1.993 0 005 15a1.993 1.993 0 001-3.72V9.5l3-3V4.72A1.993 1.993 0 008 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                {{repository.forks_count | thousands}}
            </ForkStatistic>

            <StarStatistic class="mr-3">
                <svg aria-label="star" class="octicon octicon-star" viewBox="0 0 14 16" version="1.1" width="14" height="16" role="img"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>
                {{repository.stargazers_count | thousands}}
            </StarStatistic>

            <openIssueCount class="mr-3" v-if="repository.issues && repository.issues.totalCount > 0">
                <svg height="16" class="octicon octicon-issue-opened" viewBox="0 0 14 16" version="1.1" width="14" aria-hidden="true"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>
                {{repository.open_issues_count}}
            </openIssueCount>
            
            <openIssueCount class="mr-3" v-if="graphqlData.pullRequests && graphqlData.pullRequests.totalCount > 0">
                <svg height="16" class="octicon octicon-git-pull-request" viewBox="0 0 12 16" version="1.1" width="12" aria-hidden="true"><path fill-rule="evenodd" d="M11 11.28V5c-.03-.78-.34-1.47-.94-2.06C9.46 2.35 8.78 2.03 8 2H7V0L4 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0010 15a1.993 1.993 0 001-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zM4 3c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v6.56A1.993 1.993 0 002 15a1.993 1.993 0 001-3.72V4.72c.59-.34 1-.98 1-1.72zm-.8 10c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                {{graphqlData.pullRequests.totalCount}}
            </openIssueCount>
            
            <UpdatedAt>
                Updated {{repository.updated_at | getDateDiff}}
            </UpdatedAt>
        </TheMeta>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper} from '@/components'
    import * as graphql from './graphql'
    export default {
        props: {
            repository: {
                type: Object,
                required: true
            }
        },
        computed: {
            nodeId() {
                return this.repository.node_id
            },
        },
        created() {
            this.action_getGraphqlData({
                id: this.repository.node_id,
                graphql: graphql.REPOS
            })
        },
        components: {
            AnimatedHeightWrapper,
            Container: styled.div``,
            Star: styled.div``,
            Name: styled.h3``,
            ForkFromInfo: styled.span``,
            Description: styled.p``,
            Topics: styled.div``,
            TheMeta: styled.div``,
            PrimaryLanguage: styled.span``,
            StarStatistic: styled.span``,
            openIssueCount: styled.span``,
            ForkStatistic: styled.span``,
            License: styled.span``,
            UpdatedAt: styled.span``,
        }
    }
</script>

<style scoped lang="scss">
.topics-row-container {
    height: 30px;
    overflow: hidden;
}

.topic-tag {
    display: inline-block;
    padding: .3em .9em;
    margin: 0 .5em .5em 0;
    white-space: nowrap;
    background-color: #f1f8ff;
    border-radius: 3px;
}

.repo-language-color {
    position: relative;
    top: 1px;
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
}
</style>