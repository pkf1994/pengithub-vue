<template>
    <CommonLoadingWrapper class="px-3 pt-3 bg-gray" :loading="recentActivities.loading || repositories.loading || teams.loading">
            
        <RecentActivity class="mb-4 mt-2" v-if="recentActivities.data.length > 0">
            <h2 class="f4 mt-0 mb-2 text-normal">Recent activity</h2>
            <div class="Box">
                <AnimatedHeightWrapper>
                    <RecentActivityListItem class="Box-row" v-for="item in recentActivities.data.slice(0,recentActivities.cursor)" :event="item" :key="item.id"></RecentActivityListItem>
                </AnimatedHeightWrapper>
                <button v-if="recentActivities.cursor < recentActivities.data.length - 1" @click="showMoreRecentActivities" class="f6 btn-link width-full text-left no-underline link-gray border-top p-3">
                    Show more
                </button>
            </div>
        </RecentActivity>

        <Repositories class="mb-4 mt-2" v-if="repositories.data.length > 0">
            <h2 class="f4 mt-0 mb-2 text-normal">Repositories</h2>
            <div class="Box">
                <div class="px-2 py-1">
                    <div class="mt-2 mb-3" role="search" aria-label="Repositories">
                        <input type="text" v-model="repositories.searchQuery" class="form-control input-block mb-3 js-filterable-field js-your-repositories-search" id="dashboard-repos-filter-center" placeholder="Find a repository…" aria-label="Find a repository…" data-url="/" data-query-name="q" value="" autocomplete="off">
                    </div>
                    <AnimatedHeightWrapper :style="{transition: repositories.cursor > 7 ? 'all .4s ease' : 'none'}">
                        <li v-for="item in filteredRepositories.slice(0,repositories.cursor)" :key="item.id" class="list-style-none">
                            <div class="width-full text-bold">
                                <router-link :to="`/${item.full_name}`" class="d-inline-flex flex-items-baseline f5 mb-2 dashboard-underlined-link width-fit">
                                    <div class="mr-2 text-gray-light">
                                        <svg v-if="item.private" style="color:#dbab09" class="octicon octicon-lock repo-private-icon flex-shrink-0" aria-label="Repository" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M4 4v2h-.25A1.75 1.75 0 002 7.75v5.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-5.5A1.75 1.75 0 0012.25 6H12V4a4 4 0 10-8 0zm6.5 2V4a2.5 2.5 0 00-5 0v2h5zM12 7.5h.25a.25.25 0 01.25.25v5.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-5.5a.25.25 0 01.25-.25H12z"></path></svg>
                                        <svg v-else-if="item.fork" aria-label="Forked repository" class="octicon octicon-repo-forked flex-shrink-0" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
                                        <svg v-else aria-label="Repository" class="octicon octicon-repo flex-shrink-0" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path></svg>
                                    </div>
                                    <span class="flex-shrink-0 css-truncate css-truncate-target" title="pkf1994">{{item.full_name}}</span>
                                </router-link>
                            </div>
                        </li>
                    </AnimatedHeightWrapper>
                </div>
                 <button v-if="repositories.cursor < filteredRepositories.length - 1" @click="showMoreRepositories" class="f6 btn-link width-full text-left no-underline link-gray border-top p-3">
                    Show more
                </button>
            </div>
           
        </Repositories>

        <Teams class="mb-4 mt-2" v-if="teams.data.length > 0">
            <h2 class="f4 mt-0 mb-2 text-normal">Teams</h2>
            <div class="Box">
                <div class="px-2 py-1">
                    <div class="mt-2 mb-3" role="search" aria-label="Teams">
                        <input type="text" v-model="teams.searchQuery" class="form-control input-block mb-3 js-filterable-field js-your-teams-search" id="dashboard-repos-filter-center" placeholder="Find a team..." aria-label="Find a repository…" data-url="/" data-query-name="q" value="" autocomplete="off">
                    </div>

                    <AnimatedHeightWrapper :style="{transition:teams.cursor > 7 ? 'all .4s ease' : 'none'}">
                        <li v-for="item in filteredTeams.slice(0,teams.cursor)" :key="item.id" class="list-style-none">
                            <div class="width-full text-bold">
                                <router-link :to="item.teamsResourcePath" class="d-inline-flex flex-items-baseline f5 mb-2 dashboard-underlined-link width-fit">
                                    <div class="mr-2 text-gray-light">
                                        <svg height="16" class="octicon octicon-people" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z"></path></svg>
                                    </div>
                                    <span class="flex-shrink-0 css-truncate css-truncate-target" title="pkf1994">{{item.combinedSlug}}</span>
                                </router-link>
                            </div>
                        </li>
                    </AnimatedHeightWrapper>   
                    
                </div>

                <button v-if="teams.cursor < filteredTeams.length - 1" @click="showMoreTeams" class="f6 btn-link width-full text-left no-underline link-gray border-top p-3">
                    Show more
                </button>
            </div>
            
        </Teams>
        
         <transition name="fade" appear>
           <AllActivity class="mb-4 mt-2" v-if="repositories.data.length > 0">
                <h2 class="f4 mt-0 mb-2 text-normal">All activity</h2>

                <LoadingWrapper v-if="allActivities.loading && allActivities.data.length == 0" class="Box d-flex flex-column flex-items-center flex-justify-center p-3">
                    <LoadingIcon :size="35" class="mb-2"></LoadingIcon>
                    <span class="f4">Loading activity...</span>
                </LoadingWrapper>

                <AllActivityListItem v-for="item in allActivities.data" :activity="item" :key="item.id"></AllActivityListItem>

                <button class="ajax-pagination-btn" v-if="allActivities.pageInfo.next" @click="network_getAllActivities">
                    {{allActivities.loading ? 'Loading more...' : 'More'}}
                </button>
           </AllActivity>
        </transition>
    </CommonLoadingWrapper>
