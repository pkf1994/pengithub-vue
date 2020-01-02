<template>
    <Container>
        <Selector :syncSelectedValue="(newOne) => syncSelectedValue({key:'language',value:newOne})"
                  initialValue="Any"
                  label="Language">
            <option value="Any">Any</option>
            <option value="ActionScript">ActionScript</option>
            <option value="C">C</option>
            <option value="C#">C#</option>
            <option value="C++">C++</option>
            <option value="Clojure">Clojure</option>
            <option value="CoffeeScript">CoffeeScript</option>
            <option value="CSS">CSS</option>
            <option value="Go">Go</option>
            <option value="Haskell">Haskell</option>
            <option value="HTML">HTML</option>
            <option value="Java">Java</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Lua">Lua</option>
            <option value="MATLAB">MATLAB</option>
            <option value="Objective-C">Objective-C</option>
            <option value="Perl">Perl</option>
            <option value="PHP">PHP</option>
            <option value="Python">Python</option>
            <option value="R">R</option>
            <option value="Ruby">Ruby</option>
            <option value="Scala">Scala</option>
            <option value="Shell">Shell</option>
            <option value="Swift">Swift</option>
            <option value="TeX">TeX</option>
            <option value="Vim script">Vim script</option>
        </Selector>
        <Selector :syncSelectedValue="(newOne) => syncSelectedValue({key:'sort',value:newOne})"

                  label="Sort">
            <option value="">Best match</option>
            <option value="order=desc&sort=indexed">Recently indexed</option>
            <option value="order=asc&sort=indexed">Least recently indexed</option>
        </Selector>

        <CommonLoadingWrapper :loading="loading"
                              :preventClickEvent="false"
                              :position="loading ? 'center' : 'corner'">
            <ResultContent>
                <transition appear name="fade">
                    <Title :id="'search-result-title-' + this.searchType"
                           class="p-3 "
                           v-show="!(data.length === 0)">
                        Showing {{totalCount}} available code results
                    </Title>
                </transition>
                <transition-group appear name="fade">
                    <CodeItem class="border-top" v-for="item in data" :key="item.path + item.repository.id" :code="item"/>
                </transition-group>
            </ResultContent>
        </CommonLoadingWrapper>

        <SimplePagination :loading="loading"
                          class="pagination mx-3"
                          v-if="pageInfo.next"
                          scrollElSelector="#app-container"
                          :scrollTargetSelector="'#search-result-title-' + this.searchType"
                          :prev="prev"
                          :next="next"
                          :pageInfo="pageInfo"/>
    </Container>

</template>

<script>
    import SearchResultMixin from "../components/SearchResultMixin";
    import {CodeItem} from './components'
    import {util_numberFormat} from '../../../../util'
    import {mapState} from "vuex";
    export default {
        mixins: [SearchResultMixin],
        data() {
            return {
                searchType: 'code'
            }
        },
        computed: {
            ...mapState({
                totalCount: state => util_numberFormat.thousands(state.search.searchResult.code.totalCount),
                loading: state => state.search.searchResult.code.loading,
                loadingCount: state => state.search.searchResult.code.loadingCountOfEachLanguage,
                data: state => state.search.searchResult.code.data,
                countOfEachLanguge: state => state.search.searchResult.code.countOfEachLanguge,
                pageInfo: state => state.search.searchResult.code.pageInfo,
            })
        },
        components: {
            CodeItem
        }
    }
</script>

<style scoped>

</style>