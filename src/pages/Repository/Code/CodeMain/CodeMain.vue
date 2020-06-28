<template>
    <CommonLoadingWrapper 
    :loading="ref.loading || !repoBasicInfo().node_id || readme.loading || commitCount.loading || latestCommit.loading" 
    :position="(ref.loading || !repoBasicInfo().node_id) ? 'center' : 'corner'"
    class="px-3">
        <FileNavigation class="mb-3 d-flex flex-items-start flex-justify-between" v-if="latestCommit.data.sha">
            <button class="btn css-truncate text-gray" :disabled="!currentRef">
                <svg v-if="refType == 'branch'" height="16" class="octicon-git-branch text-gray v-align-text-bottom" text="gray" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"></path></svg>
                <svg v-else-if="refType == 'tag'" height="16" class="octicon-tag text-gray v-align-text-bottom" text="gray" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z"></path></svg>
                <span class="css-truncate-target" data-menu-button="">{{currentRef || '...'}}</span>
                <span class="dropdown-caret"></span>
            </button>

            <button class="btn d-inline-block">
                <svg height="16" class="octicon-kebab-horizontal v-align-text-bottom" aria-label="More options" viewBox="0 0 16 16" version="1.1" width="16" role="img"><path d="M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm13 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>
            </button>
        </FileNavigation>
        
        <FileBrowser class="Box mb-3" v-if="latestCommit.data.sha">
            <div class="Box-header Box-header--blue position-relative d-flex flex-items-center flex-wrap">
                <router-link v-if="latestCommit.data.author && latestCommit.data.author.avatar_url" class="avatar avatar-user d-block" :to="`/${latestCommit.data.author.login}`">
                    <ImgWrapper>
                        <img width="24" height="24" :src="latestCommit.data.author.avatar_url" :alt="`@${latestCommit.data.author.login}`">
                    </ImgWrapper>
                </router-link>

                <div class="flex-1 d-flex flex-items-center ml-2 min-width-0">
                    <div class="css-truncate css-truncate-overflow text-gray">
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
                <div class="pl-5 mt-2 width-full">
                    <router-link v-if="latestCommit.data.commit.message && latestCommit.showMessage" class="link-gray-dark" :to="`/${owner}/${repo}/commits/${latestCommit.data.sha}`">
                        {{latestCommit.data.commit.message}}
                    </router-link>
                </div>
            </div>

            <div class="Details-content--shown Box-footer d-md-none p-0">
                <button class="d-block btn-link js-details-target width-full px-3 py-2">
                    View code
                </button>
            </div>

        </FileBrowser>

        <Readme v-if="readme.data" class="read-me Box">
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

        <Release class="py-4">
            <h2 class="h4 mb-3">
                <router-link class="link-gray-dark no-underline " :to="`/${owner}/${repo}/releases`">
                    Releases
                    <span class="Counter" v-if="release.totalCount">{{release.totalCount}}</span>
                </router-link>
            </h2>

            <router-link v-if="release.data.tag_name" class="link-gray-dark d-flex no-underline" :to="`/${owner}/${repo}/releases/tag/${release.data.tag_name}`">
                <svg height="16" class="octicon octicon-tag flex-shrink-0 mt-1 text-green" mt="1" class_names="flex-shrink-0" color="green" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z"></path></svg>
                <div class="ml-2 min-width-0">
                    <div class="d-flex">
                        <span class="css-truncate css-truncate-target text-bold mr-2" style="max-width: none;">{{release.data.tag_name}}</span>
                        <span class="flex-shrink-0 Label Label--outline Label--outline-green">
                            Latest
                        </span>
                    </div>
                    <div class="text-small text-gray">
                        <span class="no-wrap" >on 14 Dec 2019</span>
                    </div>
                </div>
            </router-link>
        </Release>

    </CommonLoadingWrapper>
</template>
<script>
    import styled from 'vue-styled-components'
    import{CommonLoadingWrapper,ImgWrapper,AnimatedHeightWrapper} from '@/components'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import {authRequiredGet,authRequiredGitHubGraphqlApiQuery } from '@/network'
    import {RouteUpdateAwareMixin} from '@/mixins'
    let parse = require('parse-link-header')
    export default {
        name: 'repository_code_main',
        inject: ['repoBasicInfo'],
        mixins: [RouteUpdateAwareMixin],
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
                refType:'branch',
                commitCount: {
                    data: undefined,
                    loading: false
                },
                readme: {
                    data: '',
                    loading: false
                },
                release: {
                    data: {},
                    totalCount: undefined,
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
            currentRef() {
                return this.$route.params.ref || this.repoBasicInfo().default_branch
            }
        },
        created() {
            if(this.currentRef) this.network_getData()
        },
        
        methods: {
            network_getData() {
                this.network_getBranch()
                this.network_getCommitsCount()
                this.network_getReadme()
                this.network_getRelease()
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
                    this.latestCommit.data = res.data.commit   
                    if(this.accessToken) this.network_getLatestCommitStatus()
                    this.refType = 'branch'
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
                        this.refType = 'tag'

                        let latestCommitSha = res_tag.data.object && res_tag.data.object.sha
                        if(latestCommitSha) {
                            this.latestCommit.loading = true
                            let url_latestCommit = api.API_COMMIT({
                                repo: this.repo,
                                owner: this.owner,
                                sha: latestCommitSha
                            })
                            let res_latestCommit = await authRequiredGet(url_latestCommit,{cancelToken})
                            this.latestCommit.data = res_latestCommit.data
                            if(this.accessToken) this.network_getLatestCommitStatus()
                        }
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
            async network_getLatestCommitStatus() {
                try{
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_COMMIT,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_latest_commit_status'),
                            variables: {
                                id: this.latestCommit.data.node_id
                            }
                        }
                    )

                    try{
                        this.latestCommit.status = res.data.data.node.status
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                }catch(e) {
                    console.log(e)
                }
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
                }catch(e) {
                    console.log(e)
                }finally{
                    this.readme.loading = false
                }
            },
            async network_getRelease() {
                try{
                    this.release.loading = true
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
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_release')
                        }
                    )

                    this.release.data = res.data[0] || {}

                    let releasesCountHolder = parse(res.headers.link) || {}
                    this.release.totalCount = releasesCountHolder.last ? releasesCountHolder.last.page : res.data.length 
                }catch(e) {
                    console.log(e)
                }finally{
                    this.release.loading = false
                }
            }
        },
        
        watch: {
            currentRef(newOne,oldOne) {
                if(newOne && !oldOne) {
                    this.network_getData()
                }
            }
        },
        components: {
            CommonLoadingWrapper,
            ImgWrapper,
            AnimatedHeightWrapper,
            Container: styled.div``,
            FileNavigation: styled.div``,
            FileBrowser: styled.div``,
            Readme: styled.div``,
            Release: styled.div``,
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
}
</style>
