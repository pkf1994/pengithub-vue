<template>
    <CommonLoadingWrapper :loading="reviewComments.loading || reviewCommentsExtraData.loading || changedFiles.loading" :position="changedFiles.loading ? 'center' : 'corner'">
            <Switcher v-if="changedFiles.data.length > 0" class="switcher ">
                <button class="text-left width-full btn-link text-gray-dark" @click="triggerSwitcherStretch" >
                    <svg data="stretch-icon" v-if="!switcherStretched" class="octicon octicon-chevron-down switcher-icon-open" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6l-5 5z"></path></svg>
                    <svg data="stretch-icon" v-else class="octicon octicon-chevron-up switcher-icon-close" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 10l-1.5 1.5L5 7.75 1.5 11.5 0 10l5-5 5 5z"></path></svg>

                    <svg class="octicon octicon-diff switcher-icon" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6 7h2v1H6v2H5V8H3V7h2V5h1v2zm-3 6h5v-1H3v1zM7.5 2L11 5.5V15c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h6.5zM10 6L7 3H1v12h9V6zM8.5 0H3v1h5l4 4v8h1V4.5L8.5 0z"></path></svg>

                    {{pullRequestProvided().data.changed_files}} changed {{pullRequestProvided().data.changed_files > 1 ? 'files' : 'file'}}
                    <span class="meta text-gray">
                        <span class="text-green">
                            {{pullRequestProvided().data.additions}} {{pullRequestProvided().data.additions > 1 ? 'additions' : 'addition'}}
                        </span>
                        and
                        <span class="text-red">
                            {{pullRequestProvided().data.deletions}} {{pullRequestProvided().data.deletions > 1 ? 'deletions' : 'deletion'}}
                        </span>
                    </span>    
                </button>

                <SwitcherOptions class="switcher-options" v-show="switcherStretched">
                    <a :href="`#diff-${item.sha}`" v-for="item in changedFiles.data" :key="item.sha">
                        <svg :class="{modified:item.status == 'modified',added:item.status == 'added',deleted:item.status == 'deleted'}" class="octicon octicon-diff-modified" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13 1H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zm0 13H1V2h12v12zM4 8c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z"></path></svg>
                        {{item.filename}}
                    </a>
                </SwitcherOptions>
            </Switcher>
        

        <transition-group name="fade-group" appear>
            <ChangedFileItem :id="`diff-${item.sha}`" v-for="item in changedFiles.data" :key="item.sha" :file="item"></ChangedFileItem>
        </transition-group>

        <EditorHeader class="editor-header" v-if="changedFiles.data.length > 0 && repoOwnerType() == 'User'">
            Submit your review
        </EditorHeader>
        <ReviewSubmitter v-if="changedFiles.data.length > 0 && repoOwnerType() == 'User'" @review-submitted.native.stop="reviewSubmittedHook"></ReviewSubmitter>

        <!-- <Editor v-if="changedFiles.data.length > 0" 
                class="m-3"
                ref="editor">
            <button class="btn">
                <span>Cancel review</span>
            </button>
            <button class="btn btn-primary ml-1">
                <span>Submit review</span>
            </button>
        </Editor> -->

    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {CommonLoadingWrapper,AnimatedHeightWrapper,SimpleDiffView} from '@/components'
    import {HiddenItemLoading} from '../components'
    import {ChangedFileItem,ReviewSubmitter} from './components'
    import {authRequiredGitHubGraphqlApiQuery,authRequiredGet } from '@/network'
    import * as api from '@/network/api'
    import {util_dateFormat,util_emoji} from '@/util'
    import * as graphql from '../graphql'
    let parse = require("parse-link-header")
    export default {
        mixins: [RouteUpdateAwareMixin],
        name: 'repository_pull_request_detail_changes_page',
        inject: ['pullRequestProvided','repoOwnerType'],
        provide() {
            return {
                reviewCommentsProvided: () => [...this.reviewComments.data,...this.pendingReview.reviewComments.data],
                reviewCommentsExtraData: () => this.reviewCommentsExtraData.data,
                pendingReviewComments: () => this.pendingReview.reviewComments.data,
                pendingReview: () => this.pendingReview,
                commentReviewCreatedHook: () => this.network_getReviewComments,
                reviewCommentDeletedHook: () => this.network_getReviewComments,
                pendingReviewGetter: () => this.network_getPendingReview,
                reviewCommentCreatedHook: () => this.reviewCommentCreatedHook
            }
        },
        data() {
            return {
                switcherStretched: false,
                pageInfo: {},
                totalCount: 0,
                reviewComments: {
                    data: [],
                    loading: false,
                },
                reviewCommentsExtraData: {
                    data: [],
                    loading: false
                },
                pendingReview: {
                    data: {},
                    emptyFlag: false,
                    loading: false,
                    reviewComments: {
                        data: [],
                        loading: false,
                    }
                },
                changedFiles: {
                    data: [],
                    loading: false
                },
                dirty: false
            }
        },
        computed: {
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            number() {
                return this.$route.params.number
            },
        },
        created() {
            this.network_getData()
        },
        methods: {
            network_getData() {
                this.network_getReviewComments()
                this.network_getChangedFiles()
                this.network_getPendingReview()
            },
            async network_getReviewComments() {
                try{
                    this.reviewComments.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_review_comments')
                    
                    let reviewComments = []
                    let pageInfo
                    while(!pageInfo || (pageInfo && pageInfo.next)) {
                        let url 
                        if(pageInfo) {
                            url = pageInfo.next.url
                        }else {
                            url = api.API_REVIEW_COMMENTS_OF_PULL_REQUEST({
                                repo: this.repo,
                                owner: this.owner,
                                number: this.number,
                                params: {
                                    per_page: 100
                                }
                            })
                        }

                        let res = await authRequiredGet(
                            url,
                            {
                                cancelToken,
                                headers: {
                                    'accept':'application/vnd.github.squirrel-girl-preview'
                                }
                            }
                        )
                        reviewComments = reviewComments.concat(res.data)
                        pageInfo = parse(res.headers.link) || {}
                    }

                    this.reviewComments.data = reviewComments.filter(i => i.line)
                    if(this.accessToken) await this.network_getReviewCommentsExtraData() 
                }catch(e) {
                    console.log(e)
                }finally{
                    this.reviewComments.loading = false
                }
            },
            async network_getReviewCommentsExtraData(comments) {
                if(this.reviewComments.data.length == 0 && !comments) return 
                try {
                    this.reviewCommentsExtraData.loading = true
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_PR_REVIEW_COMMENTS,
                        {
                            variables: {
                                ids: comments ? comments.map(i => i.node_id) : this.reviewComments.data.map( i => i.node_id)
                            }
                        }
                    )
                    this.reviewCommentsExtraData.data = this.reviewCommentsExtraData.data.concat(res.data.data.nodes)
                } catch (e) {
                    console.log(e)
                }finally {
                    this.reviewCommentsExtraData.loading = false
                }
            },
            async network_getChangedFiles() {
                try{
                    this.changedFiles.loading = true
                    let sourceAndCancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_changed_files')
                    let url = api.API_PR_CHANGED_FILES({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number
                    })
                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: sourceAndCancelToken.cancelToken
                        }
                    )

                    try{
                        this.changedFiles.data = res.data
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }

                }catch(e) {
                    console.log(e)
                }finally{
                    this.changedFiles.loading = false
                }
            },
            async network_getPendingReview() {
                if(!this.accessToken) return 
                try {
                    this.pendingReview.loading = true
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_PR_PENDING_REVIEWS,
                        {
                            variables: {
                                name: this.repo,
                                owner: this.owner,
                                number: parseInt(this.number)
                            },
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_pending_review')
                        }
                    )

                    try{
                        this.pendingReview.data = res.data.data.repository.pullRequest.reviews.nodes[0] || {}
                        this.pendingReview.emptyFlag = false
                        if(!res.data.data.repository.pullRequest.reviews.nodes[0]) this.pendingReview.emptyFlag = true
                        if(this.pendingReview.data.databaseId) {
                            await this.network_getPendingReviewComments(this.pendingReview.data)
                        }else {
                            this.pendingReview.reviewComments.data = []
                        }
                    }catch(e) {
                        this.handleGraphqlError(e)
                    }
                } catch (e) {
                    console.log(e)
                } finally {
                    this.pendingReview.loading = false
                }
            },
            async network_getPendingReviewComments() {
                if(!this.pendingReview.data.databaseId) return 
                try {
                    this.pendingReview.reviewComments.loading = true
                    let url = api.API_REVIEW_COMMENTS_OF_REVIEW({
                        owner: this.owner,
                        repo: this.repo,
                        number: this.number,
                        reviewId: this.pendingReview.data.databaseId,
                        params: {
                            per_page: 100
                        }
                    })

                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_pending_review_comments'),
                            headers: {
                                'accept':'application/vnd.github.squirrel-girl-preview'
                            }
                        }
                    )

                    this.pendingReview.reviewComments.data = res.data
                    this.network_getReviewCommentsExtraData(res.data)
                } catch (e) {
                    console.log(e)
                } finally {
                    this.pendingReview.reviewComments.loading = false
                }
            },
            async network_getNewCreatedPendingReviewComment() {
                if(!this.pendingReview.data.databaseId) return 
                try {
                    let url_pageInfo = api.API_REVIEW_COMMENTS_OF_REVIEW({
                        owner: this.owner,
                        repo: this.repo,
                        number: this.number,
                        reviewId: this.pendingReview.data.databaseId,
                        params: {
                            per_page: 1
                        }
                    })

                    let res_pageInfo = await authRequiredGet(url_pageInfo)

                    let pageInfo = parse(res_pageInfo.headers.link) || {}

                    if(!pageInfo.last) return 

                    let res_newCreatedComment = await authRequiredGet(
                        pageInfo.last.url,
                        {
                            headers: {
                                "Accept": "application/vnd.github.squirrel-girl-preview"
                            }
                        }
                    ) 

                    return res_newCreatedComment.data[0]
                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.pendingReview.reviewComments.loading = false
                }
            },
            async network_getNewCreatedReviewComment() {
                 try{
                    this.reviewComments.loading = true
                   
                    let url = api.API_REVIEW_COMMENTS_OF_PULL_REQUEST({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number,
                        params: {
                            per_page: 1,
                            sort: 'created',
                            direction: 'desc'
                        }
                    })

                    let res = await authRequiredGet(
                        url,
                        {
                            headers: {
                                'accept':'application/vnd.github.squirrel-girl-preview'
                            }
                        }
                    )

                    return res.data[0]
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.reviewComments.loading = false
                }
            },
            triggerSwitcherStretch() {
                this.switcherStretched = !this.switcherStretched
            },
            generateDiffState(file) {
                if(file.additions == file.deletions) {
                    return ['addition','deletion']
                }else if(file.additions == 0) {
                    if(file.deletions == 1) return ['deletion','neutral']
                    return ['deletion','deletion']
                }else if(file.deletions == 0) {
                    if(file.additions == 1) return ['addition','neutral']
                    return ['addition','addition'] 
                }else if(file.additions > file.deletions) {
                    return ['addition','neutral']
                }else{
                   return ['deletion','neutral']
                }
            },
            async reviewCommentCreatedHook(comment) {
                let newCreatedComment
                if(comment.state == 'PENDING') {
                    newCreatedComment = await this.network_getNewCreatedPendingReviewComment()
                    this.pendingReview.reviewComments.data.push(newCreatedComment)
                }else {
                    newCreatedComment = await this.network_getNewCreatedReviewComment()
                    this.reviewComments.data.push(newCreatedComment)
                }
                this.network_getReviewCommentsExtraData([newCreatedComment])
            },
            pendingReviewCommentDeletedEventHandler(){
                this.network_getPendingReview()
            },
            reviewSubmittedHook(payload) {
                this.dirty = true
                this.$router.push(`/${this.owner}/${this.repo}/pull/${this.number}?new_created_timeline_item=${payload.detail.id}`)
            }
        },
        async activated() {
            if(this.dirty) {
                this.pendingReview.reviewComments = []
                await this.network_getPendingReview()
                this.dirty = false
            }  
        },
      
        components: {
            CommonLoadingWrapper,
            AnimatedHeightWrapper,
            SimpleDiffView,
            ChangedFileItem,
            ReviewSubmitter,
            Container: styled.div``,
            EditorHeader: styled.div``,
            Switcher: styled.div``,
            SwitcherOptions: styled.div``,
            Diff: styled.div``,
            DiffHeader: styled.div``,
            DiffPath: styled.span``,
        }
    }
