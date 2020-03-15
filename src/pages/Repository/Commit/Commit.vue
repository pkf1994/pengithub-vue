<template>
    <Container class="px-3 pt-3 bg-white">
        <AnimatedHeightWrapper>
            <BasicInfo v-if="data.node_id && extraData.data.id" class="basic-info mt-0 px-2 pt-2">
                <router-link  to="/" class="float-right btn-outline btn" >
                    Browse files
                </router-link>
                <Status class="mr-1 mt-1 float-left">
                    <svg v-if="extraData.data.status && extraData.data.status.state === 'SUCCESS'" class="octicon octicon-check v-align-middle text-green" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                    <svg v-else-if="extraData.data.status && extraData.data.status.state === 'FAILURE'" class="octicon octicon-x v-align-middle text-red" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
                </Status>
                <p class="title" v-if="extraData.data.messageHeadlineHTML" v-html="extraData.data.messageHeadlineHTML">
                </p>   
                <p class="desc" v-if="extraData.data.messageBodyHTML" v-html="extraData.data.messageBodyHTML">
                </p>
                <Branches class="branches">
                    <!-- associated pulls -->
                    <svg class="octicon octicon-git-branch" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 5c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v.3c-.02.52-.23.98-.63 1.38-.4.4-.86.61-1.38.63-.83.02-1.48.16-2 .45V4.72a1.993 1.993 0 00-1-3.72C.88 1 0 1.89 0 3a2 2 0 001 1.72v6.56c-.59.35-1 .99-1 1.72 0 1.11.89 2 2 2 1.11 0 2-.89 2-2 0-.53-.2-1-.53-1.36.09-.06.48-.41.59-.47.25-.11.56-.17.94-.17 1.05-.05 1.95-.45 2.75-1.25S8.95 7.77 9 6.73h-.02C9.59 6.37 10 5.73 10 5zM2 1.8c.66 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm0 12.41c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm6-8c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                    <span class="associated-pulls">
                        <span class="text-bold">{{associatedPulls[0] && associatedPulls[0].baseRef.name}}</span>
                        (<span v-for="(item,index) in associatedPulls" :key="item.id">
                            <router-link :to="item.resourcePath" class="text-gray">#{{item.number}}</router-link><span v-if="index < associatedPulls.length -1">,&nbsp;</span>
                        </span>)
                    </span>
                    

                    <!-- tag info -->
                    <svg class="octicon octicon-tag" v-if="tags.length > 0" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path></svg>
                    <span class="tag-info">
                        <router-link v-for="(item,index) in tags" :key="item" :to="`${owner()}/${repo()}/releases/tag/${item}`" :class="{'text-bold':index === 0}" class="text-gray mr-2">{{item}}</router-link>
                    </span>
                </Branches>

                <Meta class="meta p-2 d-flex flex-wrap">
                    <img class="avatar flex-self-start mr-1" height="20" width="20" :alt="`@${data.committer && data.committer.login}`" :src="data.committer && data.committer.avatar_url">
                    <WhoDidWhat class="flex-self-start no-wrap mr-md-4 mr-0">
                        <router-link  class="user-mention" :to="`/${data.committer && data.committer.login}`">{{data.committer && data.committer.login}}</router-link>
                        <span>committed on {{committedAt}}</span>
                    </WhoDidWhat>
                    <ParentInfo class="flex-auto no-wrap text-left overflow-x-auto">
                        <span class="sha-block ml-0" >
                            {{data.parents && data.parents.length}} parent
                            <span  v-for="(item,index) in data.parents" :key="item.sha">
                                <router-link class="sha" :to="item.url.replace('https://api.github.com/repos','')">{{item.sha.slice(0,7)}}</router-link>
                                <span v-if="index < ((data.parents || []).length - 1)">+&nbsp;</span>
                            </span> 

                            <span style="margin-left:16px">
                                commit {{data.sha}}
                            </span>   
                        </span>
                    </ParentInfo>
                </Meta>
            </BasicInfo>
        </AnimatedHeightWrapper>
        
        <AnimatedHeightWrapper class="my-3">
            <DiffStatus v-if="extraData.data.id && data.node_id">
                <DiffStyleBtn class="float-right ml-2 BtnGroup">
                    <router-link :to="`${$route.path}`" class="btn btn-sm BtnGroup-item" :class="{selected:viewStyle == 'unified'}"> 
                        Unified
                    </router-link>
                    <router-link :to="`${$route.path}?diff=split`" class="btn btn-sm BtnGroup-item" :class="{selected:viewStyle == 'split'}">
                        Split
                    </router-link>
                </DiffStyleBtn>

                <div class="diff-status">
                    <svg class="octicon octicon-diff" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6 7h2v1H6v2H5V8H3V7h2V5h1v2zm-3 6h5v-1H3v1zM7.5 2L11 5.5V15c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h6.5zM10 6L7 3H1v12h9V6zM8.5 0H3v1h5l4 4v8h1V4.5L8.5 0z"></path></svg>
                    Showing 
                    <button class="btn-link">
                        {{data.files && data.files.length}} changed {{(data.files && data.files.length) > 1 ? 'files' : 'file'}}
                    </button>
                    with 
                    <strong>{{additions}} additions</strong>
                    and
                    <strong>{{deletions}} deletions</strong>.
                </div>

            </DiffStatus>
        </AnimatedHeightWrapper>

        <div v-if="showDiff">
            <transition-group appear name="fade">
                <Diff v-for="item in data.files || []" :key="item.raw_url" :file="item" :viewStyle="viewStyle"></Diff>
            </transition-group>
        </div>     


        <h4 v-if="showDiff">
            {{comments.totalCount}} {{comments.totalCount > 1 ? 'comments' : 'comment'}} on commit <code class="commit-sha">{{data.sha && data.sha.substring(0,7)}}</code> 
        </h4>

        <AnimatedHeightWrapper :stretch="comments.loading && (comments.data.length === 0)">
            <div style="height:200px" class="flex flex-items-center flex-justify-center">
                <LoadingIconEx/>
            </div> 
        </AnimatedHeightWrapper>   

        <CommentWrapper v-for="item in comments.data" :key="item.id" class="comment-wrapper py-3 relative">
            <Comment :data="item">

            </Comment>
        </CommentWrapper>

        <HiddenItemLoading v-if="(comments.pageInfo) && (comments.pageInfo.next) && (comments.pageInfo.next.page < comments.pageInfo.last.page - 1) && (comments.data.length !== 0)"
                            :loading="comments.loading"
                            :dataGetter="network_getComments">
            {{comments.totalCount - comments.data.length - comments.latestData.data.length}}
        </HiddenItemLoading>

        <CommentWrapper v-for="item in comments.latestData.data" :key="item.id" class="comment-wrapper py-3 relative">
            <Comment :data="item">

            </Comment>
        </CommentWrapper>

         <Editor v-if="showDiff" 
                class="pt-3 mb-5" 
                style="border-top: 2px solid #e1e4e8;" 
                :locked="viewerCannotComment" 
                :lockedReason="extraData.data.activeLockReason"></Editor>


  
        <transition name="fade" appear>
            <CommonLoading v-if="loading || extraData.loading || !showDiff || comments.loading"
                            :position="(loading  || extraData.loading) ? 'center' : 'corner'"
                            :preventClickEvent="false"/>
        </transition>  
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {CommonLoading,AnimatedHeightWrapper,LoadingIconEx,HiddenItemLoading,Editor} from '@/components'
    import {Diff,Comment} from './components'
    import { cancelAndUpdateAxiosCancelTokenSource,authRequiredGet,authRequiredGitHubGraphqlApiQuery } from '@/network'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import {util_dateFormat} from '@/util'
    export default {
        name: 'commit_page',
        mixins: [RouteUpdateAwareMixin],
        inject: ['owner','repo'],
        provide() {
            return {
                commit: () => Object.assign({},this.data,this.extraData.data)
            }
        },
        data() {
            return {
                data: {},
                loading: false,
                associatedPulls: [],
                extraData: {
                    data: {},
                    loading: false
                },
                comments: {
                    data: [],
                    loading: false,
                    latestData: {
                        data: [],
                        loading: false
                    },
                    perPage: 10,
                    reactionStatistic: {},
                    pageInfo: {},
                    totalCount: 0
                },
                showDiff: false
            }
        },
        computed: {
            sha() {
                return this.$route.params.sha
            },
            message() {
                return this.data.commit && this.data.commit.message.split('\n\n')[0]
            },
            description() {
                return this.data.commit && this.data.commit.message.split('\n\n')[1]
            },
            tags() {
                if(!this.extraData.data.repository || !this.data.commit) return []
                let tags = []
                this.extraData.data.repository.refs.nodes.forEach(item => {
                    if(Date.parse(new Date(this.data.commit.committer.date)) < Date.parse(new Date(item.target.committedDate))) {
                        tags.push(item.name)
                    }
                })
                return tags.reverse()
            },
            committedAt() {
                if(!this.data.commit) return
                let formatStr
                if((new Date()).getFullYear() === new Date(this.data.commit.committer.date).getFullYear()) {
                    formatStr = 'd zzz'
                }else {
                    formatStr = 'd zzz yyyy'
                }
                return util_dateFormat.dateFormat(formatStr,this.data.commit.committer.date)
            },
            additions() {
                if(!this.data.files) return 0
                let additions = 0
                this.data.files.forEach(item => {
                    additions += item.additions
                })
                return additions
            },
            deletions() {
                if(!this.data.files) return 0
                let deletions = 0
                this.data.files.forEach(item => {
                    deletions += item.deletions
                })
                return deletions
            },
            viewStyle() {
                return this.$route.query.diff || 'unified'
            },
            viewerCannotComment() {
                return this.data.locked && !this.data.viewerCanUpdate
            },
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name)
                    this.cancelSources.push(sourceAndCancelToken.source)

                    let url = api.API_COMMIT({
                        owner: this.owner(),
                        repo: this.repo(),
                        sha: this.sha,
                    })

                    let res = await authRequiredGet(url,{cancelToken:sourceAndCancelToken.cancelToken})
                    //let res_ = await authRequiredGet(url,{cancelToken:sourceAndCancelToken.cancelToken,headers:{"Accept":"application/vnd.github.VERSION.html"}})
                    //console.log(res.data)
                    this.data = res.data

                    this.network_getExtraData()

                    this.loading = false
                }catch(e) {
                    this.loading = false
                    console.log(e)
                }
            },
            async network_getExtraData() {
                try{
                    this.extraData.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name + ' get_extra_data')
                    this.cancelSources.push(sourceAndCancelToken.source)

                    let graphql_extraData = graphql.GRAPHQL_COMMIT_EXTRA_DATA({nodeId:this.data.node_id})

                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_extraData,{cancelToken:sourceAndCancelToken.cancelToken})
                    this.extraData.data = res.data.data.node
                    this.associatedPulls = res.data.data.node.associatedPullRequests.nodes

                    this.network_getComments()

                    setTimeout(() => {
                        this.showDiff = true
                    },400)
                    
                    this.extraData.loading = false
                }catch(e) {
                    this.extraData.loading = false
                    console.log(e)
                }
            },
            async network_getComments() {
                try{
                    this.comments.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name + ' get_comments')
                    this.cancelSources.push(sourceAndCancelToken.source)

                    let graphql_comments = graphql.GRAPHQL_COMMIT_COMMENTS(
                        {
                            nodeId: this.data.node_id,
                            after: this.comments.pageInfo.endCursor,
                            perPage: this.comments.perPage
                        }
                    )

                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_comments,{cancelToken:sourceAndCancelToken.cancelToken})

                    //尝试获取末端数据
                    if(this.comments.data.length == 0) {
                        if(res.data.data.node.comments.totalCount > this.comments.perPage) {
                            let itemCountRemained = res.data.data.node.comments.totalCount - this.comments.perPage
                            let lastPageScale = itemCountRemained > this.comments.perPage ? this.comments.perPage : itemCountRemained

                            let graphql_commentsLatest = graphql.GRAPHQL_COMMIT_COMMENTS(
                                {
                                    nodeId: this.data.node_id,
                                    perPage: lastPageScale,
                                    forward: false
                                }
                            )

                            let res_commentsLatest = await authRequiredGitHubGraphqlApiQuery(graphql_commentsLatest,{cancelToken:sourceAndCancelToken.cancelToken})
                            this.comments.latestData.data = res_commentsLatest.data.data.node.comments.nodes
                        }
                    }

                    this.comments.data = this.comments.data.concat(res.data.data.node.comments.nodes)
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
            CommonLoading,
            AnimatedHeightWrapper,
            Diff,
            Comment,
            LoadingIconEx,
            HiddenItemLoading,
            Editor,
            Container: styled.div``,
            BasicInfo: styled.div``,
            Status: styled.span``,
            Title: styled.div``,
            Branches: styled.div``,
            Meta: styled.div``,
            Avatar: styled.div``,
            WhoDidWhat: styled.div``,
            ParentInfo: styled.div``,
            DiffStatus: styled.div``,
            DiffStyleBtn: styled.div``,
            CommentWrapper: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
