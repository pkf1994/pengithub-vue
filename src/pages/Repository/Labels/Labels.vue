<template>
    <CommonLoadingWrapper :loading="loading || totalCount.loading || extraData.loading" class="px-3" :position="loading ? 'center' : 'corner'">
        
        <nav class="d-flex flex-justify-between">
            <div>
                 <router-link class="subnav-item" :to="`/${owner}/${repo}/labels`">
                    <svg class="octicon octicon-tag v-align-middle" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z"></path></svg>
                    <span class="v-align-middle">
                        Labels  
                    </span>    
                </router-link>
                <router-link class="subnav-item" :to="`/${owner}/${repo}/milestones`">
                    <svg class="octicon octicon-milestone v-align-middle" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.75 0a.75.75 0 01.75.75V3h3.634c.414 0 .814.147 1.13.414l2.07 1.75a1.75 1.75 0 010 2.672l-2.07 1.75a1.75 1.75 0 01-1.13.414H8.5v5.25a.75.75 0 11-1.5 0V10H2.75A1.75 1.75 0 011 8.25v-3.5C1 3.784 1.784 3 2.75 3H7V.75A.75.75 0 017.75 0zm0 8.5h4.384a.25.25 0 00.161-.06l2.07-1.75a.25.25 0 000-.38l-2.07-1.75a.25.25 0 00-.161-.06H2.75a.25.25 0 00-.25.25v3.5c0 .138.112.25.25.25h5z"></path></svg>
                    <span class="v-align-middle">
                        Milestones  
                    </span>    
                </router-link>
            </div>
            
            <button v-if="viewerIsCollaborator().data && accessToken" class="btn btn-primary" type="button" aria-expanded="true" @click="() => triggerCreateLabelPane(true)">New label</button>
        </nav> 

       

        <AnimatedHeightWrapper :stretch="showCreateLabelPane">
            <div class="py-1 pt-3">
                <LabelEditor    v-model="createLabelData" 
                                @label-edited.native="labelEditedHook" 
                                :labelNameError="labelNameError"
                                ref="createLabelData"
                                class="bg-gray border border-gray-dark rounded-1">
                    <button :disabled="loadingCreateLabel" class="btn" type="button"  @click="() => triggerCreateLabelPane(false)">Cancel</button>
                    <button @click="network_createLabel" class="btn btn-primary" type="submit" :disabled="!createdLabelSubmitable || loadingCreateLabel || labelNameError">
                        {{loadingCreateLabel ? 'Saving...' : 'Create label'}}
                    </button>
                </LabelEditor>
            </div>
           
        </AnimatedHeightWrapper>
        

        <transition name="fade" appear>
            <ComplexBubble class="mt-3">
                <template v-slot:title>
                    <Header class="Box-header d-flex flex-justify-between flex-shrink-0">
                         <h3 class="Box-title f5">
                            {{totalCount.data}} {{totalCount.data > 1 ? 'labels' : 'label'}}
                        </h3> 
                       <!--  <button class="select-menu-button" @click="() => openModal('sortModal')">
                            Sort
                        </button> -->
                    </Header>
                </template>

                <LabelSkeleton v-if="loading && data.length == 0"></LabelSkeleton>

                <div v-else>
                    <transition-group name="fade-group" appear>
                        <LabelItem v-for="item in data" :key="item.name" :label="item" @label-deleted="labelDeletedHandler" @label-updated.native="labelUpdatedHandler"/>
                    </transition-group>
                </div>
               

            </ComplexBubble>
        </transition>

        <SimplePaginationRest v-if="pageInfo.prev || pageInfo.next" :loading="loading" :pageInfo="pageInfo"></SimplePaginationRest>

        <EmptyNotice v-if="emptyFlag" class="empty-notice">
            <div class="blankslate"> 
                <svg height="40" class="octicon octicon-milestone blankslate-icon" viewBox="0 0 14 16" version="1.1" width="35" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path>
                </svg>
                <h3>We couldn’t find anything!</h3>
                <p>There aren’t any labels that match. Give it another shot above.</p>
            </div>
        </EmptyNotice>
    </CommonLoadingWrapper>
</template>

