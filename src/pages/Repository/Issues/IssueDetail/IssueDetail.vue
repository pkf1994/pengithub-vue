


<template>
    <CommonLoadingWrapper :loading="loading || timeline.loading || timeline.extraData.loading" :position="loading ? 'center' : 'corner'" class="px-3 bg-white flex-grow-1">
        

        <IssueHeader :data="data" :viewerCanUpdate="extraData.data.viewerCanUpdate" :issueUpdateFunc="network_updateIssue"></IssueHeader>
        

        <Info  class="border-bottom border-top pt-3 mt-3" 
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
      
        <IssueBody  :data="data"
                    style="padding-top:0px!important;margin-top:16px;"
                    :extraData="extraData.data" 
                    :issueUpdateFunc="network_updateIssue"
                    @quote="quoteReply"
                    :loading="extraData.loading"/>
                
        <LoadingTimeline v-if="data.node_id && timeline.data.length == 0 && timeline.loading" class="loading-timeline d-flex flex-items-center flex-justify-center">
            <LoadingIconEx/>
        </LoadingTimeline>

        <transition-group tag="div" appear name="fade">
            <TimelineItem v-for="(item,index) in handledTimelines" 
                    :data="item" :key="(item.id || '') + index"
                    @comment-deleted.native="commentDeletedHook"
                    @quote="quoteReply" 
                    @unminimize-comment="unminimizeCommentPostHook"
                    @update-comment="updateCommentPostHook"
                    @minimize-comment="minimizeCommentPostHook"/>
        </transition-group>

        <LoadMore v-if="timeline.pageInfo.next" :loading="timeline.loading" :dataGetter="network_getTimeline" :hiddenItemCount="timelineRemainedCount"></LoadMore>

        <transition-group tag="div" appear name="fade">
            <TimelineItem v-for="(item,index) in newCreatedTimelines" 
                        :data="item" :key="(item.id || '') + index"
                        @quote="quoteReply" 
                        @unminimize-comment="unminimizeCommentPostHook"
                        @update-comment="updateCommentPostHook"
                        @minimize-comment="minimizeCommentPostHook"/>
        </transition-group>

        <CommentCreatePane class="mb-5 comment-create-edit-pane" 
                        ref="commentEditor"
                        @comment-created="createCommentPostHook"
                        @issue-closed="closeIssuePostHook"
                        v-if="data.id"
                        :locked="this.data.locked"
                        :viewerDidAuthor="extraData.data.viewerDidAuthor" 
                        :lockedReason="extraData.data.activeLockReason" 
                        :viewerIsCollaborator="viewerIsCollaborator().data"></CommentCreatePane>

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
                <router-link class="mt-1 mr-1" to="/" v-for="item in data.labels.slice(0,21)" :key="item.id">
                    <Label :name="item.name" :color="`#${item.color}`"></Label>      
                </router-link> 
                <span v-if="!(data.labels && data.labels.length > 0)">None yet</span>    
                <span v-if="data.labels.length > 21">and others</span> 
            </InfoBottomItem>

             <!-- milestones -->
            <InfoBottomItem class="info-bottom-item">
                <span v-if="viewerIsCollaborator().data" @click="() => showModal('setMilestoneModal')" class="float-right">
                    <svg class="octicon octicon-gear" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.429 1.525a6.593 6.593 0 011.142 0c.036.003.108.036.137.146l.289 1.105c.147.56.55.967.997 1.189.174.086.341.183.501.29.417.278.97.423 1.53.27l1.102-.303c.11-.03.175.016.195.046.219.31.41.641.573.989.014.031.022.11-.059.19l-.815.806c-.411.406-.562.957-.53 1.456a4.588 4.588 0 010 .582c-.032.499.119 1.05.53 1.456l.815.806c.08.08.073.159.059.19a6.494 6.494 0 01-.573.99c-.02.029-.086.074-.195.045l-1.103-.303c-.559-.153-1.112-.008-1.529.27-.16.107-.327.204-.5.29-.449.222-.851.628-.998 1.189l-.289 1.105c-.029.11-.101.143-.137.146a6.613 6.613 0 01-1.142 0c-.036-.003-.108-.037-.137-.146l-.289-1.105c-.147-.56-.55-.967-.997-1.189a4.502 4.502 0 01-.501-.29c-.417-.278-.97-.423-1.53-.27l-1.102.303c-.11.03-.175-.016-.195-.046a6.492 6.492 0 01-.573-.989c-.014-.031-.022-.11.059-.19l.815-.806c.411-.406.562-.957.53-1.456a4.587 4.587 0 010-.582c.032-.499-.119-1.05-.53-1.456l-.815-.806c-.08-.08-.073-.159-.059-.19a6.44 6.44 0 01.573-.99c.02-.029.086-.075.195-.045l1.103.303c.559.153 1.112.008 1.529-.27.16-.107.327-.204.5-.29.449-.222.851-.628.998-1.189l.289-1.105c.029-.11.101-.143.137-.146zM8 0c-.236 0-.47.01-.701.03-.743.065-1.29.615-1.458 1.261l-.29 1.106c-.017.066-.078.158-.211.224a5.994 5.994 0 00-.668.386c-.123.082-.233.09-.3.071L3.27 2.776c-.644-.177-1.392.02-1.82.63a7.977 7.977 0 00-.704 1.217c-.315.675-.111 1.422.363 1.891l.815.806c.05.048.098.147.088.294a6.084 6.084 0 000 .772c.01.147-.038.246-.088.294l-.815.806c-.474.469-.678 1.216-.363 1.891.2.428.436.835.704 1.218.428.609 1.176.806 1.82.63l1.103-.303c.066-.019.176-.011.299.071.213.143.436.272.668.386.133.066.194.158.212.224l.289 1.106c.169.646.715 1.196 1.458 1.26a8.094 8.094 0 001.402 0c.743-.064 1.29-.614 1.458-1.26l.29-1.106c.017-.066.078-.158.211-.224a5.98 5.98 0 00.668-.386c.123-.082.233-.09.3-.071l1.102.302c.644.177 1.392-.02 1.82-.63.268-.382.505-.789.704-1.217.315-.675.111-1.422-.364-1.891l-.814-.806c-.05-.048-.098-.147-.088-.294a6.1 6.1 0 000-.772c-.01-.147.039-.246.088-.294l.814-.806c.475-.469.679-1.216.364-1.891a7.992 7.992 0 00-.704-1.218c-.428-.609-1.176-.806-1.82-.63l-1.103.303c-.066.019-.176.011-.299-.071a5.991 5.991 0 00-.668-.386c-.133-.066-.194-.158-.212-.224L10.16 1.29C9.99.645 9.444.095 8.701.031A8.094 8.094 0 008 0zm1.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11 8a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </span>
                <InfoBottomItemTitle class="info-bottom-item-title">
                    Milestone
                </InfoBottomItemTitle>
                <Progress v-if="data.milestone" :donePercent="data.milestone.closed_issues / (data.milestone.closed_issues + data.milestone.open_issues) * 100"></Progress>
                <router-link to="/" v-if="data.milestone" class="link-gray mt-1 d-block text-bold css-truncate">
                    <strong class="d-inline-block v-align-text-top css-truncate-target">{{data.milestone.title}}</strong>
                </router-link>
                <span v-else>No milestone</span>    
            </InfoBottomItem>

             <!-- notifications -->
            <InfoBottomItem class="info-bottom-item" v-if="accessToken">
                <IssueNotificationSettingPane :viewerSubscriptionInfo="extraData.data"></IssueNotificationSettingPane>
            </InfoBottomItem>

            <!-- participants -->
            <InfoBottomItem class="info-bottom-item">
                <InfoBottomItemTitle class="info-bottom-item-title">
                    {{extraData.data.participants && extraData.data.participants.totalCount}} participants
                </InfoBottomItemTitle>
                <div style="margin-bottom:10px" class="d-flex flex-wrap">
                    <router-link :to="`/${item.login}`" v-for="item in extraData.data.participants ? extraData.data.participants.nodes : []" :key="item.id" class="mt-1 ml-1">
                        <ImgWrapper class="avatar" style="border-radius: 2em" >
                            <img class="avatar" style="border-radius: 2em" :src="item.avatarUrl" width="26" height="26" :alt="`@${item.login}`"> 
                        </ImgWrapper>
                    </router-link> 
                </div>
                <span v-if="extraData.data.participants && (extraData.data.participants.totalCount > 21)">and others</span>    
            </InfoBottomItem>
        </InfoBottom>

        <IssueHandle class="my-4 border-top" v-if="data.id && viewerIsCollaborator().data">
            <LockIssueButton class="mt-3" 
            v-if="extraData.data.viewerCanUpdate" 
            @change-lock-status-success="changeLockStatusSuccessPostHandler"
            :disabled="loading || extraData.loading" 
            :issue="data"></LockIssueButton>
            <div v-if="!data.locked" class="text-bold link-gray-dark pt-3" @click="() => showModal('transferIssueModal')">
                <svg class="octicon octicon-arrow-right" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.22 2.97a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06l2.97-2.97H3.75a.75.75 0 010-1.5h7.44L8.22 4.03a.75.75 0 010-1.06z"></path></svg>
                <strong>Transfer issue</strong>
            </div> 
            <div class="text-bold link-gray-dark pt-3" @click="() => showModal('deleteIssueModal')" >
                <svg class="octicon octicon-trashcan" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zm4.5 0V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.496 6.675a.75.75 0 10-1.492.15l.66 6.6A1.75 1.75 0 005.405 15h5.19c.9 0 1.652-.681 1.741-1.576l.66-6.6a.75.75 0 00-1.492-.149l-.66 6.6a.25.25 0 01-.249.225h-5.19a.25.25 0 01-.249-.225l-.66-6.6z"></path></svg>
                <strong>Delete issue</strong>
            </div> 
           <!--  <div class="text-bold link-gray-dark pt-3" @click="() => showModal('deleteIssueModal')" >
                <svg class="octicon octicon-pin" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4.456.734a1.75 1.75 0 012.826.504l.613 1.327a3.081 3.081 0 002.084 1.707l2.454.584c1.332.317 1.8 1.972.832 2.94L11.06 10l3.72 3.72a.75.75 0 11-1.061 1.06L10 11.06l-2.204 2.205c-.968.968-2.623.5-2.94-.832l-.584-2.454a3.081 3.081 0 00-1.707-2.084l-1.327-.613a1.75 1.75 0 01-.504-2.826L4.456.734zM5.92 1.866a.25.25 0 00-.404-.072L1.794 5.516a.25.25 0 00.072.404l1.328.613A4.582 4.582 0 015.73 9.63l.584 2.454a.25.25 0 00.42.12l5.47-5.47a.25.25 0 00-.12-.42L9.63 5.73a4.581 4.581 0 01-3.098-2.537L5.92 1.866z"></path></svg>
                <strong>Pin issue</strong>
            </div>  -->
        </IssueHandle>

        <StickyTop :data="data"></StickyTop>    
        
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

                
            <router-link v-if="!applyLabelsModal.labels.loading" :to="`/${owner}/${repo}/labels`" class="py-3 d-block text-gray border-top labels-page-link bg-white">
                <span>
                    <svg class="octicon octicon-pencil mr-1 label-options-icon" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.249.249 0 00.108-.064l6.286-6.286z"></path></svg>
                </span>  
                <span class="select-menu-item-text f6">Edit labels</span>
            </router-link>
        </Modal>

        <Modal title="Set milestone" ref="setMilestoneModal" :modalStyle="{height:'80vh'}" @show="network_getAvailableMilestones"> 
            <div v-if="setMilestoneModal.milestones.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <SimpleSearchInput v-else class="p-3 modal-search-input"
                                placeholder="Filter users" Milestones
                                v-model="setMilestoneModal.searchQuery"/>
            <div class="set-milestone-modal-tabs" v-if="!setMilestoneModal.milestones.loading">
                <button type="button" class="set-milestone-modal-tabs-btn" :class="{'tab-active':setMilestoneModal.state == 'open'}" @click="() => triggerSetMilestoneModalTab('open')">Open</button>
                <button type="button" class="set-milestone-modal-tabs-btn" :class="{'tab-active':setMilestoneModal.state == 'closed'}" @click="() => triggerSetMilestoneModalTab('closed')">Closed</button>
            </div>
            <transition-group name="fade-group" appear>
                <SelectMenuItem v-for="item in filteredAvailableMilestones" :selected="data.milestone && (data.milestone.number == item.number)" :key="item.number" @click.native="() => network_setMilestone(item.number)">
                    <div>
                        <span class="milestone-title">{{item.title}}</span>
                        <span class="milestone-description">{{item.description}}</span>
                    </div> 

                    <template v-slot:icon v-if="setMilestoneModal.loading && setMilestoneModal.settingMilestoneNumber == item.number">
                        <TinyLoadingIcon class="mr-2"></TinyLoadingIcon>
                    </template>    
                </SelectMenuItem>
            </transition-group>

            <EmptyNotice v-if="filteredAvailableMilestones.length == 0 && !setMilestoneModal.milestones.loading" class="p-3">
                Nothing to show.
            </EmptyNotice>
        </Modal>

        <Modal title="Notification settings" ref="notificationSettingsModal" :modalStyle="{maxHeight:'80vh'}"> 
            <transition-group name="fade-group" appear>
                <SelectMenuItem v-for="item in notificationSettingsModal.availableSubscriptionSettings" :key="item.title" :iconStyle="{alignSelf:'flex-start'}" :selected="extraData.data.viewerSubscription == item.value" @click.native="() => network_setSubscription(data.node_id,item.value)">
                    <div>
                        <span class="milestone-title">{{item.title}}</span>
                        <span class="milestone-description">{{item.description}}</span>
                    </div> 

                    <template v-slot:icon v-if="notificationSettingsModal.loading && notificationSettingsModal.settingSubscription == item.value">
                        <TinyLoadingIcon class="mr-2"></TinyLoadingIcon>
                    </template>    
                </SelectMenuItem>
            </transition-group>
        </Modal>

        <Modal title="Transfer this issue" ref="transferIssueModal" :modalStyle="{height:'80vh'}" @show="network_getAvailableTransferTargetRepositories"> 
            <div v-if="transferIssueModal.availableRepositories.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <SimpleSearchInput v-else class="p-3 modal-search-input"
                                placeholder="Find a repository" Milestones
                                v-model="transferIssueModal.searchQuery"/>
            <div style="overflowY: auto">
                <transition-group name="fade-group" appear>
                    <SelectMenuItem v-for="item in filteredTransferTargetRepositories" 
                                    :key="item.id" 
                                    :iconStyle="{alignSelf:'flex-start'}" 
                                    :selected="transferIssueModal.selectedRepository == item.id" 
                                    @click.native="() => selectTransferTargetRepository(item.id)">
                        <div class="flex-grow-1">
                            <span>
                                <svg v-if="item.isPrivate" class="octicon octicon-lock float-right mr-3" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 4v2h-.25A1.75 1.75 0 002 7.75v5.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-5.5A1.75 1.75 0 0012.25 6H12V4a4 4 0 10-8 0zm6.5 2V4a2.5 2.5 0 00-5 0v2h5zM12 7.5h.25a.25.25 0 01.25.25v5.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-5.5a.25.25 0 01.25-.25H12z"></path></svg>
                            </span>    
                            <span class="milestone-title">{{item.name}}</span>
                            <span class="milestone-description">{{item.description}}</span>
                        </div> 
                    </SelectMenuItem>
                </transition-group>
            </div>
           
            <div class="Box-footer bg-white border-top modal-footer" v-if="!transferIssueModal.availableRepositories.loading">
                <button class="btn btn-block" :disabled="transferIssueModal.loading || !transferIssueModal.selectedRepository" @click="network_transferIssue">
                    {{transferIssueModal.loading ? 'Trying...' : 'Transfer issue'}}
                </button>
            </div>
        </Modal>

        <Modal title="Delete this issue" ref="deleteIssueModal" :modalStyle="{maxHeight:'80vh'}"> 
            <div class="d-flex flex-column p-3 flex-items-center bg-white">
                <svg class="octicon octicon-circle-slash text-red ml-1" height="40" width="40" viewBox="0 0 24 24" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12A9.5 9.5 0 0112 2.5c2.353 0 4.507.856 6.166 2.273L4.773 18.166A9.462 9.462 0 012.5 12zm3.334 7.227A9.462 9.462 0 0012 21.5a9.5 9.5 0 009.5-9.5 9.462 9.462 0 00-2.273-6.166L5.834 19.227z"></path></svg>
                <h4 class="mt-4 text-center">Are you sure you want to delete this issue?</h4>
                <div class="col-9 mx-auto mt-1 mb-2">
                    <ul class="text-left">
                    <li>This cannot be undone</li>
                    <li>Only administrators can delete issues</li>
                    <li>Deletion will remove the issue from search and previous references will point to a placeholder</li>
                    </ul>
                </div>
            </div>
            <div class="Box-footer bg-white border-top modal-footer">
                <button class="btn text-red btn-block" :disabled="deleteIssueModal.loading" @click="network_deleteIssue">
                    {{deleteIssueModal.loading ? 'Deleting issue...' : 'Delete this issue.'}}
                </button>
            </div>
        </Modal>
        
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoadingWrapper,
            Label,
            AnimatedWidthWrapper,
            AnimatedHeightWrapper,
            LoadingIconEx,
            Progress,
            IssueIcon,
            ImgWrapper,
            Modal,
            TinyLoadingIcon,
            SimpleSearchInput,
            SelectMenuItem,
            HyperlinkWrapper,
            SkeletonCircle,
            SkeletonRectangle,
            HiddenItemLoading} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {TimelineItem,IssueBody,ProjectCard,CommentCreatePane,LoadMore,IssueHeader,StickyTop} from './components'
    import {Comment} from './components/TimelineItem/components'
    import {IssueNotificationSettingPane,LockIssueButton} from '../../components'
    import {util_dateFormat} from '@/util'
    import {
        authRequiredGet,
        authRequiredPatch,
        authRequiredAjax,
        authRequiredGitHubGraphqlApiQuery,
        cancelAndUpdateAxiosCancelTokenSource} from '@/network'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import {mapState,mapActions} from 'vuex'
    var parse = require('parse-link-header');
    export default {
        name: 'issueDetail',
        inject: ['repoBasicInfo','viewerIsCollaborator','repoSubscription'],
        mixins: [RouteUpdateAwareMixin],
        provide() {
            return {
                deletedCommentsProvided: () => this.deletedComments,
                commentExtraDataProvided: () => this.timeline.extraData.data,
                timelineExtraDataProvided: () => this.timeline.extraData.data,
                timelineItemDeletedHook: () => this.timelineItemDeletedHook,
                issue: () => Object.assign({},this.data,this.extraData.data),
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
                },
                setMilestoneModal: {
                    searchQuery: '',
                    state: 'open',
                    milestones: {
                        data: [],
                        loading: false
                    },
                    loading: false,
                    settingMilestoneNumber: undefined
                },
                notificationSettingsModal: {
                    settingSubscription: undefined,
                    loading: false,
                    availableSubscriptionSettings: [
                        {
                            title: 'Not subscribed',
                            description: 'Only receive notifications from this issue when you have participated or have been @mentioned.',
                            value: 'UNSUBSCRIBED'
                        },
                        {
                            title: 'Subscribed',
                            description: 'Receive all notifications from this issue.',
                            value: 'SUBSCRIBED'
                        },
                        {
                            title: 'Ignored',
                            description: 'Never receive notifications from this issue.',
                            value: 'IGNORED'
                        },
                    ]
                },
                transferIssueModal: {
                    searchQuery: '',
                    availableRepositories: {
                        data: [],
                        loading: false
                    },
                    selectedRepository: undefined,
                    loading: false
                },
                deleteIssueModal: {
                    loading: false
                },
                createdComments: [],
                deletedComments: [],
                isDynamicDocumentTitle: true,
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
                    return i.name.toLowerCase().indexOf(this.applyLabelsModal.searchQuery.toLowerCase()) != -1 || (i.description && i.description.toLowerCase().indexOf(this.applyLabelsModal.searchQuery.toLowerCase()) != -1)
                })
            },
            filteredAvailableMilestones() {
                let searchQuery = this.setMilestoneModal.searchQuery.toLowerCase()
                return this.setMilestoneModal.milestones.data.filter(i => {
                    return i.state == this.setMilestoneModal.state && (i.title.toLowerCase().indexOf(searchQuery) != -1 || i.description.toLowerCase().indexOf(searchQuery) != -1)
                })
            },
            repoFullName() {
                return `${this.$route.params.owner}/${this.$route.params.repo}`
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
                    /* let handledTimeline = []
                    let prev
                    timeline.forEach((i,index) => {
                        if(prev && prev.event == 'committed' && i.event == 'committed') {
                           if(handledTimeline[handledTimeline.length - 1] 
                                    && handledTimeline[handledTimeline.length - 1].event == 'committed-group' ) {
                                    handledTimeline[handledTimeline.length - 1].commits.push(i)
                                }else{
                                     handledTimeline[handledTimeline.length - 1] = {
                                        ...prev,
                                        event: 'committed-group',
                                        commits: [prev,i]
                                    }
                                }   
                                if(handledTimeline[handledTimeline.length - 1].author.name != i.author.name) {
                                    handledTimeline[handledTimeline.length - 1].moreThanOneAuthor = true
                                }
                        }else if(prev 
                                    && prev.event == 'review_requested' 
                                    && i.event == 'review_requested'
                                    && prev.review_requester.login == i.review_requester.login) {
                            if(handledTimeline[handledTimeline.length - 1] 
                                && handledTimeline[handledTimeline.length - 1].event == 'review_requested_group' ) {
                                    handledTimeline[handledTimeline.length - 1].requested_reviewers.push(i.requested_reviewer || i.requested_team)
                                }else{
                                     handledTimeline[handledTimeline.length - 1] = {
                                        ...prev,
                                        event: 'review_requested_group',
                                        requested_reviewers: [prev.requested_reviewer || prev.requested_team,i.requested_reviewer || i.requested_team]
                                    }
                                }   
                        }else if(prev 
                                    && prev.event == 'commented' 
                                    && i.event == 'commented'
                                    && prev.user.login == i.user.login
                                    && prev.body == i.body) {
                            if(handledTimeline[handledTimeline.length - 1] 
                                && handledTimeline[handledTimeline.length - 1].event == 'similar_comment' ) {
                                    handledTimeline[handledTimeline.length - 1].comments.push(i)
                                }else{
                                     handledTimeline[handledTimeline.length - 1] = {
                                        ...prev,
                                        event: 'similar_comment',
                                        comments: [prev,i]
                                    }
                                }   
                        }else{
                            handledTimeline.push(i)
                        }
                        prev = i
                    })
                    return handledTimeline */
                }catch(e) {
                    console.log(e)
                }
                
            },
            handleSimilarCommentTimeline() {
                let mergedTimelineData = []
                let lastOne = {}
                this.timeline.data.forEach(item => {
                    //console.log(lastOne)
                    switch(item.event) {
                        case 'commented': 
                            if(lastOne.event === 'commented' && lastOne.user.login === item.user.login && lastOne.body === item.body) {
                                mergedTimelineData.push({
                                    id: item.id,
                                    event:'similar_comment',
                                    comments: [item]
                                })
                                lastOne = mergedTimelineData[mergedTimelineData.length - 1]
                            }else if(lastOne.event === 'similar_comment' && lastOne.comments[0].user.login === item.user.login && lastOne.comments[0].body === item.body){
                                mergedTimelineData[mergedTimelineData.length - 1].comments.push(item)
                                lastOne = mergedTimelineData[mergedTimelineData.length - 1]
                            }else{
                                mergedTimelineData.push(item)
                                lastOne = item
                            }
                            break
                        default:
                            mergedTimelineData.push(item)
                            lastOne = item
                    }
                })
                return mergedTimelineData
            },
            newCreatedTimelines() {

                let deDuplicatedAllNewCreatedTimelines = []

                let magicArray = [
                    ...this.timeline.newestTimelines.data,
                ]
                magicArray.forEach(i => {
                    if(!deDuplicatedAllNewCreatedTimelines.some(i_ => i_.created_at == i.created_at)) {
                        deDuplicatedAllNewCreatedTimelines.push(i)
                    }
                })
                return deDuplicatedAllNewCreatedTimelines
            },
            noMoreTimelineToLoad() {
                if(!this.timeline.pageInfo.next) return true
                return this.timeline.restCount.data <= (this.timeline.data.length + this.timeline.newestTimelines.data.length)
            },
            repoOwnerType() {
                return this.repoBasicInfo().owner && this.repoBasicInfo().owner.type
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            network_getData() {
                this.network_getIssueRest()
                this.network_getTimeline()
                this.network_getTimelineRestCount()
                if(this.accessToken) this.network_getTimelineGraphqlCount()
            },
            async network_getIssueRest() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)

                    let url_issue = api.API_ISSUE(this.$route.params)
                    let res_issue = await authRequiredGet(
                        url_issue,
                        {
                            cancelToken,
                            headers: {
                                "Accept": "application/vnd.github.squirrel-girl-preview"
                            }
                        }
                    )
                    
                    //处理一种情况：当前issue已经被transfer到另外一个仓库
                    if(res_issue.data.url.replace("https://api.github.com/repos","") != this.$route.path) {
                        this.$router.replace(res_issue.data.url.replace("https://api.github.com/repos",""))
                    }
                    this.data = res_issue.data
                    this.loading = false
                    if(this.accessToken) this.network_getIssueExtraData()
                }catch(e){
                    this.handleError(e)
                    if(e.response && e.response.status == 404) {
                        this.emitNotFoundEvent(this.$el)
                    }
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

                    this.timeline.pageInfo = parse(res_timeline.headers.link) || {}

                    if(this.timeline.bufferTimeline.data.length > 0) {
                        this.timeline.data = this.timeline.data.concat(this.timeline.bufferTimeline.data)
                        this.timeline.bufferTimeline.data = []
                    }

                    this.timeline.data = this.timeline.data.concat(res_timeline.data)

                    if(this.accessToken) this.network_getTimelineExtraData(res_timeline.data)

                    if(this.timeline.pageInfo.next && this.timeline.pageInfo.next.page == 2) {
                        await this.network_getNewestTimelines()
                    }

                    



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

                    let timelineIds = []
                    timeline.forEach(item => {
                        if(item.event === 'commented' || item.event == 'comment_deleted') {
                            timelineIds.push(item.node_id)
                        }
                    })

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

                    let url = api.API_ISSUE_TIMELINE({
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
            async network_getAvailableMilestones() {
                if(this.setMilestoneModal.milestones.loading) return 
                if(this.setMilestoneModal.milestones.data.length > 0) return 
                try{ 
                    this.setMilestoneModal.milestones.loading = true

                    let pageInfo
                    let milestones = []
                    let url 
                    while(!pageInfo || (pageInfo && pageInfo.next)) {
                        if(pageInfo) {
                            url = pageInfo.next.url
                        }else{
                            url = api.API_REPOSITORY_MILESTONES({
                                ...this.$route.params,
                                params: {
                                    per_page: 100,
                                }
                            })
                        }

                        let res = await authRequiredGet(url)

                        milestones = milestones.concat(res.data)
                        pageInfo = parse(res.headers.link) || {}
                    }
                    
                    this.setMilestoneModal.milestones.data = milestones

                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.setMilestoneModal.milestones.loading = false
                }
            },
            async network_setMilestone(number) {
                if(this.setMilestoneModal.loading) return 
                if(!this.accessToken) return 
                if(!this.viewerIsCollaborator().data) return 
                try{
                    this.setMilestoneModal.loading = true
                    this.setMilestoneModal.settingMilestoneNumber = number

                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' set_milestone')
                    let url = api.API_ISSUE(this.$route.params)

                    let res = await authRequiredAjax(
                        url,
                        {
                            milestone: number
                        },
                        'patch'
                    )
                    
                    this.data = res.data
                }catch(e) {
                    console.log(e)
                }finally{
                    this.setMilestoneModal.loading = false
                }
            },
            async network_setSubscription(subscribableId,state) {
                if(this.notificationSettingsModal.loading) return
                if(!this.accessToken) return
                try{
                    this.notificationSettingsModal.loading = true
                    this.notificationSettingsModal.settingSubscription = state

                    let result = await this.github_updateSubscrption(this.data.node_id,state)   

                    this.extraData.data.viewerSubscription = result
                    console.log(result)
                }catch(e) {
                    this.handleError(e)
                  
                }finally{
                    this.notificationSettingsModal.loading = false
                }
            },
            async network_getAvailableTransferTargetRepositories() {
                this.transferIssueModal.selectedRepository = undefined
                if(this.transferIssueModal.availableRepositories.data.length > 0) return
                if(this.transferIssueModal.availableRepositories.loading) return 
                try{
                    this.transferIssueModal.availableRepositories.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_available_transfer_target_repositories')

                    let pageInfo
                    let repositories = []
                    
                    while(!pageInfo || pageInfo.hasNextPage) {
                        let res = await authRequiredGitHubGraphqlApiQuery(
                            graphql.GRAPHQL_QUERY_VIEWER_REPOSTIORIES,
                            {
                                cancelToken,
                                variables: {
                                    after: pageInfo && pageInfo.endCursor
                                }
                            }
                        )
                        try{
                            repositories = repositories.concat(res.data.data.viewer.repositories.nodes)
                            pageInfo = res.data.data.viewer.repositories.pageInfo
                        }catch(e) {
                            this.handleGraphqlError(res)
                        }
                    }

                    this.transferIssueModal.availableRepositories.data = repositories
                   
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.transferIssueModal.availableRepositories.loading = false
                }
            },
            async network_transferIssue() {
                if(this.transferIssueModal.loading) return 
                try{
                    this.transferIssueModal.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' transfer_issue')
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_MUTATION_TRANSFER_ISSUE,
                        {
                            cancelToken,
                            variables: {
                                issueId: this.data.node_id,
                                repositoryId: this.transferIssueModal.selectedRepository
                            }
                        }
                    )
                    this.closeModal()
                    this.$router.push(res.data.data.transferIssue.issue.resourcePath)
                    this.topNoticeShow('repository','This issue was transferred here.')
                }catch(e){
                    this.handleError(e)
                }finally{
                    this.transferIssueModal.loading = false
                }
            },
            async network_deleteIssue() {
                if(this.deleteIssueModal.loading) return
                try{
                    this.deleteIssueModal.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' delete_issue')
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_MUTATION_DELETE_ISSUE,
                        {
                            cancelToken,
                            variables: {
                                issueId: this.data.node_id
                            }
                        }
                    )
                    this.handleGraphqlError(res)
                    this.$router.replace(`/${this.owner}/${this.repo}/issues?delete=${this.data.id}`)
                    this.topNoticeShow('repository','The issue was successfully deleted.')
                }catch(e) { 
                    this.handleError(e)
                }finally{
                    this.deleteIssueModal.loading = false
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
                    let url = api.API_ISSUE_TIMELINE({
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
            async timelineItemDeletedHook() {
                //console.log("commentDeletedHook")
                if(this.noMoreTimelineToLoad) return
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
            triggerSubscription() {
                if(this.extraData.data.viewerSubscription == 'SUBSCRIBED') {
                    this.network_setSubscription('UNSUBSCRIBED')
                }else{
                    this.network_setSubscription('SUBSCRIBED')
                }
            },
            triggerSetMilestoneModalTab(payload) {
                this.setMilestoneModal.state = payload
            },
            selectTransferTargetRepository(payload) {
                this.transferIssueModal.selectedRepository = payload
            },
            quoteReply(e) {
                let commentCreateOrEditPaneTextarea = document.querySelector('textarea')
                commentCreateOrEditPaneTextarea.focus()
                commentCreateOrEditPaneTextarea.value = commentCreateOrEditPaneTextarea.value + e
                commentCreateOrEditPaneTextarea.dispatchEvent(new Event('input'))
            },
            createCommentPostHook(payload) {
                this.createdComments.push(payload)
                this.network_getTimelineExtraData([{...payload,event:'commented'}])
            },
            closeIssuePostHook(payload) {
                this.data = payload
                this.network_getIssueExtraData()
                this.timeline.extraData = []
                this.network_getTimelineExtraData(this.timeline.data)
            },
            minimizeCommentPostHook(payload) {
                let theComment = this.timeline.extraData.data.filter(i => i.id == payload.comment.node_id)[0]
                if(theComment) {
                    Object.assign(theComment,payload.info)
                }
            },
            unminimizeCommentPostHook(payload) {
                let theComment = this.timeline.extraData.data.filter(i => i.id == payload.comment.node_id)[0]
                if(theComment) {
                    Object.assign(theComment,payload.info)
                }
            },
            updateCommentPostHook(payload) {
                let theComment = this.timeline.data.filter(i => i.id == payload.id)[0]
                if(theComment) {
                    Object.assign(theComment,payload)
                }
            },
            changeLockStatusSuccessPostHandler(payload) {
                this.data.locked = payload
            }
        },
        watch: {
            repoFullName() {
                this.chooseAssigneesModal.assignableUsers.data = []
                this.applyLabelsModal.labels.data = []
                this.setMilestoneModal.milestones.data = []
                this.transferIssueModal.availableRepositories.data = []
            },
        },
        components: {
            IssueHeader,
            CommonLoadingWrapper,
            Label,
            Comment,
            IssueBody,
            TimelineItem,
            HiddenItemLoading,
            LoadingIconEx,
            ImgWrapper,
            AnimatedHeightWrapper,   
            AnimatedWidthWrapper,
            Progress,
            IssueIcon,
            ProjectCard,
            CommentCreatePane,
            Modal,
            SimpleSearchInput,
            TinyLoadingIcon,
            SelectMenuItem,
            HyperlinkWrapper,
            Label,
            LoadMore,
            SkeletonCircle,
            SkeletonRectangle,
            IssueNotificationSettingPane,
            LockIssueButton,
            StickyTop,
            Container: styled.div``,
            TitleEditPane: styled.div``,
            Header: styled.div``,
            HeaderActions: styled.div``,
            HeaderTitle: styled.h1``,
            HeaderMeta: styled.div``,
            State: styled.div``,
            MetaContent: styled.div``,
            Info: styled.div``,
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
            LabelsPageLink: styled.div``,
            EmptyNotice: styled.div``,
            IssueHandle: styled.div``,
            Skeleton: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/labels/index.scss';
@import 'node_modules/@primer/css/layout/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/truncate/index.scss';
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

.label-badge{
    display: inline-block;
    width: 1em;
    height: 1em;
    vertical-align: middle;
    border: 1px solid rgba(27,31,35,.15);
    border-radius: 3px;
}

.labels-page-link{
    position:sticky;
    top: 0;
    padding-left: 40px;
}

.milestone-title{
    display: block;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 600;
}

.milestone-description{
    display: block;
    max-width: 265px;
    font-size: 12px;
    color: #586069;
}

.set-milestone-modal-tabs-btn{
    display: inline-block;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 600;
    color: #6a737d;
    text-decoration: none;
    cursor: pointer;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 3px 3px 0 0;
}

.tab-active{
        color: #24292e;
    background-color: #fff;
    border-color: #dfe2e5 #dfe2e5 #fff;
}

.modal-footer {
    position: sticky;
    top: 100%;
}

</style>