<template>
    <router-link v-if="!issueIsEmpty" :to="PRRouterLink" class="flex relative container Box-row p-0">
        <Icon class="flex-shrink-0 pt-2 pl-3">
            <span class="relative">
                <svg v-if="issue.merged" style="color: #6f42c1;" class="opened" fill="currentColor" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 7c-.73 0-1.38.41-1.73 1.02V8C7.22 7.98 6 7.64 5.14 6.98c-.75-.58-1.5-1.61-1.89-2.44A1.993 1.993 0 002 .99C.89.99 0 1.89 0 3a2 2 0 001 1.72v6.56c-.59.35-1 .99-1 1.72 0 1.11.89 2 2 2a1.993 1.993 0 001-3.72V7.67c.67.7 1.44 1.27 2.3 1.69.86.42 2.03.63 2.97.64v-.02c.36.61 1 1.02 1.73 1.02 1.11 0 2-.89 2-2 0-1.11-.89-2-2-2zm-6.8 6c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm8 6c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                <svg v-else-if="type === 'pullRequest'" :class="{open:issue.state.toLowerCase() === 'open',closed:issue.state.toLowerCase() === 'closed'}" class="opened" fill="currentColor" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11 11.28V5c-.03-.78-.34-1.47-.94-2.06C9.46 2.35 8.78 2.03 8 2H7V0L4 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0010 15a1.993 1.993 0 001-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zM4 3c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v6.56A1.993 1.993 0 002 15a1.993 1.993 0 001-3.72V4.72c.59-.34 1-.98 1-1.72zm-.8 10c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                <svg v-else-if="type === 'issue'" :class="{open:issue.state.toLowerCase() === 'open',closed:issue.state.toLowerCase() === 'closed'}" class="opened" viewBox="0 0 14 16" fill="currentColor" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>
            </span>
        </Icon>
        
        <Main class="flex-auto min-width-0 lh-condensed p-2 pr-3 pr-md-2">
            <!-- <Meta class="meta">
                #{{issue.number}}
            </Meta> -->
            <Title class="h4 muted-link">
                <span class="pr-2">{{repoFullName}}</span>{{issue.title}}
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
                <Byline v-if="issue.timelineItems && (issue.state.toLowerCase() === 'closed' || issue.state.toLowerCase() === 'merged') " class="byline">
                #{{issue.number}} closed {{formatClosedDate}} by {{issue.timelineItems.nodes[0].actor.login}} 
                </Byline>
            </AnimatedHeightWrapper>
        </Main>
           
    </router-link>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper} from '../AnimatedSizeWrapper'
    import {util_dateFormat,util_color,util_adjustStyle} from '../../util'
    import {WithRandomMetaMixin} from '../../mixins'
    export default {
        mixins: [WithRandomMetaMixin],
        props: {
            issue: {
                type: Object,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            showRepoFullName: {
                type: Boolean,
                default: true
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
                return this.issue.url.replace("https://github.com","")
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
</style>