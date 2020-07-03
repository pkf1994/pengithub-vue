<template>
    <CommonLoadingWrapper 
    :loading="ref.loading || !repoBasicInfo().node_id || readme.loading || commitCount.loading || latestCommit.loading" 
    :position="(ref.loading || !repoBasicInfo().node_id) ? 'center' : 'corner'"
    class="px-3">
        <FileNavigation class="d-flex flex-items-start flex-justify-between position-relative">
            <button class="btn css-truncate text-gray" :disabled="!currentRef"  @click="() => showModal('switchBranchOrTagModal')">
                <svg v-if="refType == 'branch'" height="16" class="octicon-git-branch text-gray v-align-text-bottom" text="gray" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"></path></svg>
                <svg v-else-if="refType == 'tag'" height="16" class="octicon-tag text-gray v-align-text-bottom" text="gray" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z"></path></svg>
                <span class="css-truncate-target" data-menu-button="">{{currentRef || '...'}}</span>
                <span class="dropdown-caret"></span>
            </button>

            <span class="btn d-inline-block" @click="() => showModal('popover')">
                <svg height="16" class="octicon-kebab-horizontal v-align-text-bottom" aria-label="More options" viewBox="0 0 16 16" version="1.1" width="16" role="img"><path d="M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm13 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>
            </span>
             <Popover ref="popover" :popoverStyle="{right: 0, top: 'calc(100% + 10px)', width: '160px',paddingTop: '8px', paddingBottom: '8px'}">
                    <div>
                        <router-link class="dropdown-item" :to="`/${owner}/${repo}/find/${currentRef}`">
                            Go to file
                        </router-link>
                    </div>
                    <div class="dropdown-divider"></div>
                         <router-link class="dropdown-item" :to="`/${owner}/${repo}/find/${currentRef}`">
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

        <AnimatedHeightWrapper>
            <div v-if="currentRef && defaultRef && (currentRef != defaultRef) && (compareWithDefaultRef.data.status || compareWithDefaultRef.message)" class="pt-3">
                <CompareWithDefaultRef class="Box Box-body bg-gray-light">
                    <div v-if="compareWithDefaultRef.data.status">
                        This branch is
                        <span v-if="compareWithDefaultRef.data.ahead_by > 0">{{compareWithDefaultRef.data.ahead_by}} {{compareWithDefaultRef.data.ahead_by > 1 ? 'commits' : 'commit'}} ahead</span><span v-if="compareWithDefaultRef.data.ahead_by && compareWithDefaultRef.data.behind_by">,</span>
                        <span v-if="compareWithDefaultRef.data.behind_by > 0">{{compareWithDefaultRef.data.behind_by}} {{compareWithDefaultRef.data.behind_by > 1 ? 'commits' : 'commit'}} behind</span> 
                        dev.
                    </div>
                    <div v-else-if="compareWithDefaultRef.message" class="d-flex flex-auto">
                        {{compareWithDefaultRef.message}}
                    </div>
                </CompareWithDefaultRef>
            </div>
        </AnimatedHeightWrapper>
      
        <FileBrowser class="Box my-3">
            <div class="Box-header Box-header--blue position-relative d-flex flex-items-center flex-wrap">
                <router-link v-if="latestCommit.data.author && latestCommit.data.author.avatar_url" class="avatar avatar-user d-block" :to="`/${latestCommit.data.author.login}`">
                    <ImgWrapper>
                        <img width="24" height="24" :src="latestCommit.data.author.avatar_url" :alt="`@${latestCommit.data.author.login}`">
                    </ImgWrapper>
                </router-link>

                <div class="flex-1 d-flex flex-items-center ml-2 min-width-0">
                    <div class="css-truncate css-truncate-overflow text-gray" v-if="latestCommit.data.node_id">
                        <router-link v-if="latestCommit.data.author && latestCommit.data.author.login" class="user-mention" :to="`/${latestCommit.data.author.login}`">
                            {{latestCommit.data.author.login}}
                        </router-link>
                        committed
                        <span v-if="latestCommit.data.commit && latestCommit.data.commit.committer && latestCommit.data.commit.committer.date">
                            {{latestCommit.data.commit.committer.date | getDateDiff}}
                        </span>
                    </div>
                    <button v-if="latestCommit.data.commit && latestCommit.data.commit.message" class="ellipsis-expander js-details-target ml-2 d-inline-block " @click="triggerShowLatestCommitMessage">
                        …
                    </button>

                    <svg v-if="latestCommit.status && latestCommit.status.state == 'SUCCESS'" class="octicon text-green octicon-check v-align-middle flex-shrink-0 ml-2" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                    <svg v-else-if="latestCommit.status && latestCommit.status.state == 'FAILURE'" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true" class="octicon octicon-x v-align-middle text-red flex-shrink-0 ml-2"><path data-v-74bab622="" fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
                </div>

                <router-link v-if="commitCount.data !== undefined" :to="`/${owner}/${repo}/commits/${currentRef}`" class="link-gray-dark no-underline d-block ml-3">
                    <svg height="16" class="octicon octicon-history text-gray" text="gray" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.643 3.143L.427 1.927A.25.25 0 000 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 00.177-.427L2.715 4.215a6.5 6.5 0 11-1.18 4.458.75.75 0 10-1.493.154 8.001 8.001 0 101.6-5.684zM7.75 4a.75.75 0 01.75.75v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.75.75 0 017 8.25v-3.5A.75.75 0 017.75 4z"></path></svg>
                    <span>
                        <strong>
                            {{commitCount.data | thousands}}
                        </strong>
                        <!-- {{commitCount.data > 1 ? 'commits' : 'commit'}} -->
                    </span>
                </router-link>

                <!-- commit message -->
                <div class="pl-5 mt-2 width-full" v-if="latestCommit.data.commit && latestCommit.data.commit.message && latestCommit.showMessage">
                    <router-link class="link-gray-dark" :to="`/${owner}/${repo}/commits/${latestCommit.data.sha}`">
                        {{latestCommit.data.commit.message}}
                    </router-link>
                </div>
            </div>

            <div class="position-relative" :style="{minHeight: contents.show ? '120px':'auto'}" style="background:#fafbfc">
                <div v-if="!contents.show" class="Details-content--shown Box-footer d-md-none p-0" @click="showContents">
                    <button class="d-block btn-link js-details-target width-full px-3 py-2">
                        View code
                    </button>
                </div>
                
                <transition-group name="fade-group" appear>
                    <ContentListItem v-for="item in (contents.show ? contents.data : [])" :key="item.sha || item.type" :content="item" :currentRef="currentRef"></ContentListItem>
                </transition-group>

                <div v-if="contents.loading && contents.show" class="loading-contents">
                    <div class="loading-contents-inner d-flex flex-justify-center flex-items-center">
                        <LoadingIconEx class="loading-icon"></LoadingIconEx>
                    </div>
                </div>
            </div> 

            
        </FileBrowser>
       

        <Readme v-if="readme.data && !this.path" v-show="readme.show" class="read-me Box">
            <div class="Box-header d-flex flex-items-center flex-justify-between bg-white border-bottom-0">
                <h2 class="Box-title pr-3">
                    README.md
                </h2>
            </div>

            <div class="Box-body px-5 pb-5">
                <article class="markdown-body entry-content container-lg" v-html="readme.data">

                </article>
            </div>
        </Readme>

        <AnimatedHeightWrapper>
            <Releases class="py-4" v-if="releases.data && !this.path">
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
            </Releases>
        </AnimatedHeightWrapper>
        
        <Contributors class="py-4 border-top" v-if="contributors.data.length > 0 && !this.path">
            <h2 class="h4 mb-3">
                <router-link class="link-gray-dark no-underline " :to="`/${owner}/${repo}/contributors`">
                    Contributors
                    <span class="Counter" v-if="contributors.totalCount">{{contributors.totalCount}}</span>
                </router-link>
            </h2>
            <ul class="list-style-none d-flex flex-wrap mb-n2">
                <li class="mb-2 mr-2" v-for="item in contributors.data" :key="item.node_id">
                    <router-link :to="`/${item.login}`">
                        <img class="d-block avatar-user" :src="item.avatar_url" width="32" height="32" :alt="`@${item.login}`">
                    </router-link>
                </li>
            </ul>   

             <div class="mt-3" v-if="contributors.totalCount > 11">
                    <router-link class="text-small" :to="`/${owner}/${repo}/contributors`">
                        + {{contributors.totalCount - 11 | thousands}} contributors
                    </router-link>
                </div>
        </Contributors>

        <Languages class="py-4 border-top" v-if="languages.data && !this.path">
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

        <Modal ref="switchBranchOrTagModal" title="Switch branches/tags" :modalStyle="{height:'80vh'}" @show="network_getModalAvailableRef">
            <div class="select-menu-text-filter">
                <div class="p-3">
                    <input type="text" v-model="selectRefModal.searchQuery" class="form-control" placeholder="Filter branches/tags" autofocus="" autocomplete="off"/>
                </div>
                <ModalTab class="SelectMenu-tabs" style="background-color: #f6f8fa;">
                    <button class="SelectMenu-tab py-2" style="font-size:14px" @click="() => switchModalTab('branches')" :class="{'active-modal-tab':selectRefModal.tab == 'branches'}">Branches</button>
                    <button class="SelectMenu-tab py-2" style="font-size:14px" @click="() => switchModalTab('tags')" :class="{'active-modal-tab':selectRefModal.tab == 'tags'}">Tags</button>
                </ModalTab>
            </div>
            <div v-if="(selectRefModal.tab == 'branches' && selectRefModal.branches.loading) || (selectRefModal.tab == 'tags' && selectRefModal.tags.loading)" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <div v-else style="overflow:auto">
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
            <footer class="modal-footer SelectMenu-footer">
                <router-link :to="`/${owner}/${repo}/branches`">
                    View all branches
                </router-link>
            </footer>
        </Modal>

    </CommonLoadingWrapper>
