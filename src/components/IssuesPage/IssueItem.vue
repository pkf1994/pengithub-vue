<template>
    <router-link v-if="!issueIsEmpty" :to="PRRouterLink" class="flex relative container Box-row p-0">
        <Icon class="flex-shrink-0 pt-2 pl-3">
            <span class="relative">
                <IssueIcon :issue="{
                    ...issue,
                    ...issueExtraData
                }"></IssueIcon>
            </span>
        </Icon>
        
        <Main class="flex-auto min-width-0 lh-condensed p-2 pr-3 pr-md-2">
            <!-- <Meta class="meta">
                #{{issue.number}}
            </Meta> -->
            <Title class="h4 text-gray-dark d-block">
                <span class="pr-2" v-if="showRepoFullName">{{repoFullName}}</span>{{issue.title}}
                <transition appear name="fade">
                    <svg v-if="lastCommitState === 'SUCCESS'" class="octicon octicon-check v-align-middle text-green" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                </transition>
                <transition appear name="fade">
                    <svg v-if="lastCommitState === 'FAILURE'" class="octicon octicon-x v-align-middle text-red" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
                </transition>
            </Title>
           
            <AnimatedHeightWrapper :stretch="stretchLabels">
                <Labels v-if="showLabels" class="labels relative" style="padding-top:2px">
                    <span v-for="item in issue.labels" :meta="randomMeta" class="  v-align-middle label d-inline-block" :key="item.id" :style="{color: isLight(`#${item.color}`) ? 'black' : 'white', background: `#${item.color}`}">
                        {{item.name}}
                    </span>
                </Labels>
            </AnimatedHeightWrapper>

             <AnimatedHeightWrapper>
                <Byline v-if="issue.state.toLowerCase() === 'open'" class="byline">
                #{{issue.number}} opened {{formatDate}} by {{issue.author ? issue.author.login : issue.user.login}}
                </Byline>
                <Byline v-if="issueExtraData && issueExtraData.timelineItems && (issue.state.toLowerCase() === 'closed' || issue.state.toLowerCase() === 'merged') " class="byline">
                #{{issue.number}} closed {{formatClosedDate}} by {{issueExtraData && issueExtraData.timelineItems.nodes[0].actor.login}} 
                </Byline>
            </AnimatedHeightWrapper>
        </Main>
           
    </router-link>
</template>

<script>
    import styled from 'vue-styled-components'
    import IssueIcon from '../IssueIcon'
    import {AnimatedHeightWrapper} from '../AnimatedSizeWrapper'
    import {util_dateFormat,util_color,util_adjustStyle} from '../../util'
    import {WithRandomMetaMixin} from '../../mixins'
    export default {
        mixins: [WithRandomMetaMixin],
        inject: ['extraData'],
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
                stretchLabels:false
            }
        },
        computed: {
            PRRouterLink: function () {
                if(this.issue.pull_request) {
                    return this.issue.pull_request.html_url.replace("https://github.com","")
                }
                return this.issue.url.replace("https://api.github.com/repos","")
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
            issueExtraData() {
                return this.extraData().filter( item => {
                    return item.id === this.issue.node_id
                })[0]
            },
            lastCommitState() {
                if(!this.issueExtraData || !this.issueExtraData.commits || !this.issueExtraData.commits.nodes[0]) return undefined
                if(!this.issueExtraData.commits.nodes[0].commit.status) return undefined
                return this.issueExtraData.commits.nodes[0].commit.status.state
            }
        },
        mounted() {
            setTimeout(() => {
                this.stretchLabels = true
            },400) 
        },
        updated() {
            util_adjustStyle.adjustInlineBlockStyle(`.labels .label[meta=${this.randomMeta}]`)
        },
        methods: {
            isLight: function (color) {
                return util_color.isLight(color)
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