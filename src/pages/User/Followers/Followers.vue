<template>
    <CommonLoadingWrapper class="position-relative" :loading="extraData.loading" position="corner">

        <transition-group name="fade-group" appear>
            <FollowerListSkeleton v-if="loading && data.length == 0" key="FollowerListSkeleton"></FollowerListSkeleton>
            <FollowerListItem v-for="item in data" :key="item.id" :follower="item"></FollowerListItem>
        </transition-group>

        <Pagination class="paginate-container" v-if="data.length > 0 && (pageInfo.prev || pageInfo.next)">
            <div class="BtnGroup">
                <button class="btn btn-outline BtnGroup-item" :disabled="!pageInfo.prev || loading" @click="() => changePage(true)">Previous</button>
                <button class="btn btn-outline BtnGroup-item" :disabled="!pageInfo.next || loading"  @click="() => changePage(false)">Next</button>
            </div> 
        </Pagination>

        <LoadingWrapper  class="loading-wrapper">
            <div v-if="loading && !userBasicInfoProvided().loading" class="inner d-flex flex-items-center flex-justify-center">
                <LoadingIcon :size="45"></LoadingIcon>
            </div>
        </LoadingWrapper>

    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {LoadingIcon,AnimatedHeightWrapper,CommonLoadingWrapper} from '@/components'
    import {FollowerListItem,FollowerListSkeleton} from './components'
    import * as graphql from './graphql'
    import * as api from '@/network/api'
    import {authRequiredGitHubGraphqlApiQuery,authRequiredGet,commonGet} from '@/network' 
    import {util_queryParse} from '@/util'
    var parse = require('parse-link-header');
    export default {
        name: 'user_followers_page',
        mixins: [RouteUpdateAwareMixin],
        inject: ['userBasicInfoProvided'],
        provide() {
            return {
                extraDataProvided: () => this.extraData.data
            }
        },
        data() {
            return {
                data: [],
                loading: false,
                perPage: 30,
                pageInfo: {
                },
                firstLoadedFlag: false,
                extraData: {
                    data: [],
                    loading: false
                }
            }
        },
        computed: {
            login() {
                return this.$route.params.login
            },
            page() {
                return this.$route.query.page
            },
            documentTitle() {
                return `${this.userBasicInfoProvided().data.login}(${this.userBasicInfoProvided().data.name}) / Followers`
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
                    let url = api.API_USER_FOLLOWERS(this.login, {
                       ...this.$route.query,
                       per_page: this.perPage
                    })

                    let res =  await  authRequiredGet(url,{cancelToken,})

                    if(this.data.length != 0) window.scrollTo(0,0)
                    this.data = res.data
                    this.pageInfo = parse(res.headers.link) || {}
                    this.firstLoadedFlag = true
                    if(this.accessToken) this.network_getExtraData()
                }catch(e) {
                    this.handleError(e)
                }finally {
                    this.loading = false
                }
            },
            async network_getExtraData() {
                try{
                    this.extraData.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + 'get_extra_data')

                    let graphql_extraData = graphql.GRAPHQL_USER_FOLLOWER_EXTRA(this.data)
                    let res_extra = await authRequiredGitHubGraphqlApiQuery(graphql_extraData,{cancelToken})

                    let dataHolder 
                    try{    
                        dataHolder = res_extra.data.data
                    }catch(e) {
                        this.handleGraphqlError(res_extra)
                    }
                    let extraData = []
                    for(let key in dataHolder) {
                        extraData.push(dataHolder[key])
                    }
                    this.extraData.data = extraData
                }catch(e) {
                    console.log(e)
                }finally {
                    this.extraData.loading = false
                }
            },
            changePage(goPrevPageFlag) {
                let queryStr = util_queryParse.querify({
                    ...this.$route.query,
                    page: goPrevPageFlag ? this.page - 1 : (this.page ? parseInt(this.page) + 1 : 2)
                })
                //console.log(`/${this.login}/stars?${queryStr}`)
                this.$router.push(`${this.$route.path}?${queryStr}`)
            },
           
        },
        components: {
            FollowerListItem,
            FollowerListSkeleton,
            CommonLoadingWrapper,
            LoadingIcon,
            Container: styled.div``,
            LoadingWrapper: styled.div``,
            Pagination: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
.loading-wrapper{
    pointer-events: none;
    position:absolute;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    .inner{
        position:sticky;
        height:150px;
        top: calc(50% - 75px);
    }
}

.paginate-container {
    margin-top: 20px;
    margin-bottom: 15px;
    text-align: center;
}
</style>