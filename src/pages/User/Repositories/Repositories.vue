<template>
    <Container class="position-relative">
        
        <transition name="fade" appear>
            <input v-if="firstLoadedFlag" v-model="searchQuery" class="form-control width-full my-3" placeholder="Find a repository…" autocomplete="off">
        </transition>

        <transition name="fade" appear>
            <FilterRow v-if="firstLoadedFlag" class="border-bottom pb-3">
                <button class="btn mr-1" @click="() => openModal('selectTypeModal')">
                    <i>Type:</i>
                    <span>{{type || 'All' | capitalize}}</span>
                    <span class="dropdown-caret"></span>
                </button>  

                <button class="btn" @click="() => openModal('selectLanguageModal')">
                    <i>Language:</i>
                    <span>{{language || 'All'}}</span>
                    <span class="dropdown-caret"></span>
                </button>  
            </FilterRow>
        </transition>

        <AnimatedHeightWrapper>
            <ClearFilterRow v-if="firstLoadedFlag && (type || language) && !loading" class="d-flex flex-justify-between border-bottom border-gray-light py-3">
                <div class="user-repo-search-results-summary">
                    <strong>{{totalCount}}</strong>
                    {{data.length > 1 ? 'results' : 'result'}} for 
                    <strong v-if="type">{{type}}</strong>
                    <span v-if="type">repositories</span>
                    <span v-if="language">written in</span>
                    <strong v-if="language">{{language}}</strong>
                </div>

                <div class="text-right v-align-top flex-shrink-0">
                    <router-link :to="`${$route.path}`" class="text-normal d-inline-block ml-3" style="color: #586069;">
                        <svg class="octicon octicon-x issues-reset-query-icon mt-1" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
                        Clear filter
                    </router-link>      
                </div>
            </ClearFilterRow>
        </AnimatedHeightWrapper>

        <transition-group name="fade-group" appear>
            <RepoListItem v-for="item in data" :key="item.id" :repository="item"></RepoListItem>
        </transition-group>

        <Pagination class="paginate-container" v-if="data.length > 0 && (pageInfo.prev || pageInfo.next)">
            <div class="BtnGroup">
                <button class="btn btn-outline BtnGroup-item" :disabled="!pageInfo.prev || loading" @click="() => changePage(true)">Previous</button>
                <button class="btn btn-outline BtnGroup-item" :disabled="!pageInfo.next || loading"  @click="() => changePage(false)">Next</button>
            </div> 
        </Pagination>

        <LoadingWrapper  class="loading-wrapper">
            <div v-if="loading && !loadingUserBasicInfoProvided()" class="inner d-flex flex-items-center flex-justify-center">
                <LoadingIcon></LoadingIcon>
            </div>
        </LoadingWrapper>

        <Modal title="Select type" ref="selectTypeModal">
            <router-link v-for="item in sortModalRouterLink" :key="item.label" :to='item.routerLink'>
                <SelectMenuItem :selected="type == item.meta" @click.native="closeModal">
                    <span>{{item.label}}</span>    
                </SelectMenuItem>
            </router-link> 
        </Modal>

        <Modal ref="selectLanguageModal" title="Select language" :modalStyle="{height:'80vh'}" @show="network_getAvailableLanguage">
             <div v-if="availableLanguage.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <div v-else class="select-menu-text-filter p-3">
                <input type="text" v-model="availableLanguage.searchQuery" class="form-control" placeholder="Filter spoken languages" autofocus="" autocomplete="off"/>
            </div>
            <router-link v-if="language" :to="`${$route.path}${type ? '?type=' + type : '' }`">
                <SelectMenuItem>
                    <template v-slot:icon>
                        <svg height="16" class="octicon octicon-x select-menu-item-icon mr-2" class_names="select-menu-item-icon" viewBox="0 0 12 16" version="1.1" width="12" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
                    </template>
                    <span>Clear language</span>    
                </SelectMenuItem>
            </router-link> 
            <transition-group name="fade-group" appear>
                <!-- <router-link class="d-block" v-for="item in availableLanguage.data" :key="item.urlParam" :to='item.to'>
                   
                </router-link>  -->
                 <SelectMenuItem @click.native="() => routerWithLanguage(item.urlParam)" v-for="item in filterAvailableLanguage" :key="item.urlParam" :selected="language == item.name">
                    <span>{{item.name}}</span>    
                </SelectMenuItem>
            </transition-group>
        </Modal>

    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {LoadingIcon,Modal,SelectMenuItem,AnimatedHeightWrapper,LoadingIconEx} from '@/components'
    import RepoListItem from './RepoListItem'
    import * as graphql from './graphql'
    import * as api from '@/network/api'
    import {authRequiredGitHubGraphqlApiQuery,authRequiredGet,commonGet} from '@/network' 
    import {util_queryParse} from '@/util'
    var parse = require('parse-link-header');
    export default {
        name: 'user_repositories_page',
        mixins: [RouteUpdateAwareMixin],
        inject: ['loadingUserBasicInfoProvided'],
        provide() {
            return {
                extraDataProvided: () => this.extraData.data
            }
        },
        data() {
            return {
                searchQuery: '',
                data: [],
                loading: false,
                perPage: 30,
                totalCount: 0,
                pageInfo: {
                },
                extraData: {
                    data: [],
                    loading: false
                },
                firstLoadedFlag: false,
                availableLanguage: {
                    searchQuery: '',
                    data: [],
                    loading: false
                }
            }
        },
        computed: {
            login() {
                return this.$route.params.login
            },
            type() {
                return this.$route.query.type
            },
            page() {
                return this.$route.query.page
            },
            typeQueryFragment() {
                let type = this.$route.query.type
                if(type == 'forks') return 'fork:only'
                if(type == 'all') return 'fork:true'
                if(type == 'sources') return ''
                if(type == 'archived') return 'archived:true'
                if(type == 'mirrors') return 'mirrors:true'
                return 'fork:true'
            },
            language() {
                return this.$route.query.language
            },
            sortModalRouterLink() {
                return [
                    {
                        routerLink: `/${this.login}/repositories?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                type: 'all',
                            })
                        }`,
                        label: 'All',
                    },
                    {
                        routerLink: `/${this.login}/repositories?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                type: 'sources'
                            })
                        }`,
                        label: 'Sources',
                        meta: 'sources',
                    },
                    {
                        routerLink: `/${this.login}/repositories?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                type: 'forks'
                            })
                        }`,
                        label: 'Forks',
                        meta: 'forks',
                    },
                    {
                        routerLink: `/${this.login}/repositories?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                type: 'archived'
                            })
                        }`,
                        label: 'Archived',
                        meta: 'archived',
                    },
                    {
                        routerLink: `/${this.login}/repositories?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                type: 'mirrors'
                            })
                        }`,
                        label: 'Mirrors',
                        meta: 'mirrors',
                    },
                ]
            },
            filterAvailableLanguage() {
                return this.availableLanguage.data.filter(i => (i.name.toLowerCase().indexOf(this.availableLanguage.searchQuery.toLowerCase()) != -1 || i.urlParam.toLowerCase().indexOf(this.availableLanguage.searchQuery.toLowerCase()) != -1))
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_SEARCH(
                        {
                            type: 'repositories',
                            params: {
                                q: `user:${this.login} ${this.language ? 'language:' + this.language + ' ' : ''}${this.typeQueryFragment}`.trim(),
                                per_page: this.perPage,
                                page: this.page,
                                sort: 'updated'
                            }
                        }
                    )
                    let res_rest = await authRequiredGet(url,{
                        cancelToken,
                        headers: {
                            'Accept': 'application/vnd.github.mercy-preview+json'
                        }
                    })

                    this.data = res_rest.data.items
                    this.totalCount = res_rest.data.total_count
                    this.pageInfo = parse(res_rest.headers.link) || {}
                    this.firstLoadedFlag = true

                    if(this.accessToken) this.network_getExtraData()
                    
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            async network_getExtraData() {
                 try{
                    this.extraData.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_extra_data')

                    let graphql_extraData = graphql.GRAPHQL_USER_REPOSITORY_EXTRA(this.data)
                    let res_graphql = await authRequiredGitHubGraphqlApiQuery(graphql_extraData,{cancelToken})
                    
                    let dataHolder
                    try{
                        dataHolder = res_graphql.data.data
                    }catch(e) {
                        this.handleGraphqlError(res_graphql)
                    }
                    let extraData = []
                    for(let key in dataHolder) {
                        extraData.push(dataHolder[key])
                    }

                    this.extraData.data = extraData
                    
                }catch(e) {
                    console.log(e)
                }finally{
                    this.extraData.loading = false
                }
            },
            async network_getAvailableLanguage() {
                if(this.availableLanguage.loading || this.availableLanguage.data.length > 0) return 
                try{
                    this.availableLanguage.loading = true
                    let url = api.API_ALL_LANGUAGE
                    let res = await commonGet(url)
                    this.availableLanguage.data = res.data
                }catch(e) {
                    console.log(e)
                }finally{
                    this.availableLanguage.loading = false
                }
            },
            changePage(goPrevPageFlag) {
                let queryStr = util_queryParse.querify({
                    ...this.$route.query,
                    page: goPrevPageFlag ? this.page - 1 : (this.page ? parseInt(this.page) + 1 : 2)
                })
                //console.log(`/${this.login}/repositories?${queryStr}`)
                this.$router.push(`/${this.login}/repositories?${queryStr}`)
            },
            openModal(ref) {
                this.$refs[ref].show = true
            },
            closeModal() {
                for(let key in this.$refs){
                    if(this.$refs[key].show) this.$refs[key].show = false
                }
            },
            routerWithLanguage(language) {
                this.closeModal()
                this.$router.push(`${this.$route.path}?` + util_queryParse.querify({
                    ...this.$route.query,
                    language:language
                }))
            }
        },
        components: {
            RepoListItem,
            LoadingIcon,
            Modal,
            SelectMenuItem,
            AnimatedHeightWrapper,
            LoadingIconEx,
            Container: styled.div``,
            LoadingWrapper: styled.div``,
            FilterRow: styled.div``,
            ClearFilterRow: styled.div``,
            Pagination: styled.div``,
            LoginNecessaryNotice: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
.loading-wrapper{
    pointer-events: none;
    position:absolute;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    .inner{
        position:sticky;
        height:150px;
        top: calc(50% - 75px);
    }
}
.user-repo-search-results-summary {
    white-space: normal;
}

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

.paginate-container {
    margin-top: 20px;
    margin-bottom: 15px;
    text-align: center;
}

.select-menu-text-filter{
    position: sticky;
    top: 0px;
    background-color: #f6f8fa;
    border-bottom: 1px solid #dfe2e5;
    input {
        display: block;
        width: 100%;
        max-width: 100%;
        padding: 5px;
        border: 1px solid #dfe2e5;
        border-radius: 3px;
    }
}
</style>