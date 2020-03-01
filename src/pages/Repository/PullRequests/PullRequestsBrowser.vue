<template>
    <Container class="flex-grow-1 flex-column">

        <SubNav class="px-3 pt-4 pb-1 flex flex-justify-between">
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

            <router-link :to="`/${owner}/${repo}/pulls/new`" class="btn btn-primary">
                New
            </router-link>  
        </SubNav>
        

        <IssuesPageTemplate :data="data" 
                        :type="type"
                        v-model="searchQuery"
                        :loading="loading" 
                        :loadingCountOfIssueByState="loadingCountOfIssueByState" 
                        :countInfo="countInfo"
                        :baseQuery="`repo:${owner}/${repo} is:open is:pr`"
                        :resetRouterLink="`/${owner}/${repo}/pulls`"
                        :query="query"
                        :loadingAdditionalData="loadingAdditionalData">
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
                                :dataGetter="paginationDataGetter"></SimplePagination>

        </IssuesPageTemplate>

        <Modal title="Filter by author" ref="authorModal" :modalStyle="{height:'80vh'}">
            <div v-if="loadingAvaliableAuthors" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <SimpleSearchInput  class="p-3 modal-search-input"
                                placeholder="Filter users" 
                                v-if="!loadingAvaliableAuthors"
                                v-model="authorModalSearchQuery"/>
          
            <transition-group name="slide-up" appear>
                <router-link v-for="item in avaliableAuthors" class="d-block" :key="item.id" :to='item.routerLink'>
                    <SelectMenuItem :selected="query.indexOf(item.queryFragment) > -1"  @click.native="closeModal">
                        <img class="avatar mr-2" width="20" height="20" :src="item.avatar_url">
                        <strong class='mr-1'>{{item.login}}</strong>
                        <span>{{item.name}}</span>    
                    </SelectMenuItem>
                </router-link> 
            </transition-group>
            <router-link  @click.native="closeModal" v-if="authorModalSearchQuery !== ''" class="d-block p-3 text-gray-light bg-white" :to='authorModalSearchRouterLink'>
                <div class="text-bold f5">author:{{authorModalSearchQuery}}</div>    
                <div>Filter by this user</div>    
            </router-link> 
        </Modal>

        <Modal title="Filter by label" ref="labelModal" :modalStyle="{height:'80vh'}">
            <div v-if="loadingLabels" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <SimpleSearchInput  class="p-3 modal-search-input" 
                                placeholder="Filter labels" 
                                v-if="!loadingLabels"
                                v-model="labelModalSearchQuery"/>
            <router-link  @click.native="closeModal" 
                            v-if="!loadingLabels && labels.length !== 0"
                            class="d-block text-gray-light bg-white" 
                            :to='unlabeledRouterLink'>
                <SelectMenuItem class="text-bold f5" :selected="query.indexOf('no:label') > -1">
                    Unlabeled
                </SelectMenuItem>    
            </router-link> 
            <div v-if="!loadingLabels && labels.length === 0" class="p-3" style="color: #586069;">
                No labels found. Sorry about that.
            </div>  
            <transition-group name="slide-up" appear>
                <router-link v-for="item in labels" class="d-block" :key="item.name" :to='item.routerLink'>
                    <SelectMenuItem :selected="query.indexOf(item.queryFragment) > -1"  @click.native="closeModal">
                        <LabelBadge class="avatar mr-2 label-badge flex-shrink-0" :style="{background:`#${item.color}`}" />
                        <LabelContent style="min-width:0">
                            <LabelName class="text-bold">{{item.name}}</LabelName>    
                            <LabelDescription v-if="item.description && item.description !== ''" class="label-description">{{item.description}}</LabelDescription>    
                        </LabelContent>
                    </SelectMenuItem>
                </router-link> 
            </transition-group>
        </Modal>

        <Modal title="Filter by who's assigned" ref="assigneeModal" :modalStyle="{height:'80vh'}">
            <div v-if="loadingAvaliableAssignees" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <SimpleSearchInput  class="p-3 modal-search-input" 
                                placeholder="Filter users" 
                                v-if="!loadingAvaliableAssignees"
                                v-model="assigneeModalSearchQuery"/>
            <router-link  @click.native="closeModal" 
                            class="d-block text-gray-light bg-white" 
                            :to='assigneeToNobodyRouterLink'>
                <SelectMenuItem class="text-bold f5" :selected="query.indexOf('no:assignee') > -1">
                    Assigned to nobody
                </SelectMenuItem>    
            </router-link> 
            <transition-group name="slide-up" appear>
                <router-link v-for="item in avaliableAssignees" class="d-block" :key="item.id" :to='item.routerLink'>
                    <SelectMenuItem :selected="query.indexOf(item.queryFragment) > -1"  @click.native="closeModal">
                        <img class="avatar mr-2" width="20" height="20" :src="item.avatar_url">
                        <strong class='mr-1'>{{item.login}}</strong>
                        <span>{{item.name}}</span>    
                    </SelectMenuItem>
                </router-link> 
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
        IssuesPageMixin,
        SelectMenuItem,
        SimpleSearchInput,
        Modal,
        ButtonLeftSearchInput,
        LoadingIconEx} from '../../../components'
    import {mapState, mapActions} from 'vuex'
    import { 
        ACTION_ISSUES_REQUEST_ISSUES,
    } from '../../../store/modules/issues/actionTypes'
    import { 
        ACTION_REPOSITORY_REQUEST_ISSUES_AVALIABLE_USERS,
        ACTION_REPOSITORY_REQUEST_LABELS
    } from '../../../store/modules/repository/actionTypes'
    import 'whatwg-fetch'
    export default {
        mixins: [IssuesPageMixin],
        inject: ['repo','owner'],
        data() {
            return {
                type: 'pr',
                belongTo: 'repository',
                loadingAuthorModalData: false,
                authorModalSearchQuery: '',
                labelModalSearchQuery: '',
                assigneeModalSearchQuery: ''
            }
        },
        computed: {
            ...mapState({
                loading: state => state.issues.repository.pr.loading,
                loadingAdditionalData: state => state.issues.repository.pr.loadingAdditionalData,
                loadingCountOfIssueByState: state => state.issues.repository.pr.loadingCountOfIssueByState,
                loadingAvaliableAuthors: state => state.repository.pr.associatedUsers.author.loading,
                loadingAvaliableAssignees: state => state.repository.pr.associatedUsers.assignee.loading,
                loadingLabels: state => state.repository.label.loading,
                data: state => state.issues.repository.pr.data,
                pageInfo: state => state.issues.repository.pr.pageInfo,
                _countInfo: state => state.issues.repository.pr.countInfo,
                _avaliableAuthors: state => state.repository.pr.associatedUsers.author.data,
                _avaliableAssignees: state => state.repository.pr.associatedUsers.assignee.data,
                _labels: state => state.repository.label.data,
            }),
            avaliableAuthors() {
                let avaliableAuthors = []
                let _avaliableAuthorsSubArr = this._avaliableAuthors[`${this.owner}/${this.repo}`]
                if(_avaliableAuthorsSubArr) {
                    _avaliableAuthorsSubArr.forEach((item,index) => {
                        let q = this.query.replace(/(author:\S*)/g,'').trim() + ` author:${item.login}`
                        if(item.login.indexOf(this.authorModalSearchQuery) > -1) {
                            avaliableAuthors.push({
                                ...item,
                                routerLink: `/${this.owner}/${this.repo}/pulls?q=${q}`,
                                queryFragment: `author:${item.login}`
                            })
                        }
                    })
                }
               
                return  avaliableAuthors
            },
            avaliableAssignees() {
                let avaliableAssignees = []
                let _avaliableAssigneesSubArr = this._avaliableAssignees[`${this.owner}/${this.repo}`]
                if(_avaliableAssigneesSubArr) {
                    _avaliableAssigneesSubArr.forEach((item,index) => {
                        let q = this.query.replace(/(assignee:\S*)/g,'').replace('no:assignee','').trim() + ` assignee:${item.login}`
                        if(item.login.indexOf(this.assigneeModalSearchQuery) > -1) {
                            avaliableAssignees.push({
                                ...item,
                                routerLink: `/${this.owner}/${this.repo}/pulls?q=${q}`,
                                queryFragment: `assignee:${item.login}`
                            })
                        }
                    })
                }
               
                return  avaliableAssignees
            },
            labels() {
                let labels = []
                let _labelsSubArr = this._labels[`${this.owner}/${this.repo}`]
                if(_labelsSubArr) {
                    _labelsSubArr.forEach((item,index) => {
                        let reg = new RegExp(`label:${item.name}`,'g')
                        let q = this.query.replace(reg,'').trim().replace('no:label','') + ` label:${item.name}`
                        if(item.name.indexOf(this.labelModalSearchQuery) > -1) {
                            labels.push({
                                ...item,
                                routerLink: `/${this.owner}/${this.repo}/pulls?q=${q}`,
                                queryFragment: `label:${item.name}`
                            })
                        }
                    })
                }
                return labels
            },
            filterModalRouterLink() {
                return [
                    {
                        label: 'Open issues and pull requests',
                        routerLink: `/${this.owner}/${this.repo}/pulls?q=repo:${this.owner}/${this.repo} is:open`
                    },
                    {
                        label: 'Your issues',
                        routerLink: `/${this.owner}/${this.repo}/pulls?q=repo:${this.owner}/${this.repo} is:open is:issue author:${this.login}`
                    },
                    {
                        label: 'Your pull requests',
                        routerLink: `/${this.owner}/${this.repo}/pulls?q=repo:${this.owner}/${this.repo} is:open is:pr author:${this.login}`
                    },
                    {
                        label: 'Everything assigned to you',
                        routerLink: `/${this.owner}/${this.repo}/pulls?q=repo:${this.owner}/${this.repo} is:open assignee:${this.login}`
                    },
                    {
                        label: 'Everything mentioned to you',
                        routerLink: `/${this.owner}/${this.repo}/pulls?q=repo:${this.owner}/${this.repo} is:open mentions:${this.login}`
                    }
                ]
            },
            countInfo() {
                let currentIssueState = ''
                if(this.query.indexOf('is:open') > -1) currentIssueState = 'open'
                else if(this.query.indexOf('is:closed') > -1) currentIssueState = 'closed'

                let toOpenQuery = 'is:open ' + this.query.replace(/(is:closed|is:open)/g,'').trim()
                let toClosedQuery = 'is:closed ' + this.query.replace(/(is:closed|is:open)/g,'').trim()
                return {
                    ...this._countInfo,
                    currentIssueState,
                    toOpen: `/${this.owner}/${this.repo}/pulls?q=${toOpenQuery}`,
                    toClosed: `/${this.owner}/${this.repo}/pulls?q=${toClosedQuery}`,
                }
            },
            query() {
                let query = this.$route.query.q || `repo:${this.owner}/${this.repo} is:open is:${this.type}`
                this.searchQuery = query.replace(/is:(issue|pr)/g,'is:pr').replace(/repo:\S*\/\S*/g,'').replace(/\s+/g,' ').trim()
                return query
            },
            sortModalRouterLink() {
                return [
                    {
                        routerLink: `/${this.owner}/${this.repo}/pulls?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:created-desc',
                        label: 'Newest',
                        queryFragment: 'sort:created-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/pulls?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:created-asc',
                        label: 'Oldest',
                        queryFragment: 'sort:created-asc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/pulls?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:comments-desc',
                        label: 'Most commented',
                        queryFragment: 'sort:comments-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/pulls?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:comments-asc',
                        label: 'Least commented',
                        queryFragment: 'sort:comments-asc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/pulls?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:updated-desc',
                        label: 'Recently updated',
                        queryFragment: 'sort:updated-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/pulls?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:updated-asc',
                        label: 'Least recently updated',
                        queryFragment: 'sort:updated-asc'
                    },
                ]
            },
            sortModalReactionRouterLink() {
                return [
                    {
                        routerLink: `/${this.owner}/${this.repo}/pulls?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-%2B1-desc',
                        label: '👍',
                        queryFragment: 'sort:reactions-+1-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/pulls?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions--1-desc',
                        label: '👎',
                        queryFragment: 'sort:reactions--1-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/pulls?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-smile-desc',
                        label: '😄',
                        queryFragment: 'sort:reactions-smile-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/pulls?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-tada-desc',
                        label: '🎉',
                        queryFragment: 'sort:reactions-tada-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/pulls?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-thinking_face-desc',
                        label: '😕',
                        queryFragment: 'sort:reactions-thinking_face-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/pulls?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-heart-desc',
                        label: '❤️',
                        queryFragment: 'sort:reactions-heart-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/pulls?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-rocket-desc',
                        label: '🚀',
                        queryFragment: 'sort:reactions-rocket-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/pulls?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-eyes-desc',
                        label: '👀',
                        queryFragment: 'sort:reactions-eyes-desc'
                    },
                ]
            },
            authorModalSearchRouterLink() {
                return `/${this.owner}/${this.repo}/pulls?q=` + this.query.replace(/author:\S*/g,'').trim() + ` author:${this.authorModalSearchQuery}`
            },
            assigneeModalSearchRouterLink() {
                return `/${this.owner}/${this.repo}/pulls?q=` + this.query.replace(/assignee:\S*/g,'').trim() + ` assignee:${this.assigneeModalSearchQuery}`
            },
            assigneeToNobodyRouterLink() {
                return `/${this.owner}/${this.repo}/pulls?q=` + this.query.replace(/assignee:\S*/g,'').replace(/no:\S*/g,'').trim() + ` no:assignee`
            },
            unlabeledRouterLink() {
                return `/${this.owner}/${this.repo}/pulls?q=` + this.query.replace(/assignee:\S*/g,'').replace(/label:\S*/g,'').replace(/no:\S*/g,'').trim() + ` no:label`
            }
        },
        methods: {
            ...mapActions({
                action_getData: ACTION_ISSUES_REQUEST_ISSUES,
                action_getAssociateUsers: ACTION_REPOSITORY_REQUEST_ISSUES_AVALIABLE_USERS,
                action_getLabels: ACTION_REPOSITORY_REQUEST_LABELS,
            }),
            search() {
                this.searchQuery = this.searchQuery.replace(/is:(issue|pr)/g,'is:pr').replace(/repo:\S*\/\S*/g,'').replace(/\s+/g,' ').trim()
                this.$router.replace(`/${this.owner}/${this.repo}/pulls?q=repo:${this.owner}/${this.repo} ${this.searchQuery}`)
            },
            triggerModel(meta) {
                switch(meta){
                    case 'author':
                        this.$refs.authorModal.show = true
                        if(!this._avaliableAuthors[[`${this.owner}/${this.repo}`]]) {
                             this.action_getAssociateUsers({
                                repo: this.repo,
                                owner: this.owner,
                                query: `repo:${this.owner}/${this.repo} is:pr`,
                                issueType: this.type,
                                meta: 'author'
                            })
                        }
                        break
                    case 'sort':
                        this.$refs.sortModal.show = true
                        break
                    case 'assignee':
                        this.$refs.assigneeModal.show = true
                        if(!this._avaliableAssignees[[`${this.owner}/${this.repo}`]]) {
                             this.action_getAssociateUsers({
                                repo: this.repo,
                                owner: this.owner,
                                query: `repo:${this.owner}/${this.repo} is:pr`,
                                issueType: this.type,
                                meta: 'assignee'
                            })
                        }
                        break
                    case 'label':
                        this.$refs.labelModal.show = true
                        if(!this._labels[`${this.owner}/${this.repo}`]) {
                             this.action_getLabels({
                                repo: this.repo,
                                owner: this.owner,
                                issueType: this.type,
                            })
                        }
                        break
                    case 'filter':
                        this.$refs.filterModal.show = true
                        break
                }
            },
            async paginationDataGetter(payload) {
                await this.action_getData({
                    ...payload,
                    issueType:this.type,
                    q:this.query,
                    belongTo:this.belongTo
                })
            },
            closeModal() {
                this.$refs.authorModal.show = false
                this.$refs.sortModal.show = false
                this.$refs.assigneeModal.show = false
                this.$refs.labelModal.show = false
                this.$refs.filterModal.show = false
            }
        },
        components: {
            SelectMenuItem,
            Modal,
            LoadingIconEx,
            ButtonLeftSearchInput,
            SimpleSearchInput,
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
.subnav-item:first-child {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
}
.subnav-item:last-child {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
}

.subnav-item {
    position: relative;
    float: left;
    padding: 6px 14px;
    font-weight: 600;
    line-height: 20px;
    color: #586069;
    border: 1px solid #e1e4e8;
}
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