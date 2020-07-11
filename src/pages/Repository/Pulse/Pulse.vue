<template>
    <CommonLoadingWrapper :loading="loading" position="corner" class="flex-column flex-items-stretch" style="margin-top: -32px;background: #fafbfc">
        <div class="p-3">
            <select class="form-select width-full" :value="period" style="font-family: Arial;" @change="changeHandler">
                <option v-for="item in availablePeriod" :key="item.value" :value="item.value">
                    {{item.label}}
                </option>
            </select>
        </div>
        

        <CodeChanges class="bubble">
            <h3 class="bubble-title">
                <svg class="octicon octicon-code" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4.72 3.22a.75.75 0 011.06 1.06L2.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L.47 8.53a.75.75 0 010-1.06l4.25-4.25zm6.56 0a.75.75 0 10-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 101.06 1.06l4.25-4.25a.75.75 0 000-1.06l-4.25-4.25z"></path></svg> 
                Code changes
            </h3>

            <AnimatedHeightWrapper>
                <div class="bubble-content markdown-body">
                    <DiffStatusSummary v-if="codeChanges.diffStatusSummary.data" v-html="codeChanges.diffStatusSummary.data">
                    </DiffStatusSummary>
                    <Skeleton v-else>
                        <SkeletonRectangle class="my-2" :height="17" :style="{width:'100%'}"></SkeletonRectangle>
                        <SkeletonRectangle class="my-2" :height="17" :style="{width:'100%'}"></SkeletonRectangle>
                        <SkeletonRectangle class="my-2" :height="17" :style="{width:'80%'}"></SkeletonRectangle>
                    </Skeleton>
                </div>

                <div class="p-3" v-if="codeChanges.committerData.data.length > 0" >
                    <CommitterDataIllustration :committerData="codeChanges.committerData.data"></CommitterDataIllustration>
                </div> 

            </AnimatedHeightWrapper>
          
        </CodeChanges>

        <PullsMerged class="bubble" v-if="issues.pr.closed.totalCount > 0 || issues.pr.closed.loading">
            <h3 class="bubble-title">
                <svg class="octicon octicon-git-pull-request" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"></path></svg>
                {{issues.pr.closed.totalCount}}
                Pull {{issues.pr.closed.totalCount > 1 ? 'Requests' : 'Request'}} merged
            </h3>

            <AnimatedHeightWrapper>
                <IssueItemRest v-for="item in issues.pr.closed.data" :key="item.node_id" :issue="{...item,merged:true}" type="pullRequest">
                </IssueItemRest>
                <IssueItemSkeleton v-if="issues.pr.closed.loading"></IssueItemSkeleton>

                <LoadingMore class="text-center p-3 border-top" v-if="issues.pr.closed.pageInfo.next && !issues.pr.closed.loading">
                    <span @click="() => network_getIssues('pr','closed','merged')">
                        Show more pull requests.
                    </span>    
                </LoadingMore>
            </AnimatedHeightWrapper>

        </PullsMerged>

        <PullsProposed class="bubble" v-if="issues.pr.open.totalCount > 0 || issues.pr.open.loading">
            <h3 class="bubble-title">
                <svg class="octicon octicon-git-pull-request" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"></path></svg>
                {{issues.pr.open.totalCount}}
                Pull {{issues.pr.open.totalCount > 1 ? 'Requests' : 'Request'}} proposed
            </h3>

            <AnimatedHeightWrapper>
                <IssueItemRest v-for="item in issues.pr.open.data" :key="item.node_id" :issue="item" type="pullRequest">
                </IssueItemRest>
                <IssueItemSkeleton v-if="issues.pr.open.loading"></IssueItemSkeleton>

                <LoadingMore class="text-center p-3 border-top" v-if="issues.pr.open.pageInfo.next && !issues.pr.open.loading">
                    <span @click="() => network_getIssues('pr','open','created')">
                        Show more pull requests.
                    </span>    
                </LoadingMore>
            </AnimatedHeightWrapper>
        </PullsProposed>

        <IssuesClosed class="bubble" v-if="issues.issue.closed.totalCount > 0 || issues.issue.closed.loading">
            <h3 class="bubble-title">
                <svg class="octicon octicon-git-branch" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"></path></svg>
                {{issues.issue.closed.totalCount}}
                {{issues.issue.closed.totalCount > 1 ? 'Issues' : 'Issue'}} closed
            </h3>

            <AnimatedHeightWrapper>
                <IssueItemRest v-for="item in issues.issue.closed.data" :key="item.node_id" :issue="item" type="pullRequest">
                </IssueItemRest>
                <IssueItemSkeleton v-if="issues.issue.closed.loading"></IssueItemSkeleton>

                <LoadingMore class="text-center p-3 border-top" v-if="issues.issue.closed.pageInfo.next && !issues.issue.closed.loading">
                    <span @click="() => network_getIssues('issue','closed','closed')">
                        Show more issues.
                    </span>    
                </LoadingMore>
            </AnimatedHeightWrapper>
        </IssuesClosed>

        <IssuesOpened class="bubble" v-if="issues.issue.open.totalCount > 0 || issues.issue.open.loading">
            <h3 class="bubble-title">
                <svg class="octicon octicon-git-branch" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"></path></svg>
                {{issues.issue.open.totalCount}}
                {{issues.issue.open.totalCount > 1 ? 'Issues' : 'Issue'}} open
            </h3>

            <AnimatedHeightWrapper>
                <IssueItemRest v-for="item in issues.issue.open.data" :key="item.node_id" :issue="item" type="pullRequest">
                </IssueItemRest>
                <IssueItemSkeleton v-if="issues.issue.open.loading"></IssueItemSkeleton>

                <LoadingMore class="text-center p-3 border-top" v-if="issues.issue.open.pageInfo.next && !issues.issue.open.loading">
                    <span @click="() => network_getIssues('issue','open','closed')">
                        Show more issues.
                    </span>    
                </LoadingMore>
            </AnimatedHeightWrapper>
        </IssuesOpened>

        
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoadingWrapper, AnimatedHeightWrapper, SkeletonCircle, SkeletonRectangle} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {util_dateFormat,util_timeZoneTransfer} from '@/util'
    import { commonGet,authRequiredGet,authRequiredGitHubGraphqlApiQuery  } from '@/network'
    import {CommitterDataIllustration,IssueItemSkeleton} from './components'
    import {IssueItemRest} from '../components'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import Vue from 'vue'
    var parse = require('parse-link-header');
    export default {
        name: 'repository_pulse_page',
        mixins: [RouteUpdateAwareMixin],
        data() {
            return {
                availablePeriod: [
                    {   
                        value: 'daily',
                        time: 24 * 3600000,
                        label: 'Past day'
                    },
                    {   
                        value: 'halfweekly',
                        time: 3 * 24 * 3600000,
                        label: 'Past 3 days'
                    },
                    {   
                        value: 'weekly',
                        time: 7 * 24 * 3600000,
                        label: 'Past week'
                    },
                    {   
                        value: 'monthly',
                        time: 30 * 24 * 3600000,
                        label: 'Past month'
                    },
                ],
                codeChanges: {
                    diffStatusSummary: {
                        data: '',
                        loading: false
                    },
                    committerData: {
                        data: [],
                        loading: false
                    }
                },
                issues:{
                    issue: {
                        closed: {
                            data: [],
                            totalCount: 0,
                            pageInfo: {},
                            loading: false
                        },
                        open: {
                            data: [],
                            totalCount: 0,
                            pageInfo: {},
                            loading: false
                        }
                    },
                    pr: {
                        closed: {
                            data: [],
                            totalCount: 0,
                            pageInfo: {},
                            loading: false
                        },
                        open: {
                            data: [],
                            totalCount: 0,
                            pageInfo: {},
                            loading: false
                        }
                    }
                }
            }
        },
        computed: {
            afterDateByPastPeriod() {
                let periodObj = this.availablePeriod.filter(i => {
                    return i.value == this.period
                })[0]
                return  (new Date(Date.parse(new Date()) - periodObj.time)).toISOString()
            },
            documentTitle() {
                return `Pulse · ${this.owner}/${this.repo}`
            },
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            loading() {
                return this.codeChanges.committerData.loading || this.codeChanges.diffStatusSummary.loading
            },
            period() {
                return this.$route.params.period || 'weekly'
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            network_getData() {
                this.network_getDiffstatusSummary()
                this.network_getCommitterData()
                this.network_getIssues('pr','closed','merged')
                this.network_getIssues('pr','open','created')
                this.network_getIssues('issue','closed','closed')
                this.network_getIssues('issue','open','created')
            },
            async network_getDiffstatusSummary() {
                try{
                    this.codeChanges.diffStatusSummary.loading = true
                    let url = api.API_PROXY_PULSE_DIFF_STATUS_SUMMARY({
                        repo: this.repo,
                        owner: this.owner,
                        params: {
                            period: this.period
                        }
                    })

                    let res = await commonGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_diff_status_summary')
                        }
                    )

                    this.codeChanges.diffStatusSummary.data = res.data
                }catch(e) {
                    console.log(e)
                    this.handleError(e)
                }finally{
                    this.codeChanges.diffStatusSummary.loading = false
                }
            },
            async network_getCommitterData() {
                try{
                    this.codeChanges.committerData.loading = true
                    let url = api.API_PROXY_PULSE_COMMITTER_DATA({
                        repo: this.repo,
                        owner: this.owner,
                        period: this.period
                    })

                    let res = await commonGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_committer_data')
                        }
                    )

                    this.codeChanges.committerData.data = res.data
                }catch(e) {
                    console.log(e)
                    this.handleError(e)
                }finally{
                    this.codeChanges.committerData.loading = false
                }
            },
            async network_getIssues(issueType, state, action) {
                try{
                    this.issues[issueType][state].loading = true
                    let url 
                    if(this.issues[issueType][state].pageInfo.next) {
                        url = this.issues[issueType][state].pageInfo.next.url
                    } else {
                        url = api.API_SEARCH({
                            type: 'issues',
                            params:{
                                q: `is:${issueType} repo:${this.owner}/${this.repo} state:${state} ${action}:>${this.afterDateByPastPeriod}`,
                                per_page: 4,
                            }
                        })
                    }

                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ` get_${issueType}_${action}_in_past_period`)
                        }
                    )

                    this.issues[issueType][state].data = this.issues[issueType][state].data.concat(res.data.items)
                    this.issues[issueType][state].totalCount = res.data.total_count
                    this.issues[issueType][state].pageInfo = parse(res.headers.link) || {}
                    

                    if(state == 'closed') {
                        this.network_getIssueCloser(res.data.items, issueType, state)
                    }

                }catch(e) {
                    console.log(e)
                }finally{
                    this.issues[issueType][state].loading = false
                }
            },
            async network_getIssueCloser(issues, issueType, state) {
                try{
                    let ids = issues.map(i => i.node_id)
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_ISSUES,
                        {
                            variables: {
                                ids
                            }
                        }
                    )

                    try{
                         issues.forEach((i,index) => {
                            Vue.set(
                            i,
                            'closed_by',
                                {
                                    login: res.data.data.nodes[index].timelineItems.nodes[0].actor.login
                                }
                            )
                        })
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                   
                }catch(e) {
                    console.log(e)
                }
            },
            routeUpdateHook() {
                this.routeResetHook()
                this.network_getData()
            },
            changeHandler(e) {
                 this.$router.push(`/${this.owner}/${this.repo}/pulse/${e.target.value}`)
            }
        },
        components: {
            CommonLoadingWrapper,
            AnimatedHeightWrapper,
            SkeletonRectangle,
            CommitterDataIllustration,
            IssueItemRest,
            IssueItemSkeleton,
            Container: styled.div``,
            CodeChanges: styled.div``,
            DiffStatusSummary: styled.div``,
            PullsMerged: styled.div``,
            PullsProposed: styled.div``,
            IssuesClosed: styled.div``,
            IssuesOpened: styled.div``,
            Skeleton: styled.div``,
            LoadingMore: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/markdown/index.scss';
h3{
    font-weight: bold;
}
.bubble {
    padding: 0;
    margin: 0 15px 15px;
    overflow: hidden;
    word-break: break-word;
    word-wrap: break-word;
    white-space: normal;
    background: #fff;
    border: 1px solid #d1d5da;
    border-radius: 6px;
}

.bubble-title {
    display: block;
    padding: 10px 15px;
    margin: 0;
    font-size: 14px;
    color: #2f363d;
    border-bottom: 1px solid #d1d5da;
}
</style>