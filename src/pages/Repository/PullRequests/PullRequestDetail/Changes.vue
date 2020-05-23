<template>
    <Container>
            <Switcher class="switcher ">
                <button class="text-left width-full btn-link text-gray-dark" @click="triggerSwitcherStretch" >
                    <svg data="stretch-icon" v-if="!switcherStretched" class="octicon octicon-chevron-down switcher-icon-open" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6l-5 5z"></path></svg>
                    <svg data="stretch-icon" v-else class="octicon octicon-chevron-up switcher-icon-close" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 10l-1.5 1.5L5 7.75 1.5 11.5 0 10l5-5 5 5z"></path></svg>

                    <svg class="octicon octicon-diff switcher-icon" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6 7h2v1H6v2H5V8H3V7h2V5h1v2zm-3 6h5v-1H3v1zM7.5 2L11 5.5V15c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h6.5zM10 6L7 3H1v12h9V6zM8.5 0H3v1h5l4 4v8h1V4.5L8.5 0z"></path></svg>

                    {{pullRequestProvided().changed_files}} changed {{pullRequestProvided().changed_files > 1 ? 'files' : 'file'}}
                    <span class="meta text-gray">
                        <span class="text-green">
                            {{pullRequestProvided().additions}} {{pullRequestProvided().additions > 1 ? 'additions' : 'addition'}}
                        </span>
                        and
                        <span class="text-red">
                            {{pullRequestProvided().deletions}} {{pullRequestProvided().deletions > 1 ? 'deletions' : 'deletion'}}
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

        <EditorHeader class="editor-header" v-if="changedFiles.data.length > 0">
            Submit your review
        </EditorHeader>
        <Editor v-if="changedFiles.data.length > 0" 
                class="m-3"
                ref="editor">
            <button class="btn">
                <span>Cancel review</span>
            </button>
            <button class="btn btn-primary ml-1">
                <span>Submit review</span>
            </button>
        </Editor>

        <transition name="fade" appear>
            <CommonLoading v-if="loading || reviewComments.loading || changedFiles.loading"
                            :preventClickEvent="false"
                            :position="loading ? 'center' : 'corner'"/>
        </transition> 

    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {CommonLoading,AnimatedHeightWrapper,SimpleDiffView} from '@/components'
    import {HiddenItemLoading,ChangedFileItem,Editor} from './components'
    import {authRequiredGitHubGraphqlApiQuery,authRequiredGet } from '@/network'
    import * as api from '@/network/api'
    import {util_dateFormat,util_emoji} from '@/util'
    import * as graphql from './graphql'
    export default {
        mixins: [RouteUpdateAwareMixin],
        name: 'repository_pull_request_detail_commits_page',
        inject: ['owner','repo','number','pullRequestProvided'],
        provide() {
            return {
                reviewCommentsProvided: () => this.reviewComments.data
            }
        },
        data() {
            return {
                switcherStretched: false,
                data: '',
                loading: false,
                pageInfo: {},
                totalCount: 0,
                reviewComments: {
                    data: [],
                    loading: false
                },
                changedFiles: {
                    data: [],
                    loading: false
                }
            }
        },
        computed: {
           committedDateMarkedData() {
                let data = []
                let lastItem
                this.data.forEach(item => {
                    if(lastItem) {
                        if(util_dateFormat.dateFormat('zzz dd, yyyy',item.commit.committer.date) === util_dateFormat.dateFormat('zzz dd, yyyy',lastItem.commit.committer.date)) {
                            item.someCommittedDateWithPrevOne = true
                        }
                    }
                    data.push(item)
                    lastItem = item
                })
                return data
            },
        },
        created() {
            this.network_getData()
            this.network_getReviewComments()
            this.network_getChangedFiles()
        },
        methods: {
            routeUpdateHook() {
                this.network_getData()
                this.network_getReviewComments()
                this.network_getChangedFiles()
            },
            async network_getData() {
                try{
                    this.loading = true
                    let sourceAndCancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)

                    let url = api.API_PULLREQUEST({
                        repo: this.repo(),
                        owner: this.owner(),
                        number: this.number()
                    })
                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken:sourceAndCancelToken.cancelToken,
                            headers: {
                                "Accept": "application/vnd.github.VERSION.diff"
                            }
                        }
                    )
                    this.data = res.data
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            async network_getReviewComments() {
                try{
                    this.reviewComments.loading = true
                    let sourceAndCancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_review_comments')
                    let graphql_reviewComments = graphql.GRAPHQL_PR_ALL_REVIEW_COMMENTS({
                        owner: this.owner(),
                        repo: this.repo(),
                        number: this.number()
                    })
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql_reviewComments,
                        {
                            cancelToken: sourceAndCancelToken.cancelToken
                        }
                    )

                    let dataHolder
                    try{
                        dataHolder = res.data.data.repository.pullRequest.timelineItems.nodes
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }

                    let reviewComment = []
                    dataHolder.forEach(reviewItem => {
                        reviewComment = reviewComment.concat(reviewItem.comments.nodes)
                    })

                    this.reviewComments.data = reviewComment
                }catch(e) {
                    console.log(e)
                }finally{
                    this.reviewComments.loading = false
                }
            },
            async network_getChangedFiles() {
                try{
                    this.changedFiles.loading = true
                    let sourceAndCancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_changed_files')
                    let url = api.API_PR_CHANGED_FILES({
                        repo: this.repo(),
                        owner: this.owner(),
                        number: this.number()
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
            }
        },
        components: {
            CommonLoading,
            AnimatedHeightWrapper,
            SimpleDiffView,
            ChangedFileItem,
            Editor,
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