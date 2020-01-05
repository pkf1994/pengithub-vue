<template>

</template>

<script>
    import styled from 'vue-styled-components'
    import {ACTION_SEARCH_REQUEST_SEARCH_RESULT} from "../../../../store/modules/search/actionTypes";
    import {mapActions, mapMutations, mapState} from "vuex";
    import {SimplePagination,AnimatedHeightWrapper,CommonLoadingWrapper} from '../../../../components'
    import Selector from './Selector.vue'
    import SearchResultTemplate from './SearchResultTemplate.vue'
    import {
        MUTATION_SEARCH_SYNC_QUERY,
        MUTATION_SEARCH_SYNC_SEARCH_SUFFIX
    } from "../../../../store/modules/search/mutationTypes";
    export default {
        data() {
            return {
                query: "",
                language: "",
                state: "",
                searchType: "repositories",
                needToGetDataWhenActivated: false,
                errorData: {
                    errorOccurred: false,
                    errorMessage: ""
                }
            }
        },
        computed: {
            ...mapState({
                loadingCountOfEachSearchType: state => state.search.loadingCountOfEachSearchType,
                searchQuery: state => state.search.searchQuery,
            }),
            emptyResult() {
                return this.data.length === 0 && !this.loading
            }
        },
        created() {
            this.getData({
                searchQueryChanged: true,
            })
        },
        activated() {
            if(this.needToGetDataWhenActivated) {
                this.getData({
                    searchQueryChanged: true
                })
                this.needToGetDataWhenActivated = false
            }
        },
        watch: {
            query(newOne,oldOne) {
                this.mutation_search_syncQuery({
                    searchType: this.searchType,
                    query: newOne
                })
                this.getData({
                    searchQueryChanged: false
                })
            },
            language(newOne,oldOne) {
                this.mutation_search_syncSearchSuffix({
                    searchType: this.searchType,
                    key: 'language',
                    value: newOne
                })
                this.getData({
                    searchQueryChanged: false
                })
            },
            state(newOne) {
                this.mutation_search_syncSearchSuffix({
                    searchType: this.searchType,
                    key: 'state',
                    value: newOne
                })
                this.getData({
                    searchQueryChanged: false
                })
            },
            searchQuery() {
                let currentSearchChildPath = this.searchType === "repositories" ? "" : `/${this.searchType}`
                if(this.$route.path === `/search${currentSearchChildPath}`) {
                    this.getData({
                        searchQueryChanged: true,
                    })
                } else {
                    this.needToGetDataWhenActivated = true
                }
            }
        },
        methods: {
            ...mapActions({
                action_search_requestSearchResult: ACTION_SEARCH_REQUEST_SEARCH_RESULT
            }),
            ...mapMutations({
                mutation_search_syncQuery: MUTATION_SEARCH_SYNC_QUERY,
                mutation_search_syncSearchSuffix: MUTATION_SEARCH_SYNC_SEARCH_SUFFIX,
            }),
            syncSelectedValue({key,value}) {
                this[key] = value
            },
            async getData(payload) {
                try{
                    this.errorData.errorOccurred = false
                    console.log("getData:" + this.searchType)
                    await this.action_search_requestSearchResult({
                        searchType: this.searchType,
                        ...payload
                    })
                }catch(e){
                    this.errorData = {
                        errorOccurred: true,
                        errorMessage: e.message
                    }
                    console.log(e)
                }
              
            },
            async next(){
                await this.action_search_requestSearchResult({
                    searchType: this.searchType,
                    changePage:true,
                    forward:true
                })
            },
            async prev(){
                await this.action_search_requestSearchResult({
                    searchType: this.searchType,
                    changePage:true,
                    forward:false
                })
            }
        },
        components: {
            Selector,
            SimplePagination,
            SearchResultTemplate,
            AnimatedHeightWrapper,
            CommonLoadingWrapper,
            ResultContent: styled.div``,
            Title: styled.h3``
        }
    }
</script>

<style scoped>
    .pagination{
        margin-top: 20px;
        margin-bottom: 15px;
    }
</style>