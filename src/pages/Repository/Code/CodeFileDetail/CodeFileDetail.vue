<template>
    <WithSignInNoticeWrapper ref="signInNotice">
        <CommonLoadingWrapper :loading="allBranchesAndTags.loading || loading" class="py-4 px-3">
                <RowOne class="d-flex flex-justify-between width-full width-md-auto">
                    <button class="btn btn-sm select-menu-button" @click="() => showModal('switchBranchOrTagModal')">
                        <i>{{refType | capitalize}}:</i>
                        <span class="end-with-triangle branch" data-menu-button="">{{currentRef}} <span>&nbsp;</span></span>
                    </button>

                    <span class="BtnGroup flex-shrink-0">
                        <router-link class="btn btn-sm BtnGroup-item" :to="findFileRouterLink"> 
                            Find file
                        </router-link><button class="btn btn-sm BtnGroup-item" id="file-detail-copy-btn" :data-clipboard-text="location.href"> 
                            Copy path
                        </button>
                    </span>
                   
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

                <Modal ref="switchBranchOrTagModal" title="Switch branches/tags" :modalStyle="{height:'80vh'}" @show="network_getAvailableRefs">
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
                   
                </Modal>
        </CommonLoadingWrapper>
    </WithSignInNoticeWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Breadcrumb,WithSignInNoticeWrapper,Modal,SelectMenuItem,LoadingIconEx,CommonLoadingWrapper} from '@/components'
    import ClipboardJS from 'clipboard'
    import {ContributionMessage,Content} from './components'
    import {cancelAndUpdateAxiosCancelTokenSource,authRequiredGitHubGraphqlApiQuery,authRequiredGet,commonGet} from '@/network'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {WithRefDistinguishMixin} from '../../components'
    import * as graphql from '../graphql'
    import * as api from '@/network/api'
    let parse = require('parse-link-header')
    export default {
        name: 'repository_code_file_detail_page',
        mixins: [RouteUpdateAwareMixin,WithRefDistinguishMixin],
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
                path:() => this.path,
                currentRef:() => this.currentRef,
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
                isBinary: false,
                availableBranches: {
                    data: [],
                    loading: false
                },
                availableTags: {
                    data: [],
                    loading: false
                }
            }
        },
        async mounted() {
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
                return `/${this.owner()}/${this.repo()}/find/${this.currentRef}`
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

                    let content
                    try{
                        content = res.data.data.repository.content
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }

                    if(!content) {
                        this.emitNotFoundEvent(this.$refs.signInNotice.$el)
                    }

                    this.byteSize = content.byteSize
                    this.isBinary = content.isBinary

                    try{
                        this.lastCommit.data = res.data.data.repository.commit.history.nodes[0]
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                    
                    //根据提交历史提取contributors
                    let contributors = []
                    let contributorsHolder
                    try{
                        contributorsHolder = res.data.data.repository.commitHistory.history.nodes
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                    contributorsHolder.forEach(item => {
                        if(!(contributors.some(_item => item.author.user && _item.user && _item.user.login === item.author.user.login)) && item.author.user) {
                            contributors.push(item.author)
                        }
                    })
                    this.contributors.data = contributors

                    if(!this.isBinary) {
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
                        this.raw = `https://github.com/${this.owner()}/${this.repo()}/blob/${this.currentRef}/${this.path}?raw=true`
                    }

                }catch(e){
                    this.handleError(e)
                }finally{
                    this.loading = false
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
                let regExp = new RegExp(`^/${this.owner()}/${this.repo()}/blob/${this.currentRef}`)
                let targetRouterLink = this.$route.fullPath.replace(regExp,`/${this.owner()}/${this.repo()}/blob/${ref}`)
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
                        repo: this.repo(),
                        owner: this.owner(),
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
                        repo: this.repo(),
                        owner: this.owner(),
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