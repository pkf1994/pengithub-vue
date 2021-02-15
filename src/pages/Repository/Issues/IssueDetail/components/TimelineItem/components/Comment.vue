<template>
    <Container class="position-relative timeline-item transition-all" style="padding-top:16px;padding-bottom:16px">
        <Inner v-if="!commentExtraDataHolder.isMinimized" class="inner bg-white">
            <Header class="px-3 header text-normal f5" :class="{'current-user':viewer.login == data.user.login}" :style="headerStyle">
                <Action class="action py-2 px-1 ml-2 position-relative" style="align-self:start" @click="showActionPopover">
                    <svg aria-label="Show options" class="octicon octicon-kebab-horizontal v-align-text-bottom" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path d="M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm13 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>
                    <Popover ref="actionPopover" :popoverStyle="popoverStyle">
                        <slot name="actions">
                            <button class="popover-item btn-link dropdown-item" @click.stop="e => e.preventDefault()" v-clipboard:copy="location.href" v-clipboard:success="copyLinkSuccessHook">
                                Copy link
                            </button>
                            <div  v-if="accessToken">
                                <button class="popover-item btn-link dropdown-item" @click.stop="quoteReply" v-if="!issue().locked || viewerIsCollaborator().data">
                                    Quote reply
                                </button>
                                <button class="popover-item btn-link dropdown-item">
                                    Reference in new issue
                                </button>
                                <div class="dropdown-divider" v-if="commentExtraDataHolder.viewerCanUpdate || commentExtraDataHolder.viewerCanMinimize || commentExtraDataHolder.viewerCanDelete"></div> 
                                <button v-if="commentExtraDataHolder.viewerCanUpdate"  @click.stop="() => triggerEdit(true)" class="popover-item btn-link dropdown-item">
                                    Edit
                                </button>
                                <button v-if="graphqlWritePermission && commentExtraDataHolder.viewerCanMinimize" @click.stop="() => triggerMinimizePane(true)" class="popover-item btn-link dropdown-item">
                                    Hide
                                </button>
                                <button v-if="commentExtraDataHolder.viewerCanDelete" @click.stop="network_deleteThisComment" class="popover-item btn-link hover-red dropdown-item" style="color:#d73a49">
                                    Delete
                                </button>
                                <div class="dropdown-divider" v-if="viewerIsCollaborator().data"></div> 
                                <button v-if="viewerIsCollaborator().data" class="popover-item btn-link dropdown-item">
                                    Report content
                                </button>
                            </div>
                        </slot>
                    </Popover>
                </Action>

                <AuthorAssociation class="author-association mt-2" v-if="authorAssociation" style="text-transform:Capitalize;align-self:start">
                    {{authorAssociation}}
                </AuthorAssociation>

                <transition-group tag="div" class="flex-grow-1" name="fade-group">
                    <Skeleton key="0" v-if="!data.id" class="d-flex flex-items-center flex-grow-1">
                        <SkeletonCircle color="#EEEEEE" :diameter="20" class="mr-2"></SkeletonCircle>
                        <SkeletonRectangle color="#EEEEEE" :height="14" class="flex-grow-1"></SkeletonRectangle>
                    </Skeleton>

                    <HeaderInner key="1" v-else class="py-2 flex-grow-1 position-relative" >
                        <router-link class="d-inline-block" to="/">
                            <ImgWrapper class="avatar avatar-user">
                                <img   class="avatar avatar-user" 
                                        :src="data.user && data.user.avatar_url"
                                        height="20" 
                                        width="20" 
                                        :alt="`@${data.user && data.user.login}`">
                            </ImgWrapper>
                        </router-link>
                        <router-link to="/">
                            <strong class="no-wrap link-gray-dark">
                                {{data.user && data.user.login}}
                            </strong>
                        </router-link>
                        
                        commented
                        <span v-if="commentType == 'commitComment'">on
                            <code>
                                <router-link :to="`/${owner}/${repo}/commit/${data.commit_id}`" class="text-gray">
                                    {{data.commit_id.substring(0,7)}}
                                </router-link>
                            </code>
                        </span>
                        <span class="no-wrap">{{(data.created_at || data.submitted_at) | getDateDiff}}</span>

                        <span v-if="!accessToken || (commentExtraDataHolder.userContentEdits && commentExtraDataHolder.userContentEdits.totalCount > 0)" class="d-inline-block text-gray btn-link" @click="() => showModal('editHistoriesModal')">
                            <span class="d-inline-block text-gray-light">•</span> 
                            edited
                            <svg height="11" class="octicon octicon-triangle-down v-align-middle" viewBox="0 0 12 16" version="1.1" width="8" aria-hidden="true"><path fill-rule="evenodd" d="M0 5l6 6 6-6H0z"></path></svg>
                        </span>

                    </HeaderInner>
                </transition-group>
              
            </Header>   

            <MinimizePane :comment="data" v-if="showMinimizePane" @cancel="() => triggerMinimizePane(false)" @minimize-comment="payload => {triggerMinimizePane(false);$emit('minimize-comment',payload)}">
            </MinimizePane>

            <CommentEditPane class="comment-create-edit-pane" 
                            @update-comment="updateCommentPostHook"
                            :commentType="commentType"
                            v-if="editing" 
                            ref="commentEditPane" 
                            :comment="data"
                            @cancel="confirmCancel">
            </CommentEditPane>

            <div v-else>
                <transition-group name="fade-group">
                     <Body key="0" v-if="bodyHTML" v-html="bodyHTML" style="padding:15px" class="markdown-body comment-body">
                    </Body>

                    <Body key="1" v-else-if="data.id">
                        <p class="text-gray p-3 mb-0">
                            <em>No description provided.</em>
                        </p>
                    </Body>

                    <Skeleton key="2" v-else class="p-3">
                        <SkeletonRectangle :height="18" class="ml-6"></SkeletonRectangle>
                        <SkeletonRectangle :height="18" class="mt-3"></SkeletonRectangle>
                        <SkeletonRectangle :height="18" class="mt-3"></SkeletonRectangle>
                        <SkeletonRectangle :height="18" class="mt-3 mr-6"></SkeletonRectangle>
                    </Skeleton>
                </transition-group>
               

                <!-- <LoadingWrapper v-else class="loading-wrapper d-flex d-flex flex-justify-center flex-items-center">
                    <LoadingIconEx/>
                </LoadingWrapper> -->

                <Reactions :reactionsHost="data" :viewerCanReact="commentExtraDataHolder.viewerCanReact" :reactionsHostType="commentType"></Reactions>

            </div>
        </Inner>

        <Inner v-else class="inner bg-white">
            <Header class="px-2 bg-gray position-relative" :style="headerStyle">
                <button class="text-gray f6 no-wrap float-right py-2 ml-2" :disabled="editing" @click="triggerShowMinimized">
                    <svg v-if="!showMinimized" class="octicon octicon-unfold position-relative mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.177.677l2.896 2.896a.25.25 0 01-.177.427H8.75v1.25a.75.75 0 01-1.5 0V4H5.104a.25.25 0 01-.177-.427L7.823.677a.25.25 0 01.354 0zM7.25 10.75a.75.75 0 011.5 0V12h2.146a.25.25 0 01.177.427l-2.896 2.896a.25.25 0 01-.354 0l-2.896-2.896A.25.25 0 015.104 12H7.25v-1.25zm-5-2a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM6 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 016 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM12 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 0112 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5z"></path></svg>
                    <svg v-else  class="octicon octicon-fold position-relative mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10.896 2H8.75V.75a.75.75 0 00-1.5 0V2H5.104a.25.25 0 00-.177.427l2.896 2.896a.25.25 0 00.354 0l2.896-2.896A.25.25 0 0010.896 2zM8.75 15.25a.75.75 0 01-1.5 0V14H5.104a.25.25 0 01-.177-.427l2.896-2.896a.25.25 0 01.354 0l2.896 2.896a.25.25 0 01-.177.427H8.75v1.25zm-6.5-6.5a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM6 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 016 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM12 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 0112 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5z"></path></svg>
                    {{showMinimized ? 'Hide comment' : 'Show comment'}}
                </button>

                <h3 class="header-minimized-title f5 text-gray text-normal text-italic">
                    This comment was marked as {{commentExtraDataHolder.minimizedReason}}
                </h3>

                <Action v-if="showMinimized && !editing" class="px-1 position-absolute minimized-comment-action" @click="showActionPopover">
                        <svg class="octicon" viewBox="0 0 13 16" version="1.1" width="13" height="16" role="img"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
                         <Popover ref="actionPopover" :popoverStyle="popoverStyle">
                             <slot name="actions">
                                <button class="popover-item btn-link dropdown-item" @click.stop="e => e.preventDefault()" v-clipboard:copy="location.href"  v-clipboard:success="copyLinkSuccessHook">
                                    Copy link
                                </button>
                                <div  v-if="accessToken">
                                    <button class="popover-item btn-link dropdown-item" @click.stop="quoteReply" v-if="!issue().locked || viewerIsCollaborator().data">
                                        Quote reply
                                    </button>
                                    <button class="popover-item btn-link dropdown-item">
                                        Reference in new issue
                                    </button>
                                    <div class="dropdown-divider" v-if="commentExtraDataHolder.viewerCanUpdate || commentExtraDataHolder.viewerCanMinimize || commentExtraDataHolder.viewerCanDelete"></div> 
                                    <button v-if="commentExtraDataHolder.viewerCanUpdate" @click.stop="() => triggerEdit(true)" class="popover-item btn-link dropdown-item">
                                        Edit
                                    </button>
                                    <button v-if="commentExtraDataHolder.viewerCanMinimize" :disabled="unminimizeLoading" class="popover-item btn-link dropdown-item" @click.stop="network_unminimizeThisComment">
                                        {{unminimizeLoading ? 'Trying...' : 'Unhide'}}
                                    </button>
                                    <button v-if="commentExtraDataHolder.viewerCanDelete" class="popover-item btn-link text-red hover-red">
                                        Delete
                                    </button>
                                    <div class="dropdown-divider" v-if="viewerIsCollaborator().data"></div> 
                                    <button v-if="viewerIsCollaborator().data" class="popover-item btn-link dropdown-item">
                                        Report content
                                    </button>
                                </div>
                             </slot>
                        </Popover>
                    </Action>
            </Header>  

            <CommentEditPane class="comment-create-edit-pane" 
                            @update-comment="updateCommentPostHook"
                            v-if="editing" 
                            ref="commentEditPane" 
                            :comment="data"
                            @cancel="confirmCancel">
            </CommentEditPane>

            <Main class="p-3" v-else-if="showMinimized ">
                <router-link class="d-inline-block float-left mt-1" to="/">
                    <ImgWrapper class="avatar avatar-user">
                            <img    class="avatar avatar-user" 
                                :src="data.user && data.user.avatar_url"
                                height="28" 
                                width="28" 
                                :alt="`@${data.user && data.user.login}`">
                    </ImgWrapper>
                </router-link>

                <Body style="margin-left: 44px;">
                    <h4 class="f5 text-normal d-inline text-gray-dark">
                        <router-link to="/">
                            <strong class="no-wrap text-gray">
                                {{data.user && data.user.login}}
                            </strong>
                        </router-link>
                        <span class="no-wrap text-gray">{{dateStampGap > dataStampGapThreshold ? 'on' : ''}} {{data.created_at | getDateDiff}}</span>
                    </h4>

                    <Body v-if="bodyHTML" v-html="bodyHTML" style="padding:15px;padding-bottom:0" class="markdown-body comment-body">
                    </Body>

                    <Body v-else>
                        <p class="text-gray p-3 mb-0">
                            <em>No description provided.</em>
                        </p>
                    </Body>
                </Body>
            </Main>
        </Inner>

        <LoadingCover v-if="loadingDeleteThis" class="position-absolute" style="top:0;bottom:0;left:0;right:0;pointer-event:none;background:white;opacity:0.4"></LoadingCover>

        <Modal ref="editHistoriesModal" :title="editHistories.loading ? 'Loading edit history...' : `Edited ${editHistories.data.length} ${editHistories.data.length > 1 ? 'times' : 'time'}`" :modalStyle="{maxHeight:'80vh'}" @show="network_getEditHistories">
            <div class="overflow-y-auto position-relative" style="min-height:240px">
                <transition-group name="fade-group" appear>
                    <div key="0" v-if="editHistories.loading" class="position-absolute d-flex flex-items-center flex-justify-center" style="top:0;bottom:0;right:0;left:0">
                        <LoadingIconEx></LoadingIconEx>
                    </div>
                    <div key="1" v-else>
                        <div class="d-block p-2 border-bottom" v-for="item in editHistories.data" :key="item.editedAt">
                            <img :src="item.avatarUrl" width="20" height="20" class="avatar avatar-user avatar-small v-align-middle mr-1" :alt="`@${item.login}`">
                            <span class="css-truncate-target v-align-middle text-bold">{{item.login}}</span>
                            <span class="v-align-middle">edited <span class="no-wrap">{{item.editedAt | getDateDiff}}</span></span>
                        </div> 
                    </div>
                    <div key="2" v-if="editHistories.isEmpty && !editHistories.loading" class="position-absolute d-flex flex-items-center flex-justify-center" style="top:0;bottom:0;right:0;left:0">
                        No edit history yet.
                    </div>
                </transition-group>
               
            </div> 
        </Modal>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_markdownParse} from '@/util'
    import {LoadingIconEx,AnimatedHeightWrapper,Popover,ImgWrapper,HyperlinkWrapper,SkeletonRectangle,SkeletonCircle,Modal} from '@/components'
    import * as api from '@/network/api'
    import {authRequiredAjax,authRequiredGitHubGraphqlApiQuery,commonGet,authRequiredPost,cancelAndUpdateAxiosCancelTokenSource  } from '@/network'
    import * as graphql from './graphql'
    import CommentEditPane from './CommentEditPane'
    import Reactions from '../../Reactions'
    import {MinimizePane} from '../../../../../components'
    export default {
        inject: ['commentExtraDataProvided','issue','viewerIsCollaborator','graphqlWritePermission','timelineItemDeletedHook'],
        data() {
            return {
                showMinimized: false,
                dataStampGapThreshold: 1000 * 60 * 60 * 24 * 30,
                popoverStyle: {
                    top: '100%',
                    width: '185px',
                    right: '-6px',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                },
                loadingDeleteThis: false,
                showMinimizePane: false,
                unminimizeLoading: false,
                editing: false,
                editHistories: {
                    data: [],
                    loading: false
                },
            }
        },
        props: {
            data: {
                type: Object,
                default: () => ({})
            },
            extraData: {
                type: Object,
                required: false
            },
            loading: {
                type: Boolean,
                default: false
            },
            headerStyle: {
                type: Object,
                required: false
            },
            commentType: {
                type: String,
                default: 'issueComment'
            }
        },
        computed: {
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            commentExtraDataHolder() {
                if(this.extraData) return this.extraData
                let commentExtraDataHolder = this.commentExtraDataProvided().filter(item => {
                    return item.id === this.data.node_id
                })[0] || {}
                if(commentExtraDataHolder.bodyHTML) {
                    let pattern = /href="https:\/\/github\.com\/(\S+)"/g
                    let execResult
                    while((execResult = pattern.exec(commentExtraDataHolder.bodyHTML)) !== null) {
                        commentExtraDataHolder.bodyHTML = commentExtraDataHolder.bodyHTML.replace(execResult[0],`href="/${execResult[1]}"`)
                    }
                }
                return commentExtraDataHolder
            },
            authorAssociation() {
                if(this.commentExtraDataHolder.authorAssociation && this.commentExtraDataHolder.authorAssociation !== "NONE"){
                    return this.commentExtraDataHolder.authorAssociation.toLowerCase()
                }
                if((this.issue().user && this.issue().user.login) == (this.data.user && this.data.user.login)) return 'author'
                return undefined
            },
            dateStampGap() {
                return Date.parse(new Date()) - Date.parse(this.data.created_at)
            },
            location() {
                return location
            },
            bodyHTML() {
                if(!this.data.body) return ''
                return util_markdownParse.markdownToHTML(this.data.body)
            },
        },
        methods: {
            triggerShowMinimized() {
                this.showMinimized = !this.showMinimized
            },
            showActionPopover() {
                this.$refs.actionPopover.show = true
            },
            quoteReply() {
                if(!this.data.body) return
                let markdownRaw = this.data.body
                let quotedMarkdownRaw
                let pattern = /(\r\n|\r|\n)/g
                let matchResult = this.data.body.match(pattern) ? this.data.body.match(pattern)[0] : ''
                if(matchResult) {
                    quotedMarkdownRaw = markdownRaw.replace(pattern,matchResult + '>')
                } else {
                    quotedMarkdownRaw = markdownRaw
                }
                this.closeModal()
                this.$emit('quote',(matchResult || '\n') + '>' + quotedMarkdownRaw)
                
            },
            async network_deleteThisComment() {
                if(this.loadingDeleteThis) return
                let confirmFlag = confirm("Are you sure you want to delete this?")
                if(confirmFlag) {
                    this.closeModal()
                    try{
                        this.loadingDeleteThis = true
                        let url = api.API_ISSUE_COMMENT({
                            ...this.$route.params,
                            commentId: this.data.id
                        })
                        
                        await authRequiredAjax(
                            url,
                            {},
                            'delete'
                        )

                        await this.timelineItemDeletedHook()(this.data)
                        
                        this.$el.style.height = getComputedStyle(this.$el).height
                        this.$el.style.overflow = 'hidden'
                        setTimeout(() => {
                            this.$el.style.height = '0px'
                            this.$el.style.paddingTop = '0px'
                            this.$el.style.paddingBottom = '0px'
                        })

                        //let commentDeletedEvent = new CustomEvent('comment-deleted',{bubbles:true,detail:this.data})
                    }catch(e){
                        this.handleError(e)
                    }finally{   
                        this.loadingDeleteThis = false
                    }
                }
            },
            async network_getEditHistories() {
                if(this.editHistories.loading) return
                if(this.editHistories.data.length > 0) return 
                try{
                    this.editHistories.loading = true
                    let url = api.API_PROXY_ISSUE_COMMENT_EDIT_HISTORIES(this.data.node_id)
                    let res = await commonGet(url)
                    this.parseEditHistories(res.data)
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.editHistories.loading = false
                }
            },
            async network_unminimizeThisComment() {
                if(this.unminimizeLoading) return
                try{
                    this.unminimizeLoading = true
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_MUTATION_UNMINIMIZE_COMMENT,
                        {
                            variables: {
                                subjectId: this.data.node_id,
                            }
                        }
                    )
                    
                    try{
                        this.$emit('unminimize-comment',{
                            comment: this.data,
                            info: res.data.data.unminimizeComment.unminimizedComment
                        })
                        this.closeModal()
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }

                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.unminimizeLoading = false
                }
            },
            triggerMinimizePane(payload = true) {
                this.showMinimizePane = payload
                if(payload) {
                    this.closeModal()
                }
            },
            copyLinkSuccessHook(e) {
                this.closeModal()
                this.$toast(`复制成功: ${e.text}`)
            },
            triggerEdit(payload) {
                if(payload) this.closeModal()
                this.editing = payload
            },
            updateCommentPostHook(payload) {
                this.editing = false
                this.$emit('update-comment',payload)
            },
            confirmCancel(payload) {
                if(payload == this.data.body) {
                    this.triggerEdit(false)
                }else{
                    if(confirm("Are you sure you want to discard your unsaved changes?")) {
                        this.triggerEdit(false)
                    }
                }
            },
            parseEditHistories(HTML) {
                let editHistories = []
                let pattern = /<li[^>]*>(?:[\S\s]*?)<img src="(.*?)".*alt="@(.*?)">(?:[\S\s]*?)<relative-time datetime="(.*?)"[^>]*?>(?:[\S\s]*?)<\/li>/g
                let execResult
                while((execResult = pattern.exec(HTML)) != null) {
                    editHistories.push({
                        avatarUrl: execResult[1],
                        login: execResult[2],
                        editedAt    : execResult[3]
                    })
                }
                
                this.editHistories.data = editHistories
                this.editHistories.isEmpty = false
                if(editHistories.length == 0) this.editHistories.isEmpty = true
            },
            showEditHistoryDetail(payload) {
                this.editHistoryDetailModal.data = payload
                if(this.$refs.editHistoryDetailModal)  this.$refs.editHistoryDetailModal.show = true
            }
        },
        watch: {
            editing(newOne,oldOne) {
                this.$nextTick(() => {
                    if(newOne && !oldOne) {
                        if(this.$refs.commentEditPane) {
                            if(!this.$refs.commentEditPane.markdownRaw) {
                                this.$refs.commentEditPane.markdownRaw = this.data.body
                            }
                        }
                        if(this.$refs.commentEditPaneMinimized) {
                            if(!this.$refs.commentEditPaneMinimized.markdownRaw) {
                                this.$refs.commentEditPaneMinimized.markdownRaw = this.data.body
                            }
                        }
                    }
                })
            }
        },
        components: {
            LoadingIconEx,
            ImgWrapper,
            AnimatedHeightWrapper,
            Popover,
            CommentEditPane,
            HyperlinkWrapper,
            SkeletonRectangle,
            SkeletonCircle,
            Modal,
            MinimizePane,
            Reactions,
            Container: styled.div``,
            Inner: styled.div``,
            Header: styled.div``,
            LoadingWrapper: styled.div``,
            HeaderInner: styled.div``,
            Main: styled.div``,
            Body: styled.div``,
            Reaction: styled.div``,
            Action: styled.div``,
            AuthorAssociation: styled.span``,
            StretchCommentBtn: styled.div``,
            EditHistoryItem: styled.div``,
            Skeleton: styled.div``,
            LoadingCover: styled.div``,
        }
    }
