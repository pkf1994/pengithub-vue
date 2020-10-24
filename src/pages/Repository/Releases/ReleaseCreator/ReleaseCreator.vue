<template>
    <CommonLoadingWrapper class="px-3" :loading="loading">
        <transition name="fade" appear>
            <PaddingPageTopTab class="subnav" style="margin-right:-16px;margin-left:-16px;" :tabs="tabs"></PaddingPageTopTab>
        </transition>  

        <Editor class="pt-3 mb-3 border-top form-group mt-0">
            <AnimatedHeightWrapper>
                <div v-if="releaseData.id && releaseData.draft && $route.name == 'repositoryReleasEditor'" class="pb-3">
                    <DraftNotice class="flash flash-warn">
                        <div class="flash-action">
                            <button @click="() => showModal('deleteDraftModal')" class="btn btn-sm btn-danger">Discard draft</button>
                        </div>
                        This is a draft and won’t be seen by the public unless it’s published.
                    </DraftNotice>
                </div>
            </AnimatedHeightWrapper>
           

            <div v-if="tagNameAutoCompleteResults.data.length > 0" class="cover" @click.stop="() => {tagNameAutoCompleteResults.data = []}"></div>
            <div class="position-relative">
                <input @focus="tagNameInputFocusHandler" 
                        @blur="tagNameInputBlurHandler" 
                        @change="network_checkIfTagNameIsExisted" 
                        @input="tagNameInputInputHandler" 
                        :disabled="inputDisabled"
                        type="text" placeholder="Tag version" autocomplete="off" v-model="releaseData.tag_name" class="form-control width-full mr-0">
                <div v-if="tagIsExisted.loading || tagNameIsInvalid.loading || tagNameAutoCompleteResults.loading" class="position-absolute input-loading-icon-wrapper d-flex flex-justify-end flex-items-center">
                    <LoadingIcon :size="22" class="mr-1"/>
                </div>
                <div v-if="tagNameAutoCompleteResults.data.length > 0" class="position-absolute autocomplete-results">
                    <AutoCompleteItem @click="() => chooseTheAutoCompleteItem(item)" class="autocomplete-item" v-for="item in tagNameAutoCompleteResults.data" :key="item">{{item}}</AutoCompleteItem>
                </div>
            </div>

            <div v-if="!tagIsExisted.data">
                <button :disabled="!releaseData.target_commitish || tagIsExisted.loading || loading" class="btn mt-2 width-full" @click="() => showModal('PickBranchOrRecentCommitModal')">
                    <div class="d-flex flex-items-center">
                        <svg class="octicon octicon-git-branch mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"></path></svg>
                        <i>Target:</i>
                        <span class="flex-auto ml-1 text-left">{{releaseData.target_commitish}}</span>
                        <span class="dropdown-caret ml-2"></span>
                    </div>
                </button>

                <p class="note">
                    Choose an existing tag, or create a new tag on publish
                </p>
            </div>

            <h4 v-else>
                <svg height="16" class="octicon octicon-check v-align-text-bottom" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg> 
                Existing tag
            </h4>

            <input type="text" placeholder="Release title" autocomplete="off" :disabled="loading" v-model="releaseData.name" class="form-control width-full mr-0 my-3">

            <Tab class="mx-0 mt-0 no-wrap tabnav d-flex flex-auto">
                <div class="tabnav-tabs">
                    <TabItem class="btn-link tabnav-tab px-3" @click="() => switchTab('Write')" :class="{'tab-selected':editorTab === 'Write'}">Write</TabItem>
                    <TabItem class="btn-link tabnav-tab px-3" @click="() => switchTab('Preview')" :class="{'tab-selected':editorTab === 'Preview'}">Preview</TabItem>
                </div>
            </Tab>

            <textarea v-if="editorTab == 'Write'" 
                        rows="6" 
                        :disabled="loading"
                        placeholder="Describe this release"
                        class="mt-3 d-block width-full form-control input-contrast" 
                        v-model="releaseData.body"
                        @change="() => {saved = false}"
                        id="repository_release_create_page"
                        ref="textarea"></textarea>

            <Preview  v-else class="preview-body markdown-body" v-html="releaseDescriptionPreviewHTML || 'Nothing to preview'">
            </Preview>

            <FileAttachment class="drop-target js-upload-release-file is-default mt-3 ">
                <ul v-if="assets.length > 0" class="uploaded-files">
                    <UploadFileItem v-for="item in assets.filter(i => !i.deleted)" :key="item.id" class="border-bottom p-2">
                        <div class="d-flex flex-items-center">
                            <input :disabled="loadingDeleteAssets.some(i => i.id == item.id)" @change="(e) => network_updateReleaseAsset(item)" v-model="item.name" type="text" class="col-8 text-mono mr-2 form-control bg-white">
                            <span class="col-2 f6 text-gray flex-shrink-0">
                                ({{item.size | fileSize}})
                            </span>
                            <div class="col-2 text-right pr-2 flex-shrink-0">
                                <button v-if="!loadingDeleteAssets.some(i => i.id == item.id)" @click="() => network_deleteReleaseAsset(item)" type="button" class=" js-release-remove-file btn-link muted-link remove" aria-label="Remove">
                                    <svg class="octicon octicon-x v-align-text-bottom" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>
                                </button>
                                <LoadingIcon v-else class="v-align-text-bottom" :size="16"></LoadingIcon>
                            </div>
                        </div>
                    </UploadFileItem>
                </ul>
                <label :class="{'no-uploaded-file-yet':assets.length == 0}" class=" drop-target-label py-3 f5 border-dashed text-normal drag-and-drop d-flex flex-justify-center flex-items-center drop-target-label position-relative">
                    <input ref="fileInput" :disabled="loading" @change="fileInputChangeHandler" type="file" multiple="" id="releases-upload" class="sr-only show-on-focus bg-gray py-3 width-full text-center">
                    <span v-if="loadingUploadAsset">
                        <LoadingIcon class="v-align-text-bottom" :size="16"></LoadingIcon>
                        Uploading...
                    </span>
                    <span v-else class="default position-relative text-center">
                        <span class="bg-gray-light position-absolute top-0 left-0 width-full height-full rounded-1" style="pointer-events: none;"></span>
                        <span class="position-relative pr-2" style="pointer-events: none;">
                        <svg height="32" class="octicon octicon-arrow-down v-align-middle text-gray-light" viewBox="0 0 24 24" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M4.97 13.22a.75.75 0 000 1.06l6.25 6.25a.75.75 0 001.06 0l6.25-6.25a.75.75 0 10-1.06-1.06l-4.97 4.97V3.75a.75.75 0 00-1.5 0v14.44l-4.97-4.97a.75.75 0 00-1.06 0z"></path></svg>
                        Attach binaries by selecting them.
                        </span>
                    </span>

                </label>
            </FileAttachment>

            <div class="form-checkbox unchecked border-bottom pb-3">
                <label>
                    <input type="checkbox" v-model="releaseData.prerelease">
                    This is a pre-release
                </label>
                <span class="note">
                    We’ll point out that this release is identified as non-production ready.
                </span>
            </div>

            <div>
                <button @click="() => network_updateRelease(false)" :disabled="!publishable" class="btn btn-primary">
                    {{loadingCreatePublishedRelease ? 'Trying...' : 'Publish release'}}
                </button>
                <button :disabled="!draftCanBeSaved" @click="() => network_updateRelease(true)" class="btn js-save-draft" type="submit">
                    <span class="js-save-draft-button-state" data-state="default">
                        <LoadingIcon class="v-align-text-bottom" v-if="loadingSaveDraft" :size="16"></LoadingIcon>
                        {{(loadingSaveDraft || loadingUpdateAsset || loadingUpdateAsset) ? 'Saving release...' : (saved ? 'Saved!' : 'Save draft')}}
                    </span>
                </button>
            </div>

        </Editor>

         <Modal ref="PickBranchOrRecentCommitModal" :loading="modalData.branches.loading || modalData.recentCommits.loading" title="Pick a branch or recent commit" :modalStyle="{height:'80vh'}" @show="network_getModalData">
                <div class="select-menu-text-filter">
                    <div class="p-3">
                        <input type="text" v-model="modalData.searchQuery" class="form-control" :placeholder="`${modalData.currentTab == 'branches' ? 'Filter branches...' : 'Filter recent commits...'}`" autofocus="" autocomplete="off"/>
                    </div>
                    <ModalTab class="SelectMenu-tabs" style="background-color: #f6f8fa;">
                        <button class="SelectMenu-tab py-2" style="font-size:14px" @click="() => switchModalTab('branches')" :class="{'active-modal-tab':modalData.currentTab == 'branches'}">Branches</button>
                        <button class="SelectMenu-tab py-2" style="font-size:14px" @click="() => switchModalTab('recentCommits')" :class="{'active-modal-tab':modalData.currentTab == 'recentCommits'}">Recent commits</button>
                    </ModalTab>
                </div>
                <div style="overflow:auto">
                    <transition-group v-if="modalData.currentTab == 'branches'" name="fade-group" appear>
                        <SelectMenuItem :key="defaultBranch" v-if="defaultBranch" @click.native="() => appointTarget(defaultBranch)" :selected="target == defaultBranch">
                            <span class="flex-1">{{defaultBranch}}</span>    
                            <span class="Label Label--gray flex-self-start">default</span>
                        </SelectMenuItem>
                        <SelectMenuItem @click.native="() => appointTarget(item.name)" v-for="item in modalFilteredAvailableBranches" :key="item.name" :selected="target == item.name">
                            <span>{{item.name}}</span>    
                        </SelectMenuItem>
                    </transition-group>
                    <transition-group v-if="modalData.currentTab == 'recentCommits'" name="fade-group" appear>
                        <SelectMenuItem @click.native="() => appointTarget(item.sha.substring(0,7))" v-for="item in modalFilteredAvailableRecentCommits" :key="item.sha" :selected="target == item.sha.substring(0,7)">
                            <div>
                                <div class="text-bold">{{item.sha.substring(0,7)}}</div> 
                                <div class="text-normal">{{item.commit.message}} @ <span class="no-wrap">{{item.commit.committer.date | getDateDiff}}</span></div>
                            </div>
                        </SelectMenuItem>
                    </transition-group>
                </div>
        </Modal>

        <Modal ref="deleteDraftModal" title="Are you sure?">
            <div class="flash flash-full flash-error">
                <svg class="octicon octicon-alert" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z"></path></svg>
                This will delete the information for this draft.
            </div>
            <div class="Box-body overflow-auto">
                <button :disabled="loadingDeleteDraft" class="btn btn-danger btn-block" @click="network_deleteDraft">
                    {{loadingDeleteDraft ? 'Trying...' : 'Delete this draft'}}
                </button>
            </div>
        </Modal>
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoadingWrapper,PaddingPageTopTab,HyperlinkWrapper,LoadingIcon,SelectMenuItem,Modal,ModalLoadingIcon,AnimatedHeightWrapper} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import * as api from '@/network/api'
    import {authRequiredGet,authRequiredDelete,authRequiredPost,authRequiredPatch,authRequiredGitHubGraphqlApiQuery,commonGet} from '@/network'
    import * as graphql from './graphql'
    import {util_throttle,util_markdownParse} from '@/util'
    let parse = require('parse-link-header')
    export default {
        name: 'repository_release_create_page',
        mixins: [RouteUpdateAwareMixin],
        inject: ['repoBasicInfo'],
        data() {
            return {
                releaseData: {
                    tag_name: '',
                    target_commitish: '',
                    name: '',
                    body: '',
                    prerelease: false
                },
                tagName: '',
                target: '',
                releaseTitle: '',
                releaseDescriptionMarkdownRaw: '',
                loading: false,
                isPreRelease: false,
                assets: [],
                tagNameAutoCompleteResults: {
                    data: [],
                    loading: false
                },
                tagNameIsInvalid: {
                    data: false,
                    loading: false
                },
                tagIsExisted: {
                    data: false,
                    loading: false
                },
                editorTab: 'Write',
                modalData: {
                    searchQuery: '',
                    currentTab: 'branches',
                    branches: {
                        data: [],
                        loading: false,
                        isEmpty: false
                    },
                    recentCommits: {
                        data: [],
                        loading: false,
                        isEmpty: false
                    },
                },
                draft: {
                    data: {},
                    loading: false,
                    saved: false
                },
                saved: false,
                loadingCreatePublishedRelease: false,
                loadingDeleteDraft: false,
                loadingSaveDraft: false,
                loadingUploadAsset: false,
                loadingUpdateAsset: false,
                loadingDeleteAssets: []
            }
        },
        computed: {
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            tabs() {
                return [
                    {
                        label: 'Releases',
                        to: `/${this.owner}/${this.repo}/releases`,
                        activeFlag: true
                    },
                    {
                        label: 'Tags',
                        to: `/${this.owner}/${this.repo}/tags`
                    },
                ]
            },
            documentTitle() {
                return `New releases · ${this.owner}/${this.repo}`
            },
            releaseDescriptionPreviewHTML() {
                return util_markdownParse.markdownToHTML(this.releaseData.body)
            },
            modalFilteredAvailableBranches() {
                return this.modalData.branches.data.filter(i => {
                    return (i.name.toLowerCase().indexOf(this.modalData.searchQuery.toLowerCase()) != -1) && (i.name != this.defaultBranch)
                })
            },
            modalFilteredAvailableRecentCommits() {
                return this.modalData.recentCommits.data.filter(i => {
                    return i.sha.substring(0,7).toLowerCase().indexOf(this.modalData.searchQuery.toLowerCase()) != -1
                })
            },
            defaultBranch() {
                return this.repoBasicInfo().default_branch
            },
            publishable() {
                return this.releaseData.tag_name && this.releaseData.name
            },
            draftCanBeSaved() {
                return this.releaseData.tag_name || this.releaseData.name || this.releaseData.body || this.releaseData.target_commitish
            },
            inputDisabled() {
                return this.loading || this.loadingDeleteDraft || this.loadingCreatePublishedRelease
            }
        },
        created() {
            this.init()
            this.network_getData()
        },
        methods: {
            init() {
                if(this.defaultBranch) this.releaseData.target_commitish = this.defaultBranch
            },
            tagNameInputInputHandler() {
                util_throttle.throttleByDelay(this.network_getTagNameAutoCompleteResults,500,this)
            },
            network_getData() {
                if(this.$route.name == 'repositoryReleasEditor') {
                    this.network_getDraftData()
                }
            },
            async network_getDraftData() {
                if(!this.$route.params.id) return 
                try {
                    this.loading = true
                    let url = api.API_REPOSITORY_RELEASE({
                        repo: this.repo,
                        owner: this.owner,
                        releaseId: this.$route.params.id
                    })


                    let res = await authRequiredGet(url,{
                        cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_draft_release')
                    })

                    /* this.tagName = res.data.tag_name
                    this.releaseData.target_commitish = res.data.target_commitish
                    this.releaseData.name = res.data.name
                    this.releaseDescriptionMarkdownRaw = res.data.body
                    this.isPreRelease = res.data.prerelease

                    this.releaseData = res.data */

                    this.releaseData = Object.assign(this.releaseData,res.data)

                    await this.network_getDraftReleaseAssets()
                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loading = false
                }
            },
            async network_getDraftReleaseAssets() {
                try {

                    let assets = []
                    let pageInfo

                    while(!pageInfo || (pageInfo && pageInfo.next)) {
                        let url = (pageInfo && pageInfo.next && pageInfo.next.url) || api.API_REPOSITORY_RELEASE_ASSETS({
                            repo: this.repo,
                            owner: this.owner,
                            releaseId: this.$route.params.id
                        })
                        let res = await authRequiredGet(url,{
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_draft_release_assets')
                        })

                        pageInfo = parse(res.headers.link) || {}
                        assets = assets.concat(res.data)
                    }
                    
                    this.assets = assets

                } catch (e) {
                    this.handleError(e)
                }
            },
            async network_getTagNameAutoCompleteResults() {
                if(!this.releaseData.tag_name) return
                try{
                   this.tagNameAutoCompleteResults.loading = true 
                   let res = await commonGet(
                       api.API_PROXY_TAGS({
                           repo: this.repo,
                           owner: this.owner,
                           query: this.releaseData.tag_name
                       }),
                       {
                           headers: {
                               'accept': 'text/fragment+html'
                           }
                       }
                   )
                   this.parseTagNameAutoCompleteResults(res.data)
                }catch(e) {
                    console.log(e)
                }finally{
                    this.tagNameAutoCompleteResults.loading = false
                }
            },
            async network_checkIfTagNameIsExisted() {
                try {
                    this.saved = false
                    this.tagIsExisted.data = false
                    this.tagIsExisted.loading = true
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_TAG,
                        {
                            variables: {
                                name: this.repo,
                                owner: this.owner,
                                qualifiedName: `refs/tags/${this.releaseData.tag_name}`
                            },
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' check_if_tag_name_is_existed')
                        }
                    )

                    try{
                        let tag = res.data.data.repository.ref
                        if(tag) {
                            this.tagIsExisted.data = true
                        }else{
                            this.tagIsExisted.data = false
                        }
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                } catch (e) {
                    console.log(e)
                } finally {
                    this.tagIsExisted.loading = false
                }
            },
            async network_getAvailableBranches() {
                if(this.modalData.branches.loading) return
                if(this.modalData.branches.data.length > 0) return
                try{
                    this.modalData.branches.loading = true

                    let branches = []
                    let pageInfo

                    while(!pageInfo || (pageInfo && pageInfo.next)) {
                        let url = (pageInfo && pageInfo.next && pageInfo.next.url) || api.API_REPOSITORY_BRANCHES({
                            owner: this.owner,
                            repo: this.repo,
                            params: {
                                per_page: 100
                            }
                        })
                        let res = await authRequiredGet(url)
                        branches = branches.concat(res.data)
                        pageInfo = parse(res.headers.link) || {}
                    }
                    
                    this.modalData.branches.isEmpty = false
                    this.modalData.branches.data = branches
                    if(branches.length == 0) this.modalData.branches.isEmpty = true
                }catch(e) {
                    console.log(e)
                }finally{
                    this.modalData.branches.loading = false
                }
            },
            async network_getRecentCommits() {
                if(this.modalData.recentCommits.loading) return
                if(this.modalData.recentCommits.data.length > 0) return
                try{
                    this.modalData.recentCommits.loading = true
                   
                    let url = api.API_COMMITS({
                        owner: this.owner,
                        repo: this.repo,
                        params: {
                            per_page: 10
                        }
                    })
                    let res = await authRequiredGet(url)

                    this.modalData.recentCommits.isEmpty = false
                    this.modalData.recentCommits.data = res.data || []
                    if(res.data && res.data.length == 0) this.modalData.recentCommits.isEmpty = true
                    
                }catch(e) {
                    console.log(e)
                }finally{
                    this.modalData.recentCommits.loading = false
                }
            },
            async network_deleteDraft() {
                try {
                    this.loadingDeleteDraft = true
                    let url = api.API_REPOSITORY_RELEASE({
                        repo: this.repo,
                        owner: this.owner,
                        releaseId: this.releaseData.id
                    })

                    let res = await authRequiredDelete(
                        url
                    )

                    this.closeModal()

                    this.$router.push(`/${this.owner}/${this.repo}/releases?deleted=${this.releaseData.id}`)

                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loadingDeleteDraft = false
                }
            },
            network_getModalData() {
                switch(this.modalData.currentTab) {
                    case 'branches':
                        this.network_getAvailableBranches()
                        break
                    case 'recentCommits':
                        this.network_getRecentCommits()
                        break
                    default:
                }
            },
            async network_createRelease(isDraft = false) {
                try {
                    if(isDraft) {
                        this.loadingSaveDraft = true
                    }else {
                        this.loadingCreatePublishedRelease = true
                    }
                    let url = api.API_REPOSITORY_CREATE_RELEASE({
                        repo: this.repo,
                        owner: this.owner
                    })

                    let res = await authRequiredPost(
                        url,
                        {
                            tag_name: this.releaseData.tag_name,
                            target_commitish: this.releaseData.target_commitish,
                            name: this.releaseData.name,
                            body: this.releaseData.body,
                            draft: isDraft,
                            prerelease: this.releaseData.prerelease
                        }
                    )
                    this.releaseData = res.data
                    if(isDraft) this.saved = true

                } catch (error) {
                    this.handleError(e)
                } finally {
                    if(isDraft) {
                        this.loadingSaveDraft = false
                    }else {
                        this.loadingCreatePublishedRelease = false
                        
                    }
                }
            },
            async network_uploadReleaseAsset() {
                try {
                    this.loadingUploadAsset = true
                    let file = this.$refs.fileInput.files[0]

                    let url = api.API_REPOSITORY_RELEASE_UPLOAD_ASSET({
                        repo: this.repo,
                        owner: this.owner,
                        releaseId: this.releaseData.id,
                        params: {
                            name: file.name
                        }
                    })

                    let formData = new FormData()
                    formData.append('file',file)

                    let res = await authRequiredPost(
                        url,
                        formData
                    )

                    this.assets.push(res.data)
                    this.saved = true
                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loadingUploadAsset = false
                }
            },
            async network_updateReleaseAsset(asset) {
                try {
                    this.loadingUpdateAsset = true
                    let url = api.API_REPOSITORY_RELEASE_ASSET({
                        repo: this.repo,
                        owner: this.owner,
                        assetId: asset.id
                    })

                    let res = await authRequiredPatch(
                        url,
                        {
                            name: asset.name
                        }
                    )

                    asset.name = res.data.name
                    this.saved = true

                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loadingUpdateAsset = false
                }
            },
            async network_deleteReleaseAsset(asset) {
                try {
                    this.loadingDeleteAssets.push(asset)
                    let url = api.API_REPOSITORY_RELEASE_ASSET({
                        repo: this.repo,
                        owner: this.owner,
                        assetId: asset.id
                    })

                    let res = await authRequiredDelete(url)

                    asset.deleted = true

                    this.saved = true
                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loadingDeleteAssets.forEach((i,index) => {
                        if(i.id == asset.id) {
                            this.loadingDeleteAssets.splice(index,1)
                        }
                    })
                }
            }, 
            async network_updateRelease(draft = true) {
                if(!this.releaseData.id) {
                    this.network_createRelease(true)
                    return
                }

                try {
                    if(draft) this.loadingSaveDraft = true
                    if(!draft) this.loadingCreatePublishedRelease = true
                    
                    let url = api.API_REPOSITORY_RELEASE({
                        repo: this.repo,
                        owner: this.owner,
                        releaseId: this.releaseData.id
                    })

                    let res = await authRequiredPatch(
                        url,
                        {
                            tag_name: this.releaseData.tag_name,
                            target_commitish: this.releaseData.target_commitish,
                            name: this.releaseData.name,
                            body: this.releaseData.body,
                            prerelease: this.releaseData.prerelease,
                            draft
                        }
                    )

                    this.releaseData = res.data
                    this.saved = true
                } catch (e) {
                    this.handleError(e)
                } finally {
                    if(draft) this.loadingSaveDraft = false
                    if(!draft) {
                        this.loadingCreatePublishedRelease = false
                        this.$router.push(`/${this.owner}/${this.repo}/releases?new=${this.releaseData.id}`)
                    }
                }
            },
            parseTagNameAutoCompleteResults(HTML) {
                let pattern = /<li[^>]*>(.*)<\/li>/g
                let execResult = null
                let results = []
                while((execResult = pattern.exec(HTML)) != null) {
                    results.push(execResult[1])
                }
                this.tagNameAutoCompleteResults.data = results
            },
            tagNameInputFocusHandler() {
                this.tagNameInputInputHandler()
            },
            tagNameInputBlurHandler() {
                //this.tagNameAutoCompleteResults.data = []
            },
            chooseTheAutoCompleteItem(payload) {
                this.releaseData.tag_name = payload
                this.tagNameAutoCompleteResults.data = []
                this.network_checkIfTagNameIsExisted()
            },
            switchTab(payload) {
                this.editorTab = payload
            },
            switchModalTab(payload) {
                this.modalData.currentTab = payload
                this.network_getModalData()
            },
            appointTarget(payload) {
                if(this.releaseData.target_commitish != payload) this.saved = false
                this.releaseData.target_commitish = payload
                this.closeModal()
            },
            async fileInputChangeHandler(e) {
                e.target.blur()
                if(!this.releaseData.id) await this.network_createRelease(true)
                await this.network_uploadReleaseAsset()
                this.$refs.fileInput.type = ""
                this.$refs.fileInput.value = ""
                this.$refs.fileInput.type = "file"
            },
        },
        watch: {
            defaultBranch(newOne) {
                if(newOne && !this.releaseData.target_commitish) this.releaseData.target_commitish = newOne
            },
            "releaseData.tag_name": function() {
                this.network_checkIfTagNameIsExisted()
            }
        },
        components: {
            PaddingPageTopTab,
            HyperlinkWrapper,
            LoadingIcon,
            SelectMenuItem,
            Modal,
            ModalLoadingIcon,
            CommonLoadingWrapper,
            AnimatedHeightWrapper,
            Container: styled.div``,
            DraftNotice: styled.div``,
            Editor: styled.div``,
            AutoCompleteItem: styled.div``,
            Tab: styled.div``,
            TabItem: styled.div``,
            Preview: styled.div``,
            FileAttachment: styled.div``,
            EmptyNotice: styled.div``,
            ModalTab: styled.div``,
            UploadFileItem: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/dropdown/index.scss';
@import 'node_modules/@primer/css/autocomplete/index.scss';
@import 'node_modules/@primer/css/navigation/index.scss';
@import 'node_modules/@primer/css/select-menu/index.scss';
@import 'node_modules/@primer/css/markdown/index.scss';
@import 'node_modules/@primer/css/labels/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/blankslate/index.scss';
@import 'node_modules/@primer/css/alerts/index.scss';
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/layout/index.scss';
.input-loading-icon-wrapper{
    pointer-events: none;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
}
.tab-selected{
    background-color: #fff;
    border-color: #e1e4e8;
    border-radius: 6px 6px 0 0;
}
.preview-body {
    background-color: initial;
    width: 100%;
    overflow: visible;
    font-size: 14px;
    min-height: 150px;
    padding: 4px 4px 16px;
    border-bottom: 1px solid #e1e4e8;
}

/* .drop-target{
    border: 1px solid #c3c8cf;
    border-radius: 6px;
} */
.drop-target-label{
    height: 65px;
    padding: 7px 10px;
    margin: 0;
    font-size: 13px;
    line-height: 16px;
    color: #586069;
    background-color: #fafbfc;
    
}

.select-menu-text-filter{
    background-color: #f6f8fa;
    border-bottom: 1px solid #dfe2e5;
    input {
        display: block;
        width: 100%;
        max-width: 100%;
        border: 1px solid #dfe2e5;
        border-radius: 3px;
    }
}

.active-modal-tab{
    background: white
}

.cover{
    position: fixed;
    top: 0px;
    bottom: 0px;
    right: 0px;
    left: 0px;
    z-index:1;
}

.uploaded-files {
    border: 1px solid;
    border-bottom: 0;
    border-color: #ddd #ddd #e5e5e5;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
}

.no-uploaded-file-yet{
    border-top: 1px;
    border: 1px solid #c3c8cf;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
}
</style>