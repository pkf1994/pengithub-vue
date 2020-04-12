<template>
    <Container class="py-3 position-relative timeline-item">
        <Inner v-if="!commentExtraDataHolder.isMinimized" class="inner bg-white">
            <Header class="px-3 header text-normal f5" :style="headerStyle">
                <Action class="action py-2 px-1 ml-2 relative" style="align-self:start" @click="showActionPopover">
                    <svg class="octicon" viewBox="0 0 13 16" version="1.1" width="13" height="16" role="img"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
                    <Popover ref="actionPopover" :popoverStyle="popoverStyle">
                            <button class="popover-item btn-link" :data-clipboard-text="location.href">
                                Copy link
                            </button>
                            <button class="popover-item btn-link" v-if="!issueGetter().locked">
                                Quote reply
                            </button>
                            <button class="popover-item btn-link">
                                Reference in new issue
                            </button>
                            <div class="dropdown-divider" v-if="commentExtraDataHolder.viewerCanUpdate || commentExtraDataHolder.viewerCanMinimize || commentExtraDataHolder.viewerCanDelete"></div> 
                            <button v-if="commentExtraDataHolder.viewerCanUpdate" class="popover-item btn-link">
                                Edit
                            </button>
                            <button v-if="commentExtraDataHolder.viewerCanMinimize" class="popover-item btn-link">
                                Hide
                            </button>
                            <button v-if="commentExtraDataHolder.viewerCanDelete" class="popover-item btn-link text-red">
                                Delete
                            </button>
                            <div class="dropdown-divider" v-if="authorAssociation === 'owner' || authorAssociation === 'member' || authorAssociation === 'collaborator' || authorAssociation === 'contributor'"></div> 
                            <button v-if="authorAssociation === 'owner' || authorAssociation === 'member' || authorAssociation === 'collaborator' || authorAssociation === 'contributor'" class="popover-item btn-link">
                                Report content
                            </button>
                    </Popover>
                </Action>

                <AuthorAssociation class="author-association mt-2" v-if="authorAssociation" style="text-transform:Capitalize;align-self:start">
                    {{authorAssociation}}
                </AuthorAssociation>

                <HeaderInner class="py-2 flex-grow-1" >
                    <router-link class="d-inline-block" to="/">
                        <img    class="avatar" 
                                :src="data.user && data.user.avatar_url"
                                height="20" 
                                width="20" 
                                :alt="`@${data.user && data.user.login}`">
                    </router-link>
                    <router-link to="/">
                        <strong class="no-wrap link-gray-dark">
                            {{data.user && data.user.login}}
                        </strong>
                    </router-link>
                    
                    commented
                    <span class="no-wrap">{{dateStampGap > dataStampGapThreshold ? 'on' : ''}} {{createdAt}}</span>

                    <span class="d-inline-block text-gray-light" v-if="withEditHistory">•</span>    
                    <span class="d-inline-block text-gray btn-link" v-if="withEditHistory">
                        edited
                        <svg height="11" class="octicon octicon-triangle-down v-align-middle" viewBox="0 0 12 16" version="1.1" width="8" aria-hidden="true"><path fill-rule="evenodd" d="M0 5l6 6 6-6H0z"></path></svg>
                    </span>    
                </HeaderInner>
            </Header>

            <AnimatedHeightWrapper>
                <Body v-if="!loading && commentExtraDataHolder.bodyHTML" v-html="commentExtraDataHolder.bodyHTML" style="padding:15px" class="markdown-body comment-body">
            
                </Body>

                <LoadingWrapper v-else class="loading-wrapper d-flex flex-justify-center flex-items-center">
                    <LoadingIconEx/>
                </LoadingWrapper>

                <Reaction v-if="commentExtraDataHolder.viewerCanReact || withReaction" class="reactions border-top">
                    <button class="reaction-item btn-link" :disabled="!commentExtraDataHolder.viewerCanReact" v-if="reactionStatistic.THUMBS_UP > 0">
                        <span class="emoj mr-1">👍</span>        
                        {{reactionStatistic.THUMBS_UP}}
                    </button><button class="reaction-item btn-link" :disabled="!commentExtraDataHolder.viewerCanReact" v-if="reactionStatistic.THUMBS_DOWN > 0">
                        <span class="emoj mr-1">👎</span>        
                        {{reactionStatistic.THUMBS_DOWN}}
                    </button><button class="reaction-item btn-link" :disabled="!commentExtraDataHolder.viewerCanReact" v-if="reactionStatistic.LAUGH > 0">
                        <span class="emoj mr-1">😄</span>        
                        {{reactionStatistic.LAUGH}}
                    </button><button class="reaction-item btn-link" :disabled="!commentExtraDataHolder.viewerCanReact" v-if="reactionStatistic.HOORAY > 0">
                        <span class="emoj mr-1">🎉</span>        
                        {{reactionStatistic.HOORAY}}
                    </button><button class="reaction-item btn-link" :disabled="!commentExtraDataHolder.viewerCanReact" v-if="reactionStatistic.CONFUSED > 0">
                        <span class="emoj mr-1">😕</span>        
                        {{reactionStatistic.CONFUSED}}
                    </button><button class="reaction-item btn-link" :disabled="!commentExtraDataHolder.viewerCanReact" v-if="reactionStatistic.HEART > 0">
                        <span class="emoj mr-1">❤️</span>        
                        {{reactionStatistic.HEART}}
                    </button><button class="reaction-item btn-link" :disabled="!commentExtraDataHolder.viewerCanReact" v-if="reactionStatistic.ROCKET > 0">
                        <span class="emoj mr-1">🚀</span>        
                        {{reactionStatistic.ROCKET}}
                    </button><button class="reaction-item btn-link" :disabled="!commentExtraDataHolder.viewerCanReact" v-if="reactionStatistic.EYES > 0">
                        <span class="emoj mr-1">👀</span>        
                        {{reactionStatistic.EYES}}
                    </button><button class="reaction-item btn-link " v-if="commentExtraDataHolder.viewerCanReact">
                        <svg class="octicon octicon-plus-small add-reaction-plus-icon" viewBox="0 0 7 16" version="1.1" width="7" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 4H3v3H0v1h3v3h1V8h3V7H4V4z"></path></svg>        
                        <svg class="octicon octicon-smiley" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm4.81 12.81a6.72 6.72 0 01-2.17 1.45c-.83.36-1.72.53-2.64.53-.92 0-1.81-.17-2.64-.53-.81-.34-1.55-.83-2.17-1.45a6.773 6.773 0 01-1.45-2.17A6.59 6.59 0 011.21 8c0-.92.17-1.81.53-2.64.34-.81.83-1.55 1.45-2.17.62-.62 1.36-1.11 2.17-1.45A6.59 6.59 0 018 1.21c.92 0 1.81.17 2.64.53.81.34 1.55.83 2.17 1.45.62.62 1.11 1.36 1.45 2.17.36.83.53 1.72.53 2.64 0 .92-.17 1.81-.53 2.64-.34.81-.83 1.55-1.45 2.17zM4 6.8v-.59c0-.66.53-1.19 1.2-1.19h.59c.66 0 1.19.53 1.19 1.19v.59c0 .67-.53 1.2-1.19 1.2H5.2C4.53 8 4 7.47 4 6.8zm5 0v-.59c0-.66.53-1.19 1.2-1.19h.59c.66 0 1.19.53 1.19 1.19v.59c0 .67-.53 1.2-1.19 1.2h-.59C9.53 8 9 7.47 9 6.8zm4 3.2c-.72 1.88-2.91 3-5 3s-4.28-1.13-5-3c-.14-.39.23-1 .66-1h8.59c.41 0 .89.61.75 1z"></path></svg>
                    </button>
                </Reaction>
            </AnimatedHeightWrapper>
        </Inner>


        <Inner v-else class="inner bg-white">
            <Header class="px-2 bg-gray flex flex-justify-between flex-items-center relative" :style="headerStyle">
                <h3 class="header-minimized-title f5 text-gray text-normal text-italic">
                    This comment was marked as {{commentExtraDataHolder.minimizedReason}}
                </h3>
                <StretchCommentBtn class="text-gray f6 no-wrap" @click="triggerShowMinimized">
                        <svg class="octicon octicon-unfold position-relative mr-1" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.5 7.5L14 10c0 .55-.45 1-1 1H9v-1h3.5l-2-2h-7l-2 2H5v1H1c-.55 0-1-.45-1-1l2.5-2.5L0 5c0-.55.45-1 1-1h4v1H1.5l2 2h7l2-2H9V4h4c.55 0 1 .45 1 1l-2.5 2.5zM6 6h2V3h2L7 0 4 3h2v3zm2 3H6v3H4l3 3 3-3H8V9z"></path></svg>{{showMinimized ? 'Hide comment' : 'Show comment'}}
                </StretchCommentBtn>

                 <Action v-if="showMinimized" class="px-1 position-absolute minimized-comment-action" @click="showActionPopover">
                        <svg class="octicon" viewBox="0 0 13 16" version="1.1" width="13" height="16" role="img"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
                         <Popover ref="actionPopover" :popoverStyle="popoverStyle">
                            <button class="popover-item btn-link" :data-clipboard-text="location.href">
                                Copy link
                            </button>
                            <button class="popover-item btn-link" v-if="!issueGetter().locked">
                                Quote reply
                            </button>
                            <!-- <button class="popover-item btn-link">
                                Reference in new issue
                            </button> -->
                            <div class="dropdown-divider" v-if="commentExtraDataHolder.viewerCanUpdate || commentExtraDataHolder.viewerCanMinimize || commentExtraDataHolder.viewerCanDelete"></div> 
                            <button v-if="commentExtraDataHolder.viewerCanUpdate" class="popover-item btn-link">
                                Edit
                            </button>
                            <button v-if="commentExtraDataHolder.viewerCanMinimize" class="popover-item btn-link">
                                Hide
                            </button>
                            <button v-if="commentExtraDataHolder.viewerCanDelete" class="popover-item btn-link text-red">
                                Delete
                            </button>
                            <div class="dropdown-divider" v-if="authorAssociation === 'owner' || authorAssociation === 'member' || authorAssociation === 'collaborator' || authorAssociation === 'contributor'"></div> 
                            <button v-if="authorAssociation === 'owner' || authorAssociation === 'member' || authorAssociation === 'collaborator' || authorAssociation === 'contributor'" class="popover-item btn-link">
                                Report content
                            </button>
                        </Popover>
                    </Action>
            </Header>  

            <AnimatedHeightWrapper :stretch="showMinimized">
                <Main class="p-3">
                   

                    <router-link class="d-inline-block float-left mt-1" to="/">
                            <img    class="avatar" 
                                    :src="data.user && data.user.avatar_url"
                                    height="28" 
                                    width="28" 
                                    :alt="`@${data.user && data.user.login}`">
                    </router-link>

                    <Body style="margin-left: 44px;">
                            <h4 class="f5 text-normal d-inline text-gray-dark">
                                <router-link to="/">
                                    <strong class="no-wrap text-gray">
                                        {{data.user && data.user.login}}
                                    </strong>
                                </router-link>
                                <span class="no-wrap text-gray">{{dateStampGap > dataStampGapThreshold ? 'on' : ''}} {{createdAt}}</span>
                            </h4>

                            <div class="pt-1 markdown-body" v-html="commentExtraDataHolder.bodyHTML">

                            </div> 
                    </Body>
                </Main>
            </AnimatedHeightWrapper>
             
        </Inner>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_dateFormat} from '../../../../../util'
    import {LoadingIconEx,AnimatedHeightWrapper,Popover} from '../../../../../components'
    import {mapState} from 'vuex'
    import ClipboardJS from 'clipboard';
    export default {
        inject: ['commentExtraGraphqlDataGetter','issueGetter'],
        data() {
            return {
                showMinimized: false,
                dataStampGapThreshold: 1000 * 60 * 60 * 24 * 30,
                popoverStyle: {
                    top: '100%',
                    right: '-6px'
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
                let commentExtraDataHolder = this.commentExtraGraphqlDataGetter().filter(item => {
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
            createdAt() {
                return util_dateFormat.getDateDiffOrDateFormatDependOnGap('d zzz yyyy',new Date(this.data.created_at),this.dataStampGapThreshold)
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
                            reactionStatistic[key] = this.commentExtraDataHolder[key].totalCount
                            break
                        default:
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
                if(this.issueGetter().user.login === this.data.user.login) return 'author'
                return undefined
            },
            dateStampGap() {
                return Date.parse(new Date()) - Date.parse(this.data.created_at)
            },
            location() {
                return location
            }
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
            }
        },
        components: {
            LoadingIconEx,
            AnimatedHeightWrapper,
            Popover,
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
            StretchCommentBtn: styled.div``
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
</style>