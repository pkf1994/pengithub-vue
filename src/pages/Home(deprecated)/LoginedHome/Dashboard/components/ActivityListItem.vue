<template>
    <Container class="list-item bg-white">
        <Main class="d-flex">
            <IssueIcon class="repo-icon" v-if="payloadIssue || issue.state" :issue="event.type == 'Assigned' ? issue : payloadIssue"/> 
            <Content>
                <Title>
                    <router-link :to="routerLink" class="lh-condensed ws-normal text-gray-dark text-bold mr-1 mb-2">
                        {{title}}
                    </router-link>
                </Title>

                <AnimatedHeightWrapper>
                    <Labels>
                        <Label v-if="payloadIssue" class="mr-1" v-for="item in payloadIssue.labels" :key="item.name" :name="item.name" :color="`#${item.color}`"/>
                        <Label class="mr-1" v-for="item in issue.labels" :key="item.name" :name="item.name" :color="`#${item.color}`"/>
                    </Labels>
                </AnimatedHeightWrapper>
               
                <Body class="f6 mt-1">
                    <router-link v-if="event.actor" :to="`/${event.actor.login}`">
                        <ImgWrapper>
                            <img class="rounded-1 d-inline-block v-align-bottom"
                                            v-if="event.actor && event.actor.avatar_url"
                                            height="16"
                                            width="16"
                                            :src="event.actor.avatar_url"
                                            :alt="'@' + event.actor.login">
                        </ImgWrapper>
                    </router-link>
                
                
                    <span class="mx-1" v-if="event.actor && event.actor.avatar_url">·</span>
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
                </Body>
            </Content>
        </Main>
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
                if(this.event.payload.issue) return this.event.payload.issue.title
                if(this.event.payload.pull_request) return this.event.payload.pull_request.title
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
            }
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

<style scoped>
.list-item{
  display: block;
  position: relative;
  width: 100%;
  padding: 14px 15px 14px 35px;
  overflow-wrap: break-word;
  line-height: inherit;
  text-align: left;
}

.list-item-title {
  display: block;
  margin-right: auto;
  margin-bottom: 3px;
  font-weight: 600;
  line-height: 1.2;
  color: #0366d6;
  word-break: break-word;
}

.list-item .meta {
  float: right;
  margin-bottom: 5px;
  margin-left: 5px;
  font-size: 11px;
  color: #6a737d;
}

.list-item .meta~.list-item-title {
  margin-right: 55px;
}

.list-item+.list-item {
  border-top: 1px solid #eaecef;
}

.list-item>svg {
  position: absolute;
  top: 14px;
  left: 12px;
  width: 16px;
  text-align: center;
  vertical-align: bottom;
}
    .repo-icon{
        position: absolute;
        top: 14px;
        left: 12px;
        width: 16px;
        text-align: center;
        vertical-align: bottom;
    }
</style>