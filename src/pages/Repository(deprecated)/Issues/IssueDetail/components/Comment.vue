<template>
    <Container class="position-relative timeline-item transition-all" style="padding-top:16px;padding-bottom:16px">
        <Inner v-if="!commentExtraDataHolder.isMinimized" class="inner bg-white">
            <Header class="px-3 header text-normal f5" :style="headerStyle">
                <Action class="action py-2 px-1 ml-2 position-relative" style="align-self:start" @click="showActionPopover">
                    <svg class="octicon" viewBox="0 0 13 16" version="1.1" width="13" height="16" role="img"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
                    <Popover ref="actionPopover" :popoverStyle="popoverStyle">
                        <slot name="actions">
                            <button class="popover-item btn-link dropdown-item" @click.stop="e => e.preventDefault()" v-clipboard:copy="location.href" v-clipboard:success="copyLinkSuccessHook">
                                Copy link
                            </button>
                            <div  v-if="accessToken">
                                <button class="popover-item btn-link dropdown-item" @click.stop="quoteReply" v-if="!issueGetter().locked || viewerIsCollaborator().data">
                                    Quote reply
                                </button>
                                <button class="popover-item btn-link dropdown-item">
                                    Reference in new issue
                                </button>
                                <div class="dropdown-divider" v-if="commentExtraDataHolder.viewerCanUpdate || commentExtraDataHolder.viewerCanMinimize || commentExtraDataHolder.viewerCanDelete"></div> 
                                <button v-if="commentExtraDataHolder.viewerCanUpdate"  @click.stop="() => triggerEdit(true)" class="popover-item btn-link dropdown-item">
                                    Edit
                                </button>
                                <button v-if="commentExtraDataHolder.viewerCanMinimize" @click.stop="() => triggerMinimizePane(true)" class="popover-item btn-link dropdown-item">
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

                <HeaderInner class="py-2 flex-grow-1 position-relative" >
                    <router-link class="d-inline-block" to="/">
                        <ImgWrapper>
                            <img   class="avatar" 
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
                    <span class="no-wrap">{{data.created_at | getDateDiff}}</span>

                    <span class="d-inline-block text-gray-light" v-if="withEditHistory || data.updated_at != data.created_at">•</span>    
                    <span class="d-inline-block text-gray btn-link" v-if="withEditHistory || data.updated_at != data.created_at" @click="() => showModal('editedPopover')">
                        edited
                        <svg height="11" class="octicon octicon-triangle-down v-align-middle" viewBox="0 0 12 16" version="1.1" width="8" aria-hidden="true"><path fill-rule="evenodd" d="M0 5l6 6 6-6H0z"></path></svg>
                        <Popover ref="editedPopover" :popoverStyle="{left: '16px',right: '16px',top:'calc(100% + 8px)'}" @show="network_getEditHistories">
                            <div class="dropdown-header px-3 py-2 border-bottom">
                                Edited {{editHistories.data.length}} {{editHistories.data.length > 1 ? 'times' : 'time'}}
                            </div> 
                            <div class="edit-history-popover">
                                <button class="btn-link dropdown-item p-2" v-for="(item,index) in editHistories.data" :key="item.editedAt">
                                    <img :src="item.avatarUrl" width="20" height="20" class="avatar avatar-user avatar-small v-align-middle mr-1" :alt="`@${item.login}`">
                                    <span class="css-truncate-target v-align-middle text-bold">pkf1994</span>
                                    <span class="v-align-middle">edited <span class="no-wrap">{{item.editedAt | getDateDiff}}o</span> <span v-if="index == 0">(most recent)</span></span>
                                </button>
                            </div>
                        </Popover>
                    </span>

                </HeaderInner>
            </Header>   

            <AnimatedHeightWrapper>
                <MinimizePane v-if="minimizePane.show" class="flash flash-warn flash-full" style="padding-bottom: 8px">
                    <button class="flash-close" :disabled="minimizePane.loading" @click="() => triggerMinimizePane(false)" type="button"><svg aria-label="Cancel hiding comment" class="octicon octicon-x" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>
                    </button>
                    <h3 class="f4">Choose a reason for hiding this comment</h3>
                    <p class="mb-3">
                        The reason will be displayed to describe this comment to others. 
                        <HyperlinkWrapper>
                            <a href="https://help.github.com/articles/managing-disruptive-comments/#hiding-a-comment">
                                Learn more
                            </a>
                        </HyperlinkWrapper>
                        .
                    </p>

                    <div class="d-flex flex-wrap">
                        <select name="classifier" class="form-select mb-2 mr-2" required v-model="minimizePane.reason" :disabled="minimizePane.loading">
                            <option value="">
                                Choose a reason
                            </option>
                            <option value="SPAM">Spam</option>
                            <option value="ABUSE">Abuse</option>
                            <option value="OFF_TOPIC">Off Topic</option>
                            <option value="OUTDATED">Outdated</option>
                            <option value="DUPLICATE">Duplicate</option>
                            <option value="RESOLVED">Resolved</option>
                        </select>

                        <button type="submit" class="btn" style="height:34px;" :disabled="!minimizePane.reason || minimizePane.loading" @click="network_minimizeThisComment">
                            {{minimizePane.loading ? 'Trying...' : 'Hide comment'}}
                        </button>
                    </div>
                    
                </MinimizePane>
            </AnimatedHeightWrapper>

            <CommentEditPane class="comment-create-edit-pane" 
                            @update-comment="updateCommentPostHook"
                            v-if="editing" 
                            ref="commentEditPane" 
                            :comment="data"
                            @cancel="confirmCancel">
            </CommentEditPane>

            <div v-else>
                <Body v-if="bodyHTML" v-html="bodyHTML" style="padding:15px" class="markdown-body comment-body">
                </Body>

                <Body v-else>
                    <p class="text-gray p-3 mb-0">
                        <em>No description provided.</em>
                    </p>
                </Body>

                <!-- <LoadingWrapper v-else class="loading-wrapper d-flex flex-justify-center flex-items-center">
                    <LoadingIconEx/>
                </LoadingWrapper> -->

                <Reaction v-if="commentExtraDataHolder.viewerCanReact || withReaction" class="reactions border-top">
                    <button class="reaction-item btn-link" :disabled="!commentExtraDataHolder.viewerCanReact" v-if="reactionStatistic['thumps_up'] || reactionStatistic['+1'] > 0">
                        <span class="emoj mr-1">👍</span>        
                        {{reactionStatistic['thumps_up'] || reactionStatistic['+1']}}
                    </button><button class="reaction-item btn-link" :disabled="!commentExtraDataHolder.viewerCanReact" v-if="reactionStatistic['thumps_down'] || reactionStatistic['-1'] > 0">
                        <span class="emoj mr-1">👎</span>        
                        {{reactionStatistic['thumps_down'] || reactionStatistic['-1']}}
                    </button><button class="reaction-item btn-link" :disabled="!commentExtraDataHolder.viewerCanReact" v-if="reactionStatistic['laugh'] > 0">
                        <span class="emoj mr-1">😄</span>        
                        {{reactionStatistic['laugh']}}
                    </button><button class="reaction-item btn-link" :disabled="!commentExtraDataHolder.viewerCanReact" v-if="reactionStatistic['hooray'] > 0">
                        <span class="emoj mr-1">🎉</span>        
                        {{reactionStatistic['hooray']}}
                    </button><button class="reaction-item btn-link" :disabled="!commentExtraDataHolder.viewerCanReact" v-if="reactionStatistic['confused'] > 0">
                        <span class="emoj mr-1">😕</span>        
                        {{reactionStatistic['confused']}}
                    </button><button class="reaction-item btn-link" :disabled="!commentExtraDataHolder.viewerCanReact" v-if="reactionStatistic['heart'] > 0">
                        <span class="emoj mr-1">❤️</span>        
                        {{reactionStatistic['heart']}}
                    </button><button class="reaction-item btn-link" :disabled="!commentExtraDataHolder.viewerCanReact" v-if="reactionStatistic['rocket'] > 0">
                        <span class="emoj mr-1">🚀</span>        
                        {{reactionStatistic['rocket']}}
                    </button><button class="reaction-item btn-link" :disabled="!commentExtraDataHolder.viewerCanReact" v-if="reactionStatistic['eyes'] > 0">
                        <span class="emoj mr-1">👀</span>        
                        {{reactionStatistic['eyes']}}
                    </button><button class="reaction-item btn-link " v-if="commentExtraDataHolder.viewerCanReact">
                        <svg class="octicon octicon-plus-small add-reaction-plus-icon" viewBox="0 0 7 16" version="1.1" width="7" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 4H3v3H0v1h3v3h1V8h3V7H4V4z"></path></svg>        
                        <svg class="octicon octicon-smiley" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm4.81 12.81a6.72 6.72 0 01-2.17 1.45c-.83.36-1.72.53-2.64.53-.92 0-1.81-.17-2.64-.53-.81-.34-1.55-.83-2.17-1.45a6.773 6.773 0 01-1.45-2.17A6.59 6.59 0 011.21 8c0-.92.17-1.81.53-2.64.34-.81.83-1.55 1.45-2.17.62-.62 1.36-1.11 2.17-1.45A6.59 6.59 0 018 1.21c.92 0 1.81.17 2.64.53.81.34 1.55.83 2.17 1.45.62.62 1.11 1.36 1.45 2.17.36.83.53 1.72.53 2.64 0 .92-.17 1.81-.53 2.64-.34.81-.83 1.55-1.45 2.17zM4 6.8v-.59c0-.66.53-1.19 1.2-1.19h.59c.66 0 1.19.53 1.19 1.19v.59c0 .67-.53 1.2-1.19 1.2H5.2C4.53 8 4 7.47 4 6.8zm5 0v-.59c0-.66.53-1.19 1.2-1.19h.59c.66 0 1.19.53 1.19 1.19v.59c0 .67-.53 1.2-1.19 1.2h-.59C9.53 8 9 7.47 9 6.8zm4 3.2c-.72 1.88-2.91 3-5 3s-4.28-1.13-5-3c-.14-.39.23-1 .66-1h8.59c.41 0 .89.61.75 1z"></path></svg>
                    </button>
                </Reaction>
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
                                    <button class="popover-item btn-link dropdown-item" @click.stop="quoteReply" v-if="!issueGetter().locked || viewerIsCollaborator().data">
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
                    <ImgWrapper>
                            <img    class="avatar" 
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
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_dateFormat} from '@/util'
    import {LoadingIconEx,AnimatedHeightWrapper,Popover,ImgWrapper,HyperlinkWrapper} from '@/components'
    import {util_markdownParse} from '@/util'
    import {mapState} from 'vuex'
    import ClipboardJS from 'clipboard';
    import * as api from '@/network/api'
    import {authRequiredAjax,authRequiredGitHubGraphqlApiQuery,commonGet} from '@/network'
    import * as graphql from '../graphql'
    import CommentEditPane from './CommentEditPane'
    export default {
        inject: ['commentExtraDataProvided','issueGetter','viewerIsCollaborator'],
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
                deleteThisCommentLoading: false,
                minimizePane: {
                    show: false,
                    reason: '',
                    loading: false
                },
                unminimizeLoading: false,
                editing: false,
                editHistories: {
                    data: [],
                    loading: false
                },
                reactions:{
                    data: undefined,
                    loading: false
                }
            }
        },
        props: {
            data: {
                type: Object,
                required: true
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
            }
        },
        computed: {
            ...mapState({
                //commentBodyHTMLAndReactions: state => state.repository.issue.issueDetail.timeline.commentBodyHTMLAndReactions.data
            }),
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
        
            reactionStatistic() {
                let reactionStatistic
                for(let key in this.commentExtraDataHolder) {
                    switch(key) {
                        case 'THUMBS_UP':
                        case 'THUMBS_DOWN':
                        case 'LAUGH':
                        case 'HOORAY':
                        case 'CONFUSED':
                        case 'HEART':
                        case 'ROCKET':
                        case 'EYES':
                            if(!reactionStatistic)reactionStatistic = {}
                            reactionStatistic[key.toLowerCase()] = this.commentExtraDataHolder[key].totalCount
                            break
                        default:
                    }
                }
                if(!reactionStatistic && this.reactions.data && this.reactions.data) {
                    for(let key in this.reactions.data) {
                        switch(key) {
                            case '+1':
                            case '-1':
                            case 'laugh':
                            case 'hooray':
                            case 'confused':
                            case 'heart':
                            case 'rocket':
                            case 'eyes':
                                if(!reactionStatistic)reactionStatistic = {}
                                reactionStatistic[key] = this.reactions.data[key]
                                break
                            default:
                        }
                    }
                }
                return reactionStatistic 
            },
            withReaction() {
                for(let key in this.reactionStatistic) {
                    switch(this.reactionStatistic[key]) {
                        case 0:
                            break
                        default:
                            return true
                    }
                }
                return false
            },
            withEditHistory() {
                return this.commentExtraDataHolder.userContentEdits && this.commentExtraDataHolder.userContentEdits.totalCount > 0
            },
            authorAssociation() {
                if(this.commentExtraDataHolder.authorAssociation && this.commentExtraDataHolder.authorAssociation !== "NONE"){
                    return this.commentExtraDataHolder.authorAssociation.toLowerCase()
                }
                if((this.issueGetter().user && this.issueGetter().user.login) == (this.data.user && this.data.user.login)) return 'author'
                return undefined
            },
            dateStampGap() {
                return Date.parse(new Date()) - Date.parse(this.data.created_at)
            },
            location() {
                return location
            },
            bodyHTML() {
                return util_markdownParse.markdownToHTML(this.data.body)
            },
        },
        created() {
            if(!this.accessToken) this.network_getReactions()
        },
        methods: {
            triggerShowMinimized() {
                this.showMinimized = !this.showMinimized
            },
            showActionPopover() {
                this.$refs.actionPopover.show = true
            },
            initClipboard() {
                let clip = new ClipboardJS('#file-detail-copy-btn');
                clip.on('success',e => {
                    this.$toast("Clip OK!")
                })
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
            async network_getReactions() {
                try{
                    this.reactions.loading = true
                    let url = this.data.url
                    let res = await authRequiredAjax(
                        url,
                        {
                            headers: {
                                "Accept":"application/vnd.github.squirrel-girl-preview"
                            }
                        },
                        'get'
                    )

                    this. reactions.data = res.data.reactions
                }catch(e) {
                    console.log(e)
                }finally{
                    this.reactions.loading = false
                }
            },
            async network_deleteThisComment() {
                if(this.deleteThisCommentLoading) return
                let confirmFlag = confirm("Are you sure you want to delete this?")
                if(confirmFlag) {
                    this.closeModal()
                    try{
                        this.deleteThisCommentLoading = true
                        let url = api.API_HANDLE_ISSUE_COMMENT({
                            ...this.$route.params,
                            comment: this.data.id
                        })
                        
                        await authRequiredAjax(
                            url,
                            {},
                            'delete'
                        )
                        
                        this.$el.style.height = getComputedStyle(this.$el).height
                        this.$el.style.overflow = 'hidden'
                        setTimeout(() => {
                            this.$el.style.height = '0px'
                            this.$el.style.paddingTop = '0px'
                            this.$el.style.paddingBottom = '0px'
                        })
                    }catch(e){
                        this.handleError(e)
                    }finally{   
                        this.deleteThisCommentLoading = false
                    }
                }
            },
            async network_minimizeThisComment() {
                if(this.minimizePane.loading) return
                if(!this.minimizePane.reason) {
                    this.$toast('Please choose a minimize reason.')
                    return 
                }
                try{
                    this.minimizePane.loading = true
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_MUTATION_MINIMIZE_COMMENT,
                        {
                            variables: {
                                subjectId: this.data.node_id,
                                classifier: this.minimizePane.reason
                            }
                        }
                    )
                    
                    try{
                        this.triggerMinimizePane(false)
                        this.showMinimized = false
                        this.$emit('minimize-comment',{
                            comment: this.data,
                            info: res.data.data.minimizeComment.minimizedComment
                        })
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }

                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.minimizePane.loading = false
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
            async network_getEditHistories() {
                if(this.editHistories.loading) return
                if(this.editHistories.data.length > 0) return 
                try{
                    this.editHistories.loading = true
                    let url = api.API_PROXY_ISSUE_COMMENT_EDIT_HISTORIES(this.data.node_id)
                    let res = await commonGet(url)
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.editHistories.loading = false
                }
            },
            triggerMinimizePane(payload) {
                this.minimizePane.show = payload
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
                console.log(this.editing)
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
            MinimizePane: styled.div``,
            EditHistoryItem: styled.div``,
        }
    }
</script>

<style lang="scss">
@import 'node_modules/@primer/css/markdown/index.scss';
.team-mention, .user-mention {
    font-weight: 600;
    color: #24292e;
    white-space: nowrap;
}
</style>

<style scoped lang="scss">
@import 'node_modules/@primer/css/avatars/index.scss';
@import 'node_modules/@primer/css/dropdown/index.scss';
@import 'node_modules/@primer/css/alerts/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
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

    .reactions{
        .reaction-item{
            padding: 9px 15px 7px;
            line-height: 18px;
            border-right: 1px solid #e1e4e8;
        }
        .emoj{
            font-family: Apple Color Emoji,Segoe UI,Segoe UI Emoji,Segoe UI Symbol;
            font-size: 1.2em;
            font-style: normal!important;
            font-weight: 400;
            line-height: 20px;
            vertical-align: middle;
        }
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


</style>