<template>
    <Container class="position-relative bg-white">
        <SearchInput v-if="!noData" class="position-relative m-3 flex-self-stretch">
            <input class="form-control input-contrast width-full" 
                    v-model="searchQuery"
                    @keydown.enter="search"
                    ref="input"
                    style="padding-left: 30px"
                    placeholder="Search all projects"
                    type="text">
            <svg class="search-icon text-gray-light" fill="currentColor" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M15.7 13.3l-3.81-3.83A5.93 5.93 0 0013 6c0-3.31-2.69-6-6-6S1 2.69 1 6s2.69 6 6 6c1.3 0 2.48-.41 3.47-1.11l3.83 3.81c.19.2.45.3.7.3.25 0 .52-.09.7-.3a.996.996 0 000-1.41v.01zM7 10.7c-2.59 0-4.7-2.11-4.7-4.7 0-2.59 2.11-4.7 4.7-4.7 2.59 0 4.7 2.11 4.7 4.7 0 2.59-2.11 4.7-4.7 4.7z"></path></svg>
        </SearchInput>

        <Title class="bg-gray p-3 title flex-justify-between text-normal" style="display:flex">
            <Statistic>
                <router-link class="link-gray mr-1" :to="`/${owner()}/${repo()}/projects?q=${'is:open ' + query.replace(/is:(open|closed)/g,'').trim()}`" :class="{active:query.indexOf('is:open') != -1}">
                        <svg class="v-align-text-bottom d-inline-block mr-1" fill="currentColor" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 00-1 1v14a1 1 0 001 1h13a1 1 0 001-1V1a1 1 0 00-1-1z"></path></svg>
                        <span>{{countInfoByState.totalCountOpen}}</span>
                        <span>Open</span>
                </router-link>&nbsp;

                <router-link class="link-gray" :to="`/${owner()}/${repo()}/projects?q=${'is:closed ' + query.replace(/is:(open|closed)/g,'').trim()}`" :class="{active:query.indexOf('is:closed') != -1}">
                        <svg class="octicon octicon-check" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                        <span>{{countInfoByState.totalCountClosed}}</span>
                        <span>Closed</span>
                </router-link>
            </Statistic>

            <Sort class="sort position-relative">
                <SortMenuBtn class="sort-menu-btn list-style-none relative" @click="triggerShowSortPopover">
                    Sort
                    <Popover class="project-sort-popover" ref="sortPopover" :popoverStyle="{right:'0px'}" :width="300">
                        <SortMenuHeader class="project-sort-menu-header">Sort by</SortMenuHeader>    
                        <SortMenuBody>
                            <router-link v-for="item in sortModalRouterLink" :key="item.label" :to='item.routerLink'>
                                <SelectMenuItem :selected="query.indexOf(item.queryFragment) > -1" style="padding: 8px;font-size: 12px;">
                                    <span>{{item.label}}</span>    
                                </SelectMenuItem>
                            </router-link> 
                        </SortMenuBody> 
                    </Popover> 
                </SortMenuBtn>
            </Sort>
        </Title>   
                
        <transition-group name="fade" appear>
            <ProjectListItem v-for="item in data" class="project-item" :key="item.id" :project="item"/>
        </transition-group>

        <LoadMore v-if="pageInfo.hasNextPage" @click="() => network_getData(true)" :class="{'text-gray':loadingMore}" class="text-center p-3 text-blue">
        {{loadingMore ? 'Loading...' : 'Load more...'}}
        </LoadMore>
        
        <transition name="fade" appear>
            <EmptyNotice v-if="noData" class="empty-notice py-5 px-3 bg-white">
                <EmptyTitle class="f1 mb-2">
                    Organize your issues with project boards
                </EmptyTitle>
                <p>
                    Did you know you can manage projects in the same place you keep your code? Set up a project board on GitHub to streamline and automate your workflow.
                </p>
                <div class="col-lg-4 col-md-5 col-sm-12 float-left text-lg-right text-md-right text-sm-left py-3">
                    <a href="https://help.github.com/articles/about-project-boards" class="btn btn-primary btn-outline">Learn More</a>
                </div>
            </EmptyNotice>
        </transition>  

         <transition name="fade" appear>
            <CommonLoading v-if="loading || countInfoByState.loading"
                            :preventClickEvent="false"
                            :position="loading ? 'center' : 'corner'"/>
        </transition>  
       
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import { mapState,mapActions, mapMutations } from 'vuex'
    import {WithRandomMetaMixin} from '@/mixins'
    import {RepositoryTabViewMixin} from '../components'
    import {AnimatedHeightWrapper,
            AnimatedWidthWrapper,
            LoadingAndCatchErrorTemplate,
            ComplexBubble,
            CommonLoading,
            Popover,
            SelectMenuItem} from '@/components'
    import {ACTION_REPOSITORY_REQUEST_PROJECTS_DATA} from '@/store/modules/repository/actionTypes'
    import {MUTATION_REPOSITORY_SYNC_SEARCH_PROJECTS_QUERY} from '@/store/modules/repository/mutationTypes'
    import { util_dateFormat } from '@/util'
    import ProjectListItem from './ProjectListItem'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import { cancelAndUpdateAxiosCancelTokenSource,authRequiredGitHubGraphqlApiQuery } from '@/network'
    import * as graphql from './graphql'
    export default {
        name: 'repository_project_page',
        mixins: [WithRandomMetaMixin,RepositoryTabViewMixin,RouteUpdateAwareMixin],
        data() {
            return {
                loadingMore: false,
                searchQuery: '',
                totalCountOpen: 0,
                totalCountClosed: 0,
                data: [],
                noData: false,
                loading: false,
                perPage: 10,
                currentPage: 1,
                pageInfo: {
                    hasNextPage: false,
                    hasPreviousPage: false,
                    startCursor: undefined,
                    endCursor: undefined
                },
                countInfoByState: {
                    totalCountOpen: 0,
                    totalCountClosed: 0,
                    loading: false
                },
            }
        },
        inject: ['owner','repo'],
        computed: {
            query() {
                let query = this.$route.query.q || `is:open`
                this.searchQuery = query
                return query
            },
            sortModalRouterLink() {
                return [
                    {
                        routerLink: `/${this.owner()}/${this.repo()}/projects?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:created-desc',
                        label: 'Newest',
                        queryFragment: 'sort:created-desc'
                    },
                    {
                        routerLink: `/${this.owner()}/${this.repo()}/projects?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:created-asc',
                        label: 'Oldest',
                        queryFragment: 'sort:created-asc'
                    },
                    {
                        routerLink: `/${this.owner()}/${this.repo()}/projects?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:updated-desc',
                        label: 'Recently updated',
                        queryFragment: 'sort:updated-desc'
                    },
                    {
                        routerLink: `/${this.owner()}/${this.repo()}/projects?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:updated-asc',
                        label: 'Least recently updated',
                        queryFragment: 'sort:updated-asc'
                    },
                    {
                        routerLink: `/${this.owner()}/${this.repo()}/projects?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:name-asc',
                        label: 'Name',
                        queryFragment: 'sort:name-asc'
                    },
                ]
            },
        },
        created() {
            this.network_getData()
        },
        methods: {
            triggerShowSortPopover() {
                this.$refs.sortPopover.show = !this.$refs.sortPopover.show
            },
            search() {
                this.$router.push(`/${this.owner()}/${this.repo()}/projects?q=${this.searchQuery}`)
            },
            async network_getData(getMoreDataFlag = false) {
                if(getMoreDataFlag && this.loadingMore) return
                try{
                    if(getMoreDataFlag){
                        this.loadingMore = true
                    }else{
                        this.loading = true
                    }
                    
                    if(!getMoreDataFlag) this.network_getCountInfoByState()
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name)
                    this.cancelSources.push(sourceAndCancelToken.source)
                    const graphql_projects = graphql.GRAPHQL_REPOSITORY_PROJECTS({
                        owner:this.owner(),
                        repo: this.repo(),
                        query: this.query,
                        perPage: this.perPage,
                        after: this.pageInfo.endCursor,
                        getMoreData: getMoreDataFlag
                    })
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_projects,{cancelToken:sourceAndCancelToken.cancelToken})
                    if(getMoreDataFlag) {
                        this.data = this.data.concat(res.data.data.repository.projects.nodes)
                    }else {
                        this.data = res.data.data.repository.projects.nodes
                    }
                    this.pageInfo = res.data.data.repository.projects.pageInfo

                    if(getMoreDataFlag){
                        this.loadingMore = false
                    }else{
                        this.loading = false
                    }
                }catch(e){
                    console.log(e)
                     if(getMoreDataFlag){
                        this.loadingMore = false
                    }else{
                        this.loading = false
                    }
                }
            },
            async network_getCountInfoByState() {
                try{
                    this.countInfoByState.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name + ' get_count_info_by_state')
                    this.cancelSources.push(sourceAndCancelToken.source)

                    const graphql_countInfoByState = graphql.GRAPHQL_REPOSITORY_PROJECTS_COUNT_BY_STATE({
                        owner:this.owner(),
                        repo: this.repo(),
                        query: this.query
                    })
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_countInfoByState,{cancelToken:sourceAndCancelToken.cancelToken})

                    this.countInfoByState.totalCountOpen = res.data.data.repository.totalCountOpen.totalCount
                    this.countInfoByState.totalCountClosed = res.data.data.repository.totalCountClosed.totalCount
                    this.noData = res.data.data.repository.totalCountOpenWithoutSearchQuery.totalCount === 0 ? true : false

                    this.countInfoByState.loading = false
                }catch(e){
                    console.log(e)
                    this.countInfoByState.loading = false
                }
            }
        },
        components: {
            AnimatedHeightWrapper,
            ComplexBubble,
            SelectMenuItem,
            ProjectListItem,
            CommonLoading,
            Popover,
            Container: styled.div``,
            SearchInput: styled.div``,
            Title: styled.div``,
            Statistic: styled.div``,
            OpenTab: styled.span``,
            ClosedTab: styled.span``,
            Sort: styled.div``,
            SortMenuBtn: styled.div``,
            SortMenu: styled.div``,
            SortMenuHeader: styled.div``,
            SortMenuBody: styled.div``,
            SortMenuItem: styled.div``,
            LoadMore: styled.div``,
            EmptyNotice: styled.div``,
            EmptyTitle: styled.p``,
        }
    }
</script>

<style lang="scss">
.project-sort-menu-header{
    padding: 8px 10px;
    line-height: 16px;
    background: #f6f8fa;
    border-bottom: 1px solid #e1e4e8;
    font-size: 12px;
    font-weight: 600;
    color: #24292e;
}
</style>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
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

.active{
    font-weight: 600;
}

.title{
    padding: 16px;
    margin: -1px -1px 0;
    background-color: #f6f8fa;
    border: 1px solid #d1d5da;
    border-left-width: 0;
    border-right-width: 0;
    border-radius: 0;
}

.border-none{
    border-color: transparent!important;
}


.sort .sort-menu-btn:after {
    display: inline-block;
    width: 0;
    height: 0;
    vertical-align: -2px;
    content: "";
    border: 4px solid transparent;
    border-top-color: currentcolor;
}


.project-item:last-child{
    border-bottom: none;
}

.empty-notice{
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
}
</style>