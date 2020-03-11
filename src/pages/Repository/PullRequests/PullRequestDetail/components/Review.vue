<template>
    <Container class="p-3 relative container">
        <Inner class="flex relative pl-4">

            <div class="pr-simple-timeline-icon-wrapper">
                <svg class="octicon octicon-eye" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"></path></svg>
            </div>
           
            <WhoDidWhat>
                <router-link :to="`/${review.user.login}`" class="d-inline-block">
                        <img :src="review.user.avatar_url" :alt="`@${review.user.login}`" class="avatar mr-1" height="16" width="16">
                </router-link>
                <router-link  :to="`/${review.user.login}`" class="text-bold link-gray-dark">
                    {{review.user.login}}
                </router-link>
                {{statusAction}}
                <span class="no-wrap">{{createdAt}}</span>
            </WhoDidWhat>
        </Inner>

        <Body class="bubble " v-if="extraDataHolder.bodyHTML" style="padding:15px;margin-top:15px">
            <BodyHTML v-html="extraDataHolder.bodyHTML"  class="markdown-body p-0" style="font-size:15px">

            </BodyHTML>

             <Reaction      v-if="(extraDataHolder.viewerCanReact || withReaction)" 
                            :data="reactionStatistic" 
                            :disabled="!extraDataHolder.viewerCanReact"></Reaction>

        </Body>

        <LoadingWrapper v-if="extraDataHolder.bodyHTML === undefined" class="loading-wrapper flex flex-justify-center flex-items-center">
            <LoadingIconEx/>
        </LoadingWrapper>

        <transition-group name="fade" appear>
            <ReviewComment v-for="item in comments.data" :key="item.id" :reviewComment="item"/>
        </transition-group>
        

        <HiddenItemLoading v-if="comments.pageInfo.hasNextPage" style="padding-bottom:0px!important" :loading="comments.loading" :dataGetter="network_getComment">
            {{comments.totalCount - comments.data.length}} {{comments.totalCount - comments.data.length > 1 ? 'comments' : 'comment'}} remained.
        </HiddenItemLoading>
      
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {LoadingIconEx,AnimatedHeightWrapper,Popover} from '@/components'
    import {util_dateFormat} from '@/util'
    import Reaction from './Reaction'
    import ReviewComment from './ReviewComment'
    import HiddenItemLoading from './HiddenItemLoading'
    import * as graphql from '../graphql'
import { authRequiredGitHubGraphqlApiQuery } from '../../../../../store/modules/network'
    export default {
        inject: ['commentsAndReviewsExtraGraphqlDataGetter'],
        props: {
            review: {
                type: Object,
                required: true
            },
        },
        data() {
            return {
                comments:{
                    data: [],
                    pageInfo: {

                    },
                    totalCount: 0,
                    perPage: 5,
                    loading: false
                },
            }
        },
        computed: {
            createdAt() {
                return util_dateFormat.getDateDiff(this.review.submitted_at)
            },
            extraDataHolder() {
                let extraDataHolder = this.commentsAndReviewsExtraGraphqlDataGetter().filter(item => {
                    return item.id === this.review.node_id
                })[0] || {}
                if(extraDataHolder.bodyHTML) {
                    let pattern = /href="https:\/\/github\.com\/(\S+)"/g
                    let execResult
                    while((execResult = pattern.exec(extraDataHolder.bodyHTML)) !== null) {
                        extraDataHolder.bodyHTML = extraDataHolder.bodyHTML.replace(execResult[0],`href="/${execResult[1]}"`)
                    }
                }
                return extraDataHolder
            },
            reactionStatistic() {
                let reactionStatistic
                for(let key in this.extraDataHolder) {
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
                            reactionStatistic[key] = this.extraDataHolder[key].totalCount
                            break
                        default:
                    }
                }
                return reactionStatistic 
            },
            statusAction() {
                let status = 'approved'
                switch(this.review.state) {
                    case 'changes_requested':
                        status = 'request changes'
                        break
                    case 'commented':
                        status = 'commented'
                        break
                    default:
                }
                return status
            }
        },
        created() {
            this.network_getComment()
        },
        methods: {
            async network_getComment() {
                try{
                    this.comments.loading = true

                    let graphql_reviewComments = graphql.GRAPHQL_PR_REVIEW_COMMENTS({
                        nodeId: this.review.node_id,
                        after: this.comments.pageInfo.hasNextPage ? this.comments.pageInfo.endCursor : undefined,
                        perPage: this.comments.perPage
                    })

                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_reviewComments)
                    this.comments.data =  this.comments.data.concat(res.data.data.node.comments.nodes)
                    this.comments.pageInfo = res.data.data.node.comments.pageInfo
                    this.comments.totalCount = res.data.data.node.comments.totalCount

                    this.comments.loading = false
                }catch(e) {
                    this.comments.loading = false
                    console.log(e)
                }
            }
        },
        components: {
            LoadingIconEx,
            AnimatedHeightWrapper,
            Popover,
            Reaction,
            ReviewComment,
            HiddenItemLoading,
            Container: styled.div``,
            Inner: styled.div``,
            WhoDidWhat: styled.div``,
            Body: styled.div``,
            BodyHTML: styled.div``,
            LoadingWrapper: styled.div``,
        }
    }
</script>

<style>
.pr-simple-timeline-icon-wrapper{
    position: absolute;
    top: 1px;
    left: 1px;
    margin-right: 10px;
    color: #959da5;
}
</style>

<style scoped lang="scss">
.container{
    padding: 15px;
    font-size: 13px;
    color: #586069;
}

.body {
    min-width: 0;
    max-width: 100%;
    margin-top: 4px;
    color: #444d56;
    flex: auto;
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