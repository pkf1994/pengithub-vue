<template>
    <WithSignInNoticeWrapper ref="signInNotice">
        <CommonLoadingWrapper :loading="allBranchesAndTags.loading || loading" class="py-4 px-3">
                <RowOne class="d-flex flex-justify-between width-full width-md-auto">
                    <button class="btn btn-sm select-menu-button" @click="() => showModal('switchBranchOrTagModal')">
                        <i>{{refType | capitalize}}:</i>
                        <span class="end-with-triangle branch" data-menu-button="">{{currentRef}}</span>
                    </button>

                    <button class="btn btn-sm" id="file-detail-copy-btn" :data-clipboard-text="location.href"> 
                        Copy path
                    </button>
                </RowOne>

                <FilePath class="file-path text-normal my-2 flex-auto text-bold">
                    <router-link :to="`/${owner()}/${repo()}`">{{repo()}}</router-link>&nbsp;/&nbsp;<Breadcrumb :spaceArround="true" :routePath="breadcrumbRoutePath" :displayPath="path && path.replace(/^\//,'').replace(/\/$/,'')"/>
                </FilePath>

                <transition name="fade" appear>
                    <ContributionMessage v-if="data || html || raw"></ContributionMessage> 
                </transition>

                <transition name="fade" appear>
                    <Content  v-if="data || html || raw"></Content>
                </transition>

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
    </WithSignInNoticeWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Breadcrumb,WithSignInNoticeWrapper,Modal,SelectMenuItem,LoadingIconEx,CommonLoadingWrapper} from '@/components'
    import ClipboardJS from 'clipboard'
    import {ContributionMessage,Content} from './components'
    import { cancelAndUpdateAxiosCancelTokenSource,authRequiredGitHubGraphqlApiQuery,authRequiredGet   } from '@/network'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import * as graphql from '../graphql'
    import * as api from '@/network/api'
    let parse = require('parse-link-header')
    export default {
        name: 'repository_code_file_detail_page',
        mixins: [RouteUpdateAwareMixin],
        inject: ['owner','repo','repoBasicInfo'],
        provide() {
            return {
                lastCommit: () => this.lastCommit.data,
                contributors: () => this.contributors.data,
                data:() => this.data,
                html:() => this.html,
                raw:() => this.raw,
                byteSize:() => this.byteSize,
                isBinary:() => this.isBinary,
            }
        },
        data() {
            return {
                data: '',
                html: '',
                raw: '',
                byteSize: 0,
                loading: false,
                lastCommit: {
                    data: {},
                    loading: false
                },
                contributors: {
                    data: [],
                    loading: false
                },
                allBranchesAndTags: {
                    branches: [],
                    tags: [],
                    loading: false
                },
                switchBranchOrTagModalTab: "branch",
                switchBranchOrTagModalSearchQuery: "",
                refType: 'branch',
                isBinary: false
            }
        },
        async mounted() {
            console.log(this.accessToken)
            if(!this.accessToken) {
                this.$refs.signInNotice.show()
            }else{
                await this.network_getAllBranchesAndTags()
                this.network_getData() 
            }
            this.initClipboard()
        },
        computed: {
            location() {
                return location
            },
            breadcrumbRoutePath() {
                let regExp = new RegExp('^(\/[^\/]+\/[^\/]+\/)file')
                let match = this.$route.path.match(regExp)
                if(match) {
                    return this.$route.path.replace(regExp,`${match[1]}dir`)
                }
            },
            path() {
                if(!this.$route.params.pathMatch) return
                if(this.$route.params.pathMatch.indexOf('/') === -1) return ''
                if(!this.currentRef) return undefined
                return this.$route.params.pathMatch.replace(this.currentRef,'')
            },
            currentRef() {
                if(!this.$route.params.pathMatch) return 
                if(this.$route.params.pathMatch.match(/^[^\/]+\/?$/)) return this.$route.params.pathMatch.replace('/','')
                if(this.allBranchesAndTags.branches.length == 0) return
                let ref
                let routePathMatch = this.$route.params.pathMatch
                this.allBranchesAndTags.branches.forEach(item => {
                    let regExp =  new RegExp(`^(${item.ref.replace('refs/heads/','')})(\/\.*)?`)
                    let refMatch = routePathMatch.match(regExp)
                    if(refMatch){
                        if(!ref) ref = refMatch[1]
                        this.refType = 'branch'
                        if(refMatch[1].length > ref.length) ref = refMatch[1]
                    }
                })
                this.allBranchesAndTags.tags.forEach(item => {
                    let regExp =  new RegExp(`^(${item.ref.replace('refs/tags/','')})(\/\.*)?`)
                    let refMatch = routePathMatch.match(regExp)
                    if(refMatch){
                        if(!ref) ref = refMatch[1]
                        this.refType = 'tag'
                        if(refMatch[1].length > ref.length) ref = refMatch[1]
                    }
                })
                return ref
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
        methods: {
            async network_getData() {
                if(!this.currentRef){
                    this.loading = true
                    return
                }
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.name)

                    let graphql_contentAndLastCommitAndCommitHistory = graphql.GRAPHQL_REPOSITORY_CONTENT_AND_LAST_COMMIT_AND_COMMIT_HISTORY({
                        repo: this.repo(),
                        owner: this.owner(),
                        path: this.path,
                        branch: this.currentRef,
                    })
                    const res = await authRequiredGitHubGraphqlApiQuery(graphql_contentAndLastCommitAndCommitHistory,{cancelToken})

                    if(!res.data.data.repository.content) {
                        this.emitNotFoundEvent(this.$refs.signInNotice.$el)
                    }

                    this.byteSize = res.data.data.repository.content.byteSize
                    this.isBinary = res.data.data.repository.content.isBinary

                    this.lastCommit.data = res.data.data.repository.commit.history.nodes[0]
                    
                    //根据提交历史提取contributors
                    let contributors = []
                    res.data.data.repository.commitHistory.history.nodes.forEach(item => {
                        if(!(contributors.some(_item => item.author.user && _item.user && _item.user.login === item.author.user.login)) && item.author.user) {
                            contributors.push(item.author)
                        }
                    })
                    this.contributors.data = contributors

                    if(!res.data.data.repository.content.isBinary) {
                        this.data = res.data.data.repository.content.text
                        //查看是否返回html
                        const url = api.API_CONTENTS({
                            owner: this.owner(),
                            repo: this.repo(),
                            path: this.path,
                            branch: this.currentRef
                        })
                        const res_html = await authRequiredGet(url,{
                            headers: {
                                "Accept":"application/vnd.github.VERSION.html"
                                 }
                            })
                        if(res_html.status === 200) {
                            this.html = res_html.data
                        }
                    }else{
                        this.raw = `https://github.com/${this.owner()}/${this.repo()}/file/${this.currentRef}/${this.path}?raw=true`
                    }

                }catch(e){
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            async network_getAllBranchesAndTags() {
                try{
                    this.allBranchesAndTags.loading = true
                    await Promise.all([
                        this.network_getAllBranches(),
                        this.network_getAllTags()
                    ])
                }catch(e) {
                    console.log(e)
                }finally{
                    this.allBranchesAndTags.loading = false
                }
            },
            async network_getAllBranches() {
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
            },
            async network_getAllTags() {
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
            },
            initClipboard() {
                let clip = new ClipboardJS('#file-detail-copy-btn');
                clip.on('success',e => {
                    this.$toast("Clip OK!")
                })
            },
            switchModalTab(payload) {
                this.switchBranchOrTagModalTab = payload
            },
            routerWithRef(ref) {
                this.closeModal()
                let regExp = new RegExp(`^/${this.owner()}/${this.repo()}/file/${this.currentRef}`)
                let targetRouterLink = this.$route.fullPath.replace(regExp,`/${this.owner()}/${this.repo()}/file/${ref}`)
                this.$router.push(targetRouterLink)
            },
            showModal(modalRef) {
                if(this.$refs[modalRef]) this.$refs[modalRef].show = true
            },
            closeModal() {
                for(let key in this.$refs) {
                    this.$refs[key].show = false
                }
            },
        },
        components: {
            Breadcrumb,
            WithSignInNoticeWrapper,
            ContributionMessage,
            Content,
            Modal,
            LoadingIconEx,
            SelectMenuItem,
            CommonLoadingWrapper,
            Container: styled.div``,
            RowOne: styled.div``,
            CopyPath: styled.div``,
            FilePath: styled.h2``,
            ModalTab: styled.h2``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/truncate/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/select-menu/index.scss';
@import 'node_modules/@primer/css/labels/index.scss';
.file-path{
    font-size: 16px;
    color: #586069;
}
.branch{
    display: inline-block;
    max-width: 125px;
    vertical-align: top;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
</style>