<template>
    <CommonLoadingWrapper class="p-3" :loading="loading">

        <div v-if="data.length > 0" class="d-flex">   
            <button class="btn mb-2" @click="() => showModal('selectTypeModal')" style="border-top-right-radius:0; border-bottom-right-radius:0;border-right: 0">
                <i>Type:</i>
                <span>{{$route.query.type || 'All'}}</span>   
                <span class="dropdown-caret"></span>
            </button>
            <IconSearchInput class="flex-grow-1" v-model="searchQuery" :search="routeWithSearchQuery"  :inputStyle="{borderTopLeftRadius:0, borderBottomLeftRadius:0,}"></IconSearchInput>
        </div>

       <div v-if="data.length > 0">
            <button class="btn mb-2 mr-2" @click="() => showModal('selectSortByModal')">
                <i>Sort by:</i>
                <span>{{$route.query.sort_by || 'Most downloads'}}</span>   
                <span class="dropdown-caret"></span>
            </button>
       </div>
        
        <!-- <FilterNotice class="border-bottom border-gray-light py-3">
            <router-link :to="$route.path" class="float-right issues-reset-query">
                <svg class="octicon octicon-x issues-reset-query-icon mt-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.72 3.72C3.86062 3.57955 4.05125 3.50066 4.25 3.50066C4.44875 3.50066 4.63937 3.57955 4.78 3.72L8 6.94L11.22 3.72C11.2887 3.64631 11.3715 3.58721 11.4635 3.54622C11.5555 3.50523 11.6548 3.48319 11.7555 3.48141C11.8562 3.47963 11.9562 3.49816 12.0496 3.53588C12.143 3.5736 12.2278 3.62974 12.299 3.70096C12.3703 3.77218 12.4264 3.85702 12.4641 3.9504C12.5018 4.04379 12.5204 4.14382 12.5186 4.24452C12.5168 4.34523 12.4948 4.44454 12.4538 4.53654C12.4128 4.62854 12.3537 4.71134 12.28 4.78L9.06 8L12.28 11.22C12.3537 11.2887 12.4128 11.3715 12.4538 11.4635C12.4948 11.5555 12.5168 11.6548 12.5186 11.7555C12.5204 11.8562 12.5018 11.9562 12.4641 12.0496C12.4264 12.143 12.3703 12.2278 12.299 12.299C12.2278 12.3703 12.143 12.4264 12.0496 12.4641C11.9562 12.5018 11.8562 12.5204 11.7555 12.5186C11.6548 12.5168 11.5555 12.4948 11.4635 12.4538C11.3715 12.4128 11.2887 12.3537 11.22 12.28L8 9.06L4.78 12.28C4.63782 12.4125 4.44977 12.4846 4.25547 12.4812C4.06117 12.4777 3.87579 12.399 3.73837 12.2616C3.60096 12.1242 3.52225 11.9388 3.51882 11.7445C3.51539 11.5502 3.58752 11.3622 3.72 11.22L6.94 8L3.72 4.78C3.57955 4.63938 3.50066 4.44875 3.50066 4.25C3.50066 4.05125 3.57955 3.86063 3.72 3.72Z"></path></svg>
                Clear filter
            </router-link>
            <div class="flex-auto min-width-0" v-html="filterNoticeHTML"></div>
        </FilterNotice> -->

        <transition-group name="fade-group" appear>
            <PackgaeListItem class="mt-3" v-for="item in data.filter(i => (type == 'all' || i.packageType.toLowerCase() == type.toLowerCase()) && (!query || i.name.toLowerCase().indexOf(query.toLowerCase()) > -1))" :key="item.name" :thePackage="item"></PackgaeListItem>
        </transition-group>

        <SimplePagination v-if="pageInfo.withNext || pageInfo.withPrev" :withNext="pageInfo.withNext" :withPrev="pageInfo.withPrev"></SimplePagination>

        <EmptyNotice class="p-7 blankslate Box mt-4" v-if="emptyFlag">
            <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 39.89 40.18" height="56" width="56"><title>GitHub Package Registry Icon</title><polygon class="cls-1" points="19.59 20.19 11.1 25.1 11.1 15.27 19.61 10.36 19.59 20.19"></polygon><path class="cls-2" d="M34.16,31.34a1,1,0,0,1-.5-.14l-8.52-4.88a1,1,0,0,1,1-1.73l8.52,4.88A1,1,0,0,1,35,30.83,1,1,0,0,1,34.16,31.34Z" transform="translate(-5.57 -5.45)"></path><path class="cls-2" d="M25.64,26.46h0a1,1,0,0,1-1-1L24.7,16a1,1,0,0,1,1-1,1,1,0,0,1,1,1l-.06,9.45A1,1,0,0,1,25.64,26.46Z" transform="translate(-5.57 -5.45)"></path><path class="cls-2" d="M17.37,31.19a1,1,0,0,1-.5-1.87l8.27-4.73a1,1,0,1,1,1,1.73l-8.27,4.74A1,1,0,0,1,17.37,31.19Z" transform="translate(-5.57 -5.45)"></path><path class="cls-2" d="M25.66,36.28a1,1,0,0,1-.5-.13l-8.51-4.92a1,1,0,0,1-.5-.86V20.54a1,1,0,0,1,.5-.87l8.51-4.91a1,1,0,0,1,1,0l8.51,4.91a1,1,0,0,1,.5.87v9.83a1,1,0,0,1-.5.86l-8.51,4.92A1,1,0,0,1,25.66,36.28Zm-7.51-6.49,7.51,4.34,7.51-4.34V21.11l-7.51-4.33-7.51,4.33Z" transform="translate(-5.57 -5.45)"></path><path class="cls-2" d="M34.23,13.28a2.65,2.65,0,1,1,2.65-2.65A2.65,2.65,0,0,1,34.23,13.28Zm0-3.3a.65.65,0,1,0,.65.65A.65.65,0,0,0,34.23,10Z" transform="translate(-5.57 -5.45)"></path><path class="cls-2" d="M16.66,13.28a2.65,2.65,0,1,1,2.65-2.65A2.65,2.65,0,0,1,16.66,13.28Zm0-3.3a.65.65,0,1,0,.65.65A.65.65,0,0,0,16.66,10Z" transform="translate(-5.57 -5.45)"></path><path class="cls-2" d="M34.37,43.17A2.65,2.65,0,1,1,37,40.52,2.65,2.65,0,0,1,34.37,43.17Zm0-3.3a.65.65,0,1,0,.65.65A.66.66,0,0,0,34.37,39.87Z" transform="translate(-5.57 -5.45)"></path><path class="cls-2" d="M16.89,43a2.65,2.65,0,1,1,2.65-2.65A2.65,2.65,0,0,1,16.89,43Zm0-3.3a.65.65,0,1,0,.65.65A.65.65,0,0,0,16.89,39.69Z" transform="translate(-5.57 -5.45)"></path><path class="cls-2" d="M8.22,28.21a2.65,2.65,0,1,1,2.65-2.65A2.65,2.65,0,0,1,8.22,28.21Zm0-3.3a.65.65,0,1,0,.65.65A.65.65,0,0,0,8.22,24.91Z" transform="translate(-5.57 -5.45)"></path><path class="cls-2" d="M42.81,28.21a2.65,2.65,0,1,1,2.65-2.65A2.65,2.65,0,0,1,42.81,28.21Zm0-3.3a.65.65,0,1,0,.65.65A.65.65,0,0,0,42.81,24.91Z" transform="translate(-5.57 -5.45)"></path><path class="cls-3" d="M33.1,29.86" transform="translate(-5.57 -5.45)"></path><path class="cls-1" d="M28.11,41.86l-1.52.87V39a1,1,0,0,0-2,0v3.72L23,41.86a1,1,0,0,0-1.36.36A1,1,0,0,0,22,43.59l3.53,2,3.54-2a1,1,0,0,0,.36-1.37A1,1,0,0,0,28.11,41.86Z" transform="translate(-5.57 -5.45)"></path><path class="cls-1" d="M42,30.51a1,1,0,0,0-1,1v1.81l-3.34-1.94a1,1,0,0,0-1.37.37,1,1,0,0,0,.37,1.36L39.93,35l-1.49.86a1,1,0,0,0,.5,1.87,1,1,0,0,0,.5-.14l3.53-2V31.51A1,1,0,0,0,42,30.51Z" transform="translate(-5.57 -5.45)"></path><path class="cls-1" d="M39.44,13.45a1,1,0,0,0-1,1.74l1.49.85-3.5,2a1,1,0,0,0,.5,1.87,1,1,0,0,0,.5-.14L41,17.75v1.82a1,1,0,0,0,2,0V15.49Z" transform="translate(-5.57 -5.45)"></path><path class="cls-1" d="M29.11,7.49l-3.54-2L22,7.49a1,1,0,0,0,1,1.73l1.55-.89v3.34a1,1,0,0,0,2,0V8.34l1.52.88a1,1,0,0,0,.49.13,1,1,0,0,0,.51-1.86Z" transform="translate(-5.57 -5.45)"></path><path class="cls-1" d="M14.55,18l-3.36-2,1.52-.87a1,1,0,0,0-1-1.74l-3.53,2v4.08a1,1,0,0,0,2,0V17.78l3.36,2a1,1,0,0,0,1.37-.37A1,1,0,0,0,14.55,18Z" transform="translate(-5.57 -5.45)"></path><path class="cls-1" d="M13.34,31.45l-3.16,1.84V31.51a1,1,0,1,0-2,0v4.07l.37.22a1.35,1.35,0,0,0,.26.15l2.9,1.67a1,1,0,0,0,1-1.73L11.19,35l3.16-1.83a1,1,0,1,0-1-1.73Z" transform="translate(-5.57 -5.45)"></path></svg>
            <h3 class="mt-3 mb-1">Get started with GitHub Packages</h3>
            <p>
                With GitHub Packages you can safely publish and consume packages.
                <br>
                <HyperlinkWrapper>
                    <a href="https://help.github.com/articles/about-github-package-registry/">
                        Learn more
                    </a>
                </HyperlinkWrapper>
                about GitHub Packages
            </p>
        </EmptyNotice>

        <Modal title="Select type" ref="selectTypeModal">
            <router-link v-for="item in selectTypeModalRouterLinkData" :key="item.label" :to='item.routerLink'  @click.native.stop="() => closeModal('selectTypeModal')">
                <SelectMenuItem :selected="item.selected">
                    <span>{{item.label}}</span>    
                </SelectMenuItem>
            </router-link> 
        </Modal>

        <Modal title="Select sort view" ref="selectSortByModal">
            <router-link v-for="item in selectSortByModalRouterLinkData" :key="item.label" :to='item.routerLink'  @click.native.stop="() => closeModal('selectSortByModal')">
                <SelectMenuItem :selected="item.selected">
                    <span>{{item.label}}</span>    
                </SelectMenuItem>
            </router-link> 
        </Modal>

    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoadingWrapper,Modal,SelectMenuItem,IconSearchInput,SimplePagination,HyperlinkWrapper} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {authRequiredGet,authRequiredGitHubGraphqlApiQuery,commonGet} from '@/network'
    import {util_queryParse} from '@/util'
    import * as graphql from './graphql'
    import * as api from '@/network/api'
    import PackgaeListItem from './PackageListItem'
    let parse = require('parse-link-header');
    export default {
        name: 'organization_packages_page',
        mixins: [RouteUpdateAwareMixin],
        inject: ['loadingOrganizationBasicInfo'],
        data() {
            return {
                data: [],
                loading: false,
                pageInfo: {},
                searchQuery: '',
                emptyFlag: false
            }
        },
        computed: {
            organization() {
                return this.$route.params.organization
            },
            selectTypeModalRouterLinkData() {
                return [
                    {
                        routerLink: `${this.$route.path}?${util_queryParse.querify({
                            ...this.$route.query,
                            type: "all"
                        })}`,
                        label: "All",
                        selected: this.$route.query.type == 'all' || !this.$route.query.type
                    },
                    {
                        routerLink: `${this.$route.path}?${util_queryParse.querify({
                            ...this.$route.query,
                            type: "npm"
                        })}`,
                        label: "npm",
                        selected: this.$route.query.type == 'npm'
                    },
                    {
                        routerLink: `${this.$route.path}?${util_queryParse.querify({
                            ...this.$route.query,
                            type: "rubygems"
                        })}`,
                        label: "RubyGems",
                        selected: this.$route.query.type == 'rubygems'
                    },
                    {
                        routerLink: `${this.$route.path}?${util_queryParse.querify({
                            ...this.$route.query,
                            type: "maven"
                        })}`,
                        label: "Maven",
                        selected: this.$route.query.type == 'maven'
                    },
                    {
                        routerLink: `${this.$route.path}?${util_queryParse.querify({
                            ...this.$route.query,
                            type: "docker"
                        })}`,
                        label: "Docker",
                        selected: this.$route.query.type == 'docker'
                    },
                    {
                        routerLink: `${this.$route.path}?${util_queryParse.querify({
                            ...this.$route.query,
                            type: "nuget"
                        })}`,
                        label: "NuGet",
                        selected: this.$route.query.type == 'nuget'
                    },
                ]
            },
            selectSortByModalRouterLinkData() {
                return [
                    {
                        routerLink: `${this.$route.path}?${util_queryParse.querify({
                            ...this.$route.query,
                            sort_by: "most_downloads"
                        })}`,
                        label: "Most downloads",
                        selected: this.$route.query.sort_by == 'most_downloads' || !this.$route.query.sort_by
                    },
                    {
                        routerLink: `${this.$route.path}?${util_queryParse.querify({
                            ...this.$route.query,
                            sort_by: "least_downloads"
                        })}`,
                        label: "Least downloads",
                        selected: this.$route.query.sort_by == 'least_downloads'
                    }
                ]
            },
            sortBy() {
                return this.$route.query.sort_by || 'most_downloads'
            },
            query() {
                return this.$route.query.q
            },
            type() {
                return this.$route.query.type || 'all'
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            generateRouterMeta() {
                return this.organization
            },
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)

                    let packages = []
                    let pageInfo

                    while(!pageInfo || pageInfo.hasNextPage) {
                        pageInfo = {}
                        let res = await authRequiredGitHubGraphqlApiQuery(
                            graphql.ORG_PACKAGES,
                            {
                                variables: {
                                    login: this.organization,
                                    after: pageInfo.endCursor,
                                    packageType: this.packageType
                                },
                                cancelToken
                            }
                        )
                        try{
                            packages = packages.concat(res.data.data.organization.packages.nodes)
                            pageInfo = res.data.data.organization.packages.pageInfo
                        } catch(e) {
                            console.log(e)
                            throw(e)
                        }
                    }

                    if(this.$route.query.sort_by == 'least_downloads') {
                        packages.sort((a,b) => a.statistics.downloadsTotalCount - b.statistics.downloadsTotalCount)
                    } else {
                        packages.sort((a,b) => b.statistics.downloadsTotalCount - a.statistics.downloadsTotalCount)
                    }
                    
                    this.data = packages

                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            routeWithSearchQuery() {
                this.$router.push(`${this.$route.path}?${util_queryParse.querify({
                    ...this.$route.query,
                    q: this.searchQuery
                })}`)
            },
        },
        watch: {
            sortBy(newOne) {
                if(newOne == 'most_downloads') {
                    this.data.sort((a,b) => b.statistics.downloadsTotalCount - a.statistics.downloadsTotalCount)
                }
                if(newOne == 'least_downloads') {
                    this.data.sort((a,b) => a.statistics.downloadsTotalCount - b.statistics.downloadsTotalCount)
                }
            },
        },
        components: {
            PackgaeListItem,
            CommonLoadingWrapper,
            Modal,
            SelectMenuItem,
            IconSearchInput,
            HyperlinkWrapper,
            SimplePagination,
            SearchInput: styled.div``,
            Filters: styled.div``,
            FilterNotice: styled.div``,
            EmptyNotice: styled.div``,
            Guidance: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/dropdown/index.scss';
@import 'node_modules/@primer/css/blankslate/index.scss';
@import 'node_modules/@primer/css/box/index.scss';
.issues-reset-query-icon {
    width: 18px;
    height: 18px;
    padding: 1px;
    margin-right: 3px;
    color: #fff;
    text-align: center;
    background-color: #6a737d;
    border-radius: 3px;
}

.issues-reset-query {
    color: #586069;
}

.cls-1 {
    fill: #79b8ff;
}

.cls-2 {
    fill: #2088ff;
}
</style>