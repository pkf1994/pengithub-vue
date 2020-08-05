<template>
    <Container>
        <button :disabled="disabled" v-if="!issue.locked" class="text-bold link-gray-dark btn-link" @click="() => showModal('lockConversationModal')">
            <svg class="octicon octicon-lock" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 4v2h-.25A1.75 1.75 0 002 7.75v5.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-5.5A1.75 1.75 0 0012.25 6H12V4a4 4 0 10-8 0zm6.5 2V4a2.5 2.5 0 00-5 0v2h5zM12 7.5h.25a.25.25 0 01.25.25v5.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-5.5a.25.25 0 01.25-.25H12z"></path></svg>
            <strong>Lock conversation</strong>
        </button> 
        <button :disabled="disabled" v-else class="text-bold link-gray-dark btn-link" @click="() => showModal('unlockConversationModal')">
            <svg class="octicon octicon-key" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6.5 5.5a4 4 0 112.731 3.795.75.75 0 00-.768.18L7.44 10.5H6.25a.75.75 0 00-.75.75v1.19l-.06.06H4.25a.75.75 0 00-.75.75v1.19l-.06.06H1.75a.25.25 0 01-.25-.25v-1.69l5.024-5.023a.75.75 0 00.181-.768A3.995 3.995 0 016.5 5.5zm4-5.5a5.5 5.5 0 00-5.348 6.788L.22 11.72a.75.75 0 00-.22.53v2C0 15.216.784 16 1.75 16h2a.75.75 0 00.53-.22l.5-.5a.75.75 0 00.22-.53V14h.75a.75.75 0 00.53-.22l.5-.5a.75.75 0 00.22-.53V12h.75a.75.75 0 00.53-.22l.932-.932A5.5 5.5 0 1010.5 0zm.5 6a1 1 0 100-2 1 1 0 000 2z"></path></svg>
            <strong>Unlock conversation</strong>
        </button> 


        <Modal title="Lock conversation on this issue" ref="lockConversationModal" :modalStyle="{maxHeight:'80vh'}"> 
            <div class="p-3 bg-white">
                <ul class="ml-3">
                    <li>Other users <strong>can’t add new comments</strong> to this issue.</li>
                    <li>
                        You and other collaborators
                        <HyperlinkWrapper>
                            <a href="https://help.github.com/articles/what-are-the-different-access-permissions">with access</a>
                        </HyperlinkWrapper>
                        to this repository <strong>can still leave comments</strong> that others can see.
                    </li>
                    <li>You can always unlock this issue again in the future.</li>
                </ul>

                <div class="mt-3">
                    <label for="unlock-reason">Reason for locking</label>  
                    <div class="my-1">
                        <select id="unlock-reason" v-model="lockConversationModal.lockReason" class="form-select">
                            <option value="">Choose a reason</option>
                            <option value="off-topic">Off-topic</option>
                            <option value="too heated">Too heated</option>
                            <option value="resolved">Resolved</option>
                            <option value="spam">Spam</option>
                        </select> 
                    </div> 
                    <p class="note" id="unlock-reason-note">
                        Optionally, choose a reason for locking that others can see. Learn more about when
                        it’s appropriate to 
                        <HyperlinkWrapper>
                            <a href="https://help.github.com/articles/locking-conversations">lock conversations</a>
                        </HyperlinkWrapper>
                        .
                    </p>
                </div> 
            </div> 
            <div class="Box-footer modal-footer  bg-white">
                <button type="submit" class="btn btn-block" :disabled="lockConversationModal.loading" @click="network_lockConversation">
                    {{lockConversationModal.loading ? 'Trying...' : 'Lock conversation on this issue'}}
                </button>
            </div>
        </Modal>

        <Modal title="Unlock conversation on this issue" ref="unlockConversationModal" :modalStyle="{maxHeight:'80vh'}"> 
            <div class="p-3 bg-white">
                <ul class="ml-3">
                    <li><strong>Everyone</strong> will be able to comment on this issue once more.</li>
                    <li li>You can always lock this issue again in the future.</li>
                </ul>
            </div> 
            <div class="Box-footer bg-white">
                <button class="btn btn-block" :disabled="unlockConversationModal.loading" @click="network_unlockConversation">
                    {{unlockConversationModal.loading ? 'Trying...' : 'Unlock conversation on this issue'}}
                </button>
            </div>
        </Modal>
       
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {
            LoadingIconEx,
            Progress,
            Modal,
            SelectMenuItem,
            HyperlinkWrapper
        } from '@/components'
    import {
        authRequiredPut,
        authRequiredDelete} from '@/network'
    import * as api from '@/network/api'
    export default {
        name: 'issue_lock_button',
        props: {
            issue: Object,
            disabled: Boolean
        },
        data() {
            return {
                lockConversationModal: {
                    lockReason: '',
                    loading: false
                },
                unlockConversationModal: {
                    loading: false
                },
            }
        },
        methods: {
            async network_lockConversation() {
                if(this.lockConversationModal.loading) return
                try{
                    this.lockConversationModal.loading = true
                    let url = api.API_ISSUE_LOCK(this.$route.params)
                    let res = await authRequiredPut(
                        url,
                        {
                            lock_reason: this.lockConversationModal.lockReason
                        },
                        {
                            headers: {
                                "Content-Length": 0
                            }
                        },
                    )
                    this.closeModal()
                    this.$emit('change-lock-status-success',true)
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.lockConversationModal.loading = false
                }
            },
            async network_unlockConversation() {
                if(this.unlockConversationModal.loading) return
                try{
                    this.unlockConversationModal.loading = true
                    let url = api.API_ISSUE_LOCK(this.$route.params)
                    let res = await authRequiredDelete(url)
                    this.closeModal()
                    this.$emit('change-lock-status-success',false)
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.unlockConversationModal.loading = false
                }
            },
        },
        components: {
            LoadingIconEx,
            Modal,
            SelectMenuItem,
            HyperlinkWrapper,
            Container: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/box/index.scss';
</style>