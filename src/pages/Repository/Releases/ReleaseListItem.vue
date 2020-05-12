<template>
    <Container class="pt-2 pb-2">
        <ReleaseHeader>
            <Name class="f1">
                <span v-if="release.prerelease" class="flex-shrink-0 ml-2 mt-2 Label Label--outline Label--prerelease float-right">
                    Pre-release
                </span>
                <span v-if="isLatestRelease" class="flex-shrink-0 ml-2 mt-2 Label Label--outline Label--outline-green float-right">
                    Latest release
                </span>
                <router-link :to="to">
                    {{name}}
                </router-link>
            </Name>
            <AnimatedHeightWrapper>
                <TheMeta>
                    <router-link class="muted-link mr-1" :to="resourcePath">
                        <svg class="octicon octicon-tag" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path></svg>
                        {{release.tag_name}}
                    </router-link> 
                    <transition appear name="fade"> 
                        <router-link class="muted-link d-inline-block" v-if="commitSha" :to="extraDataHolder.tag.target.commitResourcePath">
                            <svg class="octicon octicon-git-commit" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10.86 7c-.45-1.72-2-3-3.86-3-1.86 0-3.41 1.28-3.86 3H0v2h3.14c.45 1.72 2 3 3.86 3 1.86 0 3.41-1.28 3.86-3H14V7h-3.14zM7 10.2c-1.22 0-2.2-.98-2.2-2.2 0-1.22.98-2.2 2.2-2.2 1.22 0 2.2.98 2.2 2.2 0 1.22-.98 2.2-2.2 2.2z"></path></svg>
                            {{commitSha.substring(0,7)}}
                        </router-link> 
                    </transition>
                    <transition appear name="fade"> 
                        <button class="verify-state-badge float-right position-relative" v-if="commitIsVerified" @click="() => showModal('verifiedNoticeModal')">
                            Verified
                        </button>
                    </transition>
                </TheMeta>
            </AnimatedHeightWrapper>
           
           <AnimatedHeightWrapper class="my-2">
                <WhoDidWhatAtWhen class="f5 text-gray">
                    <router-link class="d-inline-block" :to="`/${release.author.login}`">
                        <img class="avatar" :src="release.author.avatar_url" width="20" height="20" :alt="`@${release.author.login}`">
                    </router-link> 
                    <router-link class="text-bold text-gray" :to="`/${release.author.login}`">
                        {{release.author.login}}
                    </router-link> 
                    released this on
                    {{release.published_at | dateFormat('dd zzz yyyy')}}
                    <span v-if="commitsCountSinceThisRelease > 0">· {{commitsCountSinceThisRelease}} {{commitsCountSinceThisRelease > 1 ? 'commits' : 'commit'}} to {{release.target_commitish}} since this release</span>    
                </WhoDidWhatAtWhen>
           </AnimatedHeightWrapper>
           
        </ReleaseHeader>
        <Body class="markdown-body" v-html="bodyHTML">

        </Body>

        <Assets class="border-top pt-3 mt-4 mb-2">
            <div class="d-flex flex-items-center mb-2" @click="triggerAssetsStretch">
                <span class="mr-2">
                    <svg v-if="assetsStretched" class="octicon octicon-triangle-down" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 5l6 6 6-6H0z"></path></svg>
                    <svg v-else class="octicon octicon-triangle-right" viewBox="0 0 6 16" version="1.1" width="6" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 14l6-6-6-6v12z"></path></svg>
                </span>
                <span class="text-bold">Assets</span>
                <span class="ml-1 Counter">{{this.release.assets.length + 2}}</span>
            </div>
            <AnimatedHeightWrapper :stretch="assetsStretched"> 
                <div class="Box Box--condensed">
                    <AssetItem v-for="item in release.assets" :key="item.id" class="d-flex flex-justify-between flex-items-center py-2 Box-body px-2">
                        <a :href="item.browser_download_url">
                            <svg class="octicon octicon-package flex-shrink-0 text-gray" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1 4.27v7.47c0 .45.3.84.75.97l6.5 1.73c.16.05.34.05.5 0l6.5-1.73c.45-.13.75-.52.75-.97V4.27c0-.45-.3-.84-.75-.97l-6.5-1.74a1.4 1.4 0 00-.5 0L1.75 3.3c-.45.13-.75.52-.75.97zm7 9.09l-6-1.59V5l6 1.61v6.75zM2 4l2.5-.67L11 5.06l-2.5.67L2 4zm13 7.77l-6 1.59V6.61l2-.55V8.5l2-.53V5.53L15 5v6.77zm-2-7.24L6.5 2.8l2-.53L15 4l-2 .53z"></path></svg>
                            <span class="pl-2 flex-auto min-width-0 text-bold">{{item.name}}</span>
                        </a> 
                        <small class="pl-2 text-gray flex-shrink-0">{{item.size | fileSize}}</small>
                    </AssetItem>

                    <AssetItem class="d-flex flex-justify-between flex-items-center py-2 Box-body px-2">
                        <a :href="release.zipball_url">
                            <svg class="octicon octicon-file-zip flex-shrink-0 text-gray" width="16" height="16" viewBox="0 0 12 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M8.5 1H1a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V4.5L8.5 1zM11 14H1V2h3v1h1V2h3l3 3v9zM5 4V3h1v1H5zM4 4h1v1H4V4zm1 2V5h1v1H5zM4 6h1v1H4V6zm1 2V7h1v1H5zM4 9.28A2 2 0 003 11v1h4v-1a2 2 0 00-2-2V8H4v1.28zM6 10v1H4v-1h2z"></path></svg>
                            <span class="pl-2 flex-auto min-width-0 text-bold">Source code</span>(zip)
                        </a> 
                    </AssetItem>

                    <AssetItem class="d-flex flex-justify-between flex-items-center py-2 Box-body px-2">
                        <a :href="release.tarball_url">
                            <svg class="octicon octicon-file-zip flex-shrink-0 text-gray" width="16" height="16" viewBox="0 0 12 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M8.5 1H1a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V4.5L8.5 1zM11 14H1V2h3v1h1V2h3l3 3v9zM5 4V3h1v1H5zM4 4h1v1H4V4zm1 2V5h1v1H5zM4 6h1v1H4V6zm1 2V7h1v1H5zM4 9.28A2 2 0 003 11v1h4v-1a2 2 0 00-2-2V8H4v1.28zM6 10v1H4v-1h2z"></path></svg>
                            <span class="pl-2 flex-auto min-width-0 text-bold">Source code</span>(tar.gz)
                        </a> 
                    </AssetItem>
                </div>
            </AnimatedHeightWrapper>
        </Assets>

        <Modal v-if="commitIsVerified" ref="verifiedNoticeModal" title="Verified commit">
            <div class="p-3 d-flex" style="background-color: #f6f8fa;">
                <div>
                    <svg height="32" class="octicon octicon-verified mr-2" style="color: #28a745;" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M15.67 7.066l-1.08-1.34a1.5 1.5 0 01-.309-.77l-.19-1.698a1.51 1.51 0 00-1.329-1.33l-1.699-.19c-.3-.03-.56-.159-.78-.329L8.945.33a1.504 1.504 0 00-1.878 0l-1.34 1.08a1.5 1.5 0 01-.77.31l-1.698.19c-.7.08-1.25.63-1.33 1.329l-.19 1.699c-.03.3-.159.56-.329.78L.33 7.055a1.504 1.504 0 000 1.878l1.08 1.34c.17.22.28.48.31.77l.19 1.698c.08.7.63 1.25 1.329 1.33l1.699.19c.3.03.56.159.78.329l1.339 1.08c.55.439 1.329.439 1.878 0l1.34-1.08c.22-.17.48-.28.77-.31l1.698-.19c.7-.08 1.25-.63 1.33-1.329l.19-1.699c.03-.3.159-.56.329-.78l1.08-1.339a1.504 1.504 0 000-1.878zM6.5 12.01L3 8.51l1.5-1.5 2 2 5-5L13 5.56l-6.5 6.45z"></path></svg>
                </div>
                <div>
                    This commit was signed with a <strong class="signed-commit-verified-label">verified signature</strong>
                    <span v-if="extraDataHolder.tag.target.signature.wasSignedByGitHub">
                        using GitHub’s key.
                    </span>
                </div>
            </div>
            <div class="p-3" v-if="extraDataHolder.tag.target.signature.keyId">
                <span class="d-block">GPG key ID: <span class="text-gray">{{extraDataHolder.tag.target.signature.keyId}}</span></span>
                <HyperlinkWrapper>
                    <a href="https://help.github.com/articles/signing-commits-with-gpg/">Learn about signing commits</a>
                </HyperlinkWrapper>
            </div>
        </Modal>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper,Modal,HyperlinkWrapper} from '@/components'
    import * as api from "@/network/api"
    import {authRequiredGet} from '@/network'
    import {util_markdownParse} from "@/util"
    let parse = require('parse-link-header')
    export default {
        inject: ['owner','repo','extraDataProvided'],
        props: {
            release: {
                type: Object,
                required: true
            },
            isLatestRelease: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                commitsCountSinceThisRelease: 0,
                loading: false,
                assetsStretched: false
            }
        },
        computed: {
            to() {
                return this.release.url.replace('https://api.github.com/repos','')
            },
            name() {
                let name = this.release.name
                if(name.trim() == '' || !name) return this.release.tag_name
                return name
            },
            bodyHTML() {
                return util_markdownParse.markdownToHTML(this.release.body)
            },
            extraDataHolder() {
                return this.extraDataProvided().filter(i => i.id == this.release.node_id)[0]
            },
            commitSha() {
                return this.extraDataHolder && this.extraDataHolder.tag.target.oid
            },
            resourcePath() {
                return `/${this.owner()}/${this.repo()}/tree/${this.release.tag_name}`
            },
            commitIsVerified() {
                return this.extraDataHolder && this.extraDataHolder.tag.target.signature && this.extraDataHolder.tag.target.signature.isValid
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{    
                    this.loading = true
                    let url = api.API_COMMITS(
                        this.owner(),
                        this.repo(),
                        {
                            sha: this.release.target_commitish,
                            since: this.release.published_at,
                            per_page: 1
                        }
                    )
                    let res = await authRequiredGet(url)
                    let commitsCountSinceThisReleaseHolder = parse(res.headers.link) || {}
                    this.commitsCountSinceThisRelease = commitsCountSinceThisReleaseHolder.last ? commitsCountSinceThisReleaseHolder.last.page : res.data.length

                }catch(e) {
                    console.log(e)
                }finally{
                    this.loading = false
                }
            },
             triggerAssetsStretch() {
                this.assetsStretched = !this.assetsStretched
            },
            showModal(modalRef) {
                this.$refs[modalRef].show = true
            }
        },
        components: {
            AnimatedHeightWrapper,
            Modal,
            HyperlinkWrapper,
            Container: styled.div``,
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

<style lang="scss">
@import 'node_modules/@primer/css/markdown/index.scss';
</style>

<style scoped lang="scss">
@import 'node_modules/@primer/css/avatars/index.scss';
@import 'node_modules/@primer/css/labels/index.scss';
@import 'node_modules/@primer/css/box/index.scss';
.verify-state-badge{
    color: #22863a;
    margin-top: -2px;
    margin-right: 3px;
    display: inline-block;
    padding: 1px 4px;
    font-size: 10px;
    vertical-align: middle;
    user-select: none;
    background: none;
    border: 1px solid #e1e4e8;
    border-radius: 3px;
}

.Label--prerelease {
    color: #f66a0a;
    border-color: #f66a0a;
}

.Label--outline-green {
    color: #28a745;
    border: 1px solid #34d058;
}

.signed-commit-verified-label {
    color: #1e7e34;
    white-space: nowrap;
}
</style>