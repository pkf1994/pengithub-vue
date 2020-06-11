<template>
    <CommonLoadingWrapper :loading="loading">
        <WithNotificationPaneWrapper>
            <Container>
                <transition-group name="fade-group" appear>
                    <InvitationMain v-if="data && data.inviter" class="pt-4 px-5 bg-white" key="1">
                        <div class="text-center">
                            <router-link :to="`/${data.inviter.login}`">
                                <ImgWrapper>
                                    <img class="avatar" :src="data.inviter.avatar_url" :alt="`@${data.inviter.login}`" height="48" width="48">
                                </ImgWrapper>
                            </router-link>
                            <svg class="octicon octicon-plus pl-3 pr-4 text-gray" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z"></path></svg>
                            <router-link :to="`/${data.invitee.login}`">
                                <ImgWrapper>
                                    <img class="avatar" :src="data.invitee.avatar_url" :alt="`@${data.invitee.login}`" height="48" width="48">
                                </ImgWrapper>
                            </router-link>

                            <h3 class="my-2">
                                <router-link :to="`/${data.inviter.login}`">{{data.inviter.login}}</router-link> invited you to collaborate
                            </h3>

                            <div class="my-4">
                                <button class="btn btn-primary">
                                    Accept invitation
                                </button>
                                <button class="btn">
                                    Decline
                                </button>
                            </div>
                        </div>
                    
                        <div class="border-bottom pb-3 text-gray mx-auto col-11">
                            <p>
                                <svg class="octicon octicon-lock mr-2" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 4v2h-.25A1.75 1.75 0 002 7.75v5.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-5.5A1.75 1.75 0 0012.25 6H12V4a4 4 0 10-8 0zm6.5 2V4a2.5 2.5 0 00-5 0v2h5zM12 7.5h.25a.25.25 0 01.25.25v5.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-5.5a.25.25 0 01.25-.25H12z"></path></svg>
                                <HyperlinkWrapper>
                                    <a href="https://help.github.com/articles/permission-levels-for-a-user-account-repository">Owners</a>
                                </HyperlinkWrapper>
                                of {{data.repository.name}} will be able to see:
                            </p>
                            <ul class="pl-3">
                                <li>Your public profile information</li>
                                <li>
                                    <HyperlinkWrapper>
                                        <a href="https://help.github.com/articles/reviewing-your-security-log/#the-repo-category">Certain activity</a> 
                                    </HyperlinkWrapper>
                                    within this repository
                                </li>
                                <li>Country of request origin</li>
                                <li>Your access level for this repository</li>
                                <li>Your IP address</li>
                            </ul>
                        </div>

                        <div class="col-11 col-sm-8 mx-auto mt-3">
                            <p class="text-gray mb-0">
                                Is this user sending spam or malicious content?
                            </p>
                            <button class="btn-link">
                                Block {{data.inviter.login}}
                            </button>
                        </div>
                    </InvitationMain>

                    <NoInvitationNotice v-else-if="!loading" class="p-3" key="2">
                        <div class="no-invitation-notice p-3 border rounded-1"> 
                            Sorry, we couldn't find that repository invitation. It is possible that the invitation was revoked or that you are not logged into the invited account.
                        </div>
                    </NoInvitationNotice>
                </transition-group>
            </Container>
        </WithNotificationPaneWrapper>
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {WithNotificationPaneWrapper,CommonLoadingWrapper,HyperlinkWrapper,ImgWrapper} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    let parse = require("parse-link-header")
    import * as api from '@/network/api'
    import {authRequiredGet} from '@/network'
    export default {
        name: 'repository_invitation_page',
        mixins: [RouteUpdateAwareMixin],
        data() {
            return {
                data: {},
                noInvitation: false,
                loading: false
            }
        },
        computed: {
            repoFullName() {
                return `${this.$route.params.owner}/${this.$route.params.repo}`
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let pageInfo
                    
                    let invitation
                    try{
                        while(!pageInfo || (pageInfo.next && pageInfo.next.url)) {
                            let url
                            if(pageInfo) {
                                url = pageInfo.next.url
                            }else{
                                url = api.API_REPOSITORY_INVITATION_FOR_AUTHENTICATED_USER
                            }
                            let res = await authRequiredGet(url,{cancelToken})
                            res.data.forEach(item => {
                                if(item.invitee.login == this.viewer.login && this.repoFullName == item.repository.full_name) {
                                    invitation = item
                                    throw new Error('break while')
                                }
                            })
                            pageInfo = parse(res.headers.link) || {}
                        }
                    }catch(e) {
                        if(e.message == 'break while') {
                            //do nothing
                        }else{
                            throw e
                        }
                    }

                    this.data = invitation
                    
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            }
        },
        components: {
            WithNotificationPaneWrapper,
            CommonLoadingWrapper,
            HyperlinkWrapper,
            ImgWrapper,
            Container: styled.div``,
            InvitationMain: styled.div``,
            NoInvitationNotice: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/avatars/index.scss';
@import 'node_modules/@primer/css/layout/index.scss';

.no-invitation-notice{
	color: #86181d;
	background-color: #ffdce0;
}
</style>