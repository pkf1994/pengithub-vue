


<template>
    <div>
        <InfoBottom v-if="data.id">
            <slot></slot> 

            <!-- assignee -->
            <InfoBottomItem class="info-bottom-item">
                <span v-if="viewerCanManageIssue()" @click="() => showModal('chooseAssigneesModal')" class="float-right">
                    <svg class="octicon octicon-gear" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.429 1.525a6.593 6.593 0 011.142 0c.036.003.108.036.137.146l.289 1.105c.147.56.55.967.997 1.189.174.086.341.183.501.29.417.278.97.423 1.53.27l1.102-.303c.11-.03.175.016.195.046.219.31.41.641.573.989.014.031.022.11-.059.19l-.815.806c-.411.406-.562.957-.53 1.456a4.588 4.588 0 010 .582c-.032.499.119 1.05.53 1.456l.815.806c.08.08.073.159.059.19a6.494 6.494 0 01-.573.99c-.02.029-.086.074-.195.045l-1.103-.303c-.559-.153-1.112-.008-1.529.27-.16.107-.327.204-.5.29-.449.222-.851.628-.998 1.189l-.289 1.105c-.029.11-.101.143-.137.146a6.613 6.613 0 01-1.142 0c-.036-.003-.108-.037-.137-.146l-.289-1.105c-.147-.56-.55-.967-.997-1.189a4.502 4.502 0 01-.501-.29c-.417-.278-.97-.423-1.53-.27l-1.102.303c-.11.03-.175-.016-.195-.046a6.492 6.492 0 01-.573-.989c-.014-.031-.022-.11.059-.19l.815-.806c.411-.406.562-.957.53-1.456a4.587 4.587 0 010-.582c.032-.499-.119-1.05-.53-1.456l-.815-.806c-.08-.08-.073-.159-.059-.19a6.44 6.44 0 01.573-.99c.02-.029.086-.075.195-.045l1.103.303c.559.153 1.112.008 1.529-.27.16-.107.327-.204.5-.29.449-.222.851-.628.998-1.189l.289-1.105c.029-.11.101-.143.137-.146zM8 0c-.236 0-.47.01-.701.03-.743.065-1.29.615-1.458 1.261l-.29 1.106c-.017.066-.078.158-.211.224a5.994 5.994 0 00-.668.386c-.123.082-.233.09-.3.071L3.27 2.776c-.644-.177-1.392.02-1.82.63a7.977 7.977 0 00-.704 1.217c-.315.675-.111 1.422.363 1.891l.815.806c.05.048.098.147.088.294a6.084 6.084 0 000 .772c.01.147-.038.246-.088.294l-.815.806c-.474.469-.678 1.216-.363 1.891.2.428.436.835.704 1.218.428.609 1.176.806 1.82.63l1.103-.303c.066-.019.176-.011.299.071.213.143.436.272.668.386.133.066.194.158.212.224l.289 1.106c.169.646.715 1.196 1.458 1.26a8.094 8.094 0 001.402 0c.743-.064 1.29-.614 1.458-1.26l.29-1.106c.017-.066.078-.158.211-.224a5.98 5.98 0 00.668-.386c.123-.082.233-.09.3-.071l1.102.302c.644.177 1.392-.02 1.82-.63.268-.382.505-.789.704-1.217.315-.675.111-1.422-.364-1.891l-.814-.806c-.05-.048-.098-.147-.088-.294a6.1 6.1 0 000-.772c-.01-.147.039-.246.088-.294l.814-.806c.475-.469.679-1.216.364-1.891a7.992 7.992 0 00-.704-1.218c-.428-.609-1.176-.806-1.82-.63l-1.103.303c-.066.019-.176.011-.299-.071a5.991 5.991 0 00-.668-.386c-.133-.066-.194-.158-.212-.224L10.16 1.29C9.99.645 9.444.095 8.701.031A8.094 8.094 0 008 0zm1.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11 8a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </span>    
                <InfoBottomItemTitle class="info-bottom-item-title">
                    Assignees
                </InfoBottomItemTitle>
                <div style="margin-bottom:10px" v-for="item in data.assignees.slice(0,21)" :key="item.id">
                    <router-link to="/">
                        <ImgWrapper class="avatar avatar-user">
                            <img class="avatar avatar-user" :src="item.avatar_url" width="20" height="20" :alt="`@${item.login}`"> 
                        </ImgWrapper>
                        <span class="assignee-login">{{item.login}}</span>    
                    </router-link> 
                </div>
                <span v-if="!(data.assignees && data.assignees.length > 0)">No one assigneed</span>    
                <span v-if="data.assignees.length > 21">and others</span>    
            </InfoBottomItem>

             <!-- labels -->
            <InfoBottomItem class="info-bottom-item">
                <span v-if="viewerCanManageIssue()" @click="() => showModal('applyLabelsModal')" class="float-right">
                    <svg class="octicon octicon-gear" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.429 1.525a6.593 6.593 0 011.142 0c.036.003.108.036.137.146l.289 1.105c.147.56.55.967.997 1.189.174.086.341.183.501.29.417.278.97.423 1.53.27l1.102-.303c.11-.03.175.016.195.046.219.31.41.641.573.989.014.031.022.11-.059.19l-.815.806c-.411.406-.562.957-.53 1.456a4.588 4.588 0 010 .582c-.032.499.119 1.05.53 1.456l.815.806c.08.08.073.159.059.19a6.494 6.494 0 01-.573.99c-.02.029-.086.074-.195.045l-1.103-.303c-.559-.153-1.112-.008-1.529.27-.16.107-.327.204-.5.29-.449.222-.851.628-.998 1.189l-.289 1.105c-.029.11-.101.143-.137.146a6.613 6.613 0 01-1.142 0c-.036-.003-.108-.037-.137-.146l-.289-1.105c-.147-.56-.55-.967-.997-1.189a4.502 4.502 0 01-.501-.29c-.417-.278-.97-.423-1.53-.27l-1.102.303c-.11.03-.175-.016-.195-.046a6.492 6.492 0 01-.573-.989c-.014-.031-.022-.11.059-.19l.815-.806c.411-.406.562-.957.53-1.456a4.587 4.587 0 010-.582c.032-.499-.119-1.05-.53-1.456l-.815-.806c-.08-.08-.073-.159-.059-.19a6.44 6.44 0 01.573-.99c.02-.029.086-.075.195-.045l1.103.303c.559.153 1.112.008 1.529-.27.16-.107.327-.204.5-.29.449-.222.851-.628.998-1.189l.289-1.105c.029-.11.101-.143.137-.146zM8 0c-.236 0-.47.01-.701.03-.743.065-1.29.615-1.458 1.261l-.29 1.106c-.017.066-.078.158-.211.224a5.994 5.994 0 00-.668.386c-.123.082-.233.09-.3.071L3.27 2.776c-.644-.177-1.392.02-1.82.63a7.977 7.977 0 00-.704 1.217c-.315.675-.111 1.422.363 1.891l.815.806c.05.048.098.147.088.294a6.084 6.084 0 000 .772c.01.147-.038.246-.088.294l-.815.806c-.474.469-.678 1.216-.363 1.891.2.428.436.835.704 1.218.428.609 1.176.806 1.82.63l1.103-.303c.066-.019.176-.011.299.071.213.143.436.272.668.386.133.066.194.158.212.224l.289 1.106c.169.646.715 1.196 1.458 1.26a8.094 8.094 0 001.402 0c.743-.064 1.29-.614 1.458-1.26l.29-1.106c.017-.066.078-.158.211-.224a5.98 5.98 0 00.668-.386c.123-.082.233-.09.3-.071l1.102.302c.644.177 1.392-.02 1.82-.63.268-.382.505-.789.704-1.217.315-.675.111-1.422-.364-1.891l-.814-.806c-.05-.048-.098-.147-.088-.294a6.1 6.1 0 000-.772c-.01-.147.039-.246.088-.294l.814-.806c.475-.469.679-1.216.364-1.891a7.992 7.992 0 00-.704-1.218c-.428-.609-1.176-.806-1.82-.63l-1.103.303c-.066.019-.176.011-.299-.071a5.991 5.991 0 00-.668-.386c-.133-.066-.194-.158-.212-.224L10.16 1.29C9.99.645 9.444.095 8.701.031A8.094 8.094 0 008 0zm1.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11 8a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </span>
                <InfoBottomItemTitle class="info-bottom-item-title">
                    Labels
                </InfoBottomItemTitle>
                <router-link class="mt-1 mr-1" to="/" v-for="item in data.labels.slice(0,21)" :key="item.id">
                    <Label :name="item.name" :color="`#${item.color}`" style="margin-bottom:2px"></Label>      
                </router-link> 
                <span v-if="!(data.labels && data.labels.length > 0)">None yet</span>    
                <span v-if="data.labels.length > 21">and others</span> 
            </InfoBottomItem>

             <!-- milestones -->
            <InfoBottomItem class="info-bottom-item">
                <span v-if="viewerCanManageIssue()" @click="() => showModal('setMilestoneModal')" class="float-right">
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
                <IssueNotificationSettingPane :viewerSubscriptionInfo="data"></IssueNotificationSettingPane>
            </InfoBottomItem>

            <!-- participants -->
            <InfoBottomItem class="info-bottom-item">
                <InfoBottomItemTitle class="info-bottom-item-title">
                    {{data.participants && data.participants.totalCount}} participants
                </InfoBottomItemTitle>
                <div style="margin-bottom:10px" class="d-flex flex-wrap">
                    <router-link :to="`/${item.login}`" v-for="item in data.participants ? data.participants.nodes : []" :key="item.id" class="mt-1 ml-1">
                        <ImgWrapper class="avatar avatar-user" style="border-radius: 2em" >
                            <img class="avatar avatar-user" style="border-radius: 2em" :src="item.avatarUrl" width="26" height="26" :alt="`@${item.login}`"> 
                        </ImgWrapper>
                    </router-link> 
                </div>
                <span v-if="data.participants && (data.participants.totalCount > 21)">and others</span>    
            </InfoBottomItem>
        </InfoBottom>

        <Modal title="Assign up to 10 people to this issue" ref="chooseAssigneesModal" :modalStyle="{height:'80vh'}" @show="network_getAssignableUsers" :loading="chooseAssigneesModal.assignableUsers.loading"> 
            <SimpleSearchInput class="p-3 modal-search-input border-bottom"
                                placeholder="Filter users" 
                                v-model="chooseAssigneesModal.searchQuery"/>
          
            <transition-group name="fade-group" appear> 
                <button v-if="data.assignees && data.assignees.length > 0" :disabled="chooseAssigneesModal.loadingClearAssignees || chooseAssigneesModal.loading.length > 0" class="width-full d-flex clear-assignees-btn flex-items-center" key="clear assignees button" @click="network_clearAssignees">
                    <TinyLoadingIcon class="loading-icon" v-if="chooseAssigneesModal.loadingClearAssignees"></TinyLoadingIcon>
                    <svg v-else class="octicon octicon-x" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>
                    <div class="select-menu-item-text">{{chooseAssigneesModal.loadingClearAssignees ? 'Trying...' : 'Clear assignees'}}</div>
                </button>
                <button v-for="item in filteredAssignableUsers" class="d-block width-full px-0" :key="item.login" @click="() => network_selectTheAssigneeOrNot(item)" :disabled="chooseAssigneesModal.loading.indexOf(item.login) != -1">
                    <SelectMenuItem :selected="data.assignees.some(i => i.id == item.id)">
                        <ImgWrapper class="mr-2 avatar avatar-user">
                            <img class="avatar avatar-user" width="20" height="20" :src="item.avatar">
                        </ImgWrapper>
                        <strong class='mr-1'>{{item.login}}</strong>
                        <span>{{item.name}}</span>    
                        

                        <template v-slot:icon v-if="chooseAssigneesModal.loading.indexOf(item.login) != -1">
                            <TinyLoadingIcon class="mr-2"></TinyLoadingIcon>
                        </template>    
                    </SelectMenuItem>
                </button>
               
            </transition-group>
        </Modal>

        <Modal title="Apply labels to this issue" ref="applyLabelsModal" :modalStyle="{height:'80vh'}" @show="network_getAvailableLabels" :loading="applyLabelsModal.labels.loading">
            <SimpleSearchInput  v-if="!applyLabelsModal.labels.loading" 
                                 class="p-3 modal-search-input border-bottom" 
                                placeholder="Filter labels" 
                                v-model="applyLabelsModal.searchQuery"/>
            <div v-if="!applyLabelsModal.labels.loading && applyLabelsModal.labels.data.length === 0" class="p-3" style="color: #586069;">
                No available labels found. Sorry about that.
            </div>  

            <transition-group name="fade-group" class="flex-grow-1" appear style="overflowY:auto">
                <SelectMenuItem v-for="item in filteredAvailableLabels" 
                                class="border-bottom"
                                :iconStyle="{alignSelf:'flex-start'}" 
                                :key="item.name" 
                                :selected="data.labels.some(i => i.name == item.name)"  
                                @click.native="() => network_applyTheLabelOrNot(item.name)">
                    <div class="d-flex flex-items-start" >
                        <LabelBadge class="avatar avatar-user mt-1 mr-2 label-badge flex-shrink-0" :style="{background: `#${item.color}`}" />
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

            <button v-if="filteredAvailableLabels.length == 0 && applyLabelsModal.searchQuery" class="create-label-btn text-left" @click="showCreateLabelModal"> 
                Create new label "{{applyLabelsModal.searchQuery}}"
            </button>
            <router-link v-if="!applyLabelsModal.labels.loading" :to="`/${owner}/${repo}/labels`" class="py-3 d-block text-gray border-top labels-page-link bg-white" >
                <span>
                    <svg class="octicon octicon-pencil mr-1 label-options-icon" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.249.249 0 00.108-.064l6.286-6.286z"></path></svg>
                </span>  
                <span class="select-menu-item-text f6">Edit labels</span>
            </router-link>

            <Modal title="Create new label" ref="createLabelModal" :modalStyle="{maxWidth: '85vw'}">
                <div class="px-3 pt-3" style="margin-bottom:-8px;font-size:12px;font-weight:600" >
                    Preview
                </div>
                <LabelEditor style="font-size:12px;" v-model="applyLabelsModal.createLabelData" :labelNameError="applyLabelsModal.labelNameError">
                    <button @click="network_createLabel" class="btn btn-primary" type="submit" :disabled="!createdLabelSubmitable || applyLabelsModal.loadingCreateLabel || applyLabelsModal.labelNameError">
                        {{applyLabelsModal.loadingCreateLabel ? 'Saving...' : 'Save'}}
                    </button>
                </LabelEditor>
            </Modal>   
        </Modal>

        <Modal title="Set milestone" ref="setMilestoneModal" :modalStyle="{height:'80vh'}" @show="network_getAvailableMilestones" :loading="setMilestoneModal.milestones.loading"> 
            <SimpleSearchInput  v-if="!setMilestoneModal.milestones.loading" 
                                class="p-3 modal-search-input"
                                placeholder="Filter users" Milestones
                                v-model="setMilestoneModal.searchQuery"/>
            <div class="set-milestone-modal-tabs" v-if="!setMilestoneModal.milestones.loading">
                <button type="button" class="set-milestone-modal-tabs-btn" :class="{'tab-active':setMilestoneModal.state == 'open'}" @click="() => triggerSetMilestoneModalTab('open')">Open</button>
                <button type="button" class="set-milestone-modal-tabs-btn" :class="{'tab-active':setMilestoneModal.state == 'closed'}" @click="() => triggerSetMilestoneModalTab('closed')">Closed</button>
            </div>
             <button v-if="data.milestone && setMilestoneModal.milestones.data.length > 0 && setMilestoneModal.state == 'open'" 
                        :disabled="setMilestoneModal.loadingClearMilestone" 
                        class="width-full d-flex clear-assignees-btn flex-items-center border-bottom" 
                        @click="network_clearMilestone">
                <TinyLoadingIcon class="loading-icon" v-if="setMilestoneModal.loadingClearMilestone"></TinyLoadingIcon>
                <svg v-else class="octicon octicon-x" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>
                <div class="select-menu-item-text">{{setMilestoneModal.loadingClearMilestone ? 'Trying...' : 'Clear this milestone'}}</div>
            </button>
            <transition-group name="fade-group" appear>
                
                <SelectMenuItem v-for="item in filteredAvailableMilestones" 
                                class="border-bottom"
                                :iconStyle="{alignSelf:'flex-start'}" 
                                :selected="data.milestone && (data.milestone.number == item.number)" 
                                :key="item.number" 
                                @click.native="() => network_setMilestone(item.number)">
                    <div>
                        <span class="milestone-title">{{item.title}}</span>
                        <span class="milestone-description">{{item.description}}</span>
                    </div> 

                    <template v-slot:icon v-if="setMilestoneModal.loading && setMilestoneModal.settingMilestoneNumber == item.number">
                        <TinyLoadingIcon class="mr-2"></TinyLoadingIcon>
                    </template>    
                </SelectMenuItem>
            </transition-group>

            <EmptyNotice v-if="filteredAvailableMilestones.length == 0 && !setMilestoneModal.milestones.loading" class="p-3 bg-white">
                Nothing to show.
            </EmptyNotice>
        </Modal>

        <Modal title="Notification settings" ref="notificationSettingsModal" :modalStyle="{maxHeight:'80vh'}" > 
            <transition-group name="fade-group" appear>
                <SelectMenuItem v-for="item in notificationSettingsModal.availableSubscriptionSettings" :key="item.title" :iconStyle="{alignSelf:'flex-start'}" :selected="data.viewerSubscription == item.value" @click.native="() => network_setSubscription(data.node_id,item.value)">
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

        
    </div>
