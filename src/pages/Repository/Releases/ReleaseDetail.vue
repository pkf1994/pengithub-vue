<template>
    <CommonLoadingWrapper :loading="loading || commitsCountSinceThisRelease.loading" :position="loading ? 'center' : 'corner'" class="px-3">
        <transition name="fade" appear>
            <PaddingPageTopTab class="subnav" style="margin-right:-16px;margin-left:-16px;" :style="{marginBottom: data.draft ? '0px' :'16px'}" :tabs="tabs"></PaddingPageTopTab>
        </transition>  
        <div v-if="viewerPermission().data == 'ADMIN'" class="text-right mb-3">
            <span class="BtnGroup">
                <router-link :to="`/${owner}/${repo}/releases/edit/${data.id}`" class="btn BtnGroup-item">Edit</router-link>
                <button @click="() => showModal('deleteDraftModal')" class="btn btn-danger BtnGroup-item">
                    Delete
                </button>
            </span>
        </div>
        <ReleaseListItem v-if="firstLoadedFlag && type == 'release'" :release="data" class="border-top"></ReleaseListItem>
        <Tag v-else-if="firstLoadedFlag" class="border-top pt-2 pb-3"> 
            <ReleaseHeader>
                <Name class="f1">
                    {{data.tag}}
                </Name>
                <TheMeta class="d-flex flex-justify-between flex-items-center">
                    <div>
                        <span class="muted-link mr-1">
                            <svg class="octicon octicon-tag v-align-text-bottom" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path></svg>
                            {{data.tag}}
                        </span> 
                        <transition appear name="fade"> 
                            <router-link v-if="data.object && data.object.sha" class="muted-link d-inline-block" :to="tagCommitRouterLink">
                                <svg class="octicon octicon-git-commit v-align-text-bottom" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10.86 7c-.45-1.72-2-3-3.86-3-1.86 0-3.41 1.28-3.86 3H0v2h3.14c.45 1.72 2 3 3.86 3 1.86 0 3.41-1.28 3.86-3H14V7h-3.14zM7 10.2c-1.22 0-2.2-.98-2.2-2.2 0-1.22.98-2.2 2.2-2.2 1.22 0 2.2.98 2.2 2.2 0 1.22-.98 2.2-2.2 2.2z"></path></svg>
                                <code>
                                    {{data.object.sha.substring(0,7)}}
                                </code>
                            </router-link> 
                        </transition>
                        <transition appear name="fade"> 
                            <button class="verify-state-badge float-right position-relative" v-if="tagCommitIsVerified" @click="() => showModal('verifiedNoticeModal')">
                                Verified
                            </button>
                        </transition>
                    </div>

                    <button class="btn btn-sm select-menu-button text-md-left" @click="() => showModal('chooseTagToCompareModal')">
                        Compare
                    </button>

                </TheMeta>
            
            <AnimatedHeightWrapper class="my-2">
                <WhoDidWhatAtWhen class="f5 text-gray" v-if="data.tagger">
                    <transition-group name="fade-group" appear>
                        <router-link key="1" v-if="tagger.data.login" class="d-inline-block" :to="`/${tagger.data.login}`">
                            <img class="avatar avatar-user" :src="tagger.data.avatarUrl" width="20" height="20" :alt="`@${tagger.data.login}`">
                        </router-link> 
                        <router-link key="2" v-if="tagger.data.login" class="text-bold text-gray" :to="`/${tagger.data.login}`">
                            {{tagger.data.login}}
                        </router-link> 
                        <span v-else key="3">{{data.tagger.name}}</span>
                    </transition-group>
                    tagged this on
                    {{data.tagger.date | dateFormat('dd zzz yyyy')}}
                    <span v-if="commitsCountSinceThisRelease.data > 0">· {{commitsCountSinceThisRelease.data}} {{commitsCountSinceThisRelease.data > 1 ? 'commits' : 'commit'}} to {{repoBasicInfo().default_branch}} since this tag</span>    
                </WhoDidWhatAtWhen>
            </AnimatedHeightWrapper>
            
            </ReleaseHeader>

            <Body class="my-2">{{data.message}}</Body>

            <Assets class="border-top pt-3 mt-4 mb-2">
                <div class="d-flex flex-items-center mb-2" @click="triggerAssetsStretch">
                    <span class="mr-2">
                        <svg v-if="assetsStretched" class="octicon octicon-triangle-down" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 5l6 6 6-6H0z"></path></svg>
                        <svg v-else class="octicon octicon-triangle-right" viewBox="0 0 6 16" version="1.1" width="6" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 14l6-6-6-6v12z"></path></svg>
                    </span>
                    <span class="text-bold">Assets</span>
                    <span class="ml-1 Counter">2</span>
                </div>
                <div v-show="assetsStretched" class="Box Box--condensed">
                    <AssetItem class="d-flex flex-justify-between flex-items-center py-2 Box-body px-2">
                        <a :href="`https://github.com/${owner}/${repo}/archive/${data.tag}.zip`">
                            <svg class="octicon octicon-file-zip flex-shrink-0 text-gray" width="16" height="16" viewBox="0 0 12 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M8.5 1H1a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V4.5L8.5 1zM11 14H1V2h3v1h1V2h3l3 3v9zM5 4V3h1v1H5zM4 4h1v1H4V4zm1 2V5h1v1H5zM4 6h1v1H4V6zm1 2V7h1v1H5zM4 9.28A2 2 0 003 11v1h4v-1a2 2 0 00-2-2V8H4v1.28zM6 10v1H4v-1h2z"></path></svg>
                            <span class="pl-2 flex-auto min-width-0 text-bold">Source code</span>(zip)
                        </a> 
                    </AssetItem>

                    <AssetItem class="d-flex flex-justify-between flex-items-center py-2 Box-body px-2">
                        <a :href="`https://github.com/${owner}/${repo}/archive/${data.tag}.tar.gz`">
                            <svg class="octicon octicon-file-zip flex-shrink-0 text-gray" width="16" height="16" viewBox="0 0 12 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M8.5 1H1a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V4.5L8.5 1zM11 14H1V2h3v1h1V2h3l3 3v9zM5 4V3h1v1H5zM4 4h1v1H4V4zm1 2V5h1v1H5zM4 6h1v1H4V6zm1 2V7h1v1H5zM4 9.28A2 2 0 003 11v1h4v-1a2 2 0 00-2-2V8H4v1.28zM6 10v1H4v-1h2z"></path></svg>
                            <span class="pl-2 flex-auto min-width-0 text-bold">Source code</span>(tar.gz)
                        </a> 
                    </AssetItem>
                </div>
            </Assets>

        </Tag>

        <Modal ref="chooseTagToCompareModal" :title="`Choose a tag to compare with ${data.tag}`" :modalStyle="{height: '80vh',position:'relative',display:'flex'}" @show="network_getAvailableTagsToCompare">
            <div style="padding:10px" class="bg-white border-bottom">
                <input v-model="tagsToCompare.searchQuery" type="text" class="form-control width-full" placeholder="Find a tag" autofocus="" autocomplete="off" spellcheck="false">
            </div>
            <div v-if="tagsToCompare.loading" class="position-absolute d-flex flex-items-center flex-justify-center" style="top:0;bottom:0;right:0;left:0">
                <LoadingIconEx></LoadingIconEx>
            </div> 
            <div style="overflowY:auto" class="flex-grow-1">
                <transition-group name="fade-group" appear>
                    <router-link class="d-block" v-for="item in filteredTags" :key="item" :to="`/${owner}/${repo}/compare/${item}...${data.tag}`">
                        <SelectMenuItem :selected="item == name">
                            {{item}}
                        </SelectMenuItem>
                    </router-link>
                    <div key="Emtpy notice" v-if="filteredTags.length == 0 && !tagsToCompare.loading" class="p-3 d-flex flex-items-center flex-justify-center">
                        Nothing to show
                    </div>
                </transition-group>
            </div>
            <footer class="SelectMenu-footer bg-white">
                <router-link :to="`/${owner}/${repo}/tags`">View all tags</router-link>
            </footer>
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
    import {PaddingPageTopTab,SimplePaginationRest,Modal,AnimatedHeightWrapper,CommonLoadingWrapper,SelectMenuItem,LoadingIconEx} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import * as api from '@/network/api'
    import {authRequiredGet,authRequiredDelete,authRequiredGitHubGraphqlApiQuery,commonGet} from '@/network'
    import ReleaseListItem from './ReleaseListItem'
    import * as graphql from './graphql'
    let parse = require('parse-link-header')
    export default {
        name: 'repository_release_detail_page',
        inject: ['repoBasicInfo','viewerPermission'],
        mixins: [RouteUpdateAwareMixin],
        provide() {
            return {
                extraDataProvided: () => this.extraData.data
            }
        },
        data() {
            return {
                data: {},
                tagCommit: {},
                type: '',
                loading: false,
                firstLoadedFlag: false,
                extraData: {
                    data: [],
                    loading: false
                },
                commitsCountSinceThisRelease: {
                    data: undefined,
                    loading: false
                },
                assetsStretched: false,
                tagger: {
                    data: {},
                    loading: false
                },
                tagsToCompare: {
                    searchQuery: '',
                    data: [],
                    loading: false
                },
                loadingDeleteDraft: false
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
                        activeFlag: this.type == 'release'
                    },
                    {
                        label: 'Tags',
                        to: `/${this.owner}/${this.repo}/tags`,
                        activeFlag: this.type == 'tag'
                    },
                ]
            },
            tagOrRelease() {
                return this.$route.params.tagOrRelease
            },
            tagCommitRouterLink() {
                if(!this.data.object) return
                if(!this.data.object.sha) return
                return `/${this.owner}/${this.repo}/commits/${this.data.object.sha}`
            },
            tagCommitIsVerified(){
                if(!this.data.verification) return 
                return this.data.verification.verified
            },
            repoDefaultBranch() {
                return this.repoBasicInfo().default_branch
            },
            filteredTags() {
                return this.tagsToCompare.data.filter( i => {
                    return i.toLowerCase().indexOf(this.tagsToCompare.searchQuery.toLowerCase()) > -1
                })
            },
            isDraft() {
                return this.$route.query.draft
            }
        }, 
        created() {
            this.network_getData()
        },
        methods: {
            network_getData() {
                if(this.$route.query.draft && this.accessToken) {
                    this.network_getDraftRelease()
                    return
                }
                this.network_getReleaseOrTagByTagName()
            },
            async network_getDraftRelease() {
                 try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_REPOSITORY_RELEASE({
                        owner: this.owner,
                        repo: this.repo,
                        releaseId: this.tagOrRelease
                    })
                    let res = await authRequiredGet(
                            url,
                            {cancelToken}
                        )
                    this.data = res.data
                    this.type = "release"

                    this.network_getExtraData()

                    this.firstLoadedFlag = true
                    this.loading = false
                }catch(e) {
                    this.loading = false
                    if(e.response && e.response.status == 404) {
                            this.network_getReleaseOrTagByTagName()
                    }else{
                        this.handleError(e)
                    }
                } 
            },
            async network_getReleaseOrTagByTagName() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_REPOSITORY_RELEASE_BY_TAG_NAME({
                        owner: this.owner,
                        repo: this.repo,
                        tag: this.tagOrRelease
                    })
                    let res = await authRequiredGet(
                            url,
                            {cancelToken}
                        )
                    this.data = res.data
                    this.type = "release"

                    if(this.accessToken) this.network_getExtraData()

                    this.firstLoadedFlag = true
                    this.loading = false
                }catch(e) {
                    this.loading = false
                    if(e.response && e.response.status == 404) {
                            this.network_getTag()
                    }else{
                        this.handleError(e)
                    }
                }
            },
            async network_getExtraData() {
                try{
                    this.extraData.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_extra_data')
                    let graphql_extraData = graphql.GRAPHQL_RELEASES([{...this.data}])
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_extraData,{cancelToken})
                    let dataHolder
                    try{
                        dataHolder = res.data.data
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                    let extraData = []
                    for(let key in dataHolder) {
                        extraData.push(dataHolder[key])
                    }
                    this.extraData.data = extraData
                }catch(e) {
                    console.log(e)
                }finally{
                    this.extraData.loading = false
                }
            },
            async network_getTag() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_tag')
                    let url = api.API_GIT_REF({
                        owner: this.owner,
                        repo: this.repo,
                        ref: `tags/${this.tagOrRelease}`
                    })

                    try{
                        let res = await authRequiredGet(
                            url,
                            {cancelToken}
                        )
                    }catch(e) {
                        if(e.response && e.response.status == 404) {
                            this.emitNotFoundEvent(this.$el)
                        }
                    }
                    
                    let res_tag = await authRequiredGet(
                        res.data.object.url,
                        {cancelToken}
                    )
                    
                    this.data = res_tag.data
                    this.type = "tag"
                    this.firstLoadedFlag = true

                    this.network_getCommitCountSinceThisTag()

                    if(res_tag.data.object.url) {
                        let res_tagCommit = await authRequiredGet(
                            res_tag.data.object.url,
                            {cancelToken}
                        )
                        this.tagCommit = res_tagCommit.data
                        if(this.accessToken) {
                            this.network_getTagger()
                        }
                    }
                   
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            async network_getCommitCountSinceThisTag() {
                if(!this.repoDefaultBranch) return
                if(!this.data.tag) return
                if(this.commitsCountSinceThisRelease.loading) return
                if(this.commitsCountSinceThisRelease.data !== undefined) return
                 try{
                    this.commitsCountSinceThisRelease.loading = true
                    let url = api.API_COMMITS_COMPARE({
                            owner: this.owner,
                            repo: this.repo,
                            baseHead: `${this.data.tag}...${this.repoDefaultBranch}`
                        }
                    )
                    let res = await authRequiredGet(url)
                    this.commitsCountSinceThisRelease.data = res.data.total_commits

                }catch(e) {
                    console.log(e)
                }finally{
                    this.commitsCountSinceThisRelease.loading = false
                }
            },
            async network_getTagger() {
                try{
                    this.tagger.loading = true
                    let graphql_tag = graphql.GRAPHQL_TAG(this.data.node_id)
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_tag)
                    try{
                        this.tagger.data = res.data.data.node.tagger.user || {}
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                    
                }catch(e) {
                    console.log(e)
                }finally{
                    this.tagger.loading = false
                }
            },
            async network_getAvailableTagsToCompare() {
                if(this.tagsToCompare.data.length > 0) return
                if(this.tagsToCompare.loading) return
                try {
                    this.tagsToCompare.loading = true
                    let url = api.API_REPOSITORY_COMPARE_AVAILABLE_TAGS({
                        owner: this.owner,
                        repo: this.repo,
                        baseHead: this.name,
                        tag: this.name,
                        type: 'base'
                    })

                    let res = await commonGet(url)
                    this.parseAvailableTagsToCompare(res.data)
                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.tagsToCompare.loading = false
                }
            },
            async network_deleteDraft() {
                try {
                    this.loadingDeleteDraft = true
                    let url = api.API_REPOSITORY_RELEASE({
                        repo: this.repo,
                        owner: this.owner,
                        releaseId: this.data.id
                    })

                    let res = await authRequiredDelete(
                        url
                    )

                    this.closeModal()

                    this.$router.push(`/${this.owner}/${this.repo}/releases?deleted=${this.data.id}`)

                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loadingDeleteDraft = false
                }
            },
            parseAvailableTagsToCompare(HTML) {
                let tagPattern = /<span class="css-truncate css-truncate-overflow" title="(.*)" >/g
                let tagExecResult
                let tags = []
                while((tagExecResult = tagPattern.exec(HTML)) != null) {
                    tags.push(tagExecResult[1])
                }
                this.tagsToCompare.data = tags
            },
            showModal(modalRef) {
                this.$refs[modalRef].show = true
            },
             triggerAssetsStretch() {
                this.assetsStretched = !this.assetsStretched
            },
        },
        watch: {
            repoDefaultBranch(newOne,oldOne) {
                if(newOne && !oldOne) {
                    this.network_getCommitCountSinceThisTag()
                }
            },
            'data.tag': function(newOne,oldOne) {
                if(newOne && !oldOne) {
                    this.network_getCommitCountSinceThisTag()
                }
            }
        },
        components: {
            ReleaseListItem,
            PaddingPageTopTab,
            AnimatedHeightWrapper,
            SimplePaginationRest,
            Modal,
            SelectMenuItem,
            LoadingIconEx,
            CommonLoadingWrapper,
            Container: styled.div``,
            Tag: styled.div``,
            ReleaseHeader: styled.div``,
            Name: styled.div``,
            TheMeta: styled.div``,
            WhoDidWhatAtWhen: styled.div``,
            Body: styled.pre``,
            Assets: styled.div``,
            AssetItem: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/navigation/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
@import 'node_modules/@primer/css/labels/index.scss';
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/select-menu/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/alerts/index.scss';
.select-menu-button:after {
    display: inline-block;
    width: 0;
    height: 0;
    vertical-align: -2px;
    content: "";
    border: 4px solid transparent;
    border-top-color: currentcolor;
}
</style>