</template>
<script>
    import styled from 'vue-styled-components'
    import{CommonLoadingWrapper,ImgWrapper,AnimatedHeightWrapper,Modal,SelectMenuItem,LoadingIconEx,Breadcrumb,Popover} from '@/components'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import {authRequiredGet,authRequiredGitHubGraphqlApiQuery,commonGet } from '@/network'
    import {RouteUpdateAwareMixin,ComponentActiveAwareMixin} from '@/mixins'
    import {util_analyseFileType} from '@/util'
    import {WithRefDistinguishMixin} from '../../components'
    import {ContentListItem} from './components'
    let parse = require('parse-link-header')
    import Vue from 'vue'
    export default {
        name: 'repository_code_main',
        inject: ['repoBasicInfo'],
        mixins: [RouteUpdateAwareMixin,WithRefDistinguishMixin,ComponentActiveAwareMixin],
        data() {
            return {
                ref: {
                    data: {},
                    loading: false
                },
                latestCommit: {
                    data: {},
                    status: null,
                    loading: false,
                    showMessage: false
                },
                commitCount: {
                    data: undefined,
                    loading: false
                },
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
                contents: {
                    show: false,
                    data: [],
                    loading: false,
                    loadingLastUpdateDate: false
                },
                compareWithDefaultRef: {
                    data: {},
                    message: '',
                    loading: false
                }
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
                this.network_getBranch()
                this.networl_getLatestCommit()
                this.network_getCommitsCount()
                this.network_getReadme()
                this.network_getContents()
                if(this.defaultRef && this.currentRef && (this.currentRef != this.defaultRef)) {
                    this.network_getCompareWithDefaultRef()
                }
            },
            async network_getBranch() {
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
            },
            async networl_getLatestCommit() {
                try{
                    this.latestCommit.loading = true
                    let url = api.API_COMMITS({
                        repo: this.repo,
                        owner: this.owner,
                        params: {
                            path: this.path,
                            sha: this.currentRef,
                            per_page: 1
                        }
                    })

                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_latest_commit')
                        }
                    )

                    this.latestCommit.data = res.data[0]
                    this.network_getLatestCommitStatus()
                }catch(e) {
                    console.log(e)
                }finally{
                    this.latestCommit.loading = false
                }
            },
            async network_getLatestCommitStatus() {
                try{
                    let url = api.API_PROXY_COMMIT_STATUS({
                        repo: this.repo,
                        owner: this.owner,
                        sha: this.latestCommit.data.sha
                    })

                    let res = await commonGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_latest_commit_status')
                        }
                    )

                    if(res.data) this.parseLatestCommitStatus(res.data)
                   
                }catch(e) {
                    console.log(e)
                }
            },
            async network_getTag() {
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
            },
            async network_getCommitsCount() {
               
                try{
                    this.commitCount.loading = true
                    let url = api.API_COMMITS({
                        repo: this.repo,
                        owner: this.owner,
                        params: {
                            sha: this.currentRef,
                            per_page: 1
                        }
                    })
                    
                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_commit_count')
                        }
                    )

                    let commitCountHolder = parse(res.headers.link) || {}
                    this.commitCount.data = commitCountHolder.last ? commitCountHolder.last.page : res.data.length
                }catch(e) {
                    console.log(e)
                }finally{
                    this.commitCount.loading = false
                }       
            },
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
            async network_getContents() {
                try{
                    this.contents.loading = true 
                    let url = api.API_CONTENTS({
                        path: this.path && this.path.replace(/^\//,''),
                        owner: this.owner,
                        repo: this.repo,
                        ref: this.currentRef
                    })
                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_contents')
                        }
                    )

                    let contents = res.data.sort((a,b) => {
                        return (b.type == 'dir' ? 1 : 0) - (a.type == 'dir' ? 1 : 0)
                    })
                    if(this.path) contents.unshift({
                        name: '. .',
                        type: 'prevLink'
                    })
                    this.contents.data = contents
                    if(this.path) this.contents.show = true
                    if(this.accessToken) {
                        this.network_getContentsLastUpdateInfo()
                    }
                }catch(e) {
                    this.handleError(e)
                    if(e.response && e.response.status == 404) {
                        this.emitNotFoundEvent(this.$el)
                    }
                }finally{
                    this.contents.loading = false
                }
            },
            async network_getContentsLastUpdateInfo() {
                try{
                    this.contents.loadingLastUpdateDate = true 

                    let graphQL_contentsLastUpdateInfo = graphql.GRAPHQL_REPOSITORY_LAST_COMMITDATE_BY_PATH({
                        path: this.path,
                        contents: this.contents.data,
                        owner: this.owner,
                        repo: this.repo,
                        branch: this.currentRef
                    }) 
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphQL_contentsLastUpdateInfo,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.name + ' get_contents_last_update_date')
                        }
                    )

                    let dataHolder
                    try{
                        dataHolder = res.data.data.repository.object
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                    let i = 0
                    for(let key in dataHolder) {
                       Vue.set(this.contents.data[i],'committedDate',dataHolder[key].nodes[0] && dataHolder[key].nodes[0].committedDate)
                        i += 1
                    }
                }catch(e) {
                    console.log(e)
                }finally{
                    this.contents.loadingLastUpdateDate = false
                }
            },
            async network_getCompareWithDefaultRef() {
                try{
                    this.compareWithDefaultRef.loading = true
                    let url = api.API_COMMITS_COMPARE({
                        repo: this.repo,
                        owner: this.owner,
                        baseHead: `${this.defaultRef}...${this.currentRef}`
                    })

                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_compare_with_default_ref')
                        }
                    )

                    this.compareWithDefaultRef.data = res.data
                }catch(e) {
                    console.log(e)
                    if(e.response) {
                        this.compareWithDefaultRef.message = e.response.data.message
                    }
                }finally{
                    this.compareWithDefaultRef.loading = false
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
            routeUpdateHook(to,from) {
                
                this.selectRefModal.branches.data = []
                this.selectRefModal.tags.data = []

                if(to.params.repo != from.params.repo || to.params.owner != from.params.owner) {
                    this.network_getContributors() 
                    this.network_getLanguages() 
                    this.network_getReleases()

                    this.allBranchesAndTags.branches = []
                    this.allBranchesAndTags.tags = []
                    this.network_getAllBranchesAndTags()
                }
                if(!this.currentRef) return
                this.network_getReadme()
                this.networl_getLatestCommit()
                this.network_getContents()
                if(!this.defaultRef) return 
                if(this.defaultRef == this.currentRef) return 
                this.network_getCompareWithDefaultRef()
            },
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
        },  
        
        watch: {
            currentRef(newOne,oldOne) {
                if(newOne && !oldOne && this.componentActive) {
                    this.network_getBranch()
                    this.networl_getLatestCommit()
                    this.network_getCommitsCount()
                    this.network_getReadme()
                    this.network_getContents()
                    if(this.defaultRef) this.network_getCompareWithDefaultRef()
                }
            },
            defaultRef(newOne,oldOne) {
                if(newOne && !oldOne && this.componentActive) {
                    if(this.currentRef) this.network_getCompareWithDefaultRef()
                }
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
            Container: styled.div``,
            FileNavigation: styled.div``,
            FileBrowser: styled.div``,
            Readme: styled.div``,
            Releases: styled.div``,
            Contributors: styled.div``,
            Languages: styled.div``,
            Pagination: styled.div``,
            ModalTab: styled.div``,
            FilePath: styled.div``,
            CompareWithDefaultRef: styled.div``,
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

.avatar-user{
    border-radius: 50%;
}
.user-mention{
    font-weight: 600;
    color: #24292e;
    white-space: nowrap;
}
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
