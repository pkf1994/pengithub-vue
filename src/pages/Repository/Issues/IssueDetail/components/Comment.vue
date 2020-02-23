<template>
    <Container class="py-3 relative timeline-item">
        <Inner class="inner bg-white">
            <Header class="px-3 header text-normal f5">
                <Action class="action py-2 px-1 ml-2">
                    <svg class="octicon" viewBox="0 0 13 16" version="1.1" width="13" height="16" role="img"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
                </Action>

                <HeaderInner class="py-2">
                    <router-link class="d-inline-block" to="/">
                        <img    class="avatar" 
                                :src="data.user && data.user.avatar_url"
                                height="20" 
                                width="20" 
                                :alt="`@${data.user && data.user.login}`">
                    </router-link>
                    <strong class="no-wrap">
                        {{data.user && data.user.login}}
                    </strong>
                    commented
                    <span class="no-wrap">{{createdAt}}</span>
                </HeaderInner>
            </Header>

            <AnimatedHeightWrapper>
                <Body v-if="!loading && (bodyHTML || commentBodyHTMLAndReactionsHolder.bodyHTML)" v-html="bodyHTML || commentBodyHTMLAndReactionsHolder.bodyHTML" style="padding:15px" class="markdown-body">
            
                </Body>

                <LoadingWrapper v-else class="loading-wrapper flex flex-justify-center flex-items-center">
                    <LoadingIconEx/>
                </LoadingWrapper>

                <Reaction v-if="!loading && localReactionStatistic" class="reactions border-top">
                    <button class="reaction-item btn-link " v-if="localReactionStatistic.THUMBS_UP">
                        <span class="emoj mr-1">👍</span>        
                        {{localReactionStatistic.THUMBS_UP}}
                    </button>
                    <button class="reaction-item btn-link " v-if="localReactionStatistic.THUMBS_DOWN">
                        <span class="emoj mr-1">👎</span>        
                        {{localReactionStatistic.THUMBS_DOWN}}
                    </button>
                    <button class="reaction-item btn-link " v-if="localReactionStatistic.CONFUSED">
                        <span class="emoj mr-1">😕</span>        
                        {{localReactionStatistic.CONFUSED}}
                    </button>
                    <button class="reaction-item btn-link " v-if="localReactionStatistic.HOORAY">
                        <span class="emoj mr-1">🎉</span>        
                        {{localReactionStatistic.HOORAY}}
                    </button>
                    <button class="reaction-item btn-link " v-if="localReactionStatistic.HEART">
                        <span class="emoj mr-1">❤️</span>        
                        {{localReactionStatistic.HEART}}
                    </button>
                    <button class="reaction-item btn-link " v-if="localReactionStatistic.ROCKET">
                        <span class="emoj mr-1">🚀</span>        
                        {{localReactionStatistic.ROCKET}}
                    </button>
                    <button class="reaction-item btn-link " v-if="localReactionStatistic.LAUGH">
                        <span class="emoj mr-1">😄</span>        
                        {{localReactionStatistic.LAUGH}}
                    </button>
                    <button class="reaction-item btn-link " v-if="localReactionStatistic.EYES">
                        <span class="emoj mr-1">👀</span>        
                        {{localReactionStatistic.EYES}}
                    </button>
                </Reaction>
            </AnimatedHeightWrapper>
        </Inner>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_dateFormat} from '../../../../../util'
    import {LoadingIconEx,AnimatedHeightWrapper} from '../../../../../components'
    import {mapState} from 'vuex'
    export default {
        inject: ['commentBodyHTMLAndReactionsGetter'],
        props: {
            data: {
                type: Object,
                required: true
            },
            bodyHTML: {
                type: String,
                required: false
            },
            loading: {
                type: Boolean,
                default: false
            },
            reactionStatistic: {
                type: Object,
                required: false
            }
        },
        computed: {
            ...mapState({
                //commentBodyHTMLAndReactions: state => state.repository.issue.issueDetail.timeline.commentBodyHTMLAndReactions.data
            }),
            commentBodyHTMLAndReactionsHolder() {
                return this.commentBodyHTMLAndReactionsGetter().filter(item => {
                    return item.id === this.data.node_id
                })[0] || {}
            },
            createdAt() {
                return util_dateFormat.dateFormat('dd zzz yyyy',new Date(this.data.created_at))
            },
            localReactionStatistic() {
                if(this.reactionStatistic) return this.reactionStatistic
                let localReactionStatistic
                for(let key in this.commentBodyHTMLAndReactionsHolder) {
                    switch(key) {
                        case 'THUMBS_UP':
                        case 'THUMBS_DOWN':
                        case 'LAUGH':
                        case 'HOORAY':
                        case 'CONFUSED':
                        case 'HEART':
                        case 'ROCKET':
                        case 'EYES':
                            if(!localReactionStatistic)localReactionStatistic = {}
                            localReactionStatistic[key] = this.commentBodyHTMLAndReactionsHolder[key].totalCount
                            break
                        default:
                    }
                }
                return localReactionStatistic 
            }
        },
        components: {
            LoadingIconEx,
            AnimatedHeightWrapper,
            Container: styled.div``,
            Inner: styled.div``,
            Header: styled.div``,
            LoadingWrapper: styled.div``,
            HeaderInner: styled.div``,
            Body: styled.div``,
            Reaction: styled.div``,
            Action: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
.inner{
    position: relative;
    color: #24292e;
        border: 1px solid #d1d5da;
    border-radius: 3px;
    .header{
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
</style>