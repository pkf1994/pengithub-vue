<template>
    <Container class="p-3">
     <!--    <Viewer class="rounded-1 box-shadow-medium bg-white border">
            <ViewerBasicInfo class="d-flex flex-items-center">
                <ViewerAvatarWrapper class="m-3 col-3">
                    <img class="avatar width-full" :src="viewerInfo.avatarUrl" :alt="`@${viewerInfo.login}`">
                </ViewerAvatarWrapper>

                <ViewerLogin class="text-left py-3  col-9">
                    <h2 class="lh-condensed">
                        <span class="d-block f3 text-gray text-normal">{{viewerInfo.login}}</span>
                    </h2>
                </ViewerLogin>
            </ViewerBasicInfo>

            <StarredTopics class="border-top px-3">
                <h3 class="h4-mktg my-3 title">
                    <router-link to="/stars?filter=topics">
                        starred topic
                    </router-link>
                </h3>
            </StarredTopics>

            <StarredRepositories class="border-top px-3">
                <h3 class="h4-mktg my-3 title">
                    <router-link to="/stars?filter=repositories">
                        starred repositories
                    </router-link>
                </h3>
            </StarredRepositories>
        </Viewer> -->

        <transition appear name="fade">
            <AnimatedHeightWrapper>
                <Jumbotron class="text-center py-6" v-if="!trendingRepoToday.loading && !trendingDevelopers.loading">
                    <div class="col-2 mx-auto">
                        <img src="https://github.githubassets.com/images/icons/emoji/tada.png" alt="tada" class="width-full">
                    </div>
                    <h2 class="lh-condensed my-2 headline" style="font-size:22px">
                        That's everything we found for you, for now.
                    </h2>
                    <p class="f4">
                        Come back soon to see what we find next.
                    </p>
                </Jumbotron>
            </AnimatedHeightWrapper>
            
        </transition>

        <transition appear name="fade">
            <ComplexBubble ref="xxx" class="mt-3" v-if="trendingRepoToday.data.length > 0 && !exception.trendingRepoToday">
                <template v:slot="title">
                    <div class="Box-header d-flex">
                        <svg height="16" class="octicon octicon-telescope mr-2" viewBox="0 0 14 16" version="1.1" width="14" aria-hidden="true"><path fill-rule="evenodd" d="M8 9l3 6h-1l-2-4v5H7v-6l-2 5H4l2-5 2-1zM7 0H6v1h1V0zM5 3H4v1h1V3zM2 1H1v1h1V1zM.63 9a.52.52 0 00-.16.67l.55.92c.13.23.41.31.64.2l1.39-.66-1.16-2-1.27.86.01.01zm7.89-5.39l-5.8 3.95L3.95 9.7l6.33-3.03-1.77-3.06h.01zm4.22 1.28l-1.47-2.52a.51.51 0 00-.72-.17l-1.2.83 1.84 3.2 1.33-.64c.27-.13.36-.44.22-.7z"></path></svg>
                        <h2 class="Box-title">
                            <router-link class="text-gray-dark" to="/trending">
                                    Trending repositories <span class="text-normal text-gray">today</span>
                            </router-link>
                        </h2>
                    </div>
                </template>

                <RepoListItem v-for="item in trendingRepoToday.data.slice(0,4)" :key="item.url" :repository="item"></RepoListItem>

                <BubbleFooter class="Box-footer">
                    <router-link to="/explore/trending" class="f6">
                        See more trending repositories
                        <svg height="14" class="octicon octicon-chevron-right ml-1" viewBox="0 0 8 16" version="1.1" width="7" aria-hidden="true"><path fill-rule="evenodd" d="M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3l5 5z"></path></svg>
                    </router-link>
                </BubbleFooter>
            </ComplexBubble>
        </transition>

        <transition appear name="fade">
            <ComplexBubble class="mt-3" v-if="trendingDevelopers.data.length > 0 && !exception.trendingDevelopers">
                <template v:slot="title">
                    <div class="Box-header d-flex">
                        <svg height="16" class="octicon octicon-telescope mr-2" viewBox="0 0 14 16" version="1.1" width="14" aria-hidden="true"><path fill-rule="evenodd" d="M8 9l3 6h-1l-2-4v5H7v-6l-2 5H4l2-5 2-1zM7 0H6v1h1V0zM5 3H4v1h1V3zM2 1H1v1h1V1zM.63 9a.52.52 0 00-.16.67l.55.92c.13.23.41.31.64.2l1.39-.66-1.16-2-1.27.86.01.01zm7.89-5.39l-5.8 3.95L3.95 9.7l6.33-3.03-1.77-3.06h.01zm4.22 1.28l-1.47-2.52a.51.51 0 00-.72-.17l-1.2.83 1.84 3.2 1.33-.64c.27-.13.36-.44.22-.7z"></path></svg>
                        <h2 class="Box-title">
                            <router-link class="text-gray-dark" to="/trending">
                                    Trending developers
                            </router-link>
                        </h2>
                    </div>
                </template>

                <DeveloperListItem v-for="item in trendingDevelopers.data.slice(0,4)" :key="item.url" :developer="item"></DeveloperListItem>

                <BubbleFooter class="Box-footer">
                    <router-link to="/explore/trending/developers" class="f6">
                        See more trending developers
                        <svg height="14" class="octicon octicon-chevron-right ml-1" viewBox="0 0 8 16" version="1.1" width="7" aria-hidden="true"><path fill-rule="evenodd" d="M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3l5 5z"></path></svg>
                    </router-link>
                </BubbleFooter>
            </ComplexBubble>
        </transition>

        <transition appear name="fade">
            <CommonLoading v-if="trendingRepoToday.loading || trendingDevelopers.loading"></CommonLoading>
        </transition>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ComplexBubble,CommonLoading,AnimatedHeightWrapper,ImgWrapper} from '@/components'
    import {RepoListItem,DeveloperListItem} from './components'
    import {commonGet,authRequiredGet} from '@/network'
    import {mapState} from 'vuex'
    export default {
        name: 'explore_page',
        data() {
            return {
                trendingRepoToday: {
                    data: [],
                    loading: false
                },
                trendingDevelopers: {
                    data: [],
                    loading: false
                },
                exception: {
                    trendingRepoToday: false,
                    trendingDevelopers: false,
                }
            }
        },
        
        async created() {
            this.network_getTrendingRepoToday()
            this.network_getTrendingDevelopers()
        },
        mounted() {
          
        },
        methods: {
            async network_getTrendingRepoToday() {
                try{
                    this.trendingRepoToday.loading = true
                    let url = "https://github-trending-api.now.sh/repositories"

                    let res = await commonGet(url)

                    this.trendingRepoToday.data = res.data

                }catch(e) {
                    this.handleError(e)
                    this.exception.trendingRepoToday = true
                }finally{
                    this.trendingRepoToday.loading = false
                }
            },
            async network_getTrendingDevelopers() {
                 try{
                    this.trendingDevelopers.loading = true
                    let url = "https://github-trending-api.now.sh/developers"

                    let res = await commonGet(url)

                    this.trendingDevelopers.data = res.data

                }catch(e) {
                    this.handleError(e)
                    this.exception.trendingDevelopers = true
                }finally{
                    this.trendingDevelopers.loading = false
                }
            }
        },
        components: {
            ComplexBubble,
            RepoListItem,
            DeveloperListItem,
            CommonLoading,
            AnimatedHeightWrapper,
            ImgWrapper,
            Container: styled.div``,
          /*   Viewer: styled.div``,
            ViewerBasicInfo: styled.div``,
            ViewerAvatarWrapper: styled.div``,
            ViewerLogin: styled.div``, */
            Jumbotron: styled.div``,
            StarredTopics: styled.div``,
            StarredRepositories: styled.div``,
            BubbleFooter: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/layout/index.scss';
@import 'node_modules/@primer/css/box/index.scss';

.title{
    font-size: 16px;
}
.headline{
    font-family: Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
    font-weight: 500;
}
</style>