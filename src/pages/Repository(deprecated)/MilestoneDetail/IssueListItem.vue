<template>
    <Container v-if="!issueIsEmpty" class="d-flex relative container Box-row p-0">
      
        <Icon class="flex-shrink-0 pt-2 pl-3">
            <span class="relative">
                <IssueIcon :issue="{
                    ...issue,
                }"></IssueIcon>
            </span>
        </Icon>
        
        <Main class="flex-auto min-width-0 lh-condensed p-2 pr-3 pr-md-2">
            <router-link v-if="issue.comments > 0" class="float-right muted-link ml-2" :to="issue.url.replace('https://api.github.com/repos','')">
                <svg class="octicon octicon-comment v-align-middle" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14 1H2c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h2v3.5L7.5 11H14c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zm0 9H7l-2 2v-2H2V2h12v8z"></path></svg>
                {{issue.comments}}
            </router-link>
            <!-- <Meta class="meta">
                #{{issue.number}}
            </Meta> -->
            <Title class="h4 text-gray-dark d-block">
                <router-link class="pr-2 muted-link" :to="repoRouterLink" v-if="showRepoFullName">{{repoFullName}}</router-link>
                <router-link class="muted-link" :to="routerLink" >{{issue.title}}</router-link>
            </Title>
           
            <Labels class="labels relative" style="padding-top:2px">
                <span :label="item.name" @click="(e) => clickLabel(e,item.name)" v-for="item in issue.labels"  :meta="randomMeta" class="v-align-middle label d-inline-block mr-1" :key="item.id" :style="{color: isLight(`#${item.color}`) ? 'black' : 'white', background: `#${item.color}`}">
                    {{item.name}}
                </span>
            </Labels>

             <AnimatedHeightWrapper>
                <Byline v-if="issue.state.toLowerCase() === 'open'" class="byline">
                    #{{issue.number}} opened {{issue.created_at | getDateDiff}} by 
                    <router-link class="muted-link" :to="`/${issue.user.login}`">{{iissue.user.login}}</router-link>
                </Byline>
                <Byline v-else class="byline">
                    #{{issue.number}} closed {{issue.closed_at | getDateDiff}} by 
                    <router-link class="muted-link" :to="`/${issue.user.login}`">{{issue.user.login}}</router-link>
                </Byline>
            </AnimatedHeightWrapper>
        </Main>
           
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper,IssueIcon} from '@/components'
    import {util_dateFormat,util_color,util_adjustStyle,util_parseQuery,util_queryParse} from '@/util'
    import {WithRandomMetaMixin} from '@/mixins'
    export default {
        mixins: [WithRandomMetaMixin],
        props: {
            issue: {
                type: Object,
                required: true
            },
            showRepoFullName: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
            }
        },
        computed: {
            routerLink: function () {
                if(this.issue.pull_request) {
                    return this.issue.pull_request.html_url.replace("https://github.com","")
                }
                return this.issue.url.replace("https://api.github.com/repos","")
            },
            repoRouterLink() {
               return this.issue.repository_url.replace('https://api.github.com/repos','')
            },
            formatDate: function () {
                return util_dateFormat.getDateDiff(this.issue.created_at)
            },
            formatClosedDate:function () {
                return util_dateFormat.getDateDiff(this.issue.closed_at)
            },
            issueIsEmpty() {
                return JSON.stringify(this.issue) === JSON.stringify(new Object())
            },
            repoFullName() {
                return this.issue.repository_url.replace('https://api.github.com/repos/','');
            },
            type() {
                if(this.issue.pull_request) return 'pr'
                else return 'issue'
            },
        },
       /*  updated() {
            util_adjustStyle.adjustInlineBlockStyle(`.labels .label[meta=${this.randomMeta}]`)
        }, */
        methods: {
            isLight: function (color) {
                return util_color.isLight(color)
            },
            clickLabel(e,labelName) {
                console.log(labelName)
                let event = document.createEvent('HTMLEvents')
                event.initEvent("click-label",true,false,labelName)
                e.target.dispatchEvent(event)
            }
        },
        components: {
            AnimatedHeightWrapper,
            IssueIcon,
            Container: styled.div``,
            Icon: styled.div``,
            Main: styled.div``,
            RepoFullName: styled.span``,
            Title: styled.strong``,
            Meta: styled.span``,
            Byline: styled.span``,
            Labels: styled.div``
        }
    }
</script>

<style scoped lang="scss">
    .container{
        width: 100%;
        overflow-wrap: break-word;
        line-height: inherit;
    }

    .full-name{
        display: block;
        margin-bottom: 2px;
        font-size: 12px;
        font-weight: 600;
        color: #586069;
    }

    .opened{
        color: #28a745;
    }

    .byline{
        display: block;
        margin: 0;
        font-size: 12px;
        color: #586069;
        padding-top: 4px;
    }

    .meta{
        float: right;
        margin-bottom: 5px;
        margin-left: 5px;
        font-size: 11px;
        color: #6a737d;
    }

    .closed {
        color: #cb2431;
    }

    .labels{
        line-height: 1.5;
        .label{
            height: 20px;
            font-size: 12px;
            line-height: 15px;
            padding: .15em 4px;
            font-weight: 600;
            border-radius: 2px;
            box-shadow: inset 0 -1px 0 rgba(27,31,35,.12);
        }
    }

    svg{
        vertical-align: text-bottom;
    }
</style>