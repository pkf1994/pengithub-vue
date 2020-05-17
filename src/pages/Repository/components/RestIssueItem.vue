<template>
    <router-link v-if="!issueIsEmpty" :to="PRRouterLink" class="list-item container">
        <IssueIcon :issue="issue"></IssueIcon>
        <RepoFullName v-if="showRepoFullName" class="full-name">
            {{repoFullName}}
        </RepoFullName>
        <Meta class="meta">
            #{{issue.number}}
        </Meta>
        <Title class="title">
            {{issue.title}}
        </Title>
        <Byline v-if="issue.state.toLowerCase() === 'open'" class="byline">
            Opened by {{issue.user.login}} {{issue.created_at | getDateDiff}}
        </Byline>
        <Byline v-else-if="issue.closed_at " class="byline">
            Closed by {{issue.user.login}} {{issue.closed_at | getDateDiff}}
        </Byline>

        <AnimatedHeightWrapper :stretch="stretchLabels">
            <Labels v-if="showLabels" class="labels relative" style="padding-top:2px">
                <Label v-for="item in issue.labels" class="mr-1" :key="item.id" :name="item.name" :color="`#${item.color}`">
                </Label>
            </Labels>
        </AnimatedHeightWrapper>   
    </router-link>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper,IssueIcon,Label} from '@/components'
    import {util_dateFormat,util_color,util_adjustStyle} from '@/util'
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
                default: true
            },
            showLabels: {
                type: Boolean,
                default: false
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
            issueIsEmpty() {
                return JSON.stringify(this.issue) === JSON.stringify(new Object())
            },
            repoFullName() {
                return this.issue.repository_url.replace('https://api.github.com/repos/','')
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
            IssueIcon,
            Label,
            AnimatedHeightWrapper,
            Container: styled.div``,
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
        position: relative;
        width: 100%;
        padding: 14px 15px 14px 35px;
        overflow-wrap: break-word;
        line-height: inherit;
        text-align: left;
    }

    .pr-icon{
        position: absolute;
        top: 14px;
        left: 12px;
        width: 16px;
        text-align: center;
        vertical-align: bottom;
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

    .title{
        display: block;
        margin-right: 55px;
        margin-bottom: 3px;
        font-weight: 600;
        line-height: 1.2;
        color: #0366d6;
        word-break: break-word;
    }

    .byline{
        display: block;
        margin: 0;
        font-size: 12px;
        color: #586069;
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
        .label{
            height: 18px;
            font-size: 10px;
            line-height: 1.5;
            padding: .15em 4px;
            font-weight: 600;
            border-radius: 2px;
            box-shadow: inset 0 -1px 0 rgba(27,31,35,.12);
        }
    }
</style>