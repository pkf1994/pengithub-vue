<template>
    <Container class="p-3 relative container">

        <LoadingWrapper v-if="data.length == 0" class="loading-wrapper flex flex-justify-center flex-items-center">
            <LoadingIconEx/>
        </LoadingWrapper>

        
        <Main class="main">
             <Header class="header">
                commented on <code>
                    <router-link :to="commitRouteLink">{{commitComment.commit_id.substring(0,7)}}</router-link>  
                </code>
            </Header>

            <transition-group name="fade" appear>
                <CommitCommentItem v-for="item in data" :key="item.id" :data="item" style="border:none"/>
            </transition-group>
        </Main>

       
        <HiddenItemLoading v-if="pageInfo.hasNextPage" style="padding-bottom:0px!important" :loading="loading" :dataGetter="network_getData">
            {{totalCount - data.length}} commit {{totalCount - data.length > 1 ? 'comments' : 'comment'}} remained
        </HiddenItemLoading>
      
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {LoadingIconEx,AnimatedHeightWrapper,Popover} from '@/components'
    import {util_dateFormat} from '@/util'
    import HiddenItemLoading from '../HiddenItemLoading'
    import * as graphql from './graphql'
    import CommitCommentItem from './CommitCommentItem'
    import { authRequiredGitHubGraphqlApiQuery } from '@/network'
    export default {
        props: {
            commitComment: {
                type: Object,
                required: true
            },
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
                if(!this.data.submitted_at) return 'before long'
                return util_dateFormat.getDateDiff(this.data.submitted_at)
            },
            statusAction() {
                let status = 'approved'
                switch(this.data.state) {
                    case 'changes_requested':
                        status = 'request changes'
                        break
                    case 'commented':
                        status = 'commented'
                        break
                    case 'pending':
                        status = 'start a review'
                    default:
                }
                return status
            },
            commitRouteLink() {
                let routeLink = this.commitComment.comments[0].html_url.replace('https://github.com','').replace(/#.*$/g,'')
                return routeLink
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true

                    let graphql_comments = graphql.GRAPHQL_COMMIT_COMMENTS({
                        nodeId: this.commitComment.node_id,
                        after: this.pageInfo.hasNextPage ? this.pageInfo.endCursor : undefined,
                        perPage: this.perPage
                    })

                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_comments)
                    this.data =  this.data.concat(res.data.data.node.comments.nodes)
                    this.pageInfo = res.data.data.node.comments.pageInfo
                    this.totalCount = res.data.data.node.comments.totalCount

                    this.loading = false
                }catch(e) {
                    this.loading = false
                    console.log(e)
                }
            }
        },
        components: {
            LoadingIconEx,
            AnimatedHeightWrapper,
            CommitCommentItem,
            HiddenItemLoading,
            Container: styled.div``,
            LoadingWrapper: styled.div``,
            Main: styled.div``,
            Header: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
.container{
    padding: 15px;
    font-size: 13px;
    color: #586069;
}

.main{
    border: 1px solid #d1d5da;
    border-radius: 3px;
}

.header{
    position: relative;
    padding: 7.5px 15px;
    font-size: 12px;
    color: #586069;
    border-bottom: 1px solid #dfe2e5;
}

.header:before {
    bottom: -8px;
    left: 15px;
    z-index: 10;
    border-top: 8px solid #dfe2e5;
    border-right: 8px solid transparent;
    border-left: 8px solid transparent;
    position: absolute;
    width: 0;
    height: 0;
    content: "",
}

.header:after {
    bottom: -7px;
    left: 16px;
    z-index: 20;
    border-top: 7px solid #fff;
    border-right: 7px solid transparent;
    border-left: 7px solid transparent;
    position: absolute;
    width: 0;
    height: 0;
    content: "";
}

.loading-wrapper{
    height: 120px;
}

</style>