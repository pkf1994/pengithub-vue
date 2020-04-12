<template>
    <Container>
        <PageTopTab :tabs="tabs" />

        <Main class="bg-white pb-3">
            <SearchWrapper class="search-wrapper">
                <input aria-label="Search GitHub"
                       v-model="localSearchQuery"
                       autocapitalize="off"
                       autocomplete="off"
                       autofocus=""
                       ref="input"
                       class="search-input form-control input-block"
                       placeholder="Search GitHub"
                       spellcheck="false"
                       type="text"/>
            </SearchWrapper>

            <transition name="fade" appear>
                  <SimpleBubble v-if="recentActivities.data.length > 0"
                        :loading="loading"
                        :disableAnimatedWrapper="false"
                        title="Recent activity">
                    <ActivityListItem v-for="item in recentActivities.data.slice(0,4)" :event="item" :key="item.id" >
                    </ActivityListItem>
                </SimpleBubble>
            </transition>

            <transition name="fade" appear>
                   <SimpleBubble title="Repositories you contribute to"
                    v-if="repositoriesContributedTo.length > 0 || !loading"
                    :loading="loading"
                    :disableFlag="!loading && repositoriesContributedTo.length == 0"
                    disableNotice="You haven't contributed any repository yet.">
                    <RepositoryListItem v-for="item in repositoriesContributedTo.slice(0,10)" :key="item.nameWithOwner" :repository="item"/>
                </SimpleBubble>
            </transition>

            <transition name="fade" appear>
                <SimpleBubble title="Starred repositories"
                        v-if=" starredRepositories.length > 0 || !loading"
                        :loading="loading"
                        :disableFlag="!loading && starredRepositories.length === 0"
                        disableNotice="You haven't starred any repository yet">
                        <RepositoryListItem v-for="item in starredRepositories" :key="item.nameWithOwner" :repository="item"/>
                </SimpleBubble>
            </transition>
            
        </Main>

        <transition appear name="fade">
            <CommonLoading v-if="loading || recentActivities.loading"></CommonLoading>
        </transition>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {
        PageTopTab,
        CommonLoading,
        CommonLoadingWrapper,
        AnimatedHeightWrapper,
        SimpleBubble,
    } from '@/components'
      import {
        WithSearchInputMixin,
    } from '@/mixins'
    import {
        ActivityListItem,
        RepositoryListItem,
    } from './components'
    import {mapActions, mapState} from "vuex";
    //import {ACTION_HOME_REQUEST_DASHBOARD_DATA} from "@/store/modules/home/actionTypes";
    import * as graphql from './graphql.js'
    import * as api from '@/network/api'
    import {authRequiredGitHubGraphqlApiQuery,authRequiredGet} from '@/network'
    export default {
        mixins: [WithSearchInputMixin],
        data() {
            return {
                tabs: [
                    {
                        label: 'Overview',
                        to: '/'
                    },
                    {
                        label: 'Explore repositories',
                        to: '/explore'
                    }
                ],
                loading: false,
                starredRepositories: [],
                repositoriesContributedTo: [],
                recentActivities: {
                    data: [],
                    loading: false
                }
            }
        },
        computed: {
            ...mapState({
                login: state => state.oauth.viewerInfo.login
            }),
        },
        created() {
           // this.action_home_requestDashboardData()
           this.network_getRecentActivities()
           this.network_getRepositoriesStarredAndContributedByViewer()
        },
        methods: {
          /*   ...mapActions({
                action_home_requestDashboardData: ACTION_HOME_REQUEST_DASHBOARD_DATA
            }), */
            async network_getRecentActivities() {
                 try{
                    this.recentActivities.loading = true
                    const url_userEvent = api.API_USER_EVENTS(this.login,{
                        per_page:10
                    })
                    const url_notfications = api.API_USER_NOTIFICATIONS({
                        per_page: 10,
                        all: true
                    })
                    let resArr = await Promise.all([authRequiredGet(url_userEvent),authRequiredGet(url_notfications)])


                    let recentActivityEventsClub = [
                        "IssueCommentEvent",
                        "IssuesEvent",
                        "PullRequestEvent",
                    ]
                    let recentActivityEvents = []
                    resArr[0].data.forEach(item => {
                        if(recentActivityEventsClub.indexOf(item.type) != -1) {
                            recentActivityEvents.push(item)
                        }
                    })

                    resArr[1].data.forEach(item => {
                        if(item.reason == 'assign') recentActivityEvents.push({
                            id: item.id,
                            repo: item.repository,
                            created_at: item.updated_at,
                            type: 'Assigned',
                            payload: {
                                action: 'assigned',
                                issue: {
                                    html_url: item.subject.url.replace('api.','').replace('/repos','').replace('/pulls','/pull'),
                                    url: item.subject.url,
                                    title: item.subject.title
                                }
                            }
                        })
                    })

                    recentActivityEvents.sort((a,b) => {
                        let createdAtStamp_a = Date.parse(new Date(a.created_at))
                        let createdAtStamp_b = Date.parse(new Date(b.created_at))
                        return createdAtStamp_b - createdAtStamp_a
                    })

                    this.recentActivities.data = recentActivityEvents.filter(i => {
                        if(i.payload.issue && i.payload.issue.state == 'closed') return false
                        return true
                    })
                    this.recentActivities.loading = false
                }catch(e) {
                    console.log(e)
                    this.recentActivities.loading = false
                }
            },
            async network_getRepositoriesStarredAndContributedByViewer() {
                try{
                    this.loading = true
                    let graphql_ = graphql.GRAPHQL_DASHBOARD(this.login)
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_)
                    console.log(res)
                    this.repositoriesContributedTo = res.data.data.viewer.repositoriesContributedTo.nodes
                    this.starredRepositories = res.data.data.viewer.starredRepositories.nodes
                    this.loading = false
                }catch(e) {
                    console.log(e)
                    this.loading = false
                }
            },
            onSearchInput(e) {
                console.log(e)
            }
        },
        components: {
            PageTopTab,
            RepositoryListItem,
            CommonLoading,
            CommonLoadingWrapper,
            AnimatedHeightWrapper,
            SimpleBubble,
            ActivityListItem,
            Container: styled.div``,
            TopNav: styled.div``,
            Main: styled.div``,
            SearchWrapper: styled.div``,
            ContributedRepo: styled.div``,
            SimpleBubbleTitle: styled.h3``,
            StarredRepo: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
    .router-link{
        flex:1;
        display: table-cell;
        padding: 10px 0;
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        border-bottom: 1px solid #dfe2e5;
    }

    .router-link-active{
        color: #444d56;
        background-color: #fff;
        border-right: 1px solid #dfe2e5;
        border-bottom-color: #fff;
        border-left: 1px solid #dfe2e5;
    }


    .search-wrapper{
        padding: 15px;
    }


</style>