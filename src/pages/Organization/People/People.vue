<template>
    <CommonLoadingWrapper :loading="loadingOrganizationBasicInfo() || loading" :position="loadingOrganizationBasicInfo() || loading ? 'center' : 'corner'" class="p-3">

        <IconSearchInput class="mb-3" v-model="searchQuery" :search="routeWithSearchQuery"></IconSearchInput>

        <transition-group tag="div" appear name="fade-group">
            <MemberListSkeleton key="0" v-if="data.length == 0 && loading"></MemberListSkeleton>
            <MemberListItem class="member-item" v-for="item in data" :key="item.login" :member="item"></MemberListItem>
        </transition-group>

        <SimplePaginationRest v-if="(pageInfo.next || pageInfo.prev) && !query" :pageInfo="pageInfo" :loading="loading"></SimplePaginationRest>
        
        <SimplePagination v-else-if="simplePageInfo.withNext || simplePageInfo.withPrev" :withNext="simplePageInfo.withNext" :withPrev="simplePageInfo.withPrev"></SimplePagination>
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoadingWrapper,SimplePaginationRest,SimplePagination,IconSearchInput} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {authRequiredGet,commonGet} from '@/network'
    import {util_queryParse} from '@/util'
    import {MemberListItem,MemberListSkeleton} from './components'
    import * as graphql from './graphql'
    import * as api from '@/network/api'
    let parse = require('parse-link-header');
    export default { 
        name: 'organization_people_page',
        mixins: [RouteUpdateAwareMixin],
        inject: ['loadingOrganizationBasicInfo','organizationBasicInfo'],
        data() {
            return {
                data: [],
                loading: false,
                pageInfo: {},
                perPage: 10,
                searchQuery: '',
                firstLoadedFlag: false,
                simplePageInfo: {
                    withNext: false,
                    withPrev: false
                }
            }
        },
        computed: {
            query() {
                this.searchQuery = this.$route.query.query
                return this.$route.query.query
            },
            organization() {
                return this.$route.params.organization
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            network_getData() {
                if(this.query) {
                    this.network_getDataByProxy()
                }else{
                    this.netwokr_getDataFromApi()
                }
            },
            async netwokr_getDataFromApi() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_ORG_PUBLIC_MEMBER({
                        organization: this.organization,
                        params: {
                            per_page: this.perPage,
                            ...this.$route.query
                        }
                    })
                    let res = await authRequiredGet(url,{cancelToken})

                    this.data = res.data
                    this.firstLoadedFlag = true
                    this.pageInfo = parse(res.headers.link) || {}

                }catch(e) {
                    this.handleError(e,{
                         httpErrorHandler: {
                            404: () => this.$router.replace('/404')
                        }
                    })
                }finally{
                    this.loading = false
                }
            },
            async network_getDataByProxy() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_PROXY_ORGANIZATION_PEOPLE({
                        login: this.organization,
                        params: this.$route.query
                    })

                    let res = await commonGet(url,{cancelToken})
                    this.parseHTML(res.data)
                    this.firstLoadedFlag = true
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            routeWithSearchQuery() {
                this.$router.push(`${this.$route.path}?${util_queryParse.querify({
                    ...this.$route.query,
                    query: this.searchQuery
                })}`)
            },
            parseHTML(HTML) {
                let pattern = /<li[^>]*>(?:.|\r|\n)*?<img.*src="(.*?)".*?\/>(?:.|\r|\n)*?<a.*data-hovercard-type="user".*?>(?:(?:\r|\n)\s*)?(.*)(?:(?:\r|\n)\s*)?<\/a>(?:.|\r|\n)*?<span.*?itemprop="name"[^>]*>(.*)<\/span>/g
                let execResult
                let people = []
                while((execResult = pattern.exec(HTML)) != null) {
                    people.push({
                        avatar_url: execResult[1],
                        name: execResult[2],
                        login: execResult[3],
                    })
                }
                this.data = people

                let paginationNextPattern = /<a[^>]*>Next<\/a>/g
                let paginationPreviousPattern = /<a[^>]*>Previous<\/a>/g
                this.simplePageInfo.withNext = HTML.match(paginationNextPattern) != null
                this.simplePageInfo.withPrev = HTML.match(paginationPreviousPattern) != null

            }
        },
        components: {
            CommonLoadingWrapper,
            MemberListItem,
            IconSearchInput,
            SimplePaginationRest,
            SimplePagination,
            MemberListSkeleton,
            Container: styled.div``
        }
        
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/navigation/index.scss';
.subnav-search-input{
    padding-left: 30px;
    height: 40px!important;
}

.search-input-wrapper{
    svg{
        top: 10px;
        font-size: 14px;
        color: #bbb;
        text-align: center;
        position: absolute;
        left: 10px;
        z-index: 5;
        width: 16px;
        height: 16px;
    }
}
.member-item:first-child{
    border-top: 1px #e1e4e8 solid;
}
</style>