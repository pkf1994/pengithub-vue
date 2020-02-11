<template>
    <Container class="position-relative px-3">
        <SearchInput v-if="!empty" class="position-relative my-3 flex-self-stretch">
            <input class="form-control form-control input-contrast width-full" 
                    v-model="searchQuery"
                    ref="input"
                    style="padding-left: 30px"
                    placeholder="Search all projects"
                    type="text">
            <svg class="search-icon text-gray-light" fill="currentColor" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M15.7 13.3l-3.81-3.83A5.93 5.93 0 0013 6c0-3.31-2.69-6-6-6S1 2.69 1 6s2.69 6 6 6c1.3 0 2.48-.41 3.47-1.11l3.83 3.81c.19.2.45.3.7.3.25 0 .52-.09.7-.3a.996.996 0 000-1.41v.01zM7 10.7c-2.59 0-4.7-2.11-4.7-4.7 0-2.59 2.11-4.7 4.7-4.7 2.59 0 4.7 2.11 4.7 4.7 0 2.59-2.11 4.7-4.7 4.7z"></path></svg>
        </SearchInput>
        <ComplexBubble v-if="!empty" :loading="loading">
            <template v-slot:title>
                <Title class="bg-gray p-3 bubble-title flex-justify-between text-normal" style="display:flex">
                    <Statistic>
                        <OpenTab :class="{active:state === 'OPEN'}" class="mr-1" @click="()=>triggerState('OPEN')">
                                <svg class="v-align-text-bottom d-inline-block mr-1" fill="currentColor" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 00-1 1v14a1 1 0 001 1h13a1 1 0 001-1V1a1 1 0 00-1-1z"></path></svg>
                                &nbsp;<span>{{totalCountOpen}}</span>&nbsp;
                                <span>Open</span>
                        </OpenTab>

                        <ClosedTab class="ml-2 mr-1" :class="{active:state === 'CLOSED'}"  @click="()=>triggerState('CLOSED')">
                                <svg class="v-align-text-bottom d-inline-block mr-1" fill="currentColor" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                                &nbsp;<span>{{totalCountClosed}}</span>&nbsp;
                                <span>Closed</span>
                        </ClosedTab>
                    
                    </Statistic>

                    <Sort class="sort position-relative">
                        <SortMenuBtn class="sort-menu-btn list-style-none" @click="triggerShowSort" :class="{'with-full-cover':showSort}">
                            Sort
                        </SortMenuBtn>
                        <AnimatedHeightWrapper :stretch="showSort"  class="sort-menu" :class="{'border-none':!showSort}">
                            <SortMenuHeader class="sort-menu-header">Sort by</SortMenuHeader>    
                            <SortMenuBody>
                                <SortMenuItem v-for="item in sortOptions" 
                                    @click="() => selectSort(item.label)"
                                    class="menu-item"
                                    :key="item.label" 
                                    :class="{active:currentSort === item.label}">
                                    <svg v-if="currentSort === item.label" class=" v-align-middle" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                                    {{item.label}}
                                </SortMenuItem>
                            </SortMenuBody>    
                        </AnimatedHeightWrapper>   
                    </Sort>
                </Title>   
            </template>

            <ProjectListItem v-for="item in data" class="project-item" :key="item.id" :project="item"/>

            <template v-slot:footer>
                <LoadMore v-if="hasNextPage" @click="getMoreData" :class="{'text-gray':loadingMore}" class="text-center p-3 text-blue">
                {{loadingMore ? 'Loading...' : 'Load more...'}}
                </LoadMore>
            </template>
        </ComplexBubble>   
        
        <transition name="fade" appear>
            <EmptyNotice v-if="empty" class="empty-notice py-5 px-3 bg-white">
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
       
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import { mapState,mapActions, mapMutations } from 'vuex'
    import {WithRandomMetaMixin} from '../../../mixins'
    import {RepositoryTabViewMixin} from '../components'
    import {AnimatedHeightWrapper,AnimatedWidthWrapper,LoadingAndCatchErrorTemplate,ComplexBubble} from '../../../components'
    import {ACTION_REPOSITORY_REQUEST_PROJECTS_DATA} from '../../../store/modules/repository/actionTypes'
    import {MUTATION_REPOSITORY_SYNC_SEARCH_PROJECTS_QUERY} from '../../../store/modules/repository/mutationTypes'
    import { util_dateFormat } from '../../../util'
    import ProjectListItem from './ProjectListItem'
    export default {
        mixins: [WithRandomMetaMixin,RepositoryTabViewMixin],
        data() {
            return {
                state: 'OPEN',
                currentSort: 'Newest',
                showSort: false,
                searchQuery: '',
                sortOptions: [
                     {
                         label: 'Newest',
                         order: {
                             field: 'CREATED_AT',
                             direction: 'DESC',
                         }
                     },
                     {
                         label: 'Oldest',
                         order: {
                             field: 'CREATED_AT',
                             direction: 'ASC',
                         }
                     },
                     {
                         label: 'Recently updated',
                         order: {
                             field: 'UPDATED_AT',
                             direction: 'DESC',
                         }
                     },
                     {
                         label: 'Least recently updated',
                         order: {
                             field: 'UPDATED_AT',
                             direction: 'ASC',
                         }
                     },
                     {
                         label: 'Name',
                         order: {
                             field: 'NAME',
                             direction: 'ASC',
                         }
                     }
                ]
            }
        },
        inject: ['owner','repo'],
        computed: {
            ...mapState({
                data: state => state.repository.projects.nodes,
                loading: state => state.repository.projects.loading,
                loadingMore: state => state.repository.projects.loadingMore,
                hasNextPage: state => state.repository.projects.pageInfo.hasNextPage,
                totalCountOpenWithoutSearchQuery:state => state.repository.projects.totalCountOpenWithoutSearchQuery,
                totalCountOpen: state => state.repository.projects.totalCountOpen,
                totalCountClosed: state => state.repository.projects.totalCountClosed,
            }),
            orderBy() {
                let orderBy
                this.sortOptions.forEach(item => {
                    if(item.label === this.currentSort) {
                        orderBy = item.order
                    }
                })
                return orderBy
            },
            empty() {
                return this.totalCountOpenWithoutSearchQuery === 0 && !this.loading
            }
        },
        mounted() {
            this.initEnterHandler()
        },
        methods: {
            ...mapActions({
                action_getData: ACTION_REPOSITORY_REQUEST_PROJECTS_DATA
            }),
            ...mapMutations({
                mutation_repository_syncProjectsSearchQuery: MUTATION_REPOSITORY_SYNC_SEARCH_PROJECTS_QUERY
            }),
            triggerShowSort() {
                this.showSort = !this.showSort
            },
            triggerState(state) {
                this.state = state
            },
            selectSort(label) {
                this.currentSort = label
                this.triggerShowSort()
            },
            async getData(payload) {
                try{
                    await this.action_getData({
                        owner:this.owner,
                        repo: this.repo,
                        orderBy: this.orderBy,
                        state: this.state,
                        ...payload
                        })
                }catch(e) {
                    console.log(e)
                    this.errorData = {
                        errorMessage: e.message,
                        errorOccurred: true
                    }
                }
            },
            getMoreData() {
                if(this.loadingMore) return
                this.getData({
                    getMoreData: true
                })
            },
            updatedAt(dateStr) {
                return util_dateFormat.dateFormat("zzz dd, yyyy",new Date(dateStr))
            },
            description(description) {
                if(!description || description === "") return 'No description'
                return description
            },
              initEnterHandler() {
                if(!this.$refs.input) return
                this.$refs.input.onkeydown = e => {
                    if(e.key === "Enter") {
                        this.mutation_repository_syncProjectsSearchQuery({
                            searchQuery: this.searchQuery
                        })
                        this.getData({
                            getMoreData: false
                        })
                    }
                }
            }
        },
        watch: {
            orderBy() {
                this.getData()
            },
            state() {
                this.getData()
            }
        },
        components: {
            AnimatedHeightWrapper,
            ComplexBubble,
            ProjectListItem,
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

<style scoped lang="scss">
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

.border-none{
    border-color: transparent!important;
}

.with-full-cover::before{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 80;
    display: block;
    cursor: default;
    content: " ";
    background: transparent;
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


.sort-menu{
    z-index: 99;
    position: absolute;
    right: 0;
    width: 300px;
    margin-top: 4px;
    margin-bottom: 20px;
    overflow: hidden;
    font-size: 12px;
    color: #586069;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(27,31,35,.15);
    border-radius: 3px;
    box-shadow: 0 3px 12px rgba(27,31,35,.15);
    .sort-menu-header{
        padding: 8px 10px;
        line-height: 16px;
        background: #f6f8fa;
        border-bottom: 1px solid #e1e4e8;
        font-size: 12px;
        font-weight: 600;
        color: #24292e;
    }
    .menu-item{
        text-align: left;
        background-color: #fff;
        border-top: 0;
        border-right: 0;
        border-left: 0;
        display: block;
        padding: 8px 8px 8px 30px;
        overflow: hidden;
        color: inherit;
        font-weight: 600;
        font-size: 12px;
        color: #24292e;
        cursor: pointer;
        border-bottom: 1px solid #eaecef;
        svg{
            float: left;
            margin-left: -20px;
            display: inline-block;
            fill: currentColor;
        }
    }
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