<template>
    <Container>

        <IssueHeader :data="data" 
                    class="px-3"
                    :viewerCanUpdate="extraData.data.viewerCanUpdate" 
                    :issueUpdateFunc="network_updatePullRequest" 
                    type="pullRequest">
            <IssueStateBadge :data="data" class="mr-2"></IssueStateBadge>

            <Skeleton key="0" v-if="!data.number && loading" class="flex-grow-1">
                <SkeletonRectangle :height="14" style="width:100%"></SkeletonRectangle>   
                <SkeletonRectangle :height="14" style="width:40%" class="mt-2"></SkeletonRectangle>   
            </Skeleton>   

            <div key="1" v-else-if="data.number" class="flex-auto min-width-0">
                <router-link class="text-bold link-gray" v-if="data.user" :to="`/${data.user.login}`">{{data.user.login}}</router-link>
                {{(data.merged && 'merged') || 'wants to merge'}}
                {{data.commits}}
                {{data.commits > 1 ? 'commits' : 'commit'}}
                into 
                <span  class="commit-ref css-truncate">
                    <router-link class="css-truncate-target" :to="`/${owner}/${repo}/tree/${data.base.ref}`">
                        {{data.base.ref}}
                    </router-link>
                </span>
                
                from
                <span class="commit-ref css-truncate">
                    <router-link class="css-truncate-target" :to="`/${data.head.repo.full_name}/tree/${data.head.ref}`">
                        <span v-if="data.head.repo.owner.login != owner">{{data.head.repo.owner.login}}:</span>
                        {{data.head.ref}}
                    </router-link>
                </span>
                
                <!--  <svg class="octicon-clippy d-inline-block mx-1 js-clipboard-clippy-icon text-gray" fill='currentColor' viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M5.75 1a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-3a.75.75 0 00-.75-.75h-4.5zm.75 3V2.5h3V4h-3zm-2.874-.467a.75.75 0 00-.752-1.298A1.75 1.75 0 002 3.75v9.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-9.5a1.75 1.75 0 00-.874-1.515.75.75 0 10-.752 1.298.25.25 0 01.126.217v9.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-9.5a.25.25 0 01.126-.217z"></path></svg> -->
            </div>
        </IssueHeader>
        
        
        <PageTopTab :tabs="tabs" style="margin-top: -32px;"></PageTopTab>
        <keep-alive>
            <router-view @pull-request-updated.native="pullRequestUpdatedHook" @lock-status-changed.native="pullRequestUpdatedHook"></router-view>
        </keep-alive>

    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {PageTopTab,IssueIcon,SkeletonRectangle,SkeletonCircle,AnimatedHeightWrapper} from '@/components'
    import {IssueHeader,IssueStateBadge} from '../../Issues/IssueDetail/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {
        authRequiredGet,
        authRequiredPatch,
        authRequiredGitHubGraphqlApiQuery,
        cancelAndUpdateAxiosCancelTokenSource} from '@/network'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import { mapMutations } from 'vuex'
    import {MUTATION_PULL_REQUEST_DETAIL_RESET_STATE} from '@/store/modules/pullRequestDetail/mutationTypes'
    export default {
        name: 'pr_detail',
        mixins: [RouteUpdateAwareMixin],
        provide() {
            return {
                number:() => this.number,
                pullRequestProvided: () => Object.assign({},this.extraData.data,this.data),
                issue: () => Object.assign({},this.extraData.data,this.data),
                updatePullRequestFunc: () => this.network_updatePullRequest,
            }
        },
        data() {
            return {
                data: {},
                extraData: {
                    data: {},
                    loading: false
                },
                loading: false,
                isDynamicDocumentTitle: true,
                newSubmittedReviews: [],
                newStartedReviews: [],
            }
        },
        computed: {
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            number() {
                return this.$route.params.number
            },
            tabs() {
                let basePath = `/${this.owner}/${this.repo}/pull/${this.number}`
              return [
                    { 
                        label: 'Conversation',
                        to: `${basePath}`
                    },
                    { 
                        label: 'Commits',
                        to: `${basePath}/commits`
                    },
                    { 
                        label: 'File changes',
                        to: `${basePath}/files`
                    },
                ]
            },

            documentTitle() {
                if(!this.data.title) return location.href
                return `${this.data.title} by ${this.data.user.login} · Pull Request #${this.data.number} · ${this.owner}/${this.repo}`
            }
        },
        mounted() {
            this.checkRouterParam()
            this.network_getData()
        },
        methods: {
            ...mapMutations({
                mutation_pullRequestDetailResetState: MUTATION_PULL_REQUEST_DETAIL_RESET_STATE
            }),
            checkRouterParam() {
                if(!/^[1-9][0-9]*$/.test(this.number)) {
                    this.emitNotFoundEvent(this.$el)
                }
            },
            network_getData() {
                this.network_getRestData()
                if(this.accessToken) this.network_getGraphqlData()
            },
            async network_getRestData() {
                this.mutation_pullRequestDetailResetState()
                try{
                    //获取基本数据
                    this.loading = true
                    let url_pullRequest = api.API_PULLREQUEST({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number
                    })
                    let res_pullRequest = await authRequiredGet(
                        url_pullRequest,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name),
                            headers: {
                                "accept": 'application/vnd.github.squirrel-girl-preview'
                            }
                        }
                    )
                    this.data = res_pullRequest.data
                }catch(e){
                   this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            async network_getGraphqlData() {
                try {
                    this.extraData.loading = true
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_PR,
                        {   
                            variables: {
                                name: this.repo,
                                owner: this.owner,
                                number: parseInt(this.number),
                            },
                            cancelToken:this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_pull_request_extra_data')
                        }
                    )

                    try{
                        this.extraData.data = res.data.data.repository.pullRequest
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                } catch(e){
                    this.handleError(e)
                }finally{
                    this.extraData.loading = false
                }
            },
            async network_updatePullRequest(data) {
                try {
                    let url = api.API_ISSUE({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number
                    })

                    let res = await authRequiredPatch(
                        url,
                        {
                            ...data
                        }
                    )
                    
                    this.data = Object.assign(this.data,res.data)
                } catch (e) {
                    this.handleError(e)
                    throw(e)
                }
            },
            pullRequestUpdatedHook(payload) {
                this.data = payload.detail
            },
        },
        watch: {
            'data.mergeable_state': function(newOne,oldOne) {
                if(newOne != oldOne && newOne == 'unknown') {
                    this.network_getData()
                }
            }
        },
        components: {
            IssueHeader,
            PageTopTab,
            IssueIcon,
            IssueStateBadge,
            SkeletonRectangle,
            SkeletonCircle,
            AnimatedHeightWrapper,
            Container: styled.div``,
            Header: styled.div``,
            TheMeta: styled.div``,
            State: styled.div``,
            Skeleton: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/labels/index.scss';
@import 'node_modules/@primer/css/truncate/index.scss';
.commit-ref {
    position: relative;
    display: inline-block;
    padding: 0 5px;
    font: .75em/2 SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    color: #274466;
    white-space: nowrap;
    background-color: #eff7ff;
    border-radius: 6px;
}

</style>