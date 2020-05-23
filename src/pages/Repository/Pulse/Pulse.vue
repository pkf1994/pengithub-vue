<template>
    <Container class="flex-column flex-items-stretch px-3">
        <select class="form-select my-3 width-full" v-model="selectedValue" style="font-family: Arial;">
            <option value="weekly">
                Past week
            </option>
            <option value="monthly">
                Past month
            </option>
        </select>
        <CodeChanges/>
        <PullsMerged :howLongTrackBack="selectedValue" :getMoreData="network_getPullsMergedInPastPeriod"/>
        <PullsProposed :howLongTrackBack="selectedValue" :getMoreData="network_getPullsProposedInPastPeriod"/>
        <IssuesClosed :howLongTrackBack="selectedValue" :getMoreData="network_getIssuesClosedInPastPeriod"/>
        <IssuesOpened :howLongTrackBack="selectedValue" :getMoreData="network_getIssuesOpenedInPastPeriod"/>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CodeChanges,PullsMerged,PullsProposed,IssuesClosed,IssuesOpened} from './components' 
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {util_dateFormat,util_timeZoneTransfer} from '@/util'
    import { cancelAndUpdateAxiosCancelTokenSource,authRequiredGet,authRequiredGitHubGraphqlApiQuery  } from '@/network'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    var parse = require('parse-link-header');
    export default {
        name: 'repository_pulse_page',
        inject: ['owner','repo'],
        mixins: [RouteUpdateAwareMixin],
        provide() {
            return {
                pullsMerged: () => this.pullsMerged,
                issuesClosed: () => this.issuesClosed,
                pullsProposed: () => this.pullsProposed,
                issuesOpened: () => this.issuesOpened,
                commitStatistic: () => this.commitStatisitc,
                commitCount: () => this.commitCount,
            }
        },
        data() {
            return {
                selectedValue: "weekly",
                commitStatisitc:{
                    data:[],
                    loading:false,
                },
                commitCount: {
                    data: 0,
                    loading: false
                },
                pullsMerged: {
                    data: [],
                    loading: false,
                    totalCount: 0,
                    pageInfo: {}
                },
                issuesClosed: {
                    data: [],
                    loading: false,
                    totalCount: 0,
                    pageInfo: {}
                },
                pullsProposed: {
                    data: [],
                    loading: false,
                    totalCount: 0,
                    pageInfo: {},
                    perPage: 10
                },
                issuesOpened: {
                    data: [],
                    loading: false,
                    totalCount: 0,
                    pageInfo: {},
                    perPage: 10
                },
            }
        },
        computed: {
            afterDateByPastPeriod() {
                return  util_dateFormat.dateFormat('yyyy-MM-ddThh:mm:ss',util_timeZoneTransfer.East8ToWest8(new Date(Date.parse(new Date()) - (this.selectedValue === 'weekly' ? 7 * 24 * 3600000 : 30 * 24 * 3600000))))
            },
        },
        created() {
           this.network_getContributorStatistic()
           this.network_getCommitCountInPastPeriod()
           this.network_getPullsMergedInPastPeriod()
           this.network_getPullsProposedInPastPeriod()
           this.network_getIssuesClosedInPastPeriod()
           this.network_getIssuesOpenedInPastPeriod()
        },
        methods: {
            async network_getContributorStatistic() {
                try{
                    this.commitStatisitc.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.name + ' get_contributor_statistic')

                    /* const url = api.API_REPOSITORY_STATISTIC_CONTRIBUTOR_LIST(this.owner(),this.repo())
                    const res = await authRequiredGet(url,{cancelToken:sourceAndCancelToken.cancelToken})
                    this.commitStatisitc.data = res.data */

                    let graphql_commitsInPastPeriod = graphql.GRAPHQL_COMMITS({
                        ...this.$route.params,
                        since: this.afterDateByPastPeriod
                    })
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_commitsInPastPeriod,{cancelToken})
                    try{
                        this.commitStatisitc.data = res.data.data.repository.refs.nodes
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                    
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.commitStatisitc.loading = false
                }
            },
            async network_getCommitCountInPastPeriod() {
                try{
                    this.commitCount.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name + ' get_commit_count')
                    this.cancelSources.push(sourceAndCancelToken.source)
                    const url = api.API_SEARCH(
                        'commits',
                        {
                            q: `repo:${this.owner()}/${this.repo()} committer-date:>${this.afterDateByPastPeriod}`,
                        }   
                    )
                    const res = await authRequiredGet(
                        url,
                        {
                            cancelToken: sourceAndCancelToken.cancelToken,
                            headers: {"Accept":"application/vnd.github.cloak-preview"}
                        }
                    )
                    try{
                        this.commitCount.data = res.data.total_count
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                    
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.commitCount.loading = false
                }
            },

            async network_getPullsMergedInPastPeriod() {
                try{
                    this.pullsMerged.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name + ' get_pulls_merged_in_past_period')
                    this.cancelSources.push(sourceAndCancelToken.source)

                    let graphql_pullsMergedInPastPeriod = graphql.GRAPHQL_REPOSITORY_ISSUES({
                        after: this.pullsMerged.pageInfo.endCursor,
                        query:`is:pr repo:${this.owner()}/${this.repo()} state:closed merged:>${this.afterDateByPastPeriod}`
                    })

                    const res = await authRequiredGitHubGraphqlApiQuery(graphql_pullsMergedInPastPeriod,{cancelToken:sourceAndCancelToken.cancelToken})
                    
                    try{
                        this.pullsMerged.data = this.pullsMerged.data.concat(res.data.data.search.nodes)
                        this.pullsMerged.pageInfo =  res.data.data.search.pageInfo
                        this.pullsMerged.totalCount =  res.data.data.search.issueCount
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                    
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.pullsMerged.loading = false
                }
            },

             async network_getIssuesClosedInPastPeriod() {
                try{
                    this.issuesClosed.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name + ' get_issues_closed_in_past_period')
                    this.cancelSources.push(sourceAndCancelToken.source)

                    let graphql_issuesClosedInPastPeriod = graphql.GRAPHQL_REPOSITORY_ISSUES({
                        after: this.issuesClosed.pageInfo.endCursor,
                        query:`is:issue repo:${this.owner()}/${this.repo()} state:closed closed:>${this.afterDateByPastPeriod}`
                    })

                    const res = await authRequiredGitHubGraphqlApiQuery(graphql_issuesClosedInPastPeriod,{cancelToken:sourceAndCancelToken.cancelToken})
                    
                    try{
                        this.issuesClosed.data = this.issuesClosed.data.concat(res.data.data.search.nodes)
                        this.issuesClosed.pageInfo =  res.data.data.search.pageInfo
                        this.issuesClosed.totalCount =  res.data.data.search.issueCount
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                    
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.issuesClosed.loading = false
                }
            },

             async network_getPullsProposedInPastPeriod() {
                try{
                    this.pullsProposed.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name + ' get_pulls_proposed_in_past_period')
                    this.cancelSources.push(sourceAndCancelToken.source)


                    let url

                    if(this.pullsProposed.pageInfo.next) {
                        url = this.pullsProposed.pageInfo.next.url
                    } else {
                        url = api.API_SEARCH(
                            'issues',
                            {
                                q:`repo:${this.owner()}/${this.repo()} type:pr state:open created:>${this.afterDateByPastPeriod}`,
                                per_page: this.pullsProposed.perPage
                            }
                        )
                    }

                    const res = await authRequiredGet(url,{cancelToken:sourceAndCancelToken.cancelToken})

                    const pageInfo = parse(res.headers.link)
              
                    this.pullsProposed.data = this.pullsProposed.data.concat(res.data.items)
                    this.pullsProposed.totalCount = res.data.total_count
                    this.pullsProposed.pageInfo = pageInfo || {}
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.pullsProposed.loading = false
                }
            },

             async network_getIssuesOpenedInPastPeriod() {
                try{
                    this.issuesOpened.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name + ' get_issues_opened_in_past_period')
                    this.cancelSources.push(sourceAndCancelToken.source)

                    let url

                    if(this.issuesOpened.pageInfo.next) {
                        url = this.issuesOpened.pageInfo.next.url
                    } else {
                        url = api.API_SEARCH(
                            'issues',
                            {
                                q:`repo:${this.owner()}/${this.repo()} type:issues state:open created:>${this.afterDateByPastPeriod}`,
                                per_page: this.issuesOpened.perPage
                            }
                        )
                    }

                    const res = await authRequiredGet(url,{cancelToken:sourceAndCancelToken.cancelToken})

                    const pageInfo = parse(res.headers.link)
              
                    this.issuesOpened.data = this.issuesOpened.data.concat(res.data.items)
                    this.issuesOpened.totalCount = res.data.total_count
                    this.issuesOpened.pageInfo = pageInfo || {}
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.issuesOpened.loading = false
                }
            },
            routeUpdateHook() {
                this.network_getContributorStatistic()
                this.network_getCommitCountInPastPeriod()
                this.network_getPullsMergedInPastPeriod()
                this.network_getPullsProposedInPastPeriod()
                this.network_getIssuesClosedInPastPeriod()
                this.network_getIssuesOpenedInPastPeriod()
            }
        },
        components: {
            CodeChanges,
            PullsMerged,
            PullsProposed,
            IssuesClosed,
            IssuesOpened,
            Container: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
</style>