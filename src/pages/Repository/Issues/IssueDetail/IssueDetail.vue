<template>
    <CommonLoadingWrapper :loading="loading || timeline.loading || timeline.extraData.loading" :position="loading ? 'center' : 'corner'" class="px-3 pt-3 bg-white flex-grow-1">
        <AnimatedHeightWrapper>
            <Header v-if="data.id">
                <HeaderActions class="d-flex flex-justify-between flex-items-center mb-3">
                    <router-link to="/" class="btn btn-primary d-inline-block btn-sm">
                        New issue
                    </router-link>

                    <button class="btn-link" @click="scrollToBottom">Jump to bottom</button>
                </HeaderActions>

                <HeaderTitle class="title f1">
                    {{data.title}}
                    <span class="number">#{{data.number}}</span>
                </HeaderTitle>

                <HeaderMeta class="d-flex mt-2 mb-3 flex-items-center header-meta">
                    <State class="State State--green mr-2 d-inline-flex flex-items-center flex-self-start" :class="{'State--green':data.state === 'open','State--red':data.state === 'closed'}" style="text-transform:capitalize;">
                        <IssueIcon color="#fff" :issue="data"></IssueIcon>
                        &nbsp;{{data.state}}
                    </State>   

                    <MetaContent class="meta-content">
                        <router-link to="/" class="text-bold link-gray">{{data.user && data.user.login}}</router-link>
                        {{data.state}} this issue
                        <span class="no-wrap">on {{createdAt}}</span>&nbsp;· {{data.comments}} {{data.comments > 1 ? 'comments' : 'comment'}} 
                    </MetaContent>
                </HeaderMeta>
            </Header>
        </AnimatedHeightWrapper>
        

        <Info   class="border-bottom border-top pt-3 mt-3" 
                v-if="(data.assignees && data.assignees.length !== 0) || (data.labels && data.labels.length !== 0) || (data.milestone && data.milestone !== null)"
                >
            <!-- assignee -->
                 <div class="d-flex pb-3" v-if="data.assignees && data.assignees.length !== 0">
                    <span class="text-gray text-bold flex-shrink-0 col-3 f6">Assignees</span>    
                    <div class="min-width-0 d-flex flex-wrap mt-n1 flex-wrap">
                        <ImgWrapper>
                            <img class="avatar mr-1" v-for="item in data.assignees" 
                            :key="item.id" :src="item.avatar_url" height="20" width="20"> 
                        </ImgWrapper>
                    </div>
                </div> 
           
            <!-- label -->
            <AnimatedHeightWrapper>
                <div class="d-flex pb-3" v-if="data.labels && data.labels.length !== 0">
                    <span class="text-gray text-bold flex-shrink-0 col-3 f6">Labels</span>    
                    <div class="min-width-0 d-flex flex-wrap mt-n1">
                        <router-link to="/" v-for="item in data.labels" :key="item.name">
                            <Label  class="mr-1 mt-1"
                                    :name="item.name"
                                    :color="`#${item.color}`"></Label> 
                        </router-link>
                    </div>
                </div> 
            </AnimatedHeightWrapper>
            <!-- milestone -->
            <AnimatedHeightWrapper>
                <div class="d-flex pb-3" v-if="data.milestone && data.milestone !== null">
                    <span class="text-gray text-bold flex-shrink-0 col-3 f6">Milestone</span>    
                    <div class="min-width-0 d-flex flex-wrap mt-n1 f6">
                        <router-link to="/" class="d-inline-block text-bold mr-2 link-gray-dark">
                            <svg class="octicon octicon-milestone text-gray" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2H6V0h2v2zm4 5H2c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h10l2 2-2 2zM8 4H6v2h2V4zM6 16h2V8H6v8z"></path></svg>
                            {{data.milestone.title}}
                        </router-link> 
                    </div>
                </div> 
            </AnimatedHeightWrapper>
        </Info>
      
        <Comment    :data="data"
                    v-if="data.user" 
                    style="padding-top:0px!important;margin-top:16px;"
                    :headerStyle="{
                        backgroundColor:'#f1f8ff',
                        borderBottomColor:'#c0d3eb'}"
                    :extraData="extraData.data" 
                    :loading="extraData.loading"/>
                
        <LoadingTimeline v-if="data.node_id && timeline.data.length == 0 && timeline.loading" class="loading-timeline d-flex flex-items-center flex-justify-center">
            <LoadingIconEx/>
        </LoadingTimeline> 

        <transition-group tag="div" appear name="fade">
            <TimelineItem v-for="(item,index) in timeline.data" :data="item" :key="(item.id || '') + index"/>
        </transition-group>

        <CommentEditor class="pt-3 mb-5" 
                        v-if="data.id"
                        :locked="this.data.locked"
                        :viewerDidAuthor="extraData.data.viewerDidAuthor" 
                        :lockedReason="extraData.data.activeLockReason" 
                        :viewerIsCollaborator="viewerIsCollaborator.data"></CommentEditor>


        <InfoBottom v-if="data.id">
            <!-- assignee -->
            <InfoBottomItem class="info-bottom-item">
                <span v-if="viewerIsCollaborator().data" @click="() => showModal('chooseAssigneesModal')" class="float-right">
                    <svg class="octicon octicon-gear" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.429 1.525a6.593 6.593 0 011.142 0c.036.003.108.036.137.146l.289 1.105c.147.56.55.967.997 1.189.174.086.341.183.501.29.417.278.97.423 1.53.27l1.102-.303c.11-.03.175.016.195.046.219.31.41.641.573.989.014.031.022.11-.059.19l-.815.806c-.411.406-.562.957-.53 1.456a4.588 4.588 0 010 .582c-.032.499.119 1.05.53 1.456l.815.806c.08.08.073.159.059.19a6.494 6.494 0 01-.573.99c-.02.029-.086.074-.195.045l-1.103-.303c-.559-.153-1.112-.008-1.529.27-.16.107-.327.204-.5.29-.449.222-.851.628-.998 1.189l-.289 1.105c-.029.11-.101.143-.137.146a6.613 6.613 0 01-1.142 0c-.036-.003-.108-.037-.137-.146l-.289-1.105c-.147-.56-.55-.967-.997-1.189a4.502 4.502 0 01-.501-.29c-.417-.278-.97-.423-1.53-.27l-1.102.303c-.11.03-.175-.016-.195-.046a6.492 6.492 0 01-.573-.989c-.014-.031-.022-.11.059-.19l.815-.806c.411-.406.562-.957.53-1.456a4.587 4.587 0 010-.582c.032-.499-.119-1.05-.53-1.456l-.815-.806c-.08-.08-.073-.159-.059-.19a6.44 6.44 0 01.573-.99c.02-.029.086-.075.195-.045l1.103.303c.559.153 1.112.008 1.529-.27.16-.107.327-.204.5-.29.449-.222.851-.628.998-1.189l.289-1.105c.029-.11.101-.143.137-.146zM8 0c-.236 0-.47.01-.701.03-.743.065-1.29.615-1.458 1.261l-.29 1.106c-.017.066-.078.158-.211.224a5.994 5.994 0 00-.668.386c-.123.082-.233.09-.3.071L3.27 2.776c-.644-.177-1.392.02-1.82.63a7.977 7.977 0 00-.704 1.217c-.315.675-.111 1.422.363 1.891l.815.806c.05.048.098.147.088.294a6.084 6.084 0 000 .772c.01.147-.038.246-.088.294l-.815.806c-.474.469-.678 1.216-.363 1.891.2.428.436.835.704 1.218.428.609 1.176.806 1.82.63l1.103-.303c.066-.019.176-.011.299.071.213.143.436.272.668.386.133.066.194.158.212.224l.289 1.106c.169.646.715 1.196 1.458 1.26a8.094 8.094 0 001.402 0c.743-.064 1.29-.614 1.458-1.26l.29-1.106c.017-.066.078-.158.211-.224a5.98 5.98 0 00.668-.386c.123-.082.233-.09.3-.071l1.102.302c.644.177 1.392-.02 1.82-.63.268-.382.505-.789.704-1.217.315-.675.111-1.422-.364-1.891l-.814-.806c-.05-.048-.098-.147-.088-.294a6.1 6.1 0 000-.772c-.01-.147.039-.246.088-.294l.814-.806c.475-.469.679-1.216.364-1.891a7.992 7.992 0 00-.704-1.218c-.428-.609-1.176-.806-1.82-.63l-1.103.303c-.066.019-.176.011-.299-.071a5.991 5.991 0 00-.668-.386c-.133-.066-.194-.158-.212-.224L10.16 1.29C9.99.645 9.444.095 8.701.031A8.094 8.094 0 008 0zm1.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11 8a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </span>    
                <InfoBottomItemTitle class="info-bottom-item-title">
                    Assignees
                </InfoBottomItemTitle>
                <div style="margin-bottom:10px" v-for="item in data.assignees.slice(0,21)" :key="item.id">
                    <router-link to="/">
                        <ImgWrapper>
                            <img class="avatar" :src="item.avatar_url" width="20" height="20" :alt="`@${item.login}`"> 
                        </ImgWrapper>
                        <span class="assignee-login">{{item.login}}</span>    
                    </router-link> 
                </div>
                <span v-if="!(data.assignees && data.assignees.length > 0)">No one assigneed</span>    
                <span v-if="data.assignees.length > 21">and others</span>    
            </InfoBottomItem>

             <!-- labels -->
            <InfoBottomItem class="info-bottom-item">
                <span v-if="viewerIsCollaborator().data" @click="() => showModal('applyLabelsModal')" class="float-right">
                    <svg class="octicon octicon-gear" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.429 1.525a6.593 6.593 0 011.142 0c.036.003.108.036.137.146l.289 1.105c.147.56.55.967.997 1.189.174.086.341.183.501.29.417.278.97.423 1.53.27l1.102-.303c.11-.03.175.016.195.046.219.31.41.641.573.989.014.031.022.11-.059.19l-.815.806c-.411.406-.562.957-.53 1.456a4.588 4.588 0 010 .582c-.032.499.119 1.05.53 1.456l.815.806c.08.08.073.159.059.19a6.494 6.494 0 01-.573.99c-.02.029-.086.074-.195.045l-1.103-.303c-.559-.153-1.112-.008-1.529.27-.16.107-.327.204-.5.29-.449.222-.851.628-.998 1.189l-.289 1.105c-.029.11-.101.143-.137.146a6.613 6.613 0 01-1.142 0c-.036-.003-.108-.037-.137-.146l-.289-1.105c-.147-.56-.55-.967-.997-1.189a4.502 4.502 0 01-.501-.29c-.417-.278-.97-.423-1.53-.27l-1.102.303c-.11.03-.175-.016-.195-.046a6.492 6.492 0 01-.573-.989c-.014-.031-.022-.11.059-.19l.815-.806c.411-.406.562-.957.53-1.456a4.587 4.587 0 010-.582c.032-.499-.119-1.05-.53-1.456l-.815-.806c-.08-.08-.073-.159-.059-.19a6.44 6.44 0 01.573-.99c.02-.029.086-.075.195-.045l1.103.303c.559.153 1.112.008 1.529-.27.16-.107.327-.204.5-.29.449-.222.851-.628.998-1.189l.289-1.105c.029-.11.101-.143.137-.146zM8 0c-.236 0-.47.01-.701.03-.743.065-1.29.615-1.458 1.261l-.29 1.106c-.017.066-.078.158-.211.224a5.994 5.994 0 00-.668.386c-.123.082-.233.09-.3.071L3.27 2.776c-.644-.177-1.392.02-1.82.63a7.977 7.977 0 00-.704 1.217c-.315.675-.111 1.422.363 1.891l.815.806c.05.048.098.147.088.294a6.084 6.084 0 000 .772c.01.147-.038.246-.088.294l-.815.806c-.474.469-.678 1.216-.363 1.891.2.428.436.835.704 1.218.428.609 1.176.806 1.82.63l1.103-.303c.066-.019.176-.011.299.071.213.143.436.272.668.386.133.066.194.158.212.224l.289 1.106c.169.646.715 1.196 1.458 1.26a8.094 8.094 0 001.402 0c.743-.064 1.29-.614 1.458-1.26l.29-1.106c.017-.066.078-.158.211-.224a5.98 5.98 0 00.668-.386c.123-.082.233-.09.3-.071l1.102.302c.644.177 1.392-.02 1.82-.63.268-.382.505-.789.704-1.217.315-.675.111-1.422-.364-1.891l-.814-.806c-.05-.048-.098-.147-.088-.294a6.1 6.1 0 000-.772c-.01-.147.039-.246.088-.294l.814-.806c.475-.469.679-1.216.364-1.891a7.992 7.992 0 00-.704-1.218c-.428-.609-1.176-.806-1.82-.63l-1.103.303c-.066.019-.176.011-.299-.071a5.991 5.991 0 00-.668-.386c-.133-.066-.194-.158-.212-.224L10.16 1.29C9.99.645 9.444.095 8.701.031A8.094 8.094 0 008 0zm1.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11 8a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </span>
                <InfoBottomItemTitle class="info-bottom-item-title">
                    Labels
                </InfoBottomItemTitle>
                <router-link class="d-block mt-1" to="/" v-for="item in data.labels.slice(0,21)" :key="item.id">
                    <Label class="width-full" :name="item.name" :color="`#${item.color}`"></Label>      
                </router-link> 
                <span v-if="!(data.labels && data.labels.length > 0)">None yet</span>    
                <span v-if="data.labels.length > 21">and others</span> 
            </InfoBottomItem>

             <!-- milestones -->
            <InfoBottomItem class="info-bottom-item">
                <InfoBottomItemTitle class="info-bottom-item-title">
                    Milestone
                    <svg v-if="data.milestone" class="octicon octicon-gear" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14 8.77v-1.6l-1.94-.64-.45-1.09.88-1.84-1.13-1.13-1.81.91-1.09-.45-.69-1.92h-1.6l-.63 1.94-1.11.45-1.84-.88-1.13 1.13.91 1.81-.45 1.09L0 7.23v1.59l1.94.64.45 1.09-.88 1.84 1.13 1.13 1.81-.91 1.09.45.69 1.92h1.59l.63-1.94 1.11-.45 1.84.88 1.13-1.13-.92-1.81.47-1.09L14 8.75v.02zM7 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path></svg>
                </InfoBottomItemTitle>
                <Progress v-if="data.milestone" :donePercent="data.milestone.closed_issues / (data.milestone.closed_issues + data.milestone.open_issues)"></Progress>
                <router-link to="/" v-if="data.milestone" class="link-gray mt-1 d-block text-bold css-truncate">
                    <strong class="d-inline-block v-align-text-top css-truncate-target">{{data.milestone.title}}</strong>
                </router-link>
                <span v-else>No milestone</span>    
            </InfoBottomItem>

             <!-- notifications -->
            <InfoBottomItem class="info-bottom-item">
                <InfoBottomItemTitle class="info-bottom-item-title d-flex flex-justify-between">
                    Notifications
                    <span class="text-normal">Customize</span>
                </InfoBottomItemTitle>
               <button type="submit" class="btn btn-block d-block width-full d-flex flex-items-center flex-justify-center" data-disable-with="">
                    <span class="mr-2">
                        <svg class="octicon octicon-mute v-align-middle" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2.81v10.38c0 .67-.81 1-1.28.53L3 10H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h2l3.72-3.72C7.19 1.81 8 2.14 8 2.81zm7.53 3.22l-1.06-1.06-1.97 1.97-1.97-1.97-1.06 1.06L11.44 8 9.47 9.97l1.06 1.06 1.97-1.97 1.97 1.97 1.06-1.06L13.56 8l1.97-1.97z"></path></svg> 
                    </span> 
                    Unsubscribe
                </button>
                <span class="mt-1 d-inline-block" v-if="extraData.data.viewerSubscription">You're {{extraData.data.viewerSubscription.toLowerCase()}} to this thread.</span>
            </InfoBottomItem>

            <!-- participants -->
            <InfoBottomItem class="info-bottom-item">
                <InfoBottomItemTitle class="info-bottom-item-title">
                    {{extraData.data.participants && extraData.data.participants.totalCount}} participants
                </InfoBottomItemTitle>
                <div style="margin-bottom:10px" class="d-flex flex-wrap">
                    <router-link to="/" v-for="item in extraData.data.participants ? extraData.data.participants.nodes : []" :key="item.id" class="mt-1 ml-1">
                        <ImgWrapper>
                            <img class="avatar" :src="item.avatarUrl" width="26" height="26" :alt="`@${item.login}`"> 
                        </ImgWrapper>
                    </router-link> 
                </div>
                <span v-if="extraData.data.participants && (extraData.data.participants.totalCount > 21)">and others</span>    
            </InfoBottomItem>
        </InfoBottom>


        <transition name="fade" appear>
            <StickyTop v-if="scrollTop > 300" class="sticky-top px-3 py-2">
                <StickyTopContent class="d-flex flex-items-center flex-justify-between">
                    <State class="State mr-2 d-inline-flex flex-items-center flex-shrink-0" :class="{'State--green':data.state === 'open','State--red':data.state === 'closed'}" style="text-transform:capitalize;">
                        <IssueIcon color="#fff" :issue="data"></IssueIcon>
                        &nbsp;{{data.state}}
                    </State>   

                    <div class="min-width-0">
                        <h1 class="d-flex text-bold f5">
                            <router-link to="/" class="css-truncate css-truncate-target link-gray-dark width-fit">
                                {{data.title}}
                            </router-link>
                            <span class="text-gray-light pl-1 no-wrap text-normal">#{{data.number}}</span>
                        </h1>
                        <div class="meta text-gray-light css-truncate css-truncate-target d-block width-fit f6">
                            <router-link to="/" class="text-bold link-gray">{{data.user && data.user.login}}</router-link>  opened this issue
                            <span class="no-wrap">{{createdAt}}</span>
                            · {{data.comments}} {{data.comments > 1 ? 'comments' : 'comment'}}
                        </div>
                    </div> 

                </StickyTopContent>
            </StickyTop>
        </transition> 
        
        <Modal title="Assign up to 10 people to this issue" ref="chooseAssigneesModal" :modalStyle="{height:'80vh'}" @show="network_getAssignableUsers"> 
             <div v-if="chooseAssigneesModal.assignableUsers.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <SimpleSearchInput v-else class="p-3 modal-search-input border-bottom"
                                placeholder="Filter users" 
                                v-model="chooseAssigneesModal.searchQuery"/>
          
            <transition-group name="fade-group" appear>
                <SelectMenuItem v-for="item in filteredAssignableUsers" :selected="data.assignees.some(i => i.node_id == item.id)" :key="item.login" @click.native="() => network_selectTheAssigneeOrNot(item.id)">
                    <ImgWrapper class="mr-2">
                        <img class="avatar" width="20" height="20" :src="item.avatarUrl">
                    </ImgWrapper>
                    <strong class='mr-1'>{{item.login}}</strong>
                    <span>{{item.name}}</span>    

                    <template v-slot:icon v-if="chooseAssigneesModal.loading.indexOf(item.id) != -1">
                        <TinyLoadingIcon class="mr-2"></TinyLoadingIcon>
                    </template>    
                </SelectMenuItem>
            </transition-group>
        </Modal>

        <Modal title="Apply labels to this issue" ref="applyLabelsModal" :modalStyle="{height:'80vh'}" @show="network_getAvailableLabels">
            <div v-if="applyLabelsModal.labels.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <SimpleSearchInput  v-else 
                                 class="p-3 modal-search-input" 
                                placeholder="Filter labels" 
                                v-model="applyLabelsModal.searchQuery"/>
            <div v-if="!applyLabelsModal.labels.loading && applyLabelsModal.labels.data.length === 0" class="p-3" style="color: #586069;">
                No available labels found. Sorry about that.
            </div>  

            <transition-group name="fade-group" appear style="overflowY:auto">
                <SelectMenuItem v-for="item in filteredAvailableLabels" :iconStyle="{alignSelf:'flex-start'}" :key="item.name" :selected="data.labels.some(i => i.name == item.name)"  @click.native="() => network_applyTheLabelOrNot(item.name)">
                    <div class="d-flex flex-items-start" >
                        <LabelBadge class="avatar mt-1 mr-2 label-badge flex-shrink-0" :style="{background: `#${item.color}`}" />
                        <LabelContent style="min-width:0">
                            <LabelName class="text-bold">{{item.name}}</LabelName>    
                            <LabelDescription v-if="item.description && item.description !== ''" class="label-description">{{item.description}}</LabelDescription>    
                        </LabelContent>
                    </div>

                    <template v-slot:icon v-if="applyLabelsModal.loading.indexOf(item.name) != -1">
                        <TinyLoadingIcon class="mr-2"></TinyLoadingIcon>
                    </template>    
                </SelectMenuItem>
            </transition-group>
        </Modal>
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoadingWrapper,
            Label,
            AnimatedHeightWrapper,
            LoadingIconEx,
            Progress,
            IssueIcon,
            ImgWrapper,
            Modal,
            TinyLoadingIcon,
            SimpleSearchInput,
            SelectMenuItem,
            HiddenItemLoading} from '@/components'
    import {ScrollTopListenerMixin,RouteUpdateAwareMixin} from '@/mixins'
    import {TimelineItem,Comment,ProjectCard,CommentEditor} from './components'
    import {util_dateFormat} from '@/util'
    import {
        authRequiredGet,
        authRequiredAjax,
        authRequiredGitHubGraphqlApiQuery,
        cancelAndUpdateAxiosCancelTokenSource} from '@/network'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import {mapState,mapActions} from 'vuex'
    var parse = require('parse-link-header');
    var parse = require('parse-link-header');
    export default {
        name: 'issueDetail',
        inject: ['owner','repo','viewerIsCollaborator'],
        mixins: [ScrollTopListenerMixin,RouteUpdateAwareMixin],
        provide() {
            return {
                commentExtraDataProvided: () => this.timeline.extraData.data,
                issueGetter: () => Object.assign({},this.data,this.extraData.data)
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
                    pageInfo: {}
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
                chooseAssigneesModal: {
                    searchQuery: '',
                    assignableUsers: {
                        data: [],
                        loading: false
                    },
                    loading: []
                },
                applyLabelsModal: {
                    searchQuery: '',
                    labels: {
                        data: [],
                        loading: false
                    },
                    loading: []
                }
            }
        },
       
        computed: {
            number() {
                return this.$route.params.number
            },
            createdAt() {
                return util_dateFormat.dateFormat('dd zzz yyyy', new Date(this.data.created_at))
            },
            updatedAt() {
                return util_dateFormat.dateFormat('dd zzz yyyy', new Date(this.data.updated_at))
            },
            viewerCannotComment() {
                return this.data.locked && !this.extraData.data.viewerCanUpdate
            },
            documentTitle() {
                if(!this.data.title) return location.href
                return this.data.title
            },
            filteredAssignableUsers() {
                return this.chooseAssigneesModal.assignableUsers.data.filter(i => {
                    return (i.login.toLowerCase().indexOf(this.chooseAssigneesModal.searchQuery.toLowerCase()) != -1) || (i.name && i.name.toLowerCase().indexOf(this.chooseAssigneesModal.searchQuery.toLowerCase()) != -1)
                })
            },
            filteredAvailableLabels() {
                return this.applyLabelsModal.labels.data.filter(i => {
                    return i.name.toLowerCase().indexOf(this.applyLabelsModal.searchQuery.toLowerCase()) != -1
                })
            },
            repoFullName() {
                return `${this.$route.params.owner}/${this.$route.params.repo}`
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            loadingMore() {
                if(this.timeline.loading) return
                this.network_getTimeline({
                    changePage: true
                })
            },
            network_getData() {
                this.network_getIssueRest()
                this.network_getTimeline()
            },
            async network_getIssueRest() {
               
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)

                    let url_issue = api.API_ISSUE(this.$route.params)
                    let res_issue = await authRequiredGet(url_issue,{cancelToken})
                    this.data = res_issue.data
                    this.loading = false
                    if(this.accessToken) this.network_getIssueExtraData()
                }catch(e){
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            async network_getIssueExtraData() {
                try{
                    this.extraData.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_extra_data')
                    let graphql_extraData = graphql.GRAPHQL_ISSUE

                    let res_extraData = await authRequiredGitHubGraphqlApiQuery(
                        graphql_extraData,
                        {
                            cancelToken,
                            variables: {
                                nodeID: this.data.node_id
                            }
                        }
                    )

                    try{
                        this.extraData.data = res_extraData.data.data.node
                    }catch(e) {
                        this.handleGraphqlError(res_extraData)
                    }
                    
                }catch(e) {
                    console.log(e)
                }finally{
                    this.extraData.loading = false
                }
            },
            async network_getTimeline() {
                try{
                    this.timeline.loading = true

                    let url_timeline
                    if(this.timeline.pageInfo.next && this.timeline.pageInfo.next.url) {
                        url_timeline = this.timeline.pageInfo.next.url
                    } else {
                        url_timeline = api.API_ISSUE_TIMELINE(this.$route.params) + `?per_page=${this.timeline.perPage}`
                    }

                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + 'get_timeline')
                 
                    let config = {
                        cancelToken: cancelToken,
                        headers:{
                            'Accept': 'application/vnd.github.mockingbird-preview,application/vnd.github.starfox-preview+json'
                        }   
                    }
                    
                    let res_timeline = await authRequiredGet(url_timeline,config)

                    this.timeline.pageInfo = parse(res_timeline.headers.link)

                    this.timeline.data = this.timeline.data.concat(res_timeline.data)

                    if(this.accessToken) this.network_getTimelineExtraData(res_timeline.data)

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

                    let comments = []
                    timeline.forEach(item => {
                        if(item.event === 'commented') {
                            comments.push(item.node_id)
                        }
                    })

                    let res_issueCommentBodyAndReactions = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_ISSUE_COMMENTS,
                        {
                            cancelToken,
                            variables: {
                                ids: comments
                            }
                        }
                    )
                  
                    try{
                        this.timeline.extraData.data = this.timeline.extraData.data.concat(res_issueCommentBodyAndReactions.data.data.nodes)
                    }catch(e) {
                        this.handleGraphqlError(res_issueCommentBodyAndReactions)
                    }
                }catch(e) {
                    console.log(e)
                }finally{   
                    this.timeline.extraData.loading = false
                }
            },
            async network_getAssignableUsers() {
                if(this.chooseAssigneesModal.assignableUsers.data.length > 0 || this.chooseAssigneesModal.assignableUsers.loading) return
                try{
                    this.chooseAssigneesModal.assignableUsers.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_assignable_users')

                    let pageInfo = undefined
                    let assignableUsers = []

                    while(!pageInfo || pageInfo.hasNextPage) {
                        let res = await authRequiredGitHubGraphqlApiQuery(
                            graphql.GRAPHQL_ASSIGNABLE_USERS,
                            {
                                cancelToken,
                                variables: {
                                    name: this.$route.params.repo,
                                    owner: this.$route.params.owner,
                                    after: pageInfo && pageInfo.endCursor
                                }
                            }
                        )

                        try{
                            assignableUsers = assignableUsers.concat(res.data.data.repository.assignableUsers.nodes)
                            pageInfo =  res.data.data.repository.assignableUsers.pageInfo
                        }catch(e) {
                            this.handleGraphqlError(res)
                        }   
                    }

                    this.chooseAssigneesModal.assignableUsers.data = assignableUsers

                }catch(e) { 
                    this.handleError(e)
                }finally{
                    this.chooseAssigneesModal.assignableUsers.loading = false
                }
            },  
            async network_selectTheAssigneeOrNot(id) {
                if(this.chooseAssigneesModal.loading.indexOf(id) != -1) return 
                if(this.data.assignees.length == 10) {
                    if(!this.data.assignees.some(i => i.node_id == id)) {
                        this.$toast('You can only assign up to 10 people to each issue or pull request.','warn')
                        return 
                    }
                }
                try{
                    this.chooseAssigneesModal.loading.push(id)

                    let graphql_selectTheAssigneeOrNot
                    if(this.data.assignees.some(i => i.node_id == id)) {
                        graphql_selectTheAssigneeOrNot = graphql.GRAPHQL_MUTATION_REMOVE_ASSIGNEES_TO_ASSIGNABLE
                    }else{
                        graphql_selectTheAssigneeOrNot = graphql.GRAPHQL_MUTATION_ADD_ASSIGNEES_TO_ASSIGNABLE
                    }
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql_selectTheAssigneeOrNot,
                        {
                            variables: {
                                assignableId: this.data.node_id,
                                assigneeIds: [id]
                            }
                        }
                    )

                    if(res.data && res.data.errors) this.handleGraphqlError(res)
                    
                    await this.network_getIssueRest()

                    await new Promise((resolve,reject) => {
                        setTimeout(() => {
                            resolve()
                        },3000)
                    })
                }catch(e) {
                    console.log(e)
                }finally{
                    let idx = this.chooseAssigneesModal.loading.indexOf(id)
                    this.chooseAssigneesModal.loading.splice(idx,1)
                }
            },
            async network_applyTheLabelOrNot(labelName) {
                if(this.applyLabelsModal.loading.indexOf(labelName) != -1) return 
                try{
                    this.applyLabelsModal.loading.push(labelName)
                    
                    let res 

                    if(this.data.labels.some(i => i.name == labelName)) {
                        let url = api.API_REMOVE_LABELS_TO_ISSUE({
                            ...this.$route.params,
                            number: this.data.number,
                            label: labelName
                        })

                        res = await authRequiredAjax(
                            url,
                            {
                                labels: [labelName]
                            },
                            'delete'
                        )
                    }else{

                        let url = api.API_ADD_LABELS_TO_ISSUE({
                            ...this.$route.params,
                            number: this.data.number
                        })

                        res = await authRequiredAjax(
                            url,
                            {
                                labels: [labelName]
                            },
                            'post'
                        )
                    }

                    this.data.labels = res.data

                }catch(e) {
                    this.handleError(e)
                }finally{
                     let idx = this.applyLabelsModal.loading.indexOf(labelName)
                    this.applyLabelsModal.loading.splice(idx,1)
                }
            },
            async network_getAvailableLabels() {
                if(this.applyLabelsModal.labels.data.length > 0) return 
                if(this.applyLabelsModal.labels.loading) return 
                try{
                    this.applyLabelsModal.labels.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_available_labels')
                    let url = api.API_REPOSITORY_LABELS({
                        ...this.$route.params,
                        params: {
                            per_page: 100
                        }
                    })
                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken
                        }
                    )

                    this.applyLabelsModal.labels.data = res.data
                }catch(e) {
                    console.log(e)
                }finally{
                    this.applyLabelsModal.labels.loading = false
                }
            },
    
        },
        watch: {
            repoFullName() {
                this.chooseAssigneesModal.assignableUsers.data = []
                this.applyLabelsModal.labels.data = []
            }
        },
        components: {
            CommonLoadingWrapper,
            Label,
            Comment,
            TimelineItem,
            HiddenItemLoading,
            LoadingIconEx,
            ImgWrapper,
            AnimatedHeightWrapper,   
            Progress,
            IssueIcon,
            ProjectCard,
            CommentEditor,
            Modal,
            SimpleSearchInput,
            TinyLoadingIcon,
            SelectMenuItem,
            Container: styled.div``,
            Header: styled.div``,
            HeaderActions: styled.div``,
            HeaderTitle: styled.h1``,
            HeaderMeta: styled.div``,
            State: styled.div``,
            MetaContent: styled.div``,
            Info: styled.div``,
            Labels: styled.div``,
            LoadingTimeline: styled.div``,
            InfoBottom: styled.div``,
            InfoBottomItem: styled.div``,
            InfoBottomItemTitle: styled.div``,
            StickyTop: styled.div``,
            StickyTopContent: styled.div``,
            LabelBadge: styled.div``,
            LabelContent: styled.div``,
            LabelName: styled.div``,
            LabelDescription: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/labels/index.scss';
@import 'node_modules/@primer/css/layout/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
.title{
    margin-bottom: 0;
    font-weight: 400;
    line-height: 1.125;
    .number{
        font-weight: 300;
        color: #6a737d;
    }
}

.header-meta{
    font-size: 14px;
    color: #586069;
    .meta-content{
        word-wrap: break-word;
        white-space: normal;
    }
}
.loading-timeline{
    height: 200px;
}

.info-bottom-item:first-child{
     margin-top: 0px;
    border-top: 0px;
}

.info-bottom-item{
    padding-top: 16px;
    font-size: 12px;
    color: #586069;
    margin-top: 16px;
    border-top: 1px solid #e1e4e8;
    .info-bottom-item-title{
        margin-bottom: 8px;
        font-size: 12px;
        color: #586069;
        font-weight: 600!important;
        svg{
            float: right;
            color: #959da5;
            margin-top: 2px;
        }
        
    }

    .assignee-login{
            max-width: 110px;
            display: inline-block;
            vertical-align: top;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: 600;
            color: #24292e;
            font-size: 12px;
        }
    
}

.sticky-top{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 109;
    display: block;
    background-color: #fff;
    border-bottom: 1px solid rgba(0,0,0,.15);
}

.label-badge{
    display: inline-block;
    width: 1em;
    height: 1em;
    vertical-align: middle;
    border: 1px solid rgba(27,31,35,.15);
    border-radius: 3px;
}
</style>