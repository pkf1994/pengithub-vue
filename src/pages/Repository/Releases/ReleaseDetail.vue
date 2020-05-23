<template>
    <CommonLoadingWrapper :loading="loading || commitsCountSinceThisRelease.loading" :position="loading ? 'center' : 'corner'" class="px-3">
        <transition name="fade" appear>
            <PaddingPageTopTab v-if="firstLoadedFlag" class="subnav" style="margin-right:-16px;margin-left:-16px;" :tabs="tabs"></PaddingPageTopTab>
        </transition>  
        <ReleaseListItem v-if="firstLoadedFlag && type == 'release'" :release="data" class="border-top"></ReleaseListItem>
        <Tag v-else-if="firstLoadedFlag" class="border-top pt-2 pb-3"> 
            <ReleaseHeader>
                <Name class="f1">
                    {{data.tag}}
                </Name>
                <AnimatedHeightWrapper>
                    <TheMeta>
                        <span class="muted-link mr-1">
                            <svg class="octicon octicon-tag" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path></svg>
                            {{data.tag}}
                        </span> 
                        <transition appear name="fade"> 
                            <router-link v-if="data.object && data.object.sha" class="muted-link d-inline-block" :to="tagCommitRouterLink">
                                <svg class="octicon octicon-git-commit" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10.86 7c-.45-1.72-2-3-3.86-3-1.86 0-3.41 1.28-3.86 3H0v2h3.14c.45 1.72 2 3 3.86 3 1.86 0 3.41-1.28 3.86-3H14V7h-3.14zM7 10.2c-1.22 0-2.2-.98-2.2-2.2 0-1.22.98-2.2 2.2-2.2 1.22 0 2.2.98 2.2 2.2 0 1.22-.98 2.2-2.2 2.2z"></path></svg>
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
                    </TheMeta>
                </AnimatedHeightWrapper>
            
            <AnimatedHeightWrapper class="my-2">
                <WhoDidWhatAtWhen class="f5 text-gray" v-if="data.tagger">
                    <transition-group name="fade-group" appear>
                         <router-link key="1" v-if="tagger.data.login" class="d-inline-block" :to="`/${tagger.data.login}`">
                            <img class="avatar" :src="tagger.data.avatarUrl" width="20" height="20" :alt="`@${tagger.data.login}`">
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

            <Body class="my-2">
                {{data.message}}
            </Body>

            <Assets class="border-top pt-3 mt-4 mb-2">
                <div class="d-flex flex-items-center mb-2" @click="triggerAssetsStretch">
                    <span class="mr-2">
                        <svg v-if="assetsStretched" class="octicon octicon-triangle-down" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 5l6 6 6-6H0z"></path></svg>
                        <svg v-else class="octicon octicon-triangle-right" viewBox="0 0 6 16" version="1.1" width="6" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 14l6-6-6-6v12z"></path></svg>
                    </span>
                    <span class="text-bold">Assets</span>
                    <span class="ml-1 Counter">2</span>
                </div>
                <AnimatedHeightWrapper :stretch="assetsStretched"> 
                    <div class="Box Box--condensed">
                        <AssetItem class="d-flex flex-justify-between flex-items-center py-2 Box-body px-2">
                            <a :href="`https://github.com/${owner()}/${repo()}/archive/${data.tag}.zip`">
                                <svg class="octicon octicon-file-zip flex-shrink-0 text-gray" width="16" height="16" viewBox="0 0 12 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M8.5 1H1a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V4.5L8.5 1zM11 14H1V2h3v1h1V2h3l3 3v9zM5 4V3h1v1H5zM4 4h1v1H4V4zm1 2V5h1v1H5zM4 6h1v1H4V6zm1 2V7h1v1H5zM4 9.28A2 2 0 003 11v1h4v-1a2 2 0 00-2-2V8H4v1.28zM6 10v1H4v-1h2z"></path></svg>
                                <span class="pl-2 flex-auto min-width-0 text-bold">Source code</span>(zip)
                            </a> 
                        </AssetItem>

                        <AssetItem class="d-flex flex-justify-between flex-items-center py-2 Box-body px-2">
                            <a :href="`https://github.com/${owner()}/${repo()}/archive/${data.tag}.tar.gz`">
                                <svg class="octicon octicon-file-zip flex-shrink-0 text-gray" width="16" height="16" viewBox="0 0 12 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M8.5 1H1a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V4.5L8.5 1zM11 14H1V2h3v1h1V2h3l3 3v9zM5 4V3h1v1H5zM4 4h1v1H4V4zm1 2V5h1v1H5zM4 6h1v1H4V6zm1 2V7h1v1H5zM4 9.28A2 2 0 003 11v1h4v-1a2 2 0 00-2-2V8H4v1.28zM6 10v1H4v-1h2z"></path></svg>
                                <span class="pl-2 flex-auto min-width-0 text-bold">Source code</span>(tar.gz)
                            </a> 
                        </AssetItem>
                    </div>
                </AnimatedHeightWrapper>
            </Assets>

        </Tag>

    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {PaddingPageTopTab,SimplePaginationRest,Modal,AnimatedHeightWrapper} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import * as api from '@/network/api'
    import {authRequiredGet,authRequiredGitHubGraphqlApiQuery} from '@/network'
    import ReleaseListItem from './ReleaseListItem'
    import * as graphql from './graphql'
    let parse = require('parse-link-header')
    export default {
        name: 'repository_release_detail_page',
        inject: ['repo','owner','repoBasicInfo'],
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
                type: 'release',
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
                }
            }
        },
        computed: {
            tabs() {
                return [
                    {
                        label: 'Releases',
                        to: `/${this.owner()}/${this.repo()}/releases`,
                        activeFlag: this.type == 'release'
                    },
                    {
                        label: 'Tags',
                        to: `/${this.owner()}/${this.repo()}/tags`,
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
                return `/${this.owner()}/${this.repo()}/commits/${this.data.object.sha}`
            },
            tagCommitIsVerified(){
                if(!this.data.verification) return 
                return this.data.verification.verified
            },
            repoDefaultBranch() {
                return this.repoBasicInfo().default_branch
            }
        }, 
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_REPOSITORY_RELEASE_BY_TAG_NAME({
                        owner: this.owner(),
                        repo: this.repo(),
                        tag: this.tagOrRelease
                    })
                    let res = await authRequiredGet(
                            url,
                            {cancelToken}
                        )
                    this.data = res.data

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
                        owner: this.owner(),
                        repo: this.repo(),
                        ref: `tags/${this.tagOrRelease}`
                    })
                    let res = await authRequiredGet(
                        url,
                        {cancelToken}
                    )
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
                 try{
                    this.commitsCountSinceThisRelease.loading = true
                    let url = api.API_COMMITS_COMPARE({
                            owner: this.owner(),
                            repo: this.repo(),
                            base: this.data.tag,
                            head: this.repoDefaultBranch
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
            showModal(modalRef) {
                this.$refs[modalRef].show = true
            },
             triggerAssetsStretch() {
                this.assetsStretched = !this.assetsStretched
            },
        },
        watch: {
            repoDefaultBranch() {
                if(!this.commitsCountSinceThisRelease.data) {
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
            Container: styled.div``,
            Tag: styled.div``,
            ReleaseHeader: styled.div``,
            Name: styled.div``,
            TheMeta: styled.div``,
            WhoDidWhatAtWhen: styled.div``,
            Body: styled.div``,
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
</style>