</template>
<script>
import styled from 'vue-styled-components'
import {CommonLoadingWrapper,LoadingIcon,AnimatedHeightWrapper} from '@/components'
import * as api from '@/network/api'
import * as graphql from './graphql'
import {authRequiredGitHubGraphqlApiQuery,authRequiredGet,commonGet} from '@/network'
import {RecentActivityListItem,AllActivityListItem} from './components'
let parse = require("parse-link-header")
export default {
    data() {
        return {
            recentActivities: {
                data: [],
                loading: false,
                cursor: 4
            },
            repositories: {
                searchQuery: '',
                data: [],
                loading: false,
                cursor: 7
            },
            teams: {
                searchQuery: '',
                data: [],
                loading: false,
                cursor: 7
            },
            allActivities: {
                data: [],
                loading: false,
                pageInfo: {}
            }
        }
    },
    computed: {
        filteredRepositories() {
            return this.repositories.data.filter(i => {
                return i.full_name.toLowerCase().indexOf(this.repositories.searchQuery) != -1
            })
        },
        filteredTeams() {
            return this.teams.data.filter(i => {
                return i.combinedSlug.toLowerCase().indexOf(this.teams.searchQuery) != -1
            })
        }
    },
    created() {
        this.network_getRecentActivity()
        this.network_getRepositories()
        this.network_getTeams()
        this.network_getAllActivities()
    },
    methods: {
        async network_getRecentActivity() {
            try{
                this.recentActivities.loading = true
                const url_userEvent = api.API_USER_EVENTS(this.viewer.login,{
                    per_page: 100
                })
                const url_notfications = api.API_USER_NOTIFICATIONS({
                    per_page: 100,
                    all: true
                })
                let resArr = await Promise.all([authRequiredGet(url_userEvent),authRequiredGet(url_notfications)])

                let recentActivitiesEventsClub = [
                    "IssueCommentEvent",
                    "IssuesEvent",
                    "PullRequestEvent",
                ]
                let recentActivitiesEvents = []

                resArr[0].data.forEach(item => {
                    if(recentActivitiesEventsClub.indexOf(item.type) != -1) {
                        recentActivitiesEvents.push(item)
                    }
                })

                resArr[1].data.forEach(item => {
                    if(item.reason == 'assign') recentActivitiesEvents.push({
                        id: item.id,
                        repo: item.repository,
                        created_at: item.updated_at,
                        type: 'Assigned',
                        payload: {
                            action: 'assigned',
                            issue: {
                                html_url: item.subject.url.replace('api.','').replace('/repos','').replace('/pulls','/pull'),
                                url: item.subject.url,
                                title: item.subject.title
                            }
                        }
                    })
                })

                recentActivitiesEvents.sort((a,b) => {
                    let createdAtStamp_a = Date.parse(new Date(a.created_at))
                    let createdAtStamp_b = Date.parse(new Date(b.created_at))
                    return createdAtStamp_b - createdAtStamp_a
                })

                this.recentActivities.data = this.recentActivitiesDeDuplicate(recentActivitiesEvents.filter(i => {
                    if(i.payload.issue && i.payload.issue.state == 'closed') return false
                    return true
                }))
            }catch(e) {
                this.handleError(e)
            }finally{
                this.recentActivities.loading = false
            }
        },
        async network_getRepositories() {
            try{
                this.repositories.loading = true
                
                let repositories = []
                let pageInfo
                while(!pageInfo || pageInfo && pageInfo.next) {
                    let url 
                    if(!pageInfo) {
                        url = api.API_VIEWER_REPOS({
                            per_page: 100,
                            sort: 'updated'
                        })
                    }else{
                        url = pageInfo.next.url
                    }
                    let res = await authRequiredGet(url)
                    repositories = repositories.concat(res.data)
                    pageInfo = parse(res.headers.link) || {}
                }

                this.repositories.data = repositories
               
            }catch(e) {
                this.handleError(e)
            }finally{
                this.repositories.loading = false
            }
        },
        async network_getTeams() {
            try{
                this.teams.loading = true
                let teams = []
                let res = await authRequiredGitHubGraphqlApiQuery(
                    graphql.GRAPHQL_VIEWER_TEAMS,
                    {
                        variables: {
                            userLogins: [this.viewer.login]
                        }
                    }
                )
                try{
                    let organizations = res.data.data.viewer.organizations.nodes
                    organizations.forEach(i => {
                        teams = teams.concat(i.teams.nodes)
                    })
                }catch(e) {
                    this.handleGraphqlError(res)
                }

                this.teams.data = teams
            }catch(e) { 
                console.log(e)
            }finally{
                this.teams.loading = false
            }
        },
        async network_getAllActivities() {
            try{
                this.allActivities.loading = true
                let url 
                if(this.allActivities.pageInfo.next) {
                    url = this.allActivities.pageInfo.next.url 
                }else{
                    url = api.API_USER_RECEIVED_EVENTS({
                        user: this.viewer.login,
                        params: {
                            per_page: 30
                        }
                    })
                }

                let res = await authRequiredGet(url)

                this.allActivities.pageInfo = parse(res.headers.link) || {}

                let allActivityClub = [
                    'ForkEvent',
                    "WatchEvent",
                    'PushEvent'
                ]

                let allActivities = []

                res.data.forEach(item => {
                    if(allActivityClub.indexOf(item.type) != -1) {
                        allActivities.push(item)
                    }
                })

                this.allActivities.data =  this.allActivities.data.concat(allActivities)

            }catch(e) {
                console.log(e)
            }finally{
                this.allActivities.loading = false
            }
        },
        recentActivitiesDeDuplicate(data) {
            let deDuplicateData = []
            let lastActivity
            data.forEach(i => {
                if(i.type == "Assigned") {
                    deDuplicateData.push(i)
                    return
                }
                if(!lastActivity) {
                    deDuplicateData.push(i)
                }else{
                    if(!this.wetherSimilarEvent(i,lastActivity)) deDuplicateData.push(i)
                }
                lastActivity = i
            })
            return deDuplicateData
        },
        wetherSimilarEvent(a,b) {
            if(a.type != b.type) return false
            if(a.payload.action != b.payload.action) return false
            if(a.payload.issue && !b.payload.issue) return false
            if(!a.payload.issue && b.payload.issue) return false
            if(a.payload.pull_request && !b.payload.pull_request) return false
            if(!a.payload.pull_request && b.payload.pull_request) return false
            if(a.payload.issue && (a.payload.issue.node_id != b.payload.issue.node_id)) return false
            if(a.payload.pull_request && (a.payload.pull_request.node_id != b.payload.pull_request.node_id)) return false
            return true
        },
        showMoreRecentActivities() {
            this.recentActivities.cursor += 4
        },
        showMoreRepositories() {
            this.repositories.cursor += 7
        }
    },
    watch: {
        "repositories.searchQuery": function(){
            this.repositories.cursor = this.repositories.data.length
        },
        "teams.searchQuery": function(){
            this.teams.cursor = this.teams.data.length
        }
    },
    components: {
        CommonLoadingWrapper,
        RecentActivityListItem,
        AllActivityListItem,
        LoadingIcon,
        AnimatedHeightWrapper,
        RecentActivity: styled.div``,
        Container: styled.div``,
        Repositories: styled.div``,
        Teams: styled.div``,
        AllActivity: styled.div``,
        LoadingWrapper: styled.div``
    }
}
</script>
<style scoped lang="scss">
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
.ajax-pagination-btn{
    color: #0366d6;
    background-color: #f6f8fa;
    width: 100%;
    padding: 6px;
    margin-top: 20px;
    font-weight: 600;
    color: #0366d6;
    border: 1px solid #e1e4e8;
    border-radius: 6px;
}
</style>