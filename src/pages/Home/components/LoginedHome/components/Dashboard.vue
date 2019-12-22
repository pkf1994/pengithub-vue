<template>
    <Container>
        <InnerTopTab :tabs="tabs" />

        <Main class="bg-white pb-3">
            <Search :onInput="onSearchInput" placeholder="Search GitHub"/>
            <CommonLoadingWrapper :loading="loading">

                <Bubble v-if="events && events.length > 0"
                        title="Recent activity">
                    <ActivityListItem v-for="item in events" :event="item" :key="item.id" >

                    </ActivityListItem>
                </Bubble>

                <Bubble title="Repositories you contribute to"
                        :disableFlag="!repositoriesContributedTo || repositoriesContributedTo.length === 0"
                        disableNotice="You haven't contributed any repository yet.">
                    <RepoListItem v-for="item in repositoriesContributedTo" :key="item.nameWithOwner" :repository="item"/>
                </Bubble>

                <Bubble title="Starred repositories"
                        :disableFlag="!starredRepositories || starredRepositories.length === 0"
                        disableNotice="You haven't starred any repository yet">
                    <RepoListItem v-for="item in starredRepositories" :key="item.nameWithOwner" :repository="item"/>
                </Bubble>
            </CommonLoadingWrapper>
        </Main>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {
        InnerTopTab,
        Search,
        RepoListItem,
        CommonLoading,
        CommonLoadingWrapper,
        Bubble,
        ActivityListItem
    } from '../../../../../components'
    import {mapActions, mapState} from "vuex";
    import {ACTION_HOME_REQUEST_DASHBOARD_DATA} from "../../../../../store/modules/home/actionTypes";
    export default {
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
                search: ''
            }
        },
        computed: {
            ...mapState({
                loading: state => state.home.dashboard.loading,
                starredRepositories: state => state.home.dashboard.starredRepositories,
                repositoriesContributedTo: state => state.home.dashboard.repositoriesContributedTo,
                events: state => state.home.dashboard.events
            }),
        },
        created() {
            this.action_home_requestDashboardData()
        },
        methods: {
            ...mapActions({
                action_home_requestDashboardData: ACTION_HOME_REQUEST_DASHBOARD_DATA
            }),
            onSearchInput(e) {
                console.log(e)
            }
        },
        components: {
            InnerTopTab,
            Search,
            RepoListItem,
            CommonLoading,
            CommonLoadingWrapper,
            Bubble,
            ActivityListItem,
            Container: styled.div``,
            TopNav: styled.div``,
            Main: styled.div``,
            ContributedRepo: styled.div``,
            BubbleTitle: styled.h3``,
            StarredRepo: styled.div``,
        }
    }
</script>

<style scoped>

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


.search{
    padding: 15px;
}

</style>