</template>

<script>
    import styled from 'vue-styled-components'
    import {
            Label,
            LoadingIconEx,
            Progress,
            ImgWrapper,
            Modal,
            TinyLoadingIcon,
            SimpleSearchInput,
            SelectMenuItem,
            HyperlinkWrapper
        } from '@/components'
    import {LabelEditor} from '../../../Labels/components'
    import IssueNotificationSettingPane from './IssueNotificationSettingPane.vue'
    import {util_throttle} from '@/util'
    import {
        commonGet,
        authRequiredGet,
        authRequiredDelete, 
        authRequiredPost, 
        authRequiredPatch,
        authRequiredGitHubGraphqlApiQuery,
        cancelAndUpdateAxiosCancelTokenSource} from '@/network'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    var parse = require('parse-link-header');
    export default {
        inject: ['repoBasicInfo','viewerCanManageIssue'],
        props: {
            data: {
                type: Object,
                required: true
            }
        },

        data() {
            return {
                //bodyHTML reactions viewerAssociation
                extraData: {
                    data: {},
                    loading: false
                },
                chooseAssigneesModal: {
                    searchQuery: '',
                    assignableUsers: {
                        data: [],
                        loading: false
                    },
                    loading: [],
                    loadingClearAssignees: false
                },
                applyLabelsModal: {
                    searchQuery: '',
                    labels: {
                        data: [],
                        loading: false
                    },
                    loading: [],
                    createLabelData: {
                        name: '',
                        color: '',
                        description: ''
                    },
                    labelNameError: false,
                    loadingCreateLabel: false
                },
                setMilestoneModal: {
                    searchQuery: '',
                    state: 'open',
                    milestones: {
                        data: [],
                        loading: false
                    },
                    loading: false,
                    settingMilestoneNumber: undefined,
                    loadingClearMilestone: false
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

                deleteIssueModal: {
                    loading: false
                },
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
            createdLabelSubmitable() {
                if(!this.applyLabelsModal.createLabelData.name) return
                if(!this.applyLabelsModal.createLabelData.color) return
                let colorNumber = parseInt(this.applyLabelsModal.createLabelData.color.replace('#',''),16)
                if(colorNumber > 16777215 || colorNumber < 0) return
                return true
            },
        },
       
        methods: {
            async network_getAssignableUsers() {
                if(this.chooseAssigneesModal.assignableUsers.data.length > 0 || this.chooseAssigneesModal.assignableUsers.loading) return
                try{
                    this.chooseAssigneesModal.assignableUsers.loading = true

                    let url = api.API_REPOSITORY_ISSUES_AVAILABLE_ASSIGNEES({
                            repo: this.repo,
                            owner: this.owner,
                            number: this.number,
                        })
                    let res = await commonGet(
                        url,
                        {
                            cancelToken: cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_assignable_users').cancelToken,
                            headers: {
                            'accept': 'application/json'
                        }}
                    )

                    this.chooseAssigneesModal.assignableUsers.data = res.data.users

                }catch(e) { 
                    this.handleError(e)
                }finally{
                    this.chooseAssigneesModal.assignableUsers.loading = false
                }
            },  
            async network_selectTheAssigneeOrNot(assignee) {
                if(this.chooseAssigneesModal.loading.indexOf(assignee.login) != -1) return 
                if(this.chooseAssigneesModal.loadingClearAssignees) return 
                 if(this.data.assignees.length == 10) {
                    if(!this.data.assignees.some(i => i.login == assignee.login)) {
                        this.$toast('You can only assign up to 10 people to each issue or pull request.','warn')
                        return 
                    }
                }
                try{
                    this.chooseAssigneesModal.loading.push(assignee.login)

                    let url = api.API_ISSUE_ASSIGNEES_ACTION({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number
                    })

                    let res

                    if(this.data.assignees.some(i => i.id == assignee.id)) {
                        res = await authRequiredDelete(
                            url,
                            {
                                data: {
                                    assignees: [assignee.login]
                                }
                            }
                        )
                    }else{
                        res = await authRequiredPost(
                            url,
                            {
                                assignees: [assignee.login]
                            }
                        )
                    }
                    
                    this.$el.dispatchEvent(new CustomEvent('issue-updated',{bubbles:true,detail:res.data}))

                    this.$el.dispatchEvent(new CustomEvent('new-timeline-item-created',{bubbles:true,detail:{
                        event: 'assigned',
                        actor: this.viewer,
                        assignee,
                        id: (new Date()).getTime()
                    }}))
                }catch(e) {
                    console.log(e)
                }finally{
                    let idx = this.chooseAssigneesModal.loading.indexOf(assignee.login)
                    this.chooseAssigneesModal.loading.splice(idx,1)
                }
            },
            async network_clearAssignees() {
                 try{
                    this.chooseAssigneesModal.loadingClearAssignees = true

                    let url = api.API_ISSUE_ASSIGNEES_ACTION({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number
                    })

                    let res = await authRequiredPost(
                        url,
                        {
                            assignees: this.data.assignees.map(i => i.login)
                        }
                    )
                    
                    this.$el.dispatchEvent(new CustomEvent('issue-updated',{bubbles:true,detail:res.data}))
                }catch(e) {
                    console.log(e)
                }finally{
                    this.chooseAssigneesModal.loadingClearAssignees = false
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

                        res = await authRequiredDelete(
                            url,
                            {
                                data: {labels: [labelName]}
                            },
                        )

                        this.$el.dispatchEvent(new CustomEvent('issue-updated',{bubbles:true,detail:{
                            ...this.data,
                            labels: res.data
                        }}))

                        this.$el.dispatchEvent(new CustomEvent('new-timeline-item-created',{bubbles:true,detail:{
                            event: 'unlabeled',
                            created_at: (new Date()).toISOString(),
                            label: this.applyLabelsModal.labels.data.filter(i => i.name == labelName)[0],
                            id: (new Date()).getTime(),
                            issueLabels: res.data,
                            actor: this.viewer
                        }}))
                    }else{

                        let url = api.API_ADD_LABELS_TO_ISSUE({
                            ...this.$route.params,
                            number: this.data.number
                        })

                        res = await authRequiredPost(
                            url,
                            {
                                labels: [labelName]
                            },
                        )

                        this.$el.dispatchEvent(new CustomEvent('issue-updated',{bubbles:true,detail:{
                            ...this.data,
                            labels: res.data
                        }}))

                        this.$el.dispatchEvent(new CustomEvent('new-timeline-item-created',{bubbles:true,detail:{
                            event: 'labeled',
                            created_at: (new Date()).toISOString(),
                            label: this.applyLabelsModal.labels.data.filter(i => i.name == labelName)[0],
                            id: (new Date()).getTime(),
                            issueLabels: res.data,
                            actor: this.viewer
                        }}))
                    }

                    //this.$el.dispatchEvent(new CustomEvent('labels-updated',{bubbles:true,detail:res.data}))

                    //this.data.labels = res.data

                }catch(e) {
                    this.handleError(e)
                }finally{
                    let idx = this.applyLabelsModal.loading.indexOf(labelName)
                    this.applyLabelsModal.loading.splice(idx,1)
                }
            },
            async network_getAvailableLabels() {
                this.applyLabelsModal.searchQuery = ''
                if(this.applyLabelsModal.labels.data.length > 0) return 
                if(this.applyLabelsModal.labels.loading) return 
                try{
                    this.applyLabelsModal.labels.loading = true
                    let cancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_available_labels').cancelToken
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
                if(number == this.data.milestone.number) return
                try{
                    this.setMilestoneModal.loading = true
                    this.setMilestoneModal.settingMilestoneNumber = number

                    let cancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' set_milestone').cancelToken
                    let url = api.API_ISSUE(this.$route.params)

                    let res = await authRequiredPatch(
                        url,
                        {
                            milestone: number
                        },
                    )

                    if(this.data.milestone) {
                        this.$el.dispatchEvent(new CustomEvent('new-timeline-item-created',{bubbles:true,detail:{
                            event: 'demilestoned',
                            created_at: (new Date()).toISOString(),
                            id: (new Date()).getTime(),
                            milestone: this.data.milestone,
                            actor: this.viewer
                        }}))
                    }
                    
                    this.$el.dispatchEvent(new CustomEvent('issue-updated',{bubbles:true,detail:{
                        milestone: res.data.milestone,
                    }}))

                    this.$el.dispatchEvent(new CustomEvent('new-timeline-item-created',{bubbles:true,detail:{
                        event: 'milestoned',
                        created_at: (new Date()).toISOString(),
                        id: (new Date()).getTime() + 1,
                        milestone: res.data.milestone,
                        actor: this.viewer
                    }}))
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

                    //this.data.viewerSubscription = result

                    this.$el.dispatchEvent(new CustomEvent('issue-extra-updated',{bubbles:true,detail: {viewerSubscription:result}}))

                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.notificationSettingsModal.loading = false
                }
            },
             async network_createLabel() {
                if(this.applyLabelsModal.loadingCreateLabel) return 
                if(!this.accessToken) return
                try{
                    this.applyLabelsModal.loadingCreateLabel = true
                    let cancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' create_label').cancelToken
                    let url = api.API_REPOSITORY_LABELS(this.$route.params)
                    let res = await authRequiredPost(
                        url,
                        {
                            cancelToken,
                            name: this.applyLabelsModal.createLabelData.name,
                            color: this.applyLabelsModal.createLabelData.color.replace('#',''),
                            description: this.applyLabelsModal.createLabelData.description,
                        },
                    )

                    this.applyLabelsModal.labels.data.unshift(res.data)
                    
                    this.closeModal('createLabelModal')

                    this.applyLabelsModal.searchQuery = ''

                }catch(e) {
                    handleError(e)
                }finally{
                    this.applyLabelsModal.loadingCreateLabel = false
                }
            },
            async network_checkIfLabelNameHasBeenTaken() {
                try {
                    
                    let u = api.API_HANDLE_LABEL({
                        repo: this.repo,
                        owner: this.owner,
                        label: this.applyLabelsModal.createLabelData.name
                    })

                    await authRequiredGet(
                        u,
                        {
                            cancelToken: cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' check_if_label_name_has_been_taken').cancelToken
                        }
                    )

                    this.applyLabelsModal.labelNameError = true
                } catch (e) {
                    console.log(e) 
                    this.applyLabelsModal.labelNameError = false
                } 
            },
            async network_clearMilestone() {
                if(this.setMilestoneModal.loadingClearMilestone) return 
                if(!this.accessToken) return 
                try{
                    this.setMilestoneModal.loadingClearMilestone = true

                    let cancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' clear_milestone').cancelToken
                    let url = api.API_ISSUE(this.$route.params)

                    let res = await authRequiredPatch(
                        url,
                        {
                            milestone: null
                        },
                    )
                    
                    this.$el.dispatchEvent(new CustomEvent('issue-updated',{bubbles:true,detail:{milestone: undefined}}))

                    this.$el.dispatchEvent(new CustomEvent('new-timeline-item-created',{bubbles:true,detail:{
                        event: 'demilestoned',
                        created_at: (new Date()).toISOString(),
                        id: (new Date()).getTime(),
                        milestone: this.data.milestone,
                        actor: this.viewer
                    }}))
                }catch(e) {
                    console.log(e)
                }finally{
                    this.setMilestoneModal.loadingClearMilestone = false
                }
            },
            triggerSubscription() {
                if(this.data.viewerSubscription == 'SUBSCRIBED') {
                    this.network_setSubscription('UNSUBSCRIBED')
                }else{
                    this.network_setSubscription('SUBSCRIBED')
                }
            },
            triggerSetMilestoneModalTab(payload) {
                this.setMilestoneModal.state = payload
            },
            showCreateLabelModal() {
                this.applyLabelsModal.createLabelData.name = this.applyLabelsModal.searchQuery
                this.showModal('createLabelModal')
            }
        },
        watch: {
            repoFullName() {
                this.chooseAssigneesModal.assignableUsers.data = []
                this.applyLabelsModal.labels.data = []
                this.setMilestoneModal.milestones.data = []
            },
            'applyLabelsModal.createLabelData.name': function(newOne,oldOne) {
                this.applyLabelsModal.labelNameError = false
                util_throttle.throttleByDelay(this.network_checkIfLabelNameHasBeenTaken,500,this)
            }  
        },
        components: {
            Label,
            LoadingIconEx,
            ImgWrapper,
            Progress,
            Modal,
            SimpleSearchInput,
            TinyLoadingIcon,
            SelectMenuItem,
            HyperlinkWrapper,
            Label,
            IssueNotificationSettingPane,
            LabelEditor,
            State: styled.div``,
            InfoBottom: styled.div``,
            InfoBottomItem: styled.div``,
            InfoBottomItemTitle: styled.div``,
            LabelBadge: styled.div``,
            LabelContent: styled.div``,
            LabelName: styled.div``,
            LabelDescription: styled.div``,
            EmptyNotice: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/avatars/index.scss';
/* @import 'node_modules/@primer/css/labels/index.scss';
@import 'node_modules/@primer/css/layout/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/truncate/index.scss'; */

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

.set-milestone-modal-tabs {
    padding-left: 10px;
    border-bottom: 1px solid #dfe2e5;
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
        margin-bottom: -1px;
    }

}

.tab-active{
    color: #24292e!important;
    background-color: #fff!important;
    border-color: #dfe2e5 #dfe2e5 #fff!important;
}

.octicon-gear{
    color: rgb(149, 157, 165);
}

.clear-assignees-btn{
    padding-top: 16px;
    padding-bottom: 16px;
    padding-left: 46px;
    font-size: 12px;
    background: white;
    svg, .loading-icon{
        margin-left: -30px;
        margin-right: 8px;
    }
}

.create-label-btn{
    padding-top: 16px;
    padding-bottom: 16px;
    padding-left: 40px;
    font-size: 12px;
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

</style>