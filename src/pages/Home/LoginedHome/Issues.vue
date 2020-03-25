<template>
    <Container>
        <PaddingPageTopTab :tabs="topTabData"></PaddingPageTopTab>
         <IssuesPageTemplate :data="data" 
                        :extraData="extraData"
                        :type="type"
                        v-model="searchQuery"
                        :loading="loading" 
                        :issueItemShowRepoFullName="true"
                        :countByState="processedCountByState"
                        :baseQuery='`is:open is:${type} author:${login} archived:false`'
                        :resetRouterLink="`/${routerPathFragment}`"
                        :query="query">
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
                                :goPrev="goPrev"
                                :goNext="goNext"></SimplePagination>

            
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
    import {IssuesPageTemplate,SelectMenuItem,Modal,IconSearchInput,PaddingPageTopTab} from '@/components'
    import {cancelAndUpdateAxiosCancelTokenSource,authRequiredGitHubGraphqlApiQuery,authRequiredGet} from '@/network'
    import {mapState} from 'vuex'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    var parse = require('parse-link-header');
    import {RouteUpdateAwareMixin} from '@/mixins'
    export default {
        mixins: [RouteUpdateAwareMixin],
        props: {
            type: {
                type: String,
                default: 'issue'
            },
            routerPathFragment: {
                type: String,
                default: 'issues'
            }
        },
        data() {
            return {
                searchQuery: '',
                data: [],
                loading: false,
                extraData: {
                    data: [],
                    loading: false
                },
                totalCount: 0,
                countByState: {
                    data: undefined,
                    loading: false
                },
                perPage: 25,
                currentPage: 0,
              
                pageInfo: {
                    next: undefined,
                    last: undefined,
                    first: undefined,
                    prev: undefined
                },
               
            }
        },
        computed: {
             ...mapState({
                login: state => state.oauth.viewerInfo.login,
            }),
            processedCountByState() {
                if(!this.countByState.data) return undefined
                let currentIssueState = ''
                if(this.query.indexOf('is:open') > -1) currentIssueState = 'open'
                else if(this.query.indexOf('is:closed') > -1) currentIssueState = 'closed'

                let toOpenQuery = 'is:open ' + this.query.replace(/(is:closed|is:open)/g,'').trim()
                let toClosedQuery = 'is:closed ' + this.query.replace(/(is:closed|is:open)/g,'').trim()
                return {
                    ...this.countByState.data,
                    currentIssueState,
                    toOpen: `/${this.routerPathFragment}?q=${toOpenQuery}`,
                    toClosed: `/${this.routerPathFragment}?q=${toClosedQuery}`,
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
                    private: '/${this.routerPathFragment}?q=' + this.query.replace(/is:(private|public)/g,'').trim() + ' is:private',
                    public: '/${this.routerPathFragment}?q=' + this.query.replace(/is:(private|public)/g,'').trim() + ' is:public',
                }
            },
            sortModalRouterLink() {
                return [
                    {
                        routerLink: '/${this.routerPathFragment}?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:created-desc',
                        label: 'Newest',
                        queryFragment: 'sort:created-desc'
                    },
                    {
                        routerLink: '/${this.routerPathFragment}?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:created-asc',
                        label: 'Oldest',
                        queryFragment: 'sort:created-asc'
                    },
                    {
                        routerLink: '/${this.routerPathFragment}?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:comments-desc',
                        label: 'Most commented',
                        queryFragment: 'sort:comments-desc'
                    },
                    {
                        routerLink: '/${this.routerPathFragment}?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:comments-asc',
                        label: 'Least commented',
                        queryFragment: 'sort:comments-asc'
                    },
                    {
                        routerLink: '/${this.routerPathFragment}?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:updated-desc',
                        label: 'Recently updated',
                        queryFragment: 'sort:updated-desc'
                    },
                    {
                        routerLink: '/${this.routerPathFragment}?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:updated-asc',
                        label: 'Least recently updated',
                        queryFragment: 'sort:updated-asc'
                    },
                ]
            },
            sortModalReactionRouterLink() {
                return [
                    {
                        routerLink: '/${this.routerPathFragment}?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-%2B1-desc',
                        label: '👍',
                        queryFragment: 'sort:reactions-+1-desc'
                    },
                    {
                        routerLink: '/${this.routerPathFragment}?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions--1-desc',
                        label: '👎',
                        queryFragment: 'sort:reactions--1-desc'
                    },
                    {
                        routerLink: '/${this.routerPathFragment}?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-smile-desc',
                        label: '😄',
                        queryFragment: 'sort:reactions-smile-desc'
                    },
                    {
                        routerLink: '/${this.routerPathFragment}?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-tada-desc',
                        label: '🎉',
                        queryFragment: 'sort:reactions-tada-desc'
                    },
                    {
                        routerLink: '/${this.routerPathFragment}?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-thinking_face-desc',
                        label: '😕',
                        queryFragment: 'sort:reactions-thinking_face-desc'
                    },
                    {
                        routerLink: '/${this.routerPathFragment}?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-heart-desc',
                        label: '❤️',
                        queryFragment: 'sort:reactions-heart-desc'
                    },
                    {
                        routerLink: '/${this.routerPathFragment}?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-rocket-desc',
                        label: '🚀',
                        queryFragment: 'sort:reactions-rocket-desc'
                    },
                    {
                        routerLink: '/${this.routerPathFragment}?q=' + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-eyes-desc',
                        label: '👀',
                        queryFragment: 'sort:reactions-eyes-desc'
                    },
                ]
            },
            meta() {
                return this.$route.params.meta
            },
            query() {
                if(this.meta) {
                    switch(this.meta) {
                        case 'assigned':
                            this.searchQuery = `is:open is:${this.type} assignee:${this.login} archived:false`
                            return `is:open is:${this.type} assignee:${this.login} archived:false`
                        case 'mentioned':
                            this.searchQuery = `is:open is:${this.type} mentions:${this.login} archived:false`
                            return `is:open is:${this.type} mentions:${this.login} archived:false`
                        default:
                            return ''
                    }
                }
                if(!this.$route.query.q){
                    this.searchQuery = `is:open is:${this.type} author:${this.login} archived:false`
                }else{
                    this.searchQuery = this.$route.query.q
                }
                return this.$route.query.q || `is:open is:${this.type} author:${this.login} archived:false`
            },
            topTabData() {
                return [
                    {
                        to: `/${this.routerPathFragment}`,
                        label: 'Created',
                        activeFlag: this.searchQueryQualifierMeta == 'author'
                    },
                    {
                        to: `/${this.routerPathFragment}/assigned`,
                        label: 'Assigned',
                        activeFlag: this.searchQueryQualifierMeta == 'assignee'
                    },
                    {
                        to: `/${this.routerPathFragment}/mentioned`,
                        label: 'Mentioned',
                        activeFlag: this.searchQueryQualifierMeta == 'mentions'
                    }
                ]
            }
        },
        created() {
            this.network_getData()  
        },
        methods: {
             async network_getData(payload) {
                try{
                    this.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(`${this.name} get_data`)
                    let url 
                    if(payload && payload.url) {
                        url = payload.url
                    } else {
                         url = api.API_SEARCH(
                            'issues',
                            {
                                q: this.query,
                                per_page: this.perPage
                            }
                        )
                    }
                    let res = await authRequiredGet(url,{cancelToken:sourceAndCancelToken.cancelToken})
                    this.data = res.data.items
                    this.totalCount = res.data.total_count
                    this.pageInfo = parse(res.headers.link)

                    //获取其他数据
                    if(res.data.items.length > 0)this.network_getExtraData(res.data.items)
                    if(!payload || !payload.url)this.network_getIssueCountByState()
                    this.loading = false
                }catch(e) {
                    this.loading = false
                    console.log(e)
                }
            },  
            async network_getExtraData(issues) {
                try{
                    this.extraData.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(`${this.name} get_extra_data`)
                    let graphql_issueExtraData =  graphql.GRAPHQL_GET_ISSUES(issues)
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_issueExtraData,{cancelToken:sourceAndCancelToken.cancelToken})

                    let issueArr = []
                    for(let key in res.data.data){
                        issueArr.push(res.data.data[key])
                    }
                    this.extraData.data = this.extraData.data.concat(issueArr)

                    this.extraData.loading = false
                }catch(e) {
                    this.extraData.loading = false
                    console.log(e)
                }
            },
            async network_getIssueCountByState() {
                try{
                    this.countByState.loading = true

                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(`${this.name} get_issue_count_by_state`)
                    let graphql_issueCountByState =  graphql.GRAPHQL_COUNT_OF_ISSUE_BY_STATE(this.query)
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_issueCountByState,{cancelToken:sourceAndCancelToken.cancelToken})
                    this.countByState.data = res.data.data

                    this.countByState.loading = false
                }catch(e) {
                    this.countByState.loading = false
                    console.log(e)
                }
            },
            search() {
                this.searchQuery = this.searchQuery.replace(/is:(issue|pr)/g,'is:issue')
                switch(this.searchQuery) {
                    case `is:open is:${this.type} author:${this.login} archived:false`:
                        this.$router.replace(`/${this.routerPathFragment}`) 
                        break
                    case `is:open is:${this.type} assignee:${this.login} archived:false`:
                        this.$router.replace(`/${this.routerPathFragment}/assigned`) 
                        break
                    case `is:open is:${this.type} mentions:${this.login} archived:false`:
                        this.$router.replace(`/${this.routerPathFragment}/mentioned`) 
                        break
                    default:
                        this.$router.replace(`/${this.routerPathFragment}?q=${this.searchQuery}`)
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
             async goNext() {
                if(this.loading) return
                await this.network_getData({
                    url: this.pageInfo.next.url
                })
            },
            async goPrev() {
                if(this.loading) return
                await this.network_getData({
                    url: this.pageInfo.prev.url
                })
            },
            routeUpdateHook() {
                this.network_getData()
                this.closeModal()
            },
            routeResetHook() {
                Object.assign(this.$data, this.$options.data())
            },
            closeModal() {
                this.$refs.sortModal.show = false
                this.$refs.visibilityModal.show = false
            },
        },
        components: {
            SelectMenuItem,
            Modal,
            IssuesPageTemplate,
            PaddingPageTopTab,
            IconSearchInput,
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