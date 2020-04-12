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
                <router-link :to="`/${issue.repository.nameWithOwner}`" class="link-gray-dark">{{issue.repository.nameWithOwner}}</router-link>
                that receive {{issue.comments.totalCount}} {{issue.comments.totalCount > 1 ? 'comments' : 'comment'}}
            </h4>   
            <span class="f6 text-gray-light muted-link no-wrap">
                <time class="no-wrap">{{occurredAt | dateFormat('zzz d')}}</time>
            </span>  
        </Title>

        <Issue class="bg-white border border-gray-dark rounded-1 p-3">
            <IssueIcon class="d-inline-block mt-1 float-left" :issue="issue"></IssueIcon>

            <IssueMain class="ml-4">
                <h3 class="lh-condensed my-0">
                    <router-link :to="issue.resourcePath" class="text-gray-dark">
                        {{issue.title}}
                    </router-link>
                </h3>

                <p class="body mt-2">
                    {{issue.bodyText}}
                </p>

                <Info class="f6 text-gray mt-2">
                    <DiffStat v-if="isPullRequest">
                        <span class="text-green">+{{issue.additions}}</span>
                        <span class="text-red">-{{issue.deletions}}</span>
                        <span v-for="(item,index) in diffstat" :key="index" :class="item" class="diffstat-item"></span>
                        &nbsp;·&nbsp;
                    </DiffStat>
                    <span>{{issue.comments.totalCount}} {{issue.comments.totalCount > 1 ? 'comments' : 'comment'}}</span>
                </Info>
            </IssueMain>
        </Issue>

    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {IssueIcon} from '@/components'
    import {AnimatedHeightWrapper} from '@/components'
    import {util_dateFormat} from '@/util'
    export default {
        props: {
            issue: {
                type:Object,
                required: true,
            },
            occurredAt: {
                type: String,
                required: true
            }
        },
        computed: {
            isPullRequest() {
                return this.issue.resourcePath.match(/\/pull\/[1-9][0-9]*$/) != null
            },
            diffstat() {
                if(!this.isPullRequest) return 
                let additionCount = this.issue.additions
                let deletionCount = this.issue.deletions
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
            Container: styled.div``,
            Title: styled.div``,
            Issue: styled.div``,
            IssueMain: styled.div``,
            Info: styled.div``,
            DiffStat: styled.span``,
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
</style>