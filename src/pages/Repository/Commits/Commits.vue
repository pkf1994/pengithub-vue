<template>
    <CommonLoadingWrapper class="p-3" :loading="loading || graphqlData.loading || allBranchesAndTags.loading" :position="loading || allBranchesAndTags.loading ? 'center' : 'corner'">
        <transition-group name="fade-group" appear>
            <button key="refSwitchBtn" v-if="firstLoadedFlag && !path" class="btn css-truncate btn-sm" @click="() => openModal('switchBranchOrTagModal')">
                <i>{{refType | capitalize}}:</i>
                <span class="css-truncate-target" v-if="currentRef">{{currentRef}}</span>
                <span class="dropdown-caret"></span>
            </button>
            
            <FileNavigation key="fileNavigation" v-if="firstLoadedFlag && path" class="file-path text-bold">
                <span class="text-normal">History for</span>         
                <router-link :to="`/${owner()}/${repo()}/commits`">{{repo()}}</router-link> /
                <Breadcrumb :spaceArround="true" :routePath="$route.fullPath" :displayPath="path && path.replace(/^\//,'').replace(/\/$/,'')">
                </Breadcrumb>
            </FileNavigation>
        </transition-group>
        
        <transition-group name="fade-group" appear>
            <CommitGroup v-for="item in commitGroups" class="the-commit-group" :key="item[0].node_id" :commitGroup="item"></CommitGroup>
        </transition-group>

        <Pagination class="paginate-container" v-if="data.length > 0 && (pageInfo.prev || pageInfo.next)">
            <div class="BtnGroup">
                <button class="btn btn-outline BtnGroup-item" :disabled="!pageInfo.prev || loading" @click="() => changePage(true)">Newer</button>
                <button class="btn btn-outline BtnGroup-item" :disabled="!pageInfo.next || loading"  @click="() => changePage(false)">Older</button>
            </div> 
        </Pagination>

        <Modal ref="switchBranchOrTagModal" title="Switch branches/tags" :modalStyle="{height:'80vh'}">
            <div v-if="allBranchesAndTags.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <div class="select-menu-text-filter">
                <div class="p-3">
                    <input type="text" v-model="switchBranchOrTagModalSearchQuery" class="form-control" placeholder="Filter branches/tags" autofocus="" autocomplete="off"/>
                </div>
                <ModalTab class="SelectMenu-tabs" style="background-color: #f6f8fa;">
                    <button class="SelectMenu-tab py-2" style="font-size:14px" @click="() => switchModalTab('branch')" :class="{'active-modal-tab':switchBranchOrTagModalTab == 'branch'}">Branches</button>
                    <button class="SelectMenu-tab py-2" style="font-size:14px" @click="() => switchModalTab('tag')" :class="{'active-modal-tab':switchBranchOrTagModalTab == 'tag'}">Tags</button>
                </ModalTab>
            </div>
            <transition-group v-if="switchBranchOrTagModalTab == 'branch'" name="fade-group" appear>
                <SelectMenuItem :key="repoBasicInfo().default_branch" v-if="repoBasicInfo().default_branch" @click.native="() => routerWithRef(repoBasicInfo().default_branch)" :selected="currentRef == repoBasicInfo().default_branch">
                    <span class="flex-1">{{repoBasicInfo().default_branch}}</span>    
                    <span class="Label Label--gray flex-self-start">default</span>
                </SelectMenuItem>
                <SelectMenuItem @click.native="() => routerWithRef(item.ref.replace('refs/heads/',''))" v-for="item in filterAllBranches" :key="item.ref" :selected="currentRef == item.ref.replace('refs/heads/','')">
                    <span>{{item.ref.replace('refs/heads/','')}}</span>    
                </SelectMenuItem>
            </transition-group>
            <transition-group v-if="switchBranchOrTagModalTab == 'tag'" name="fade-group" appear>
                <SelectMenuItem @click.native="() => routerWithRef(item.ref.replace('refs/tags/',''))" v-for="item in filterAllTags" :key="item.ref" :selected="currentRef == item.ref.replace('refs/tags/','')">
                    <span>{{item.ref.replace('refs/tags/','')}}</span>    
                </SelectMenuItem>
            </transition-group>
        </Modal>
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoading,SelectMenuItem,LoadingIconEx,Modal,WithNotFoundNoticeWrapper,CommonLoadingWrapper,Breadcrumb} from '@/components'
    import {authRequiredGet,authRequiredGitHubGraphqlApiQuery} from '@/network'
    import {util_queryParse} from '@/util'
    import CommitGroup from './CommitGroup'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import {RouteUpdateAwareMixin,WithModalMixin} from '@/mixins'
    var parse = require('parse-link-header');
    export default {
        name: 'repository_commits_page',
        mixins: [RouteUpdateAwareMixin,WithModalMixin],
        inject: ['repoBasicInfo','owner','repo'],
        provide() {
            return {
                graphqlDataProvided: () => this.graphqlData.data
            }
        },
        data() {
            return {
                data: [],
                loading: false,
                pageInfo: {},
                perPage: 20,
                paramIsBranch: true,
                graphqlData: {
                    data: [],
                    loading: false
                },
                firstLoadedFlag: false,
                allBranchesAndTags: {
                    branches: [],
                    tags: [],
                    loading: false
                },
                switchBranchOrTagModalTab: "branch",
                switchBranchOrTagModalSearchQuery: "",
            }
        },
        computed: {
            defaultRef() {
                return this.repoBasicInfo().default_branch
            },
            owner() {
                return this.$route.params.owner
            },
            repo() {
                return this.$route.params.repo
            },
            page() {
                return this.$route.query.page || 1
            },
            commitGroups() {
                let commitGroups = []
                this.data.forEach(i => {
                    if(commitGroups.length == 0) {
                        commitGroups.push([i])
                        return false
                    }
                    let commitDate = new Date(i.commit.committer.date)
                    let prevCommitDate = new Date(commitGroups[commitGroups.length - 1][0].commit.committer.date)
                    if(commitDate.getFullYear() == prevCommitDate.getFullYear() && commitDate.getMonth() == prevCommitDate.getMonth() && commitDate.getDate() == prevCommitDate.getDate()) {
                        commitGroups[commitGroups.length - 1].push(i)
                    } else {
                        commitGroups.push([i])
                    }
                })
                return commitGroups
            },
            currentRef() {
                if(!this.$route.params.pathMatch) return this.defaultRef
                if(this.$route.params.pathMatch.match(/^[^\/]+\/?$/)) return this.$route.params.pathMatch.replace('/','')
                if(this.allBranchesAndTags.branches.length == 0) return
                   
                let ref
                let routePathMatch = this.$route.params.pathMatch
                //if(routePathMatch[routePathMatch.length - 1] !== '/') routePathMatch = `${routePathMatch}/`
                this.allBranchesAndTags.branches.forEach(item => {
                    let regExp =  new RegExp(`^(${item.ref.replace('refs/heads/','')})(\/\.*)?`)
                    let branchMatch = routePathMatch.match(regExp)
                    if(branchMatch){
                        if(!ref) ref = branchMatch[1]
                        if(branchMatch[1].length > ref.length) ref = branchMatch[1]
                    }
                })

                this.allBranchesAndTags.tags.forEach(item => {
                    let regExp =  new RegExp(`^(${item.ref.replace('refs/tags/','')})(\/\.*)?`)
                    let tagMatch = routePathMatch.match(regExp)
                    if(tagMatch){
                        if(!ref) ref = tagMatch[1]
                        if(tagMatch[1].length > ref.length) ref = tagMatch[1]
                    }
                })
                return ref
            },
            refType() {
                let refType
                try{
                    this.allBranchesAndTags.branches.forEach( i => {
                        let branchName = i.ref.replace('refs/heads/','')
                        if(branchName == this.currentRef) {
                            refType = 'branch'
                            throw new Error('forEach abort')
                        }
                    })
                    this.allBranchesAndTags.tags.forEach( i => {
                        let tagName = i.ref.replace('refs/tags/','')
                        if(tagName == this.currentRef) {
                            refType = 'tag'
                            throw new Error('forEach abort')
                        }
                    })
                }catch(e) {
                    //do nothing
                }
                return refType
            },
            path() {
                if(!this.$route.params.pathMatch) return 
                if(!this.currentRef) return 
                return this.$route.params.pathMatch.replace(this.currentRef,'')
            },
            filterAllBranches() {
                return this.allBranchesAndTags.branches.filter(i => {
                    let branchName = i.ref.replace('refs/heads/','')
                    return branchName.toLowerCase().indexOf(this.switchBranchOrTagModalSearchQuery.toLowerCase()) != -1 && branchName != this.repoBasicInfo().default_branch
                })
            },
            filterAllTags() {
                return this.allBranchesAndTags.tags.filter(i => {
                    let tagName = i.ref.replace('tags/heads/','')
                    return tagName.toLowerCase().indexOf(this.switchBranchOrTagModalSearchQuery.toLowerCase()) != -1
                })
            },
        },
        async created() {
            console.log(this.$route.params)
            await Promise.all([
                this.network_getAllBranches(),
                this.network_getAllTags()
            ])
            this.network_getData()
            /* this.network_getData()
            this.network_determineRefType() */
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_REPOSITORY_COMMITS({
                        owner: this.owner(),
                        repo: this.repo(),
                        params: {
                            per_page: this.perPage,
                            ...this.$route.query,
                            path: this.path,
                            sha: this.currentRef,
                        }
                    })
                    let res = await authRequiredGet(url,{cancelToken})

                    window.scrollTo(0,0)
                    this.data = res.data
                    this.pageInfo = parse(res.headers.link) || {}

                    if(this.accessToken) this.network_getGraphqlData(this.data)
                    
                    this.firstLoadedFlag = true
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            async network_getGraphqlData(payload) {
                try{
                    this.graphqlData.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_graphql_data')
                    
                    let graphql_ = graphql.GRAPHQL_COMMITS(payload)

                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_,{cancelToken})

                    let graphqlData = []
                    for(let key in res.data.data){
                        graphqlData.push(res.data.data[key])
                    }
                    this.graphqlData.data = graphqlData

                }catch(e) {
                    console.log(e)
                }finally{
                    this.graphqlData.loading = false
                }
            },
           
            async network_getAllBranches(){
                try{
                    this.allBranchesAndTags.loading = true 
                    let lastPage = 1
                    let currentPage = 1
                    let branches = []
                    while(currentPage <= lastPage) {
                        let url_branches = api.API_GIT_MATCHING_REFS({
                            owner: this.owner(),
                            repo: this.repo(),
                            ref: 'heads/',
                            params: {
                                per_page: 100,
                                page: currentPage
                            }
                        })
                        let res = await authRequiredGet(url_branches)
                        let pageInfo = parse(res.headers.link) || {}
                        if(pageInfo.last) lastPage = pageInfo.last.page
                        branches = branches.concat(res.data)
                        currentPage += 1
                    }
                    
                    this.allBranchesAndTags.branches = branches
                }catch(e) {
                    console.log(e)
                } finally {
                    this.allBranchesAndTags.loading = false
                }
            },
            async network_getAllTags(){
                try{
                    this.allBranchesAndTags.loading = true 
                    let lastPage = 1
                    let currentPage = 1
                    let tags = []
                    while(currentPage <= lastPage) {
                        let url_tags = api.API_GIT_MATCHING_REFS({
                            owner: this.owner(),
                            repo: this.repo(),
                            ref: 'tags/',
                            params: {
                                per_page: 100,
                                page: currentPage
                            }
                        })
                        let res = await authRequiredGet(url_tags)
                        let pageInfo = parse(res.headers.link) || {}
                        if(pageInfo.last) lastPage = pageInfo.last.page
                        tags = tags.concat(res.data)
                        currentPage += 1
                    }
                    
                    this.allBranchesAndTags.tags = tags
                }catch(e) {
                    console.log(e)
                } finally {
                    this.allBranchesAndTags.loading = false
                }
            },
            changePage(goPrevPageFlag) {
                let queryStr = util_queryParse.querify({
                    ...this.$route.query,
                    page: goPrevPageFlag ? this.page - 1 : (this.page ? parseInt(this.page) + 1 : 2)
                })
                this.$router.push(`${this.$route.path}?${queryStr}`)
            },
            routerWithRef(ref) {
                this.closeModal()
                this.$router.push(`/${this.owner()}/${this.repo()}/commits/${ref}`)
            },
            switchModalTab(payload) {
                this.switchBranchOrTagModalTab = payload
            },
        },
        components: {
            CommonLoading,
            CommitGroup,
            Modal,
            SelectMenuItem,
            LoadingIconEx,
            WithNotFoundNoticeWrapper,
            CommonLoadingWrapper,
            Breadcrumb,
            Container: styled.div``,
            Pagination: styled.div``,
            ModalTab: styled.div``,
            FileNavigation: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/truncate/index.scss';
@import 'node_modules/@primer/css/dropdown/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/select-menu/index.scss';
@import 'node_modules/@primer/css/labels/index.scss';
.the-commit-group:first-child{
    padding-top: 0px;
    margin-top: 15px;
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

.active-modal-tab{
    background: white
}

.file-path{
    font-size: 16px;
    color: #586069;
}

.active-modal-tab{
    background: white
}
</style>