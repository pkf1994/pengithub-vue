<template>
    <Container class="position-relative">
        
        <transition name="fade" appear>
             <Main v-if="firstLoadedFlag || !accessToken">
                <Pinned class="mt-4" v-if="pinnedRepositories.length > 0 || !accessToken">
                    <Title class="f4 mb-2 text-normal">
                        Pinned
                    </Title>
                    
                    <RepoListItem class="mb-3" v-for="item in pinnedRepositories" :key="item.id" :repository="item">

                    </RepoListItem>

                    <LoginNecessaryNotice v-if="!accessToken" class="px-3 py-4 text-gray-light text-center">
                        <a href="javascript:void(0)" class="btn-link" @click="signIn">Sign up with Oauth&nbsp;</a> 
                        to show pinned repositories.
                    </LoginNecessaryNotice>
                </Pinned>

                <Contribution :class="{'mt-4':pinnedRepositories.length == 0,'mt-6':pinnedRepositories.length > 0}">
                    <ContributionStatistic></ContributionStatistic>
                </Contribution>
            </Main>
        </transition>

        <LoadingWrapper  class="loading-wrapper">
            <div v-if="loading && !userBasicInfoProvided().loading" class="inner d-flex flex-items-center flex-justify-center">
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
        inject: ['userBasicInfoProvided'],
        data() {
            return {
                firstLoadedFlag: false,
                pinnedRepositories: [],
                loading: false
            }
        },
        computed: {
            login() {
                return this.$route.params.login
            },
            documentTitle() {
                return `${this.userBasicInfoProvided().data.login}(${this.userBasicInfoProvided().data.name})`
            }
        },
        created() {
            this.network_getData()
            
        },
        methods: {
            async network_getData() {
                if(!this.accessToken) return 
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_pinned_repositories')
                    let graphql_pinnedRepositories = graphql.GRAPHQL_USER_PINNED_REPOSITORIES(this.login)
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_pinnedRepositories,{cancelToken})
                    try{
                        this.pinnedRepositories = res.data.data.user.pinnedItems.nodes
                        this.firstLoadedFlag = true
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
            LoginNecessaryNotice: styled.div``
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