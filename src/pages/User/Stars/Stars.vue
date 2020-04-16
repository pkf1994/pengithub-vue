<template>
    <Container class="position-relative">

        <transition name="fade" appear>
            <FilterRow v-if="firstLoadedFlag" class="border-bottom py-3">
                <button class="btn mr-1" @click="() => openModal('sortModal')">
                    <i>Sort:</i>
                    <span>{{currentSortLabel || 'Recently starred'}}</span>
                    <span class="dropdown-caret"></span>
                </button>  
            </FilterRow>
        </transition>

        <transition-group name="fade-group" appear>
            <RepoListItem v-for="item in data" :key="item.id" :repository="item"></RepoListItem>
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

        <Modal title="Sort by" ref="sortModal">
            <router-link v-for="item in sortModalRouterLink" :key="item.label" :to='item.routerLink'>
                <SelectMenuItem :selected="item.selected" @click.native="closeModal">
                    <span>{{item.label}}</span>    
                </SelectMenuItem>
            </router-link> 
        </Modal>

    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {LoadingIcon,Modal,SelectMenuItem,AnimatedHeightWrapper} from '@/components'
    import RepoListItem from './RepoListItem'
    import * as graphql from './graphql'
    import * as api from '@/network/api'
    import {authRequiredGitHubGraphqlApiQuery,authRequiredGet,commonGet} from '@/network' 
    import {util_queryParse} from '@/util'
    var parse = require('parse-link-header');
    export default {
        name: 'user_stars_page',
        mixins: [RouteUpdateAwareMixin],
        inject: ['loadingUserBasicInfoProvided'],
        provide() {
            return {
                extraDataProvided: () => this.extraData
            }
        },
        data() {
            return {
                searchQuery: '',
                data: [],
                loading: false,
                perPage: 30,
                totalCount: 0,
                pageInfo: {
                },
                extraData: [],
                firstLoadedFlag: false,
            }
        },
        computed: {
            login() {
                return this.$route.params.login
            },
            page() {
                return this.$route.query.page
            },
            sort() {
                return this.$route.query.sort
            },
            currentSortLabel() {
                let labelHolder = this.sortModalRouterLink.filter(i => {
                    return i.selected
                })[0] || {}

                return labelHolder.label
            },
            direction() {
                return this.$route.query.direction
            },
            sortModalRouterLink() {
                return [
                    {
                        routerLink: `/${this.login}/stars?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                sort: undefined,
                                direction: undefined
                            })
                        }`,
                        label: 'Recently starred',
                        selected: (!this.direction && !this.sort) || (this.direction == 'desc' && this.sort == 'created') || (!this.direction && this.sort == 'created')
                    },
                    {
                        routerLink: `/${this.login}/stars?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                sort: 'updated',
                                direction: undefined
                            })
                        }`,
                        label: 'Recently active',
                        selected: (this.direction == 'desc' || !this.direction) && this.sort == 'updated'
                    },
                    {
                        routerLink: `/${this.login}/stars?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                sort: 'stars',
                                direction: undefined
                            })
                        }`,
                        label: 'Most stars',
                        selected: (this.direction == 'desc' || !this.direction) && this.sort == 'stars'
                    },
                ]
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
                    let url = api.API_USER_STARRED_REPOS(this.login, {
                       ...this.$route.query,
                       per_page: this.perPage
                    })

                    let url_count = api.API_USER_STARRED_REPOS(this.login, {
                       ...this.$route.query,
                       per_page: 1
                    })


                    let res_rest =  await Promise.all([
                        authRequiredGet(url,{
                            cancelToken,
                            headers: {
                                'Accept': 'application/vnd.github.mercy-preview+json'
                            }
                        }),
                        authRequiredGet(url_count,{
                            cancelToken,
                            headers: {
                                'Accept': 'application/vnd.github.mercy-preview+json'
                            }
                        }),
                    ])


                    this.data = res_rest[0].data
                    this.pageInfo = parse(res_rest[0].headers.link) || {}
                    let totalCountHolder = parse(res_rest[1].headers.link) || {}
                    this.totalCount = totalCountHolder.last ? totalCountHolder.last.page : res_rest[1].data.length
                    this.firstLoadedFlag = true

                    let graphql_extraData = graphql.GRAPHQL_USER_STARRED_REPOSITORY_EXTRA(this.data)
                    let res_graphql = await authRequiredGitHubGraphqlApiQuery(graphql_extraData,{cancelToken})

                    let extraData = []
                    for(let key in res_graphql.data.data) {
                        extraData.push(res_graphql.data.data[key])
                    }

                    this.extraData = extraData
                    
                    this.loading = false
                }catch(e) {
                    console.log(e)
                    this.loading = false
                } 
            },
            changePage(goPrevPageFlag) {
                let queryStr = util_queryParse.querify({
                    ...this.$route.query,
                    page: goPrevPageFlag ? this.page - 1 : (this.page ? parseInt(this.page) + 1 : 2)
                })
                //console.log(`/${this.login}/stars?${queryStr}`)
                this.$router.push(`/${this.login}/stars?${queryStr}`)
            },
            openModal(ref) {
                this.$refs[ref].show = true
            },
            closeModal() {
                for(let key in this.$refs){
                    if(this.$refs[key].show) this.$refs[key].show = false
                }
            },
        },
        components: {
            RepoListItem,
            LoadingIcon,
            Modal,
            SelectMenuItem,
            AnimatedHeightWrapper,
            Container: styled.div``,
            LoadingWrapper: styled.div``,
            FilterRow: styled.div``,
            ClearFilterRow: styled.div``,
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
.user-repo-search-results-summary {
    white-space: normal;
}

.issues-reset-query-icon {
    width: 18px;
    height: 18px;
    padding: 1px;
    margin-right: 3px;
    color: #fff;
    text-align: center;
    background-color: #6a737d;
    border-radius: 3px;
}

.paginate-container {
    margin-top: 20px;
    margin-bottom: 15px;
    text-align: center;
}
</style>