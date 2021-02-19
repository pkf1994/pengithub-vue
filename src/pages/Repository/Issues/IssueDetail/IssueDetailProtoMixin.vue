<template>
  
</template>

<script>
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {
        authRequiredGet,
        authRequiredPatch,
        authRequiredPost,
        authRequiredDelete,
        authRequiredGitHubGraphqlApiQuery} from '@/network'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    var parse = require('parse-link-header');
    export default {
        inject: ['repoBasicInfo','repoSubscription','viewerPermission','viewerBlocked'],
        mixins: [RouteUpdateAwareMixin],
        provide() {
            return {
                commentExtraDataProvided: () => this.timeline.extraData.data,
                timelineExtraDataProvided: () => this.timeline.extraData.data,
                timelineItemDeletedHook: () => this.timelineItemDeletedHook,
                viewerCanComment: () => this.viewerCanComment
            }
        },
        data() {
            return {
                data: {},
                loading: false,
                //bodyHTML reactions viewerAssociation
                extraData: {
                    data: {},
                    loading: false
                },
                timeline: {
                    data: [],
                    loading: false,
                    extraData: {
                        data: [],
                        loading: false
                    },
                    perPage: 20,
                    pageInfo: {},
                    newestTimelines: {
                        data: [],
                        loading: false
                    },
                    restCount: {
                        data: 0,
                        loading: false
                    },
                    graphqlCount: {
                        data: 0,
                        loading: false
                    },
                    bufferTimeline: {
                        data: [],
                        loading: false
                    },
                },
                timelineTypes: [
                    {
                        graphql:'CROSS_REFERENCED_EVENT',
                        rest:'cross-referenced',
                    },
                    {
                        graphql:'REFERENCED_EVENT',
                        rest:'referenced',
                    },
                    {
                        graphql:'ISSUE_COMMENT',
                        rest:'commented',
                    },
                    {
                        graphql:'ASSIGNED_EVENT',
                        rest:'assigned',
                    },
                    {
                        graphql:'UNASSIGNED_EVENT',
                        rest:'unassigned',
                    },
                    {
                        graphql:'CLOSED_EVENT',
                        rest:'closed',
                    },
                    {
                        graphql:'REOPENED_EVENT',
                        rest:'reopened',
                    },
                    {
                        graphql:'COMMENT_DELETED_EVENT',
                        rest:'comment_deleted',
                    },
                    {
                        graphql:'MILESTONED_EVENT',
                        rest:'milestoned',
                    },
                    {
                        graphql:'DEMILESTONED_EVENT',
                        rest:'demilestoned',
                    },
                    {
                        graphql:'LABELED_EVENT',
                        rest:'labeled',
                    },
                    {
                        graphql:'UNLABELED_EVENT',
                        rest:'unlabeled',
                    },
                    {
                        graphql:'LOCKED_EVENT',
                        rest:'locked',
                    },
                    {
                        graphql:'UNLOCKED_EVENT',
                        rest:'unlocked',
                    },
                    {
                        graphql:'MARKED_AS_DUPLICATE_EVENT',
                        rest:'marked_as_duplicate',
                    },
                    {
                        graphql:'UNMARKED_AS_DUPLICATE_EVENT',
                        rest:'unmarked_as_duplicate',
                    },
                    {
                        graphql:'MOVED_COLUMNS_IN_PROJECT_EVENT',
                        rest:'moved_columns_in_project',
                    },
                    {
                        graphql:'PINNED_EVENT',
                        rest:'pinned',
                    },
                    {
                        graphql:'UNPINNED_EVENT',
                        rest:'unpinned',
                    },
                    {
                        graphql:'RENAMED_TITLE_EVENT',
                        rest:'renamed',
                    },
                    {
                        graphql:'TRANSFERRED_EVENT',
                        rest:'transferred',
                    },
                    {
                        graphql:'USER_BLOCKED_EVENT',
                        rest:'user_blocked',
                    }
                ],
                deleteIssueModal: {
                    loading: false
                },
                isDynamicDocumentTitle: true,
                resetBeforeUpdate: true
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
            documentTitle() {
                if(!this.data.title) return location.href
                return this.data.title
            },
            filteredTransferTargetRepositories() {
                let searchQuery = this.transferIssueModal.searchQuery.toLowerCase()
                return this.transferIssueModal.availableRepositories.data.filter(i => {
                    return i.hasIssuesEnabled && i.name != this.$route.params.repo && (i.name.toLowerCase().indexOf(searchQuery) != -1 || (i.description && i.description.toLowerCase().indexOf(searchQuery) != -1))
                })
            },
            timelineRemainedCount() {
                let alreadyCount = 0
                this.timeline.data.forEach(item => {
                    if(this.timelineTypes.some(_item => {
                        return _item.rest == item.event
                    })){
                        alreadyCount ++
                    }
                })
                this.timeline.newestTimelines.data.forEach(item => {
                    if(this.timelineTypes.some(_item => {
                        return _item.rest == item.event
                    })){
                        alreadyCount ++
                    }
                })
                return this.timeline.graphqlCount.data - alreadyCount
            },
            handledTimelines() {
                try{
                    let timeline = this.timeline.data.filter(i => !this.timeline.newestTimelines.data.some(i_ => i_.created_at == i.created_at))
                    return timeline
                }catch(e) {
                    console.log(e)
                }
                
            },
            newestTimelines() {

                let deDuplicatedAllNewCreatedTimelines = []

                let magicArray = [
                    ...this.timeline.newestTimelines.data,
                ]
                magicArray.forEach(i => {
                    if(!deDuplicatedAllNewCreatedTimelines.some(i_ => i_.id == i.id && i_.node_id == i.node_id && i_.created_at == i.created_at)) {
                        deDuplicatedAllNewCreatedTimelines.push(i)
                    }
                })
                return deDuplicatedAllNewCreatedTimelines
            },
            noMoreTimelineToLoad() {
                if(!this.timeline.pageInfo.next) return true
                return this.timeline.restCount.data <= (this.timeline.data.length + this.timeline.newestTimelines.data.length)
            },
            viewerCanComment() {
                if(this.viewerBlocked()) return false
                if(this.viewerPermission() == 'ADMIN' || this.viewerPermission() == 'TRIAGE'  || this.viewerPermission() == 'WRITE') return true
                if(!this.data.locked) return true
                return false
            },
        },
        methods: {
             async network_getTimeline() {
                if(this.timeline.loading) return
                try{
                    this.timeline.loading = true
                    let url_timeline
                    if(this.timeline.pageInfo.next && this.timeline.pageInfo.next.url) {
                        url_timeline = this.timeline.pageInfo.next.url
                    } else {
                        url_timeline = api.API_ISSUE_TIMELINES({
                            ...this.$route.params,
                            params: {
                                per_page: this.timeline.perPage
                            }
                        })
                    }

                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + 'get_timeline')
                 
                    let config = {
                        cancelToken: cancelToken,
                        headers:{
                            'Accept': 'application/vnd.github.mockingbird-preview,application/vnd.github.starfox-preview+json'
                        }   
                    }
                    
                    let res_timeline = await authRequiredGet(url_timeline,config)

                    this.timeline.pageInfo = parse(res_timeline.headers.link) || {}

                    if(this.timeline.bufferTimeline.data.length > 0) {
                        this.timeline.data = this.timeline.data.concat(this.timeline.bufferTimeline.data)
                        this.timeline.bufferTimeline.data = []
                    }

                    this.timeline.data = this.timeline.data.concat(res_timeline.data)

                    this.timeline.loading = false

                    if(this.accessToken && res_timeline.data.length > 0) this.network_getTimelineExtraData(res_timeline.data)

                    if(this.timeline.pageInfo.next && this.timeline.pageInfo.next.page == 2) {
                        await this.network_getNewestTimelines()
                    }

                    if(this.newCreatedTimelineItem) this.scrollToNewestTimelineItem()

                }catch(e){
                    console.log(e)
                }finally{
                    this.timeline.loading = false
                }
            },
            async network_getTimelineExtraData(timeline) {
                try{
                    this.timeline.extraData.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_timeline_extra_data')

                    let timelineIds = timeline.map(i => i.node_id).filter(i => i)

                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_ISSUE_TIMELINE,
                        {
                            cancelToken,
                            variables: {
                                ids: timelineIds
                            }
                        }
                    )
                  
                    try{
                        this.timeline.extraData.data = this.timeline.extraData.data.concat(res.data.data.nodes)
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }

                    return res.data.data.nodes
                }catch(e) {
                    console.log(e)
                }finally{   
                    this.timeline.extraData.loading = false
                }
            },
            async network_getNewestTimelines() {
                if(!this.timeline.pageInfo.last) return
                 try{ 
                    this.timeline.newestTimelines.loading = true
                    let url = this.timeline.pageInfo.last.url

                    let config = {
                        cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_newest_timelines'),
                        headers:{
                            'Accept': 'application/vnd.github.mockingbird-preview,application/vnd.github.starfox-preview+json'
                        }   
                    }
                    
                    let res = await authRequiredGet(url,config)

                    this.timeline.newestTimelines.data = res.data

                    this.$nextTick(() => {
                        this.scrollToNewestTimelineItem()
                    })

                    if(this.timeline.newestTimelines.data.length > 0) this.network_getTimelineExtraData(this.timeline.newestTimelines.data)
                  
                }catch(e){
                    this.handleError(e)
                }finally{
                    this.timeline.newestTimelines.loading = false
                }
            },
            async network_getTimelineRestCount() {
                try {
                    this.timeline.restCount.loading = true

                    let url = api.API_ISSUE_TIMELINES({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number,
                        params: {
                            per_page: 1
                        }
                    })  

                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_timeline_rest_count'),
                                headers: {
                                "accept": "application/vnd.github.mockingbird-preview"
                            }
                        }
                    )

                    let countHolder = parse(res.headers.link) || {}
                    this.timeline.restCount.data = countHolder.last ? countHolder.last.page : res.data.length
                } catch (e) {
                    console.log(e)
                } finally {
                    this.timeline.restCount.loading = false
                }
            },
            async network_getTimelineGraphqlCount() {
                try{
                    this.timeline.graphqlCount.loading = true

                    let itemTypes = this.timelineTypes.map(i => i.graphql)
                    
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_ISSUE_TIMELINE_COUNT,
                        {
                            variables: {
                                itemTypes,
                                repo: this.repo,
                                owner: this.owner,
                                number: parseInt(this.number)
                            },
                            cancelToken:this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + '_timeline_graphql_count')
                        }
                    )
                    try{
                        this.timeline.graphqlCount.data = res.data.data.repository.issue.timelineItems.totalCount
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }

                }catch(e){
                    console.log(e)
                }finally{
                    this.timeline.graphqlCount.loading = false
                }
            },
            async network_updateIssue(data) {
                try {
                    let url = api.API_ISSUE({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number
                    })

                    let res = await authRequiredPatch(
                        url,
                        {
                            ...data
                        }
                    )
                    
                    this.data = res.data
                } catch (e) {
                    this.handleError(e)
                    throw(e)
                }
            },
             async network_getBufferTimeline() {
                try {
                    this.timeline.bufferTimeline.loading = true
                    let url = api.API_ISSUE_TIMELINES({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number,
                        params: {
                            per_page: 1,
                            page: this.timeline.data.length
                        }
                    })

                    let res = await authRequiredGet(
                        url,
                        {
                            headers: {
                                "accept": "application/vnd.github.mockingbird-preview,application/vnd.github.starfox-preview+json"
                            }
                        }
                    )

                    res.data[0] && this.timeline.bufferTimeline.data.push(res.data[0])

                } catch (e) {
                    console.log(e)
                } finally {
                    this.timeline.bufferTimeline.loading = false
                }
            },
            async timelineItemDeletedHook(deletedItem) {
                if(this.noMoreTimelineToLoad) return
                if(!this.handledTimelines.some(i => i.id == deletedItem.id)) return
                await this.network_getBufferTimeline()
            },
            scrollToNewestTimelineItem() {
                if(this.newCreatedTimelineItem) {
                    setTimeout(() => {
                        let theEl = document.getElementById(this.newCreatedTimelineItem)
                        theEl && theEl.scrollIntoView()
                    },0)
                }
            },
            quoteReply(e) {
                let commentCreateOrEditPaneTextarea = document.querySelector('textarea')
                commentCreateOrEditPaneTextarea.focus()
                commentCreateOrEditPaneTextarea.value = commentCreateOrEditPaneTextarea.value + e
                commentCreateOrEditPaneTextarea.dispatchEvent(new Event('input'))
            },
            closeIssueHook(payload) {
                this.data = payload
                this.network_getIssueExtraData()
                this.timeline.extraData = []
                this.network_getTimelineExtraData(this.timeline.data)
            },
            minimizeCommentHook(payload) {
                let theComment = this.timeline.extraData.data.filter(i => i.id == payload.comment.node_id)[0]
                if(theComment) {
                    Object.assign(theComment,payload.info)
                }
            },
            unminimizeCommentHook(payload) {
                let theComment = this.timeline.extraData.data.filter(i => i.id == payload.comment.node_id)[0]
                if(theComment) {
                    Object.assign(theComment,payload.info)
                }
            },
            commentUpdatedHook(event) {
                let theComment = this.timeline.data.filter(i => i.id == event.detail.id)[0]
                if(theComment) {
                    Object.assign(theComment,event.detail)
                }
            },
            changeLockStatusSuccessPostHandler(payload) {
                this.data.locked = payload
            },
           
            newTimelineItemCreatedHook(e) {
                this.timeline.newestTimelines.data.push(e.detail)
                this.network_getTimelineExtraData([e.detail])
            } 
        },
    }
</script>

<style scoped lang="scss">

</style>