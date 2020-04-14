<template>
    <Container class="container position-relative">
        <Time class="time bg-white d-inline-block h6 pr-2 py-1">
            {{timeStr}}
        </Time>

        <Main>
              <!-- commit contributions -->
        <FoldableContributionActivityItem v-if="commitContributionCount > 0" :title="commitContributionActivityTitle" :defaultFolded="contributionsCollection.commitContributionsByRepository.length > 5">
            <template v-slot:icon>
                <svg class="octicon octicon-repo-push" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 3H3V2h1v1zM3 5h1V4H3v1zm4 0L4 9h2v7h2V9h2L7 5zm4-5H1C.45 0 0 .45 0 1v12c0 .55.45 1 1 1h4v-1H1v-2h4v-1H2V1h9.02L11 10H9v1h2v2H9v1h2c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1z"></path></svg>
            </template>
            <RepoListItem class="py-1" v-for="(item,index) in contributionsCollection.commitContributionsByRepository" :key="item.repository.nameWithOwner">
                <Content class="d-inline-block col-8 css-truncate css-truncate-target lh-condensed" style="max-width: 85%;">
                    <router-link :to="`/${item.repository.nameWithOwner}`">
                        {{item.repository.nameWithOwner}}
                    </router-link>
                    <router-link to="/" class="f6 muted-link mt-1 d-block">
                        {{item.contributions.totalCount}} {{item.contributions.totalCount > 1 ? 'commits' : 'commit'}}
                    </router-link>
                </Content>

                <PercentIndicateBarWrapper class="col-3 d-inline-block float-right">
                    <Progress   :progressStyle="index == 0 ? progressStyle : {...progressStyle,backgroundColor:'#c6e48b!important'}" 
                                class="mt-1"
                                :style="{height: '8px',backgroundColor: 'transparent'}" 
                                :donePercent="donePercent(item.contributions.totalCount,commitContributionCount)"></Progress>
                </PercentIndicateBarWrapper>
            </RepoListItem>
        </FoldableContributionActivityItem>

        <!-- created repo contributions -->
        <FoldableContributionActivityItem v-if="contributionsCollection.repositoryContributions.totalCount > 0" class="contribution-activity-item" :title="createdRepositoryContributionActivityTitle" :defaultFolded="contributionsCollection.repositoryContributions.nodes.length > 5">
            <template v-slot:icon>
                <svg class="octicon octicon-repo" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"></path></svg>
            </template>
            <RepoListItem class="py-1" v-for="item in contributionsCollection.repositoryContributions.nodes" :key="item.repository.nameWithOwner">
                <Content class="d-inline-block col-8 css-truncate css-truncate-target lh-condensed" style="max-width: 85%;">
                    <router-link :to="`/${item.repository.nameWithOwner}`">
                        <svg v-if="item.repository.isFork" class="octicon octicon-repo-forked v-align-middle text-gray-light mr-1" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 1a1.993 1.993 0 00-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 002 1a1.993 1.993 0 00-1 3.72V6.5l3 3v1.78A1.993 1.993 0 005 15a1.993 1.993 0 001-3.72V9.5l3-3V4.72A1.993 1.993 0 008 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                        <svg v-else class="octicon octicon-repo v-align-middle text-gray-light mr-1" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"></path></svg>
                        {{item.repository.nameWithOwner}}
                    </router-link>
                    <RepoPrimaryLanguage class="f6 text-gray d-block mt-1">
                        <span v-if="item.repository.primaryLanguage.color" class="repo-language-color" :style="{backgroundColor: item.repository.primaryLanguage.color}"></span>
                        {{item.repository.primaryLanguage.name}}
                    </RepoPrimaryLanguage>
                </Content>
                <time class="f6 text-gray-light pt-1 float-right">
                    {{item.repository.createdAt | dateFormat('zzz d')}}
                </time>
            </RepoListItem>
        </FoldableContributionActivityItem>

        <!-- popular pull request -->
        <IssueContributionActivityItem v-if="contributionsCollection.popularPullRequestContribution" class="contribution-activity-item" :issueContributionActivity="contributionsCollection.popularPullRequestContribution">
        </IssueContributionActivityItem>

         <!-- open pull contributions -->
         <FoldableContributionActivityItem v-if="contributionsCollection.pullRequestContributions.totalCount > 0" class="contribution-activity-item" :title="pullRequestContributionActivityTitle" :defaultFolded="contributionsCollection.pullRequestContributionsByRepository.length > 5">
            <template v-slot:icon>
                <svg class="octicon octicon-git-pull-request" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11 11.28V5c-.03-.78-.34-1.47-.94-2.06C9.46 2.35 8.78 2.03 8 2H7V0L4 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0010 15a1.993 1.993 0 001-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zM4 3c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v6.56A1.993 1.993 0 002 15a1.993 1.993 0 001-3.72V4.72c.59-.34 1-.98 1-1.72zm-.8 10c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
            </template>
            <IssueContributionActivityRepoListItem    v-for="item in contributionsCollection.pullRequestContributionsByRepository" 
                                                            class="pull-request-contribution-activity-repo-item contribution-activity-item"
                                                            :key="item.repository.nameWithOwner" 
                                                            meta="pullRequest"
                                                            :contribution="item">
            </IssueContributionActivityRepoListItem>
        </FoldableContributionActivityItem>

         <!-- review pull contributions -->
         <FoldableContributionActivityItem v-if="contributionsCollection.pullRequestReviewContributions.totalCount > 0" :title="pullRequestReviewContributionActivityTitle" :defaultFolded="contributionsCollection.pullRequestReviewContributionsByRepository.length > 5">
            <template v-slot:icon>
                <svg class="octicon octicon-git-pull-request" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11 11.28V5c-.03-.78-.34-1.47-.94-2.06C9.46 2.35 8.78 2.03 8 2H7V0L4 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0010 15a1.993 1.993 0 001-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zM4 3c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v6.56A1.993 1.993 0 002 15a1.993 1.993 0 001-3.72V4.72c.59-.34 1-.98 1-1.72zm-.8 10c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
            </template>
            <PullRequestReviewContributionActivityRepoListItem  v-for="item in contributionsCollection.pullRequestReviewContributionsByRepository" 
                                                                class="pull-request-contribution-activity-repo-item contribution-activity-item"
                                                                :key="item.repository.nameWithOwner" 
                                                                :pullRequestReviewContribution="item">
            </PullRequestReviewContributionActivityRepoListItem>
        </FoldableContributionActivityItem>

         <!-- popular issue -->
        <IssueContributionActivityItem  class="contribution-activity-item" 
                                        v-if="contributionsCollection.popularIssueContribution"
                                        :issueContributionActivity="contributionsCollection.popularIssueContribution">
        </IssueContributionActivityItem>

          <!-- open issues contributions -->
        <FoldableContributionActivityItem v-if="contributionsCollection.issueContributions.totalCount > 0" class="contribution-activity-item" :title="issueContributionActivityTitle" :defaultFolded="contributionsCollection.issueContributionsByRepository.length > 5">
            <template v-slot:icon>
                <svg class="octicon octicon-issue-opened" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>
            </template>
            <IssueContributionActivityRepoListItem    v-for="item in contributionsCollection.issueContributionsByRepository" 
                                                            class="pull-request-contribution-activity-repo-item contribution-activity-item"
                                                            :key="item.repository.nameWithOwner" 
                                                            :contribution="item">
            </IssueContributionActivityRepoListItem>
        </FoldableContributionActivityItem>

        <PrivateRepoContributionActivityItem class="contribution-activity-item" v-if="contributionsCollection.restrictedContributionsCount > 0" :restrictedContributionsCount="contributionsCollection.restrictedContributionsCount"></PrivateRepoContributionActivityItem>
        </Main>

        <NoAnyContributionsNotice v-if="!contributionsCollection.hasAnyContributions" class="text-center text-gray pt-3 pb-4">
            {{NoAnyContributionsNotice}}
        </NoAnyContributionsNotice> 
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import FoldableContributionActivityItem from './FoldableContributionActivityItem'
    import IssueContributionActivityItem from './IssueContributionActivityItem'
    import IssueContributionActivityRepoListItem from './IssueContributionActivityRepoListItem'
    import PullRequestReviewContributionActivityRepoListItem from './PullRequestReviewContributionActivityRepoListItem'
    import PrivateRepoContributionActivityItem from './PrivateRepoContributionActivityItem'
    import {Progress} from '@/components'
    import {util_numberFormat,util_dateFormat} from '@/util'
    export default {
        inject: ['mostRecentDateWithActivityProvided'],
        props: {
            contributionsCollection: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                progressStyle: {
                    borderRadius: '3px',
                    backgroundColor: '#7bc96f!important'
                },
                progressContainerStyle: {
                    height: '8px',
                    backgroundColor: 'transparent'
                },
                
            }
        },
        computed: {
            commitContributionActivityTitle() {
                let count = 0
                if(this.contributionsCollection.commitContributions) {
                    this.contributionsCollection.commitContributions.forEach(i => {
                        count = count + i.contributions.totalCount
                    })
                }
                let totalCountOfCommittedRepos = this.contributionsCollection.commitContributionsByRepository.length
                return `Created ${util_numberFormat.thousands(count)} ${count > 1 ? 'commits' : 'commit'} in ${totalCountOfCommittedRepos >= 10 ? 'more than ' : ''}${totalCountOfCommittedRepos} ${totalCountOfCommittedRepos > 1 ? 'repositories' : 'repository'}`
            },
            pullRequestContributionActivityTitle() {
                let totalCount = this.contributionsCollection.pullRequestContributions.totalCount
                let totalCountOfRepos = this.contributionsCollection.pullRequestContributionsByRepository.length
                return `Opened ${util_numberFormat.thousands(totalCount)} other ${totalCount > 1 ? 'pull requests' : 'pull request'} in ${totalCountOfRepos >= 10 ? 'more than ' : ''}${totalCountOfRepos} ${totalCountOfRepos > 1 ? 'repositories' : 'repository'}`
            },
            issueContributionActivityTitle() {
                let totalCount = this.contributionsCollection.issueContributions.totalCount
                let totalCountOfRepos = this.contributionsCollection.issueContributionsByRepository.length
                return `Opened ${util_numberFormat.thousands(totalCount)} other ${totalCount > 1 ? 'issues' : 'issue'} in ${totalCountOfRepos >= 10 ? 'more than ' : ''}${totalCountOfRepos} ${totalCountOfRepos > 1 ? 'repositories' : 'repository'}`
            },
            pullRequestReviewContributionActivityTitle() {
                let totalCount = this.contributionsCollection.pullRequestReviewContributions.totalCount
                let totalCountOfRepos = this.contributionsCollection.pullRequestReviewContributionsByRepository.length
                return `Reviewed ${util_numberFormat.thousands(totalCount)} ${totalCount > 1 ? 'pull requests' : 'pull request'} in ${totalCountOfRepos >= 10 ? 'more than ' : ''}${totalCountOfRepos} ${totalCountOfRepos > 1 ? 'repositories' : 'repository'}`
            },
            createdRepositoryContributionActivityTitle() {
                let totalCountOfRepositories = this.contributionsCollection.repositoryContributions.totalCount
                return `Created ${util_numberFormat.thousands(totalCountOfRepositories)} ${totalCountOfRepositories > 1 ? 'repositories' : 'repository'}`
            },
            login() {
                return this.$route.params.login
            },
            org() {
                return this.$route.query.org
            },
            timeStr() {
                let mostRecentDateWithActivity = new Date(this.mostRecentDateWithActivityProvided())
                let startedAt = new Date(this.contributionsCollection.startedAt)
                let endedAt = new Date(this.contributionsCollection.endedAt)
                let timeStr 
                if((endedAt.getTime() - startedAt.getTime()) <= 24 * 60 * 60 * 1000) {
                    timeStr = util_dateFormat.dateFormat('ZZZ d, yyyy',startedAt)
                }else{
                    timeStr = util_dateFormat.dateFormat('ZZZ yyyy',startedAt)
                }
                if(mostRecentDateWithActivity.getTime() < startedAt.getTime()) {
                    if(mostRecentDateWithActivity.getFullYear() == startedAt.getFullYear()) {
                        timeStr = `${util_dateFormat.dateFormat('ZZZ',mostRecentDateWithActivity)} - ${timeStr}`
                    } else {
                        timeStr = `${util_dateFormat.dateFormat('ZZZ yyyy',mostRecentDateWithActivity)} - ${timeStr}`
                    }
                }
                return timeStr
            },
            commitContributionCount() {
                let count = 0
                if(!this.contributionsCollection.commitContributions) return 0
                this.contributionsCollection.commitContributions.forEach(i => {
                    count = count + i.contributions.totalCount
                })
                 return count
            },
            NoAnyContributionsNotice() {
                return `${this.login} has no activity ${this.org ? 'in ' + this.org + ' ' : ''}yet for this period.`
            }
        },
        methods: {
            donePercent(done,total) {
                return parseInt((done / total) * 100)
            }
        },
        components: {
            FoldableContributionActivityItem,
            IssueContributionActivityItem,
            IssueContributionActivityRepoListItem,
            PullRequestReviewContributionActivityRepoListItem,
            Progress,
            PrivateRepoContributionActivityItem,
            Container: styled.div``,
            Main: styled.div``,
            Time: styled.h3``,
            RepoListItem: styled.div``,
            Content: styled.div``,
            RepoPrimaryLanguage: styled.span``,
            PercentIndicateBarWrapper: styled.div``,
            NoAnyContributionsNotice: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/truncate/index.scss';
@import 'node_modules/@primer/css/layout/index.scss';
.container:before {
    left: 15px;
    background-color: #eaecef;
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: -1;
    display: block;
    width: 2px;
    content: "";
}

.time:after {
    position: absolute;
    top: 12px;
    right: 0;
    left: 0;
    z-index: -1;
    height: 1px;
    content: "";
    background-color: #eaecef;
}

.repo-language-color {
    position: relative;
    top: 1px;
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.pull-request-contribution-activity-repo-item:first-child{
    border-top: 0!important;
}

.contribution-activity-item{
    border-top: 1px solid #eaecef;
}
.contribution-activity-item:first-child{
    border: none;
}
</style>