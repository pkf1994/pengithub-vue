<template>
    <CommonLoadingWrapper :loading="loading || extraData.loading" :position="loading ? 'center' : 'corner'" class="px-3">
        <transition name="fade" appear>
            <PaddingPageTopTab v-if="firstLoadedFlag" class="subnav" style="margin-right:-16px;margin-left:-16px;" :tabs="tabs"></PaddingPageTopTab>
        </transition>  
        <transition-group name="fade-group" appear>
            <ReleaseListItem v-for="(item,index) in data" :key="item.node_id" :release="item" :isLatestRelease="(!pageInfo.prev) && index == 0" class="border-top"></ReleaseListItem>
        </transition-group>
        <SimplePaginationRest v-if="firstLoadedFlag && (pageInfo.prev || pageInfo.next)" :loading="loading" :pageInfo="pageInfo"></SimplePaginationRest>
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {PaddingPageTopTab,SimplePaginationRest} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import * as api from '@/network/api'
    import {authRequiredGet,authRequiredGitHubGraphqlApiQuery} from '@/network'
    import ReleaseListItem from './ReleaseListItem'
    import * as graphql from './graphql'
    let parse = require('parse-link-header')
    export default {
        name: 'repository_releases_page',
        inject: ['repo','owner'],
        mixins: [RouteUpdateAwareMixin],
        provide() {
            return {
                extraDataProvided: () => this.extraData.data
            }
        },
        data() {
            return {
                data: [],
                perPage: 10,
                loading: false,
                pageInfo: {},
                firstLoadedFlag:false,
                extraData: {
                    data: [],
                    loading: false
                }
            }
        },
        computed: {
            tabs() {
                return [
                    {
                        label: 'Releases',
                        to: `/${this.owner()}/${this.repo()}/releases`,
                        activeFlag: true
                    },
                    {
                        label: 'Tags',
                        to: `/${this.owner()}/${this.repo()}/tags`
                    },
                ]
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_REPOSITORY_RELEASES(this.owner(),this.repo(),{
                        per_page: this.perPage,
                        ...this.$route.query
                    })
                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken,
                            headers: {
                                "Accept":"application/vnd.github.manifold-preview+json"
                            }
                        }
                    )
                    if(window) window.scrollTo(0,0)
                    this.data = res.data
                    this.pageInfo = parse(res.headers.link) || {}
                    this.firstLoadedFlag = true
                    if(this.accessToken) this.network_getExtraData()
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
             async network_getExtraData() {
                try{
                    this.extraData.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_extra_data')
                    let graphql_extraData = graphql.GRAPHQL_RELEASES(this.data)
                    console.log(graphql_extraData)
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_extraData,{cancelToken})
                    let extraData = []
                    for(let key in res.data.data) {
                        extraData.push(res.data.data[key])
                    }
                    this.extraData.data = extraData
                }catch(e) {
                    console.log(e)
                }finally{
                    this.extraData.loading = false
                }
            },
           /*  scrollToTop() {
                if(window) window.scrollTo(0,0)
            } */
        },
       
        components: {
            ReleaseListItem,
            PaddingPageTopTab,
            SimplePaginationRest,
            Container: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/navigation/index.scss';
</style>