</script>

<style scoped lang="scss">
.switcher{
    padding: 15px;
    background-color: #fff;
    position: relative;
    button{
        padding-left: 20px;
        font-weight: 600;
        svg[data=stretch-icon]{
            position: relative;
            top: 1px;
            float: right;
            color: #586069;
        }
        svg{
            float: left;
            margin-top: 1px;
            margin-left: -20px;
            color: #586069;
        }
        .meta{
            display: block;
            font-size: 85%;
            font-weight: 400;
        }
    }
}   

.switcher-options{
    padding-left: 20px; 
    position: relative;
    padding-top: 6px;
    a{
        font-size: 85%;
        font-weight: 400;
        display: block;
        padding: 6px 0;
        svg{
            float: left;
            margin-left: -20px;
        }
    }
}

.diff{
    position: relative;
    margin-bottom: 15px;
    border-top: 1px solid #d1d5da;
    border-bottom: 1px solid #d1d5da;
    .diff-header{
        padding: 5px 10px 3px;
        font-size: 12px;
        color: #444d56;
        text-align: left;
        text-shadow: 0 1px 0 #fff;
        background-image: linear-gradient(#fff,#f6f8fa);
        border-bottom: 1px solid #d1d5da;
        div{
            position: relative;
            padding: 6px 0 6px 30px;
            font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
            line-height: 1.2;
            a{
                color: inherit;
            }
        }
    }
}


.diffstat{
    position: absolute;
    top: 4px;
    left: 0;
    font-size: 12px;
    font-weight: 600;
    color: #586069;
    white-space: nowrap;
    cursor: default;
    .diffstat-block-deleted {
        background-color: #cb2431;
    }
    .diffstat-block-added {
        background-color: #2cbe4e;
    }
    .diffstat-block-neutral {
        background-color: #d1d5da;
    }
}

.diff-path{
    padding-left: 0;
    margin-left: 0;
    word-break: break-all;
    border-left-width: 0;
    box-shadow: inset 0 0 0 transparent;
}

.editor-header{
    padding: 25px 15px 7.5px;
    font-size: 12px;
    font-weight: 600;
    color: #586069;
    background-color: #f6f8fa;
    border-top: 1px solid #dfe2e5;
    border-bottom: 1px solid #dfe2e5;
}

.btn {
    display: inline-block;
    padding: 9px 15px;
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.5;
    white-space: nowrap;
    vertical-align: middle;
    background-repeat: repeat-x;
    background-position: -1px -1px;
    background-size: 110% 110%;
    border: 1px solid rgba(27,31,35,.2);
    border-radius: .25em;
    appearance: none;
}

.modified{
    color: #e3ce79;
}
.added{
    color: #2cbe4e;
}
.deleted{
    color: #cb2431;
}
</style>