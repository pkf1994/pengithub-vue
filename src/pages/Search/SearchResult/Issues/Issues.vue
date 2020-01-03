<template>
    <Container>

        <Selector :syncSelectedValue="(newOne) => syncSelectedValue({key:'state',value:newOne})"
                  label="State">
            <option value="">Any</option>
            <option value="closed">Closed</option>
            <option value="open">Open</option>
        </Selector>

        <AnimatedHeightWrapper :stretch="!loadingCount">
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
        </AnimatedHeightWrapper>

        <Selector :syncSelectedValue="(newOne) => syncSelectedValue({key:'query',value:newOne})"
                  label="Sort">
            <option value="">Best match</option>
            <option value="order=desc&sort=comments">Most commented</option>
            <option value="order=asc&sort=comments">Least commented</option>
            <option value="order=desc&sort=created">Newest</option>
            <option value="order=asc&sort=created">Oldest</option>
            <option value="order=desc&sort=updated">Recently updated</option>
            <option value="order=asc&sort=updated">Least recently updated</option>
        </Selector>

        <CommonLoadingWrapper :loading="loading || loadingCount"
                              :preventClickEvent="false"
                              :position="loading ? 'center' : 'corner'">
            <ResultContent>
                <transition appear name="fade">
                    <Title :id="'search-result-title-' + this.searchType"
                           class="p-3 "
                           v-show="!(data.length === 0)">
                       {{totalCount}} issues
                    </Title>
                </transition>
                <IssueItem class="border-top"
                           v-for="item in data"
                           :key="item.url"
                           :issue="item"/>
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
    import SearchResultMixin from "../components/SearchResultMixin";
    import {IssueItem} from './components'
    import {AnimatedHeightWrapper} from "../../../../components"
    import {util_numberFormat} from '../../../../util'
    import {mapState} from "vuex";
    export default {
        mixins: [SearchResultMixin],
        data() {
            return {
                searchType: 'issues'
            }
        },
        computed: {
            ...mapState({
                totalCount: state => util_numberFormat.thousands(state.search.searchResult.issues.totalCount),
                loading: state => state.search.searchResult.issues.loading,
                loadingCount: state => state.search.searchResult.issues.loadingCountOfEachLanguage,
                countOfEachLanguage: state => state.search.searchResult.issues.countOfEachLanguage,
                data: state => state.search.searchResult.issues.data,
                pageInfo: state => state.search.searchResult.issues.pageInfo,
            })
        },
        components: {
            IssueItem,
            AnimatedHeightWrapper
        }
    }
</script>

<style scoped>

</style>