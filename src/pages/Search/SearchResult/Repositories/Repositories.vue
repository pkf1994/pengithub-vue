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
        

        <Selector   label="Sort"  
                    @change="(value) =>{
                    let obj = JSON.parse(value);
                    m_routeTo({sort:obj.sort,order:obj.order,p:0})
                }">
            <option v-for="item in sortSelectorModel"
                    :value="JSON.stringify(item)"
                    :selected="item.sort == m_sort && item.order == m_order"
                    :key="item.label">{{item.label}}</option>
        </Selector>

        <!-- <AnimatedHeightWrapper :stretch="firstTopic.data.name != undefined" :inactivatedFlagSignal="firstTopic.data.name != undefined && !firstTopic.loading">
            <FirstTopic :firstTopic="firstTopic.data">
            </FirstTopic>
        </AnimatedHeightWrapper> -->

        <ResultContent>
            <transition appear name="fade">
                <Title :id="'search-result-title-' + searchType"
                        class="p-3 "
                        v-show="data.length != 0">
                    {{m_formatTotalCount}} repository results
                </Title>
            </transition>
            <transition-group appear name="fade-group" :style="{position:'relative'}">
                <RepositoryItem class="border-top" v-for="item in data" :key="item.node_id" :repository="item"/>
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
            <CommonLoading  v-if="loading || firstTopic.loading || countByLanguage.loading"
                            :preventClickEvent="false"
                            :position="loading ? 'center' : 'corner'"/>
        </transition>  

    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {RepositoryItem,FirstTopic} from './components'
    import {AnimatedHeightWrapper,CommonLoading,SimplePagination} from '@/components'
    import {Selector,EmptyNotice,SearchResultMixin} from '../components'
    import {util_numberFormat,util_queryParse,util_animatedScrollTo} from '@/util'
    import {PROGRAMMING_LIST} from '@/util/analyseFileType'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import { authRequiredGet,cancelAndUpdateAxiosCancelTokenSource,authRequiredGitHubGraphqlApiQuery } from '@/network';
    var parse = require('parse-link-header');
    export default {
        name: 'search_repository_page',
        mixins: [RouteUpdateAwareMixin,SearchResultMixin],
        data() {
            return {
                searchType: 'repositories',
                data: [],
                loading: false,
                perPage: 10,
                totalCount: 0,
                pageInfo: {},
                countByLanguage: {
                    data: [],
                    loading: false
                },
                firstTopic: {
                    data: {},
                    loading: false
                },
                sortSelectorModel: [
                    {
                        label: 'Best match',
                        sort: '',
                        order: '',
                    },
                    {
                        label: 'Fewest stars',
                        sort: 'stars',
                        order: 'desc',
                    },
                    {
                        label: 'Most forks',
                        sort: 'forks',
                        order: 'desc',
                    },
                    {
                        label: 'Fewest forks',
                        sort: 'forks',
                        order: 'asc',
                    },
                    {
                        label: 'Recently updated',
                        sort: 'updated',
                        order: 'desc',
                    },
                    {
                        label: 'Least recently updated',
                        sort: 'updated',
                        order: 'asc',
                    },
                ]
            }
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
                            headers: {
                                'Accept': 'application/vnd.github.mercy-preview+json'
                            }
                        }
                    )

                    this.data = res.data.items
                    this.pageInfo = parse(res.headers.link) || {}
                    this.totalCount = res.data.total_count

                    this.loading = false
                } catch(e) {
                    this.loading = false
                    console.log(e)
                }
            },
            async network_getCountByLanguage() {
                 try{
                    this.countByLanguage.data = []
                    this.countByLanguage.loading = true
                    
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_count_by_language')
                    this.cancelSources.push(sourceAndCancelToken.source)

                    let graphql_countByLanguage = graphql.GRAPHQL_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE(this.m_query,PROGRAMMING_LIST)
                   

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
                        if(res.data.data[key].repositoryCount > 0) {
                            countByLanguage.push({
                                language: languageCursor[key],
                                count: res.data.data[key].repositoryCount
                            })
                        }
                    }
                    countByLanguage.sort((a,b) => {
                        return b.count - a.count
                    })

                    this.countByLanguage.data = countByLanguage

                    this.countByLanguage.loading = false
                } catch(e) {
                    this.countByLanguage.loading = false
                    console.log(e)
                }
            },
            routeUpdateHook() {
                this.network_getData()
            },
        },
        watch: {
            query() {
                this.network_getCountByLanguage()
                //this.network_getFirstTopic()
            }
        },
        components: {
            AnimatedHeightWrapper,
            RepositoryItem,
            CommonLoading,
            FirstTopic,
            Selector,
            EmptyNotice,
            SimplePagination,
            Container: styled.div``,
            Title: styled.h3``,
            ResultContent: styled.div``,
        }
    }
</script>

<style scoped>
.pagination{
    margin-top: 20px;
    margin-bottom: 15px;
}
</style>