.basic-info{
    padding: 8px 8px 0;
    margin: 10px 0;
    font-size: 14px;
    background: #eaf5ff;
    border: 1px solid rgba(27,31,35,.15);
    border-radius: 3px;
    a{
        background-color: initial;
        border-color: rgba(27,31,35,.15);
    }
    .title{
        margin: 0 0 8px;
        font-size: 18px;
        font-weight: 600;
        color: #05264c;
    }
    .desc{
        padding-bottom: 10px;
        max-width: 100%;
        overflow: visible;
        font-size: 13px;
        word-wrap: break-word;
        line-height: 1.45;
        color: #444d56;
        font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
        border-bottom: 1px solid rgba(27,31,35,.15);
    }
    .branches{
        min-height: 18px;
        margin-bottom: 8px;
        font-size: 12px;
        color: #6a737d;
        .associated-pulls,.tag-info{
            display: inline;
            margin-right: 10px;
            margin-left: 2px;
            vertical-align: middle;
            list-style: none;
        }
    }
    .meta{
        margin-right: -8px;
        margin-left: -8px;
        background: #fff;
        border-top: 1px solid rgba(27,31,35,.15);
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
        .user-mention {
            font-weight: 600;
            color: #24292e;
            white-space: nowrap;
        }
    }
}

.sha-block{
    font-size: 12px;
    line-height: 24px;
    color: #586069;
    font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    .sha{
        color: #444d56;
        border-bottom: 1px dotted #c6cbd1;
    }
}

.diff-status{
    padding-left: 20px;
    line-height: 26px;
    svg{
        float: left;
        margin-top: 3px;
        margin-left: -20px;
        color: #c6cbd1;
    }
    button{
        font-weight: 600;
        outline: none;
        box-shadow: none;
    }
}

.commit-sha{
    padding: .2em .4em;
    font-size: 90%;
    font-weight: 400;
    background-color: #f6f8fa;
    border: 1px solid #eaecef;
    border-radius: .2em;
    font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
}

.comment-wrapper:before {
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