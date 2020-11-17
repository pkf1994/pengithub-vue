<template>
        <Other :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-cross-reference" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M16 1.25v4.146a.25.25 0 01-.427.177L14.03 4.03l-3.75 3.75a.75.75 0 11-1.06-1.06l3.75-3.75-1.543-1.543A.25.25 0 0111.604 1h4.146a.25.25 0 01.25.25zM2.75 3.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 01.75.75v2.19l2.72-2.72a.75.75 0 01.53-.22h4.5a.25.25 0 00.25-.25v-2.5a.75.75 0 111.5 0v2.5A1.75 1.75 0 0113.25 13H9.06l-2.573 2.573A1.457 1.457 0 014 14.543V13H2.75A1.75 1.75 0 011 11.25v-7.5C1 2.784 1.784 2 2.75 2h5.5a.75.75 0 010 1.5h-5.5z"></path></svg>
            </template>
            <template v-slot:action>
                mentioned this issue
                <span class="no-wrap">on {{data.created_at | dateFormat('dd zzz yyyy')}}</span>
            </template>
            <template v-slot:additional>
                <SourceIssue class="mt-2 d-flex flex-justify-between">
                    <IssueTitle>
                        <router-link to="/" class="text-bold f4 link-gray-dark">
                            {{data.source.issue.title}}
                            <span class="text-normal text-gray">
                                <span v-if="data.source.issue.repository.full_name != `${owner}/${repo}`">{{data.source.issue.repository.full_name}}</span>#{{data.source.issue.number}}</span>
                        </router-link>
                    </IssueTitle>

                    <div class="flex-shrink-0 ml-1">
                        <IssueStateBadge :data="pullRequest.id ? pullRequest : data.source.issue" class="State--small"></IssueStateBadge>
                    </div> 
                </SourceIssue>

                <TaskProgress class="task-progress" v-if="pullRequestTaskProgress">
                    <svg class="octicon octicon-checklist" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M16 8.5l-6 6-3-3L8.5 10l1.5 1.5L14.5 7 16 8.5zM5.7 12.2l.8.8H2c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h7c.55 0 1 .45 1 1v6.5l-.8-.8c-.39-.39-1.03-.39-1.42 0L5.7 10.8a.996.996 0 000 1.41v-.01zM4 4h5V3H4v1zm0 2h5V5H4v1zm0 2h3V7H4v1zM3 9H2v1h1V9zm0-2H2v1h1V7zm0-2H2v1h1V5zm0-2H2v1h1V3z"></path></svg>
                    <span class="task-progress-counts">{{pullRequestTaskProgress.checked}} of {{pullRequestTaskProgress.all}} tasks complete</span>
                    <span class="progress-bar v-align-middle">
                        <span class="progress" :style="{width: pullRequestTaskProgress.checked/pullRequestTaskProgress.all * 100 + '%'}"></span>
                    </span>
                </TaskProgress>
            </template>
        </Other>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_markdownParse} from '@/util'
    import Other from './Other'
    import { authRequiredGet } from '@/network'
    import IssueStateBadge from '../../IssueStateBadge.vue'
    export default {
        props: {
            data: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {
                pullRequest: {},
            }
        },
        computed: {
            owner() {
                return this.$route.params.owner
            },
            repo() {
                return this.$route.params.repo
            },
            bodyHTML() {
                return util_markdownParse.markdownToHTML(this.data.source.issue.body)
            },
            pullRequestTaskProgress() {
                let bodyHTML = util_markdownParse.markdownToHTML(this.data.source.issue.body)
                if(!bodyHTML) return undefined
                let reg_allCheckboxInput = /<input type="checkbox" [\s\S]*?>/g
                let reg_checkedCheckboxInput = /<input type="checkbox" [\s\S]*?checked[\s\S]*?>/g
                let checkboxMatches = bodyHTML.match(reg_allCheckboxInput)
                let checkedCheckboxMatches =bodyHTML.match(reg_checkedCheckboxInput)
                if((!checkedCheckboxMatches) && (!checkboxMatches)) return undefined
                return {
                    checked: checkedCheckboxMatches ? checkedCheckboxMatches.length : 0,
                    all: checkboxMatches ? checkboxMatches.length : 0,
                }
            }
        },
        created() {
            if(this.data && this.data.source.issue.pull_request) {
                this.network_getPullRequest()
            }
        },
        methods: {
            async network_getPullRequest() {
                try {
                    let res = await authRequiredGet(
                        this.data.source.issue.pull_request.url
                    )
                    this.pullRequest = res.data
                } catch (e) {
                    console.log(e)
                }
            }
        },
        components: {
            Other,
            IssueStateBadge,
            Container: styled.div``,
            SourceIssue: styled.div``,
            IssueTitle: styled.div``,
            IssueState: styled.div``,
            SourceCommit: styled.div``,
            TaskProgress: styled.div``,
            ProgressBar: styled.span``,
        }
    }
</script>

<style scoped lang='scss'>
@import 'node_modules/@primer/css/labels/index.scss';
.task-progress{
    color: #586069;
    text-decoration: none;
    vertical-align: top;
    .task-progress-counts{
        display: inline-block;
        margin-right: 6px;
        margin-left: -2px;
        font-size: 12px;
    }
    svg{
        color: #ccc;
        vertical-align: bottom;
        margin-right: 5px;
    }
}

.progress-bar {
    display: inline-block;
    overflow: hidden;
    border-radius: 3px;
    width: 80px;
    height: 5px;
    vertical-align: 2px;
    background-color: #eee;
    .progress {
        display: block;
        height: 100%;
        background-color: #ccc;
    }
}

</style>