<template>
    <component :is="currentComponent"></component>
</template>

<script>
    import styled from 'vue-styled-components'
    import SearchPage from "./SearchIndexPage";
    import SearchResult from "./SearchResult/SearchResult";
    export default {
        provide() {
            return {
                query: () => this.query
            }
        },
        computed: {
            query: function() {
                return this.$route.query.q
            },
            currentComponent: function () {
                if(this.query && this.query.trim() !== "") {
                    return 'SearchResult'
                }
                return 'SearchPage'
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