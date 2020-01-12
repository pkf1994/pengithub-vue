<template>
    <Container class="flex-column flex-items-stretch">
        <select class="form-select" v-model="selectedValue" style="margin:15px;font-family: Arial;">
            <option value="weekly">
                Past week
            </option>
            <option value="monthly">
                Past month
            </option>
        </select>
        <CodeChanges/>
        <PullsMerged :howLongTrackBack="selectedValue" :getMoreData="getMorePullsMerged"/>
        <PullsProposed :howLongTrackBack="selectedValue" :getMoreData="getMorePullsProposed"/>
        <IssuesClosed :howLongTrackBack="selectedValue" :getMoreData="getMoreIssuesClosed"/>
        <IssuesOpened :howLongTrackBack="selectedValue" :getMoreData="getMoreIssuesOpened"/>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {
        ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA,
        ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_REST,
        ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_GRAPHQL,
        ACTION_REPOSITORY_REQUEST_PULSE_COMMIT_COUNT
    } from '../../../store/modules/repository/actionTypes'
    import { mapActions, mapState } from 'vuex'
    import {CodeChanges,PullsMerged,PullsProposed,IssuesClosed,IssuesOpened} from './components' 
    export default {
        inject: ['owner','repo'],
        data() {
            return {
                selectedValue: "weekly"
            }
        },
        computed: {
            ...mapState({
                loadingCodeChanges: state => state.repository.pulse.codeChanges.loading,
                contributors: state => state.repository.pulse.codeChanges.data
            }),
            defaultBranchStatistic() {
                let authorCount = 0
                let commitCount = 0
                let additionCount = 0
                let deletionCount = 0
                this.contributors.forEach(item => {
                    let lastWeekData = item.weeks[item.weeks.length - 1]
                    if(lastWeekData.c > 0){
                        authorCount += 1
                        commitCount += lastWeekData.c
                        additionCount += lastWeekData.a
                        deletionCount += lastWeekData.d
                    }
                    
                })
                return {
                    commitCount,
                    authorCount,
                    additionCount,
                    deletionCount
                }
            }
        },
        created() {
            this.action_getCodeStatisticsData({repo:this.repo,owner:this.owner})
            this.action_getCommitCountInPast({repo:this.repo,owner:this.owner,meta:this.selectedValue})
            this.action_getIssuesFromGraphql({
                repo:this.repo,
                owner:this.owner,
                state:'closed',
                meta: 'pullsMerged',
                howLongTrackBack:this.selectedValue
                })
            this.action_getIssuesFromRest({
                repo:this.repo,
                owner:this.owner,
                state:'open',
                 meta: 'pullsProposed',
                howLongTrackBack:this.selectedValue
            })
            this.action_getIssuesFromGraphql({
                repo:this.repo,
                owner:this.owner,
                issueType: 'issue',
                state:'closed',
                meta: 'issuesClosed',
                howLongTrackBack:this.selectedValue
            })
            this.action_getIssuesFromRest({
                repo:this.repo,
                owner:this.owner,
                issueType: 'issue',
                state:'open',
                meta: 'issuesOpened',
                howLongTrackBack:this.selectedValue
            })
        },
        methods: {
            ...mapActions({
                action_getCodeStatisticsData: ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA,
                action_getCommitCountInPast: ACTION_REPOSITORY_REQUEST_PULSE_COMMIT_COUNT,
                action_getIssuesFromRest: ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_REST,
                action_getIssuesFromGraphql: ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_GRAPHQL
            }),
            getMorePullsMerged(loading) {
                if(loading) return
                this.action_getIssuesFromGraphql({
                        howLongTrackBack: this.selectedValue,
                        state: 'closed',
                        repo:this.repo,
                        meta: 'pullsMerged',
                        owner:this.owner,
                        getMoreData: true
                })
            },
             getMorePullsProposed(loading) {
                if(loading) return
                this.action_getIssuesFromRest({
                        howLongTrackBack: this.selectedValue,
                        state: 'open',
                        repo:this.repo,
                        meta: 'pullsProposed',
                        owner:this.owner,
                        getMoreData: true
                })
            },
            getMoreIssuesClosed(loading) {
                if(loading) return
                this.action_getIssuesFromGraphql({
                        howLongTrackBack: this.selectedValue,
                        state: 'closed',
                        issueType: 'issue',
                        meta: 'issuesClosed',
                        repo:this.repo,
                        owner:this.owner,
                        getMoreData: true
                })
            },
            getMoreIssuesOpened(loading) {
                if(loading) return
                this.action_getIssuesFromRest({
                        howLongTrackBack: this.selectedValue,
                        state: 'open',
                        issueType: 'issue',
                        meta: 'issuesOpened',
                        repo:this.repo,
                        owner:this.owner,
                        getMoreData: true
                })
            },
        },
        components: {
            CodeChanges,
            PullsMerged,
            PullsProposed,
            IssuesClosed,
            IssuesOpened,
            Container: styled.div``
        }
    }
</script>

<style scoped>

</style>