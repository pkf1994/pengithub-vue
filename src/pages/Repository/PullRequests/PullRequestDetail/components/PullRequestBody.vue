<template>
    <Container>
        <AnimatedHeightWrapper>
            <Body class="pb-2 p-3" v-if="!loading && commentExtraDataHolder.bodyHTML">
                <BodyHTML v-html="commentExtraDataHolder.bodyHTML"  class="markdown-body p-0 mb-3 " style="font-size:15px">

                </BodyHTML>

                 <Reaction   v-if="commentExtraDataHolder.viewerCanReact || withReaction" 
                            :data="reactionStatistic" 
                            :disabled="!commentExtraDataHolder.viewerCanReact"></Reaction>
              
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
    import Reaction from './Reaction'
    import ClipboardJS from 'clipboard';
    export default {
        inject: ['commentsAndReviewsExtraGraphqlDataGetter','issueGetter'],
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
                let commentExtraDataHolder = this.commentsAndReviewsExtraGraphqlDataGetter().filter(item => {
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
            Reaction,
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