<template>
    <CommonLoadingWrapper :loading="loading || issues.loading" class="px-3">
        <SubNav class="pt-4 pb-3 d-flex flex-justify-between border-bottom">
            <nav class="d-flex">
                <router-link class="subnav-item" :to="`/${owner()}/${repo()}/labels`">
                    <svg class="octicon octicon-tag" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path></svg>
                    Labels
                </router-link>
                <router-link class="subnav-item active-link"  :to="`/${owner()}/${repo()}/milestones`">
                    <svg class="octicon octicon-milestone" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2H6V0h2v2zm4 5H2c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h10l2 2-2 2zM8 4H6v2h2V4zM6 16h2V8H6v8z"></path></svg>
                    Milestones
                </router-link>
            </nav> 

            <router-link :to="`/${owner()}/${repo()}/issue/new`" class="btn btn-primary">
                New
            </router-link>  
        </SubNav>
            
        <transition name="fade" appear>
            <Title class="mt-0 mb-2 h1 text-normal pt-2" v-if="firstLoadedFlag">
                {{data.title}}
            </Title> 
        </transition>
        
        <transition name="fade" appear>
            <TheMeta class="text-gray-dark" v-if="firstLoadedFlag"> 
                <span class="mr-2" v-if="data.state == 'closed'">
                    <strong>{{data.state | capitalize}}</strong>
                    on
                    {{data.closed_at | dateFormat('d zzz yyyy')}}
                </span>
                <span class="mr-2" v-else-if="data.due_on">
                    <strong>Due</strong>
                    on
                    {{data.due_on | dateFormat('d zzz yyyy')}}
                </span>
                <span class="mr-2" v-else>
                    No due date
                </span>
                
                <span class="text-gray-dark" v-if="donePercent > 0"><strong>{{donePercent}}%</strong> complete</span>
            </TheMeta>  
        </transition>

        <transition name="fade" appear>
            <ComplexBubble class="mt-3" v-if="firstLoadedFlag">
                <template v-slot:title>
                    <Header class="Box-header d-flex flex-justify-between flex-shrink-0">
                        <Statistic class="statistic"  >
                            <router-link :to="filterOpenStateRouterLink" active-class="no-active-style" :disabled="loading" :class="{active: state === 'open'}">
                                <svg class="octicon octicon-issue-opened" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>
                                &nbsp;{{data.open_issues | thousands}} Open
                            </router-link> 
                            &nbsp;
                            <router-link :to="filterClosedStateRouterLink" active-class="no-active-style" :disabled="loading" :class="{active: state === 'closed'}">
                                <svg class="octicon octicon-check" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                                &nbsp;{{data.closed_issues | thousands}} Closed
                            </router-link> 
                        </Statistic>

                    </Header>
                </template>

                <transition-group name="fade-group" appear>
                    <IssueListItem v-for="item in issues.data" :key="item.id" :issue="item"></IssueListItem>
                </transition-group>

                <EmptyNotice v-if="data.state == 'closed' && issues.data.length == 0 && !loading && !issues.loading" class="d-flex flex-items-center">
                    <div class="d-flex flex-column flex-items-center mt-4">
                        <svg height="40" class="octicon octicon-issue-opened blankslate-icon" viewBox="0 0 14 16" version="1.1" width="35" aria-hidden="true"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>
                        <h3 class="h2 mb-2">This milestone is closed.</h3>
                        <p class="lead mb-4 text-center">
                            No {{state}} issues remain. View
                            <router-link :to="`/${this.owner()}/${this.repo()}/milestone/${number}${state == 'open' ? '?closed=1' : ''}`" title="Closed issues">{{state == 'open' ? 'closed' : 'open'}} issues</router-link>
                            or
                            see 
                            <router-link :to="`/${this.owner()}/${this.repo()}/milestones`">open milestones</router-link> in this repository.
                        </p>
                    </div>
                </EmptyNotice>
            </ComplexBubble>
        </transition>
        

         <SimplePaginationRest v-if="issues.pageInfo.prev || issues.pageInfo.next" :pageInfo="issues.pageInfo"></SimplePaginationRest>
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoadingWrapper,AnimatedHeightWrapper,ComplexBubble,SimplePaginationRest} from '@/components'
    import IssueListItem from './IssueListItem'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {authRequiredGet} from '@/network'
    import * as api from '@/network/api'
    let parse = require("parse-link-header")
    export default {
        name: 'repository_milestone_detail_page',
        mixins: [RouteUpdateAwareMixin],
        inject: ['owner','repo'],
        data() {
            return {
                data: {},
                loading: false,
                firstLoadedFlag: false,
                issues: {
                    data: [],
                    loading: false,
                    pageInfo: {}
                }
            }
        },
        computed: {
            number() {
                return this.$route.params.number
            },
            donePercent() {
                let openIssuesCount = this.data.open_issues || 0
                let closedIssuesCount = this.data.closed_issues || 0
                let total = openIssuesCount + closedIssuesCount
                if(total == 0) return
                return parseInt(closedIssuesCount * 100 / total)
            },
            state() {
                let isClosed = this.$route.query.closed
                return isClosed == 1 ? 'closed' : 'open'
            },
            filterOpenStateRouterLink() {
                return `/${this.owner()}/${this.repo()}/milestone/${this.number}`
            },
            filterClosedStateRouterLink() {
                return `/${this.owner()}/${this.repo()}/milestone/${this.number}?closed=1`
            },
            documentTitle() {
                if(!this.data.title) return location.href
                return `${this.data.title} Milestone`
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_REPOSITORY_MILESTONE({
                        repo: this.repo(),
                        owner: this.owner(),
                        number: this.number
                    })
                    let res = await authRequiredGet(url,{cancelToken})
                    this.data = res.data
                    this.firstLoadedFlag = true
                    this.network_getIssues()
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            async network_getIssues() {
                try{
                    this.issues.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_issues')
                    let url = api.API_SEARCH(
                        'issues',
                        {
                            ...this.$route.query,
                            q: `repo:${this.owner()}/${this.repo()} is:issue milestone:${this.data.title} state:${this.state}`,
                            per_page: 10,
                        }
                    )
                    let res = await authRequiredGet(url,{cancelToken})
                    window.scrollTo(0,0)
                    this.issues.data = res.data.items
                    this.issues.pageInfo = parse(res.headers.link) || {}
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.issues.loading = false
                }
            }
        },
        components: {
            CommonLoadingWrapper,
            ComplexBubble,
            IssueListItem,
            SimplePaginationRest,
            Container: styled.div``,
            SubNav: styled.div``,
            Title: styled.h2``,
            TheMeta: styled.div``,
            Statistic: styled.div``,
            EmptyNotice: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/blankslate/index.scss';
@import 'node_modules/@primer/css/navigation/index.scss';

.statistic{
    a{
        color: #24292e;
    }
}

.active{
    font-weight: 600;
}

.active-link{
    color: #fff;
    background-color: #0366d6;
    border-color: #0366d6;
}
</style>