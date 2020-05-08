<template>
     <Container>
        <Selector    @change="(value) =>{
                    let obj = JSON.parse(value);
                        m_routeTo({sort:obj.sort,order:obj.order,p:0})
                    }"
                  label="Sort">
            <option :value="JSON.stringify(item)" 
                    v-for="item in sortSelectorModel"
                    :selected="item.sort == m_sort && item.order == m_order"
                    :key="item.label">{{item.label}}</option>
        </Selector>

        <ResultContent>
            <transition appear name="fade">
                <Title :id="'search-result-title-' + this.searchType"
                        class="p-3"
                        v-show="!(data.length === 0)">
                    {{m_formatTotalCount}} commit results
                </Title>
            </transition>
            <transition-group appear name="fade-group">
                <CommitItem class="border-top" v-for="item in data" :commit="item" :key="item.url"/>
            </transition-group>
        </ResultContent>

        <SimplePagination :loading="loading"
                          class="pagination mx-3"
                          v-if="pageInfo.next"
                          scrollElSelector="#app-container"
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
    import {CommitItem} from "./components";
    import {util_numberFormat} from '@/util'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import { authRequiredGet,cancelAndUpdateAxiosCancelTokenSource,authRequiredGitHubGraphqlApiQuery } from '@/network';
    var parse = require('parse-link-header');
    import {SearchResultMixin} from '../components'
    export default {
        name: 'search_result_commits_page',
        mixins: [SearchResultMixin],
        provide() {
            return {
                commitsExtraDataProvided:  () => this.extraData.data
            }
        },
        data() {
            return {
                searchType: 'commits',
                data: [],
                loading: false,
                extraData: {
                    data: [],
                    loading: false
                },
                totalCount: 0,
                perPage: 10,
                pageInfo: {

                },
                sortSelectorModel: [
                    {
                        label: 'Best match',
                        sort: '',
                        order: '',
                    },
                    {
                        label: 'Recently committed',
                        sort: 'committer-date',
                        order: 'desc',
                    },
                    {
                        label: 'Least recently committed',
                        sort: 'committer-date',
                        order: 'desc',
                    },
                    {
                        label: 'Recently authored',
                        sort: 'committer-author',
                        order: 'asc',
                    },
                    {
                        label: 'Least recently authored',
                        sort: 'committer-autho',
                        order: 'desc',
                    }
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
                    
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    this.cancelSources.push(sourceAndCancelToken.source)

                    let query = this.m_query
                    if(this.language) {
                        query = query.replace(/language:\S*/g,'') + ` language:${this.language}`
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
                                'Accept': 'application/vnd.github.cloak-preview'
                            }
                        }
                    )

                    this.data = res.data.items
                    this.pageInfo = parse(res.headers.link) || {}
                    this.totalCount = res.data.total_count

                    this.network_getExtraData()

                } catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            async network_getExtraData() {
                try{
                    this.extraData.loading = true
                    
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_extra_data')
                    this.cancelSources.push(sourceAndCancelToken.source)

                    let nodeIdArr = []
                    this.data.forEach(item => {
                        nodeIdArr.push(item.node_id)
                    })
                    
                    let graphql_commitStatus = graphql.GRAPHQL_COMMIT_STATUS(nodeIdArr)

                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql_commitStatus,
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
                }finally{
                    this.extraData.loading = false
                }
            }
        },
        components: {
            CommitItem
        }
    }
</script>

<style scoped>

</style>