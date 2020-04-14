<template>
    <Container class="py-4 pl-4 position-relative ml-3">
        <span class="discussion-item-icon">
            <slot name="icon">
                <svg class="octicon octicon-flame" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"></path></svg>
            </slot>
        </span>

        <Title class="d-flex flex-justify-between flex-items-baseline mb-3">
            <h4 class="text-normal text-gray lh-condensed my-0 pr-3">
                Created {{this.isPullRequest ? 'a pull request' : 'an issue'}} in 
                <router-link :to="`/${theIssue.repository.nameWithOwner}`" class="link-gray-dark">{{theIssue.repository.nameWithOwner}}</router-link>
                that receive {{theIssue.comments.totalCount}} {{theIssue.comments.totalCount > 1 ? 'comments' : 'comment'}}
            </h4>   
            <span class="f6 text-gray-light muted-link no-wrap">
                <time class="no-wrap">{{issueContributionActivity.occurredAt | dateFormat('zzz d')}}</time>
            </span>  
        </Title>

        <Issue class="bg-white border border-gray-dark rounded-1 p-3">
            <IssueIcon class="d-inline-block mt-1 float-left" :issue="theIssue"></IssueIcon>

            <IssueMain class="ml-4">
                <h3 class="lh-condensed my-0">
                    <router-link :to="theIssue.resourcePath" class="text-gray-dark">
                        {{theIssue.title}}
                    </router-link>
                </h3>

                <p class="body mt-2">
                    {{theIssue.bodyText}}
                </p>

                <Info class="f6 text-gray mt-2">
                    <DiffStat v-if="isPullRequest">
                        <span class="text-green">+{{theIssue.additions}}</span>
                        <span class="text-red">-{{theIssue.deletions}}</span>
                        <span v-for="(item,index) in diffstat" :key="index" :class="item" class="diffstat-item"></span>
                        &nbsp;·&nbsp;
                    </DiffStat>
                    
                    <TaskProgress v-if="taskProgress" class="task-progress">
                        <svg class="octicon octicon-checklist" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M16 8.5l-6 6-3-3L8.5 10l1.5 1.5L14.5 7 16 8.5zM5.7 12.2l.8.8H2c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h7c.55 0 1 .45 1 1v6.5l-.8-.8c-.39-.39-1.03-.39-1.42 0L5.7 10.8a.996.996 0 000 1.41v-.01zM4 4h5V3H4v1zm0 2h5V5H4v1zm0 2h3V7H4v1zM3 9H2v1h1V9zm0-2H2v1h1V7zm0-2H2v1h1V5zm0-2H2v1h1V3z"></path></svg>
                        <span class="task-progress-counts">
                            {{taskProgress.checked}} of {{taskProgress.all}}
                        </span>
                        <Progress :donePercent="(taskProgress.checked / taskProgress.all) * 100" :progressContainerStyle="{height: '8px'}" :progressStyle="{backgroundColor: '#ccc!important'}" class="d-inline-block" style="width:40px;"></Progress>
                        &nbsp;·&nbsp;
                    </TaskProgress>

                    <span>{{theIssue.comments.totalCount}} {{theIssue.comments.totalCount > 1 ? 'comments' : 'comment'}}</span>
                </Info>
            </IssueMain>
        </Issue>

    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {IssueIcon} from '@/components'
    import {AnimatedHeightWrapper,Progress} from '@/components'
    import {util_dateFormat} from '@/util'
    export default {
        props: {
            issueContributionActivity: {
                type:Object,
                required: true,
            },
        },
        computed: {
            theIssue() {
                if(this.issueContributionActivity.issue) return this.issueContributionActivity.issue
                if(this.issueContributionActivity.pullRequest) return this.issueContributionActivity.pullRequest
            },
            isPullRequest() {
                return this.theIssue.resourcePath.match(/\/pull\/[1-9][0-9]*$/) != null
            },
            taskProgress() {
                if(!this.theIssue.bodyHTML) return undefined
                let reg_allCheckboxInput = /<input type="checkbox" [\s\S]*?>/g
                let reg_checkedCheckboxInput = /<input type="checkbox" [\s\S]*?checked[\s\S]*?>/g
                let checkboxMatches = this.theIssue.bodyHTML.match(reg_allCheckboxInput)
                let checkedCheckboxMatches =this.theIssue.bodyHTML.match(reg_checkedCheckboxInput)
                if((!checkedCheckboxMatches) && (!checkboxMatches)) return undefined
                return {
                    checked: checkedCheckboxMatches ? checkedCheckboxMatches.length : 0,
                    all: checkboxMatches ? checkboxMatches.length : 0,
                }
            },
            diffstat() {
                if(!this.isPullRequest) return 
                let additionCount = this.theIssue.additions
                let deletionCount = this.theIssue.deletions
                let sum = additionCount + deletionCount

                if(sum <= 5) {
                    let diffstat = []
                    for(let i = 0; i < additionCount; i++) {
                        diffstat.push('added')
                    }
                    for(let i = 0; i < deletionCount; i++) {
                        diffstat.push('deleted')
                    }
                    while(diffstat.length < 5) {
                        diffstat.push('neutral')
                    }
                    return diffstat
                }

                if(additionCount == 0) {
                    return [
                        'deleted',
                        'deleted',
                        'deleted',
                        'neutral',
                        'neutral',
                    ]
                }else if(deletionCount == 0) {
                    return [
                        'added',
                        'added',
                        'added',
                        'neutral',
                        'neutral',
                    ]
                }else if(additionCount > deletionCount) {
                    return [
                        'added',
                        'added',
                        'added',
                        'deleted',
                        'neutral',
                    ]
                }else if(deletionCount > additionCount) {
                    return [
                        'added',
                        'deleted',
                        'deleted',
                        'deleted',
                        'neutral',
                    ]
                }else if(deletionCount == additionCount) {
                    return [
                        'added',
                        'added',
                        'deleted',
                        'deleted',
                        'neutral',
                    ]
                }
            },
        },
        components: {
            AnimatedHeightWrapper,
            IssueIcon,
            Progress,
            Container: styled.div``,
            Title: styled.div``,
            Issue: styled.div``,
            IssueMain: styled.div``,
            Info: styled.div``,
            DiffStat: styled.span``,
            TaskProgress: styled.span``,
        }
    }
</script>

<style scoped lang="scss">
.discussion-item-icon {
    float: left;
    width: 32px;
    height: 32px;
    margin-top: -5px;
    margin-left: -39px;
    line-height: 28px;
    color: #24292e;
    text-align: center;
    background-color: #e1e4e8;
    border: 2px solid #fff;
    border-radius: 50%;
}
.body{
    display: -webkit-box;
   -webkit-box-orient: vertical;
   -webkit-line-clamp: 6;
   overflow: hidden;
}

.diffstat-item{
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-left: 1px;
}


.added {
    background-color: #2cbe4e;
}
.deleted {
    background-color: #cb2431;
}
.neutral {
    background-color: #d1d5da;
}

.task-progress {
    color: #586069;
    text-decoration: none;
    vertical-align: top;
}

.task-progress-counts {
    display: inline-block;
    margin-right: 6px;
    margin-left: -2px;
    font-size: 12px;
}
</style>