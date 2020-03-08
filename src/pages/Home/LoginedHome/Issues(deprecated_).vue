<template>
    <Container>
        <TopTabContainer class="px-3 pt-3 flex">
            <router-link to='/issues' class="subnav-item flex-1 text-center" :class="{'active':searchQueryQualifierMeta === 'author'}">Created</router-link>
            <router-link to='/issues/assigned' class="subnav-item flex-1 text-center" :class="{'active':searchQueryQualifierMeta === 'assignee'}">Assigned</router-link>
            <router-link to='/issues/mentioned' class="subnav-item flex-1 text-center" :class="{'active':searchQueryQualifierMeta === 'mentions'}">Mentioned</router-link>
        </TopTabContainer>
        <IssuesPageTemplate :data="data" 
                        :type="type"
                        v-model="searchQuery"
                        :loading="loading" 
                        :loadingCountOfIssueByState="loadingCountOfIssueByState" 
                        :countInfo="countInfo"
                        :query="query"
                        :issueItemShowRepoFullName="true"
                        :loadingAdditionalData="loadingAdditionalData">
            <template v-slot:searchInput>
                <IconSearchInput v-model="searchQuery" 
                                :search="search" 
                                placeholder="Search all issues"/>
            </template>

            <template v-slot:entriesFilterRow>
                    <EntriesFilterItem class="px-3" @click="() => triggerModel('visibility')">Visibility</EntriesFilterItem>
                    <EntriesFilterItem class="px-3" @click="() => triggerModel('sort')">Sort</EntriesFilterItem>
                    <EntriesFilterItem class="px-3" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</EntriesFilterItem>
            </template>

            <SimplePagination   v-if="pageInfo && (pageInfo.next || pageInfo.prev)"   
                                :pageInfo="pageInfo" 
                                scrollElSelector="fix-full-scrollable"
                                :dataGetter="paginationDataGetter"></SimplePagination>

            
        </IssuesPageTemplate>

        <Modal title="Repository visibility" ref="visibilityModal">
            <router-link :to='visibilityModalRouterLink.private'>
                <SelectMenuItem :selected="query.indexOf('is:private') > -1">
                    <span>Private repositories only</span>    
                </SelectMenuItem>
            </router-link> 
            <router-link :to='visibilityModalRouterLink.public'>
                <SelectMenuItem  :selected="query.indexOf('is:public') > -1">
                    <span>Public repositories only</span>    
                </SelectMenuItem>
            </router-link> 
        </Modal>


        <Modal title="Sort by" ref="sortModal">
            <router-link v-for="item in sortModalRouterLink" :key="item.label" :to='item.routerLink'>
                <SelectMenuItem :selected="query.indexOf(item.queryFragment) > -1">
                    <span>{{item.label}}</span>    
                </SelectMenuItem>
            </router-link> 
            <div class="SelectMenu-divider">
                Most reactions
            </div>
            <reactions class="p-3 ws-normal">
                <router-link class="py-2 px-3 d-inline-block reaction-item" 
                v-for="item in sortModalReactionRouterLink" 
                :class="{'reaction-active':query.indexOf(item.queryFragment) > -1}" 
                :key="item.label" 
                :to='item.routerLink'>
                    {{item.label}}
                </router-link> 
            </reactions>
        </Modal>


    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {IssuesPageMixin,SelectMenuItem,Modal} from '../../../components'
    import {mapState, mapActions} from 'vuex'
    import { ACTION_ISSUES_REQUEST_ISSUES } from '../../../store/modules/issues/actionTypes'
    export default {
        mixins: [IssuesPageMixin],
        data() {
            return {
                type: 'issue',
                belongTo: 'home',
            }
        },
        computed: {
            ...mapState({
                loading: state => state.issues.home.issue.loading,
                loadingAdditionalData: state => state.issues.home.issue.loadingAdditionalData,
                loadingCountOfIssueByState: state => state.issues.home.issue.loadingCountOfIssueByState,
                data: state => state.issues.home.issue.data,
                pageInfo: state => state.issues.home.issue.pageInfo,
                _countInfo: state => state.issues.home.issue.countInfo
            }),
            countInfo() {
                let currentIssueState = ''
                if(this.query.indexOf('is:open') > -1) currentIssueState = 'open'
                else if(this.query.indexOf('is:closed') > -1) currentIssueState = 'closed'

                let toOpenQuery = 'is:open ' + this.query.replace(/(is:closed|is:open)/g,'').trim()
                let toClosedQuery = 'is:closed ' + this.query.replace(/(is:closed|is:open)/g,'').trim()
                return {
                    ...this._countInfo,
                    currentIssueState,
                    toOpen: `/issues?q=${toOpenQuery}`,
                    toClosed: `/issues?q=${toClosedQuery}`,
                }
            },
            searchQueryQualifierMeta() {
                var reg = new RegExp(`(author|assignee|mentions):${this.login}`,'g')
                var res = this.query.match(reg)
                if(res === null) return ''
                return res[0] && res[0].split(':')[0]
            },
            visibilityModalRouterLink() {
                return {
                    private: '/issues?q=' + this.query.replace(/is:(private|public)/g,'').trim() + ' is:private',
                    public: '/issues?q=' + this.query.replace(/is:(private|public)/g,'').trim() + ' is:public',
                }
            },
            sortModalRouterLink() {
                return [
                    {
                        routerLink: '/issues?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:created-desc',
                        label: 'Newest',
                        queryFragment: 'sort:created-desc'
                    },
                    {
                        routerLink: '/issues?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:created-asc',
                        label: 'Oldest',
                        queryFragment: 'sort:created-asc'
                    },
                    {
                        routerLink: '/issues?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:comments-desc',
                        label: 'Most commented',
                        queryFragment: 'sort:comments-desc'
                    },
                    {
                        routerLink: '/issues?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:comments-asc',
                        label: 'Least commented',
                        queryFragment: 'sort:comments-asc'
                    },
                    {
                        routerLink: '/issues?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:updated-desc',
                        label: 'Recently updated',
                        queryFragment: 'sort:updated-desc'
                    },
                    {
                        routerLink: '/issues?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:updated-asc',
                        label: 'Least recently updated',
                        queryFragment: 'sort:updated-asc'
                    },
                ]
            },
            sortModalReactionRouterLink() {
                return [
                    {
                        routerLink: '/issues?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-%2B1-desc',
                        label: '👍',
                        queryFragment: 'sort:reactions-+1-desc'
                    },
                    {
                        routerLink: '/issues?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions--1-desc',
                        label: '👎',
                        queryFragment: 'sort:reactions--1-desc'
                    },
                    {
                        routerLink: '/issues?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-smile-desc',
                        label: '😄',
                        queryFragment: 'sort:reactions-smile-desc'
                    },
                    {
                        routerLink: '/issues?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-tada-desc',
                        label: '🎉',
                        queryFragment: 'sort:reactions-tada-desc'
                    },
                    {
                        routerLink: '/issues?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-thinking_face-desc',
                        label: '😕',
                        queryFragment: 'sort:reactions-thinking_face-desc'
                    },
                    {
                        routerLink: '/issues?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-heart-desc',
                        label: '❤️',
                        queryFragment: 'sort:reactions-heart-desc'
                    },
                    {
                        routerLink: '/issues?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-rocket-desc',
                        label: '🚀',
                        queryFragment: 'sort:reactions-rocket-desc'
                    },
                    {
                        routerLink: '/issues?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-eyes-desc',
                        label: '👀',
                        queryFragment: 'sort:reactions-eyes-desc'
                    },
                ]
            }
        },
        methods: {
            ...mapActions({
                action_getData: ACTION_ISSUES_REQUEST_ISSUES
            }),
            search() {
                this.searchQuery = this.searchQuery.replace(/is:(issue|pr)/g,'is:issue')
                switch(this.searchQuery) {
                    case `is:open is:${this.type} author:${this.login} archived:false`:
                        this.$router.replace(`/issues`) 
                        break
                    case `is:open is:${this.type} assignee:${this.login} archived:false`:
                        this.$router.replace(`/issues/assigned`) 
                        break
                    case `is:open is:${this.type} mentions:${this.login} archived:false`:
                        this.$router.replace(`/issues/mentioned`) 
                        break
                    default:
                        this.$router.replace(`/issues?q=${this.searchQuery}`)
                }
            },
            triggerModel(meta) {
                switch(meta){
                    case 'visibility':
                        this.$refs.visibilityModal.show = true
                        break
                    case 'sort':
                        this.$refs.sortModal.show = true
                        break
                }
            },
            async paginationDataGetter(payload) {
                await this.action_getData({
                    ...payload,
                    issueType:this.type,
                    q:this.query,
                    belongTo:this.belongTo
                })
            }
        },
        components: {
            SelectMenuItem,
            Modal,
            Container: styled.div``,
            TopTabContainer: styled.div``,
            EntriesFilterItem: styled.div``,
            ModalContent: styled.div``,
            reactions: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
.subnav-item:first-child {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
}
.subnav-item:last-child {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
}

.subnav-item {
    position: relative;
    float: left;
    padding: 6px 14px;
    font-weight: 600;
    line-height: 20px;
    color: #586069;
    border: 1px solid #e1e4e8;
}
.active{
    color: #fff;
    background-color: #0366d6;
    border-color: #0366d6;
}
.reaction-item{
    margin: 0!important;
    font-family: Apple Color Emoji,Segoe UI,Segoe UI Emoji,Segoe UI Symbol;
    font-size: 1.2em;
    font-style: normal!important;
    font-weight: 400;
    line-height: 20px;
    border: 1px solid transparent;
    border-radius: 3px;
    opacity: .7;
}
.reaction-active{
    background-color: #f1f8ff;
    border-color: #0366d6;
    opacity: 1
}
</style>