</script>

<style lang="scss">
@import 'node_modules/@primer/css/markdown/index.scss';
@import './user_edit_contents.scss';
.team-mention, .user-mention {
    font-weight: 600;
    color: #24292e;
    white-space: nowrap;
}

.team-mention, .user-mention {
    font-weight: 600;
    color: #24292e;
    white-space: nowrap;
}

.comment-body {
    width: 100%;
    overflow: visible;
    font-size: 14px;
}


</style>

<style scoped lang="scss">
@import 'node_modules/@primer/css/avatars/index.scss';
@import 'node_modules/@primer/css/dropdown/index.scss';
@import 'node_modules/@primer/css/alerts/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/layout/index.scss';
.inner{
    position: relative;
    color: #24292e;
        border: 1px solid #d1d5da;
    border-radius: 3px;
    .header{
        display: flex;
        align-items: center;
        flex-direction: row-reverse;
        padding-right: 16px;
        padding-left: 16px;
        color: #586069;
        background-color: #f6f8fa;
        border-bottom: 1px solid #d1d5da;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        .action{
            float: right;
            margin-left: 8px;
        }
        .author-association{
            float: right;
            padding: 2px 4px;
            margin-left: 8px;
            font-size: 12px;
            cursor: default;
            border: 1px solid rgba(27,31,35,.15);
            border-radius: 3px;
            color: #586069;
            white-space: nowrap;
        }
    }

    .loading-wrapper{
        height: 120px;
    }

}


.timeline-item:before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 16px;
    display: block;
    width: 2px;
    content: "";
    background-color: #e1e4e8;
}
.header-minimized-title{
    min-width: 0;
    padding-top: 8px;
    padding-bottom: 8px;
    margin-bottom: 1px;
    flex: 1 1 auto;
}

.minimized-comment-action{
    top: calc(100% + 8px);
    right: 16px;
}

.popover-item{
    width: 100%;
    display: block;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-right: 8px;
    padding-left: 16px;
    overflow: hidden;
    color: #24292e;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.comment-body {
    width: 100%;
    padding: 15px;
    overflow: visible;
    font-size: 14px;
}

button{
    text-align: left;
}

.hover-red:hover{
    color: #fff!important;
    background: #d73a49!important;
}

.edit-history-popover{
    max-height: 200px;
    overflow-y: auto
}

.current-user {
    background-color: rgb(241, 248, 255)!important;
    border-bottom-color: rgba(3, 102, 214, 0.2)!important;
}

</style>