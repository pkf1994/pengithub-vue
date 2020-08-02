<template>
    <Container class="p-3 relative container">
        <Inner class="d-flex position-relative pl-4">

            <div class="pr-simple-timeline-icon-wrapper">
                <svg class="octicon octicon-eye" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"></path></svg>
            </div>
           
            <WhoDidWhat>
                <router-link :to="`/${propsData.user.login}`" class="d-inline-block">
                    <ImgWrapper class="avatar mr-1">
                        <img :src="propsData.user.avatar_url" :alt="`@${propsData.user.login}`" class="avatar mr-1" height="16" width="16">
                    </ImgWrapper>
                </router-link>
                <router-link  :to="`/${propsData.user.login}`" class="text-bold link-gray-dark">
                    {{propsData.user.login}}
                </router-link>
                {{statusAction}}
                <span class="no-wrap">{{createdAt}}</span>
            </WhoDidWhat>

            <Label class="ml-1 no-wrap" :name="propsData.state" :color="propsData.state == 'pending' ? '#fffbdd' : '#ffffff'" style="font-size: 10px;color:#735c0f" ></Label>
        </Inner>

        <Body class="bubble mt-3" v-if="extraData.bodyHTML" style="padding:15px;">
            <BodyHTML v-html="extraData.bodyHTML"  class="markdown-body p-0" style="font-size:15px">

            </BodyHTML>

            <Reaction      v-if="(extraData.viewerCanReact || withReaction)" 
                            :data="extraData" 
                            :disabled="!extraData.viewerCanReact"></Reaction>

        </Body>
       

        <LoadingWrapper v-if="!extraData.id" class="loading-wrapper d-flex flex-justify-center flex-items-center">
            <LoadingIconEx/>
        </LoadingWrapper>

        <transition-group name="fade" appear>
            <ReviewComment v-for="item in data.filter(i => i.replyTo == null)" :key="item.id" :reviewComment="item"/>
        </transition-group>
        

        <HiddenItemLoading v-if="pageInfo.hasNextPage" style="padding-bottom:0px!important" :loading="loading" :dataGetter="network_getComment">
            {{totalCount - data.length}} {{totalCount - data.length > 1 ? 'comments' : 'comment'}} remained.
        </HiddenItemLoading>
      
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {LoadingIconEx,AnimatedHeightWrapper,Popover,Label,ImgWrapper} from '@/components'
    import {util_dateFormat} from '@/util'
    import Reaction from './Reaction'
    import ReviewComment from './ReviewComment'
    import HiddenItemLoading from './HiddenItemLoading'
    import * as graphql from '../graphql'
    import Comment from './Comment'
    import { authRequiredGitHubGraphqlApiQuery } from '@/network'
    export default {
        mixins: [Comment],
        provide() {
            return {
                reviewProvided: () => this.propsData,
                pendingReviewCommentRepliesProvided: () => this.pendingCommentReplies
            }
        },
        data() {
            return {
                data: [],
                pageInfo: {

                },
                totalCount: 0,
                perPage: 5,
                loading: false
            }
        },
        computed: {
            createdAt() {
                if(!this.propsData.submitted_at) return 'before long'
                return util_dateFormat.getDateDiff(this.propsData.submitted_at)
            },
            statusAction() {
                let status = 'approved'
                switch(this.propsData.state) {
                    case 'changes_requested':
                        status = 'request changes'
                        break
                    case 'commented':
                        status = 'reviewed'
                        break
                    case 'pending':
                        status = 'start a review'
                    default:
                }
                return status
            },
            pendingCommentReplies() {
                return this.data.filter(i => i.replyTo != null)
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            
            async network_getData() {
                try{
                    this.loading = true

                    let graphql_reviewComments

                    if(this.propsData.state == 'pending') {
                        graphql_reviewComments = graphql.GRAPHQL_PR_REVIEW_COMMENTS({
                            nodeId: this.propsData.node_id,
                            after: this.pageInfo.hasNextPage ? this.pageInfo.endCursor : undefined,
                            perPage: 100
                        })
                    }else{
                        graphql_reviewComments = graphql.GRAPHQL_PR_REVIEW_COMMENTS({
                            nodeId: this.propsData.node_id,
                            after: this.pageInfo.hasNextPage ? this.pageInfo.endCursor : undefined,
                            perPage: this.perPage
                        })
                    }

                    
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_reviewComments)
                    //当review的state为pending时，返回的数据中将包含review comment reply
                    let dataHolder
                    try{
                        dataHolder =  res.data.data.node.comments.nodes
                        this.pageInfo = res.data.data.node.comments.pageInfo
                        this.totalCount = res.data.data.node.comments.totalCount
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                    let data_temp = {}
                    dataHolder.forEach(i => {
                        if(!data_temp[i.path]) data_temp[i.path] = []
                        data_temp[i.path].push(i)
                    })
                    let data = []
                    for(let key in data_temp) {
                        data_temp[key].forEach(i => {
                            data.push(i)
                        })
                    }
                    this.data = data
                }catch(e) {
                    console.log(e)
                }finally{
                    this.loading = false
                }
            }
        },
        components: {
            LoadingIconEx,
            AnimatedHeightWrapper,
            Popover,
            ImgWrapper,
            Reaction,
            ReviewComment,
            HiddenItemLoading,
            Label,
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