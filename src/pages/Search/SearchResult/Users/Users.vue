<template>
     <SearchResultTemplate :errorOccurred="errorData.errorOccurred" 
                        :emptyResult="emptyResult" 
                        :searchType="searchType" 
                        :getData="getData">

        <AnimatedHeightWrapper>
            <Selector :syncSelectedValue="(newOne) => syncSelectedValue({key:'language',value:newOne})"
                      initialValue="Any"
                      :disable="loading"
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
            <option value="order=desc&sort=followers">Most followers</option>
            <option value="order=asc&sort=followers">fewest followers</option>
            <option value="order=desc&sort=joined">Most recently joined</option>
            <option value="order=asc&sort=joined">Least recently joined</option>
            <option value="order=desc&sort=repositories">Most repositories</option>
            <option value="order=asc&sort=repositories">Least repositories</option>
        </Selector>

        <CommonLoadingWrapper :loading="loading || loadingAdditionalData || loadingCount"
                              :preventClickEvent="false"
                              :position="loading ? 'center' : 'corner'">
            <ResultContent>
                <transition appear name="fade">
                    <Title :id="'search-result-title-' + this.searchType"
                           class="p-3 "
                           v-show="!(data.length === 0)">
                       {{totalCount}} users results
                    </Title>
                </transition>
                <UserItem class="border-top"
                           v-for="item in data"
                           :key="item.login"
                           :user="item"/>
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
    import {UserItem} from './components'
    import {AnimatedHeightWrapper} from "../../../../components"
    import {util_numberFormat} from '../../../../util'
    import {mapState} from "vuex";
    export default {
        mixins: [SearchResultMixin],
        data() {
            return {
                searchType: 'users'
            }
        },
        computed: {
            ...mapState({
                totalCount: state => util_numberFormat.thousands(state.search.searchResult.users.totalCount),
                countOfEachLanguage: state => state.search.searchResult.users.countOfEachLanguage,
                loading: state => state.search.searchResult.users.loading,
                loadingCount: state => state.search.searchResult.users.loadingCount,
                loadingAdditionalData: state => state.search.searchResult.users.loadingAdditionalData,
                data: state => state.search.searchResult.users.data,
                pageInfo: state => state.search.searchResult.users.pageInfo,
            })
        },
        components: {
            UserItem,
            AnimatedHeightWrapper
        }
    }
</script>

<style scoped>

</style>