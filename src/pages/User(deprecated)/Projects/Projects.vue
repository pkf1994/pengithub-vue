<template>
    <Container class="position-relative">
         <SearchInput v-if="firstLoadedFlag" class="position-relative my-3 flex-self-stretch">
            <input class="form-control input-contrast width-full" 
                    v-model="searchQuery"
                    @keydown.enter="search"
                    ref="input"
                    style="padding-left: 30px"
                    placeholder="Search all projects"
                    type="text">
            <svg class="search-icon text-gray-light" fill="currentColor" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M15.7 13.3l-3.81-3.83A5.93 5.93 0 0013 6c0-3.31-2.69-6-6-6S1 2.69 1 6s2.69 6 6 6c1.3 0 2.48-.41 3.47-1.11l3.83 3.81c.19.2.45.3.7.3.25 0 .52-.09.7-.3a.996.996 0 000-1.41v.01zM7 10.7c-2.59 0-4.7-2.11-4.7-4.7 0-2.59 2.11-4.7 4.7-4.7 2.59 0 4.7 2.11 4.7 4.7 0 2.59-2.11 4.7-4.7 4.7z"></path></svg>
        </SearchInput>

        <ProjectsBox  v-if="firstLoadedFlag" class="container-lg clearfix border rounded-1">
            <FilterRow class="bg-gray p-3 border-bottom">
                <FilterSortBtn class="float-right px-3 btn-link select-menu-button icon-only link-gray" @click="() => openModal('sortModal')">
                    Sort
                </FilterSortBtn>

                <FilterByState>
                     <router-link class="link-gray mr-1" :to="routerWithStateOpen" :class="{active:states == undefined || states == 'OPEN'}">
                        <svg class="v-align-text-bottom d-inline-block mr-1" fill="currentColor" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 00-1 1v14a1 1 0 001 1h13a1 1 0 001-1V1a1 1 0 00-1-1z"></path></svg>
                        <span>{{countByState.open}}</span>
                        <span>Open</span>
                    </router-link>&nbsp;

                    <router-link class="link-gray" :to="routerWithStateClosed" :class="{active:states == 'CLOSED'}">
                            <svg class="octicon octicon-check" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                            <span>{{countByState.closed}}</span>
                            <span>Closed</span>
                    </router-link>
                </FilterByState>
            </FilterRow>

            <transition-group name="fade-group" appear>
                <ProjectListItem v-for="item in data" :key="item.id" :project="item"></ProjectListItem>
            </transition-group>

            <LoadMore v-if="pageInfo.hasNextPage" @click="() => network_getData(true)" :class="{'text-gray':loadingMore}" class="text-center p-3 text-blue">
                {{loadingMore ? 'Loading...' : 'Load more...'}}
            </LoadMore>

            <EmptyNotice v-if="!loading && totalCount == 0" class="blankslate border-0">
                <h3 v-if="countByState.open == 0 && countByState.closed == 0">
                    {{login}} dosen't have any projects yet.
                </h3>
                <h3 v-else>
                    There are no projects matching your search.
                </h3>
            </EmptyNotice>
        </ProjectsBox>

         <LoadingWrapper  class="loading-wrapper">
            <div v-if="loading && !loadingUserBasicInfoProvided()" class="inner d-flex flex-items-center flex-justify-center">
                <LoadingIcon></LoadingIcon>
            </div>
        </LoadingWrapper>

         <Modal title="Sort by" ref="sortModal">
            <router-link v-for="item in sortModalRouterLink" :key="item.label" :to='item.routerLink'>
                <SelectMenuItem :selected="item.selected" @click.native="closeModal">
                    <span>{{item.label}}</span>    
                </SelectMenuItem>
            </router-link> 
        </Modal>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {LoadingIcon,Modal,SelectMenuItem,AnimatedHeightWrapper,LoadingIconEx} from '@/components'
    import * as graphql from './graphql'
    import * as api from '@/network/api'
    import ProjectListItem from './ProjectListItem'
    import {authRequiredGitHubGraphqlApiQuery,authRequiredGet,commonGet} from '@/network' 
    import {util_queryParse} from '@/util'
    export default {
        name: 'user_projects_page',
        mixins: [RouteUpdateAwareMixin],
        inject: ['loadingUserBasicInfoProvided'],
        data() {
            return {
                searchQuery: '',
                data: [],
                loading: false,
                loadingMore: false,
                perPage: 20,
                totalCount: 0,
                pageInfo: {
                },
                firstLoadedFlag: false,
                countByState: {
                    open: 0,
                    closed: 0
                }
            }
        },
        computed: {
            login() {
                return this.$route.params.login
            },
            states() {
                return this.$route.query.states
            },
            query() {
                this.searchQuery = this.$route.query.query
                return this.$route.query.query
            },
            order() {
                return this.$route.query.order
            },
            sort() {
                return this.$route.query.sort
            },
            sortModalRouterLink() {
                return [
                    {
                        routerLink: `${this.$route.path}?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                sort: 'CREATED_AT',
                                order: 'DESC'
                            })
                        }`,
                        label: 'Newest',
                        selected: this.$route.query.sort == 'CREATED_AT' && this.$route.query.order == 'DESC'
                    },
                    {
                         routerLink: `${this.$route.path}?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                sort: 'CREATED_AT',
                                order: 'ASC'
                            })
                        }`,
                        label: 'Oldest',
                        selected: this.$route.query.sort == 'CREATED_AT' && this.$route.query.order == 'ASC'
                    },
                    {
                         routerLink: `${this.$route.path}?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                sort: 'UPDATED_AT',
                                order: 'DESC'
                            })
                        }`,
                        label: 'Recently updated',
                        selected: this.$route.query.sort == 'UPDATED_AT' && this.$route.query.order == 'DESC'
                    },
                     {
                         routerLink: `${this.$route.path}?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                sort: 'UPDATED_AT',
                                order: 'ASC'
                            })
                        }`,
                        label: 'Least recently updated',
                        selected: this.$route.query.sort == 'UPDATED_AT' && this.$route.query.order == 'ASC'
                    },
                     {
                         routerLink: `${this.$route.path}?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                sort: 'NAME',
                                order: 'ASC'
                            })
                        }`,
                        label: 'Name',
                        selected: this.$route.query.sort == 'NAME' && this.$route.query.order == 'ASC'
                    },
                ]
            },
            routerWithStateOpen() {
                return `${this.$route.path}?${
                    util_queryParse.querify({
                        ...this.$route.query,
                        states:'OPEN'
                    })
                }`
            },
            routerWithStateClosed() {
                return `${this.$route.path}?${
                    util_queryParse.querify({
                        ...this.$route.query,
                        states:'CLOSED'
                    })
                }`
            },
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData(loadingMoreFlag) {
                try{
                    if(loadingMoreFlag) {
                        this.loadingMore = true
                    }else{
                        this.loading = true
                    }
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)

                    let graphql_projects = graphql.GRAPHQL_USER_PROJECTS({
                        search: this.query || '',
                        perPage: this.perPage,
                        login: this.login,
                        states: this.states,
                        after: loadingMoreFlag && this.pageInfo.endCursor,
                        orderBy: {
                            direction: this.order,
                            field: this.sort
                        },
                        sort: this.sort
                    })
                    let res_graphql = await authRequiredGitHubGraphqlApiQuery(graphql_projects,{cancelToken})

                    try{
                        if(loadingMoreFlag) {
                            this.data = this.data.concat(res_graphql.data.data.user.projects.nodes)
                        }else{
                            this.data = res_graphql.data.data.user.projects.nodes
                        }
                        this.pageInfo = res_graphql.data.data.user.projects.pageInfo
                        this.totalCount = res_graphql.data.data.user.projects.totalCount

                        this.countByState.open = res_graphql.data.data.user.openProjectCount.totalCount
                        this.countByState.closed = res_graphql.data.data.user.closedProjectCount.totalCount
                    }catch(e) {
                        this.handleGraphqlError(res_graphql)
                    }
                    
                    this.firstLoadedFlag = true
                }catch(e) {
                    this.handleError(e)
                }finally{
                    if(loadingMoreFlag) {
                        this.loadingMore = false
                    }else{
                        this.loading = false
                    }
                }
            },
            search() {
                this.$router.push(`${this.$route.path}?query=${this.searchQuery}`)
            },
            openModal(ref) {
                this.$refs[ref].show = true
            },
            closeModal() {
                for(let key in this.$refs){
                    if(this.$refs[key].show) this.$refs[key].show = false
                }
            },
        },
        components: {
            LoadingIcon,
            Modal,
            SelectMenuItem,
            AnimatedHeightWrapper,
            LoadingIconEx,
            ProjectListItem,
            Container: styled.div``,
            SearchInput: styled.div``,
            LoadingWrapper: styled.div``,
            FilterRow: styled.div``,
            FilterSortBtn: styled.div``,
            FilterByState: styled.div``,
            ClearFilterRow: styled.div``,
            ProjectsBox: styled.div``,
            EmptyNotice: styled.div``,
            LoadMore: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/layout/index.scss';
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

.search-icon{
    top: 10px;
    font-size: 14px;
    color: #bbb;
    text-align: center;
    position: absolute;
    left: 10px;
    z-index: 5;
    width: 16px;
    height: 16px;
    vertical-align: text-bottom;
}

.select-menu-button:after {
    display: inline-block;
    width: 0;
    height: 0;
    vertical-align: -2px;
    content: "";
    border: 4px solid transparent;
    border-top-color: currentcolor;
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

.active{
    font-weight: 600;
}

.blankslate {
    border-radius: 0 0 3px 3px;
    padding: 32px;
    text-align: center;
}
</style>