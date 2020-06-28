<template>
    <Container class="d-flex p-2">
        <IssueIcon class="mr-2 flex-shrink-0 mt-1" :issue="event.type == 'Assigned' ? issue : payloadIssue"/> 
        
        <Content class="d-flex flex-column flex-auto">
            <div>
                <div class="float-right ml-3 d-flex">
                    <div class="AvatarStack AvatarStack--right AvatarStack--two col-1 AvatarStack--two col-2">
                        <div class="AvatarStack-body tooltipped tooltipped-sw tooltipped-align-right-1" aria-label="pkf1994 and czf1998">
                            <img v-if="payloadIssue && payloadIssue.user" :src="payloadIssue.user.avatar_url" :alt='`/${payloadIssue.user.login}`' width="16" height="16" class="avatar avatar-user">
                            <img v-if="event.actor && event.actor.avatar_url && ((payloadIssue && payloadIssue.user && payloadIssue.user.login) != event.actor.login)" :src="event.actor.avatar_url" :alt='`/${event.actor.login}`' width="16" height="16" class="avatar avatar-user">
                        </div>
                    </div>
                    <span v-if="payloadIssue && payloadIssue.comments" class="text-gray text-left no-wrap ml-2 f6">
                        <svg class="octicon octicon-comment v-align-middle" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.75 2.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 01.75.75v2.19l2.72-2.72a.75.75 0 01.53-.22h4.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25H2.75zM1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0113.25 12H9.06l-2.573 2.573A1.457 1.457 0 014 13.543V12H2.75A1.75 1.75 0 011 10.25v-7.5z"></path></svg>
                        {{payloadIssue && payloadIssue.comments}}
                    </span>
                </div>
                <Title>
                    <router-link :to="routerLink" class="lh-condensed ws-normal text-gray-dark text-bold mr-1 mb-2">
                        {{title}}
                    </router-link>
                    <Label class="mr-1 px-2" v-for="item in labels" :key="item.name" :name="item.name" :color="`#${item.color}`" :style="{borderRadius:'2em'}"/>
                </Title>
                
                
            </div>  
            
            <div class="f6 mt-1">
                <router-link :to="`/${event.repo.full_name || event.repo.name}`" class="link-gray f6">
                    {{event.repo.full_name || event.repo.name}}
                </router-link>
                <span class="px-1">·</span>
                <span class="text-gray f6 mt-1 no-wrap">
                        {{activityDescrioption}}
                </span>
                <router-link to="/" class="link-gray f6">
                    {{formatDate}}
                </router-link>
            </div>
        </Content>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_dateFormat} from '@/util'
    import {IssueIcon,Label,AnimatedHeightWrapper,ImgWrapper} from '@/components'
    import {authRequiredGet} from '@/network'
    export default {
        props: {
            event: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                issue: {}
            }
        },
        computed: {
            payloadIssue() {
                if(!this.event.payload) return
                if(this.event.payload.issue) return this.event.payload.issue
                if(this.event.payload.pull_request) return this.event.payload.pull_request
            },
            formatDate: function() {
                return util_dateFormat.getDateDiff(this.event.created_at)
            },
            title: function () {
                if(this.payloadIssue) return this.payloadIssue.title
                return this.event.repo.full_name
            },
            activityDescrioption: function () {
                let description
                switch(this.event.type){
                    case "PullRequestEvent":
                        description = `You ${this.event.payload.action} this pull request`
                        break
                    case "IssuesEvent":
                        description = `You ${this.event.payload.action} this issue`
                        break
                    case "IssueCommentEvent":
                        description = `You commented`
                        break
                    case "Assigned":
                        description = `You were assigned`
                        break
                    default:
                        description = "activity: " + this.event.type
                }
                return description
            },
            routerLink() {
                let html_url
                if(this.event.payload.issue) {
                    html_url = this.event.payload.issue.html_url
                }else if(this.event.payload.pull_request) {
                    html_url = this.event.payload.pull_request.html_url
                }else {
                    html_url = this.event.repo.html_url
                }
                return html_url.replace('https://github.com','').replace('http://github.com','')
            },
            labels() {
                if(this.payloadIssue && this.payloadIssue.labels) return this.payloadIssue.labels.slice(0,3)
                if(this.issue && this.issue.labels) return this.issue.labels.slice(0,3)
                return []
            },
        },
        created() {
            if(this.event.type == 'Assigned') this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    let url = this.event.payload.issue.url
                    let res = await authRequiredGet(url)
                    this.issue = res.data
                }catch(e) {
                    console.log(e)
                }   
            }
        },
        components: {
            IssueIcon,
            ImgWrapper,
            Label,
            AnimatedHeightWrapper,
            Container: styled.div``,
            Main: styled.div``,
            Title: styled.span``,
            Labels: styled.div``,
            Body: styled.div``,
            Content: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
.avatar-user{
    border-radius: 50%!important;
}
</style>