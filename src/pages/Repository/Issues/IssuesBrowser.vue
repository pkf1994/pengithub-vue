<template>
    <Container class="flex-grow-1 bg-white flex-column">

        <SubNav class="px-3 pt-4 pb-1 d-flex flex-justify-between">
            <nav class="flex">
                <router-link class="subnav-item" to="/">
                    <svg class="octicon octicon-tag" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path></svg>
                    Labels
                </router-link>
                <router-link class="subnav-item" to="/">
                    <svg class="octicon octicon-milestone" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2H6V0h2v2zm4 5H2c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h10l2 2-2 2zM8 4H6v2h2V4zM6 16h2V8H6v8z"></path></svg>
                    Milestones
                </router-link>
            </nav> 

            <router-link :to="`/${owner()}/${repo()}/${this.routerPathFragment}/new`" class="btn btn-primary">
                New
            </router-link>  
        </SubNav>
        

        <IssuesPageTemplate :data="data" 
                        :extraData="extraData"
                        :type="type"
                        v-model="searchQuery"
                        :loading="loading" 
                        :countByState="processedCountByState"
                        :baseQuery="`repo:${owner()}/${repo()} is:open is:${type}`"
                        :resetRouterLink="`/${owner()}/${repo()}/${routerPathFragment}`"
                        :query="query">
            <template v-slot:searchInput>
                <ButtonLeftSearchInput v-model="searchQuery" 
                                :search="search" 
                                :clickButtonHandler="() => triggerModel('filter')"
                                placeholder="Search all issues">
                                Filters
                                <span class="dropdown-caret"></span>
                </ButtonLeftSearchInput>
            </template>

            <template v-slot:entriesFilterRow>
                    <EntriesFilterItem class="px-3" @click="() => triggerModel('author')">
                            Author
                    </EntriesFilterItem>
                    <EntriesFilterItem class="px-3" @click="() => triggerModel('label')">Label</EntriesFilterItem>
                    <EntriesFilterItem class="px-3" @click="() => triggerModel('assignee')">Assignee</EntriesFilterItem>
                    <EntriesFilterItem class="px-3" @click="() => triggerModel('sort')">Sort</EntriesFilterItem>
            </template>

            <SimplePagination   v-if="pageInfo && (pageInfo.next || pageInfo.prev)"   
                                :pageInfo="pageInfo" 
                                scrollElSelector=".fix-full-scrollable"
                                :goPrev="goPrev"
                                :goNext="goNext"></SimplePagination>

        </IssuesPageTemplate>

        <Modal title="Filter by author" ref="authorModal" :modalStyle="{height:'80vh'}">
            <div v-if="associatedUsers.author.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <SimpleSearchInput  class="p-3 modal-search-input"
                                placeholder="Filter users" 
                                v-if="!associatedUsers.author.loading"
                                v-model="authorModalSearchQuery"/>
          
            <transition-group name="slide-up" appear>
                <SelectMenuItem v-for="item in associatedUsers.author.data" :key="item.id" :selected="query.indexOf(`author:${item.login}`) > -1"  @click.native="() => selectTheAuthorOrNot(item.login)">
                    <ImgWrapper>
                        <img class="avatar mr-2" width="20" height="20" :src="item.avatar_url">
                    </ImgWrapper>
                    <strong class='mr-1'>{{item.login}}</strong>
                    <span>{{((associatedUsers.userName.data || []).filter(_item => _item.id === item.node_id)[0] || {name:''}).name}}</span>    
                </SelectMenuItem>
            </transition-group>
            <router-link  @click.native="closeModal" v-if="authorModalSearchQuery !== ''" class="d-block p-3 text-gray-light bg-white" :to='authorModalSearchRouterLink'>
                <div class="text-bold f5">author:{{authorModalSearchQuery}}</div>    
                <div>Filter by this user</div>    
            </router-link> 
        </Modal>

        <Modal title="Filter by label" ref="labelModal" :modalStyle="{height:'80vh'}">
            <div v-if="labels.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <SimpleSearchInput  class="p-3 modal-search-input" 
                                placeholder="Filter labels" 
                                v-if="!labels.loading"
                                v-model="labelModalSearchQuery"/>
            <router-link  @click.native="closeModal" 
                            v-if="!labels.loading && labels.length !== 0"
                            class="d-block text-gray-light bg-white" 
                            :to='unlabeledRouterLink'>
                <SelectMenuItem class="text-bold f5" :selected="query.indexOf('no:label') > -1">
                    Unlabeled
                </SelectMenuItem>    
            </router-link> 
            <div v-if="!labels.loading && labels.length === 0" class="p-3" style="color: #586069;">
                No labels found. Sorry about that.
            </div>  
            <transition-group name="slide-up" appear>
                <SelectMenuItem v-for="item in labels.data" :key="item.name" :selected="query.indexOf(`label:${item.name}`) > -1"  @click.native="() => selectTheLabelOrNot(item.name)">
                    <LabelBadge class="avatar mr-2 label-badge flex-shrink-0" :style="{background:`#${item.color}`}" />
                    <LabelContent style="min-width:0">
                        <LabelName class="text-bold">{{item.name}}</LabelName>    
                        <LabelDescription v-if="item.description && item.description !== ''" class="label-description">{{item.description}}</LabelDescription>    
                    </LabelContent>
                </SelectMenuItem>
            </transition-group>
        </Modal>

        <Modal title="Filter by who's assigned" ref="assigneeModal" :modalStyle="{height:'80vh'}">
            <div v-if="associatedUsers.assignee.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <SimpleSearchInput  class="p-3 modal-search-input" 
                                placeholder="Filter users" 
                                v-if="!associatedUsers.assignee.loading"
                                v-model="assigneeModalSearchQuery"/>
            <router-link  @click.native="closeModal" 
                            class="d-block text-gray-light bg-white" 
                            :to='assigneeToNobodyRouterLink'>
                <SelectMenuItem class="text-bold f5" :selected="query.indexOf('no:assignee') > -1">
                    Assigned to nobody
                </SelectMenuItem>    
            </router-link> 
            <transition-group name="slide-up" appear>
                <SelectMenuItem :selected="query.indexOf(`assignee:${item.login}`) > -1"  @click.native="() => selectTheAssigneeOrNot(item.login)" v-for="item in associatedUsers.assignee.data" :key="item.id">
                    <ImgWrapper>
                        <img class="avatar mr-2" width="20" height="20" :src="item.avatar_url">
                    </ImgWrapper>
                    <strong class='mr-1'>{{item.login}}</strong>
                    <span>{{((associatedUsers.userName.data || []).filter(_item => _item.id === item.node_id)[0] || {name:''}).name}}</span>    
                </SelectMenuItem>
            </transition-group>
            
            <router-link  @click.native="closeModal" 
                            v-if="assigneeModalSearchQuery !== ''" 
                            class="d-block p-3 text-gray-light bg-white" 
                            :to='authorModalSearchRouterLink'>
                <div class="text-bold f5">assginee:{{authorModalSearchQuery}}</div>    
                <div>Filter by this user</div>    
            </router-link> 
        </Modal>

        <Modal title="Sort by" ref="sortModal">
            <router-link v-for="item in sortModalRouterLink" :key="item.label" :to='item.routerLink'>
                <SelectMenuItem :selected="query.indexOf(item.queryFragment) > -1" @click.native="closeModal">
                    <span>{{item.label}}</span>    
                </SelectMenuItem>
            </router-link> 
            <div class="SelectMenu-divider">
                Most reactions
            </div>
            <Reactions  class="p-3 ws-normal bg-white">
                <router-link    @click.native="closeModal" 
                                class="py-2 px-3 d-inline-block reaction-item" 
                                v-for="item in sortModalReactionRouterLink" 
                                :class="{'reaction-active':query.indexOf(item.queryFragment) > -1}" 
                                :key="item.label" 
                                :to='item.routerLink'>
                    {{item.label}}
                </router-link> 
            </Reactions>
        </Modal>

        <Modal title="Filter issues" ref="filterModal">
            <router-link    v-for="item in filterModalRouterLink" 
                            class="p-3 text-gray-light d-block SelectMenu-item"
                            :key="item.label" 
                            :to='item.routerLink' 
                            @click.native="closeModal">
                {{item.label}}
            </router-link> 
            <a href="https://help.github.com/en/github/searching-for-information-on-github/searching-issues-and-pull-requests"> 
                <SelectMenuItem>
                    <template v-slot:icon>
                        <svg class="octicon octicon-link-external mr-2" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11 10h1v3c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h3v1H1v10h10v-3zM6 2l2.25 2.25L5 7.5 6.5 9l3.25-3.25L12 8V2H6z"></path></svg>
                    </template>
                    <strong>View advanced search syntax</strong>   
                </SelectMenuItem>
            </a> 
        </Modal>

    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {
        SelectMenuItem,
        SimpleSearchInput,
        ImgWrapper,
        Modal,
        IssuesPageTemplate,
        SimplePagination,
        ButtonLeftSearchInput,
        LoadingIconEx} from '@/components'
    import {cancelAndUpdateAxiosCancelTokenSource,authRequiredGitHubGraphqlApiQuery,authRequiredGet} from '@/network'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import {RouteUpdateAwareMixin} from '@/mixins'
    var parse = require('parse-link-header');
    import {mapState} from 'vuex'
    export default {
        name: 'repository_issues_browser',
        mixins: [RouteUpdateAwareMixin],
        inject: ['repo','owner'],
        props: {
            type: {
                type: String,
                default: 'issue'
            },
            routerPathFragment: {
                type: String,
                default: 'issues'
            },
        },
        data() {
            return {
                searchQuery: '',
                authorModalSearchQuery: '',
                labelModalSearchQuery: '',
                assigneeModalSearchQuery: '',
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
                labels: {
                    data: undefined,
                    loading: false
                },
                associatedUsers: {
                    author: {
                        data: undefined,
                        loading: false
                    },
                    assignee: {
                        data: undefined,
                        loading: false
                    },
                    userName: {
                        data: undefined,
                        loading:false
                    }
                }
            }
        },
        computed: {
            ...mapState({
                login: state => state.oauth.viewerInfo.login,
            }),
            filterModalRouterLink() {
                return [
                    {
                        label: 'Open issues and pull requests',
                        routerLink: `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=repo:${this.owner()}/${this.repo()} is:open`
                    },
                    {
                        label: 'Your issues',
                        routerLink: `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=repo:${this.owner()}/${this.repo()} is:open is:issue author:${this.login}`
                    },
                    {
                        label: 'Your pull requests',
                        routerLink: `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=repo:${this.owner()}/${this.repo()} is:open is:pr author:${this.login}`
                    },
                    {
                        label: 'Everything assigned to you',
                        routerLink: `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=repo:${this.owner()}/${this.repo()} is:open assignee:${this.login}`
                    },
                    {
                        label: 'Everything mentioned to you',
                        routerLink: `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=repo:${this.owner()}/${this.repo()} is:open mentions:${this.login}`
                    }
                ]
            },
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
                    toOpen: `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=${toOpenQuery}`,
                    toClosed: `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=${toClosedQuery}`,
                }
            },
            query() {
                let query = this.$route.query.q || `repo:${this.owner()}/${this.repo()} is:open is:${this.type}`
                this.searchQuery = query.replace(/is:(issue|pr)/g,`is:${this.type}`).replace(/repo:\S*\/\S*/g,'').replace(/\s+/g,' ').trim()
                return query
            },
            sortModalRouterLink() {
                return [
                    {
                        routerLink: `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:created-desc',
                        label: 'Newest',
                        queryFragment: 'sort:created-desc'
                    },
                    {
                        routerLink: `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:created-asc',
                        label: 'Oldest',
                        queryFragment: 'sort:created-asc'
                    },
                    {
                        routerLink: `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:comments-desc',
                        label: 'Most commented',
                        queryFragment: 'sort:comments-desc'
                    },
                    {
                        routerLink: `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:comments-asc',
                        label: 'Least commented',
                        queryFragment: 'sort:comments-asc'
                    },
                    {
                        routerLink: `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:updated-desc',
                        label: 'Recently updated',
                        queryFragment: 'sort:updated-desc'
                    },
                    {
                        routerLink: `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:updated-asc',
                        label: 'Least recently updated',
                        queryFragment: 'sort:updated-asc'
                    },
                ]
            },
            sortModalReactionRouterLink() {
                return [
                    {
                        routerLink: `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-%2B1-desc',
                        label: '👍',
                        queryFragment: 'sort:reactions-+1-desc'
                    },
                    {
                        routerLink: `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions--1-desc',
                        label: '👎',
                        queryFragment: 'sort:reactions--1-desc'
                    },
                    {
                        routerLink: `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-smile-desc',
                        label: '😄',
                        queryFragment: 'sort:reactions-smile-desc'
                    },
                    {
                        routerLink: `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-tada-desc',
                        label: '🎉',
                        queryFragment: 'sort:reactions-tada-desc'
                    },
                    {
                        routerLink: `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-thinking_face-desc',
                        label: '😕',
                        queryFragment: 'sort:reactions-thinking_face-desc'
                    },
                    {
                        routerLink: `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-heart-desc',
                        label: '❤️',
                        queryFragment: 'sort:reactions-heart-desc'
                    },
                    {
                        routerLink: `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-rocket-desc',
                        label: '🚀',
                        queryFragment: 'sort:reactions-rocket-desc'
                    },
                    {
                        routerLink: `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-eyes-desc',
                        label: '👀',
                        queryFragment: 'sort:reactions-eyes-desc'
                    },
                ]
            },
            authorModalSearchRouterLink() {
                return `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=` + this.query.replace(/author:\S*/g,'').trim() + ` author:${this.authorModalSearchQuery}`
            },
            assigneeModalSearchRouterLink() {
                return `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=` + this.query.replace(/assignee:\S*/g,'').trim() + ` assignee:${this.assigneeModalSearchQuery}`
            },
            assigneeToNobodyRouterLink() {
                return `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=` + this.query.replace(/assignee:\S*/g,'').replace(/no:\S*/g,'').trim() + ` no:assignee`
            },
            unlabeledRouterLink() {
                return `/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=` + this.query.replace(/assignee:\S*/g,'').replace(/label:\S*/g,'').replace(/no:\S*/g,'').trim() + ` no:label`
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
          async network_getData(payload) {
              console.log('get data === issuesBrowser')
                try{
                    this.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(`${this.name} ${this.routerPathFragment} get_data`)
                    this.cancelSources.push(sourceAndCancelToken.source)
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
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(`${this.name} ${this.routerPathFragment} get_extra_data`)
                    this.cancelSources.push(sourceAndCancelToken.source)
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

                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(`${this.name} ${this.routerPathFragment} get_issue_count_by_state`)
                    this.cancelSources.push(sourceAndCancelToken.source)

                    let url_issueCountOpen = api.API_SEARCH('issues',{
                        q: this.query.replace(/is:(open|closed)/g,'').replace(/state:(open:closed)/g,'').trim() + ' is:open',
                        per_page: 1
                    })
                    let url_issueCountClosed = api.API_SEARCH('issues',{
                        q: this.query.replace(/is:(open|closed)/g,'').replace(/state:(open:closed)/g,'').trim() + ' is:closed',
                        per_page: 1
                    })
                    let resArr = await Promise.all([authRequiredGet(url_issueCountOpen),authRequiredGet(url_issueCountClosed)])

                     this.countByState.data = {
                        open: resArr[0].data.total_count,
                        closed: resArr[1].data.total_count,
                    }
                    this.countByState.loading = false
                }catch(e) {
                    this.countByState.loading = false
                    console.log(e)
                }
            },
            async network_getAssociateUsers(meta) {
                try{
                    this.associatedUsers[meta].loading = true

                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(`${this.name} ${this.routerPathFragment} get_associate_users`)
                    this.cancelSources.push(sourceAndCancelToken.source)

                    const url_contributors = api.API_REPOSITORY_CONTRIBUTORS(this.owner(),this.repo()) 
                    const res_contributors = await authRequiredGet(url_contributors,{cancelToken:sourceAndCancelToken.cancelToken})

                      const graphql_issueCountByAssociateUser = graphql.GRAPHQL_SEARCH_FOR_ISSUES_COUNT_BY_ASSOCIATE_USER({
                        users: res_contributors.data,
                        meta: meta,
                        query: `repo:${this.owner()}/${this.repo()} is:issue`
                    })

                    const res_issueCountByAssociateUser = await authRequiredGitHubGraphqlApiQuery(graphql_issueCountByAssociateUser,{cancelToken:sourceAndCancelToken.cancelToken})
                    let avaliableUsers = []
                    for(let key in res_issueCountByAssociateUser.data.data) {
                        if(res_issueCountByAssociateUser.data.data[key].issueCount > 0) {
                            avaliableUsers.push(res_contributors.data[parseInt(key.replace('issueCount',''))])
                        }
                    }

                    this.associatedUsers[meta].data = avaliableUsers

                    this.network_getAssociateUserName(avaliableUsers)

                    this.associatedUsers[meta].loading = false
                }catch(e) {
                    this.associatedUsers[meta].loading = false
                    console.log(e)
                }
            },
            async network_getAssociateUserName(avaliableUsers) {
                try{
                    this.associatedUsers.userName.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(`${this.name} ${this.routerPathFragment} get_associate_user_name`)
                    const graphql_userName = graphql.GRAPHQL_REPOSITORY_GET_USER_NAME_BY_LOGIN({
                        users: avaliableUsers
                    })
                    const res_userName = await authRequiredGitHubGraphqlApiQuery(graphql_userName,{cancelToken:sourceAndCancelToken.cancelToken})
                    let userName = []
                    for(let key in res_userName.data.data) {
                        userName.push(res_userName.data.data[key])
                    }
                    this.associatedUsers.userName.data = userName

                    this.associatedUsers.userName.loading = false
                }catch(e){
                    this.associatedUsers.userName.loading = false
                    console.log(e)
                }
            },
            async network_getLabels() {
                try{
                    this.labels.loading = true

                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(`${this.name} ${this.routerPathFragment} get_labels`)
                    this.cancelSources.push(sourceAndCancelToken.source)
                    let url = api.API_REPO_LABELS(this.owner(),this.repo())
                    let res = await authRequiredGet(url,{cancelToken:sourceAndCancelToken.cancelToken})
                    this.labels.data = res.data

                    this.labels.loading = false
                }catch(e){
                    this.labels.loading = false
                    console.log(e)
                }
            },
            search() {
                this.searchQuery = this.searchQuery.replace(/is:(issue|pr)/g,'is:issue').replace(/repo:\S*\/\S*/g,'').replace(/\s+/g,' ').trim()
                this.$router.replace(`/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=repo:${this.owner()}/${this.repo()} ${this.searchQuery}`)
            },
            triggerModel(meta) {
                switch(meta){
                    case 'author':
                        this.$refs.authorModal.show = true
                        if(!this.associatedUsers.author.data) {
                             this.network_getAssociateUsers('author')
                        }
                        break
                    case 'sort':
                        this.$refs.sortModal.show = true
                        break
                    case 'assignee':
                        this.$refs.assigneeModal.show = true
                        if(!this.associatedUsers.assignee.data) {
                             this.network_getAssociateUsers('assignee')
                        }
                        break
                    case 'label':
                        this.$refs.labelModal.show = true
                        if(!this.labels.data) {
                             this.network_getLabels()
                        }
                        break
                    case 'filter':
                        this.$refs.filterModal.show = true
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
            closeModal() {
                this.$refs.authorModal.show = false
                this.$refs.sortModal.show = false
                this.$refs.assigneeModal.show = false
                this.$refs.labelModal.show = false
                this.$refs.filterModal.show = false
            },
            selectTheAuthorOrNot(authorLogin) {
                 let authorQueryFragment = `author:${authorLogin}`
                if(this.query.indexOf(authorQueryFragment) > -1) {
                    let q = this.query.replace(authorQueryFragment,'').trim()
                    this.$router.push(`/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=${q}`)
                }else {
                    let q = this.query + ` ${authorQueryFragment}`
                    this.$router.push(`/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=${q}`)
                }
                this.closeModal()
            },
            selectTheAssigneeOrNot(assigneeLogin) {
                let assigneeQueryFragment = `assignee:${assigneeLogin}`
                if(this.query.indexOf(assigneeQueryFragment) > -1) {
                    let q = this.query.replace('no:assignee','').replace(assigneeQueryFragment,'').trim()
                    this.$router.push(`/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=${q}`)
                }else {
                    let q = this.query.replace('no:assignee','') + ` ${assigneeQueryFragment}`
                    this.$router.push(`/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=${q}`)
                }
                this.closeModal()
            },
            selectTheLabelOrNot(labelName) {
                let labelQueryFragment = `label:${labelName}`
                if(this.query.indexOf(labelQueryFragment) > -1) {
                    let q = this.query.replace(labelQueryFragment,'').trim()
                    this.$router.push(`/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=${q}`)
                }else {
                    let q = this.query.replace('no:label','') + ` ${labelQueryFragment}`
                    this.$router.push(`/${this.owner()}/${this.repo()}/${this.routerPathFragment}?q=${q}`)
                }
                this.closeModal()
            },

            routeUpdateHook() {
                this.network_getData()
            },
            routeResetHook() {
                Object.assign(this.$data, this.$options.data())
            }
        },
        components: {
            SelectMenuItem,
            Modal,
            LoadingIconEx,
            ButtonLeftSearchInput,
            SimpleSearchInput,
            IssuesPageTemplate,
            SimplePagination,
            ImgWrapper,
            SubNav: styled.div``,
            Container: styled.div``,
            TopTabContainer: styled.div``,
            EntriesFilterItem: styled.div``,
            ModalContent: styled.div``,
            Reactions: styled.div``,
            AuthorItem: styled.div``,
            LabelBadge: styled.div``,
            LabelContent: styled.div``,
            LabelName: styled.div``,
            LabelDescription: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/navigation/index.scss';
@import 'node_modules/@primer/css/dropdown/index.scss';
@import 'node_modules/@primer/css/select-menu/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';

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
.modal-search-input{
    background:#f6f8fa;
    position: sticky;
    top: 0;
}
.label-badge{
    display: inline-block;
    width: 1em;
    height: 1em;
    vertical-align: middle;
    border: 1px solid rgba(27,31,35,.15);
    border-radius: 3px;
}
.label-description{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>