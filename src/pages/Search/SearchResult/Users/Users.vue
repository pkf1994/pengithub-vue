<template>
    <Container>

         <Selector   :disabled="countByLanguage.loading"
                    @change="(value) => m_routeTo({language:value,p:0})"
                    v-if="countByLanguage.loading || countByLanguage.data.length !== 0"
                    label="Language">
            <option value="" :selected="m_language == '' || !m_language">Any</option>
            <option v-for="item in countByLanguage.data"
                    :value="item.language"
                    :selected="m_language == item.language"
                    :key="item.language">{{item.language}}</option>
        </Selector>

         <Selector    @change="(value) => {
                let valueObj = JSON.parse(value)
                m_routeTo({sort:valueObj.sort,order:valueObj.order,p:1})
            }"
                  label="Sort">
            <option v-for="item in sortSelectorModel" :key="item.label" :selected="item.sort==m_sort && item.order==m_order" :value="JSON.stringify(item)">{{item.label}}</option>
        </Selector>

        <ResultContent>
            <transition appear name="fade">
                <Title :id="'search-result-title-' + this.searchType"
                        class="p-3 "
                        v-show="!(data.length === 0)">
                    {{m_formatTotalCount}} users
                </Title>
            </transition>

            <transition-group appear name="fade-group">
                <UserItem class="border-top"
                        v-for="item in data"
                        :key="item.login"
                        :user="item"/>
            </transition-group>
            
        </ResultContent>

        <SimplePagination :loading="loading"
                          class="pagination mx-3"
                          v-if="pageInfo.next || pageInfo.prev"
                            :goNext="() => m_routeTo({p:pageInfo.next.page})"
                          :goPrev="() => m_routeTo({p:pageInfo.prev.page})"
                          :pageInfo="pageInfo"/>

        <EmptyNotice v-if="data.length == 0 && !loading"></EmptyNotice>
        
        <transition name="fade" appear>
            <CommonLoading  v-if="loading || countByLanguage.loading || extraData.loading"
                            :position="loading ? 'center' : 'corner'"
                            :preventClickEvent="false"/>
        </transition>  
    </Container>

</template>

<script>
    import {SearchResultMixin} from "../components";
    import {UserItem} from './components'
    import {AnimatedHeightWrapper} from '@/components'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import {PROGRAMMING_LIST} from '@/util/analyseFileType'
    import { authRequiredGet,cancelAndUpdateAxiosCancelTokenSource,authRequiredGitHubGraphqlApiQuery } from '@/network';
    import {util_numberFormat} from '@/util'
    var parse = require('parse-link-header');
    export default {
        name: 'search_result_users_page',
        mixins: [SearchResultMixin],
           provide() {
            return {
                userExtraDataProvided: () => this.extraData.data 
            }
        },
        data() {
            return {
                  searchType: 'users',
                data: [],
                loading: false,
                totalCount: 0,
                perPage: 10,
                pageInfo: {

                },
                extraData: {
                    data: [],
                    loading: false
                },
                countByLanguage: {
                    data: [],
                    loading: false
                },
                sortSelectorModel: [
                    {
                        label: 'Best match',
                        sort: '',
                        order: '',
                    },
                    {
                        label: 'Most followers',
                        sort: 'followers',
                        order: 'desc',
                    },
                    {
                        label: 'Least followers',
                        sort: 'followers',
                        order: 'asc',
                    },
                    {
                        label: 'Most recently joined',
                        sort: 'joined',
                        order: 'desc',
                    },
                    {
                        label: 'Least recently joined',
                        sort: 'joined',
                        order: 'desc',
                    },
                    {
                        label: 'Most repositories',
                        sort: 'repositories',
                        order: 'desc',
                    },
                    {
                        label: 'Least repositories',
                        sort: 'repositories',
                        order: 'desc',
                    }
                ]
            }
        },
        computed: {
         
        },
         created() {
            this.network_getData()
            this.network_getCountByLanguage()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    this.cancelSources.push(sourceAndCancelToken.source)


                    let query = this.m_query
                    if(this.m_language) {
                        query = query.replace(/language:\S*/g,'') + ` language:${this.m_language}`
                    }

                    let url = api.API_SEARCH(
                        this.searchType,
                        {
                            q: query,
                            sort: this.m_sort,
                            order: this.m_order,
                            page: this.m_page,
                            per_page: this.perPage,
                        }
                    )
                 
                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: sourceAndCancelToken.cancelToken,
                        }
                    )

                    this.data = res.data.items
                    this.pageInfo = parse(res.headers.link) || {}
                    this.totalCount = res.data.total_count

                    this.network_getExtraData()

                } catch(e) {
                    this.handleError(e)
                } finally {
                    this.loading = false
                }
            },
            async network_getExtraData() {
                try{
                    this.extraData.loading = true
                    
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_extra_data')
                    this.cancelSources.push(sourceAndCancelToken.source)

                    let graphql_userExtraData = graphql.GRAPHQL_NAME_BIO_LOCATION_EMAIL_FOLLOWSHIP_OF_USERS(this.data)
                   // console.log(this.data)
                   // console.log(graphql_userExtraData)

                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql_userExtraData,
                        {
                            cancelToken: sourceAndCancelToken.cancelToken,
                        }
                    )

                    let extraData = []
                    for(let key in res.data.data) {
                        extraData.push(res.data.data[key])
                    }
                    this.extraData.data = extraData
                } catch(e) {
                    console.log(e)
                } finally {
                    this.extraData.loading = false
                }
            },
            async network_getCountByLanguage() {
                 try{
                    this.countByLanguage.data = []
                    this.countByLanguage.loading = true
                    
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_count_by_language')
                    this.cancelSources.push(sourceAndCancelToken.source)

                    let graphql_countByLanguage = graphql.GRAPHQL_COUNT_OF_USER_GROUP_BY_LANGUAGE(this.m_query,PROGRAMMING_LIST)

                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql_countByLanguage,
                        {
                            cancelToken: sourceAndCancelToken.cancelToken,
                        }
                    )

                    let countByLanguage = []
                    let languageCursor = {}

                    PROGRAMMING_LIST.forEach((item,index) => {
                        languageCursor[`language${index}`] = item.name
                    })
                    for(let key in res.data.data) {
                        if(res.data.data[key].userCount > 0) {
                            countByLanguage.push({
                                language: languageCursor[key],
                                count: res.data.data[key].userCount
                            })
                        }
                    }
                    countByLanguage.sort((a,b) => {
                        return b.count - a.count
                    })

                    this.countByLanguage.data = countByLanguage

                } catch(e) {
                    console.log(e)
                }finally{
                    this.countByLanguage.loading = false
                }
            },
            routeUpdateHook() {
                this.network_getData()
            }
        },
        watch: {
            m_query() {
                this.network_getCountByLanguage()
            }
        },
        components: {
            UserItem,
            AnimatedHeightWrapper
        }
    }
</script>

<style scoped>

</style>