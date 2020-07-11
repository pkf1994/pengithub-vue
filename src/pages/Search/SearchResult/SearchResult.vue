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
    import {commonGet, authRequiredGet} from '@/network'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import Vue from 'vue'
    export default {
        mixins: [WithSearchInputMixin,RouteUpdateAwareMixin],
        name: 'search_result_page',
        data() {
            return {
                searchResultCount: {
                    repositories: '',
                    users: '',
                    issues: '',
                    code: '',
                    commits: '',
                    topics: '',
                },
                loading: false,
                cachedRouteQuery: {}
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
                        meta: this.searchResultCount.repositories,
                        active: this.$route.path == '/search'
                    },
                    {
                        to: this.cachedRouteQuery['/search/code'] || `/search/code?q=${this.query}`,
                        label: 'Code',
                        meta: this.searchResultCount.code,
                        active: this.$route.path == '/search/code'
                    },
                    {
                        to: this.cachedRouteQuery['/search/commits'] || `/search/commits?q=${this.query}`,
                        label: 'Commits',
                        meta: this.searchResultCount.commits,
                        active: this.$route.path == '/search/commits'
                    },
                    {
                        to: this.cachedRouteQuery['/search/issues'] || `/search/issues?q=${this.query}`,
                        label: 'Issues',
                        meta: this.searchResultCount.issues,
                        active: this.$route.path == '/search/issues'
                    },
                    {
                        to: this.cachedRouteQuery['/search/users'] || `/search/users?q=${this.query}`,
                        label: 'Users',
                        meta: this.searchResultCount.users,
                        active: this.$route.path == '/search/users'
                    },
                    {
                        to: this.cachedRouteQuery['/search/topics'] || `/search/topics?q=${this.query}`,
                        label: 'Topics',
                        meta: this.searchResultCount.topics,
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
            this.network_getData()
        },
        methods: {
            async network_getData() {
                let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_search_result_count')
                for(let tabItem in this.searchResultCount) {
                    if(tabItem == 'code' && !this.accessToken) continue
                    let url = api.API_SEARCH({
                        type: tabItem,
                        params: {
                            per_page: 1,
                            q: this.query
                        }
                    })
                    authRequiredGet(
                        url,
                        {
                            cancelToken,
                            headers: {
                                "Accept": "application/vnd.github.mercy-preview+json,application/vnd.github.cloak-preview,*"
                            }
                        }
                        ).then(res => {
                        this.searchResultCount[tabItem] = util_numberFormat.thousands2K2M(res.data.total_count,0)
                    })
                }
            },
            parseSearchResultCount(HTML) {
                let searchResultCountPattern = /<span[^>]*data-search-type="(.*)">(.*)<\/span>/g
                let searchResultCountExecResult
                if((searchResultCountExecResult = searchResultCountPattern.exec(HTML)) != null) {
                    this.searchResultCount[searchResultCountExecResult[1]] = searchResultCountExecResult[2]
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