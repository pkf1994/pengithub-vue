<template>
    <Container class="px-3">
        <transition name="fade" appear>
            <PaddingPageTopTab class="subnav" style="margin-right:-16px;margin-left:-16px;" :tabs="tabs"></PaddingPageTopTab>
        </transition>  

        <Editor class="pt-3 mb-3 border-top form-group mt-0">
            <div class="position-relative">
                <input @focus="tagNameInputFocusHandler" 
                        @blur="tagNameInputBlurHandler" 
                        @change="network_checkIfTagNameIsExisted" 
                        @input="tagNameInputInputHandler" type="text" placeholder="Tag version" autocomplete="off" v-model="tagName" class="form-control width-full mr-0">
                <div v-if="tagIsExisted.loading || tagNameIsInvalid.loading || tagNameAutoCompleteResults.loading" class="position-absolute input-loading-icon-wrapper d-flex flex-justify-end flex-items-center">
                    <LoadingIcon :size="22" class="mr-1"/>
                </div>
                <div v-if="tagNameAutoCompleteResults.data.length > 0" class="position-absolute autocomplete-results">
                    <AutoCompleteItem @click="() => chooseTheAutoCompleteItem(item)" class="autocomplete-item" v-for="item in tagNameAutoCompleteResults.data" :key="item">{{item}}</AutoCompleteItem>
                </div>
            </div>

            <div>
                <button :disabled="!target" class="btn mt-2 width-full" @click="() => showModal('PickBranchOrRecentCommitModal')">
                    <div class="d-flex flex-items-center">
                        <svg class="octicon octicon-git-branch mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"></path></svg>
                        <i>Target:</i>
                        <span class="flex-auto ml-1 text-left">{{target}}</span>
                        <span class="dropdown-caret ml-2"></span>
                    </div>
                </button>

                <p class="note">
                    Choose an existing tag, or create a new tag on publish
                </p>
            </div>

            <input type="text" placeholder="Release title" autocomplete="off" v-model="releaseTitle" class="form-control width-full mr-0 my-3">

            <Tab class="mx-0 mt-0 no-wrap tabnav d-flex flex-auto">
                <div class="tabnav-tabs">
                    <TabItem class="btn-link tabnav-tab px-3" @click="() => switchTab('Write')" :class="{'tab-selected':editorTab === 'Write'}">Write</TabItem>
                    <TabItem class="btn-link tabnav-tab px-3" @click="() => switchTab('Preview')" :class="{'tab-selected':editorTab === 'Preview'}">Preview</TabItem>
                </div>
            </Tab>

            <textarea v-if="editorTab == 'Write'" 
                        rows="6" 
                        placeholder="Describe this release"
                        class="mt-3 d-block width-full form-control input-contrast" 
                        v-model="releaseDescriptionMarkdownRaw"
                        id="repository_release_create_page"
                        ref="textarea"></textarea>

            <Preview  v-else class="preview-body markdown-body" v-html="releaseDescriptionPreviewHTML || 'Nothing to preview'">
            </Preview>

            <FileAttachment class="drop-target js-upload-release-file is-default ">
                <label class="drop-target-label py-3 f5 border-dashed text-normal drag-and-drop d-flex flex-justify-center flex-items-center drop-target-label position-relative mt-3">
                    <input type="file" multiple="" id="releases-upload" class="sr-only show-on-focus bg-gray py-3 width-full text-center">
                    <span class="default position-relative text-center">
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
                    <input name="release[prerelease]" type="hidden" value="0"><input type="checkbox" value="1" name="release[prerelease]" id="release_prerelease">
                    This is a pre-release
                </label>
                <span class="note">
                    We’ll point out that this release is identified as non-production ready.
                </span>
            </div>

            <div>
                <button class="btn btn-primary">Publish release</button>
                <button class="btn js-save-draft" type="submit">
                    <span class="js-save-draft-button-state" data-state="default">
                    Save draft
                    </span>
                </button>
            </div>

        </Editor>

         <Modal ref="PickBranchOrRecentCommitModal" title="Pick a branch or recent commit" :modalStyle="{height:'80vh'}" @show="network_getModalData">
                <div class="select-menu-text-filter">
                    <div class="p-3">
                        <input type="text" v-model="modalData.searchQuery" class="form-control" :placeholder="`${modalData.currentTab == 'branches' ? 'Filter branches...' : 'Filter recent commits...'}`" autofocus="" autocomplete="off"/>
                    </div>
                    <ModalTab class="SelectMenu-tabs" style="background-color: #f6f8fa;">
                        <button class="SelectMenu-tab py-2" style="font-size:14px" @click="() => switchModalTab('branches')" :class="{'active-modal-tab':modalData.currentTab == 'branches'}">Branches</button>
                        <button class="SelectMenu-tab py-2" style="font-size:14px" @click="() => switchModalTab('recentCommits')" :class="{'active-modal-tab':modalData.currentTab == 'recentCommits'}">Recent commits</button>
                    </ModalTab>
                </div>
                <div v-if="modalData.branches.loading || modalData.recentCommits.loading" class="flex-row-center height-full">
                    <ModalLoadingIcon></ModalLoadingIcon>
                </div>
                <div v-else style="overflow:auto">
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
                        <SelectMenuItem @click.native="() => appointTarget(item.sha)" v-for="item in modalFilteredAvailableRecentCommits" :key="item.sha" :selected="target == item.sha">
                            <div>
                                <div class="text-bold">{{item.sha.substring(0,7)}}</div> 
                                <div class="text-normal">{{item.commit.message}} @ <span class="no-wrap">{{item.commit.committer.date | getDateDiff}}</span></div>
                            </div>
                        </SelectMenuItem>
                    </transition-group>
                </div>
           
        </Modal>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {PaddingPageTopTab,HyperlinkWrapper,LoadingIcon,SelectMenuItem,Modal,ModalLoadingIcon} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import * as api from '@/network/api'
    import {authRequiredGet,authRequiredGitHubGraphqlApiQuery,commonGet} from '@/network'
    import * as graphql from './graphql'
    import {util_throttle,util_markdownParse} from '@/util'
    let parse = require('parse-link-header')
    export default {
        name: 'repository_release_create_page',
        mixins: [RouteUpdateAwareMixin],
        inject: ['repoBasicInfo'],
        data() {
            return {
                tagName: '',
                target: '',
                releaseTitle: '',
                releaseDescriptionMarkdownRaw: '',
                loading: false,
                isPreRelease: false,
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
                }
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
                return util_markdownParse.markdownToHTML(this.releaseDescriptionMarkdownRaw)
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
            }
        },
        created() {
            this.init()
        },
        methods: {
            init() {
                if(this.defaultBranch) this.target = this.defaultBranch
            },
            tagNameInputInputHandler() {
                util_throttle.throttleByDelay(this.network_getTagNameAutoCompleteResults,200,this)
            },
            async network_getTagNameAutoCompleteResults() {
                if(!this.tagName) return
                try{
                   this.tagNameAutoCompleteResults.loading = true 
                   let res = await commonGet(
                       api.API_PROXY_TAGS({
                           repo: this.repo,
                           owner: this.owner,
                           query: this.tagName
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
                    this.tagIsExisted.data = false
                    this.tagIsExisted.loading = true
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_TAG,
                        {
                            variables: {
                                name: this.repo,
                                owner: this.owner,
                                qualifiedName: `refs/recentCommits/${this.tagName}`
                            },
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' check_if_tag_name_is_existed')
                        }
                    )

                    try{
                        let tag = res.data.data.repository.ref
                        if(ref) {
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
                this.tagNameAutoCompleteResults.data = []
            },
            chooseTheAutoCompleteItem(payload) {
                this.tagName = payload
                this.tagNameAutoCompleteResults.data = []
            },
            switchTab(payload) {
                this.editorTab = payload
            },
            switchModalTab(payload) {
                this.modalData.currentTab = payload
                this.network_getModalData()
            },
            appointTarget(payload) {
                this.target = payload
                this.closeModal()
            }
        },
        watch: {
            defaultBranch(newOne) {
                if(newOne && !this.target) this.target = newOne
            }
        },
        components: {
            PaddingPageTopTab,
            HyperlinkWrapper,
            LoadingIcon,
            SelectMenuItem,
            Modal,
            ModalLoadingIcon,
            Container: styled.div``,
            Editor: styled.div``,
            AutoCompleteItem: styled.div``,
            Tab: styled.div``,
            TabItem: styled.div``,
            Preview: styled.div``,
            FileAttachment: styled.div``,
            EmptyNotice: styled.div``,
            ModalTab: styled.div``,
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
.drop-target-label{
    height: 65px;
    padding: 7px 10px;
    margin: 0;
    font-size: 13px;
    line-height: 16px;
    color: #586069;
    background-color: #fafbfc;
    border: 1px solid #c3c8cf;
    border-radius: 6px;
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
</style>