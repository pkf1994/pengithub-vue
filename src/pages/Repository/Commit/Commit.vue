<template>
    <CommonLoadingWrapper class="px-3 bg-white" :loading="loading || extraData.loading || comments.loading" :position="(loading  || extraData.loading) ? 'center' : 'corner'">
        <BasicInfo class="basic-info mt-0 px-2 pt-2">
            
            <Skeleton v-if="!data.node_id">
                <SkeletonRectangle :height="16"></SkeletonRectangle>
                <SkeletonRectangle :height="16" class="mt-3" style="width:55%"></SkeletonRectangle>
                <SkeletonRectangle :height="14" class="mt-3 mb-2" style="width:40%"></SkeletonRectangle>
            </Skeleton>
            <div v-else style="min-height:40px">
                <router-link v-if="browseFilesRouterLink" :to="browseFilesRouterLink" class="float-right btn-outline btn bg-white" >
                    Browse files
                </router-link>
                    

                <p class="title">
                    <CommitStatusIcon :sha="sha"></CommitStatusIcon>
                    {{messageHeadline}}
                </p> 

                <p class="desc" style="margin-top:10px;" v-if="messageBody">
                    {{messageBody}}
                </p>

                <div v-if="messageBody && (associatedRefs.branch.name || associatedRefs.tags.length > 0)" class="divider width-full my-2 border-top"></div>

                <Branches class="branches">
                    <!-- associated pulls -->
                    <svg v-if="associatedRefs.branch.name" class="octicon octicon-git-branch v-align-middle" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 5c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v.3c-.02.52-.23.98-.63 1.38-.4.4-.86.61-1.38.63-.83.02-1.48.16-2 .45V4.72a1.993 1.993 0 00-1-3.72C.88 1 0 1.89 0 3a2 2 0 001 1.72v6.56c-.59.35-1 .99-1 1.72 0 1.11.89 2 2 2 1.11 0 2-.89 2-2 0-.53-.2-1-.53-1.36.09-.06.48-.41.59-.47.25-.11.56-.17.94-.17 1.05-.05 1.95-.45 2.75-1.25S8.95 7.77 9 6.73h-.02C9.59 6.37 10 5.73 10 5zM2 1.8c.66 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm0 12.41c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm6-8c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                    <span v-if="associatedRefs.branch.name" class="associated-pulls  v-align-middle">
                        <span class="text-bold">{{associatedRefs.branch.name}}</span>
                        <span v-if="associatedRefs.pullRequest.number">
                            (<router-link :to="`/${owner}/${repo}/pulls/${associatedRefs.pullRequest.number}`" class="text-gray">#{{associatedRefs.pullRequest.number}}</router-link>)
                        </span>
                    </span>

                    <!-- tag info -->
                    <svg class="octicon octicon-tag" v-if="associatedRefs.tags.length > 0" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path></svg>
                    <span class="tag-info" v-if="tags.length > 0" >
                        <router-link v-for="(item,index) in associatedRefs.tags" :key="item.name" :to="item.routerLink" :class="{'text-bold':index === 0}" class="text-gray mr-2">{{item.name}}</router-link>
                    </span>
                </Branches>

            </div>

            

            <Meta class="meta p-2">

                <Skeleton class="width-full" v-if="!data.node_id">
                    <div class="d-flex flex-items-center">
                        <SkeletonCircle :diameter="20" class="mr-2"> 
                        </SkeletonCircle>
                        <SkeletonRectangle :height="14" class="flex-grow-1"></SkeletonRectangle>
                    </div>
                    <SkeletonRectangle :height="12" class="mb-2" style="margin-top:5px"></SkeletonRectangle>
                </Skeleton>

                <div v-else class="d-flex flex-wrap">
                    <WhoDidWhat class="flex-self-start mr-md-4 mr-0">
                        <ImgWrapper class="avatar avatar-user mt-1" v-if="data.author && data.author.login">
                            <img class="avatar avatar-user v-align-bottom" height="20" width="20" :alt="`@${data.author && data.author.login}`" :src="data.author && data.author.avatar_url">
                        </ImgWrapper>  
                        <router-link class="user-mention no-wrap " :to="`/${data.author && data.author.login}`">{{data.author && data.author.login}}</router-link>
                        <span class="no-wrap ">committed on {{committedAt}}</span>
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
                </div>
                
            </Meta>
        
        </BasicInfo>
    
        <AnimatedHeightWrapper class="my-3">
            <DiffStatus v-if="data.node_id">
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
                        {{data.files && data.files.length | thousands}} changed {{(data.files && data.files.length) > 1 ? 'files' : 'file'}}
                    </button>
                    with 
                    <strong>{{additions | thousands}} additions</strong>
                    and
                    <strong>{{deletions | thousands}} deletions</strong>.
                </div>

            </DiffStatus>
        </AnimatedHeightWrapper>

        <div>
            <transition-group appear name="fade">
                <Diff v-for="item in data.files || []" :key="item.raw_url" :file="item" :viewStyle="viewStyle" v-slot="slotProps">
                    
                </Diff>
            </transition-group>
        </div>     


        <h4 v-if="data.commit">
            {{data.commit.comment_count}} {{data.commit.comment_count > 1 ? 'comments' : 'comment'}} on commit <code class="commit-sha">{{data.sha && data.sha.substring(0,7)}}</code> 
        </h4>

        <AnimatedHeightWrapper :stretch="comments.loading && (comments.data.length === 0)">
            <div style="height:200px" class="d-flex flex-items-center flex-justify-center">
                <LoadingIconEx/>
            </div> 
        </AnimatedHeightWrapper>   

    <!--     <CommentWrapper v-for="item in comments.data" :key="item.id" class="comment-wrapper py-3 position-relative">
            <Comment :data="item">

            </Comment>
        </CommentWrapper>

        <HiddenItemLoading v-if="(comments.pageInfo) && (comments.pageInfo.hasNextPage) && (comments.totalCount - comments.data.length - comments.latestData.data.length > 0)"
                            :loading="comments.loading"
                            :dataGetter="network_getComments">
            {{comments.totalCount - comments.data.length - comments.latestData.data.length}}
        </HiddenItemLoading>

        <CommentWrapper v-for="item in comments.latestData.data" :key="item.id" class="comment-wrapper py-3 position-relative">
            <Comment :data="item">

            </Comment>
        </CommentWrapper> -->

        <Editor v-if="accessToken && firstLoadFlag" 
                ref="editor"
                uniqueId="commit_comment_creator"
                class="pt-3 mb-5" 
                :withGidelines="false"
                :locked="viewerCannotComment" 
                :lockedReason="extraData.data.activeLockReason">
            <button class="btn btn-primary ml-1" :disabled="$refs.editor && $refs.editor.markdownRaw === ''">
                <span class="">Comment on this commit</span>
            </button>        
        </Editor>

        <SignInToComment class="my-3" v-else-if="firstLoadFlag">
            Please 
            <span @click="() => signIn()" style="color: #0366d6;">sign in</span>
            to view or add comment.
        </SignInToComment>

        <Subscription v-if="accessToken && firstLoadFlag" class="pb-3" :viewerSubscription="extraData.data.viewerSubscription">
        </Subscription>

    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {CommonLoading,AnimatedHeightWrapper,LoadingIconEx,HiddenItemLoading,Editor,Subscription,ImgWrapper,CommonLoadingWrapper,SkeletonCircle,SkeletonRectangle} from '@/components'
    import Comment from './Comment'
    import {Diff,CommitStatusIcon} from '../components'
    import { authRequiredGet,authRequiredGitHubGraphqlApiQuery,commonGet } from '@/network'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import {util_dateFormat} from '@/util'
    const parse = require('parse-link-header')
    export default {
        name: 'commit_page',
        mixins: [RouteUpdateAwareMixin],
        provide() {
            return {
                commit: () => Object.assign({},this.data,this.extraData.data),
                
            }
        },
        data() {
            return {
                data: {},
                loading: false,
                associatedPulls: [],
                associatedRefs: {
                    branch: {},
                    tags: [],
                    pullRequest: {},
                    loading: false
                },
                associatedPulls: {
                    data: [],
                    loading: false
                },
                extraData: {
                    data: {},
                    loading: false
                },
                comments: {
                    data: [],
                    loading: false,
                },
                firstLoadFlag: false,
            }
        },
        computed: {
            sha() {
                return this.$route.params.sha
            },
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            messageHeadline() {
                return this.data.commit && this.data.commit.message.split('\n\n')[0]
            },
            messageBody() {
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
            browseFilesRouterLink() {
                return this.data.sha && `/${this.owner}/${this.repo}/tree/${this.data.sha}`
            },
            committedByAuthor() {
                if(!this.data.author.login) return 
                if(!this.data.committer.login) return 
                return this.data.author.login == this.data.committer.login
            },
            documentTitle() {
                return this.messageHeadline
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                this.network_getBasicData()
                this.network_getAssociatedBranchAndTags()
            },
            async network_getBasicData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.name)

                    let url = api.API_COMMIT({
                        owner: this.owner,
                        repo: this.repo,
                        sha: this.sha,
                    })

                    let res = await authRequiredGet(url,{cancelToken})
                    //let res_ = await authRequiredGet(url,{cancelToken:sourceAndCancelToken.cancelToken,headers:{"Accept":"application/vnd.github.VERSION.html"}})
                    //console.log(res.data)
                    this.data = res.data

                    this.network_getComments()

                    if(this.accessToken) this.network_getExtraData()

                    this.firstLoadFlag = true

                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            async network_getAssociatedBranchAndTags() {
                try {
                    this.associatedRefs.loading = true
                    let url = api.API_PROXY_COMMIT_ASSOCIATED_REFS({
                        repo: this.repo,
                        owner: this.owner,
                        sha: this.sha
                    })

                    let res = await commonGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_associated_refs')
                        }
                    )

                    this.parseAssociatedRefs(res.data)
                } catch (e) {
                    console.log(e)
                }finally{
                    this.associatedRefs.loading = false
                }
            },
            async network_getExtraData() {
                try{
                    this.extraData.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.name + ' get_extra_data')

                    let graphql_extraData = graphql.GRAPHQL_COMMIT_EXTRA_DATA({nodeId:this.data.node_id})

                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_extraData,{cancelToken})
                    try{
                        this.extraData.data = res.data.data.node
                        this.associatedPulls = res.data.data.node.associatedPullRequests.nodes
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                   
                    if(this.accessToken) this.network_getComments()
                  
                }catch(e) {
                    console.log(e)
                }finally{
                    this.extraData.loading = false
                }
            },
            async network_getComments() {
                try{
                    this.comments.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.name + ' get_comments')

                    let pageInfo

                    let comments = []

                    while((!pageInfo || pageInfo.next) && comments.length <= 300) {
                        let url
                        if(pageInfo && pageInfo.next) url = pageInfo.next.url
                        if(!url) url = api.API_COMMIT_COMMENTS({
                            params: {
                                per_page: 100
                            },
                            repo: this.repo,
                            owner: this.owner,
                            sha: this.sha
                        })
                        let res = await authRequiredGet(url,{cancelToken})
                        pageInfo = parse(res.headers.link) || {}
                        comments = comments.concat(res.data)
                    }

                    this.comments.data = comments
                    
                }catch(e) {
                    console.log(e)
                }finally{
                    this.comments.loading = false
                }
            },
            parseAssociatedRefs(HTML) {
                let branchPattern = /<li class="branch"><a href="(.*?)">(.*?)<\/a><\/li>/g
                let branchExecResult
                if((branchExecResult = branchPattern.exec(HTML)) != null) {
                    this.associatedRefs.branch.routerLink = branchExecResult[1]
                    this.associatedRefs.branch.name = branchExecResult[2]
                }

                let pullRequestPattern = /\(<a[^>]*>#(.*)<\/a>\)/g
                let pullRequestExecResult
                if((pullRequestExecResult = pullRequestPattern.exec(HTML)) != null) {
                    this.associatedRefs.pullRequest.number = pullRequestExecResult[1]
                }

                let tagsParagraphPattern = /<ul class="branches-tag-list js-details-container">((?:.|\r|\n)*?)<\/ul>/g
                let tagsParagraphPatternExecResult = tagsParagraphPattern.exec(HTML)
                let tagsParagraph = tagsParagraphPatternExecResult && tagsParagraphPatternExecResult[1]

                if(tagsParagraph) {
                    let tagPattern = /<li[^>]*><a href="(.*?)">(.*?)<\/a><\/li>/g
                    let tagExecResult
                    let tags = []
                    while((tagExecResult = tagPattern.exec(tagsParagraph)) != null) {
                        tags.push({
                            routerLink: tagExecResult[1],
                            name: tagExecResult[2]
                        })
                    }
                    this.associatedRefs.tags = tags
                }

            }
        },
        components: {
            CommonLoading,
            CommonLoadingWrapper,
            AnimatedHeightWrapper,
            Diff,
            CommitStatusIcon,
            ImgWrapper,
            Comment,
            LoadingIconEx,
            HiddenItemLoading,
            Editor,
            Subscription,
            SkeletonCircle,
            SkeletonRectangle,
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
            SignInToComment: styled.div``,
            Skeleton: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
.basic-info{
    padding: 8px 8px 0;
    margin: 10px 0;
    font-size: 14px;
    background: rgb(241, 248, 255);
    border: 1px solid rgba(27,31,35,.15);
    border-radius: 6px;
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
        max-width: 100%;
        overflow: visible;
        font-size: 13px;
        word-wrap: break-word;
        line-height: 1.45;
        color: #444d56;
        font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    }
    .branches{
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
        border-bottom-right-radius: 6px;
        border-bottom-left-radius: 6px;
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