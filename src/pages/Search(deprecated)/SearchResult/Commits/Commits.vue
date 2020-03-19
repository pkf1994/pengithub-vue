<template>
     <SearchResultTemplate   
                        :loadingInfo="{
                            basicLoading: loading,
                            additionalLoading: loadingCount
                        }" 
                        :errorData="errorData" 
                        :emptyResult="emptyResult" 
                        :searchType="searchType">
        <Selector :syncSelectedValue="(newOne) => syncSelectedValue({key:'query',value:newOne})"
                  label="Sort">
            <option value="">Best match</option>
            <option value="order=desc&sort=committer-date">Recently committed</option>
            <option value="order=asc&sort=committer-date">Least recently committed</option>
            <option value="order=desc&sort=author-date">Recently authored</option>
            <option value="order=asc&sort=author-date">Least recently authored</option>
        </Selector>

        <ResultContent>
            <transition appear name="fade">
                <Title :id="'search-result-title-' + this.searchType"
                        class="p-3 "
                        v-show="!(data.length === 0)">
                    Showing {{totalCount}} available commit results
                </Title>
            </transition>
            <CommitItem class="border-top" v-for="item in data" :commit="item" :key="item.url"/>
        </ResultContent>

        <SimplePagination :loading="loading"
                          class="pagination mx-3"
                          v-if="pageInfo.next"
                          scrollElSelector="#app-container"
                          :scrollTargetSelector="'#search-result-title-' + searchType"
                          :dataGetter="paginationDataGetter"
                          :pageInfo="pageInfo"/>

    </SearchResultTemplate>

</template>

<script>
    import SearchResultMixin from "../components/SearchResultMixin";
    import {CommitItem} from "./components";
    import {util_numberFormat} from '../../../../util'
    import {mapState} from "vuex";
    export default {
        mixins: [SearchResultMixin],
        data() {
            return {
                searchType: 'commits'
            }
        },
        computed: {
            ...mapState({
                totalCount: state => util_numberFormat.thousands(state.search.searchResult.commits.totalCount),
                loading: state => state.search.searchResult.commits.loading,
                loadingCount: state => state.search.searchResult.commits.loadingCountOfEachLanguage,
                data: state => state.search.searchResult.commits.data,
                countOfEachLanguge: state => state.search.searchResult.commits.countOfEachLanguge,
                pageInfo: state => state.search.searchResult.commits.pageInfo,
            })
        },
        components: {
            CommitItem
        }
    }
</script>

<style scoped>

</style>