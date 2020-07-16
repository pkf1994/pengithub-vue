<template>
    <CommonLoadingWrapper :loading="allBranchesAndTags.loading || loading || contributionMessage.loading || contributionMessage.latestCommit.loading" class="px-3">
        <FileNavigation class="pb-3 d-flex flex-items-start flex-justify-between position-relative">
            <button class="btn css-truncate text-gray" :disabled="!currentRef"  @click="() => showModal('switchBranchOrTagModal')">
                <svg v-if="refType == 'branch'" height="16" class="octicon-git-branch text-gray v-align-text-bottom" text="gray" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"></path></svg>
                <svg v-else-if="refType == 'tag'" height="16" class="octicon-tag text-gray v-align-text-bottom" text="gray" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z"></path></svg>
                <span class="css-truncate-target" data-menu-button="">{{currentRef || '...'}}</span>
                <span class="dropdown-caret"></span>
            </button>

            <button class="btn d-inline-block" @click="() => showModal('popover')">
                <svg height="16" class="octicon-kebab-horizontal v-align-text-bottom" aria-label="More options" viewBox="0 0 16 16" version="1.1" width="16" role="img"><path d="M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm13 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>
            </button>
            <Popover ref="popover" :popoverStyle="{right: 0, top: '100%', width: '160px',paddingTop: '8px', paddingBottom: '8px'}">
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
            <FilePath v-if="currentRef" class="file-path text-normal pt-1 pb-3 flex-auto text-bold">
                <router-link :to="`/${owner}/${repo}`">{{repo}}</router-link>&nbsp;/&nbsp;<Breadcrumb :spaceArround="true" :routePath="breadcrumbRoutePath" :displayPath="path && path.replace(/^\//,'').replace(/\/$/,'')"/>
            </FilePath>
        </AnimatedHeightWrapper>
       

        <ContributionMessage class="Box d-flex flex-column flex-shrink-0 mb-3">
            <div class="Box-header Box-header--blue">

                <Skeleton v-if="!contributionMessage.latestCommit.data.node_id || contributionMessage.latestCommit.loading"  class="d-flex flex-items-center">
                    <SkeletonCircle :diameter="24" color="#EEEEEE"></SkeletonCircle>
                    <SkeletonRectangle :height="14" color="#EEEEEE" class="flex-grow-1 ml-2 mr-6"></SkeletonRectangle>
                </Skeleton>

                <div v-else>
                    <div class="d-flex flex-items-center">

                        <div style="height: 24px" class="AvatarStack flex-self-start AvatarStack--two" v-if="contributionMessage.latestCommit.data.author && contributionMessage.latestCommit.data.author.login != contributionMessage.latestCommit.data.committer.login">
                            <div class="AvatarStack-body">
                                <router-link style="height: 24px;width: 24px;border-radius:2em;" v-if="contributionMessage.latestCommit.data.author && contributionMessage.latestCommit.data.author.avatar_url" class="avatar avatar-user"  :to="`/${contributionMessage.latestCommit.data.author.login}`">
                                    <img width="24" height="24" :src="contributionMessage.latestCommit.data.author.avatar_url" :alt="`@${contributionMessage.latestCommit.data.author.login}`" class="avatar-user" style="border-radius:2em">
                                </router-link>
                                <router-link style="height: 24px;width: 24px;border-radius:2em;" v-if="contributionMessage.latestCommit.data.committer && contributionMessage.latestCommit.data.committer.avatar_url" class="avatar avatar-user" :to="`/${contributionMessage.latestCommit.data.author.login}`">
                                    <img width="24" height="24" :src="contributionMessage.latestCommit.data.committer.avatar_url" :alt="`@${contributionMessage.latestCommit.data.committer.login}`" class="avatar-user" style="border-radius:2em">
                                </router-link>
                            </div>
                        </div>
                        
                        <router-link v-else-if="contributionMessage.latestCommit.data.author && contributionMessage.latestCommit.data.author.avatar_url" class="avatar avatar-user" :to="`/${contributionMessage.latestCommit.data.author.login}`">
                            <ImgWrapper>
                                <img width="24" height="24" :src="contributionMessage.latestCommit.data.author.avatar_url" :alt="`@${contributionMessage.latestCommit.data.author.login}`">
                            </ImgWrapper>
                        </router-link>

                        <div class="flex-1 d-flex flex-items-center ml-3 min-width-0">
                            <div class="css-truncate css-truncate-overflow">
                                <router-link class="text-bold link-gray-dark" v-if="contributionMessage.latestCommit.data.author && contributionMessage.latestCommit.data.author.avatar_url" :to="`/${contributionMessage.latestCommit.data.author.login}`">{{contributionMessage.latestCommit.data.author.login}}</router-link>
                                <span>
                                    <router-link class="link-gray" :to="`/${owner}/${repo}/commit/${contributionMessage.latestCommit.data.sha}`">{{latestCommitMessageHeadline}}</router-link>
                                </span>
                            </div>
                        </div>

                        <span v-if="latestCommitMessageBody" @click="triggerShowLatestCommitMessageBody" class="hidden-text-expander ml-1 flex-shrink-0">
                            <button type="button" class="ellipsis-expander js-details-target" aria-expanded="true">…</button>
                        </span>  

                        <span v-if="contributionMessage.latestCommitStatus !== undefined" class="ml-2">
                            <svg v-if="contributionMessage.latestCommitStatus == 'SUCCESS'" class="octicon octicon-check text-green" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                            <svg v-else-if="contributionMessage.latestCommitStatus == 'FAILURE'" class="octicon octicon-x v-align-middle text-red" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>
                        </span>     

                        <router-link :to="`/${owner}/${repo}/commits/${currentRef}/${path}`" class="d-block ml-3 d-flex flex-shrink-0 flex-items-center flex-justify-end text-gray no-wrap">
                            <svg height="16" class="octicon octicon-history text-gray" text="gray" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.643 3.143L.427 1.927A.25.25 0 000 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 00.177-.427L2.715 4.215a6.5 6.5 0 11-1.18 4.458.75.75 0 10-1.493.154 8.001 8.001 0 101.6-5.684zM7.75 4a.75.75 0 01.75.75v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.75.75 0 017 8.25v-3.5A.75.75 0 017.75 4z"></path></svg>
                        </router-link>
                    </div>
                    
                    <div class="pl-5 mt-2 width-full" v-if="latestCommitMessageBody && contributionMessage.latestCommit.showMessageBody">
                        <router-link class="link-gray-dark" :to="`/${owner}/${repo}/commits/${contributionMessage.latestCommit.data.sha}`">
                            <pre>{{latestCommitMessageBody}}</pre>
                        </router-link>
                    </div>  
                </div> 

            </div>
            
            <div class="Box-body d-flex flex-items-center flex-auto border-bottom-0 flex-wrap">
                <div class="lh-default text-gray-dark float-left mr-3" @click="() => showModal('contributorsListModal')">
                    <svg height="16" class="octicon octicon-people text-gray" text="gray" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z"></path></svg>
                    <strong>
                        {{contributionMessage.contributorCount}}
                    </strong>
                    {{contributionMessage.contributorCount > 1 ? 'contributors' : 'contributor'}}
                </div>
                <span>
                    <router-link v-for="item in contributionMessage.contributors" :key="item.login" class="avatar-link py-1" :to="`/${item.login}`">
                        <img :src="item.avatarUrl" :alt="`@${item.login}`" width="24" height="24" class="avatar mr-2 avatar-user" >
                    </router-link>

                    <button v-if="contributionMessage.contributorCount > contributionMessage.contributors.length" 
                            @click="() => showModal('contributorsListModal')"
                            class="btn-link lh-default mt-1">
                        +{{contributionMessage.contributorCount - contributionMessage.contributors.length}}
                    </button>
                </span>    
            </div>
           
        </ContributionMessage>

        <transition name="fade" appear>
            <Content :contentType="contentType" 
                        :content="data" 
                        :currentRef="currentRef" 
                        :path="path" 
                        :byteSize="byteSize.data"></Content>
        </transition>

       <!--  <Modal ref="switchBranchOrTagModal" title="Switch branches/tags" :modalStyle="{height:'80vh'}" @show="network_getAvailableRefs">
            <div class="select-menu-text-filter">
                <div class="p-3">
                    <input type="text" v-model="switchBranchOrTagModalSearchQuery" class="form-control" placeholder="Filter branches/tags" autofocus="" autocomplete="off"/>
                </div>
                <ModalTab class="SelectMenu-tabs" style="background-color: #f6f8fa;">
                    <button class="SelectMenu-tab py-2" style="font-size:14px" @click="() => switchModalTab('branch')" :class="{'active-modal-tab':switchBranchOrTagModalTab == 'branch'}">Branches</button>
                    <button class="SelectMenu-tab py-2" style="font-size:14px" @click="() => switchModalTab('tag')" :class="{'active-modal-tab':switchBranchOrTagModalTab == 'tag'}">Tags</button>
                </ModalTab>
            </div>
            <div v-if="(switchBranchOrTagModalTab == 'branch' && availableBranches.loading) || (switchBranchOrTagModalTab == 'tag' && availableTags.loading)"  class="flex-row-center flex-grow-1">
                <LoadingIconEx></LoadingIconEx>
            </div>

            <div v-else class="flex-grow-1" style="overflow:auto">    
                <transition-group v-if="switchBranchOrTagModalTab == 'branch'" name="fade-group" appear>
                    <SelectMenuItem :key="repoBasicInfo().default_branch" v-if="repoBasicInfo().default_branch" @click.native="() => routerWithRef(repoBasicInfo().default_branch)" :selected="currentRef == repoBasicInfo().default_branch">
                        <span class="flex-1">{{repoBasicInfo().default_branch}}</span>    
                        <span class="Label Label--gray flex-self-start">default</span>
                    </SelectMenuItem>
                    <SelectMenuItem @click.native="() => routerWithRef(item)" v-for="item in filterAvailableBranches" :key="item" :selected="currentRef == item">
                        <span>{{item}}</span>    
                    </SelectMenuItem>
                </transition-group>
                <transition-group v-if="switchBranchOrTagModalTab == 'tag'" name="fade-group" appear>
                    <SelectMenuItem @click.native="() => routerWithRef(item)" v-for="item in filterAvailableTags" :key="item" :selected="currentRef == item">
                        <span>{{item}}</span>    
                    </SelectMenuItem>
                </transition-group>
            </div> 
            
        </Modal> -->

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

        <Modal ref="contributorsListModal" title="Users who have contributed to this file" :modalStyle="{height:'80vh'}" @show="network_getModalContributors">
            <div v-if="modalContributors.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <div v-else style="overflow:auto">
                <transition-group name="fade-group" appear>
                    <router-link @click="closeModal" v-for="item in modalContributors.data" :key="item.login" :to="`/${item.login}`" class="d-block link-gray-dark no-underline Box-row bg-white">
                        <img class="avatar mr-1 avatar-user" :alt="`@${item.login}`" :src="item.avatarUrl" width="20" height="20">
                        {{item.login}}
                    </router-link>
                </transition-group>
            </div>
        </Modal>
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Breadcrumb,Modal,SelectMenuItem,LoadingIconEx,CommonLoadingWrapper,AnimatedHeightWrapper,ImgWrapper,Popover,SkeletonCircle,SkeletonRectangle} from '@/components'
    import ClipboardJS from 'clipboard'
    import {Content} from './components'
    import {cancelAndUpdateAxiosCancelTokenSource,authRequiredGitHubGraphqlApiQuery,authRequiredGet,commonGet} from '@/network'
    import {RouteUpdateAwareMixin,ComponentActiveAwareMixin} from '@/mixins'
    import {WithRefDistinguishMixin} from '../../components'
    import * as graphql from '../graphql'
    import * as api from '@/network/api'
    let parse = require('parse-link-header')
    export default {
        name: 'repository_code_file_detail_page',
        mixins: [RouteUpdateAwareMixin,WithRefDistinguishMixin,ComponentActiveAwareMixin],
        inject: ['repoBasicInfo'],
        data() {
            return {
                data: '',
                loading: false,
                contentType: 'html',
                contributionMessage: {
                    latestCommit: {
                        data: {},
                        showMessageBody: false,
                        loading: false
                    },
                    latestCommitStatus: undefined,
                    contributors: [],
                    contributorCount: 0,
                    loading: false
                },
                modalContributors: {
                    data: [],
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
                switchBranchOrTagModalTab: "branch",
                byteSize: {
                    data: 0,
                    loading: false
                },
            }
        },
      
        computed: {
            location() {
                return location
            },
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            breadcrumbRoutePath() {
                let regExp = new RegExp(`^\/${this.owner}\/${this.repo}\/blob`)
                return this.$route.path.replace(regExp,`/${this.owner}/${this.repo}/tree`)
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
            findFileRouterLink() {
                return `/${this.owner}/${this.repo}/find/${this.currentRef}`
            },
            repoFullName() {
                return `${this.owner}/${this.repo}`
            },
            latestCommitMessageHeadline() {
                if(this.contributionMessage.latestCommit.data.commit && this.contributionMessage.latestCommit.data.commit.message) {
                    return this.contributionMessage.latestCommit.data.commit.message.split('\n\n')[0]
                }
            },
            latestCommitMessageBody() {
                if(this.contributionMessage.latestCommit.data.commit && this.contributionMessage.latestCommit.data.commit.message) {
                    return this.contributionMessage.latestCommit.data.commit.message.split('\n\n')[1]
                }
            }
        },
        created() {
            this.network_getData() 
        },
        methods: {
            async network_getData() {
                if(this.allBranchesAndTags.branches.length == 0) {
                    await this.network_getAllBranchesAndTags()
                }
                if(!this.currentRef) return
                this.network_getLatestCommit()
                this.network_getContributionMessage()
                this.network_tryToGetContentHTML()
                if(this.accessToken)this.network_getByteSize()
            },
            async network_getLatestCommit() {
                try{
                    this.contributionMessage.latestCommit.loading = true
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

                    this.contributionMessage.latestCommit.data = res.data[0]
                    this.network_getLatestCommitStatus()
                }catch(e) {
                    console.log(e)
                }finally{
                    this.contributionMessage.latestCommit.loading = false
                }
            },
            async network_getContributionMessage() {
                try{
                    this.contributionMessage.loading = true
                    let url = api.API_PROXY_FILE_CONTRIBUTION_MESSAGE({
                        repo: this.repo,
                        owner: this.owner,
                        ref: this.currentRef,
                        path: this.path
                    })

                    let res = await commonGet(url)

                    this.parseContributionMessage(res.data)
                }catch(e) {
                    console.log(e)
                }finally{
                    this.contributionMessage.loading = false
                }
            },
            async network_getLatestCommitStatus() {
                try{
                    let url = api.API_PROXY_COMMIT_STATUS({
                        repo: this.repo,
                        owner: this.owner,
                        sha: this.contributionMessage.latestCommit.data.sha
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
            async network_tryToGetContentHTML() {
                try{
                    this.loading = true

                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_content_HTML')
                    
                    let url_contentHTML = api.API_CONTENTS({
                        repo: this.repo,
                        owner: this.owner,
                        path: this.path,
                        ref: this.currentRef
                    })

                    let res = await authRequiredGet(
                        url_contentHTML,
                        {
                            headers: {
                                'Accept': 'application/vnd.github.VERSION.html'
                            },
                            cancelToken
                        }
                    )

                    this.detemineContentType(res.data)

                }catch(e){
                    console.log(e)
                    this.contentType = 'binary'
                    if(e.response && e.response.status == 404) {
                        this.emitNotFoundEvent(this.$el)
                    }
                }finally{
                    this.loading = false
                }
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
            async network_getModalContributors() {
                if(this.modalContributors.loading) return
                if(this.modalContributors.data.length > 0) return
                try{
                    this.modalContributors.loading = true
                    let url = api.API_PROXY_CONTRIBUTORS_LIST({
                        repo: this.repo,
                        owner: this.owner,
                        path: this.path,
                        ref: this.currentRef
                    })

                    let res = await commonGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_modal_contributors')
                        }
                    )

                    this.parseContributors(res.data)
                }catch(e) {
                    console.log(e)
                }finally{
                    this.modalContributors.loading = false
                }
            },
            detemineContentType(HTML) {
                let plainCodePattern = /^<div id="file"[^>]*?><div class="plain"><pre style="white-space: pre-wrap">((?:.|\r|\n)*)<\/pre><\/div><\/div>$/g
                let plainCodeExecResult
                if((plainCodeExecResult = plainCodePattern.exec(HTML)) != null) {
                    this.data = plainCodeExecResult[1]
                    this.contentType = 'text'
                }else{
                    this.data = HTML
                }
            },
            parseContributionMessage(HTML) {

                let contributorCountPattern = /<detail.*?id="blob_contributors_box">(?:.|\r|\n)*?<strong>(.*?)<\/strong>/g
                let contributorCountExecResult
                if((contributorCountExecResult = contributorCountPattern.exec(HTML)) != null) {
                    this.contributionMessage.contributorCount = contributorCountExecResult[1]
                }

                let contributorPattern = /<img class="avatar mr-2 avatar-user" src="(.*?)" width="24" height="24" alt="@(.*?)" \/>/g
                let contributorExecResult
                let contributors = []
                while((contributorExecResult = contributorPattern.exec(HTML)) != null) {
                    contributors.push({
                        login: contributorExecResult[2],
                        avatarUrl: contributorExecResult[1]
                    })
                }
                this.contributionMessage.contributors = contributors
            },
            parseContributors(HTML) {
                let pattern = /<a.*?href="\/(.*?)">(?:\r|\n)\s*<img.*?src="(.*?)"[^>]*?>/g
                let execResult
                let contributors = []
                while((execResult = pattern.exec(HTML)) != null) {
                    contributors.push({
                        login: execResult[1],
                        avatarUrl: execResult[2]
                    })
                }
                this.modalContributors.data = contributors
            },
            parseLatestCommitStatus(HTML) {
                let failurePattern = /octicon-x/g
                let successPattern = /octicon-check/g
                if(HTML.match(failurePattern) != null) {
                    this.contributionMessage.latestCommitStatus = 'FAILURE'
                }else if(HTML.match(successPattern) != null) {
                    this.contributionMessage.latestCommitStatus = 'SUCCESS'
                }
            },
            initClipboard() {
                let clip = new ClipboardJS('#file-detail-copy-btn');
                clip.on('success',e => {
                    this.$toast("Clip OK!")
                })
            },
            switchModalTab(payload) {
                this.switchBranchOrTagModalTab = payload
                this.network_getAvailableRefs()
            },
            routerWithRef(ref) {
                this.closeModal()
                if(ref == this.currentRef) return 
                let regExp = new RegExp(`^/${this.owner}/${this.repo}/blob/${this.currentRef}`)
                let targetRouterLink = this.$route.fullPath.replace(regExp,`/${this.owner}/${this.repo}/blob/${ref}`)
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
            network_getAvailableRefs() {
                if(this.switchBranchOrTagModalTab == 'branch') this.network_getAvailableBranches()
                if(this.switchBranchOrTagModalTab == 'tag') this.network_getAvailableTags()
            },
            async network_getAvailableBranches() {
                if(this.availableBranches.data.length > 0 || this.availableBranches.loading) return 
                try{
                    this.availableBranches.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_available_branches')
                    let url = api.API_REPOSITORY_CODE_FILE_DETAIL_AVAILABLE_BRANCHES({
                        repo: this.repo,
                        owner: this.owner,
                        ref: this.currentRef,
                        path: this.path.replace(/^\//,'').replace(/\/$/,'')
                    })
                    let res = await commonGet(url,{cancelToken})
                    this.availableBranches.data = this.parseBranchesFromHTML(res.data)
                }catch(e) {
                    console.log(e)
                }finally{
                    this.availableBranches.loading = false
                }
            },
            async network_getAvailableTags() {
                if(this.availableTags.data.length > 0 || this.availableTags.loading) return 
                try{
                    this.availableTags.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_available_tags')
                    let url = api.API_REPOSITORY_CODE_FILE_DETAIL_AVAILABLE_TAGS({
                        repo: this.repo,
                        owner: this.owner,
                        ref: this.currentRef,
                        path: this.path.replace(/^\//,'').replace(/\/$/,'')
                    })
                    let res = await commonGet(url,{cancelToken})
                    this.availableTags.data = this.parseTagsFromHTML(res.data)
                }catch(e) {
                    console.log(e)
                }finally{
                    this.availableTags.loading = false
                }
            },
            async network_getByteSize() {
                try{
                    this.byteSize.loading = true

                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.BLOB_BYTE_SIZE,
                        {  
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_byte_size'),
                            variables: {
                                name: this.repo,
                                owner: this.owner,
                                expression: `${this.currentRef}:${this.path}`
                            }
                        }
                    )
                    try{
                        this.byteSize.data = res.data.data.repository.object.byteSize
                    }catch(e) {
                        this.handleGraphqlError(res)
                    } 
                    
                }catch(e) {
                    console.log(e)
                }finally{
                    this.byteSize.loading = false
                }
            },
            parseBranchesFromHTML(HTML) {
                let refs = []
                let execPattern = /<span class="(?:flex-1 )?break-word" data-menu-button-text data-filter-item-text>(.*)<\/span>/g
                let execResult
                while((execResult = execPattern.exec(HTML)) != null) {
                    refs.push(execResult[1])
                }
                return refs
            },
            parseTagsFromHTML(HTML) {
                let refs = []
                let execPattern = /<span class="css-truncate css-truncate-overflow" title="(.*)" >\n\s*(.*)\n\s*<\/span>/g
                let execResult
                while((execResult = execPattern.exec(HTML)) != null) {
                    refs.push(execResult[1])
                }
                return refs
            },
            triggerShowLatestCommitMessageBody() {
                this.contributionMessage.latestCommit.showMessageBody = !this.contributionMessage.latestCommit.showMessageBody
            },
            switchModalTab(payload) {
                this.selectRefModal.tab = payload
                this.network_getModalAvailableRef()
            },
        },
        watch: {
            currentRef(newOne, oldOne) {
                if(newOne && !oldOne && this.componentAware) this.network_getData()
            },
            repoFullName() {
                if(this.componentAware) this.network_getAllBranchesAndTags()
            }
        },
        components: {
            Breadcrumb,
            Content,
            Modal,
            LoadingIconEx,
            SelectMenuItem,
            CommonLoadingWrapper,
            AnimatedHeightWrapper,
            ImgWrapper,
            Popover,
            SkeletonCircle,
            SkeletonRectangle,
            Container: styled.div``,
            FileNavigation: styled.div``,
            ContributionMessage: styled.div``,
            FilePath: styled.h2``,
            ModalTab: styled.h2``,
            Skeleton: styled.h2``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/truncate/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/select-menu/index.scss';
@import 'node_modules/@primer/css/dropdown/index.scss';
@import 'node_modules/@primer/css/labels/index.scss';
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
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

.avatar-user{
    border-radius: 2em;
}
</style>