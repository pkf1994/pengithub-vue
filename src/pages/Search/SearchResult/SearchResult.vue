<template>
    <Container>
        <SearchInputWrapper class="p-2 border-bottom">
            <input aria-label="Search GitHub"
                   v-model="localSearchQuery"
                   autocapitalize="off"
                   autocomplete="off"
                   autofocus=""
                   ref="input"
                   class="search-input form-control input-block"
                   placeholder="Search GitHub"
                   spellcheck="false"
                   type="text"/>
        </SearchInputWrapper>

        <ComplexTopTab class="mb-2 border-bottom" :tabs="tabs"/>
        <keep-alive>
            <router-view/>
        </keep-alive>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ComplexTopTab} from '@/components'
    import {WithSearchInputMixin,RouteUpdateAwareMixin} from '@/mixins'
    import {util_numberFormat} from '@/util'
    import {cancelAndUpdateAxiosCancelTokenSource,authRequiredGet,authRequiredGitHubGraphqlApiQuery } from '@/network'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import Vue from 'vue'
    export default {
        mixins: [WithSearchInputMixin,RouteUpdateAwareMixin],
        name: 'search_result_page',
        data() {
            return {
                data: {
                    repositories: 0,
                    code: 0,
                    commits: 0,
                    issues: 0,
                    users: 0,
                    topics: 0,
                },
                loading: false,
                cachedRouteQuery: {
                    
                }  
            }
        },
        computed: {
            currentRoutePath() {
                Vue.set(this.cachedRouteQuery,this.$route.path,this.$route.fullPath)
                return this.$route.path
            },
            tabs: function () {
                return [
                    {
                        to: this.cachedRouteQuery['/search'] || `/search?q=${this.query}`,
                        exact: true,
                        label: 'Repositories',
                        meta: this.data.repositories === 0 ? undefined : util_numberFormat.thousands2K2M(this.data.repositories,0),
                        active: this.$route.path == '/search'
                    },
                    {
                        to: this.cachedRouteQuery['/search/code'] || `/search/code?q=${this.query}`,
                        label: 'Code',
                        meta: this.data.code === 0 ? undefined : util_numberFormat.thousands2K2M(this.data.code,0),
                        active: this.$route.path == '/search/code'
                    },
                    {
                        to: this.cachedRouteQuery['/search/commits'] || `/search/commits?q=${this.query}`,
                        label: 'Commits',
                        meta: this.data.commits === 0 ? undefined : util_numberFormat.thousands2K2M(this.data.commits,0),
                        active: this.$route.path == '/search/commits'
                    },
                    {
                        to: this.cachedRouteQuery['/search/issues'] || `/search/issues?q=${this.query}`,
                        label: 'Issues',
                        meta: this.data.issues === 0 ? undefined : util_numberFormat.thousands2K2M(this.data.issues,0),
                        active: this.$route.path == '/search/issues'
                    },
                    {
                        to: this.cachedRouteQuery['/search/users'] || `/search/users?q=${this.query}`,
                        label: 'Users',
                        meta: this.data.users === 0 ? undefined : util_numberFormat.thousands2K2M(this.data.users,0),
                        active: this.$route.path == '/search/users'
                    },
                    {
                        to: this.cachedRouteQuery['/search/topics'] || `/search/topics?q=${this.query}`,
                        label: 'Topics',
                        meta: this.data.topics === 0 ? undefined : util_numberFormat.thousands2K2M(this.data.topics,0),
                        active: this.$route.path == '/search/topics'
                    }
                ]
            },
            query: function() {
                let query = this.$route.query.q
                this.localSearchQuery = query
                return query
            },
        },
        created() {
            console.log(this.$route)
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    this.cancelSources.push(sourceAndCancelToken.source)
                    let graphql_itemCountBySearchResult = graphql.GRAPHQL_COUNT_GROUP_BY_SEARCH_TYPE(this.query)

                    const res_graphql = await authRequiredGitHubGraphqlApiQuery(graphql_itemCountBySearchResult,{cancelToken:sourceAndCancelToken.cancelToken})
                    
                    try{
                         this.data = {
                            ...this.data,
                            repositories: res_graphql.data.data.REPOSITORY.repositoryCount,
                            users: res_graphql.data.data.USER.userCount,
                            issues: res_graphql.data.data.ISSUE.issueCount,
                        }
                    }catch(e) {
                        this.handleGraphqlError(res_graphql)
                    }
                   
                    let restParam = {
                        q: this.query,
                        page: 1,
                        per_page: 1
                    }
                    const res_rest_arr = await Promise.all([
                        authRequiredGet(
                            api.API_SEARCH(
                                {
                                    type: 'code',
                                    params: restParam
                                }
                            ),
                            {
                                headers: {"Accept": "application/vnd.github.mercy-preview+json"},
                                cancelToken:sourceAndCancelToken.cancelToken
                            }
                        ),
                        authRequiredGet(
                            api.API_SEARCH(
                                {
                                    type: 'commits',
                                    params: restParam
                                }
                            ),
                            {
                                headers: {"Accept": "application/vnd.github.cloak-preview"},
                                cancelToken:sourceAndCancelToken.cancelToken
                            }
                        ),
                        authRequiredGet(
                            api.API_SEARCH(
                                {
                                    type: 'topics',
                                    params: restParam
                                }
                            ),
                            {
                                headers: {"Accept": "application/vnd.github.mercy-preview+json"},
                                cancelToken:sourceAndCancelToken.cancelToken
                            }
                        )
                    ])

                    this.data = {
                       ...this.data,
                        code: res_rest_arr[0].data.total_count,
                        commits: res_rest_arr[1].data.total_count,
                        topics: res_rest_arr[2].data.total_count,
                    }
                }catch(e) {
                    console.log(e)
                }finally{
                    this.loading = false
                }   
            },
            search() {
                let path = `${this.$route.path}?q=${this.localSearchQuery}`
                if(!this.localSearchQuery || this.localSearchQuery.trim() === "") return
                if(this.$route.fullPath === path) return 
                this.$router.push({
                    path
                })
            },
        },
        components: {
            ComplexTopTab,
            Container: styled.div``,
            SearchInputWrapper: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
    .search-input::placeholder{
        color:#586069;
        opacity: 0.55;
    }
</style>