<template>
    <Container class="pt-2 pb-2">
        <ReleaseHeader>
            <Name class="f1">
                <span v-if="release.draft" class="flex-shrink-0 ml-2 mt-2 Label Label--outline Label--draft float-right px-2" style="border-radius:2em">
                    Draft
                </span>
                <span v-else-if="release.prerelease" class="flex-shrink-0 ml-2 mt-2 Label Label--outline Label--prerelease float-right px-2" style="border-radius:2em">
                    Pre-release
                </span>
                <span v-if="!release.draft && isLatest" class="flex-shrink-0 ml-2 mt-2 Label Label--outline Label--outline-green float-right px-2" style="border-radius:2em">
                    Latest release
                </span>
                <router-link :to="to">
                    {{release.draft ? 'Draft' : name}}
                </router-link>
            </Name>
            <AnimatedHeightWrapper v-if="!release.draft">
                <TheMeta class="d-flex flex-items-center flex-justify-between">
                    <div>
                        <router-link class="muted-link mr-1" :to="resourcePath">
                            <svg class="octicon octicon-tag v-align-text-bottom" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z"></path></svg>
                            {{release.tag_name}}
                        </router-link> 
                        <transition appear name="fade"> 
                            <router-link class="muted-link d-inline-block" v-if="commitaAbbreviatedOid" :to="extraDataHolder.tag.target.target.resourcePath">
                                <svg class="octicon octicon-git-commit v-align-text-bottom" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10.86 7c-.45-1.72-2-3-3.86-3-1.86 0-3.41 1.28-3.86 3H0v2h3.14c.45 1.72 2 3 3.86 3 1.86 0 3.41-1.28 3.86-3H14V7h-3.14zM7 10.2c-1.22 0-2.2-.98-2.2-2.2 0-1.22.98-2.2 2.2-2.2 1.22 0 2.2.98 2.2 2.2 0 1.22-.98 2.2-2.2 2.2z"></path></svg>
                                {{commitaAbbreviatedOid}}
                            </router-link> 
                        </transition>
                    </div>
                    <div v-if="release.tag_name" class="d-flex flex-items-center">
                        <button class="btn btn-sm select-menu-button text-md-left" @click="() => showModal('chooseTagToCompareModal')">
                            Compare
                        </button>
                        <!-- <transition appear name="fade"> 
                            <button class="verify-state-badge position-relative ml-2 px-2" v-if="commitIsVerified" @click="() => showModal('verifiedNoticeModal')">
                                Verified
                            </button>
                        </transition> -->
                    </div>
                    
                </TheMeta>
            </AnimatedHeightWrapper>
           
           <AnimatedHeightWrapper class="my-2">
                <WhoDidWhatAtWhen class="f5 text-gray">
                    <router-link class="d-inline-block" :to="`/${release.author.login}`">
                        <img class="avatar avatar-user" :src="release.author.avatar_url" width="20" height="20" :alt="`@${release.author.login}`">
                    </router-link> 
                    <router-link class="text-bold text-gray" :to="`/${release.author.login}`">
                        {{release.author.login}}
                    </router-link> 
                    
                    <span v-if="release.draft">
                        drafted this {{release.created_at | getDateDiff}}
                    </span>
                    <span v-else> 
                        released this on {{release.published_at | dateFormat('dd zzz yyyy')}}
                        <span v-if="commitsCountSinceThisRelease > 0">· {{commitsCountSinceThisRelease}} {{commitsCountSinceThisRelease > 1 ? 'commits' : 'commit'}} to {{release.target_commitish}} since this release</span>    
                    </span>
                </WhoDidWhatAtWhen>
           </AnimatedHeightWrapper>
           
        </ReleaseHeader>
        <Body class="markdown-body" v-html="bodyHTML">

        </Body>

        <Assets class="border-top pt-3 mt-4 mb-2" v-if="release.zipball_url || release.tarball_url || release.assets.length > 0">
            <div class="d-flex flex-items-center mb-2" @click="triggerAssetsStretch">
                <span class="mr-2">
                    <svg v-if="assetsStretched" class="octicon octicon-triangle-down v-align-text-bottom" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z"></path></svg>
                    <svg v-else class="octicon octicon-triangle-right v-align-text-bottom" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M6.427 4.427l3.396 3.396a.25.25 0 010 .354l-3.396 3.396A.25.25 0 016 11.396V4.604a.25.25 0 01.427-.177z"></path></svg>
                </span>
                <span class="text-bold">Assets</span>
                <span class="ml-1 Counter">{{assetListLength}}</span>
            </div>
                <div v-if="assetsStretched" class="Box Box--condensed">
                    <AssetItem v-for="item in release.assets" :key="item.id" class="d-flex flex-justify-between flex-items-center py-2 Box-body px-2">
                        <a class="d-flex flex-items-center" :href="item.browser_download_url">
                            <svg class="octicon octicon-package flex-shrink-0 text-gray" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.878.392a1.75 1.75 0 00-1.756 0l-5.25 3.045A1.75 1.75 0 001 4.951v6.098c0 .624.332 1.2.872 1.514l5.25 3.045a1.75 1.75 0 001.756 0l5.25-3.045c.54-.313.872-.89.872-1.514V4.951c0-.624-.332-1.2-.872-1.514L8.878.392zM7.875 1.69a.25.25 0 01.25 0l4.63 2.685L8 7.133 3.245 4.375l4.63-2.685zM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432L2.5 5.677zm6.25 8.271l4.625-2.683a.25.25 0 00.125-.216V5.677L8.75 8.432v5.516z"></path></svg>
                            <span class="pl-2 flex-auto min-width-0 text-bold">{{item.name}}</span>
                        </a> 
                        <small class="pl-2 text-gray flex-shrink-0">{{item.size | fileSize}}</small>
                    </AssetItem>

                    <AssetItem v-if="release.zipball_url" class="d-flex flex-justify-between flex-items-center py-2 Box-body px-2">
                        <a class="d-flex flex-items-center" :href="release.zipball_url">
                            <svg class="octicon octicon-file-zip flex-shrink-0 text-gray" width="16" height="16" viewBox="0 0 16 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M3.5 1.75a.25.25 0 01.25-.25h3a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h2.086a.25.25 0 01.177.073l2.914 2.914a.25.25 0 01.073.177v8.586a.25.25 0 01-.25.25h-.5a.75.75 0 000 1.5h.5A1.75 1.75 0 0014 13.25V4.664c0-.464-.184-.909-.513-1.237L10.573.513A1.75 1.75 0 009.336 0H3.75A1.75 1.75 0 002 1.75v11.5c0 .649.353 1.214.874 1.515a.75.75 0 10.752-1.298.25.25 0 01-.126-.217V1.75zM8.75 3a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM6 5.25a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5A.75.75 0 016 5.25zm2 1.5A.75.75 0 018.75 6h.5a.75.75 0 010 1.5h-.5A.75.75 0 018 6.75zm-1.25.75a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM8 9.75A.75.75 0 018.75 9h.5a.75.75 0 010 1.5h-.5A.75.75 0 018 9.75zm-.75.75a1.75 1.75 0 00-1.75 1.75v3c0 .414.336.75.75.75h2.5a.75.75 0 00.75-.75v-3a1.75 1.75 0 00-1.75-1.75h-.5zM7 12.25a.25.25 0 01.25-.25h.5a.25.25 0 01.25.25v2.25H7v-2.25z"></path></svg>
                            <span class="pl-2 flex-auto min-width-0 text-bold">Source code</span>&nbsp;(zip)
                        </a> 
                    </AssetItem>

                    <AssetItem v-if="release.tarball_url" class="d-flex flex-justify-between flex-items-center py-2 Box-body px-2">
                        <a class="d-flex flex-items-center" :href="release.tarball_url">
                            <svg class="octicon octicon-file-zip flex-shrink-0 text-gray" width="16" height="16" viewBox="0 0 16 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M3.5 1.75a.25.25 0 01.25-.25h3a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h2.086a.25.25 0 01.177.073l2.914 2.914a.25.25 0 01.073.177v8.586a.25.25 0 01-.25.25h-.5a.75.75 0 000 1.5h.5A1.75 1.75 0 0014 13.25V4.664c0-.464-.184-.909-.513-1.237L10.573.513A1.75 1.75 0 009.336 0H3.75A1.75 1.75 0 002 1.75v11.5c0 .649.353 1.214.874 1.515a.75.75 0 10.752-1.298.25.25 0 01-.126-.217V1.75zM8.75 3a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM6 5.25a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5A.75.75 0 016 5.25zm2 1.5A.75.75 0 018.75 6h.5a.75.75 0 010 1.5h-.5A.75.75 0 018 6.75zm-1.25.75a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM8 9.75A.75.75 0 018.75 9h.5a.75.75 0 010 1.5h-.5A.75.75 0 018 9.75zm-.75.75a1.75 1.75 0 00-1.75 1.75v3c0 .414.336.75.75.75h2.5a.75.75 0 00.75-.75v-3a1.75 1.75 0 00-1.75-1.75h-.5zM7 12.25a.25.25 0 01.25-.25h.5a.25.25 0 01.25.25v2.25H7v-2.25z"></path></svg>
                            <span class="pl-2 flex-auto min-width-0 text-bold">Source code</span>&nbsp;(tar.gz)
                        </a> 
                    </AssetItem>
                </div>
        </Assets>

        <!-- <Modal v-if="commitIsVerified" ref="verifiedNoticeModal" title="Verified commit">
            <div class="p-3 d-flex" style="background-color: #f6f8fa;">
                <div>
                    <svg height="32" class="octicon octicon-verified mr-2" style="color: #28a745;" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M15.67 7.066l-1.08-1.34a1.5 1.5 0 01-.309-.77l-.19-1.698a1.51 1.51 0 00-1.329-1.33l-1.699-.19c-.3-.03-.56-.159-.78-.329L8.945.33a1.504 1.504 0 00-1.878 0l-1.34 1.08a1.5 1.5 0 01-.77.31l-1.698.19c-.7.08-1.25.63-1.33 1.329l-.19 1.699c-.03.3-.159.56-.329.78L.33 7.055a1.504 1.504 0 000 1.878l1.08 1.34c.17.22.28.48.31.77l.19 1.698c.08.7.63 1.25 1.329 1.33l1.699.19c.3.03.56.159.78.329l1.339 1.08c.55.439 1.329.439 1.878 0l1.34-1.08c.22-.17.48-.28.77-.31l1.698-.19c.7-.08 1.25-.63 1.33-1.329l.19-1.699c.03-.3.159-.56.329-.78l1.08-1.339a1.504 1.504 0 000-1.878zM6.5 12.01L3 8.51l1.5-1.5 2 2 5-5L13 5.56l-6.5 6.45z"></path></svg>
                </div>
                <div>
                    This commit was signed with a <strong class="signed-commit-verified-label">verified signature</strong>
                    <span v-if="extraDataHolder.tag.target.target.signature.wasSignedByGitHub">
                        using GitHub’s key.
                    </span>
                </div>
            </div>
            <div class="p-3" v-if="extraDataHolder.tag.target.target.signature.keyId">
                <span class="d-block">GPG key ID: <span class="text-gray">{{extraDataHolder.tag.target.target.signature.keyId}}</span></span>
                <HyperlinkWrapper>
                    <a href="https://help.github.com/articles/signing-commits-with-gpg/">Learn about signing commits</a>
                </HyperlinkWrapper>
            </div>
        </Modal> -->

        <Modal ref="chooseTagToCompareModal" :title="`Choose a tag to compare with ${name}`" :modalStyle="{height: '80vh',position:'relative',display:'flex'}" @show="network_getAvailableTagsToCompare">
            <div style="padding:10px" class="bg-white border-bottom">
                <input v-model="tagsToCompare.searchQuery" type="text" class="form-control width-full" placeholder="Find a tag" autofocus="" autocomplete="off" spellcheck="false">
            </div>
            <div v-if="tagsToCompare.loading" class="position-absolute d-flex flex-items-center flex-justify-center" style="top:0;bottom:0;right:0;left:0">
                <LoadingIconEx></LoadingIconEx>
            </div> 
            <div style="overflowY:auto" class="flex-grow-1">
                <transition-group name="fade-group" appear>
                    <router-link class="d-block" v-for="item in filteredTags" :key="item" :to="`/${owner}/${repo}/compare/${item}...${release.tag_name}`">
                        <SelectMenuItem :selected="item == release.tag_name">
                            {{item}}
                        </SelectMenuItem>
                    </router-link>
                    <div key="Emtpy notice" v-if="filteredTags.length == 0 && !tagsToCompare.loading" class="p-3 d-flex flex-items-center flex-justify-center">
                        Nothing to show
                    </div>
                </transition-group>
            </div>
            <footer class="SelectMenu-footer bg-white" style="border-top: none">
                <router-link :to="`/${owner}/${repo}/tags`">View all tags</router-link>
            </footer>
        </Modal>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper,Modal,HyperlinkWrapper,SelectMenuItem,LoadingIconEx} from '@/components'
    import * as api from "@/network/api"
    import {authRequiredGet,commonGet} from '@/network'
    import {util_markdownParse} from "@/util"
    let parse = require('parse-link-header')
    export default {
        inject: ['extraDataProvided'],
        props: {
            release: {
                type: Object,
                required: true
            },
            isLatest: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                commitsCountSinceThisRelease: 0,
                loading: false,
                assetsStretched: false,
                tagsToCompare: {
                    searchQuery: '',
                    data: [],
                    loading: false
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
            to() {
                if(this.release.draft) return `/${this.owner}/${this.repo}/releases/tag/${this.release.id}?draft=true`
                return `/${this.owner}/${this.repo}/releases/tag/${this.release.tag_name}`
            },
            name() {
                let name = this.release.name
                if( !name || name.trim() == '') return this.release.tag_name
                return name
            },
            bodyHTML() {
                return util_markdownParse.markdownToHTML(this.release.body)
            },
            extraDataHolder() {
                return this.extraDataProvided().filter(i => i.id == this.release.node_id)[0]
            },
            commitaAbbreviatedOid() {
                if(!this.extraDataHolder) return
                try{
                    return this.extraDataHolder.tag.target.target.abbreviatedOid
                }catch(e) {
                    console.log(e)
                }
            },
            resourcePath() {
                return `/${this.owner}/${this.repo}/tree/${this.release.tag_name}`
            },
           /*  commitIsVerified() {
                if(!this.extraDataHolder) return
                if(!this.extraDataHolder.tag) return
                try{
                    return this.extraDataHolder.tag.target.target.signature.isValid
                }catch(e) {
                    console.log(e)
                }
            }, */
            filteredTags() {
                return this.tagsToCompare.data.filter( i => {
                    return i.toLowerCase().indexOf(this.tagsToCompare.searchQuery.toLowerCase()) > -1
                })
            },
            assetListLength() {
                let ret = this.release.assets.length || 0
                if(this.release.zipball_url) ret += 1
                if(this.release.tarball_url) ret += 1
                return ret
            },
        },
        created() {
            this.network_getData()
            if(this.$route.name == 'repositoryReleaseDetail') this.assetsStretched = true
        },
        methods: {
            async network_getData() {
                if(!this.release.tag_name) return 
                try{    
                    this.loading = true
                    let url = api.API_COMMITS_COMPARE({
                        owner: this.owner,
                        repo: this.repo,
                        baseHead: `${this.release.tag_name}...${this.release.target_commitish}`
                    })
                    let res = await authRequiredGet(url)
                    this.commitsCountSinceThisRelease = res.data.total_commits

                }catch(e) {
                    console.log(e)
                }finally{
                    this.loading = false
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
            parseAvailableTagsToCompare(HTML) {
                let tagPattern = /<span class="css-truncate css-truncate-overflow" title="(.*)" >/g
                let tagExecResult
                let tags = []
                while((tagExecResult = tagPattern.exec(HTML)) != null) {
                    tags.push(tagExecResult[1])
                }
                this.tagsToCompare.data = tags
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
            SelectMenuItem,
            HyperlinkWrapper,
            LoadingIconEx,
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
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/select-menu/index.scss';
.verify-state-badge{
    color: #22863a;
    margin-top: -2px;
    margin-right: 3px;
    display: inline-block;
    padding: 1px 4px;
    font-size: 12px;
    vertical-align: middle;
    user-select: none;
    background: none;
    border: 1px solid #e1e4e8;
    font-weight: 500;
    border-radius: 2em;
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

.select-menu-button:after {
    display: inline-block;
    width: 0;
    height: 0;
    vertical-align: -2px;
    content: "";
    border: 4px solid transparent;
    border-top-color: currentcolor;
}

.Label--draft {
    color: #cb2431;
    border-color: #d73a49;
}
</style>