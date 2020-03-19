<template>
     <Container>

        <Selector label="State" @change="(value) => m_routeTo({state:value,p:1})">
            <option value="" :selected="m_state == ''">Any</option>
            <option value="closed" :selected="m_state == 'closed'">Closed</option>
            <option value="open" :selected="m_state == 'open'">Open</option>
        </Selector>

     <!--    <AnimatedHeightWrapper :stretch="!loadingCount">
            <Selector :syncSelectedValue="(newOne) => syncSelectedValue({key:'language',value:newOne})"
                      initialValue="Any"
                      :disable="loading || loadingCount"
                      v-if="!(loadingCount || countOfEachLanguage.length === 0)"
                      label="Language">
                <option value="Any">Any</option>
                <option v-for="item in countOfEachLanguage"
                        :value="item.language"
                        :key="item.language">{{item.language}}</option>
            </Selector>
        </AnimatedHeightWrapper> -->

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
                    {{m_formatTotalCount}} issues
                </Title>
            </transition>
            <transition-group appear name="fade-group">
                 <IssueItem class="border-top"
                        v-for="item in data"
                        :key="item.url"
                        :issue="item"/>
            </transition-group>
        </ResultContent>

        <SimplePagination :loading="loading"
                          class="pagination mx-3"
                          v-if="pageInfo.next"
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
    import {IssueItem} from './components'
    import {AnimatedHeightWrapper} from '@/components'
    import * as api from '@/network/api'
    import * as graphql from '../graphql'
    import { authRequiredGet,cancelAndUpdateAxiosCancelTokenSource,authRequiredGitHubGraphqlApiQuery } from '@/network';
    import {util_numberFormat} from '@/util'
    var parse = require('parse-link-header');
    export default {
        name: 'search_result_issues_page',
        mixins: [SearchResultMixin],
        provide() {
            return {
                issuesExtraDataProvided: () => this.extraData.data 
            }
        },
        data() {
            return {
                searchType: 'issues',
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
                        label: 'Most commented',
                        sort: 'comments',
                        order: 'desc',
                    },
                    {
                        label: 'Least commented',
                        sort: 'comments',
                        order: 'asc',
                    },
                    {
                        label: 'Newest',
                        sort: 'created',
                        order: 'desc',
                    },
                    {
                        label: 'Oldest',
                        sort: 'created',
                        order: 'asc',
                    },
                    {
                        label: 'Recently updated',
                        sort: 'updated',
                        order: 'desc',
                    },
                    {
                        label: 'Least recently updated',
                        sort: 'created',
                        order: 'desc',
                    }
                ]
            }
        },
        computed: {
           /*  ...mapState({
                totalCount: state => util_numberFormat.thousands(state.search.searchResult.issues.totalCount),
                loading: state => state.search.searchResult.issues.loading,
                loadingCount: state => state.search.searchResult.issues.loadingCountOfEachLanguage,
                countOfEachLanguage: state => state.search.searchResult.issues.countOfEachLanguage,
                data: state => state.search.searchResult.issues.data,
                pageInfo: state => state.search.searchResult.issues.pageInfo,
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


                    let query = this.m_query
                    if(this.m_language) {
                        query = query.replace(/language:\S*/g,'') + ` language:${this.m_language}`
                    }
                    if(this.m_state) {
                        query = query.replace(/state:\S*/g,'') + ` state:${this.m_state}`
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

                    this.loading = false
                } catch(e) {
                    this.loading = false
                    console.log(e)
                }
            },
            async network_getExtraData() {
                try{
                    this.extraData.loading = true
                    
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_extra_data')
                    this.cancelSources.push(sourceAndCancelToken.source)

                    let nodeIdArr = []
                    this.data.forEach(item => {
                        if(item.pull_request) {
                            nodeIdArr.push(item.node_id)
                        }
                    })
                    
                    let graphql_pullRefInfo = graphql.GRAPHQL_PULLS_REF_INFO(nodeIdArr)

                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql_pullRefInfo,
                        {
                            cancelToken: sourceAndCancelToken.cancelToken,
                        }
                    )

                    let extraData = []
                    for(let key in res.data.data) {
                        extraData.push(res.data.data[key])
                    }
                    this.extraData.data = extraData
                    this.extraData.loading = false
                } catch(e) {
                    this.extraData.loading = false
                    console.log(e)
                }
            }
        },
        components: {
            IssueItem,
            AnimatedHeightWrapper,
        }
    }
</script>

<style scoped>

</style>