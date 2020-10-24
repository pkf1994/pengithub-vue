<template>
    <CommonLoadingWrapper 
    :loading="!repoBasicInfo().node_id || readme.loading" 
    :position="!repoBasicInfo().node_id ? 'center' : 'corner'"
    class="px-3">
        <FileNavigation class="d-flex flex-items-start flex-justify-between position-relative">
            <button class="btn css-truncate text-gray" :disabled="!currentRef"  @click="() => showModal('switchBranchOrTagModal')">
                <svg v-if="refType == 'branch'" height="16" class="octicon-git-branch text-gray v-align-text-bottom" text="gray" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"></path></svg>
                <svg v-else-if="refType == 'tag'" height="16" class="octicon-tag text-gray v-align-text-bottom" text="gray" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z"></path></svg>
                <span class="css-truncate-target" data-menu-button="">{{currentRef || '...'}}</span>
                <span class="dropdown-caret"></span>
            </button>

            <span v-if="accessToken" class="btn d-inline-block" @click="() => showModal('popover')">
                <svg height="16" class="octicon-kebab-horizontal v-align-text-bottom" aria-label="More options" viewBox="0 0 16 16" version="1.1" width="16" role="img"><path d="M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm13 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>
            </span>
             <Popover ref="popover" :popoverStyle="{right: 0, top: 'calc(100% + 10px)', width: '160px',paddingTop: '8px', paddingBottom: '8px'}">
                    <div>
                        <router-link class="dropdown-item" :to="`/${owner}/${repo}/find/${currentRef}`">
                            Go to file
                        </router-link>
                    </div>
                    <div class="dropdown-divider"></div>
                         <router-link class="dropdown-item" :to="`/${owner}/${repo}/new/${currentRef}`">
                            Create new file
                        </router-link>
            </Popover>
        </FileNavigation>

        <AnimatedHeightWrapper>
            <div v-if="path" class="pt-3">
                <FilePath class="file-path text-normal flex-auto text-bold">
                    <router-link :to="`/${owner}/${repo}`">{{repo}}</router-link>&nbsp;/&nbsp;<Breadcrumb :spaceArround="true" :routePath="breadcrumbRoutePath" :displayPath="path && path.replace(/^\//,'').replace(/\/$/,'')"/>
                </FilePath>
            </div> 
        </AnimatedHeightWrapper>

        <keep-alive>
            <router-view class="my-3"></router-view>
        </keep-alive>

        <Readme v-if="!(!readme.data && !readme.loading) && !path && !allBranchesAndTags.loading" class="read-me Box">
            <div class="Box-header d-flex flex-items-center flex-justify-between bg-white border-bottom-0">
                <h2 class="Box-title pr-3">
                    README.md
                </h2>
            </div>

            <div class="Box-body px-5 pb-5">
                <Skeleton v-if="!readme.data && readme.loading">
                    <SkeletonRectangle :height="28" style="width: 30%"></SkeletonRectangle>
                    <SkeletonRectangle :height="18" style="width: 100%" class="mt-3"></SkeletonRectangle>
                    <SkeletonRectangle :height="18" style="width: 100%" class="mt-3"></SkeletonRectangle>
                    <SkeletonRectangle :height="18" style="width: 100%" class="mt-3"></SkeletonRectangle>
                    <SkeletonRectangle :height="18" style="width: 80%" class="mt-3"></SkeletonRectangle>
                </Skeleton>
                <article class="markdown-body entry-content container-lg" v-else v-html="readme.data">

                </article>
            </div>
        </Readme>

        <AnimatedHeightWrapper>
            <Releases class="py-4" v-if="releases.data && !path && !allBranchesAndTags.loading">
                <h2 class="h4 mb-3">
                    <router-link class="link-gray-dark no-underline " :to="`/${owner}/${repo}/releases`">
                        Releasess
                        <span class="Counter" v-if="releases.totalCount">{{releases.totalCount}}</span>
                    </router-link>
                </h2>

                <router-link v-if="releases.data.tag_name" class="link-gray-dark d-flex no-underline" :to="`/${owner}/${repo}/releases/tag/${releases.data.tag_name}`">
                    <svg height="16" class="octicon octicon-tag flex-shrink-0 mt-1 text-green" mt="1" class_names="flex-shrink-0" color="green" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z"></path></svg>
                    <div class="ml-2 min-width-0">
                        <div class="d-flex">
                            <span class="css-truncate css-truncate-target text-bold mr-2" style="max-width: none;">{{releases.data.tag_name}}</span>
                            <span class="flex-shrink-0 Label Label--outline Label--outline-green">
                                Latest
                            </span>
                        </div>
                        <div class="text-small text-gray">
                            <span class="no-wrap" >{{releases.data.created_at | getDateDiff}}</span>
                        </div>
                    </div>
                </router-link>

                <div class="mt-3" v-if="releases.totalCount > 1">
                    <router-link class="text-small" :to="`/${owner}/${repo}/releases`">
                        + {{releases.totalCount - 1}} releases
                    </router-link>
                </div>

                <div v-else-if="!releases.loading" class="text-small">No releases published</div>

                <div class=" text-small" v-if="viewer.login == owner">
                    <router-link :to="`/${owner}/${repo}/releases/new`">Create a new release</router-link>
                </div>
            </Releases>
        </AnimatedHeightWrapper>
        
        <Contributors class="py-4 border-top" v-if="contributors.data.length > 0 && !path && !allBranchesAndTags.loading">
            <h2 class="h4 mb-3">
                <router-link class="link-gray-dark no-underline " :to="`/${owner}/${repo}/contributors`">
                    Contributors
                    <span class="Counter" v-if="contributors.totalCount">{{contributors.totalCount}}</span>
                </router-link>
            </h2>
            <ul class="list-style-none d-flex flex-wrap mb-n2">
                <li class="mb-2 mr-2" v-for="item in contributors.data" :key="item.node_id">
                    <router-link :to="`/${item.login}`">
                        <ImgWrapper class="d-block avatar-user">
                            <img class="d-block avatar-user" :src="item.avatar_url" width="32" height="32" :alt="`@${item.login}`">
                        </ImgWrapper>
                    </router-link>
                </li>
            </ul>   

             <div class="mt-3" v-if="contributors.totalCount > 11">
                    <router-link class="text-small" :to="`/${owner}/${repo}/contributors`">
                        + {{contributors.totalCount - 11 | thousands}} contributors
                    </router-link>
                </div>
        </Contributors>

        <Languages class="py-4 border-top" v-if="languagesDistribution && languagesDistribution.length > 0 && !path && !allBranchesAndTags.loading">
            <h2 class="h4 mb-3">
                Languages
            </h2>

            <div class="mb-2">
                <span class="Progress">
                    <span v-for="item in languagesDistribution" :key="item.language" class="Progress-item" :style="{width:`${item.distribution * 100}%`, backgroundColor:item.color}"></span>
                </span>
            </div>

            <ul class="list-style-none">
                <li v-for="item in languagesDistribution" :key="item.language" class="d-inline">
                    <router-link :to="`/search/code?q=repo:${owner}/${repo} language:${item.language}`" class="d-inline-flex flex-items-center flex-nowrap link-gray no-underline text-small mr-3">
                        <svg class="octicon octicon-dot-fill mr-2" :style="{color:item.color}" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8z"></path></svg>
                        <span class="text-gray-dark text-bold mr-1">{{item.language}}</span>
                        <span>{{(item.distribution * 100).toFixed(1)}}%</span>
                    </router-link>
                </li>
                <li>
                    <span class="d-inline-flex flex-items-center flex-nowrap link-gray no-underline text-small mr-3">
                        <svg class="octicon octicon-dot-fill mr-2" style="color:#ededed" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8z"></path></svg>
                        <span class="text-gray-dark text-bold mr-1">others</span>
                        <span>{{((1 - languages.distributionSequenceSum) * 100).toFixed(1)}}%</span>
                    </span>
                </li>
            </ul>
        </Languages>

        <Modal ref="switchBranchOrTagModal" title="Switch branches/tags" :modalStyle="{height:'80vh'}" @show="network_getModalAvailableRef" :loading="loadingModalData">
            <div class="select-menu-text-filter">
                <div class="p-3">
                    <input type="text" v-model="selectRefModal.searchQuery" class="form-control" placeholder="Filter branches/tags" autofocus="" autocomplete="off"/>
                </div>
                <ModalTab class="SelectMenu-tabs" style="background-color: #f6f8fa;">
                    <button class="SelectMenu-tab py-2" style="font-size:14px" @click="() => switchModalTab('branches')" :class="{'active-modal-tab':selectRefModal.tab == 'branches'}">Branches</button>
                    <button class="SelectMenu-tab py-2" style="font-size:14px" @click="() => switchModalTab('tags')" :class="{'active-modal-tab':selectRefModal.tab == 'tags'}">Tags</button>
                </ModalTab>
            </div>
            <div v-if="!loadingModalData" style="overflow:auto">
                <transition-group v-if="selectRefModal.tab == 'branches'" name="fade-group" appear>
                    <SelectMenuItem :key="repoBasicInfo().default_branch" v-if="repoBasicInfo().default_branch" @click.native="() => routerWithRef(repoBasicInfo().default_branch)" :selected="currentRef == repoBasicInfo().default_branch">
                        <span class="flex-1">{{repoBasicInfo().default_branch}}</span>    
                        <span class="Label Label--gray flex-self-start">default</span>
                    </SelectMenuItem>
                    <SelectMenuItem @click.native="() => routerWithRef(item)" v-for="item in modalFilteredAvailableBranches" :key="item" :selected="currentRef == item">
                        <span>{{item}}</span>    
                    </SelectMenuItem>
                </transition-group>
                <transition-group v-if="selectRefModal.tab == 'tags'" name="fade-group" appear>
                    <SelectMenuItem @click.native="() => routerWithRef(item)" v-for="item in modalFilteredAvailableTags" :key="item" :selected="currentRef == item">
                        <span>{{item}}</span>    
                    </SelectMenuItem>
                </transition-group>
            </div>
            <footer v-if="!loadingModalData" class="modal-footer SelectMenu-footer">
                <router-link v-if="selectRefModal.tab == 'branches'" :to="`/${owner}/${repo}/branches`">
                    View all branches
                </router-link>
                <router-link v-if="selectRefModal.tab == 'tags'" :to="`/${owner}/${repo}/tags`">
                    View all tags
                </router-link>
            </footer>
        </Modal>

    </CommonLoadingWrapper>
