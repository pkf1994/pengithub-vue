<template>
    <Container class="flex-grow-1 bg-white flex-column">

        <SubNav class="px-3 pb-1 d-flex flex-justify-between">
            <nav class="flex">
                <router-link class="subnav-item" :to="`/${owner}/${repo}/labels`">
                    <svg class="octicon octicon-tag" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z"></path></svg>
                    Labels
                </router-link>
                <router-link class="subnav-item" :to="`/${owner}/${repo}/milestones`">
                    <svg class="octicon octicon-milestone" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.75 0a.75.75 0 01.75.75V3h3.634c.414 0 .814.147 1.13.414l2.07 1.75a1.75 1.75 0 010 2.672l-2.07 1.75a1.75 1.75 0 01-1.13.414H8.5v5.25a.75.75 0 11-1.5 0V10H2.75A1.75 1.75 0 011 8.25v-3.5C1 3.784 1.784 3 2.75 3H7V.75A.75.75 0 017.75 0zm0 8.5h4.384a.25.25 0 00.161-.06l2.07-1.75a.25.25 0 000-.38l-2.07-1.75a.25.25 0 00-.161-.06H2.75a.25.25 0 00-.25.25v3.5c0 .138.112.25.25.25h5z"></path></svg>
                    Milestones
                </router-link>
            </nav> 

            <router-link :to="routerLinkToNew || `/${owner}/${repo}/${this.routerPathFragment}/new`" class="btn btn-primary">
                New
            </router-link>  
        </SubNav>
        

        <IssuesPageTemplate :data="data" 
                        :type="type"
                        :perPage="perPage"
                        v-model="searchQuery"
                        :loading="loading" 
                        :countByState="processedCountByState"
                        :baseQuery="`repo:${owner}/${repo} is:open is:${type}`"
                        :resetRouterLink="`/${owner}/${repo}/${routerPathFragment}`"
                        :query="query">
            <template v-slot:searchInput>
                <ButtonLeftSearchInput v-model="searchQuery" 
                                :search="search" 
                                :clickButtonHandler="() => triggerModel('filterModal')"
                                placeholder="Search all issues">
                                Filters
                                <span class="dropdown-caret"></span>
                </ButtonLeftSearchInput>
            </template>

            <template v-slot:entriesFilterRow>
                    <EntriesFilterItem class="px-3" @click="() => triggerModel('authorModal')">
                            Author
                    </EntriesFilterItem>
                    <EntriesFilterItem class="px-3" @click="() => triggerModel('labelModal')">Label</EntriesFilterItem>
                    <EntriesFilterItem class="px-3" @click="() => triggerModel('assigneeModal')">Assignee</EntriesFilterItem>
                    <EntriesFilterItem class="px-3" @click="() => triggerModel('sortModal')">Sort</EntriesFilterItem>
            </template>

            
            <template v-if="emptyFlag && !noResultMatchedFlag" v-slot:emptyNotice>
                <slot name="emptyNotice">
                    <div  class="blankslate blankslate-spacious blankslate-large border-0">
                        <div class="container-md">
                            <svg height="40" class="octicon octicon-issue-opened blankslate-icon" viewBox="0 0 24 24" version="1.1" width="40" aria-hidden="true"><path d="M12 7a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0112 7zm1 9a1 1 0 11-2 0 1 1 0 012 0z"></path><path fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z"></path></svg>
                            <h3>Welcome to issues!</h3>
                            <p>Issues are used to track todos, bugs, feature requests, and more. As issues are created, they’ll appear here in a searchable and filterable list. To get started, you should <router-link :to='`/${owner}/${repo}/issues/new`' >create an issue</router-link>.</p>
                        </div>
                    </div>
                </slot>
            </template>

            <template v-if="noResultMatchedFlag" v-slot:noResultMatchedNotice>
                <slot name="noResultMatchedNotice">
                    <div  class="blankslate blankslate-spacious blankslate-large border-0">
                        <div class="container-md">
                            <svg height="40" class="octicon octicon-issue-opened blankslate-icon" viewBox="0 0 24 24" version="1.1" width="40" aria-hidden="true"><path d="M12 7a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0112 7zm1 9a1 1 0 11-2 0 1 1 0 012 0z"></path><path fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z"></path></svg>
                            <h3>No results matched your search.</h3>
                            <p>You could search <router-link to="/search">all of GitHub</router-link> .</p>
                        </div>
                    </div>
                </slot>
            </template>

            <SimplePaginationRest   v-if="pageInfo && (pageInfo.next || pageInfo.prev)"   
                                :pageInfo="pageInfo" 
                                :loading="loading"
                                ></SimplePaginationRest>

        </IssuesPageTemplate>

        <Modal title="Filter by author" ref="authorModal" :modalStyle="{height:'80vh'}" @show="network_getAvailableAuthors">
            <div v-if="availableAuthors.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <SimpleSearchInput  class="p-3 modal-search-input"
                                placeholder="Filter users" 
                                v-if="!availableAuthors.loading"
                                v-model="authorModalSearchQuery"/>

            <div class="overflow-y-auto">
                <transition-group name="slide-up" appear>
                    <SelectMenuItem v-for="item in filteredAvailableAuthors" :key="item.login" :selected="query.indexOf(`author:${item.login}`) > -1"  @click.native="() => selectTheAuthorOrNot(item.login)">
                        <ImgWrapper class="mr-2">
                            <img class="avatar" width="20" height="20" :src="item.avatarUrl">
                        </ImgWrapper>
                        <strong class='mr-1'>{{item.login}}</strong>
                        <span>{{item.name}}</span>    
                    </SelectMenuItem>
                </transition-group>
            </div>
           
            <router-link  @click.native="closeModal" v-if="authorModalSearchQuery !== ''" class="d-block p-3 text-gray-light bg-white" :to='authorModalSearchRouterLink'>
                <div class="text-bold f5">author:{{authorModalSearchQuery}}</div>    
                <div>Filter by this user</div>    
            </router-link> 
        </Modal>

        <Modal title="Filter by label" ref="labelModal" :modalStyle="{height:'80vh'}" @show="network_getAvailableLabels">
            <div v-if="availableLabels.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <SimpleSearchInput  class="p-3 modal-search-input" 
                                placeholder="Filter availableLabels" 
                                v-if="!availableLabels.loading"
                                v-model="labelModalSearchQuery"/>
            <router-link  @click.native="closeModal" 
                            v-if="!availableLabels.loading && availableLabels.length !== 0"
                            class="d-block text-gray-light bg-white" 
                            :to='unlabeledRouterLink'>
                <SelectMenuItem class="text-bold f5" :selected="query.indexOf('no:label') > -1">
                    Unlabeled
                </SelectMenuItem>    
            </router-link> 
            <div v-if="!availableLabels.loading && availableLabels.length === 0" class="p-3" style="color: #586069;">
                No availableLabels found. Sorry about that.
            </div>  
            <div class="overflow-y-auto">
                <transition-group name="slide-up" appear>
                    <SelectMenuItem v-for="item in filteredAvailableLabels" :key="item.name" :selected="query.indexOf(`label:${item.name}`) > -1"  @click.native="() => selectTheLabelOrNot(item.name)">
                        <LabelBadge class="avatar mr-2 label-badge flex-shrink-0" :style="{background: item.color}" />
                        <LabelContent style="min-width:0">
                            <LabelName class="text-bold">{{item.name}}</LabelName>    
                            <LabelDescription v-if="item.description && item.description !== ''" class="label-description">{{item.description}}</LabelDescription>    
                        </LabelContent>
                    </SelectMenuItem>
                </transition-group>
            </div>
           
        </Modal>

        <Modal title="Filter by who's assigned" ref="assigneeModal" :modalStyle="{height:'80vh'}" @show="network_getAvailableAssignees">
            <div v-if="availableAssignees.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <SimpleSearchInput  class="p-3 modal-search-input" 
                                placeholder="Filter users" 
                                v-if="!availableAssignees.loading"
                                v-model="assigneeModalSearchQuery"/>
            <router-link  @click.native="closeModal"
                              v-if="!availableAssignees.loading"
                            class="d-block text-gray-light bg-white" 
                            :to='assigneeToNobodyRouterLink'>
                <SelectMenuItem class="text-bold f5" :selected="query.indexOf('no:assignee') > -1">
                    Assigned to nobody
                </SelectMenuItem>    
            </router-link> 
            <div class="overflow-y-auto">
                <transition-group name="slide-up" appear>
                    <SelectMenuItem :selected="query.indexOf(`assignee:${item.login}`) > -1"  
                                    @click.native="() => selectTheAssigneeOrNot(item.login)" 
                                    v-for="item in filteredAvailableAssignees" 
                                    :key="item.login">
                        <ImgWrapper class="mr-2">
                            <img class="avatar" width="20" height="20" :src="item.avatarUrl">
                        </ImgWrapper>
                        <strong class='mr-1'>{{item.login}}</strong>
                        <span>{{item.name}}</span>    
                    </SelectMenuItem>
                </transition-group>
            </div> 
           
            
            <router-link  @click.native="closeModal" 
                            v-if="assigneeModalSearchQuery !== ''" 
                            class="d-block p-3 text-gray-light bg-white" 
                            :to='authorModalSearchRouterLink'>
                <div class="text-bold f5">assginee:{{authorModalSearchQuery}}</div>    
                <div>Filter by this user</div>    
            </router-link> 
        </Modal>

        <Modal title="Sort by" ref="sortModal" :modalStyle="{maxHeight:'80vh'}">
            <div class="overflow-y-auto">
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
                                    class="py-2 px-3 d-inline-block reaction-item col-3"  
                                    v-for="item in sortModalReactionRouterLink" 
                                    :class="{'reaction-active':query.indexOf(item.queryFragment) > -1}" 
                                    :key="item.label" 
                                    :to='item.routerLink'>
                        {{item.label}}
                    </router-link> 
                </Reactions>
            </div> 
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
        SimplePaginationRest,
        ButtonLeftSearchInput,
        LoadingIconEx} from '@/components'
    import {cancelAndUpdateAxiosCancelTokenSource,authRequiredGitHubGraphqlApiQuery,authRequiredGet,commonGet} from '@/network'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import Vue from 'vue'
    var parse = require('parse-link-header');
    export default {
        name: 'repository_issues_browser',
        mixins: [RouteUpdateAwareMixin],
        provide() {
            return {
                extraData: () => this.extraData.data
            }
        },
        props: {
            type: {
                type: String,
                default: 'issue'
            },
            routerPathFragment: {
                type: String,
                default: 'issues'
            },
            routerLinkToNew: {
                type: String,
                required: false
            }
        },
        data() {
            return {
                searchQuery: '',
                authorModalSearchQuery: '',
                labelModalSearchQuery: '',
                assigneeModalSearchQuery: '',
                data: [],
                loading: false,
                emptyFlag: false,
                noResultMatchedFlag: false,
                extraData: {
                    data: [],
                    loading: false
                },
                totalCount: 0,
                countByState: {
                    data: undefined,
                    loading: false
                },
                perPage: 10,
                currentPage: 0,
              
                pageInfo: {
                    next: undefined,
                    last: undefined,
                    first: undefined,
                    prev: undefined
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
                },
                availableAuthors: {
                    data: [],
                    loading: false
                },
                availableLabels: {
                    data: [],
                    loading: false
                },
                availableAssignees: {
                    data: [],
                    loading: false
                },
            }
        },
        computed: {
            page() {
                return this.$route.query.page
            },
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            filterModalRouterLink() {
                return [
                    {
                        label: 'Open issues and pull requests',
                        routerLink: `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=repo:${this.owner}/${this.repo} is:open`
                    },
                    {
                        label: 'Your issues',
                        routerLink: `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=repo:${this.owner}/${this.repo} is:open is:issue author:${this.viewer.login}`
                    },
                    {
                        label: 'Your pull requests',
                        routerLink: `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=repo:${this.owner}/${this.repo} is:open is:pr author:${this.viewer.login}`
                    },
                    {
                        label: 'Everything assigned to you',
                        routerLink: `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=repo:${this.owner}/${this.repo} is:open assignee:${this.viewer.login}`
                    },
                    {
                        label: 'Everything mentioned to you',
                        routerLink: `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=repo:${this.owner}/${this.repo} is:open mentions:${this.viewer.login}`
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
                    toOpen: `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=${toOpenQuery}`,
                    toClosed: `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=${toClosedQuery}`,
                }
            },
            query() {
                let query = this.$route.query.q || `repo:${this.owner}/${this.repo} is:open is:${this.type}`
                this.searchQuery = query.replace(/is:(issue|pr)/g,`is:${this.type}`).replace(/repo:\S*\/\S*/g,'').replace(/\s+/g,' ').trim()
                return query
            },
            sortModalRouterLink() {
                return [
                    {
                        routerLink: `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:created-desc',
                        label: 'Newest',
                        queryFragment: 'sort:created-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:created-asc',
                        label: 'Oldest',
                        queryFragment: 'sort:created-asc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:comments-desc',
                        label: 'Most commented',
                        queryFragment: 'sort:comments-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:comments-asc',
                        label: 'Least commented',
                        queryFragment: 'sort:comments-asc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:updated-desc',
                        label: 'Recently updated',
                        queryFragment: 'sort:updated-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:updated-asc',
                        label: 'Least recently updated',
                        queryFragment: 'sort:updated-asc'
                    },
                ]
            },
            sortModalReactionRouterLink() {
                return [
                    {
                        routerLink: `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-%2B1-desc',
                        label: '👍',
                        queryFragment: 'sort:reactions-+1-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions--1-desc',
                        label: '👎',
                        queryFragment: 'sort:reactions--1-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-smile-desc',
                        label: '😄',
                        queryFragment: 'sort:reactions-smile-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-tada-desc',
                        label: '🎉',
                        queryFragment: 'sort:reactions-tada-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-thinking_face-desc',
                        label: '😕',
                        queryFragment: 'sort:reactions-thinking_face-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-heart-desc',
                        label: '❤️',
                        queryFragment: 'sort:reactions-heart-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-rocket-desc',
                        label: '🚀',
                        queryFragment: 'sort:reactions-rocket-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-eyes-desc',
                        label: '👀',
                        queryFragment: 'sort:reactions-eyes-desc'
                    },
                ]
            },
            authorModalSearchRouterLink() {
                return `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=` + this.query.replace(/author:\S*/g,'').trim() + ` author:${this.authorModalSearchQuery}`
            },
            assigneeModalSearchRouterLink() {
                return `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=` + this.query.replace(/assignee:\S*/g,'').trim() + ` assignee:${this.assigneeModalSearchQuery}`
            },
            assigneeToNobodyRouterLink() {
                return `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=` + this.query.replace(/assignee:\S*/g,'').replace(/no:\S*/g,'').trim() + ` no:assignee`
            },
            unlabeledRouterLink() {
                return `/${this.owner}/${this.repo}/${this.routerPathFragment}?q=` + this.query.replace(/assignee:\S*/g,'').replace(/label:\S*/g,'').replace(/no:\S*/g,'').trim() + ` no:label`
            },
            filteredAvailableAuthors() {
                return this.availableAuthors.data.filter(i => {
                    return i.login.toLowerCase().indexOf(this.authorModalSearchQuery.toLowerCase()) != -1 || i.name.toLowerCase().indexOf(this.authorModalSearchQuery.toLowerCase()) != -1
                })
            },
            filteredAvailableLabels() {
                return this.availableLabels.data.filter(i => {
                    return i.name.toLowerCase().indexOf(this.labelModalSearchQuery.toLowerCase()) != -1
                })
            },
            filteredAvailableAssignees() {
                return this.availableAssignees.data.filter(i => {
                      return i.login.toLowerCase().indexOf(this.assigneeModalSearchQuery.toLowerCase()) != -1 || i.name.toLowerCase().indexOf(this.assigneeModalSearchQuery.toLowerCase()) != -1
                })
            },  
            documentTitle() {
                return `${this.type == 'issue' ? 'Issue' : 'Pull request'} · ${this.owner}/${this.repo}`
            },
        
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData(payload) {
                try{
                    this.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(`${this.name} ${this.routerPathFragment} get_data`)
                    this.cancelSources.push(sourceAndCancelToken.source)
                    let url 
                    if(payload && payload.url) {
                        url = payload.url
                    } else {
                        url = api.API_SEARCH(
                            {
                                type: 'issues',
                                params: {
                                    q: this.query,
                                    per_page: this.perPage,
                                    page: this.page
                                }
                            }
                        )
                    }
                    let res = await authRequiredGet(url,{cancelToken:sourceAndCancelToken.cancelToken})
                    
                    this.data = res.data.items
                    this.totalCount = res.data.total_count
                    this.pageInfo = parse(res.headers.link) || {}
                    this.noResultMatchedFlag = false
                    if(res.data.total_count == 0) {
                        this.emptyFlag = true
                        if(this.searchQuery != `is:open is:${this.type}` && this.searchQuery != `is:${this.type} is:open`) {
                            this.noResultMatchedFlag = true
                        }
                    } else {
                        this.emptyFlag = false
                    }
                    //获取其他数据
                    if(this.accessToken && this.type == 'pr') this.network_getExtraData(res.data.items)
                    if(!payload || !payload.url)this.network_getIssueCountByState()
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },  
            async network_getExtraData(issues) {
                if(issues.length == 0) return
                try{
                    this.extraData.loading = true
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_ISSUES,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_extra_data'),
                            variables: {
                                ids: issues.map(i => i.node_id)
                            }
                        }
                    )

                     try{
                         this.extraData.data = res.data.data.nodes
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }

                }catch(e) {
                    console.log(e)
                }finally{
                    this.extraData.loading = false
                }
            },
            async network_getIssueCountByState() {
                try{
                    this.countByState.loading = true

                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(`${this.name} ${this.routerPathFragment} get_issue_count_by_state`)
                    this.cancelSources.push(sourceAndCancelToken.source)

                    let url_issueCountOpen = api.API_SEARCH(
                        {
                            type: 'issues',
                            params: {
                                q: this.query.replace(/is:(open|closed)/g,'').replace(/state:(open:closed)/g,'').trim() + ' is:open',
                                per_page: 1
                            }
                        }
                    )
                    let url_issueCountClosed = api.API_SEARCH(
                        {
                            type:'issues',
                            params: {
                                 q: this.query.replace(/is:(open|closed)/g,'').replace(/state:(open:closed)/g,'').trim() + ' is:closed',
                                per_page: 1
                            }
                        })
                    let resArr = await Promise.all([authRequiredGet(url_issueCountOpen),authRequiredGet(url_issueCountClosed)])

                     this.countByState.data = {
                        open: resArr[0].data.total_count,
                        closed: resArr[1].data.total_count,
                    }
                }catch(e) {
                    console.log(e)
                }finally{
                    this.countByState.loading = false
                }
            },
            async network_getAvailableAuthors() {
                if(this.availableAuthors.data.length > 0 || this.availableAuthors.loading ) return 
                try{
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_available_authors')
                    this.availableAuthors.loading = true
                    let url = api.API_REPOSITORY_ISSUES_AVAILABLE_AUTHORS({
                        repo: this.repo,
                        owner: this.owner,
                        query: this.query
                    })
                    let res = await commonGet(url,{cancelToken})
                    this.availableAuthors.data = this.parseAvailableUsersFromHTML(res.data)
                }catch(e) {
                    console.log(e)
                }finally{
                    this.availableAuthors.loading = false
                }
            },
            async network_getAvailableLabels() {
                if(this.availableLabels.data.length > 0 || this.availableLabels.loading) return 
                try{
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_available_labels')
                    this.availableLabels.loading = true
                    let url = api.API_REPOSITORY_ISSUES_AVAILABLE_LABELS({
                        repo: this.repo,
                        owner: this.owner,
                        query: this.query
                    })
                    let res = await commonGet(url,{cancelToken})
                    this.parseAvailableLabelsFromHTML(res.data)
                }catch(e){
                    console.log(e)
                }finally{
                    this.availableLabels.loading = false
                }
            },
             async network_getAvailableAssignees() {
                if(this.availableAssignees.data.length > 0 || this.availableAssignees.loading) return 
                try{
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_available_Assgnees')
                    this.availableAssignees.loading = true
                    let url = api.API_REPOSITORY_ISSUES_AVAILABLE_ASSIGNEES({
                        repo: this.repo,
                        owner: this.owner,
                        query: this.query
                    })
                    let res = await commonGet(url,{cancelToken})
                    this.availableAssignees.data = this.parseAvailableUsersFromHTML(res.data)
                }catch(e){
                    console.log(e)
                }finally{
                    this.availableAssignees.loading = false
                }
            },
            search() {
                this.searchQuery = this.searchQuery.replace(/is:(issue|pr)/g,'is:issue').replace(/repo:\S*\/\S*/g,'').replace(/\s+/g,' ').trim()
                this.$router.replace(`/${this.owner}/${this.repo}/${this.routerPathFragment}?q=repo:${this.owner}/${this.repo} ${this.searchQuery}`)
            },
            triggerModel(modalRef) {
                this.$refs[modalRef].show = true
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
                    this.$router.push(`/${this.owner}/${this.repo}/${this.routerPathFragment}?q=${q}`)
                }else {
                    let q = this.query.replace(/author:\s?\S*/g,'') + ` ${authorQueryFragment}`
                    this.$router.push(`/${this.owner}/${this.repo}/${this.routerPathFragment}?q=${q}`)
                }
                this.closeModal()
            },
            selectTheAssigneeOrNot(assigneeLogin) {
                let assigneeQueryFragment = `assignee:${assigneeLogin}`
                if(this.query.indexOf(assigneeQueryFragment) > -1) {
                    let q = this.query.replace('no:assignee','').replace(assigneeQueryFragment,'').trim()
                    this.$router.push(`/${this.owner}/${this.repo}/${this.routerPathFragment}?q=${q}`)
                }else {
                    let q = this.query.replace('no:assignee','') + ` ${assigneeQueryFragment}`
                    this.$router.push(`/${this.owner}/${this.repo}/${this.routerPathFragment}?q=${q}`)
                }
                this.closeModal()
            },
            selectTheLabelOrNot(labelName) {
                let labelQueryFragment = `label:${labelName}`
                if(this.query.indexOf(labelQueryFragment) > -1) {
                    let q = this.query.replace(labelQueryFragment,'').trim()
                    this.$router.push(`/${this.owner}/${this.repo}/${this.routerPathFragment}?q=${q}`)
                }else {
                    let q = this.query.replace('no:label','') + ` ${labelQueryFragment}`
                    this.$router.push(`/${this.owner}/${this.repo}/${this.routerPathFragment}?q=${q}`)
                }
                this.closeModal()
            },

            routeUpdateHook() {
                this.network_getData()
            },
            routeResetHook() {
                Object.assign(this.$data, this.$options.data())
            },
            parseAvailableUsersFromHTML(HTML) {
                let execPattern = /<a.*?role="menuitemradio".*?href="(.*?)"[^>]*>[\s\S]*?<img.*?src="(.*?)".*?alt="@(.*?)"[^>]*>[\s\S]*?<span[^>]*>(.*)<\/span>[\s\S]*?<\/a>/g
                let execResult
                let availableAuthors = []
                while((execResult = execPattern.exec(HTML)) != null) {
                    availableAuthors.push({
                        routerLink: execResult[1],
                        avatarUrl: execResult[2],
                        login: execResult[3],
                        name: execResult[4],
                    })
                }
                return availableAuthors
            },
            parseAvailableLabelsFromHTML(HTML) {
                let execPattern = /<span class="ColorSwatch f5 mr-2 flex-shrink-0" style="background-color: (.*); margin-top: 1px;"><\/span>\n\s*<div class="lh-condensed css-truncate min-width-0">\n\s*<div class="css-truncate-overflow text-bold">(.*)<\/div>\n\s*(<div class="css-truncate-overflow text-gray mt-1">\n\s*(.*)\n\s*<\/div>\n\s*)?<\/div>/g
                let execResult
                let availableLabels = []
                while((execResult = execPattern.exec(HTML)) != null) {
                    availableLabels.push({
                        color: execResult[1],
                        name: execResult[2],
                        description: execResult[4]
                    })
                }
                this.availableLabels.data = availableLabels
            }
        },
        components: {
            SelectMenuItem,
            Modal,
            LoadingIconEx,
            ButtonLeftSearchInput,
            SimpleSearchInput,
            IssuesPageTemplate,
            SimplePaginationRest,
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
@import 'node_modules/@primer/css/layout/index.scss';
@import 'node_modules/@primer/css/blankslate/index.scss';

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