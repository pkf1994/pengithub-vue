<template>
    <Container>

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
                    {{totalCount}} topics results
                </Title>
            </transition>
             <transition-group appear name="fade-group">
                <TopicItem class="border-top"
                        v-for="item in data"
                        :key="item.name"
                        :topic="item"/>
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
            <CommonLoading  v-if="loading || extraData.loading"
                            :position="loading ? 'center' : 'corner'"
                            :preventClickEvent="false"/>
        </transition>  
    </Container>

</template>

<script>
    import {TopicItem} from './components'
    import {AnimatedHeightWrapper} from "@/components"
    import {util_numberFormat} from '@/util'
    import {SearchResultMixin} from "../components";
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import { authRequiredGet,cancelAndUpdateAxiosCancelTokenSource,authRequiredGitHubGraphqlApiQuery } from '@/network';
    var parse = require('parse-link-header');
    export default {
        name: 'search_result_topics_page',
        mixins: [SearchResultMixin],
        provide() {
            return {
                topicExtraDataProvided: () => this.extraData.data
            }
        },
        data() {
            return {
                searchType: 'topics',
                data: [],
                loading: false,
                perPage: 10,
                totalCount: 0,
                pageInfo: {},
                extraData: {
                    data: {
                        relatedTopicsAndViewerStarStatus: [],
                        repositoryCount: []
                    },
                    loading: false
                },
                sortSelectorModel: [
                    {
                        label: 'Best match',
                        sort: '',
                        order: '',
                    },
                    {
                        label: 'Most stars',
                        sort: 'stars',
                        order: 'desc',
                    },
                    {
                        label: 'Least stars',
                        sort: 'stars',
                        order: 'asc',
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
        computed: {
          /*   ...mapState({
                totalCount: state => util_numberFormat.thousands(state.search.searchResult.topics.totalCount),
                loading: state => state.search.searchResult.topics.loading,
                loadingAdditionalData: state => state.search.searchResult.topics.loadingAdditionalData,
                data: state => state.search.searchResult.topics.data,
                pageInfo: state => state.search.searchResult.topics.pageInfo,
            }) */
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    this.cancelSources.push(sourceAndCancelToken.source)

                     let url = api.API_SEARCH(
                        this.searchType,
                        {
                            q: this.m_query,
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
                    let res = await Promise.all([
                        authRequiredGitHubGraphqlApiQuery(graphql.GRAPHQL_RELATIVE_TOPICS_OF_TOPICS(this.data),{cancelToken:sourceAndCancelToken.cancelToken}),
                        authRequiredGitHubGraphqlApiQuery(graphql.GRAPHQL_COUNT_OF_REPOSITORY_BY_TOPICS(this.data),{cancelToken:sourceAndCancelToken.cancelToken})
                    ])


                    let repositoryCountData = []
                    let repositoryCountDataHolder
                    try{
                        repositoryCountDataHolder = res[1].data.data
                    }catch(e) {
                        this.handleGraphqlError(res[1])
                    }
                    for(let key in repositoryCountDataHolder) {
                        repositoryCountData.push(repositoryCountDataHolder[key])
                    }

                    repositoryCountData.forEach((item,index) => {
                        item.name = this.data[index].name
                    })

                    this.extraData.data.repositoryCount = repositoryCountData

                    let relatedTopicsAndViewerStarStatus = []
                    let relatedTopicsAndViewerStarStatusHolder
                    try{
                        relatedTopicsAndViewerStarStatusHolder = res[0].data.data
                    }catch(e) {
                        this.handleGraphqlError(res[0])
                    }
                    for(let key in relatedTopicsAndViewerStarStatusHolder) {
                        relatedTopicsAndViewerStarStatus.push(relatedTopicsAndViewerStarStatusHolder[key])
                    }

                    this.extraData.data.relatedTopicsAndViewerStarStatus = relatedTopicsAndViewerStarStatus

                    
                }catch(e) {
                    console.log(e)
                }finally{
                    this.extraData.loading = false
                }
            },
        },
        components: {
            TopicItem,
            AnimatedHeightWrapper
        }
    }
</script>

<style scoped>

</style>