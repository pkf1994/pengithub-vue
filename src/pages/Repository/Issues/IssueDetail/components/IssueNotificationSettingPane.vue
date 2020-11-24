<template>
    <Container>
        <div class=" d-flex flex-justify-between">
                <span class="text-bold">Notifications</span>    
                <button v-if="repoOwnerType &&  repoOwnerType != 'Organization'" class="text-normal" @click="() => showModal('notificationSettingsModal')">Customize</button>
        </div>
         <div class="main mt-1" v-if="accessToken">
            <button  @click="triggerSubscription" :disabled="notificationSettingsModal.loading || repoOwnerType == 'Organization' || !viewerSubscriptionInfo.id" class="btn btn-block d-block width-full d-flex flex-items-center flex-justify-center">
                <span class="d-flex flex-items-center" v-if="!notificationSettingsModal.loading">
                    <svg class="octicon octicon-mute mr-1" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2.81v10.38c0 .67-.81 1-1.28.53L3 10H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h2l3.72-3.72C7.19 1.81 8 2.14 8 2.81zm7.53 3.22l-1.06-1.06-1.97 1.97-1.97-1.97-1.06 1.06L11.44 8 9.47 9.97l1.06 1.06 1.97-1.97 1.97 1.97 1.06-1.06L13.56 8l1.97-1.97z"></path></svg> 
                    <span class="v-align-top">
                        {{viewerSubscriptionInfo.viewerSubscription == 'SUBSCRIBED' ? 'Unsubscribe' : 'Subscribe'}}
                    </span>    
                </span>
                <span v-else>
                    Updating...
                </span>    
            </button>
            <span class="mt-1 d-inline-block" v-if="viewerSubscriptionInfo.viewerSubscription">
                You're {{viewerSubscriptionInfo.viewerSubscription.toLowerCase()}} to this thread.
                <span v-if="repoSubscription().subscribed && viewerSubscriptionInfo.viewerSubscription == 'UNSUBSCRIBED'">
                    But you can still receive notification because you’re watching this repository.     
                </span>    
                <span v-if="repoOwnerType == 'Organization'">
                    And you can't update it at Pengithub. 
                    <HyperlinkWrapper>
                        <a href="https://docs.github.com/en/github/setting-up-and-managing-organizations-and-teams/restricting-access-to-your-organizations-data">
                            Why?
                        </a>
                    </HyperlinkWrapper>
                </span>    
            </span>
        </div>

           

        <Modal title="Notification settings" ref="notificationSettingsModal" :modalStyle="{maxHeight:'80vh'}"> 
            <transition-group name="fade-group" appear>
                <SelectMenuItem v-for="item in notificationSettingsModal.availableSubscriptionSettings" 
                                :key="item.title" 
                                :iconStyle="{alignSelf:'flex-start'}" 
                                :selected="viewerSubscriptionInfo.viewerSubscription == item.value"
                                @click.native="() => network_setSubscription(viewerSubscriptionInfo.id,item.value)">
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
   </Container>
       
</template>

<script>
    import styled from 'vue-styled-components'
    import {
            Modal,
            SelectMenuItem,
            TinyLoadingIcon,
            HyperlinkWrapper} from '@/components'
    export default {
        inject: ['repoSubscription','repoBasicInfo'],
        props: {
            viewerSubscriptionInfo: Object 
        },
        data() {
            return {
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
            repoOwnerType() {
                return this.repoBasicInfo().owner && this.repoBasicInfo().owner.type
            }
        },
        created() {
        },
        methods: {
            async network_setSubscription(subscribableId,state) {
                if(this.notificationSettingsModal.loading) return
                if(!this.accessToken) return
                try{
                    this.notificationSettingsModal.loading = true
                    this.notificationSettingsModal.settingSubscription = state

                    let result = await this.github_updateSubscrption(this.viewerSubscriptionInfo.id,state)   

                    this.viewerSubscriptionInfo.viewerSubscription = result
                    setTimeout(() => {
                        this.closeModal()
                    },100)
                }catch(e) {
                    this.handleError(e)
                  
                }finally{
                    this.notificationSettingsModal.loading = false
                }
            },
            triggerSubscription() {
                if(this.viewerSubscriptionInfo.viewerSubscription == 'SUBSCRIBED') {
                    this.network_setSubscription(this.viewerSubscriptionInfo.id,'UNSUBSCRIBED')
                }else{
                    this.network_setSubscription(this.viewerSubscriptionInfo.id,'SUBSCRIBED')
                }
            },
           
        },
   
        components: {
            Modal,
            TinyLoadingIcon,
            SelectMenuItem,
            HyperlinkWrapper,
            Container: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
.main{
    font-size: 12px;
    color: #586069;
}

</style>