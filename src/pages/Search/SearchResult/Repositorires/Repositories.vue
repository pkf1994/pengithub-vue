<template>
    <Container>
        <AnimatedHeightWrapper>
            <Selector :syncSelectedValue="(newOne) => syncSelectedValue({key:'language',value:newOne})"
                      initialValue="Any"
                      :disable="loading"
                      v-if="!(loadingCount || countOfEachLanguge.length === 0)"
                      label="Language">
                <option value="Any">Any</option>
                <option v-for="item in countOfEachLanguge"
                        :value="item.language"
                        :key="item.language">{{item.language}}</option>
            </Selector>
        </AnimatedHeightWrapper>

        <Selector :syncSelectedValue="(newOne) => syncSelectedValue({key:'query',value:newOne})"
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


        <CommonLoadingWrapper :loading="loading || loadingTopicsLanguageColorHelpWantedIssuesCount || loadingCount || loadingCountOfEachSearchType"
                              :preventClickEvent="false"
                              :position="loading ? 'center' : 'corner'">
            <ResultContent>
                <transition appear name="fade">
                    <Title :id="'search-result-title-' + this.searchType"
                           class="p-3 "
                           v-show="!(data.length === 0)">
                        {{totalCount}} repository results
                    </Title>
                </transition>
                <RepositoryItem class="border-top" v-for="item in data" :key="item.id" :repository="item"/>
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
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {mapActions, mapState} from "vuex";
    import {RepositoryItem} from './components'
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
        computed: {
            ...mapState({
                totalCount: state => util_numberFormat.thousands(state.search.searchResult.repositories.totalCount),
                loading: state => state.search.searchResult.repositories.loading,
                loadingCount: state => state.search.searchResult.repositories.loadingCountOfEachLanguage,
                loadingAdditionalData: state => state.search.searchResult.repositories.loadingAdditionalData,
                loadingFirstTopic: state => state.search.searchResult.repositories.loadingFirstTopic,
                firstTopic: state => state.search.searchResult.repositories.firstTopic,
                data: state => state.search.searchResult.repositories.data,
                countOfEachLanguge: state => state.search.searchResult.repositories.countOfEachLanguage,
                pageInfo: state => state.search.searchResult.repositories.pageInfo,
            })
        },
        components: {
            AnimatedHeightWrapper,
            RepositoryItem,
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