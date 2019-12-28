<template>
    <component :is="currentComponent"></component>
</template>

<script>
    import styled from 'vue-styled-components'
    import SearchPage from "./SearchPage";
    import SearchResult from "./SearchResult/SearchResult";
    import {mapMutations} from "vuex";
    import {MUTATION_SEARCH_SYNC_SEARCH_QUERY} from "../../store/modules/search/mutationTypes";
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
                    this.mutation_search_syncSearchQuery({
                        searchQuery: this.searchQuery,
                        currentPage: this.currentPage
                    })
                    return 'SearchResult'
                }
                return 'SearchPage'
            }
        },
        methods: {
            ...mapMutations({
                mutation_search_syncSearchQuery: MUTATION_SEARCH_SYNC_SEARCH_QUERY,
            }),
        },
        components: {
            SearchPage,
            SearchResult
        }
    }
</script>

<style scoped>

</style>