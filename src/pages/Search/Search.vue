<template>
    <component :is="currentComponent"></component>
</template>

<script>
    import styled from 'vue-styled-components'
    import SearchPage from "./SearchPage";
    import SearchResult from "./SearchResult/SearchResult";
    import {mapMutations,mapActions} from "vuex";
    import {MUTATION_SEARCH_SYNC_SEARCH_QUERY} from "../../store/modules/search/mutationTypes";
    import {ACTION_SEARCH_REQUEST_COUNT_OF_RESULT_GROUP_BY_SEARCH_TYPE} from "../../store/modules/search/actionTypes";
    export default {
        computed: {
            searchQuery: function() {
                return this.$route.query.q
            },
            currentPage: function() {
                return this.$route.query.p ? this.$route.query.p : 1
            },
            currentComponent: function () {
                if(this.searchQuery && this.searchQuery.trim() !== "") {
                    return 'SearchResult'
                }
                return 'SearchPage'
            }
        },  
        created() {
            this.syncSearchQuery()
             this.action_search_requestCountGroupBySearchType()
        },
        watch: {
            currentComponent() {
                 this.syncSearchQuery()
                 this.action_search_requestCountGroupBySearchType()
            },
            searchQuery() {
                 this.syncSearchQuery()
                 this.action_search_requestCountGroupBySearchType()
            }
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
                        searchQuery: this.searchQuery,
                        currentPage: this.currentPage
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