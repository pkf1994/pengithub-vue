<template>
    <Container>
        <AnimatedHeightWrapper>
            <Selector :syncSelectedValue="(newOne) => syncSelectedValue({key:'language',value:newOne})"
                      initialValue="Any"
                      :disable="loading"
                      v-if="!(loadingCount || counts.length === 0)"
                      label="Language">
                <option value="Any">Any</option>
                <option v-for="item in counts"
                        :value="item.language"
                        :key="item.language">{{item.language}}</option>
            </Selector>
        </AnimatedHeightWrapper>

        <Selector :syncSelectedValue="(newOne) => syncSelectedValue({key:'sort',value:newOne})"
                  label="Sort">
            <option value="">Best match</option>
            <option value="order=desc&sort=stars">Most stars</option>
            <option value="order=asc&sort=stars">Fewest stars</option>
            <option value="order=desc&sort=forks">Most forks</option>
            <option value="order=asc&sort=forks">Fewest forks</option>
            <option value="order=desc&sort=updated">Recently updated</option>
            <option value="order=asc&sort=updated">Least recently updated</option>
        </Selector>

        <AnimatedHeightWrapper>
            <FirstTopic :firstTopic="firstTopic"
                        v-if="(!loadingFirstTopic) && firstTopic !== {}">
            </FirstTopic>
        </AnimatedHeightWrapper>


        <CommonLoadingWrapper :loading="loading || loadingTopicsLanguageColorHelpWantedIssuesCount || loadingCount"
                              :preventClickEvent="false"
                              :position="loading ? 'center' : 'corner'">
            <ResultContent class="px-3">
                <transition appear name="fade">
                    <Title :id="'search-result-title-' + this.searchType" class="pb-3 pt-3 " v-show="!(data.length === 0)">{{totalCount}} repository results</Title>
                </transition>
                <transition-group appear name="fade">
                    <SearchResultRepositoryItem class="border-top" v-for="item in data" :key="item.id" :repository="item"/>
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
    import styled from 'vue-styled-components'
    import {mapActions, mapState} from "vuex";
    import {SearchResultRepositoryItem} from '../components'
    import {FirstTopic} from './components'
    import {AnimatedHeightWrapper} from '../../../../components'
    import {util_numberFormat} from '../../../../util'
    import SearchResultMixin from "../components/SearchResultMixin";
    export default {
        mixins: [SearchResultMixin],
        data() {
            return {
                searchType: 'repositories'
            }
        },
        created() {

        },
        computed: {
            ...mapState({
                totalCount: state => util_numberFormat.thousands(state.search.searchResult.repositories.totalCount),
                loading: state => state.search.searchResult.repositories.loading,
                loadingCount: state => state.search.searchResult.repositories.loadingCount,
                loadingTopicsLanguageColorHelpWantedIssuesCount: state => state.search.searchResult.repositories.loadingTopicsLanguageColorHelpWantedIssuesCount,
                loadingFirstTopic: state => state.search.searchResult.repositories.loadingFirstTopic,
                firstTopic: state => state.search.searchResult.repositories.firstTopic,
                data: state => state.search.searchResult.repositories.data,
                counts: state => state.search.searchResult.repositories.counts,
                pageInfo: state => state.search.searchResult.repositories.pageInfo,
            })
        },
        methods: {

        },
        components: {
            AnimatedHeightWrapper,
            SearchResultRepositoryItem,
            FirstTopic,

        }
    }
</script>

<style scoped>
.pagination{
    margin-top: 20px;
    margin-bottom: 15px;
}
</style>