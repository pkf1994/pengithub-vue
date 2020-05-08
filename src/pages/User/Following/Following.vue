<template>
    <Container class="position-relative">

        <transition-group name="fade-group" appear>
            <FollowingListItem v-for="item in data" :key="item.id" :following="item"></FollowingListItem>
        </transition-group>

        <Pagination class="paginate-container" v-if="data.length > 0 && (pageInfo.prev || pageInfo.next)">
            <div class="BtnGroup">
                <button class="btn btn-outline BtnGroup-item" :disabled="!pageInfo.prev || loading" @click="() => changePage(true)">Previous</button>
                <button class="btn btn-outline BtnGroup-item" :disabled="!pageInfo.next || loading"  @click="() => changePage(false)">Next</button>
            </div> 
        </Pagination>

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
    import {LoadingIcon,AnimatedHeightWrapper} from '@/components'
    import FollowingListItem from './FollowingListItem'
    import * as graphql from './graphql'
    import * as api from '@/network/api'
    import {authRequiredGitHubGraphqlApiQuery,authRequiredGet,commonGet} from '@/network' 
    import {util_queryParse} from '@/util'
    var parse = require('parse-link-header');
    export default {
        name: 'user_followers_page',
        mixins: [RouteUpdateAwareMixin],
        inject: ['loadingUserBasicInfoProvided'],
        provide() {
            return {
                extraDataProvided: () => this.extraData
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
                extraData: []
            }
        },
        computed: {
            login() {
                return this.$route.params.login
            },
            page() {
                return this.$route.query.page
            },
        },
        async created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_USER_FOLLOWING(this.login, {
                       ...this.$route.query,
                       per_page: this.perPage
                    })

                    let res =  await  authRequiredGet(url,{cancelToken,})

                    this.data = res.data
                    this.pageInfo = parse(res.headers.link) || {}
                    this.firstLoadedFlag = true

                    let graphql_extraData = graphql.GRAPHQL_USER_FOLLOWING_EXTRA(this.data)
                    let res_extra = await authRequiredGitHubGraphqlApiQuery(graphql_extraData,{cancelToken})

                    let extraData = []
                    for(let key in res_extra.data.data) {
                        extraData.push(res_extra.data.data[key])
                    }
                    this.extraData = extraData
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
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
            FollowingListItem,
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