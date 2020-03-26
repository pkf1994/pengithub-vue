<template>
    <Container>
        <Jumbotron title="Trending" paragraph="See what the GitHub community is most excited about today."></Jumbotron>

        <Main class="pt-6 relative p-responsive mx-auto">
            <ComplexBubble>
                <template v:slot="title">
                    <FilterPane class="Box-header">
                        <PaddingPageTopTab :tabs="tabs" class="mb-3" style="padding:0!important"></PaddingPageTopTab>
                        <AnimatedHeightWrapper>
                            <FilterItem v-if="meta == 'repositories'" class="pb-3 ml-2 end-with-triangle">
                                <span>Spoken Language:</span>
                                <span class="text-bold">{{spokenLanguage}}&nbsp;</span>
                            </FilterItem>
                        </AnimatedHeightWrapper>
                        <FilterItem class="mb-3 ml-2 end-with-triangle">
                            <span>Language:</span>
                            <span class="text-bold">{{language}}&nbsp;</span>
                        </FilterItem>
                        <FilterItem class="ml-2 end-with-triangle">
                            <span>Date range:</span>
                            <span class="text-bold">{{dateRange}}&nbsp;</span>
                        </FilterItem>
                    </FilterPane>
                </template>

                <RepoListItem v-for="item in repositories.data" :key="item.url" :repository="item"></RepoListItem>
            </ComplexBubble>
        </Main>

        <transition name="fade" appear>
            <CommonLoading v-if="repositories.loading || developers.loading"></CommonLoading>
        </transition>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Jumbotron} from '../components'
    import {RepoListItem,DeveloperListItem} from './components'
    import {ComplexBubble,CommonLoading,PaddingPageTopTab,AnimatedHeightWrapper} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import spokenLanguageCodeList from './spokenLanguageCodeList'
    import * as api from '@/network/api'
    import {commonGet} from '@/network'
    export default {
        name: 'explore_trending_page',
        mixins: [RouteUpdateAwareMixin],
        props: {
       
        },
        data() {
            return {
                repositories: {
                    data: [],
                    loading: false
                },
                developers: {
                    data: [],
                    loading: false
                },
            }   
        },
        computed: {
            tabs() {
                return [
                    {
                        label:'Repositories',
                        to: '/explore/trending',
                        activeFlag: this.meta == 'repositories',
                    },
                    {
                        label:'Developers',
                        to: '/explore/trending/developers',
                        activeFlag: this.meta == 'developers',
                    },
                ]
            },
            meta() {
                return this.$route.params.meta || 'repositories'
            },
            spokenLanguage() {
                let spokenLanguageHolder = spokenLanguageCodeList.filter( i => {
                    return i["urlParam"] == this.$route.query.spoken_language_code
                })[0]
                if(!spokenLanguageHolder) return 'Any'
                return  spokenLanguageHolder["name"]
            },
            language() {
                return  this.$route.params.language || 'Any'
            },
            since() {
                return this.$route.query.since || 'daily'
            },
            dateRange() {
                switch(this.since) {
                    case "weekly":
                        return 'this week'
                    case "monthly":
                        return 'this month'
                    default:
                        return 'today'
                }
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this[this.meta].loading = true

                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    
                    let url = api.API_TRENDING(this.meta,{
                        spoken_language_code: this.$route.query.spoken_language_code,
                        language: this.$route.params.language,
                        since: this.$route.query.since
                    })

                    let res = await commonGet(url)

                    this[this.meta].data = res.data
                    this[this.meta].loading = false
                }catch(e) {
                    console.log(e)
                    this[this.meta].loading = false
                }
            }
        },
        components: {
            Jumbotron,
            ComplexBubble,
            PaddingPageTopTab,
            AnimatedHeightWrapper,
            CommonLoading,
            RepoListItem,
            DeveloperListItem,
            Container: styled.div``,
            Main: styled.div``,
            FilterPane: styled.div``,
            FilterItem: styled.div``
        }
    }
</script>

<style scoped>

</style>