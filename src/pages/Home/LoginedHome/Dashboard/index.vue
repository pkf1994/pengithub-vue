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

            <SimpleBubble v-if="events && events.length > 0"
                    :loading="loading"
                    title="Recent activity">
                <ActivityListItem v-for="item in events" :event="item" :key="item.id" >

                </ActivityListItem>
            </SimpleBubble>
            

            <SimpleBubble title="Repositories you contribute to"
                    :loading="loading"
                    :disableFlag="!repositoriesContributedTo || repositoriesContributedTo.length === 0"
                    disableNotice="You haven't contributed any repository yet.">
                <RepositoryListItem v-for="item in repositoriesContributedTo" :key="item.nameWithOwner" :repository="item"/>
            </SimpleBubble>

            <SimpleBubble title="Starred repositories"
                        :loading="loading"
                    :disableFlag="!starredRepositories || starredRepositories.length === 0"
                    disableNotice="You haven't starred any repository yet">
                <RepositoryListItem v-for="item in starredRepositories" :key="item.nameWithOwner" :repository="item"/>
            </SimpleBubble>
        </Main>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {
        PageTopTab,
        SearchInput,
        CommonLoading,
        CommonLoadingWrapper,
        AnimatedHeightWrapper,
        SimpleBubble,
    } from '../../../../components'
      import {
        WithSearchInputMixin,
    } from '../../../../mixins'
    import {
        ActivityListItem,
        RepositoryListItem
    } from './components'
    import {mapActions, mapState} from "vuex";
    import {ACTION_HOME_REQUEST_DASHBOARD_DATA} from "../../../../store/modules/home/actionTypes";
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
            PageTopTab,
            SearchInput,
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


    .search-wrapper{
        padding: 15px;
    }


</style>