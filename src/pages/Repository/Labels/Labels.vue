<template>
    <CommonLoadingWrapper :loading="loading || totalCount.loading || extraData.loading" class="p-3" :position="loading ? 'center' : 'corner'">
        
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
                         <h3 class="Box-title f5">
                            {{totalCount.data}} {{totalCount.data > 1 ? 'labels' : 'label'}}
                        </h3> 
                       <!--  <button class="select-menu-button" @click="() => openModal('sortModal')">
                            Sort
                        </button> -->
                    </Header>
                </template>

                <transition-group name="fade-group" appear>
                    <LabelItem class="p-3 Box-row" v-for="item in data" :key="item.name">
                        <Label :name="item.name" :color="`#${item.color}`"></Label>
                        <AnimatedHeightWrapper>
                            <Statistic v-if="getOpenIssuesAndPullRequestsCount(item.node_id)" class="description pt-1">{{getOpenIssuesAndPullRequestsCount(item.node_id)}} open issues and pull requests</Statistic>
                        </AnimatedHeightWrapper>
                        <Description class="description mt-1" style="font-size:14px">
                           {{item.description}}
                        </Description>
                    </LabelItem>
                </transition-group>

            </ComplexBubble>
        </transition>

        <SimplePaginationRest v-if="pageInfo.prev || pageInfo.next" :loading="loading" :pageInfo="pageInfo"></SimplePaginationRest>

        <!--  <Modal ref="sortModal" title="Sort by">
            <router-link class="d-block" v-for="item in sortModalRouterLinkData" :key="item.to" :to='item.to'>
                <SelectMenuItem :selected="$route.query.sort == item.sort" @click.native="closeModal">
                    <span>{{item.label}}</span>    
                </SelectMenuItem>
            </router-link> 
        </Modal> -->

        <EmptyNotice v-if="emptyFlag" class="empty-notice">
            <div class="blankslate"> 
                <svg height="40" class="octicon octicon-milestone blankslate-icon" viewBox="0 0 14 16" version="1.1" width="35" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path>
                </svg>
                <h3>We couldn’t find anything!</h3>
                <p>There aren’t any labels that match. Give it another shot above.</p>
            </div>
        </EmptyNotice>
    </CommonLoadingWrapper>
</template>

<script>
    import {CommonLoadingWrapper,ComplexBubble,AnimatedHeightWrapper,Label,Modal,SelectMenuItem,SimplePaginationRest} from '@/components'
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {authRequiredGitHubGraphqlApiQuery,authRequiredGet} from '@/network'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    let parse = require("parse-link-header")
    export default {
        name: 'repository_labels_page',
        inject: ['owner','repo'],
        mixins: [RouteUpdateAwareMixin],
        data() {
            return {
                data: [],
                loading: false,
                totalCount: {
                    data: 0,
                    loading: false
                },
                firstLoadedFlag: false,
                perPage: 15,
                pageInfo: {},
                extraData: {
                    data: [],
                    loading: false
                }
            }
        },
        computed: {
            emptyFlag() {
                return this.data.length == 0 && this.loading == false && !this.pageInfo.prev
            },
            documentTitle() {
                return `Labels · ${this.owner()}/${this.repo()}`
            }
        },
        created() {
            this.network_getData()
            this.network_getLabelsCount()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_REPOSITORY_LABELS({
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
                    if(this.accessToken) this.network_getExtraData()
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            async network_getLabelsCount() {
                try{
                    this.totalCount.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_labels_count')
                    let url = api.API_REPOSITORY_LABELS({
                        repo: this.repo(),
                        owner: this.owner(),
                        params: {
                            per_page: 1
                        }
                    })
                    let res = await authRequiredGet(url,{cancelToken})
                    let labelsCountHolder = parse(res.headers.link) || {}
                    this.totalCount.data = labelsCountHolder.last ? labelsCountHolder.last.page : res.data.length
                }catch(e) {
                    console.log(e)
                }finally{
                    this.totalCount.loading = false
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
            }
        },
        components: {
            CommonLoadingWrapper,
            ComplexBubble,
            AnimatedHeightWrapper,
            Label,
            Modal,
            SelectMenuItem,
            SimplePaginationRest,
            Header: styled.div``,
            LabelItem: styled.div``,
            Description: styled.div``,
            Statistic: styled.div``,
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
</style>