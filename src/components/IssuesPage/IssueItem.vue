<template>
    <Container v-if="!issueIsEmpty" class="d-flex relative container p-0">
        <Icon class="flex-shrink-0 pt-2 pl-3">
            <span class="relative">
                <IssueIcon :issue="{...issue,merged}" :class="{'text-gray-light':extraDataHolder && extraDataHolder.isDraft}"></IssueIcon>
            </span>
        </Icon>
        
        <Main class="flex-auto min-width-0 lh-condensed p-2 pr-3 pr-md-2">
            <!-- <Meta class="meta">
                #{{issue.number}}
            </Meta> -->
            <Title class="h4 text-gray-dark d-block">
                <router-link class="pr-2 muted-link" :to="repoRouterLink" v-if="showRepoFullName">{{repoFullName}}</router-link>
                <router-link class="muted-link" :to="routerLink" >{{issue.title}}</router-link>
                <transition appear name="fade">
                    <svg v-if="lastCommitState === 'SUCCESS'" class="octicon octicon-check v-align-middle text-green" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                </transition>
                <transition appear name="fade">
                    <svg v-if="lastCommitState === 'FAILURE'" class="octicon octicon-x v-align-middle text-red" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
                </transition>
            </Title>
           
            <Labels v-if="showLabels" class="labels relative" style="padding-top:2px">
                <Label class="mr-1" :name="item.name" @click="(e) => clickLabel(e,item.name)" v-for="item in issue.labels" :key="item.name" :color="`#${item.color}`">
                </Label>
            </Labels>

            <Byline v-if="issue.state.toLowerCase() === 'open'" class="byline">
                #{{issue.number}} opened {{issue.created_at | getDateDiff}} by 
                <router-link class="muted-link" :to="`/${issue.user.login}`">{{issue.user.login}}</router-link>
            </Byline>
            <Byline v-if="issue.state.toLowerCase() === 'closed'" class="byline">
                #{{issue.number}} 
                by <router-link class="muted-link" :to="`/${issue.user.login}`">{{issue.user.login}}</router-link> 
                was 
                {{merged ? 'merged' : 'closed'}}
                {{issue.closed_at | getDateDiff}}
            </Byline>
        </Main>
           
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import IssueIcon from '../IssueIcon'
    import {AnimatedHeightWrapper} from '../AnimatedSizeWrapper'
    import Label from '../Label'
    import {WithRandomMetaMixin} from '@/mixins'
    export default {
        inject: ['extraData'],
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
            showLabels: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
            }
        },
        computed: {
            extraDataHolder() {
                return this.extraData().filter(i => i.id == this.issue.node_id)[0]
            },
            merged() {
                return this.extraDataHolder && this.extraDataHolder.merged
            },
            lastCommitState() {
                if(!this.extraDataHolder) return 
                if(!this.extraDataHolder.commits) return 
                if(!this.extraDataHolder.commits.nodes) return 
                if(!this.extraDataHolder.commits.nodes[0]) return 
                if(!this.extraDataHolder.commits.nodes[0].commit) return 
                if(!this.extraDataHolder.commits.nodes[0].commit.status) return 
                return this.extraDataHolder && this.extraDataHolder.commits.nodes[0].commit.status.state
            },
            routerLink: function () {
                if(this.issue.pull_request) {
                    return this.issue.pull_request.html_url.replace("https://github.com","")
                }
                return this.issue.url.replace("https://api.github.com/repos","")
            },
            repoRouterLink() {
               return this.issue.repository_url.replace('https://api.github.com/repos','')
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
        .adjustInlineBlockStyle(`.labels .label[meta=${this.randomMeta}]`)
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
            Label,
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
            padding: .15em 7px;
            font-weight: 600;
            border-radius: 2em;
            box-shadow: inset 0 -1px 0 rgba(27,31,35,.12);
        }
    }

    svg{
        vertical-align: text-bottom;
    }
</style>