<template>
    <Container class="position-relative">
        
        <transition name="fade" appear>
             <Main v-if="id">
                <Pinned class="mt-4" v-if="pinnedRepositories.length > 0">
                    <Title class="f4 mb-2 text-normal">
                        Pinned
                    </Title>
                    
                    <RepoListItem class="mb-3" v-for="item in pinnedRepositories" :key="item.id" :repository="item">

                    </RepoListItem>
                </Pinned>

                <Contribution :class="{'mt-4':pinnedRepositories.length == 0,'mt-6':pinnedRepositories.length > 0}">
                    <ContributionStatistic></ContributionStatistic>
                </Contribution>
            </Main>
        </transition>

        <LoadingWrapper  class="loading-wrapper">
            <div v-if="loading && !loadingUserBasicInfoProvided()" class="inner d-flex flex-items-center flex-justify-center">
                <LoadingIcon></LoadingIcon>
            </div>
        </LoadingWrapper>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {LoadingIcon} from '@/components'
    import {RepoListItem,ContributionStatistic} from './components'
    import * as graphql from './graphql'
    import {authRequiredGitHubGraphqlApiQuery} from '@/network' 
    export default {
        name: 'user_overview_page',
        mixins: [RouteUpdateAwareMixin],
        inject: ['loadingUserBasicInfoProvided'],
        data() {
            return {
                id: undefined,
                pinnedRepositories: [],
                loading: false
            }
        },
        computed: {
            login() {
                return this.$route.params.login
            },
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let graphql_overview = graphql.GRAPHQL_USER_OVERVIEW(this.login)
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_overview,{cancelToken})
                    try{
                        this.id = res.data.data.user.id
                        this.pinnedRepositories = res.data.data.user.pinnedItems.nodes
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
           
        },
        components: {
            LoadingIcon,
            RepoListItem,
            ContributionStatistic,
            Container: styled.div``,
            Main: styled.div``,
            Pinned: styled.div``,
            Contribution: styled.div``,
            LoadingWrapper: styled.div``,
            Title: styled.h2``,
            ContributionStatisticWrapper: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
.loading-wrapper{
    pointer-events: none;
    position:absolute;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    .inner{
        position:sticky;
        height: 150px;
        top: calc(50% - 75px);
    }
}

</style>