<template>
    <Container class="list-item bg-white">
        <Main class="flex">
            <svg  v-if="event.type === 'PullRequestEvent'"
                  class="d-inline-block repo-icon text-green"
                  fill="#586069"
                  viewBox="0 0 12 16"
                  version="1.1"
                  width="12"
                  height="16"
                  aria-hidden="true">
                <path fill-rule="evenodd" fill="currentColor" d="M11 11.28V5c-.03-.78-.34-1.47-.94-2.06C9.46 2.35 8.78 2.03 8 2H7V0L4 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0010 15a1.993 1.993 0 001-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zM4 3c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v6.56A1.993 1.993 0 002 15a1.993 1.993 0 001-3.72V4.72c.59-.34 1-.98 1-1.72zm-.8 10c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path>
            </svg>
            <svg v-if="event.type === 'IssuesEvent' || event.type === 'IssueCommentEvent'"
                 class="d-inline-block repo-icon text-green"
                 fill="#586069"
                 viewBox="0 0 14 16"
                 version="1.1"
                 width="14"
                 height="16"
                 aria-hidden="true">
                <path fill-rule="evenodd" fill="currentColor" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path>
            </svg>
            <Content>
                <Title>
                    <router-link to="/" class="lh-condensed ws-normal text-gray-dark text-bold mr-1 mb-2">
                        {{title}}
                    </router-link>
                </Title>
                <Body class="f6 mt-1">
                    <img class="rounded-1 d-inline-block v-align-bottom"
                         height="16"
                         width="16"
                         :src="event.actor.avatar_url"
                         :alt="'@' + event.actor.login">&nbsp;
                    <span class="mx-1">·</span>
                    <router-link to="/" class="link-gray f6">
                        {{event.repo.name}}
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
    import {util_dateFormat} from '../../util'
    export default {
        props: {
           event: {
                type: Object,
                required: true
           }
        },
        computed: {
            formatDate: function() {
                return util_dateFormat.getDateDiff(this.event.created_at)
            },
            title: function () {
                let title
                switch(this.event.type){
                    case "PullRequestEvent":
                        title = this.event.payload.pull_request.title
                        break
                    case "IssuesEvent":
                    case "IssueCommentEvent":
                        title = this.event.payload.issue.title
                        break
                    default:
                        title = "activity: " + this.event.type
                }
                return title
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
                    default:
                        description = "activity: " + this.event.type
                }
                return description
            }
        },
        components: {
            Container: styled.a``,
            Main: styled.div``,
            Title: styled.span``,
            Body: styled.div``,
            Content: styled.div``
        }
    }
</script>

<style scoped>
    .repo-icon{
        position: absolute;
        top: 14px;
        left: 12px;
        width: 16px;
        text-align: center;
        vertical-align: bottom;
    }
</style>