</template>
<script>
    import styled from 'vue-styled-components'
    import{CommonLoadingWrapper,ImgWrapper,AnimatedHeightWrapper,Modal,SelectMenuItem,LoadingIconEx,Breadcrumb,Popover,SkeletonCircle,SkeletonRectangle} from '@/components'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import {authRequiredGet,authRequiredGitHubGraphqlApiQuery,commonGet } from '@/network'
    import {RouteUpdateAwareMixin,ComponentActiveAwareMixin} from '@/mixins'
    import {util_analyseFileType} from '@/util'
    import {WithRefDistinguishMixin} from '../../components'
    import {ContentListItem,FileBrowser} from './components'
    let parse = require('parse-link-header')
    import Vue from 'vue'
    export default {
        name: 'repository_code_main',
        inject: ['repoBasicInfo'],
        mixins: [RouteUpdateAwareMixin,WithRefDistinguishMixin,ComponentActiveAwareMixin],
        provide() {
            return {
                path: () => this.path,
                currentRef: () => this.currentRef
            }
        },
        data() {
            return {
                readme: {
                    data: '',
                    loading: false,
                    show: false
                },
                releases: {
                    data: undefined,
                    totalCount: undefined,
                    loading: false
                },
                contributors: {
                    data: [],
                    totalCount: undefined,
                    loading: false
                },
                languages: {
                    data: undefined,
                    distributionSequenceSum: 0,
                    loading: false
                },
                selectRefModal: {
                    tab: "branches",
                    searchQuery: '',
                    branches: {
                        data: [],
                        loading: false
                    },
                    tags: {
                        data: [],
                        loading: false
                    }
                },
            }
        },
        computed: {
            owner() {
                return this.$route.params.owner
            },
            repo() {
                return this.$route.params.repo
            },
            defaultRef() {
                return this.repoBasicInfo().default_branch
            },
            languagesDistribution() {
                if(!this.languages.data) return 

                //计算总数
                let totalCodeLine = 0
                let codeLineValueArr = Object.values(this.languages.data)
                codeLineValueArr.forEach(i => {
                    totalCodeLine += i
                })

                let distributionObj = {}
                for(let languageKey in this.languages.data) {
                    distributionObj[languageKey] = this.languages.data[languageKey] / totalCodeLine
                }

                let distributionEntriesRaw = Object.entries(distributionObj)

                distributionEntriesRaw.sort((a,b) => {
                    return b[1] - a[1]
                })

                let distributionEntries = []
                let distributionSequenceSum = 0
                try{
                    distributionEntriesRaw.forEach(i => {
                        if(distributionSequenceSum < 0.9) {
                            distributionEntries.push({
                                language: i[0],
                                distribution: i[1],
                                color: util_analyseFileType.getColorOfLanguage(i[0])
                            })
                        }else{
                            this.languages.distributionSequenceSum = distributionSequenceSum
                            throw new Error('abort')
                        }
                        distributionSequenceSum += i[1]
                    })
                }catch(e) {
                    //do nothing
                }

                return distributionEntries
            },
            modalFilteredAvailableBranches() {
                return this.selectRefModal.branches.data.filter(i => {
                    return (i.toLowerCase().indexOf(this.selectRefModal.searchQuery.toLowerCase()) != -1) && (i != this.repoBasicInfo().default_branch)
                })
            },
            modalFilteredAvailableTags() {
                return this.selectRefModal.tags.data.filter(i => {
                    return i.toLowerCase().indexOf(this.selectRefModal.searchQuery.toLowerCase()) != -1
                })
            },
            prevContentsRouterLink() {
                if(this.path) return this.$route.path.replace(/\/[^\/]*$/g,'')
            },
            breadcrumbRoutePath() {
                let regExp = new RegExp('^(\/[^\/]+\/[^\/]+\/)file')
                let match = this.$route.path.match(regExp)
                if(match) {
                    return this.$route.path.replace(regExp,`${match[1]}dir`)
                }
            },
            loadingModalData() {
                return (this.selectRefModal.tab == 'branches' && this.selectRefModal.branches.loading) || (this.selectRefModal.tab == 'tags' && this.selectRefModal.tags.loading)
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            network_getData() {
                this.network_getAllBranchesAndTags()
                this.network_getReleases()
                this.network_getContributors()
                this.network_getLanguages()
                if(!this.currentRef) return
                //this.network_getBranch()
                this.network_getReadme()
            },
            /* async network_getBranch() {
                try{
                    this.ref.loading = true
                    let url = api.API_BRANCH({
                        repo: this.repo,
                        owner: this.owner,
                        branch: this.currentRef
                    })
                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_branch')
                        }
                    )
                    this.ref.data = res.data  
                   
                    this.ref.loading = false
                }catch(e) {
                    console.log(e)
                    if(e.response && e.response.status == 404) {
                        this.network_getTag()
                    }else{
                        this.ref.loading = false
                    }
                }
            }, */
            /* async network_getTag() {
                try{
                    this.ref.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_tag')
                    let url_gitTag = api.API_REPOSITORY_GIT_TAG({
                        repo: this.repo,
                        owner: this.owner,
                        tag: this.currentRef
                    })
                    let res_gitTag = await authRequiredGet(url_gitTag,{cancelToken})

                    let url_tag = res_gitTag.data.object && res_gitTag.data.object.url
                    
                    if(url_tag) {
                        let res_tag = await authRequiredGet(url_tag,{cancelToken})
                        this.ref.data = res_tag.data
                    }
                }catch(e) {
                    console.log(e)
                }finally{
                    this.ref.loading = false
                    this.latestCommit.loading = false
                }
            }, */
            triggerShowLatestCommitMessage() {
                this.latestCommit.showMessage = !this.latestCommit.showMessage
            },
            async network_getReadme() {
                try{
                    this.readme.loading = true
                    let url = api.API_README({
                        repo: this.repo,
                        owner: this.owner,
                        params: {
                            ref: this.currentRef
                        }
                    })
                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_read_me'),
                            headers: {
                                'Accept': "application/vnd.github.VERSION.html"
                            }
                        }
                    )
                    this.readme.data = res.data

                    setTimeout(() => {
                        this.readme.show = true
                    }, 500)
                }catch(e) {
                    console.log(e)
                }finally{
                    this.readme.loading = false
                }
            },
            async network_getReleases() {
                try{
                    this.releases.loading = true
                    let url = api.API_REPOSITORY_RELEASES({
                        owner: this.owner,
                        repo: this.repo,
                        params: {
                            per_page: 1
                        }
                    })
                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_releases')
                        }
                    )

                    this.releases.data = res.data[0] || {}

                    let releasesCountHolder = parse(res.headers.link) || {}
                    this.releases.totalCount = releasesCountHolder.last ? releasesCountHolder.last.page : res.data.length 
                }catch(e) {
                    console.log(e)
                }finally{
                    this.releases.loading = false
                }
            },
            async network_getContributors() {
                try{
                    this.contributors.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_contributors')
                    let url_contributors = api.API_REPOSITORY_CONTRIBUTORS({
                        repo: this.repo,
                        owner: this.owner,
                        params: {
                            per_page: 11
                        }
                    })
                    let url_contributorsCount = api.API_REPOSITORY_CONTRIBUTORS({
                        repo: this.repo,
                        owner: this.owner,
                        params: {
                            per_page: 1
                        }
                    })

                    let res = await Promise.all([
                        authRequiredGet(url_contributors,{cancelToken}),
                        authRequiredGet(url_contributorsCount,{cancelToken}),
                    ])

                    this.contributors.data = res[0].data

                    let contributorsCountHolder = parse(res[1].headers.link) || {}
                    this.contributors.totalCount = contributorsCountHolder.last ? contributorsCountHolder.last.page : res[1].data.length
                }catch(e) { 
                    console.log(e)
                }finally{
                    this.contributors.loading = false
                }
            },
            async network_getLanguages() {
                try{
                    this.languages.loading = true
                    let url = api.API_REPOSITORY_LANGUAGES({
                        repo: this.repo,
                        owner: this.owner
                    })

                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_languages')
                        }
                    )

                    this.languages.data = res.data
                }catch(e) {
                    console.log(e)
                }finally{
                    this.languages.loading = false
                }
            },
            _languagesDistribution() {
                if(!this.languages.data) return 

                //计算总数
                let totalCodeLine = 0
                let codeLineValueArr = Object.values(this.languages.data)
                codeLineValueArr.forEach(i => {
                    totalCodeLine += i
                })

                let distributionObj = {}
                for(let languageKey in this.languages.data) {
                    distributionObj[languageKey] = this.languages.data[languageKey] / totalCodeLine
                }

                let distributionEntries = Object.entries(distributionObj)

                distributionEntries.sort((a,b) => {
                    return a[1] - b[1]
                })

                return distributionEntries
            },
            network_getModalAvailableRef() {
                if(this.selectRefModal.tab == 'branches') {
                    this.network_getModalAvailableBranches()
                }else{
                    this.network_getModalAvailableTags()
                }
            },
            async network_getModalAvailableBranches() {
                if(this.selectRefModal.branches.loading) return
                if(this.selectRefModal.branches.data.length > 0) return
                try{
                    this.selectRefModal.branches.loading = true
                    let url = api.API_REPOSITORY_AVAILABLE_BRANCHES({
                        owner: this.owner,
                        repo: this.repo,
                        ref: this.currentRef,
                        sourceController: 'files',
                        path: this.path,
                        sourceAction: 'disambiguate',
                    })
                    let res = await commonGet(url)
                    this.selectRefModal.branches.data = this.parseBranchesFromHTML(res.data)
                }catch(e) {
                    console.log(e)
                }finally{
                    this.selectRefModal.branches.loading = false
                }
            },
            async network_getModalAvailableTags() {
                if(this.selectRefModal.tags.loading) return
                if(this.selectRefModal.tags.data.length > 0) return
                try{
                    this.selectRefModal.tags.loading = true
                    let url = api.API_REPOSITORY_AVAILABLE_TAGS({
                        owner: this.owner,
                        repo: this.repo,
                        ref: this.currentRef,
                        sourceController: 'files',
                        sourceAction: 'disambiguate',
                        path: this.path,
                    })
                    let res = await commonGet(url)
                    this.selectRefModal.tags.data = this.parseTagsFromHTML(res.data)
                }catch(e) {
                    console.log(e)
                }finally{
                    this.selectRefModal.tags.loading = false
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
            routerWithRef(ref) {
                this.closeModal()
                this.$router.push(`/${this.owner}/${this.repo}/tree/${ref}/${this.path || ''}`)
            },
            switchModalTab(payload) {
                this.selectRefModal.tab = payload
                this.network_getModalAvailableRef()
            },
           /*  generateRouterMeta() {
                return `${this.owner}/${this.repo}/${this.currentRef}`
            }, */
            routeResetHook(to,from){
                if(to.path.indexOf(from.path) == 0 || from.path.indexOf(to.path) == 0) return
                Object.assign(this.$data,this.$options.data())
            },
            showContents() {
                this.contents.show = true
            },
            parseLatestCommitStatus(HTML) {
                let failurePattern = /octicon-x/g
                let successPattern = /octicon-check/g
                if(HTML.match(failurePattern) != null) {
                    this.latestCommit.status = 'FAILURE'
                }else if(HTML.match(successPattern) != null) {
                    this.latestCommit.status = 'SUCCESS'
                }
            },
            generateRouterMeta() {
                if(!this.componentActive) return undefined
                return `${this.owner}/${this.repo}`
            },
        },  
        watch: {
            currentRef(newOne,oldOne) {
                if(newOne && !oldOne)  this.network_getReadme()
            }
        },
        components: {
            CommonLoadingWrapper,
            ImgWrapper,
            AnimatedHeightWrapper,
            Modal,
            SelectMenuItem,
            LoadingIconEx,
            Breadcrumb,
            ContentListItem,
            Popover,
            SkeletonCircle,
            SkeletonRectangle,
            FileBrowser,
            Container: styled.div``,
            FileNavigation: styled.div``,
            Readme: styled.div``,
            Releases: styled.div``,
            Contributors: styled.div``,
            Languages: styled.div``,
            Pagination: styled.div``,
            ModalTab: styled.div``,
            FilePath: styled.div``,
            CompareWithDefaultRef: styled.div``,
            Skeleton: styled.div``,
        }
    }
</script>

<style lang="scss" >
@import 'node_modules/@primer/css/markdown/index.scss';
</style>

<style scoped lang="scss">
@import 'node_modules/@primer/css/truncate/index.scss';
@import 'node_modules/@primer/css/dropdown/index.scss';
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
@import 'node_modules/@primer/css/layout/index.scss';
@import 'node_modules/@primer/css/labels/index.scss';
@import 'node_modules/@primer/css/progress/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/select-menu/index.scss';

.read-me{
    margin-right: -15px;
    margin-left: -15px;
    border-left: 0;
    border-right: 0;
    border-radius: 0;
    overflow: hidden;
}
.Label{
    border-radius: 2em;
    line-height: 18px;   
    padding: 0 7px;
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

.loading-contents{
    background: white;
    opacity: .4;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
.file-path{
    font-size: 16px;
    color: #586069;
}

.loading-contents-inner{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    max-height: 240px;
}


</style>
