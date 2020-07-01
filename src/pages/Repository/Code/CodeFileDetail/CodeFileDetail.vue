<template>
    <CommonLoadingWrapper :loading="allBranchesAndTags.loading || loading" class="px-3">
        <AnimatedHeightWrapper>
            <FileNavigation class="pb-3 d-flex flex-items-start flex-justify-between">
                <button class="btn css-truncate text-gray" :disabled="!currentRef"  @click="() => showModal('switchBranchOrTagModal')">
                    <svg v-if="refType == 'branch'" height="16" class="octicon-git-branch text-gray v-align-text-bottom" text="gray" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"></path></svg>
                    <svg v-else-if="refType == 'tag'" height="16" class="octicon-tag text-gray v-align-text-bottom" text="gray" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z"></path></svg>
                    <span class="css-truncate-target" data-menu-button="">{{currentRef || '...'}}</span>
                    <span class="dropdown-caret"></span>
                </button>

                <button class="btn d-inline-block">
                    <svg height="16" class="octicon-kebab-horizontal v-align-text-bottom" aria-label="More options" viewBox="0 0 16 16" version="1.1" width="16" role="img"><path d="M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm13 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>
                </button>
            </FileNavigation>
        </AnimatedHeightWrapper>

        <FilePath class="file-path text-normal mt-1 mb-3 flex-auto text-bold">
            <router-link :to="`/${owner}/${repo}`">{{repo}}</router-link>&nbsp;/&nbsp;<Breadcrumb :spaceArround="true" :routePath="breadcrumbRoutePath" :displayPath="path && path.replace(/^\//,'').replace(/\/$/,'')"/>
        </FilePath>

        <ContributionMessage class="Box d-flex flex-column flex-shrink-0 mb-3">
            <div class="Box-header Box-header--blue d-flex flex-items-center">
                <span class="flex-shrink-0">
                    <router-link v-if="contributionMessage.latestCommit.data.author && contributionMessage.latestCommit.data.author.avatar_url" 
                                :to="`/${contributionMessage.latestCommit.data.author.login}`">
                        <ImgWrapper class="avatar avatar-user">
                            <img    class="avatar avatar-user"
                                    :src="contributionMessage.latestCommit.data.author.avatar_url" 
                                    :alt="`@${contributionMessage.latestCommit.data.author.login}`"
                                    height="24"
                                    width="24">
                        </ImgWrapper>
                    </router-link>
                </span>

                <div class="flex-1 d-flex flex-items-center ml-3 min-width-0">
                    <div class="css-truncate css-truncate-overflow">
                        <router-link class="text-bold link-gray-dark" :to="`/${contributionMessage.latestCommit.data.author.login}`">{{contributionMessage.latestCommit.data.author.login}}</router-link>
                        <span>
                            <router-link class="link-gray" :to="`/${owner}/${repo}/commit/${contributionMessage.latestCommit.data.sha}`">{{latestCommitMessageHeadline}}</router-link>
                        </span>
                    </div>
                </div>

                <span class="hidden-text-expander ml-1 flex-shrink-0">
                    <button type="button" class="ellipsis-expander js-details-target" aria-expanded="true">…</button>
                </span>  

                <span v-if="contributionMessage.latestCommitStatus !== undefined" class="ml-2">
                    <svg v-if="contributionMessage.latestCommitStatus == 'SUCCESS'" class="octicon octicon-check text-green" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                    <svg v-else-if="contributionMessage.latestCommitStatus == 'FAILURE'" class="octicon octicon-x v-align-middle text-red" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>
                </span>       
            </div>
        </ContributionMessage>

       <!--  <transition name="fade" appear>
            <Content :contentType="contentType" v-if="data || html || raw"></Content>
        </transition> -->

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
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Breadcrumb,Modal,SelectMenuItem,LoadingIconEx,CommonLoadingWrapper,AnimatedHeightWrapper,ImgWrapper} from '@/components'
    import ClipboardJS from 'clipboard'
    import {Content} from './components'
    import {cancelAndUpdateAxiosCancelTokenSource,authRequiredGitHubGraphqlApiQuery,authRequiredGet,commonGet} from '@/network'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {WithRefDistinguishMixin} from '../../components'
    import * as graphql from '../graphql'
    import * as api from '@/network/api'
    let parse = require('parse-link-header')
    export default {
        name: 'repository_code_file_detail_page',
        mixins: [RouteUpdateAwareMixin,WithRefDistinguishMixin],
        inject: ['repoBasicInfo'],
        data() {
            return {
                data: '',
                loading: false,
                contentType: 'others',
                contributionMessage: {
                    latestCommit: {
                        data: {},
                        loading: false
                    },
                    latestCommitStatus: undefined,
                    contributors: [],
                    contributorCount: 0,
                    loading: false
                },
                selectRefModal: {
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
                let regExp = new RegExp('^(\/[^\/]+\/[^\/]+\/)file')
                let match = this.$route.path.match(regExp)
                if(match) {
                    return this.$route.path.replace(regExp,`${match[1]}dir`)
                }
            },
            filterAvailableBranches() {
                return this.availableBranches.data.filter(i => {
                    return i.toLowerCase().indexOf(this.switchBranchOrTagModalSearchQuery.toLowerCase()) != -1 && i != this.repoBasicInfo().default_branch
                })
            },
            filterAvailableTags() {
                return this.availableTags.data.filter(i => {
                    return i.toLowerCase().indexOf(this.switchBranchOrTagModalSearchQuery.toLowerCase()) != -1
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
        async created() {
            await this.network_getAllBranchesAndTags()
            this.network_getData() 
        },
        methods: {
            network_getData() {
                if(!this.currentRef) return
                this.network_getLatestCommit()
                this.network_getContributionMessage()
                this.network_tryToGetContentHTML()
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
                    
                    let url_whetherHTML = api.API_CONTENTS({
                        repo: this.repo,
                        owner: this.owner,
                        path: this.path,
                        ref: this.currentRef
                    })

                    console.log(url_whetherHTML)

                    let res_whetherHTML = await authRequiredGet(
                        url_whetherHTML,
                        {
                            headers: {
                                'Accept': 'application/vnd.github.VERSION.html'
                            },
                            cancelToken
                        }
                    )

                    this.data = res_whetherHTML.data
                    this.contentType = 'HTML'

                    this.loading = false
                    
                   
                }catch(e){
                    console.log(e)
                    if(e.response && e.response.status == 404) {

                    }

                }finally{
                    
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
            parseLatestCommitStatus(HTML) {
                let failurePattern = /octicon-x/g
                let successPattern = /octicon-check/g
                console.log(HTML)
                console.log(HTML.match(failurePattern))
                console.log(HTML.match(successPattern))
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
            }
        },
        watch: {
            currentRef(newOne, oldOne) {
                if(newOne,oldOne) this.network_getData()
            },
            repoFullName() {
                this.network_getAllBranchesAndTags()
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
            Container: styled.div``,
            FileNavigation: styled.div``,
            ContributionMessage: styled.div``,
            FilePath: styled.h2``,
            ModalTab: styled.h2``,
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