<script>
    import {CommonLoadingWrapper,ComplexBubble,AnimatedHeightWrapper,Label,Modal,SelectMenuItem,SimplePaginationRest,Popover} from '@/components'
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {authRequiredGitHubGraphqlApiQuery,authRequiredGet,authRequiredPost} from '@/network'
    import {util_throttle} from '@/util'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import {LabelItem,LabelEditor,LabelSkeleton} from './components'
    let parse = require("parse-link-header")
    export default {
        name: 'repository_labels_page',
        inject: ['viewerIsCollaborator'],
        provide() {
            return {
                extraDataProvided: () => this.extraData.data
            }
        },
        mixins: [RouteUpdateAwareMixin],
        data() {
            return {
                data: [],
                loading: false,
                totalCount: {
                    data: 0,
                    loading: false
                },
                firstLoadedFlag: false,
                perPage: 15,
                pageInfo: {},
                extraData: {
                    data: [],
                    loading: false
                },

                showCreateLabelPane: false,
                createLabelData: {
                    name: '',
                    color: '',
                    description: ''
                },
                loadingCreateLabel: false,
                labelNameError: false
            }
        },
        computed: {
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            emptyFlag() {
                return this.data.length == 0 && this.loading == false && !this.pageInfo.prev
            },
            documentTitle() {
                return `Labels · ${this.owner}/${this.repo}`
            },
            createdLabelSubmitable() {
                if(!this.createLabelData.name) return
                if(!this.createLabelData.color) return
                let colorNumber = parseInt(this.createLabelData.color.replace('#',''),16)
                if(colorNumber > 16777215 || colorNumber < 0) return
                return true
            },
        },
        created() {
            this.network_getData()
            this.network_getLabelsCount()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_REPOSITORY_LABELS({
                        repo: this.repo,
                        owner: this.owner,
                        params: {
                            per_page: this.perPage,
                            ...this.$route.query
                        }
                    })
                    let res = await authRequiredGet(url,{cancelToken})
                    this.data = res.data
                    this.pageInfo = parse(res.headers.link) || {}
                    this.firstLoadedFlag = true
                    if(this.accessToken) this.network_getExtraData()
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            async network_getLabelsCount() {
                try{
                    this.totalCount.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_labels_count')
                    let url = api.API_REPOSITORY_LABELS({
                        repo: this.repo,
                        owner: this.owner,
                        params: {
                            per_page: 1
                        }
                    })
                    let res = await authRequiredGet(url,{cancelToken})
                    let labelsCountHolder = parse(res.headers.link) || {}
                    this.totalCount.data = labelsCountHolder.last ? labelsCountHolder.last.page : res.data.length
                }catch(e) {
                    console.log(e)
                }finally{
                    this.totalCount.loading = false
                }
            },
            async network_getExtraData() {
                if(this.data.length == 0) return 
                try{
                    this.extraData.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_extra_data')
                    let graphql_extraData = graphql.GRAPHQL_LABELS
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql_extraData,
                        {
                            cancelToken,
                            variables: {
                                "ids": this.data.map(i => i.node_id)
                            }
                        }
                    )
                    this.extraData.data = res.data.data.nodes
                }catch(e){
                    console.log(e)
                }finally{
                    this.extraData.loading = false
                }
            },
            async network_createLabel() {
                if(this.loadingCreateLabel) return 
                if(!this.viewerIsCollaborator().data) return 
                if(!this.accessToken) return
                try{
                    this.loadingCreateLabel = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' create_label')
                    let url = api.API_REPOSITORY_LABELS(this.$route.params)
                    let res = await authRequiredPost(
                        url,
                        {
                            cancelToken,
                            name: this.createLabelData.name,
                            color: this.createLabelData.color.replace('#',''),
                            description: this.createLabelData.description,
                        },
                    )

                    this.data.unshift(res.data)
                    await this.network_getExtraData()
                    this.showCreateLabelPane = false

                }catch(e) {
                    handleError(e)
                }finally{
                    this.loadingCreateLabel = false
                }
            },
            async network_checkIfLabelNameHasBeenTaken() {
                try {
                    
                    let u = api.API_HANDLE_LABEL({
                        repo: this.repo,
                        owner: this.owner,
                        label: this.createLabelData.name
                    })

                    await authRequiredGet(
                        u,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' check_if_label_name_has_been_taken')
                        }
                    )

                    this.labelNameError = true
                } catch (e) {
                    console.log(e) 
                    this.labelNameError = false
                } 
            },
            getOpenIssuesAndPullRequestsCount(id) {
                let dataHolder = this.extraData.data.filter(i => i.id == id)[0]
                if(!dataHolder) return
                return dataHolder.issues.totalCount + dataHolder.pullRequests.totalCount
            },
            triggerCreateLabelPane(flag) {
                this.showCreateLabelPane = flag
            },
            triggerPopover() {
                if(!this.$refs.popover) return 
                this.$refs.popover.show = true
            },
            labelUpdatedHandler(e) {
                let updatedLabel = this.data.filter(i => i.name == e.detail.prev.name)[0]
                if(updatedLabel) {
                    updatedLabel.name = e.detail.name
                    updatedLabel.color = e.detail.color,
                    updatedLabel.description = e.detail.description
                }
            },
            labelDeletedHandler(e) {
                let idx
                this.data.forEach((i,index) => {
                    if(i.name == e.name) {
                        idx = index
                    }
                })
                this.data.splice(idx,1)
            },
            labelEditedHook(e) {
                this.createLabelData.name = e.detail.name
                this.createLabelData.color = e.detail.color
            }
        },
        watch:{
            'createLabelData.name': function(newOne,oldOne) {
                this.labelNameError = false
                util_throttle.throttleByDelay(this.network_checkIfLabelNameHasBeenTaken,500,this)
            }  
        },
        components: {
            CommonLoadingWrapper,
            ComplexBubble,
            AnimatedHeightWrapper,
            Label,
            Modal,
            SelectMenuItem,
            SimplePaginationRest,
            Popover,
            LabelItem,
            LabelEditor,
            LabelSkeleton,
            Header: styled.div``,
            EmptyNotice: styled.div``,
            CreateLabelPane: styled.div``,
            LabelPreviewRow: styled.div``,
            LabelInfoRow: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/navigation/index.scss';
@import 'node_modules/@primer/css/blankslate/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
.select-menu-button:after {
    display: inline-block;
    width: 0;
    height: 0;
    vertical-align: -2px;
    content: "";
    border: 4px solid transparent;
    border-top-color: currentcolor;
}
.description{
    margin: 0;
    font-size: 12px;
    color: #586069;
}
.router-link-active{
    color: #fff;
    background-color: #0366d6;
    border-color: #0366d6;
}
.empty-notice{
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    pointer-events: none;
}
</style>