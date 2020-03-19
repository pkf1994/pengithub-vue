<template>
    <Container class="bg-white flex-grow-1 flex-column">
        <SearchInput class="p-3">
            <slot name="searchInput">
              
            </slot>    
        </SearchInput>

        <AnimatedHeightWrapper :stretch="canBeReset">
            <QueryAndFilterReset style="padding-bottom: 20px" class="mx-3">
                <router-link :to="resetRouterLink" class="reset-query">
                    <svg class="reset-query-icon v-align-text-bottom" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
                    Clear current search query, filters, and sorts
                </router-link>
            </QueryAndFilterReset>
        </AnimatedHeightWrapper>
        

        <AnimatedHeightWrapper :inactivatedFlagSignal="countByState != undefined">
            <Statistic class="px-3 pb-3 statistic" v-if="countByState">
                <router-link :to="countByState.toOpen" active-class="no-active-style" :class="{active: countByState.currentIssueState === 'open'}">
                    <svg class="octicon octicon-issue-opened" v-if="type === 'issue'" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>
                    <svg class="octicon octicon-git-pull-request" v-else viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11 11.28V5c-.03-.78-.34-1.47-.94-2.06C9.46 2.35 8.78 2.03 8 2H7V0L4 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0010 15a1.993 1.993 0 001-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zM4 3c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v6.56A1.993 1.993 0 002 15a1.993 1.993 0 001-3.72V4.72c.59-.34 1-.98 1-1.72zm-.8 10c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                    &nbsp;{{countByState.open && countByState.open.issueCount}} Open
                </router-link> 
                &nbsp;
                <router-link :to="countByState.toClosed" active-class="no-active-style" :class="{active: countByState.currentIssueState === 'closed'}">
                    <svg class="octicon octicon-check" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                    &nbsp;{{countByState.closed && countByState.closed.issueCount}} Closed
                </router-link> 
            </Statistic>
        </AnimatedHeightWrapper>
       

        <Entries class="flex-grow-1">
            <EntriesFilterRow class="entries-filter-row Box-header mx-0 flex flex-justify-between">
                <slot name="entriesFilterRow">
                    <EntriesFilterItem class="px-3">Visibility</EntriesFilterItem>
                    <EntriesFilterItem class="px-3">Organization</EntriesFilterItem>
                    <EntriesFilterItem class="px-3">Sort</EntriesFilterItem>
                </slot>
            </EntriesFilterRow>
            <EntriesContent class="flex-column flex-grow-1">
                <IssueListItem v-for="item in data" 
                                :showRepoFullName="issueItemShowRepoFullName"
                                :issue="item"
                                :key="item.id" 
                                :type="type"></IssueListItem>
                <EmptyNotice class="empty-notice text-center relative" v-if="data.length === 0 && !loading">
                    <svg v-if="type === 'issue'" height="40" class="octicon octicon-issue-opened blankslate-icon" viewBox="0 0 14 16" version="1.1" width="35" aria-hidden="true"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>
                    <svg v-else  height="40" class="octicon octicon-git-pull-request blankslate-icon" viewBox="0 0 12 16" version="1.1" width="30" aria-hidden="true"><path fill-rule="evenodd" d="M11 11.28V5c-.03-.78-.34-1.47-.94-2.06C9.46 2.35 8.78 2.03 8 2H7V0L4 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0010 15a1.993 1.993 0 001-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zM4 3c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v6.56A1.993 1.993 0 002 15a1.993 1.993 0 001-3.72V4.72c.59-.34 1-.98 1-1.72zm-.8 10c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                    <EmptyNoticeTitle>No results matched your search.</EmptyNoticeTitle>
                    <EmptyNoticeSubTitle>You could search <router-link to="/search">all of GitHub</router-link>.</EmptyNoticeSubTitle>
                </EmptyNotice>
            </EntriesContent>
        </Entries>

        <slot></slot>    

        <transition name="fade" appear>
            <CommonLoading v-if="loading || extraData.loading || !countByState"
                            :preventClickEvent="false"
                            :position="loading ? 'center' : 'corner'"/>
        </transition>  

    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoading, AnimatedHeightWrapper} from '../'
    import IssueListItem from './IssueItem'
    import {mapState, mapActions} from 'vuex'
    import { ACTION_HOME_REQUEST_ISSUES } from '../../store/modules/home/actionTypes'
    export default {
        provide() {
            return {
                extraData: () => this.extraData.data
            }
        },
        props: {
            data: {
                type: Array,
                default: []
            },
            extraData: {
                type: Object,
                default: () => ({
                    data: [],
                    loading: false
                })
            },
            loading: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: 'issue'
            },
            countByState: {
                type: Object,
                required: false
            },
            query: {
                type: String,
                default: ''
            },
            issueItemShowRepoFullName: {
                type: Boolean,
                default: false
            },
            resetRouterLink: {
                type: String,
                default: undefined
            },
            baseQuery: {
                type: String,
                default: undefined
            }
            
        },
        computed: {
            currentIssueState() {
                if(this.query.indexOf('is:open') > -1) return 'open'
                if(this.query.indexOf('is:closed') > -1) return 'closed'
                return ''
            },
            canBeReset() {
                return this.resetRouterLink && this.baseQuery && this.query !== this.baseQuery
            }
        },
        components: {
            CommonLoading,
            AnimatedHeightWrapper,
            IssueListItem,
            Container: styled.div``,
            Main: styled.div``,
            SearchInput: styled.div``,
            Statistic: styled.div``,
            Entries: styled.div``,
            EntriesFilterRow: styled.div``,
            EntriesFilterItem: styled.div``,
            EntriesContent: styled.div``,
            EmptyNotice: styled.div``,
            EmptyNoticeTitle: styled.h3``,
            EmptyNoticeSubTitle: styled.p``,
            QueryAndFilterReset: styled.div``
        }
    }
</script>

<style scoped lang="scss">


.statistic{
    a{
     color: #24292e;
    }
}

.entries-filter-row{
    border-left-width: 0;
    border-right-width: 0;
    border-radius: 0;
}

.active{
    font-weight: 600
}

.empty-notice{
    padding: 80px 40px;
    svg{
        margin-right: 4px;
        margin-bottom: 8px;
        margin-left: 4px;
        color: #a3aab1;
    }
    h3{
        margin: 16px 0;
        font-size: 24px;
    }
    p{
        font-size: 16px;
    }
}

.reset-query{
    font-weight: 600;
    color: #586069;
}
.reset-query-icon{
    width: 18px;
    height: 18px;
    padding: 1px;
    margin-right: 3px;
    color: #fff;
    text-align: center;
    background-color: #6a737d;
    border-radius: 3px;
    fill: currentColor;
}
</style>