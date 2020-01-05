<template>
    <SearchResultTemplate :errorOccurred="errorData.errorOccurred" 
                        :emptyResult="emptyResult" 
                        :searchType="searchType" 
                        :getData="getData">

      <!--  <Selector :syncSelectedValue="(newOne) => syncSelectedValue({key:'query',value:newOne})"
                  label="Sort">
            <option value="">Best match</option>
            <option value="order=desc&sort=stars">Most stars</option>
            <option value="order=asc&sort=stars">Least stars</option>
            <option value="order=desc&sort=forks">Most forks</option>
            <option value="order=asc&sort=forks">Least forks</option>
            <option value="order=desc&sort=updated">Recently updated</option>
            <option value="order=asc&sort=updated">Least recently updated</option>
        </Selector>-->

        <CommonLoadingWrapper :loading="loading || loadingAdditionalData"
                              :preventClickEvent="false"
                              :position="loading ? 'center' : 'corner'">
            <ResultContent>
                <transition appear name="fade">
                    <Title :id="'search-result-title-' + this.searchType"
                           class="p-3 "
                           v-show="!(data.length === 0)">
                       {{totalCount}} topics results
                    </Title>
                </transition>
                <TopicItem class="border-top"
                           v-for="item in data"
                           :key="item.name"
                           :topic="item"/>
            </ResultContent>
        </CommonLoadingWrapper>

        <SimplePagination :loading="loading"
                          class="pagination mx-3"
                          v-if="pageInfo.next"
                          scrollElSelector="#app-container"
                          :scrollTargetSelector="'#search-result-title-' + searchType"
                          :prev="prev"
                          :next="next"
                          :pageInfo="pageInfo"/>
    </SearchResultTemplate>

</template>

<script>
    import SearchResultMixin from "../components/SearchResultMixin";
    import {TopicItem} from './components'
    import {AnimatedHeightWrapper} from "../../../../components"
    import {util_numberFormat} from '../../../../util'
    import {mapState} from "vuex";
    export default {
        mixins: [SearchResultMixin],
        data() {
            return {
                searchType: 'topics'
            }
        },
        computed: {
            ...mapState({
                totalCount: state => util_numberFormat.thousands(state.search.searchResult.topics.totalCount),
                loading: state => state.search.searchResult.topics.loading,
                loadingAdditionalData: state => state.search.searchResult.topics.loadingAdditionalData,
                data: state => state.search.searchResult.topics.data,
                pageInfo: state => state.search.searchResult.topics.pageInfo,
            })
        },
        components: {
            TopicItem,
            AnimatedHeightWrapper
        }
    }
</script>

<style scoped>

</style>