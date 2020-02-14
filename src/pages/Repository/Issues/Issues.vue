<template>
    <Container class="flex-grow-1 flex-column">
        <IssuesPageTemplate :data="data" 
                        :type="type"
                        v-model="searchQuery"
                        :loading="loading" 
                        :loadingCountOfIssueByState="loadingCountOfIssueByState" 
                        :countInfo="countInfo"
                        :baseQuery="`repo:${owner}/${repo} is:open is:issue`"
                        :resetRouterLink="`/${owner}/${repo}/issues`"
                        :query="query"
                        :loadingAdditionalData="loadingAdditionalData">
            <template v-slot:searchInput>
                <IconSearchInput v-model="searchQuery" 
                                :search="search" 
                                placeholder="Search all issues"/>
            </template>

            <template v-slot:entriesFilterRow>
                    <EntriesFilterItem class="px-3" @click="() => triggerModel('author')">Author</EntriesFilterItem>
                    <EntriesFilterItem class="px-3" @click="() => triggerModel('label')">Label</EntriesFilterItem>
                    <EntriesFilterItem class="px-3" @click="() => triggerModel('assignee')">Assignee</EntriesFilterItem>
                    <EntriesFilterItem class="px-3" @click="() => triggerModel('sort')">Sort</EntriesFilterItem>
            </template>

            <SimplePagination   v-if="pageInfo && (pageInfo.next || pageInfo.prev)"   
                                :pageInfo="pageInfo" 
                                scrollElSelector="fix-full-scrollable"
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
                        <div class="avatar mr-2 label-badge" :style="{background:`#${item.color}`}"/>
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

    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {
        IssuesPageMixin,
        SelectMenuItem,
        SimpleSearchInput,
        Modal,
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
                type: 'issue',
                belongTo: 'repository',
                loadingAuthorModalData: false,
                authorModalSearchQuery: '',
                labelModalSearchQuery: '',
                assigneeModalSearchQuery: ''
            }
        },
        computed: {
            ...mapState({
                loading: state => state.issues.repository.issue.loading,
                loadingAdditionalData: state => state.issues.repository.issue.loadingAdditionalData,
                loadingCountOfIssueByState: state => state.issues.repository.issue.loadingCountOfIssueByState,
                loadingAvaliableAuthors: state => state.repository.issue.associatedUsers.author.loading,
                loadingAvaliableAssignees: state => state.repository.issue.associatedUsers.assignee.loading,
                loadingLabels: state => state.repository.label.loading,
                data: state => state.issues.repository.issue.data,
                pageInfo: state => state.issues.repository.issue.pageInfo,
                _countInfo: state => state.issues.repository.issue.countInfo,
                _avaliableAuthors: state => state.repository.issue.associatedUsers.author.data,
                _avaliableAssignees: state => state.repository.issue.associatedUsers.assignee.data,
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
                                routerLink: `/${this.owner}/${this.repo}/issues?q=${q}`,
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
                                routerLink: `/${this.owner}/${this.repo}/issues?q=${q}`,
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
                                routerLink: `/${this.owner}/${this.repo}/issues?q=${q}`,
                                queryFragment: `label:${item.name}`
                            })
                        }
                    })
                }
                return labels
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
                    toOpen: `/${this.owner}/${this.repo}/issues?q=${toOpenQuery}`,
                    toClosed: `/${this.owner}/${this.repo}/issues?q=${toClosedQuery}`,
                }
            },
            query() {
                let query = this.$route.query.q || `repo:${this.owner}/${this.repo} is:open is:${this.type}`
                this.searchQuery = query.replace(/is:(issue|pr)/g,'is:issue').replace(/repo:\S*\/\S*/g,'').replace(/\s+/g,' ').trim()
                return query
            },
            sortModalRouterLink() {
                return [
                    {
                        routerLink: `/${this.owner}/${this.repo}/issues?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:created-desc',
                        label: 'Newest',
                        queryFragment: 'sort:created-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/issues?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:created-asc',
                        label: 'Oldest',
                        queryFragment: 'sort:created-asc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/issues?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:comments-desc',
                        label: 'Most commented',
                        queryFragment: 'sort:comments-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/issues?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:comments-asc',
                        label: 'Least commented',
                        queryFragment: 'sort:comments-asc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/issues?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:updated-desc',
                        label: 'Recently updated',
                        queryFragment: 'sort:updated-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/issues?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:updated-asc',
                        label: 'Least recently updated',
                        queryFragment: 'sort:updated-asc'
                    },
                ]
            },
            sortModalReactionRouterLink() {
                return [
                    {
                        routerLink: `/${this.owner}/${this.repo}/issues?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-%2B1-desc',
                        label: '👍',
                        queryFragment: 'sort:reactions-+1-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/issues?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions--1-desc',
                        label: '👎',
                        queryFragment: 'sort:reactions--1-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/issues?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-smile-desc',
                        label: '😄',
                        queryFragment: 'sort:reactions-smile-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/issues?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-tada-desc',
                        label: '🎉',
                        queryFragment: 'sort:reactions-tada-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/issues?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-thinking_face-desc',
                        label: '😕',
                        queryFragment: 'sort:reactions-thinking_face-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/issues?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-heart-desc',
                        label: '❤️',
                        queryFragment: 'sort:reactions-heart-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/issues?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-rocket-desc',
                        label: '🚀',
                        queryFragment: 'sort:reactions-rocket-desc'
                    },
                    {
                        routerLink: `/${this.owner}/${this.repo}/issues?q=` + this.query.replace(/sort:\S*/g,'').trim() + ' sort:reactions-eyes-desc',
                        label: '👀',
                        queryFragment: 'sort:reactions-eyes-desc'
                    },
                ]
            },
            authorModalSearchRouterLink() {
                return `/${this.owner}/${this.repo}/issues?q=` + this.query.replace(/author:\S*/g,'').trim() + ` author:${this.authorModalSearchQuery}`
            },
            assigneeModalSearchRouterLink() {
                return `/${this.owner}/${this.repo}/issues?q=` + this.query.replace(/assignee:\S*/g,'').trim() + ` assignee:${this.assigneeModalSearchQuery}`
            },
            assigneeToNobodyRouterLink() {
                return `/${this.owner}/${this.repo}/issues?q=` + this.query.replace(/assignee:\S*/g,'').replace(/no:\S*/g,'').trim() + ` no:assignee`
            },
            unlabeledRouterLink() {
                return `/${this.owner}/${this.repo}/issues?q=` + this.query.replace(/assignee:\S*/g,'').replace(/label:\S*/g,'').replace(/no:\S*/g,'').trim() + ` no:label`
            }
        },
        methods: {
            ...mapActions({
                action_getData: ACTION_ISSUES_REQUEST_ISSUES,
                action_getAssociateUsers: ACTION_REPOSITORY_REQUEST_ISSUES_AVALIABLE_USERS,
                action_getLabels: ACTION_REPOSITORY_REQUEST_LABELS,
            }),
            search() {
                this.searchQuery = this.searchQuery.replace(/is:(issue|pr)/g,'is:issue').replace(/repo:\S*\/\S*/g,'').replace(/\s+/g,' ').trim()
                this.$router.replace(`/${this.owner}/${this.repo}/issues?q=repo:${this.owner}/${this.repo} ${this.searchQuery}`)
            },
            triggerModel(meta) {
                switch(meta){
                    case 'author':
                        this.$refs.authorModal.show = true
                        if(!this._avaliableAuthors[[`${this.owner}/${this.repo}`]]) {
                             this.action_getAssociateUsers({
                                repo: this.repo,
                                owner: this.owner,
                                query: `repo:${this.owner}/${this.repo} is:issue`,
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
                                query: `repo:${this.owner}/${this.repo} is:issue`,
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
                                query: `repo:${this.owner}/${this.repo} is:open is:issue`,
                                issueType: this.type,
                            })
                        }
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
            }
        },
        components: {
            SelectMenuItem,
            Modal,
            LoadingIconEx,
            SimpleSearchInput,
            Container: styled.div``,
            TopTabContainer: styled.div``,
            EntriesFilterItem: styled.div``,
            ModalContent: styled.div``,
            Reactions: styled.div``,
            AuthorItem: styled.div``,
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
</style>