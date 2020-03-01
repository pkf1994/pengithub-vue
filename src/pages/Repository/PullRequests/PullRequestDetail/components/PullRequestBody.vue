<template>
    <Container>
        <AnimatedHeightWrapper>
            <Body class="pb-2 p-3" v-if="!loading && commentExtraDataHolder.bodyHTML">
                <BodyHTML v-html="commentExtraDataHolder.bodyHTML"  class="markdown-body p-0 mb-3 " style="font-size:15px">

                </BodyHTML>

                <Reaction v-if="commentExtraDataHolder.viewerCanReact || withReaction" class="border-gray-dark d-flex flex-justify-start flex-wrap">
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
                    </button><button class="reaction-item btn-link muted-link" v-if="commentExtraDataHolder.viewerCanReact">
                        <svg class="octicon octicon-plus-small add-reaction-plus-icon" viewBox="0 0 7 16" version="1.1" width="7" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 4H3v3H0v1h3v3h1V8h3V7H4V4z"></path></svg>        
                        <svg class="octicon octicon-smiley" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm4.81 12.81a6.72 6.72 0 01-2.17 1.45c-.83.36-1.72.53-2.64.53-.92 0-1.81-.17-2.64-.53-.81-.34-1.55-.83-2.17-1.45a6.773 6.773 0 01-1.45-2.17A6.59 6.59 0 011.21 8c0-.92.17-1.81.53-2.64.34-.81.83-1.55 1.45-2.17.62-.62 1.36-1.11 2.17-1.45A6.59 6.59 0 018 1.21c.92 0 1.81.17 2.64.53.81.34 1.55.83 2.17 1.45.62.62 1.11 1.36 1.45 2.17.36.83.53 1.72.53 2.64 0 .92-.17 1.81-.53 2.64-.34.81-.83 1.55-1.45 2.17zM4 6.8v-.59c0-.66.53-1.19 1.2-1.19h.59c.66 0 1.19.53 1.19 1.19v.59c0 .67-.53 1.2-1.19 1.2H5.2C4.53 8 4 7.47 4 6.8zm5 0v-.59c0-.66.53-1.19 1.2-1.19h.59c.66 0 1.19.53 1.19 1.19v.59c0 .67-.53 1.2-1.19 1.2h-.59C9.53 8 9 7.47 9 6.8zm4 3.2c-.72 1.88-2.91 3-5 3s-4.28-1.13-5-3c-.14-.39.23-1 .66-1h8.59c.41 0 .89.61.75 1z"></path></svg>
                    </button>
                </Reaction>
            </Body>

            <LoadingWrapper v-else class="loading-wrapper flex flex-justify-center flex-items-center">
                <LoadingIconEx/>
            </LoadingWrapper>
            
        </AnimatedHeightWrapper>
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
                return util_dateFormat.getDateDiff(this.data.created_at)
            },
            editedAt() {
                return util_dateFormat.getDateDiff(this.commentExtraDataHolder.userContentEdits.nodes[0].editedAt)
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
            Avatar: styled.div``,
            Meta: styled.div``,
            LoadingWrapper: styled.div``,
            HeaderInner: styled.div``,
            Main: styled.div``,
            Body: styled.div``,
            BodyHTML: styled.div``,
            Reaction: styled.div``,
            Action: styled.div``,
            AuthorAssociation: styled.span``,
            StretchCommentBtn: styled.div``
        }
    }
</script>

<style scoped lang="scss">
.header{
    position: relative;
    padding: 10px 15px;
    font-size: 12px;
    line-height: 16px;
    color: #586069;
    background-color: #fff;
    border-bottom: 1px solid #e1e4e8;
    .meta{
        margin-left: 42px;
        a{
            font-weight: 600;
            color: #444d56;
        }
    }
}

.reaction-item{
    font-size: 12px!important;
    padding-top: 4px!important;
    padding-bottom: 4px!important;
    padding-right: 8px!important;
    padding-left: 8px!important;
    display: block;
    margin-top: 4px!important;
    margin-bottom: 4px!important;
    margin-right: 8px!important;
    border-radius: 3px!important;
    border: 1px solid #e1e4e8!important;
}


    .loading-wrapper{
        height: 120px;
    }
</style>