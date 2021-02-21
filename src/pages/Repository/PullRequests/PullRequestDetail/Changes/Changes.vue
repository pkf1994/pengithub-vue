<template>
    <CommonLoadingWrapper class="px-3" :loading="reviewComments.loading || reviewCommentsExtraData.loading || changedFiles.loading || pendingReview.loading || pendingReview.reviewComments.loading" :position="changedFiles.loading ? 'center' : 'corner'">
        <div ref="actionRow" class="d-flex flex-justify-between py-3 action-row" @scroll="scrollEventListener">
            <button class="btn-link muted-link select-menu-button" @click="triggerSwitcherStretch" >
                <strong style="font-size:13px;" class="mr-1">Jump to...</strong>
            </button>

            <button class="btn btn-sm btn-primary" @click="() => showModal('submitReviewModal')">
                Review
                <span class="dropdown-caret"></span>
            </button>  
        </div>

        <div v-show="actionRowStuck" class="toolbar-shadow"></div>
        

        <transition-group name="fade-group" appear>
            <ChangedFileItem :id="`diff-${item.sha}`" v-for="item in changedFiles.data" :key="item.sha" :file="item"></ChangedFileItem>
        </transition-group>

        <!-- <EditorHeader class="editor-header" v-if="changedFiles.data.length > 0 && repoOwnerType() == 'User'">
            Submit your review
        </EditorHeader>
        <ReviewSubmitter v-if="changedFiles.data.length > 0 && repoOwnerType() == 'User'"></ReviewSubmitter> -->

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

        <Modal ref="submitReviewModal" title="Finish your review">
            <ReviewSubmitter></ReviewSubmitter>
        </Modal>


    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {CommonLoadingWrapper,AnimatedHeightWrapper, Modal} from '@/components'
    import {HiddenItemLoading} from '../components'
    import {ChangedFileItem,ReviewSubmitter} from './components'
    import {authRequiredGitHubGraphqlApiQuery,authRequiredGet } from '@/network'
    import * as api from '@/network/api'
    import {util_dateFormat,util_emoji} from '@/util'
    import {mapState, mapMutations} from 'vuex'
    import * as graphql from '../graphql'
    import {MUTATION_PULL_REQUEST_DETAIL_RESET_STATE,MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_STARTED_REVIEW} from '@/store/modules/pullRequestDetail/mutationTypes'
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
                commentReviewCreatedHook: () => this.commentReviewCreatedHook,
                //reviewCommentDeletedHook: () => this.network_getReviewComments,
                reviewStartedHook: () => this.reviewStartedHook,
                //reviewSubmittedHook: () => this.reviewSubmittedHook,
                //reviewCommentCreatedHook: () => this.reviewCommentCreatedHook,
                //pendingReviewCommentDeletedHook: () => this.network_getPendingReview
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
                actionRowStuck: false
            }
        },
        computed: {
            ...mapState({
                state_deletedReviewComments: state => state.pullRequestDetail.deletedReviewComments,
                state_newCreatedReviewComments: state => state.pullRequestDetail.newCreatedReviewComments, 
                state_newSubmittedReviews: state => state.pullRequestDetail.newSubmittedReviews, 
                state_newStartedReviewComments: state => state.pullRequestDetail.newStartedReviewComments, 
            }),
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
            this.initScrollEventListener()
            this.network_getData()
        },
        methods: {
            scrollEventListener(e) {
                /* console.log(getComputedStyle(this.$refs.actionRow).position)
                console.log(getComputedStyle(this.$refs.actionRow).top)
                console.log(this.$refs.actionRow.offsetTop)
                console.log(this.$refs.actionRow.scrollTop) */
                if(!this.preOffSetTop || this.preOffSetTop == this.$refs.actionRow.offsetTop) {
                    this.actionRowStuck = false
                } else {
                    this.actionRowStuck = true
                }
                this.preOffSetTop = this.$refs.actionRow.offsetTop
            },
            initScrollEventListener() {
                window.addEventListener('scroll',this.scrollEventListener)
            },
            unbindScrollEventListener() {
                window.removeEventListener('scroll',this.scrollEventListener)
            },
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
                        if(pageInfo) url = pageInfo.next.url
                        if(!url) {
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

                    this.reviewComments.data = reviewComments.filter(i => i.position)
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
                                ids: comments ? comments.filter(i => i.position).map(i => i.node_id) : this.reviewComments.data.filter(i => i.position).map( i => i.node_id)
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
                            await this.network_getPendingReviewComments()
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
           /*  async reviewCommentCreatedHook(comment) {
                let newCreatedComment
                if(comment.state == 'PENDING') {
                    newCreatedComment = await this.network_getNewCreatedPendingReviewComment()
                    this.pendingReview.reviewComments.data.push(newCreatedComment)
                }else {
                    newCreatedComment = await this.network_getNewCreatedReviewComment()
                    this.reviewComments.data.push(newCreatedComment)
                }
                this.network_getReviewCommentsExtraData([newCreatedComment])
            }, */
            async commentReviewCreatedHook(review) {
                let url = api.API_REVIEW_COMMENTS_OF_REVIEW({
                    repo: this.repo,
                    owner: this.owner,
                    number: this.number,
                    reviewId: review.id,
                })

                let res = await authRequiredGet(url)

                res.data[0] && this.reviewComments.data.push(res.data[0])
                this.network_getReviewCommentsExtraData(res.data)
            },
            async reviewStartedHook() {
                await this.network_getPendingReview()
            },
           /*  async reviewSubmittedHook(review) {
                if(!this.pendingReview.data.id) {
                     let url = api.API_REVIEW_COMMENTS_OF_REVIEW({
                        repo: this.repo,
                        owner: this.owner,
                        reviewId: review.id,
                        params: {
                            per_page:100
                        }
                    })
                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_review_comments')
                        }
                    )
                    this.reviewComments.data = this.reviewComments.data.concat(res.data)
                    this.network_getReviewCommentsExtraData(res.data)
                }
            } */
          /*   scrollEventListener(e) {
                console.log(e.target.style)
            } */
        },
        watch: {
            state_deletedReviewComments: {
                handler: function(newOne,oldOne) {
                    if(this.pendingReview.reviewComments.data.length > 0) {
                        if(newOne.some(i => this.pendingReview.reviewComments.data.some(i_ => i_.id == i.id))) {
                            if(this.pendingReview.reviewComments.data.length == 1) {
                                this.network_getPendingReview()
                            }else{
                                this.network_getPendingReviewComments()
                            }
                            return 
                        }
                    }
                    console.log('state_deletedReviewComments')
                    console.log(newOne)
                    console.log(oldOne)
                    console.log(oldOne == newOne)
                    this.network_getReviewComments()
                },
                deep: true
            },
            state_newCreatedReviewComments: {
                handler: function(newOne) {
                    if(newOne.length == 0) return
                    this.network_getReviewCommentsExtraData([newOne[newOne.length - 1]])
                },
                deep: true
            },
            state_newSubmittedReviews: {
                handler: function(newOne) {
                    if(newOne.length == 0) return
                    if(this.pendingReview.data.id) {
                        this.reviewComments.data = this.reviewComments.data.concat(this.pendingReview.reviewComments.data)
                        this.pendingReview.data = {}
                        this.pendingReview.reviewComments.data = []
                    } 
                },
                deep: true
            },
        },
       
        components: {
            CommonLoadingWrapper,
            AnimatedHeightWrapper,
            ChangedFileItem,
            ReviewSubmitter,
            Modal,
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
@import 'node_modules/@primer/css/dropdown/index.scss';
.action-row{
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
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

/* .btn {
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
} */

.modified{
    color: #e3ce79;
}
.added{
    color: #2cbe4e;
}
.deleted{
    color: #cb2431;
}

.select-menu-button:after {
    display: inline-block;
    width: 0;
    height: 0;
    vertical-align: -2px;
    content: "";
    border: 4px solid transparent;
    border-top-color: currentcolor;
}

.toolbar-shadow {
    position: fixed;
    top: 60px;
    right: 0;
    left: 0;
    z-index: 28;
    height: 5px;
    background: linear-gradient(rgba(0,0,0,.075),rgba(0,0,0,.001)) repeat-x 0 0;
    border-top: 1px solid rgba(0,0,0,.15);
}
</style>