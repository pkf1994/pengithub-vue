<template>
    <CommonLoadingWrapper class="px-3" :loading="loading || allBranchesAndTags.loading" :position="loading || allBranchesAndTags.loading ? 'center' : 'corner'">
        <transition-group name="fade-group" appear>
            <button v-if="!path && firstLoadedFlag" key="refSwitchBtn" class="btn css-truncate btn-sm mb-2" :disabled="!currentRef" @click="() => openModal('switchBranchOrTagModal')">
                <i>{{refType | capitalize}}:</i>
                <span class="css-truncate-target" v-if="currentRef">{{currentRef}}</span>
                <span class="dropdown-caret"></span>
            </button>
            
            <FileNavigation key="fileNavigation" class="file-path text-bold" v-if="path">
                <span class="text-normal">History for</span>         
                <router-link :to="`/${owner()}/${repo()}/commits`">{{repo()}}</router-link> /
                <Breadcrumb :spaceArround="true" :routePath="$route.fullPath" :displayPath="path && path.replace(/^\//,'').replace(/\/$/,'')">
                </Breadcrumb>
            </FileNavigation>
        </transition-group>
        
        <transition-group name="fade-group" appear>
            <CommitGroup v-for="item in commitGroups" class="the-commit-group" :key="item[0].node_id" :commitGroup="item"></CommitGroup>
        </transition-group>

        <!-- <Pagination class="paginate-container" v-if="data.length > 0 && (pageInfo.prev || pageInfo.next)">
            <div class="BtnGroup">
                <button class="btn btn-outline BtnGroup-item" :disabled="!pageInfo.prev || loading" @click="() => changePage(true)">Newer</button>
                <button class="btn btn-outline BtnGroup-item" :disabled="!pageInfo.next || loading"  @click="() => changePage(false)">Older</button>
            </div> 
        </Pagination> -->

        <SimplePaginationRest  v-if="data.length > 0 && (pageInfo.prev || pageInfo.next)" :pageInfo="pageInfo">

        </SimplePaginationRest>

        <Modal ref="switchBranchOrTagModal" title="Switch branches/tags" :modalStyle="{height:'80vh'}" @show="network_getAvailableRef">
            <div class="select-menu-text-filter">
                <div class="p-3">
                    <input type="text" v-model="switchBranchOrTagModalSearchQuery" class="form-control" placeholder="Filter branches/tags" autofocus="" autocomplete="off"/>
                </div>
                <ModalTab class="SelectMenu-tabs" style="background-color: #f6f8fa;">
                    <button class="SelectMenu-tab py-2" style="font-size:14px" @click="() => switchModalTab('branches')" :class="{'active-modal-tab':switchBranchOrTagModalTab == 'branches'}">Branches</button>
                    <button class="SelectMenu-tab py-2" style="font-size:14px" @click="() => switchModalTab('tags')" :class="{'active-modal-tab':switchBranchOrTagModalTab == 'tags'}">Tags</button>
                </ModalTab>
            </div>
            <div v-if="(switchBranchOrTagModalTab == 'branches' && modalAvailableBranches.loading) || (switchBranchOrTagModalTab == 'tags' && modalAvailableTags.loading)" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <div v-else style="overflow:auto">
                <transition-group v-if="switchBranchOrTagModalTab == 'branches'" name="fade-group" appear>
                    <SelectMenuItem :key="repoBasicInfo().default_branch" v-if="repoBasicInfo().default_branch" @click.native="() => routerWithRef(repoBasicInfo().default_branch)" :selected="currentRef == repoBasicInfo().default_branch">
                        <span class="flex-1">{{repoBasicInfo().default_branch}}</span>    
                        <span class="Label Label--gray flex-self-start">default</span>
                    </SelectMenuItem>
                    <SelectMenuItem @click.native="() => routerWithRef(item)" v-for="item in modalFilteredAvailableBranches" :key="item" :selected="currentRef == item">
                        <span>{{item}}</span>    
                    </SelectMenuItem>
                </transition-group>
                <transition-group v-if="switchBranchOrTagModalTab == 'tags'" name="fade-group" appear>
                    <SelectMenuItem @click.native="() => routerWithRef(item)" v-for="item in modalFilteredAvailableTags" :key="item" :selected="currentRef == item">
                        <span>{{item}}</span>    
                    </SelectMenuItem>
                </transition-group>
            </div>
        </Modal>
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoading,SelectMenuItem,LoadingIconEx,Modal,CommonLoadingWrapper,Breadcrumb,SimplePaginationRest} from '@/components'
    import {authRequiredGet,authRequiredGitHubGraphqlApiQuery,commonGet} from '@/network'
    import {util_queryParse} from '@/util'
    import {CommitGroup} from './components'
    import * as api from '@/network/api'
    import {RouteUpdateAwareMixin,WithModalMixin} from '@/mixins'
    import {WithRefDistinguishMixin} from '../components'
    var parse = require('parse-link-header');
    export default {
        name: 'repository_commits_page',
        mixins: [RouteUpdateAwareMixin,WithModalMixin,WithRefDistinguishMixin],
        inject: ['repoBasicInfo','owner','repo'],
        data() {
            return {
                data: [],
                loading: false,
                pageInfo: {},
                perPage: 20,
                paramIsBranch: true,
                firstLoadedFlag: false,
                switchBranchOrTagModalTab: "branches",
                switchBranchOrTagModalSearchQuery: "",
                modalAvailableBranches: {
                    data: [],
                    loading: false
                },
                modalAvailableTags: {
                    data: [],
                    loading: false
                }
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
            modalFilteredAvailableBranches() {
                return this.modalAvailableBranches.data.filter(i => {
                    return (i.toLowerCase().indexOf(this.switchBranchOrTagModalSearchQuery.toLowerCase()) != -1) && (i != this.repoBasicInfo().default_branch)
                })
            },
            modalFilteredAvailableTags() {
                return this.modalAvailableTags.data.filter(i => {
                    return i.toLowerCase().indexOf(this.switchBranchOrTagModalSearchQuery.toLowerCase()) != -1
                })
            },
        },
        async created() {
            await this.network_getAllBranchesAndTags()
            this.network_getData()
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

                    if(!this.pageInfo.prev && res.data.length == 0) this.emitNotFoundEvent(this.$el)

                    this.scrollToTop()
                    this.data = res.data
                    this.pageInfo = parse(res.headers.link) || {}

                    //if(this.accessToken) this.network_getGraphqlData(this.data)
                    
                    this.firstLoadedFlag = true
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            network_getAvailableRef() {
                if(this.switchBranchOrTagModalTab == 'branches') {
                    this.network_getAvailableBranches()
                }else{
                    this.network_getAvailableTags()
                }
            },
            async network_getAvailableBranches() {
                if(this.modalAvailableBranches.loading) return
                if(this.modalAvailableBranches.data.length > 0) return
                try{
                    this.modalAvailableBranches.loading = true
                    let url = api.API_REPOSITORY_COMMITS_AVAILABLE_BRANCHES({
                        owner: this.owner(),
                        repo: this.repo(),
                        branch: this.currentRef
                    })
                    let res = await commonGet(url)
                    this.modalAvailableBranches.data = this.parseBranchesFromHTML(res.data)
                }catch(e) {
                    console.log(e)
                }finally{
                    this.modalAvailableBranches.loading = false
                }
            },
            async network_getAvailableTags() {
                if(this.modalAvailableTags.loading) return
                if(this.modalAvailableTags.data.length > 0) return
                try{
                    this.modalAvailableTags.loading = true
                    let url = api.API_REPOSITORY_COMMITS_AVAILABLE_TAGS({
                        owner: this.owner(),
                        repo: this.repo(),
                        branch: this.currentRef
                    })
                    let res = await commonGet(url)
                    this.modalAvailableTags.data = this.parseTagsFromHTML(res.data)
                }catch(e) {
                    console.log(e)
                }finally{
                    this.modalAvailableTags.loading = false
                }
            },
            parseBranchesFromHTML(HTML) {
                let pattern = /<span class="(?:flex-1 )?break-word" data-menu-button-text data-filter-item-text>(.*)<\/span>/g
                let execResult
                let branches = []
                while((execResult = pattern.exec(HTML)) != null) {
                    if(execResult[1]) branches.push(execResult[1])
                }
                return branches
            },
            parseTagsFromHTML(HTML) {
                let pattern = /<span class="css-truncate css-truncate-overflow" title="(?:.*)" >\n\s*(.*)\n\s*<\/span>/g
                let execResult
                let tags = []
                while((execResult = pattern.exec(HTML)) != null) {
                    if(execResult[1])tags.push(execResult[1])
                }
                return tags
            },
       /*      changePage(goPrevPageFlag) {
                let queryStr = util_queryParse.querify({
                    ...this.$route.query,
                    page: goPrevPageFlag ? this.page - 1 : (this.page ? parseInt(this.page) + 1 : 2)
                })
                this.$router.push(`${this.$route.path}?${queryStr}`)
            }, */
            routerWithRef(ref) {
                this.closeModal()
                this.$router.push(`/${this.owner()}/${this.repo()}/commits/${ref}/${this.path}`)
            },
            switchModalTab(payload) {
                this.switchBranchOrTagModalTab = payload
                this.network_getAvailableRef()
            },
            
        },
        components: {
            CommonLoading,
            CommitGroup,
            Modal,
            SelectMenuItem,
            LoadingIconEx,
            CommonLoadingWrapper,
            Breadcrumb,
            SimplePaginationRest,
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

</style>