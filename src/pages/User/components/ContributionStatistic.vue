<template>
    <Container>
        <Title class="f4 mb-2 text-normal">
            {{formatLastYearContributionCount}} contributions in the last year
        </Title>
        <ContributionPerDay  class="contribution-perday px-3 border-gray-dark border py-2">
             <Content class="d-flex">
                <WeekDateIndexColumn class="d-flex flex-column mr-2 pt-3">
                    <span class="contribution-week-item"></span>
                    <span class="contribution-week-item">
                        <span>Mon</span>
                    </span>
                    <span class="contribution-week-item"></span>
                    <span class="contribution-week-item"><span>Mon</span></span>
                    <span class="contribution-week-item"></span>
                    <span class="contribution-week-item"><span>Fri</span></span>
                    <span class="contribution-week-item"></span>
                </WeekDateIndexColumn>

                <Weeks class="main" style="min-width:0px">
                    <div class="d-flex pt-3 pr-1">
                        <WeekItem class="d-flex flex-column" v-for="(weekItem,weekIndex) in reversedContributionCalendarWeeks" :key="weekIndex">
                            <Day class="contribution-week-item" :date="dayItem.date" :day="dayIndex == 0 && generateDateDay(dayItem.date)" :month="dayIndex == 0 && generateDateDay(dayItem.date) < 8 && generateMonth(dayItem.date)" v-for="(dayItem,dayIndex) in weekItem.contributionDays" :key="dayItem.date" :style="{backgroundColor:dayItem.color}">
                            </Day>
                        </WeekItem>
                    </div>
                </Weeks>
            </Content>
            
            <Footer class="contrib-footer mt-1 mr-3 px-3 pb-1 clearfix">
                <div class="float-left">
                    <a href="https://help.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile">Learn how we count contributions</a>
                </div>
                <Legend class="float-right text-gray">
                    Less
                    <ul class="legend">
                        <li style="background-color: #ebedf0"></li>
                        <li style="background-color: #c6e48b"></li>
                        <li style="background-color: #7bc96f"></li>
                        <li style="background-color: #239a3b"></li>
                        <li style="background-color: #196127"></li>
                    </ul> 
                    More
                </Legend>
            </Footer>
        </ContributionPerDay>
       
        <ContributionClassificationRatio class="Box mb-5 p-3 contribution-classification-ratio border-top">
            <OrganizationsRow class="subnav mb-2 d-flex flex-wrap">
                <router-link exact="" v-for="item in organizations.data" :key="item.login" :to="`/${login}?org=${item.login}`" class="f6 p-1 pr-2 rounded-1 mr-2 mb-2 subnav-item css-truncate css-truncate-target ">
                    <img class="avatar mr-1" :alt="`item.login`" height="20" width="20" :src="item.avatarUrl">
                    {{item.login}}
                </router-link>
                <button class="f6 rounded-1 border link-gray py-1 px-3 height-full" @click="() => showModal('orgsModal')">
                    <span style="height: 21px" class="d-inline-block v-align-middle">More</span>
                </button>
            </OrganizationsRow>

            <h5 class="mb-3 text-normal">
                Activity overview
            </h5>

            <div class="d-flex mb-2">
                <svg class="octicon octicon-repo text-gray mt-1 mr-2 flex-shrink-0" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"></path></svg>
                <div class="profile-break-word">
                    Contributed to
                    <router-link v-for="(item,index) in contextRepositores.slice(0,3)" :key="item.nameWithOwner" :to="`/${item.nameWithOwner}`" class="context-repo-link text-bold css-truncate css-truncate-target" style="max-width:100%;">
                        {{org ? item.name : item.nameWithOwner}}<span style="color:#24292e;" v-if="index < 2 && index < contextRepositores.length -1">,&nbsp;</span>
                    </router-link>
                    <span class="no-wrap" v-if="contextRepositores.length - 3 > 0">
                        and {{contextRepositores.length - 3}} other repositories
                    </span>
                </div>
            </div>

            <ContributionClassificationSvgWrapper>
                <ContributionClassificationSvg v-if="contributionActivityGroupLastYear"  
                                                :issuesContributionCount="contributionActivityGroupLastYear.issueContributionActivity.totalCount" 
                                                :pullRequestsContributionCount="contributionActivityGroupLastYear.pullRequestContributionActivity.totalCount" 
                                                :codeReviewsContributionCount="contributionActivityGroupLastYear.pullRequestReviewContributionActivity.totalCount" 
                                                :commitsContributionCount="contributionActivityGroupLastYear.commitContributionActivity.totalCount"></ContributionClassificationSvg>
            </ContributionClassificationSvgWrapper>
        </ContributionClassificationRatio>

         <Title class="f4 mb-2 text-normal">
            Contribution activity <span v-if="org">in {{org}}</span>
        </Title>

        <ContributionActivityGroup v-if="contributionActivityGroups[0]" :contributionActivityGroup="contributionActivityGroups[0]"></ContributionActivityGroup>

        <Modal title="Organizations" ref="orgsModal" :modalStyle="{height:'80vh'}">
            <div v-if="organizations.all.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <SimpleSearchInput  class="p-3 modal-search-input" 
                                placeholder="Filter organizations" 
                                v-if="!organizations.all.loading"
                                v-model="organizations.orgsModalSearchQuery"/>
            <transition-group name="slide-up" appear>
                <router-link @click.native="closeModal" class="d-block" v-for="item in allOrgsExceptPinned" :key="item.login" :to="`/${login}?org=${item.login}`">
                    <SelectMenuItem :selected="true"  >
                        <template v-slot:icon>
                            <img class="select-menu-item-icon mr-2" :alt="`@${item.login}`" height="20" width="20" :src="item.avatarUrl">
                        </template>
                        {{item.login}}
                    </SelectMenuItem>
                </router-link>
            </transition-group>
        </Modal>

    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Modal,LoadingIconEx,SimpleSearchInput,SelectMenuItem} from '@/components'
    import * as graphql from '../graphql'
    import {util_numberFormat,util_dateFormat} from '@/util'
    import ContributionClassificationSvg from './ContributionClassificationSvg'
    import ContributionActivityGroup from './ContributionActivityGroup'
    import {authRequiredGitHubGraphqlApiQuery,cancelAndUpdateAxiosCancelTokenSource} from '@/network' 
    export default {
        name: 'user_overview_contribution_statistic',
        data() {
            return {
                contributionCountLastYear: 0,
                contributionCalendarWeeks: [],
                organizations: {
                    orgsModalSearchQuery: '',
                    data: [],
                    totalCount: 0,
                    all: {
                        data: [],
                        loading: false
                    }
                },
                loading: false,
                contributionActivityGroupLastYear: undefined,
                contributionActivityGroups: []
            }
        },
        computed: {
            reversedContributionCalendarWeeks() {
                let copyOne = [
                    ...this.contributionCalendarWeeks
                ]
                return copyOne.reverse()
            },
            login() {
                return this.$route.params.login
            },
            org() {
                return this.$route.query.org
            },
            from() {
                let from = this.$route.from
                if(!from){
                    let now = new Date()
                    now.setDate(1)
                    from = util_dateFormat.dateFormat("yyyy-MM-ddThh:mm:ss",now)
                }
                return from
            },
            to() {
                let to = this.$route.to
                if(!to){
                    let now = new Date()
                    to = util_dateFormat.dateFormat("yyyy-MM-ddThh:mm:ss",now)
                }
                return to
            },
            formatLastYearContributionCount() {
                return util_numberFormat.thousands(this.contributionCountLastYear)
            },
            allOrgsExceptPinned() {
                return this.organizations.all.data.filter(i => {
                    return !this.organizations.data.some(i_ => {
                        return i_.login == i.login
                    })
                }).filter(i => {
                   return  !this.organizations.orgsModalSearchQuery || i.login.indexOf(this.organizations.orgsModalSearchQuery) > -1
                })
            },
            contextRepositores() {
                if(!this.contributionActivityGroupLastYear) return []
                 let contextRepoPool = [
                        ...this.contributionActivityGroupLastYear.commitContributionActivity.repositories,
                        ...this.contributionActivityGroupLastYear.issueContributionActivity.repositories,
                        ...this.contributionActivityGroupLastYear.pullRequestContributionActivity.repositories,
                        ...this.contributionActivityGroupLastYear.pullRequestReviewContributionActivity.repositories,
                    ]

                    let contextRepositores = []

                    contextRepoPool.forEach(i => {
                        if(!contextRepositores.some(i_ => i_.nameWithOwner == i.repository.nameWithOwner)) {
                            contextRepositores.push(i.repository)
                        }
                    })

                    return contextRepositores
            }   
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let organizationID
                    if(this.org) {
                        let cancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_org_id').cancelToken
                        let graphql_organization = graphql.GRAPHQL_ORG(this.org)
                        let res_organization = await authRequiredGitHubGraphqlApiQuery(graphql_organization,{cancelToken})
                        organizationID = res_organization.data.data.organization.id
                    }

                    let cancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name).cancelToken
                    let graphql_contributionStatistic = graphql.GRAPHQL_USER_CONTRIBUTION_STATISTIC({
                        login: this.login,
                        organizationID: organizationID,
                    })
                    let graphql_periodContributionStatistic = graphql.GRAPHQL_USER_PERIOD_CONTRIBUTION_STATISTIC({
                        login: this.login,
                        organizationID: organizationID,
                        from: this.from,
                        to: this.to
                    })
                    console.log(graphql_periodContributionStatistic)

                    let res = await Promise.all([
                        authRequiredGitHubGraphqlApiQuery(graphql_contributionStatistic,{cancelToken}),
                        authRequiredGitHubGraphqlApiQuery(graphql_periodContributionStatistic,{cancelToken})
                    ])

                    this.contributionCalendarWeeks = res[0].data.data.user.contributionsCollection.contributionCalendar.weeks
                    this.contributionCountLastYear = res[0].data.data.user.contributionsCollection.contributionCalendar.totalContributions

                    this.organizations.data = res[0].data.data.user.organizations.nodes

                    let commitsContributionTotalCount = 0
                    res[0].data.data.user.contributionsCollection.commitContributions.forEach(i => {
                        commitsContributionTotalCount = commitsContributionTotalCount + i.contributions.totalCount
                    })

                    let contributionActivityGroupLastYear = {
                        issueContributionActivity: {
                            totalCount: res[0].data.data.user.contributionsCollection.issueContributions.totalCount,
                            repositories: res[0].data.data.user.contributionsCollection.issueContributionsByRepository,
                        },
                        pullRequestContributionActivity: {
                            totalCount: res[0].data.data.user.contributionsCollection.pullRequestContributions.totalCount,
                            repositories: res[0].data.data.user.contributionsCollection.pullRequestContributionsByRepository,
                        },
                        pullRequestReviewContributionActivity: {
                            totalCount: res[0].data.data.user.contributionsCollection.pullRequestReviewContributions.totalCount,
                            repositories: res[0].data.data.user.contributionsCollection.pullRequestReviewContributionsByRepository,
                        },
                        commitContributionActivity: {
                            totalCount: commitsContributionTotalCount,
                            repositories: res[0].data.data.user.contributionsCollection.commitContributionsByRepository,
                        }
                    }

                    this.contributionActivityGroupLastYear = contributionActivityGroupLastYear

                    let commitsContributionPeriodTotalCount = 0
                    res[1].data.data.user.contributionsCollection.commitContributions.forEach(i => {
                        commitsContributionPeriodTotalCount = commitsContributionPeriodTotalCount + i.contributions.totalCount
                    })

                    let contributionActivityGroupPeriod = {
                        from: this.from,
                        to: this.to,
                        issueContributionActivity: {
                            totalCount: res[1].data.data.user.contributionsCollection.issueContributions.totalCount,
                            repositories: res[1].data.data.user.contributionsCollection.issueContributionsByRepository,
                        },
                        pullRequestContributionActivity: {
                            totalCount: res[1].data.data.user.contributionsCollection.pullRequestContributions.totalCount,
                            repositories: res[1].data.data.user.contributionsCollection.pullRequestContributionsByRepository,
                        },
                        pullRequestReviewContributionActivity: {
                            totalCount: res[1].data.data.user.contributionsCollection.pullRequestReviewContributions.totalCount,
                            repositories: res[1].data.data.user.contributionsCollection.pullRequestReviewContributionsByRepository,
                        },
                        commitContributionActivity: {
                            totalCount: commitsContributionPeriodTotalCount,
                            repositories: res[1].data.data.user.contributionsCollection.commitContributionsByRepository,
                        },
                        createdRepositoryContributionActivity: {
                            totalCount: res[1].data.data.user.contributionsCollection.repositoryContributions.totalCount,
                            repositories: res[1].data.data.user.contributionsCollection.repositoryContributions.nodes,
                        },
                        popularPullRequestContributionActivity: {
                            pullRequest: res[1].data.data.user.contributionsCollection.popularPullRequestContribution.pullRequest,
                            occurredAt: res[1].data.data.user.contributionsCollection.popularPullRequestContribution.occurredAt
                        }
                    }

                    this.contributionActivityGroups[0] = contributionActivityGroupPeriod

                    this.loading = false
                }catch(e) {
                    console.log(e)
                    this.loading = false
                }
            },  
            async network_getAllOrgs() {
                if(this.organizations.all.data.length > 0) return
                try{
                    this.organizations.all.loading = true
                    let graphql_allOrgs = graphql.GRAPHQL_ALL_ORGS(this.login)
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_allOrgs)
                    this.organizations.all.data = res.data.data.user.organizations.nodes
                    this.organizations.all.loading = false
                }catch(e) {
                    console.log(e)
                    this.organizations.all.loading = false
                }
            },
            generateDateDay(dateStr) {
                let day = dateStr.substring(dateStr.length - 2,dateStr.length)
                if(day[0] == '0') return day[1]
                return day
            },
            generateMonth(dateStr) {
                let month = dateStr.substring(5,7)
                if(month[0] == '0') return ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'][month[1] - 1]
                return ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'][month - 1]
            },
            closeModal() {
                for(let key in this.$refs) {
                    if(this.$refs[key].show) this.$refs[key].show = false 
                }
            },
            showModal(ref) {
                this.$refs[ref].show = true
                if(ref == 'orgsModal') {
                    this.network_getAllOrgs()
                }
            }
        },
        watch: {
            login() {
                Object.assign(this.$data,this.$options.data())
                this.network_getData()
            },
            org() {
                this.network_getData()
            }
        },
        components: {
            ContributionClassificationSvg,
            Modal,
            LoadingIconEx,
            SimpleSearchInput,
            SelectMenuItem,
            ContributionActivityGroup,
            Container: styled.div``,
            Title: styled.h2``,
            ContributionPerDay: styled.div``,
            Content: styled.div``,
            WeekDateIndexColumn: styled.div``,
            Weeks: styled.div``,
            WeekItem: styled.span``,
            Day: styled.span``,
            Footer: styled.div``,
            Legend: styled.div``,
            ContributionClassificationRatio: styled.div``,
            OrganizationsRow: styled.nav``,
            ContributionClassificationSvgWrapper: styled.div``,
            OrgModalListItem: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/layout/index.scss';
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/navigation/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
@import 'node_modules/@primer/css/truncate/index.scss';

.contribution-perday{
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
}

.contribution-classification-ratio{
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
}

.contribution-week-item{
    position: relative;
    width: 12px;
    height: 12px;
    margin-right:3px;
    margin-bottom:3px;
    overflow: visible;
    span{
        position: absolute;
        left: 0;
        font-size: 9px;
        color: #767676;
        word-break: keep-all;
    }
}

.contribution-week-item[day="1"]:before, 
.contribution-week-item[day="2"]:before, 
.contribution-week-item[day="3"]:before,
.contribution-week-item[day="4"]:before,
.contribution-week-item[day="5"]:before, 
.contribution-week-item[day="6"]:before,
.contribution-week-item[day="7"]:before 
{
    position: absolute;
    left: 0;
    bottom: calc(100% + 4px);
    word-break: keep-all;
    font-size: 9px;
    color: #767676;
    content: attr(month)
}
.main{
    overflow-x: scroll;
    overflow-y: visible;;
    direction: rtl;
}
.contrib-footer {
    padding: 0 10px 12px;
    font-size: 11px;
}
.legend {
    position: relative;
    bottom: -1px;
    display: inline-block;
    margin: 0 5px;
    list-style: none;
    li{
        display: inline-block;
        width: 10px;
        height: 10px;
    }
}

.profile-break-word {
    -webkit-hyphens: auto;
    -ms-hyphens: auto;
    hyphens: auto;
    word-break: break-word;
}

.router-link-active{
    z-index: 2;
    color: #fff;
    background-color: #0366d6;
    border-color: #0366d6;
}

.modal-search-input{
    background:#f6f8fa;
    position: sticky;
    top: 0;
}
</style>