


<template>
    <CommonLoadingWrapper :loading="loading || timeline.loading || timeline.extraData.loading" :position="loading ? 'center' : 'corner'" class="px-3 bg-white flex-grow-1">
        

        <IssueHeader :data="data" :viewerCanUpdate="extraData.data.viewerCanUpdate" :issueUpdateFunc="network_updateIssue"></IssueHeader>

        <TopInfoRows :data="data"></TopInfoRows>
      
        <IssueBody  :data="data"
                    style="padding-top:0px!important;margin-top:16px;"
                    :extraData="extraData.data" 
                    :issueUpdateFunc="network_updateIssue"
                    @quote="quoteReply"
                    :loading="extraData.loading"/>
                
        <LoadingTimeline v-if="data.node_id && timeline.data.length == 0 && timeline.loading" class="loading-timeline d-flex flex-items-center flex-justify-center">
            <LoadingIconEx/>
        </LoadingTimeline>

        <transition-group tag="div" appear name="fade">
            <TimelineItem v-for="(item,index) in handledTimelines" 
                    :data="item" :key="(item.id || '') + index"
                    @quote="quoteReply" 
                    @unminimize-comment="unminimizeCommentHook"
                    @comment-updated.native="commentUpdatedHook"
                    @minimize-comment="minimizeCommentHook"/>
        </transition-group>

        <LoadMore v-if="timeline.pageInfo.next" :loading="timeline.loading" :dataGetter="network_getTimeline" :hiddenItemCount="timelineRemainedCount"></LoadMore>

        <transition-group tag="div" appear name="fade">
            <TimelineItem v-for="(item,index) in newestTimelines" 
                        :data="item" :key="(item.id || '') + index"
                        @quote="quoteReply" 
                        @unminimize-comment="unminimizeCommentHook"
                        @comment-updated.native="commentUpdatedHook"
                        @minimize-comment="minimizeCommentHook"/>
        </transition-group>

        <CommentCreatePane class="pt-3 mb-5 comment-create-edit-pane" 
                        style="border-top: solid 2px rgb(225, 228, 232)"
                        ref="commentEditor"
                        @new-timeline-item-created.native="newTimelineItemCreatedHook"
                        @issue-updated.native="issueUpdatedHook"
                        v-if="data.id"></CommentCreatePane>

        <BottomInfoRows :data="Object.assign(data,extraData.data)" 
                        @issue-extra-updated.native="issueExtraUpdatedHook" 
                        @issue-updated.native="issueUpdatedHook" 
                        @new-timeline-item-created.native="newTimelineItemCreatedHook"   
                        ></BottomInfoRows>

        <IssueHandle class="my-4 border-top" v-if="data.id && viewerCanManageIssue()">
            <LockIssueButton class="mt-3" 
                            v-if="extraData.data.viewerCanUpdate" 
                            @issue-updated.native="issueUpdatedHook"
                            @issue-extra-updated.native="issueExtraUpdatedHook"
                            @new-timeline-item-created.native="newTimelineItemCreatedHook"
                            :disabled="loading || extraData.loading" 
                            :issue="data"></LockIssueButton>
            <div v-if="!data.locked" class="text-bold link-gray-dark pt-3" @click="() => showModal('transferIssueModal')">
                <svg class="octicon octicon-arrow-right" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.22 2.97a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06l2.97-2.97H3.75a.75.75 0 010-1.5h7.44L8.22 4.03a.75.75 0 010-1.06z"></path></svg>
                <strong>Transfer issue</strong>
            </div> 
            <div class="text-bold link-gray-dark pt-3" @click="() => showModal('deleteIssueModal')" >
                <svg class="octicon octicon-trashcan" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zm4.5 0V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.496 6.675a.75.75 0 10-1.492.15l.66 6.6A1.75 1.75 0 005.405 15h5.19c.9 0 1.652-.681 1.741-1.576l.66-6.6a.75.75 0 00-1.492-.149l-.66 6.6a.25.25 0 01-.249.225h-5.19a.25.25 0 01-.249-.225l-.66-6.6z"></path></svg>
                <strong>Delete issue</strong>
            </div> 
        </IssueHandle>

        <StickyTop :data="data"></StickyTop>    

        <Modal title="Transfer this issue" ref="transferIssueModal" :modalStyle="{height:'80vh'}" @show="network_getAvailableTransferTargetRepositories"> 
            <div v-if="transferIssueModal.availableRepositories.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <SimpleSearchInput v-else class="p-3 modal-search-input"
                                placeholder="Find a repository" Milestones
                                v-model="transferIssueModal.searchQuery"/>
            <div style="overflowY: auto">
                <transition-group name="fade-group" appear>
                    <SelectMenuItem v-for="item in filteredTransferTargetRepositories" 
                                    class="border-bottom"
                                    :key="item.id" 
                                    :iconStyle="{alignSelf:'flex-start'}" 
                                    :selected="transferIssueModal.selectedRepository == item.id" 
                                    @click.native="() => selectTransferTargetRepository(item.id)">
                        <div class="flex-grow-1">
                            <span>
                                <svg v-if="item.isPrivate" class="octicon octicon-lock float-right mr-3" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 4v2h-.25A1.75 1.75 0 002 7.75v5.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-5.5A1.75 1.75 0 0012.25 6H12V4a4 4 0 10-8 0zm6.5 2V4a2.5 2.5 0 00-5 0v2h5zM12 7.5h.25a.25.25 0 01.25.25v5.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-5.5a.25.25 0 01.25-.25H12z"></path></svg>
                            </span>    
                            <span class="milestone-title">{{item.name}}</span>
                            <span class="milestone-description">{{item.description}}</span>
                        </div> 
                    </SelectMenuItem>
                </transition-group>
            </div>
           
            <div class="Box-footer bg-white border-top modal-footer" v-if="!transferIssueModal.availableRepositories.loading">
                <button class="btn btn-block" :disabled="transferIssueModal.loading || !transferIssueModal.selectedRepository" @click="network_transferIssue">
                    {{transferIssueModal.loading ? 'Trying...' : 'Transfer issue'}}
                </button>
            </div>
        </Modal>

        <Modal title="Delete this issue" ref="deleteIssueModal" :modalStyle="{maxHeight:'80vh'}"> 
            <div class="d-flex flex-column p-3 flex-items-center bg-white">
                <svg class="octicon octicon-circle-slash text-red ml-1" height="40" width="40" viewBox="0 0 24 24" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12A9.5 9.5 0 0112 2.5c2.353 0 4.507.856 6.166 2.273L4.773 18.166A9.462 9.462 0 012.5 12zm3.334 7.227A9.462 9.462 0 0012 21.5a9.5 9.5 0 009.5-9.5 9.462 9.462 0 00-2.273-6.166L5.834 19.227z"></path></svg>
                <h4 class="mt-4 text-center">Are you sure you want to delete this issue?</h4>
                <div class="col-9 mx-auto mt-1 mb-2">
                    <ul class="text-left">
                    <li>This cannot be undone</li>
                    <li>Only administrators can delete issues</li>
                    <li>Deletion will remove the issue from search and previous references will point to a placeholder</li>
                    </ul>
                </div>
            </div>
            <div class="Box-footer bg-white border-top modal-footer">
                <button class="btn text-red btn-block" :disabled="deleteIssueModal.loading" @click="network_deleteIssue">
                    {{deleteIssueModal.loading ? 'Deleting issue...' : 'Delete this issue.'}}
                </button>
            </div>
        </Modal>
        
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import IssueDetailProtoMixin from './IssueDetailProtoMixin.vue'
    import {CommonLoadingWrapper,
            Label,
            AnimatedWidthWrapper,
            AnimatedHeightWrapper,
            LoadingIconEx,
            Progress,
            IssueIcon,
            ImgWrapper,
            Modal,
            TinyLoadingIcon,
            SimpleSearchInput,
            SelectMenuItem,
            HyperlinkWrapper,
            SkeletonCircle,
            SkeletonRectangle,
            HiddenItemLoading} from '@/components'
    import {TimelineItem,
            IssueBody,
            ProjectCard,
            CommentCreatePane,
            LoadMore,
            IssueHeader,
            BottomInfoRows,
            TopInfoRows,
            IssueNotificationSettingPane,
            LockIssueButton,
            StickyTop} from './components'
    import {Comment} from './components/TimelineItem/components'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import {
        authRequiredGet,
        authRequiredGitHubGraphqlApiQuery} from '@/network'
    var parse = require('parse-link-header');
    export default {
        name: 'issueDetail',
        mixins: [IssueDetailProtoMixin],
        inject: ['viewerCanManageIssue'],
        provide() {
            return {
                deletedCommentsProvided: () => this.deletedComments,
                issue: () => Object.assign({},this.data,this.extraData.data),
            }
        },
        data() {
            return {
                transferIssueModal: {
                    searchQuery: '',
                    availableRepositories: {
                        data: [],
                        loading: false
                    },
                    selectedRepository: undefined,
                    loading: false
                },
            }
        },
        computed: {
            filteredTransferTargetRepositories() {
                let searchQuery = this.transferIssueModal.searchQuery.toLowerCase()
                return this.transferIssueModal.availableRepositories.data.filter(i => {
                    return i.hasIssuesEnabled && i.name != this.$route.params.repo && (i.name.toLowerCase().indexOf(searchQuery) != -1 || (i.description && i.description.toLowerCase().indexOf(searchQuery) != -1))
                })
            },
        },
        created() {
            this.network_getData()
        },
        methods: {
            network_getData() {
                this.network_getIssueRest()
                this.network_getTimeline()
                this.network_getTimelineRestCount()
                if(this.accessToken) this.network_getTimelineGraphqlCount()
            },
            async network_getIssueRest() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)

                    let url_issue = api.API_ISSUE(this.$route.params)
                    let res_issue = await authRequiredGet(
                        url_issue,
                        {
                            cancelToken,
                            headers: {
                                "Accept": "application/vnd.github.squirrel-girl-preview"
                            }
                        }
                    )
                    
                    //处理一种情况：当前issue已经被transfer到另外一个仓库
                    if(res_issue.data.url.replace("https://api.github.com/repos","") != this.$route.path) {
                        this.$router.replace(res_issue.data.url.replace("https://api.github.com/repos",""))
                    }
                    this.data = res_issue.data
                    this.loading = false
                    if(this.accessToken) this.network_getIssueExtraData()
                }catch(e){
                    this.handleError(e)
                    if(e.response && e.response.status == 404) {
                        this.emitNotFoundEvent(this.$el)
                    }
                }finally{
                    this.loading = false
                }
            },
            async network_getIssueExtraData() {
                try{
                    this.extraData.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_extra_data')
                    let graphql_extraData = graphql.GRAPHQL_ISSUE

                    let res_extraData = await authRequiredGitHubGraphqlApiQuery(
                        graphql_extraData,
                        {
                            cancelToken,
                            variables: {
                                nodeID: this.data.node_id
                            }
                        }
                    )

                    try{
                        this.extraData.data = res_extraData.data.data.node
                    }catch(e) {
                        this.handleGraphqlError(res_extraData)
                    }
                    
                }catch(e) {
                    console.log(e)
                }finally{
                    this.extraData.loading = false
                }
            },
            async network_getTimelineGraphqlCount() {
                try{
                    this.timeline.graphqlCount.loading = true

                    let itemTypes = this.timelineTypes.map(i => i.graphql)
                    
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_ISSUE_TIMELINE_COUNT,
                        {
                            variables: {
                                itemTypes,
                                repo: this.repo,
                                owner: this.owner,
                                number: parseInt(this.number)
                            },
                            cancelToken:this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + '_timeline_graphql_count')
                        }
                    )
                    try{
                        this.timeline.graphqlCount.data = res.data.data.repository.issue.timelineItems.totalCount
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }

                }catch(e){
                    console.log(e)
                }finally{
                    this.timeline.graphqlCount.loading = false
                }
            },
            async network_getAvailableTransferTargetRepositories() {
                this.transferIssueModal.selectedRepository = undefined
                if(this.transferIssueModal.availableRepositories.data.length > 0) return
                if(this.transferIssueModal.availableRepositories.loading) return 
                try{
                    this.transferIssueModal.availableRepositories.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_available_transfer_target_repositories')

                    let pageInfo
                    let repositories = []
                    
                    while(!pageInfo || pageInfo.hasNextPage) {
                        let res = await authRequiredGitHubGraphqlApiQuery(
                            graphql.GRAPHQL_QUERY_VIEWER_REPOSTIORIES,
                            {
                                cancelToken,
                                variables: {
                                    after: pageInfo && pageInfo.endCursor
                                }
                            }
                        )
                        try{
                            repositories = repositories.concat(res.data.data.viewer.repositories.nodes)
                            pageInfo = res.data.data.viewer.repositories.pageInfo
                        }catch(e) {
                            this.handleGraphqlError(res)
                        }
                    }

                    this.transferIssueModal.availableRepositories.data = repositories
                   
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.transferIssueModal.availableRepositories.loading = false
                }
            },
            async network_transferIssue() {
                if(this.transferIssueModal.loading) return 
                try{
                    this.transferIssueModal.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' transfer_issue')
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_MUTATION_TRANSFER_ISSUE,
                        {
                            cancelToken,
                            variables: {
                                issueId: this.data.node_id,
                                repositoryId: this.transferIssueModal.selectedRepository
                            }
                        }
                    )
                    this.closeModal()
                    this.$router.push(res.data.data.transferIssue.issue.resourcePath)
                    this.topNoticeShow('repository','This issue was transferred here.',true)
                }catch(e){
                    this.handleError(e)
                }finally{
                    this.transferIssueModal.loading = false
                }
            },
            async network_deleteIssue() {
                if(this.deleteIssueModal.loading) return
                try{
                    this.deleteIssueModal.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' delete_issue')
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_MUTATION_DELETE_ISSUE,
                        {
                            cancelToken,
                            variables: {
                                issueId: this.data.node_id
                            }
                        }
                    )
                    this.handleGraphqlError(res)
                    this.$router.replace(`/${this.owner}/${this.repo}/issues?delete=${this.data.id}`)
                    this.topNoticeShow('repository','The issue was successfully deleted.', true)
                }catch(e) { 
                    this.handleError(e)
                }finally{
                    this.deleteIssueModal.loading = false
                }
            },
            selectTransferTargetRepository(payload) {
                this.transferIssueModal.selectedRepository = payload
            },
            issueUpdatedHook(event) {
                this.data = {
                    ...this.data,
                    ...event.detail,
                }
            },
            issueExtraUpdatedHook(event) {
                this.extraData.data = {
                    ...this.extraData.data,
                    ...event.detail,
                }
            },
        },
        watch: {
            repoFullName() {
                this.transferIssueModal.availableRepositories.data = []
            },
        },
        components: {
            IssueHeader,
            CommonLoadingWrapper,
            Label,
            Comment,
            IssueBody,
            TimelineItem,
            HiddenItemLoading,
            LoadingIconEx,
            ImgWrapper,
            AnimatedHeightWrapper,   
            AnimatedWidthWrapper,
            Progress,
            IssueIcon,
            ProjectCard,
            CommentCreatePane,
            Modal,
            SimpleSearchInput,
            TinyLoadingIcon,
            SelectMenuItem,
            HyperlinkWrapper,
            Label,
            LoadMore,
            SkeletonCircle,
            SkeletonRectangle,
            IssueNotificationSettingPane,
            LockIssueButton,
            StickyTop,
            BottomInfoRows,
            TopInfoRows,
            Container: styled.div``,
            TitleEditPane: styled.div``,
            Header: styled.div``,
            HeaderActions: styled.div``,
            HeaderTitle: styled.h1``,
            HeaderMeta: styled.div``,
            State: styled.div``,
            MetaContent: styled.div``,
            Info: styled.div``,
            LoadingTimeline: styled.div``,
            InfoBottom: styled.div``,
            InfoBottomItem: styled.div``,
            InfoBottomItemTitle: styled.div``,
            LabelBadge: styled.div``,
            LabelContent: styled.div``,
            LabelName: styled.div``,
            LabelDescription: styled.div``,
            LabelsPageLink: styled.div``,
            EmptyNotice: styled.div``,
            IssueHandle: styled.div``,
            Skeleton: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/labels/index.scss';
@import 'node_modules/@primer/css/layout/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/truncate/index.scss';
.title{
    margin-bottom: 0;
    font-weight: 400;
    line-height: 1.125;
    .number{
        font-weight: 300;
        color: #6a737d;
    }
}

.header-meta{
    font-size: 14px;
    color: #586069;
    .meta-content{
        word-wrap: break-word;
        white-space: normal;
    }
}
.loading-timeline{
    height: 200px;
}

.info-bottom-item:first-child{
    margin-top: 0px;
    border-top: 0px;
}

.info-bottom-item{
    padding-top: 16px;
    font-size: 12px;
    color: #586069;
    margin-top: 16px;
    border-top: 1px solid #e1e4e8;
    .info-bottom-item-title{
        margin-bottom: 8px;
        font-size: 12px;
        color: #586069;
        font-weight: 600!important;
        svg{
            float: right;
            color: #959da5;
            margin-top: 2px;
        }
        
    }

    .assignee-login{
            max-width: 110px;
            display: inline-block;
            vertical-align: top;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: 600;
            color: #24292e;
            font-size: 12px;
        }
    
}

.label-badge{
    display: inline-block;
    width: 1em;
    height: 1em;
    vertical-align: middle;
    border: 1px solid rgba(27,31,35,.15);
    border-radius: 3px;
}

.labels-page-link{
    position:sticky;
    top: 0;
    padding-left: 40px;
}

.milestone-title{
    display: block;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 600;
}

.milestone-description{
    display: block;
    max-width: 265px;
    font-size: 12px;
    color: #586069;
}

.set-milestone-modal-tabs-btn{
    display: inline-block;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 600;
    color: #6a737d;
    text-decoration: none;
    cursor: pointer;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 3px 3px 0 0;
}

.tab-active{
        color: #24292e;
    background-color: #fff;
    border-color: #dfe2e5 #dfe2e5 #fff;
}

.modal-footer {
    position: sticky;
    top: 100%;
}

</style>