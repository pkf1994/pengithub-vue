<template>
    <Container>
        <InnerTopTab :tabs="tabs" />

        <Main class="bg-white pb-3 ">
            <Search :onInput="onSearchInput" placeholder="Search GitHub"/>
            <ContributedRepo class="bubble">
                <BubbleTitle class="bubble-title bg-gray">Repositories you contribute to</BubbleTitle>
                <RepoListItem v-for="item in repositoriesContributedTo" :key="item.nameWithOwner" :repository="item"/>
            </ContributedRepo>

            <StarredRepo class="bubble">
                <BubbleTitle class="bubble-title bg-gray">Starred repositories</BubbleTitle>
                <RepoListItem v-for="item in starredRepositories" :key="item.nameWithOwner" :repository="item"/>
            </StarredRepo>
        </Main>

    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {InnerTopTab,Search,RepoListItem} from '../../../../../components'
    import {mapState} from "vuex";
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
                loadingUserInfo: state => state.user.loading,
                starredRepositories: state => state.user.starredRepositories,
                repositoriesContributedTo: state => state.user.repositoriesContributedTo
            }),
        },
        methods: {
            onSearchInput(e) {
                console.log(e)
            }
        },
        components: {
            InnerTopTab,
            Search,
            RepoListItem,
            Container: styled.div``,
            TopNav: styled.div``,
            Main: styled.div``,
            ContributedRepo: styled.div``,
            BubbleTitle: styled.h3``,
            StarredRepo: styled.div``
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