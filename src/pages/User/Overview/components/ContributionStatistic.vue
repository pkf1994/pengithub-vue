<template>
    <div>
        <Title class="f4 mb-2 text-normal">
            {{formatLastYearContributionCount}} contributions in the last year
        </Title>
       
        <ContributionPerDay  class="contribution-perday px-3 border-gray-dark border py-2 position-relative" :class="{loading:loading}">
            <AnimatedHeightWrapper>
                <Content class="d-flex" v-if="reversedContributionCalendarWeeks.length > 0">
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
                                <Day class="contribution-week-item" :class="{'not-selected':selectedDate && selectedDate != dayItem.date}" @click="() => routerWithSpecificDate(dayItem.date)" :date="dayItem.date" :day="dayIndex == 0 && generateDateDay(dayItem.date)" :month="dayIndex == 0 && generateDateDay(dayItem.date) < 8 && generateMonth(dayItem.date)" v-for="(dayItem,dayIndex) in weekItem.contributionDays" :key="dayItem.date" :style="{backgroundColor:dayItem.color}">
                                </Day>
                            </WeekItem>
                        </div>
                    </Weeks>
                </Content>
            </AnimatedHeightWrapper>
             
            
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
       
        <AnimatedHeightWrapper class="mb-5">
            <ContributionClassificationRatio class="Box p-3 contribution-classification-ratio border-top  position-relative" :class="{loading:loading}">
                <OrganizationsRow class="subnav mb-2 d-flex flex-wrap">
                    <router-link exact="" v-for="item in organizations.data" :key="item.login" :to="`/${login}?org=${item.login}`" class="f6 p-1 pr-2 rounded-1 mr-2 mb-2 subnav-item css-truncate css-truncate-target ">
                        <img class="avatar mr-1" :alt="`item.login`" height="20" width="20" :src="item.avatarUrl">
                        {{item.login}}
                    </router-link>
                    <button class="f6 rounded-1 border link-gray py-1 px-3 height-full" @click="() => showModal('orgsModal')" v-if="organizations.totalCount > organizations.data.length">
                        <span style="height: 21px" class="d-inline-block v-align-middle" >More</span>
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
                    <ContributionClassificationSvg 
                                                    :issuesContributionCount="contributionsCollectionLastYear.issueContributions && contributionsCollectionLastYear.issueContributions.totalCount" 
                                                    :pullRequestsContributionCount="contributionsCollectionLastYear.pullRequestContributions && contributionsCollectionLastYear.pullRequestContributions.totalCount" 
                                                    :codeReviewsContributionCount="contributionsCollectionLastYear.pullRequestReviewContributions && contributionsCollectionLastYear.pullRequestReviewContributions.totalCount" 
                                                    :commitsContributionCount="commitContributionCount"></ContributionClassificationSvg>
                </ContributionClassificationSvgWrapper>
            </ContributionClassificationRatio>
        </AnimatedHeightWrapper>
        

        <Title class="f4 mb-2 text-normal">
            Contribution activity <span v-if="org">in {{org}}</span>
        </Title>

        <transition-group appear name="fade-group">
            <ContributionCollection v-for="item in contributionsCollectionWithPeriod"  :contributionsCollection="item" :key="item.endedAt"></ContributionCollection>
        </transition-group>



        <button v-if="contributionsCollectionWithPeriod.length > 0" @click="network_getMoreContributionsCollection" :disabled="loadingMoreContributionCollections" class="contribution-activity-show-more-btn btn btn-outline border-gray-dark width-full f6 mt-0 py-2">
            {{
                loadingMoreContributionCollections ? 'Loading...' : 'Show more activity'
            }}
        </button>

        <Modal title="Organizations" ref="orgsModal" :modalStyle="{height:'80vh'}">
            <div v-if="organizations.all.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <SimpleSearchInput  class="p-3 modal-search-input" 
                                placeholder="Filter organizations" 
                                v-if="!organizations.all.loading"
                                v-model="organizations.orgsModalSearchQuery"/>
            <router-link @click.native="closeModal" class="d-block" v-for="item in allOrgsExceptPinned" :key="item.login" :to="`/${login}?org=${item.login}`">
                <SelectMenuItem :selected="true"  >
                    <template v-slot:icon>
                        <img class="select-menu-item-icon mr-2" :alt="`@${item.login}`" height="20" width="20" :src="item.avatarUrl">
                    </template>
                    {{item.login}}
                </SelectMenuItem>
            </router-link>
        </Modal>

    </div>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Modal,LoadingIconEx,SimpleSearchInput,SelectMenuItem,AnimatedHeightWrapper} from '@/components'
    import * as graphql from '../graphql'
    import {util_numberFormat,util_dateFormat,util_queryParse} from '@/util'
    import ContributionClassificationSvg from './ContributionClassificationSvg'
    import ContributionCollection from './ContributionCollection'
    import {authRequiredGitHubGraphqlApiQuery,cancelAndUpdateAxiosCancelTokenSource} from '@/network' 
    import Vue from 'vue'
    export default {
        name: 'user_overview_contribution_statistic',
        provide() {
            return {
                mostRecentDateWithActivityProvided: () => this.mostRecentDateWithActivity
            }
        },
        data() {
            return {
                contributionsCollectionLastYear: {},
                contributionsCollectionWithPeriod: [],
                organizations: {
                    currentOrgID: undefined,
                    orgsModalSearchQuery: '',
                    data: [],
                    totalCount: 0,
                    all: {
                        data: [],
                        loading: false
                    }
                },
                loading: false,
                loadingMoreContributionCollections: false,
                selectedDate: undefined
            }
        },
        computed: {
            reversedContributionCalendarWeeks() {
                if(!this.contributionsCollectionLastYear.contributionCalendar) return []
                let weeks = this.contributionsCollectionLastYear.contributionCalendar.weeks || []
                let copyOne = [
                    ...weeks
                ]
                copyOne.reverse()

                copyOne.forEach(item => {
                    let newContributionDays = [
                        ...item.contributionDays
                    ]
                    newContributionDays.reverse()
                    item.contributionDays = newContributionDays
                })
             
                /* 死循环警告
                    copyOne.forEach(item => {
                        item.contributionDays.reverse()
                    })
                */

                return copyOne
            },
            login() {
                return this.$route.params.login
            },
            org() {
                return this.$route.query.org
            },
            from() {
                let from = this.$route.query.from
                if(!from){
                    let now = new Date()
                    now.setDate(1)
                    from = util_dateFormat.dateFormat("yyyy-MM-ddThh:mm:ss",now)
                }
                return from
            },
            to() {
                let to = this.$route.query.to
                if(!to){
                    let now = new Date()
                    to = util_dateFormat.dateFormat("yyyy-MM-ddThh:mm:ss",now)
                }
                return to
            },
            formatLastYearContributionCount() {
                if(!this.contributionsCollectionLastYear.contributionCalendar) return 0
                return util_numberFormat.thousands(this.contributionsCollectionLastYear.contributionCalendar.totalContributions || 0)
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
                 let contextRepoPool = [
                    ...this.contributionsCollectionLastYear.issueContributionsByRepositorys || [],
                    ...this.contributionsCollectionLastYear.pullRequestContributionsByRepository  || [],
                    ...this.contributionsCollectionLastYear.pullRequestReviewContributionsByRepository  || [],
                    ...this.contributionsCollectionLastYear.commitContributionsByRepository || []
                ]
                let contextRepositores = []

                contextRepoPool.forEach(i => {
                    if(!contextRepositores.some(i_ => i_.nameWithOwner == i.repository.nameWithOwner)) {
                        contextRepositores.push(i.repository)
                    }
                })

                return contextRepositores
            },
            commitContributionCount() {
                let count = 0
                if(!this.contributionsCollectionLastYear.commitContributions) return 0
                this.contributionsCollectionLastYear.commitContributions.forEach(i => {
                    count = count + i.contributions.totalCount
                })
                return count
            },
            updateFlag() {
                return `${this.login}-${this.org}-${this.to}-${this.from}`
            },
            mostRecentDateWithActivity() {
                if(!this.contributionsCollectionLastYear.contributionCalendar) return
                let weeks = this.contributionsCollectionLastYear.contributionCalendar.weeks || []
                let copyOne = [
                    ...weeks
                ]
                let date = ''
                copyOne.forEach(i => {
                    i.contributionDays.reverse().forEach(i_ => {
                        if(i_.color !== "#ebedf0") {
                            date = i_.date
                            return false
                        }
                    }) 
                    if(date) return false
                })

                let dateInfoHolder = date.split('-')
                let year = dateInfoHolder[0]
                let month = dateInfoHolder[1] - 1
                let day = 1

                if(month < 11){
                    month += 1
                }else{
                    month = 0
                    year += 1
                }

                let theDate = new Date()
                theDate.setFullYear(year)
                theDate.setMonth(month)
                theDate.setDate(day)
                theDate.setHours(0)
                theDate.setUTCMinutes(0)
                theDate.setUTCMilliseconds(0)
                theDate.setSeconds(0)

                return util_dateFormat.dateFormat("yyyy-MM-ddThh:mm:ss",theDate)
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                /* Object.assign(this.$data,this.$options.data()) */
                try{
                    this.loading = true
                    if(this.org) {
                        let cancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_org_id').cancelToken
                        let graphql_organization = graphql.GRAPHQL_ORG(this.org)
                        let res_organization = await authRequiredGitHubGraphqlApiQuery(graphql_organization,{cancelToken})
                        this.organizations.currentOrgID = res_organization.data.data.organization.id
                    }

                    let cancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name).cancelToken
                    let graphql_contributionStatistic = graphql.GRAPHQL_USER_CONTRIBUTION_STATISTIC({
                        login: this.login,
                        organizationID: this.organizations.currentOrgID,
                    })
                    let graphql_periodContributionsCollection = graphql.GRAPHQL_USER_PERIOD_CONTRIBUTION_STATISTIC({
                        login: this.login,
                        organizationID: this.organizations.currentOrgID,
                        from: this.from,
                        to: this.to
                    })
                    console.log(graphql_periodContributionsCollection)

                    let res = await Promise.all([
                        authRequiredGitHubGraphqlApiQuery(graphql_contributionStatistic,{cancelToken}),
                        authRequiredGitHubGraphqlApiQuery(graphql_periodContributionsCollection,{cancelToken})
                    ])

                    this.contributionsCollectionLastYear = res[0].data.data.user.contributionsCollection
                    this.contributionsCollectionWithPeriod = [
                        res[1].data.data.user.contributionsCollection
                    ]
                    this.organizations.data = res[0].data.data.user.organizations.nodes
                    this.organizations.totalCount = res[0].data.data.user.organizations.totalCount
                   
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
            async network_getMoreContributionsCollection() {
                
                try{
                    this.loadingMoreContributionCollections = true
                    let lastContributionsCollectionStartedAt = this.contributionsCollectionWithPeriod[this.contributionsCollectionWithPeriod.length - 1].startedAt
                    let to = Date.parse(lastContributionsCollectionStartedAt) > Date.parse(this.mostRecentDateWithActivity) ? this.mostRecentDateWithActivity : lastContributionsCollectionStartedAt
                    let toDate = new Date(to)
                    let fromDate = new Date(to)
                    toDate.setDate(1)
                    fromDate.setDate(1)
                    toDate.setHours(0)
                    fromDate.setHours(0)
                    toDate.setUTCMinutes(0)
                    fromDate.setUTCMinutes(0)
                    if(toDate.getMonth() == 0) {
                        fromDate.setMonth(11)
                        fromDate.setFullYear(fromDate.getFullYear() - 1)
                    } else {
                        fromDate.setMonth(fromDate.getMonth() - 1)
                    }
                    to = util_dateFormat.dateFormat("yyyy-MM-ddThh:mm:ss",(new Date(to)).setDate(1))
                    let from = util_dateFormat.dateFormat("yyyy-MM-ddThh:mm:ss",(new Date(to)).setDate(1))
                    let graphql_periodContributionsCollection = graphql.GRAPHQL_USER_PERIOD_CONTRIBUTION_STATISTIC({
                        login: this.login,
                        organizationID: this.organizations.currentOrgID,
                        from: util_dateFormat.dateFormat("yyyy-MM-ddThh:mm:ss",fromDate),
                        to: util_dateFormat.dateFormat("yyyy-MM-ddThh:mm:ss",toDate)
                    })
                    console.log(graphql_periodContributionsCollection)
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_periodContributionsCollection)
                    this.contributionsCollectionWithPeriod.push(res.data.data.user.contributionsCollection)
                    this.loadingMoreContributionCollections = false
                }catch(e) {
                    console.log(e)
                    this.loadingMoreContributionCollections = false
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
            },
            routerWithSpecificDate(date) {
                if(!date.match(/^[1-9][0-9]{3}-[0-1][0-9]-[0-3][0-9]$/)) return
                this.selectedDate = date
                let dateInfoHolder = date.split('-')
                let year = dateInfoHolder[0]
                let month = dateInfoHolder[1] - 1
                let day = dateInfoHolder[2]

                let fromDate = new Date()
                fromDate.setFullYear(year)
                fromDate.setMonth(month)
                fromDate.setDate(day)
                fromDate.setHours(0)
                fromDate.setUTCMinutes(0)
                fromDate.setUTCMilliseconds(0)
                fromDate.setSeconds(0)
                
                let toDate = new Date(fromDate.getTime() + 24 * 60 * 60 * 1000 - 1)

                let query = util_queryParse.querify({
                    ...this.$route.query,
                    to: util_dateFormat.dateFormat("yyyy-MM-ddThh:mm:ss",toDate),
                    from: util_dateFormat.dateFormat("yyyy-MM-ddThh:mm:ss",fromDate),
                })
                console.log(`${this.$route.path}?${query}`)
                this.$router.push(`${this.$route.path}?${query}`)
            }
        },
        watch: {
            updateFlag() {
                this.network_getData()
            },
        },
        components: {
            ContributionClassificationSvg,
            Modal,
            LoadingIconEx,
            AnimatedHeightWrapper,
            SimpleSearchInput,
            SelectMenuItem,
            ContributionCollection,
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

.loading::after{
    position: absolute;
    background: white;
    opacity: 0.4;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    content: '';
}

.contribution-activity-show-more-btn{
    padding: 6px;
    font-weight: 600;
    color: #0366d6;
    background: #fff;
    border: 1px solid #e1e4e8;
    border-radius: 3px;
}

.not-selected{
    opacity: .5;
}
</style>