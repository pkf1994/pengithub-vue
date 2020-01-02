<template>
    <Container>
        <Selector :syncSelectedValue="(newOne) => syncSelectedValue({key:'sort',value:newOne})"
                  label="Sort">
            <option value="">Best match</option>
            <option value="order=desc&sort=committer-date">Recently committed</option>
            <option value="order=asc&sort=committer-date">Least recently committed</option>
            <option value="order=desc&sort=author-date">Recently authored</option>
            <option value="order=asc&sort=author-date">Least recently authored</option>
        </Selector>

        <CommonLoadingWrapper :loading="loading"
                              :preventClickEvent="false">
            <ResultContent>
                <transition appear name="fade">
                    <Title :id="'search-result-title-' + this.searchType"
                           class="p-3 "
                           v-show="!(data.length === 0)">
                        Showing {{totalCount}} available commit results
                    </Title>
                </transition>
                <transition-group appear name="fade">

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
    import SearchResultMixin from "./components/SearchResultMixin";
    import {util_numberFormat} from '../../../util'
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

    }
</script>

<style scoped>

</style>