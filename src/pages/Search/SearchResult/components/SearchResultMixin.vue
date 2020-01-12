<template>

</template>

<script>
    import styled from 'vue-styled-components'
    import {ACTION_SEARCH_REQUEST_SEARCH_RESULT} from "../../../../store/modules/search/actionTypes";
    import {mapActions, mapMutations, mapState} from "vuex";
    import {SimplePagination,AnimatedHeightWrapper} from '../../../../components'
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
                    errorMessage: "",
                    reTryCallback: () => {}
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
            },
            currentPage: function() {
                return this.$route.query.p ? this.$route.query.p : 1
            },
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
                this.getData({
                    query: newOne,
                    qualifiers: {
                         state: this.state,
                        language: this.language,
                    },
                    searchQueryChanged: false
                })
            },
            language(newOne,oldOne) {
           
                this.getData({
                    query: this.query,
                    qualifiers: {
                        state: this.state,
                        language: newOne,
                    },
                    searchQueryChanged: false
                })
            },
            state(newOne) {
                this.getData({
                    query: this.query,
                    qualifiers: {
                        state: newOne,
                        language: this.language,
                    },
                    searchQueryChanged: false
                })
            },
            searchQuery() {
                let currentSearchChildPath = this.searchType === "repositories" ? "" : `/${this.searchType}`
                if(this.$route.path === `/search${currentSearchChildPath}`) {
                    this.getData({
                        searchQueryChanged: true,
                        query: this.query,
                        qualifiers: {
                            state: this.state,
                            language: this.language,
                        },
                    })
                } else {
                    this.needToGetDataWhenActivated = true
                }
            },
            currentPage() {

            }
        },
        methods: {
            ...mapActions({
                action_search_requestSearchResult: ACTION_SEARCH_REQUEST_SEARCH_RESULT
            }),
            syncSelectedValue({key,value}) {
                this[key] = value
            },
            async getData(payload) {
                try{
                    this.errorData.errorOccurred = false
                    await this.action_search_requestSearchResult({
                        searchType: this.searchType,
                        page: this.currentPage,
                        ...payload
                    })
                }catch(e){
                    this.errorData = {
                        errorOccurred: true,
                        errorMessage: e.message,
                        reTryCallback: () => this.getData(payload)
                    }
                    console.log(e)
                }
              
            },
            async next(){
                try{
                    this.errorData.errorOccurred = false
                    await this.action_search_requestSearchResult({
                        searchType: this.searchType,
                        changePage:true,
                        forward:true
                    })
                }catch(e){
                    this.errorData = {
                        errorOccurred: true,
                        errorMessage: e.message,
                        reTryCallback: this.next
                    }
                    console.log(e)
                }
            },
            async prev(){
               try{
                    this.errorData.errorOccurred = false
                    await this.action_search_requestSearchResult({
                        searchType: this.searchType,
                        changePage:true,
                        forward:false
                    })
                }catch(e){
                    this.errorData = {
                        errorOccurred: true,
                        errorMessage: e.message,
                        reTryCallback: this.prev
                    }
                    console.log(e)
                }
            }
        },
        components: {
            Selector,
            SimplePagination,
            SearchResultTemplate,
            AnimatedHeightWrapper,
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