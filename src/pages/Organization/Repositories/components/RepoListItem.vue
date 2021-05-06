<template>
    <Container class="py-4 border-bottom">
        
        <div class="d-flex flex-justify-between">
            <div class="flex-auto">
                <Name class="mb-1 wb-break-all">
                    <router-link :to="`/${repository.owner.login}/${repository.name}`">{{repository.name}}</router-link>
                </Name>

                <ForkFromInfo v-if="graphqlData.parent" class="f6 text-gray mb-1">
                    Forked from {{graphqlData.parent.nameWithOwner}}
                </ForkFromInfo>

                 <Description  class="text-gray mb-2 pr-2">
                    {{repository.description}}
                </Description>
            </div>
            <div class="flex-1 d-flex flex-items-center">
                <RepoWeeklyCommitPolyline class="v-align-middle" v-if="weeklyCommitCount" :weeklyCommitCount="weeklyCommitCount"></RepoWeeklyCommitPolyline>
            </div>
        </div>
        


        <Topics class="flex-wrap flex-items-center f6 my-1">
            <router-link :to="`/topics/${item}`" v-for="item in repository.topics.slice(0,5)" :key="item" class="topic-tag topic-tag-link f6 my-1">
                <Label :name="item"></Label>
            </router-link>
        </Topics>

        <TheMeta class="f6 text-gray mt-2">
            <PrimaryLanguage class="mr-3" v-if="repository.language">
                <transition name="fade" appear>
                    <span v-if="graphqlData.primaryLanguage" class="repo-language-color" :style="{backgroundColor: graphqlData.primaryLanguage.color || '#ccc'}"></span>
                </transition>
                {{repository.language}}
            </PrimaryLanguage>

            <License v-if="repository.license" class="mr-3">
                <svg class="octicon octicon-law mr-1" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z"></path></svg>
                {{repository.license.spdx_id}}
            </License>

            <ForkStatistic class="mr-3">
                <svg aria-label="fork" class="octicon octicon-repo-forked" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
                {{repository.forks_count | thousands}}
            </ForkStatistic>

            <StarStatistic class="mr-3">
                <svg class="octicon octicon-star" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
                {{repository.stargazers_count | thousands}}
            </StarStatistic>

            <OpenIssueCount v-if="repository.open_issues_count > 0" class="mr-3">
                <svg class="octicon octicon-issue-opened" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"></path></svg>
                {{repository.open_issues_count | thousands}}
            </OpenIssueCount>

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
    import {AnimatedHeightWrapper,RepoWeeklyCommitPolyline,Label} from '@/components'
    import * as graphql from './graphql'
    import * as api from '@/network/api'
    import {authRequiredGet} from '@/network'
    export default {
        props: {
            repository: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                weeklyCommitCount: undefined
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
            this.network_getWeeklyCommitCount()
        },
        methods: {
            async network_getWeeklyCommitCount() {
                try {
                    let url = api.API_WEEKLY_COMMIT_COUNT({
                        owner: this.repository.owner.login,
                        repo: this.repository.name
                    })

                    let res = await authRequiredGet(url)

                    this.weeklyCommitCount = res.data.all

                } catch (e) {
                    console.log(e)
                }
            }
        },
        components: {
            AnimatedHeightWrapper,
            RepoWeeklyCommitPolyline,
            Label,
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
            OpenIssueCount: styled.span``,
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
    margin: 0 .125em .333em 0;
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