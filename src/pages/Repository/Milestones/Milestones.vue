<template>
    <CommonLoadingWrapper :loading="loading || extraData.loading" class="p-3" :position="loading ? 'center' : 'corner'">
        
        <nav class="d-flex">
            <router-link class="subnav-item" :to="`/${owner()}/${repo()}/labels`">
                <svg class="octicon octicon-tag" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path></svg>
                Labels
            </router-link>
            <router-link class="subnav-item" :to="`/${owner()}/${repo()}/milestones`">
                <svg class="octicon octicon-milestone" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2H6V0h2v2zm4 5H2c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h10l2 2-2 2zM8 4H6v2h2V4zM6 16h2V8H6v8z"></path></svg>
                Milestones
            </router-link>
        </nav> 

        <transition name="fade" appear>
            <ComplexBubble class="mt-3" v-if="firstLoadedFlag">
                <template v-slot:title>
                    <Header class="Box-header d-flex flex-justify-between flex-shrink-0">
                        <StateStatistic>
                            <router-link class="btn-link" :to="filterOpenRouterLink" active-class="state-router-link-active" :class="{'state-router-link-active':state == 'open'}">
                                <svg class="octicon octicon-milestone mr-1" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2H6V0h2v2zm4 5H2c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h10l2 2-2 2zM8 4H6v2h2V4zM6 16h2V8H6v8z"></path></svg>
                                {{stateCount.open}}
                                Open
                            </router-link>
                            <router-link class="btn-link ml-2" :to="filterClosedRouterLink"  active-class="state-router-link-active" :class="{'state-router-link-active':state == 'closed'}">
                                <svg class="octicon octicon-check" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                                {{stateCount.closed}}
                                Closed
                            </router-link>
                        </StateStatistic>

                        <button class="btn-link px-3 select-menu-button" @click="() => openModal('sortModal')">
                           Sort
                        </button>
                    </Header>
                </template>

                <transition-group name="fade-group" appear>
                    <MilestoneListItem v-for="item in data" :key="item.id" :milestone="item" class="Box-row"></MilestoneListItem>
                </transition-group>

            </ComplexBubble>
        </transition>

        <SimplePaginationRest v-if="pageInfo.prev || pageInfo.next" :loading="loading" :pageInfo="pageInfo"></SimplePaginationRest>

        <Modal ref="sortModal" title="Sort by">
            <router-link class="d-block" v-for="item in sortModalRouterLinkData" :key="item.to" :to='item.to'>
                <SelectMenuItem :selected="item.selected" @click.native="closeModal">
                    <span>{{item.label}}</span>    
                </SelectMenuItem>
            </router-link> 
        </Modal>

        <EmptyNotice v-if="emptyFlag" class="empty-notice d-flex flex-items-center">
            <div class="blankslate"> 
                <svg height="40" class="octicon octicon-milestone blankslate-icon" viewBox="0 0 14 16" version="1.1" width="35" aria-hidden="true">
                    <path fill-rule="evenodd" d="M8 2H6V0h2v2zm4 5H2c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h10l2 2-2 2zM8 4H6v2h2V4zM6 16h2V8H6v8z"></path>
                </svg>
                <h3>We couldn’t find anything!</h3>
                <p>There aren’t any milestones that match. Give it another shot above.</p>
            </div>
        </EmptyNotice>
    </CommonLoadingWrapper>
</template>

