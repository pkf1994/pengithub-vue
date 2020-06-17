<template>
    <Container class="container d-flex flex-column pl-2 pb-2 border-gray-light border-0 border-bottom" :class="{'bg-white':notification.unread}">
        <RowOne class="d-flex flex-row">
            <CheckBox class="d-flex flex-column flex-self-start flex-items-center" style="margin-top: 5px">
                <label class="p-2">
                    <input class="d-block" type="checkbox" value="MDE4Ok5vdGlmaWNhdGlvblRocmVhZDcyMDQyOTk3Nzo1ODk4MTQ4NQ==" autocomplete="off">
                </label>
            </CheckBox>
            <router-link :to="routerLink" class="d-flex flex-items-center flex-auto min-width-0 no-underline py-2 break-word" style="color: #24292e">
                <NotificationIconAndReadStatus class="d-flex flex-column mr-2 flex-self-start flex-items-center">
                    <div class="flex-shrink-0 flex-self-start text-center" style="width: 16px;">
                        <AnimatedHeightWrapper>
                            <IssueIcon v-if="subjectIssue" :issue="subjectIssue"></IssueIcon>
                            <svg v-else-if="notification.reason == 'security_alert'" class="octicon octicon-alert" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 000 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 00.01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"></path></svg>
                            <svg v-else-if="notification.subject.type == 'RepositoryInvitation'" class="octicon octicon-mail" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 4v8c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H1c-.55 0-1 .45-1 1zm13 0L7 9 1 4h12zM1 5.5l4 3-4 3v-6zM2 12l3.5-3L7 10.5 8.5 9l3.5 3H2zm11-.5l-4-3 4-3v6z"></path></svg>
                        </AnimatedHeightWrapper>  
                    </div>
                    <UnreadIndicator :class="{read:!notification.unread}" class="circle d-block mt-1 unread-indicator"></UnreadIndicator>
                </NotificationIconAndReadStatus>

                <Main class="d-flex flex-column flex-auto">
                    <TheMeta class="d-flex">
                        <p class="m-0 f6 flex-auto">
                            {{notification.repository.full_name}}
                            <span v-if="number" class="text-normal text-gray-light">
                            #{{number}}
                            </span>
                        </p>

                        <p class="note m-0 pr-2 d-block text-gray-light text-right flex-shrink-0 no-wrap">{{formatUpdatedAt}}</p>
                    </TheMeta>
                    <Title class="pr-2">{{notification.subject.title}}</Title>
                </Main>
            </router-link>
        </RowOne>

        <RowTwo class="d-flex flex-row" style="padding-left:53px">
            <Reason class="Label flex-self-center Label--outline border-0 bg-gray-2 flex-shrink-0" style="font-size:12px;">
                {{notification.reason}}
            </Reason>
        </RowTwo>   
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {IssueIcon,AnimatedHeightWrapper} from '@/components'
    import {util_dateFormat} from '@/util'
    export default {
        inject: ['extraDataProvided'],
        props: {
            notification: {
                type: Object,
                required: true
            }
        },
        computed: {
            number() {
                if(this.notification.subject.type == 'Issue' || this.notification.subject.type == 'PullRequest') {
                    let numberHolder = this.notification.subject.url.match(/\/[1-9][0-9]*$/)
                    if(numberHolder) return numberHolder[0].substring(1,numberHolder[0].length)
                }
            },
            formatUpdatedAt() {
                return util_dateFormat.getDateDiff(this.notification.updated_at)
            },
            subjectIssue() {
                if(['Issue','PullRequest'].indexOf(this.notification.subject.type) == -1) return
                let resourceUrl = this.notification.subject.url.replace('/repos','').replace('pulls','pull').replace('api.','')
                let extraDataHolder = this.extraDataProvided().filter(item => item.url == resourceUrl)[0]
                return extraDataHolder
            },
            routerLink() {
                if(this.notification.subject.type == 'RepositoryInvitation') return `/${this.notification.repository.full_name}/invitations`
                if(this.notification.subject.url) return this.notification.subject.url.replace('https://api.github.com/repos','')
                return this.notification.repository.url.replace('https://api.github.com/repos','')
            }
        },
        components: {
            IssueIcon,
            AnimatedHeightWrapper,
            Container: styled.div``,
            RowOne: styled.div``,
            RowTwo: styled.div``,
            CheckBox: styled.div``,
            NotificationIconAndReadStatus: styled.div``,
            UnreadIndicator: styled.div``,
            Main: styled.div``,
            TheMeta: styled.div``,
            Title: styled.div``,
            Participants: styled.div``,
            Reason: styled.span``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/avatars/index.scss'; 
@import 'node_modules/@primer/css/labels/index.scss'; 
@import 'node_modules/@primer/css/forms/index.scss'; 
.container{

}
.unread-indicator{
    background-color: #0366d6;
    width: 8px;
    height: 8px;
   
}

.read{
    background: none;
}
.AvatarStack--right{
    width: auto!important;
    min-width: auto!important;
    .AvatarStack-body {
        position: relative!important;
        right: unset!important;
        margin-right: 8px;
        flex-direction: row!important;
    }
}
</style>