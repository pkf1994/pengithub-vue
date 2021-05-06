<template>
    <Container class="position-relative">
        
        <transition name="fade" appear>
             <Main>
                <Pinned class="mt-4">
                    <Title class="f4 mb-2 text-normal">
                        Pinned
                    </Title>
                    
                    <transition-group name="fade-group" appear>

                        <RepoListSkeleton v-if="loading && pinnedRepositories.data.length == 0" key="RepoListSkeleton"></RepoListSkeleton>

                        <RepoListItem class="mb-3" v-for="item in pinnedRepositories.data" :key="item.id" :repository="item">
                        </RepoListItem>
                    </transition-group>
                     
                    
                    

                    <AnimatedHeightWrapper>
                        <div v-if="pinnedRepositories.isEmpty" class="blankslate">
                            <h5 class="pb-5">
                                {{login}} doesn’t have any public repositories yet.
                            </h5>
                        </div>
                    </AnimatedHeightWrapper>
                    

                    <LoginNecessaryNotice v-if="!accessToken" class="px-3 py-4 text-gray-light text-center">
                        <a href="javascript:void(0)" class="btn-link" @click="() => signIn()">Sign up with Oauth&nbsp;</a> 
                        to show pinned repositories.
                    </LoginNecessaryNotice>
                </Pinned>

                <Contribution :class="{'mt-4':pinnedRepositories.length == 0,'mt-6':pinnedRepositories.length > 0}">
                    <keep-alive>
                        <router-view></router-view>
                    </keep-alive>
                </Contribution>
            </Main>
        </transition>

        <LoadingWrapper  class="loading-wrapper">
            <div v-if="loading && !userBasicInfoProvided().loading" class="inner d-flex flex-items-center flex-justify-center">
                <LoadingIcon :size="45"></LoadingIcon>
            </div>
        </LoadingWrapper>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {LoadingIcon,AnimatedHeightWrapper} from '@/components'
    import {RepoListItem,ContributionStatistic,RepoListSkeleton} from './components'
    import * as graphql from './graphql'
    import {authRequiredGitHubGraphqlApiQuery} from '@/network' 
    export default {
        name: 'user_overview_page',
        mixins: [RouteUpdateAwareMixin],
        inject: ['userBasicInfoProvided'],
        data() {
            return {
                firstLoadedFlag: false,
                pinnedRepositories: {
                    data: [],
                    loading: false,
                    isEmpty: false
                },
                loading: false,
                isDynamicDocumentTitle: true
            }
        },
        computed: {
            login() {
                return this.$route.params.login
            },
            documentTitle() {
                if(this.userBasicInfoProvided().data.name) return `${this.userBasicInfoProvided().data.login}(${this.userBasicInfoProvided().data.name})`
                return this.userBasicInfoProvided().data.login
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
                        this.pinnedRepositories.data = res.data.data.user.itemShowcase.items.nodes
                        this.dosenotHaveAnyPublicRepo = false
                        this.pinnedRepositories.isEmpty = false
                        if(this.pinnedRepositories.data.length == 0) this.pinnedRepositories.isEmpty = true
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
            AnimatedHeightWrapper,
            RepoListSkeleton,
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
@import 'node_modules/@primer/css/blankslate/index.scss';
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