<script>
    import {CommonLoadingWrapper,ComplexBubble,AnimatedHeightWrapper,Modal,SelectMenuItem,SimplePaginationRest} from '@/components'
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {authRequiredGitHubGraphqlApiQuery,authRequiredGet} from '@/network'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import {util_queryParse} from '@/util'
    import MilestoneListItem from './MilestoneListItem'
    let parse = require("parse-link-header")
    export default {
        name: 'repository_milestones_page',
        inject: ['owner','repo'],
        mixins: [RouteUpdateAwareMixin],
        data() {
            return {
                data: [],
                loading: false,
                firstLoadedFlag: false,
                perPage: 10,
                pageInfo: {},
                extraData: {
                    data: [],
                    loading: false
                },
                stateCount: {
                    open: 0,
                    closed: 0,
                    loading: false
                }

            }
        },
        computed: {
            emptyFlag() {
                return this.data.length == 0 && this.loading == false && !this.pageInfo.prev
            },
            filterOpenRouterLink() {
                return `${this.$route.path}?${util_queryParse.querify({
                    ...this.$route.query,
                    state: 'open'
                })}`
            },
            filterClosedRouterLink() {
                return `${this.$route.path}?${util_queryParse.querify({
                    ...this.$route.query,
                    state: 'closed'
                })}`
            },
            state() {
                return this.$route.query.state || 'open'
            },
            sort() {
                return this.$route.query.sort || 'updated_date'
            },
            direction() {
                return this.$route.query.direction || 'desc'
            },
            sortModalRouterLinkData() {
                return [
                    {
                        label: "Recently updated",
                        to: `${this.$route.path}?sort=updated_date&direction=desc&state=${this.state}`,
                        selected: this.sort == 'updated_date' && this.direction == 'desc'
                    },
                    {
                        label: "Furthest due date",
                        to: `${this.$route.path}?sort=due_date&direction=desc&state=${this.state}`,
                        selected: this.sort == 'due_date' && this.direction == 'desc'
                    },
                    {
                        label: "Closest due date",
                        to: `${this.$route.path}?sort=due_date&direction=asc&state=${this.state}`,
                        selected: this.sort == 'due_date' && this.direction == 'asc'
                    },
                    {
                        label: "Least complete",
                        to: `${this.$route.path}?sort=completeness&direction=asc&state=${this.state}`,
                        selected: this.sort == 'completeness' && this.direction == 'asc'
                    },
                    {
                        label: "Most complete",
                        to: `${this.$route.path}?sort=completeness&direction=desc&state=${this.state}`,
                        selected: this.sort == 'completeness' && this.direction == 'desc'
                    },
                    {
                        label: "Alphabetically",
                        to: `${this.$route.path}?sort=title&direction=asc&state=${this.state}`,
                        selected: this.sort == 'title' && this.direction == 'asc'
                    },
                    {
                        label: "Reverse alphabetically",
                        to: `${this.$route.path}?sort=title&direction=desc&state=${this.state}`,
                        selected: this.sort == 'title' && this.direction == 'desc'
                    },
                    {
                        label: "Most issues",
                        to: `${this.$route.path}?sort=count&direction=desc&state=${this.state}`,
                        selected: this.sort == 'count' && this.direction == 'desc'
                    },
                    {
                        label: "Least issues",
                        to: `${this.$route.path}?sort=count&direction=asc&state=${this.state}`,
                        selected: this.sort == 'count' && this.direction == 'asc'
                    },
                ]
            }
        },
        created() {
            this.network_getData()
            this.network_getStateCount()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_REPOSITORY_MILESTONES({
                        repo: this.repo(),
                        owner: this.owner(),
                        params: {
                            per_page: this.perPage,
                            ...this.$route.query
                        }
                    })
                    let res = await authRequiredGet(url,{cancelToken})
                    this.data = res.data
                    this.pageInfo = parse(res.headers.link) || {}
                    this.firstLoadedFlag = true
                    //if(this.accessToken) this.network_getExtraData()
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            async network_getStateCount() {
                try{
                    this.stateCount.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_state_count')
                    let url_openCount = api.API_REPOSITORY_MILESTONES({
                        repo: this.repo(),
                        owner: this.owner(),
                        params: {
                            per_page: 1,
                            state: 'open'
                        }
                    })
                    let url_closedCount = api.API_REPOSITORY_LABELS({
                        repo: this.repo(),
                        owner: this.owner(),
                        params: {
                            per_page: 1,
                            state: 'closed'
                        }
                    })
                    let res = await Promise.all([
                        authRequiredGet(url_openCount,{cancelToken}),
                        authRequiredGet(url_closedCount,{cancelToken}),
                    ])


                    let openCountHolder = parse(res[0].headers.link) || {}
                    this.stateCount.open = openCountHolder.last ? openCountHolder.last.page : res[0].data.length
                    let closedCountHolder = parse(res[1].headers.link) || {}
                    this.stateCount.closed = closedCountHolder.last ? closedCountHolder.last.page : res[1].data.length
                }catch(e) {
                    console.log(e)
                }finally{
                    this.stateCount.loading = false
                }
            },
            async network_getExtraData() {
                if(this.data.length == 0) return 
                try{
                    this.extraData.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_extra_data')
                    let graphql_extraData = graphql.GRAPHQL_LABELS
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql_extraData,
                        {
                            cancelToken,
                            variables: {
                                "ids": this.data.map(i => i.node_id)
                            }
                        }
                    )
                    this.extraData.data = res.data.data.nodes
                }catch(e){
                    console.log(e)
                }finally{
                    this.extraData.loading = false
                }
            },
            getOpenIssuesAndPullRequestsCount(id) {
                let dataHolder = this.extraData.data.filter(i => i.id == id)[0]
                if(!dataHolder) return
                return dataHolder.issues.totalCount + dataHolder.pullRequests.totalCount
            },
            openModal(modalRef) {
                if(!this.$refs[modalRef]) return
                this.$refs[modalRef].show = true
            },
            closeModal() {
                for(let modalRef in this.$refs) {
                    this.$refs[modalRef].show = false
                }
            },
        },
        components: {
            CommonLoadingWrapper,
            ComplexBubble,
            AnimatedHeightWrapper,
            Modal,
            SelectMenuItem,
            SimplePaginationRest,
            MilestoneListItem,
            Header: styled.div``,
            LabelItem: styled.div``,
            Description: styled.div``,
            StateStatistic: styled.div``,
            EmptyNotice: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/navigation/index.scss';
@import 'node_modules/@primer/css/blankslate/index.scss';
.select-menu-button:after {
    display: inline-block;
    width: 0;
    height: 0;
    vertical-align: -2px;
    content: "";
    border: 4px solid transparent;
    border-top-color: currentcolor;
}
.description{
    margin: 0;
    font-size: 12px;
    color: #586069;
}
.router-link-active{
    color: #fff;
    background-color: #0366d6;
    border-color: #0366d6;
}
.empty-notice{
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    pointer-events: none;
}
.btn-link {
    position: relative;
    display: inline-block;
    font-weight: 400;
    color: #24292e;
}
.state-router-link-active{
    font-weight: 600;
}
</style>