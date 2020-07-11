<template>
    <Container>
        <Selector   @change="(value) => m_routeTo({language:value,p:1})"
                    label="Language">
            <option v-for="item in languageSelectorModel" :key="item" :selected="item == m_language" :value="item">{{item}}</option>
        </Selector>
        <Selector @change="(value) => {
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
                    Showing {{m_formatTotalCount}} available code results
                </Title>
            </transition>
            <transition-group name="fade-group" appear>
                <CodeItem class="border-top" v-for="item in data" :key="item.path + item.repository.id" :code="item"/>
            </transition-group>
        </ResultContent>

        <SimplePaginationRest :loading="loading"
                          class="pagination mx-3"
                          v-if="pageInfo.next || pageInfo.prev"
                          :pageInfo="pageInfo"/>
        
        <!-- <EmptyNotice v-if="data.length == 0 && !loading"></EmptyNotice> -->
        
        <transition name="fade" appear>
            <CommonLoading  v-if="loading"
                            :preventClickEvent="false"/>
        </transition>  
    </Container>
</template>

<script>
    import {CodeItem} from './components'
    import {SearchResultMixin,EmptyNotice} from "../components";
    import {util_numberFormat,util_queryParse} from '@/util'
    import * as api from '@/network/api'
    import { authRequiredGet,cancelAndUpdateAxiosCancelTokenSource } from '@/network';
    var parse = require('parse-link-header');
    export default {
        name: 'search_result_code_page',
        mixins: [SearchResultMixin],
        data() {
            return {
                searchType: 'code',
                data: [],
                loading: false,
                totalCount: 0,
                perPage: 10,
                pageInfo: {
                   
                },
                languageSelectorModel: [
                    "Any",
                    "ActionScript",
                    "C",
                    "C#",
                    "C++",
                    "Clojure",
                    "CoffeeScript",
                    "CSS",
                    "Go",
                    "Haskell",
                    "HTML",
                    "Java",
                    "JavaScript",
                    "Lua",
                    "MATLAB",
                    "Objective-C",
                    "Perl",
                    "PHP",
                    "Python",
                    "R",
                    "Ruby",
                    "Scala",
                    "Shell",
                    "Swift",
                    "TeX",
                    "Vim script"
                ],
                sortSelectorModel: [
                    {
                        label: 'Best match',
                        sort: '',
                        order: '',
                    },
                    {
                        label: 'Recently indexed',
                        sort: 'indexed',
                        order: 'desc',
                    },
                    {
                        label: 'Least recently indexed',
                        sort: 'indexed',
                        order: 'asc',
                    },
                ]
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {

                if(!this.accessToken) {
                    this.$toast('You must authenticate to search for code across all public repositories.')
                    return 
                }
                try{
                    this.loading = true
                    
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    this.cancelSources.push(sourceAndCancelToken.source)


                    let query = this.m_query
                    if(this.m_language) {
                        query = query.replace(/language:\S*/g,'') + ` language:${this.m_language}`
                    }

                    let url = api.API_SEARCH(
                        {
                            type: this.searchType,
                            params: {
                                q: query,
                                sort: this.m_sort,
                                order: this.m_order,
                                page: this.m_page,
                                per_page: this.perPage,
                            }
                        }
                    )
                 
                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: sourceAndCancelToken.cancelToken,
                            headers: {
                                'Accept': 'application/vnd.github.v3.text-match+json'
                            }
                        }
                    )

                    this.data = res.data.items
                    this.pageInfo = parse(res.headers.link) || {}
                    this.totalCount = res.data.total_count

                } catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
        },
        components: {
            CodeItem,
            EmptyNotice
        }
    }
</script>

<style scoped>

</style>