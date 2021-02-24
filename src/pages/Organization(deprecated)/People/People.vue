<template>
    <Container class="px-3">
        <!-- <div class="position-relative search-input-wrapper mb-3">
            <input class="form-control subnav-search-input width-full" type="text" name="query" value="" placeholder="Find a member…" aria-label="Find a member…" autocomplete="off" data-throttled-autosubmit="">
            <svg class="octicon octicon-search mt-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M15.7 13.3l-3.81-3.83A5.93 5.93 0 0013 6c0-3.31-2.69-6-6-6S1 2.69 1 6s2.69 6 6 6c1.3 0 2.48-.41 3.47-1.11l3.83 3.81c.19.2.45.3.7.3.25 0 .52-.09.7-.3a.996.996 0 000-1.41v.01zM7 10.7c-2.59 0-4.7-2.11-4.7-4.7 0-2.59 2.11-4.7 4.7-4.7 2.59 0 4.7 2.11 4.7 4.7 0 2.59-2.11 4.7-4.7 4.7z"></path></svg>
        </div> -->

        <transition-group tag="div" appear name="fade-group">
            <MemberListItem v-for="item in data" :key="item.node_id" :member="item"></MemberListItem>
        </transition-group>

        <SimplePaginationRest v-if="pageInfo.next || pageInfo.prev " :pageInfo="pageInfo" :loading="loading"></SimplePaginationRest>

        <transition name="fade" appear>
            <CommonLoading v-if="loadingOrganizationBasicInfo() || loading || extraData.loading" :position="loadingOrganizationBasicInfo() || loading ? 'center' : 'corner'"></CommonLoading>
        </transition>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoading,SimplePaginationRest} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {authRequiredGet,authRequiredGitHubGraphqlApiQuery, commonGet} from '@/network'
    import {util_queryParse} from '@/util'
    import MemberListItem from './MemberListItem'
    import * as graphql from './graphql'
    let parse = require('parse-link-header');
    export default { 
        name: 'organization_people_page',
        mixins: [RouteUpdateAwareMixin],
        inject: ['loadingOrganizationBasicInfo','organizationBasicInfo'],
        provide() {
            return {
                memberExtraDataProvided: () => this.extraData.data
            }
        },
        data() {
            return {
                data: [],
                loading: false,
                pageInfo: {},
                perPage: 10,
                extraData: {
                    data: [],
                    loading: false
                }
            }
        },
        computed: {
            publicMemberUrl() {
                return this.organizationBasicInfo().public_members_url
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                if(!this.publicMemberUrl) return
                if(this.loadingOrganizationBasicInfo()) return
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = `${this.publicMemberUrl.replace('{/member}','')}?${util_queryParse.querify({
                        per_page: this.perPage,
                        q:'a',
                        ...this.$route.query,
                    })}`
                    let res = await authRequiredGet(url,{cancelToken})

                    this.data = res.data
                    this.pageInfo = parse(res.headers.link) || {}

                    if(this.accessToken) this.network_getExtraData()
                   

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
            async network_getExtraData() {
                if(this.data.length == 0) return
                try{
                    this.extraData.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_extra_data')
                    let graphql_extraData = graphql.GRAPHQL_ORG_MEMBER(this.data)
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_extraData,{cancelToken})

                    let dataHolder 
                    try{
                        dataHolder = res.data.data
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                    let extraData = []
                    for(let key in dataHolder) {
                        extraData.push(dataHolder[key])
                    }

                    this.extraData.data = extraData

                }catch(e) {
                    console.log(e)
                }finally{
                    this.extraData.loading = false
                }
            },
           
        },
        watch: {
            publicMemberUrl(newOne,oldOne) {
                if(newOne && !oldOne) this.network_getData()
            }
        },
        components: {
            CommonLoading,
            MemberListItem,
            SimplePaginationRest,
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

</style>