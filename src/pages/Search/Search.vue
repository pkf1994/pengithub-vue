<template>
    <component :is="currentComponent"></component>
</template>

<script>
    import styled from 'vue-styled-components'
    import SearchPage from "./SearchIndexPage";
    import SearchResult from "./SearchResult/SearchResult";
    import {mapMutations,mapActions} from "vuex";
    import {MUTATION_SEARCH_SYNC_SEARCH_QUERY} from "../../store/modules/search/mutationTypes";
    import {ACTION_SEARCH_REQUEST_COUNT_OF_RESULT_GROUP_BY_SEARCH_TYPE} from "../../store/modules/search/actionTypes";
    export default {
        computed: {
            searchQuery: function() {
                return this.$route.query.q
            },
            
            currentComponent: function () {
                if(this.searchQuery && this.searchQuery.trim() !== "") {
                    return 'SearchResult'
                }
                return 'SearchPage'
            }
        },  
        created() {
             if(this.searchQuery && this.searchQuery.trim() !== "") {
                this.syncSearchQuery()
                this.action_search_requestCountGroupBySearchType()
                }
            },
        watch: {
            searchQuery() {
                 this.syncSearchQuery()
                 this.action_search_requestCountGroupBySearchType()
            },
           
        },
        methods: {
            ...mapActions({
                action_search_requestCountGroupBySearchType: ACTION_SEARCH_REQUEST_COUNT_OF_RESULT_GROUP_BY_SEARCH_TYPE
            }),
            ...mapMutations({
                mutation_search_syncSearchQuery: MUTATION_SEARCH_SYNC_SEARCH_QUERY,
            }),
            syncSearchQuery() {
                if(this.searchQuery && this.searchQuery.trim() !== "") {
                    this.mutation_search_syncSearchQuery({
                        searchQuery: this.searchQuery
                    })
                }
            }
        },
        components: {
            SearchPage,
            SearchResult
        }
    }
</script>

<style scoped>

</style>