<template>
    <Container>
        <Title class="f4 mb-2 text-normal">
            {{contributionIllustration.lastContributionsCount}} contributions in the last year
        </Title>

        <ContributionPerDay  class="contribution-perday px-3 border-gray-dark border py-2 position-relative" :class="{loading:contributionIllustration.loading}">
            <AnimatedHeightWrapper>
                <Content class="d-flex" v-if="contributionIllustration.weeks.length > 0">
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
                            <WeekItem class="d-flex flex-column" v-for="(weekItem,weekIndex) in contributionIllustration.weeks" :key="weekIndex">
                                <Day class="contribution-week-item data-count"    
                                :class="[{'not-selected':selectedDate && (selectedDate != day.date),'data-count-most':day.dataCount > 3},`data-count-${day.dataCount}`]" 
                                @click="() => routerWithSpecificDate(day.date)" 
                                :date="day.date" 
                                v-for="(day,dayIndex) in weekItem" 
                                :day="dayIndex == 0 && generateDateDay(day.date)" 
                                :month="dayIndex == 0 && generateDateDay(day.date) < 8 && generateMonth(day.date)"
                                :key="day.date" 
                                :dataCount="day.dataCount">
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
                <Legend class="float-right text-gray mt-2">
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

            <LoadingWrapper v-if="contributionIllustration.loading || contributionActivities.loading" class="corner position-absolute">
                <img    alt="loading"
                        class="width-fit height-fit"
                        src="@/assets/image/octocat-spinner-128.gif"/>
            </LoadingWrapper>
            
        </ContributionPerDay>

        <ContributionClassificationRatio  v-if="contributionIllustration.contributionRatio['Issues']" class="Box p-3 contribution-classification-ratio border-top  position-relative" :class="{loading:contributionIllustration.loading}">
            <OrganizationsRow class="subnav mb-2 d-flex flex-wrap">
                <router-link exact="" v-for="item in contributionIllustration.organizations.slice(0,3)" :key="item.login" :to="`/${login}?org=${item.login}`" class="f6 p-1 pr-2 rounded-1 mr-2 mb-2 subnav-item css-truncate css-truncate-target ">
                    <img class="avatar mr-1" :alt="`item.login`" height="20" width="20" :src="item.avatar">
                    {{item.login}}
                </router-link>
                <button class="f6 rounded-1 border link-gray py-1 px-3 height-full" @click="() => showModal('orgsModal')" v-if="contributionIllustration.organizations.length > 3">
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
                    <router-link v-for="(item,index) in contributionIllustration.repositories" :key="item" :to="`/${item}`" class="context-repo-link text-bold css-truncate css-truncate-target" style="max-width:100%;">
                        {{item}}<span style="color:#24292e;" v-if="index < contributionIllustration.repositories.length - 1">,&nbsp;</span>
                    </router-link>
                    <span class="no-wrap" v-if="contributionIllustration.extraRepositoriesCount != 0">
                        and {{contributionIllustration.extraRepositoriesCount}} other repositories
                    </span>
                </div>
            </div>

            <ContributionClassificationSvgWrapper>
                <ContributionClassificationSvg 
                                                :issuesContributionPercent="parseInt(contributionIllustration.contributionRatio['Issues'])" 
                                                :pullRequestsContributionPercent="parseInt(contributionIllustration.contributionRatio['Pull requests'])" 
                                                :codeReviewsContributionPercent="parseInt(contributionIllustration.contributionRatio['Code review'])" 
                                                :commitsContributionPercent="parseInt(contributionIllustration.contributionRatio['Commits'])"></ContributionClassificationSvg>
            </ContributionClassificationSvgWrapper>
        </ContributionClassificationRatio>

        
        <Title class="f4 mt-5 mb-2 text-normal">
            Contribution activity <span v-if="currentOrganization">in {{currentOrganization}}</span>
        </Title>
        
        <transition-group appear name="fade-group">
            <div key="loading" class="text-center p-3" v-if="contributionsCollectionWithPeriod.data.length == 0 && contributionsCollectionWithPeriod.loading">
                Loading contribution activity...
            </div> 
            <ContributionCollection v-for="item in contributionsCollectionWithPeriod.data"  :contributionsCollection="item" :key="item.endedAt"></ContributionCollection>
        </transition-group>

        <LoginNecessaryNotice v-if="!accessToken" class="d-flex flex-justify-center px-3 py-4 text-gray-light">
            <a href="javascript:void(0)" class="btn-link" @click="signIn">Sign up with Oauth&nbsp;</a>
            to show contribution activities.
        </LoginNecessaryNotice>

        <button v-if="contributionsCollectionWithPeriod.data.length > 0 && accessToken" @click="network_getMoreContributionActivities" :disabled="contributionsCollectionWithPeriod.loading" :class="{'my-3':contributionsCollectionWithPeriod.data.length == 0}" class="contribution-activity-show-more-btn btn btn-outline border-gray-dark width-full f6 py-2">
            {{
                contributionsCollectionWithPeriod.loading ? 'Loading...' : 'Show more activity'
            }}
        </button>

        <Modal title="Organizations" ref="orgsModal" :modalStyle="{height:'80vh'}">
            <SimpleSearchInput  class="p-3 modal-search-input" 
                                placeholder="Filter organizations" 
                                v-model="contributionIllustration.organizationsSearchQuery"/>
            <router-link @click.native="closeModal" class="d-block" v-for="item in filterModalOrganizations" :key="item.login" :to="`/${login}?org=${item.login}`">
                <SelectMenuItem :selected="true"  >
                    <template v-slot:icon>
                        <img class="select-menu-item-icon mr-2" :alt="`@${item.login}`" height="20" width="20" :src="item.avatar">
                    </template>
                    {{item.login}}
                </SelectMenuItem>
            </router-link>
        </Modal>

        

    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Modal,LoadingIconEx,SimpleSearchInput,SelectMenuItem,AnimatedHeightWrapper} from '@/components'
    import * as graphql from '../graphql'
    import * as api from '@/network/api'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {util_numberFormat,util_dateFormat,util_queryParse} from '@/util'
    import ContributionClassificationSvg from './ContributionClassificationSvg'
    import ContributionCollection from './ContributionCollection'
    import {authRequiredGitHubGraphqlApiQuery,cancelAndUpdateAxiosCancelTokenSource,commonGet} from '@/network' 
    import Vue from 'vue'
    export default {
        mixins: [RouteUpdateAwareMixin],
        name: 'user_overview_contribution_statistic',
        provide() {
            return {
                mostRecentDateWithActivityProvided: () => this.mostRecentDateWithActivity
            }
        },
        data() {
            return {
                contributionIllustration: {
                    lastContributionsCount: 0,
                    days: [],
                    weeks: [],
                    loading: false,
                    organizations: [],
                    organizationsSearchQuery: '',
                    repositories: [],
                    extraRepositoriesCount: 0,
                    contributionRatio: {
                        "Commits": undefined,
                        "Code review": undefined,
                        "Issues": undefined,
                        "Pull requests": undefined
                    }
                },
                contributionActivities: {
                    data: [],
                    loading: false
                },
                contributionsCollectionWithPeriod: {
                    data: [],
                    loading: false
                },
                currentOrganizationID: undefined,
               
            }
        },
        computed: {
            login() {
                return this.$route.params.login
            },
            from() {
                return this.$route.query.from
            },
            to() {
                return this.$route.query.to
            },
            updateFlag() {
                return `${this.login}-${this.org}`
            },
            contributionActivitiesUpdateFlag() {
                return `${this.to}-${this.from}`
            },
            currentOrganization() {
                return this.$route.query.org
            },
            filterModalOrganizations() {
                return this.contributionIllustration.organizations.slice(3,this.contributionIllustration.organizations.length).filter(i => {
                    return i.login.toLowerCase().indexOf(this.contributionIllustration.organizationsSearchQuery.toLowerCase()) != -1
                })
            },
            mostRecentDateWithActivity() {
                if(this.contributionIllustration.days.lenght == 0) return
                let theDate 
                let daysCopy = [
                    ...this.contributionIllustration.days
                ]
                try{
                    daysCopy.reverse().forEach(i => {
                        if(theDate) throw new Error('break forEach')
                        if(i.dataCount != 0) theDate = i.date
                    })
                }catch(e) {
                    //do nothing
                }
                if(!theDate) return 
                return util_dateFormat.dateFormat("yyyy-MM-ddThh:mm:ss",theDate)
            },
            selectedDate() {
                if(this.to && this.from) {
                    let to_date = new Date(this.to)
                    let from_date = new Date(this.from)
                    if(util_dateFormat.dateFormat('yyyy-MM-dd',to_date) == util_dateFormat.dateFormat('yyyy-MM-dd',from_date)) {
                        return util_dateFormat.dateFormat('yyyy-MM-dd',to_date)
                    }
                }
            }
        },
        async created() {
            this.network_getData()
        },

        methods: {
            network_getData() {
                this.network_getContributionIllustration()
                if(this.accessToken) this.network_getContributionActivities()
            },
            async network_getContributionIllustration() {
                try{
                    this.contributionIllustration.loading = true
                    let cancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_contribution_illustration').cancelToken
                    let url = api.API_PROXY_USER_CONTRIBUTION_ILLUSTRATION({
                        user: this.login,
                        params: {
                            org: this.currentOrganization
                        }
                    })
                    let res = await commonGet(url,{cancelToken})
                    this.parseContributionIllustration(res.data)
                    this.contributionIllustration.loading = false
                }catch(e) {
                    console.log(e)
                    if(e.response && e.response.status == 502) this.network_getContributionIllustration() 
                }
            },
            async network_getContributionActivities() {
                try{
                    this.contributionsCollectionWithPeriod.loading = true

                    let cancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_contribution_activities').cancelToken

                    if(this.currentOrganization) {
                        let res_org = await authRequiredGet(api.API_ORG(this.currentOrganization),{cancelToken})
                        this.currentOrganizationID = res_org.data.node_id
                    }

                    let now = new Date()
                    let _to 
                    let _from
                    _to = this.to || util_dateFormat.dateFormat("yyyy-MM-ddThh:mm:ss",now)
                    now.setDate(1)
                    now.setHours(1)
                    now.setUTCMinutes(1)
                    now.setUTCMilliseconds(0)
                    _from = this.from || util_dateFormat.dateFormat("yyyy-MM-ddThh:mm:ss",now)
                    let graphql_periodContributionsCollection = graphql.GRAPHQL_USER_PERIOD_CONTRIBUTION_STATISTIC

                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql_periodContributionsCollection,
                        {
                            cancelToken,
                            variables: {
                                login: this.login,
                                organizationID:  this.currentOrganizationID,
                                from: _from,
                                to: _to
                            }
                        }
                    )

                    try{
                        this.contributionsCollectionWithPeriod.data = [
                            res.data.data.user.contributionsCollection
                        ]
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }

                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.contributionsCollectionWithPeriod.loading = false
                }
               
            },
            async network_getMoreContributionActivities() {
                try{
                    this.contributionsCollectionWithPeriod.loading = true
                    let lastContributionsCollectionStartedAt = this.contributionsCollectionWithPeriod.data[this.contributionsCollectionWithPeriod.data.length - 1].startedAt
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
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_USER_PERIOD_CONTRIBUTION_STATISTIC,
                        {
                           variables: {
                                login: this.login,
                                organizationID:  this.currentOrganizationID,
                                from: util_dateFormat.dateFormat("yyyy-MM-ddThh:mm:ss",fromDate),
                                to: util_dateFormat.dateFormat("yyyy-MM-ddThh:mm:ss",toDate)
                           }
                        }
                    )
                    try{
                        this.contributionsCollectionWithPeriod.data.push(res.data.data.user.contributionsCollection)
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                }catch(e) {
                    this.handleError(e)
                }finally {
                    this.contributionsCollectionWithPeriod.loading = false
                }
            },
            parseContributionIllustration(HTML) {
                let dayExecPattern = /<rect.*fill="(.*)" data-count="(.*)" data-date="(.*)"\/>/g
                let dayExecResult
                let weeks = []
                let days = []
                while((dayExecResult = dayExecPattern.exec(HTML)) != null) {
                    days.push({
                        fill: dayExecResult[1],
                        dataCount: dayExecResult[2],
                        date: dayExecResult[3]
                    })
                    if(weeks[weeks.length - 1] && weeks[weeks.length - 1].length < 7) {
                        weeks[weeks.length - 1].push({
                            fill: dayExecResult[1],
                            dataCount: dayExecResult[2],
                            date: dayExecResult[3],
                        })
                    }else{
                        weeks.push([
                            {
                                fill: dayExecResult[1],
                                dataCount: dayExecResult[2],
                                date: dayExecResult[3],
                            }
                        ])
                    }
                }
                this.contributionIllustration.weeks = weeks.reverse()
                this.contributionIllustration.days = days

                let contributionRatioExecPattern = /(Commits|Pull requests|Code review|Issues)&quot;:([0-9]*)/g
                let contributionRatioExecResult
                while((contributionRatioExecResult = contributionRatioExecPattern.exec(HTML)) != null) {
                    this.contributionIllustration.contributionRatio[contributionRatioExecResult[1]] = contributionRatioExecResult[2]
                }

                let organizationsExecPattern = /<a[^>]*>(?:\n|\r)\s*<img.*src="(.*)" \/>(?:\n|\r)\s*(?:<div[^>]*>(.*)<\/div>|(.*))(?:\n|\r)\s*<\/a>/g
                let organizationsExecResult
                let organizationsData = []
                while((organizationsExecResult = organizationsExecPattern.exec(HTML)) != null) {
                    organizationsData.push({
                        avatar: organizationsExecResult[1],
                        login: organizationsExecResult[2] || organizationsExecResult[3],
                    })
                }
                this.contributionIllustration.organizations = organizationsData

                let repositoriesExecPattern = /<a[^>]*data-hovercard-type="repository"[^>]*>(.*)<\/a>/g
                let repositoriesExecResult
                let repositoriesData = []
                while((repositoriesExecResult = repositoriesExecPattern.exec(HTML)) != null) {
                    repositoriesData.push(repositoriesExecResult[1])
                }
                this.contributionIllustration.repositories = repositoriesData


                let contributionsCountPattern = /((?:[0-9]*|,)*) contributions/g
                let contributionsCountExecResult = contributionsCountPattern.exec(HTML)
                if(contributionsCountExecResult) {
                    this.contributionIllustration.lastContributionsCount = contributionsCountExecResult[1]
                }

                let extraRepositoriesCountPattern = /and ((?:[0-9]*|,)*) other/g
                let extraRepositoriesCountExecResult = extraRepositoriesCountPattern.exec(HTML)
                if(extraRepositoriesCountExecResult) {
                    this.contributionIllustration.extraRepositoriesCount = extraRepositoriesCountExecResult[1]
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
                    to: date,
                    from: date
                })
                this.$router.push(`${this.$route.path}?${query}`)
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
                if(this.$refs[ref]) this.$refs[ref].show = true
            },
            routerWithSpecificDate(date) {
                if(!date.match(/^[1-9][0-9]{3}-[0-1][0-9]-[0-3][0-9]$/)) return
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
                this.$router.push(`${this.$route.path}?${query}`)
            },
            generateRouterMeta() {
                return this.login
            }
        },
        components: {
            ContributionClassificationSvg,
            Modal,
            LoadingIconEx,
            AnimatedHeightWrapper,
            SimpleSearchInput,
            SelectMenuItem,
            ContributionCollection,
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
            OrgModalListItem: styled.div``,
            LoginNecessaryNotice: styled.div``,
            LoadingWrapper: styled.div``
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
    width: 11px;
    height: 11px;
    margin-right:4px;
    margin-bottom:4px;
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
    overflow-y: visible;
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
        border: 1px solid rgba(27,31,35,0.06);
        border-radius: 2px;
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

.corner{
        bottom: 10px !important;
        right: 10px !important;
        height: 30px !important;
        width: 30px !important;
    }
.data-count{
    border: 1px solid rgba(27,31,35,0.06);
    border-radius: 2px;
}

.data-count-0{
    background: #ebedf0;
}
.data-count-1{
    background: #9be9a8;
}
.data-count-2{
    background: #40c463;
}
.data-count-3{
    background: #30a14e;
}
.data-count-most{
    background: #216e39;
}
</style>