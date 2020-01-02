<template>

</template>

<script>
    import styled from 'vue-styled-components'
    import {ACTION_SEARCH_REQUEST_SEARCH_RESULT} from "../../../../store/modules/search/actionTypes";
    import {mapActions, mapMutations, mapState} from "vuex";
    import {SimplePagination,AnimatedHeightFlagWrapper,CommonLoadingWrapper} from '../../../../components'
    import {Selector} from './../components'
    import {
        MUTATION_SEARCH_SYNC_QUERY,
        MUTATION_SEARCH_SYNC_SEARCH_SUFFIX
    } from "../../../../store/modules/search/mutationTypes";
    export default {
        data() {
            return {
                selectValueArray: {
                    sort: "",
                    language: ""
                },
                sort: "",
                language: "",
                state: "",
                searchType: "repositories",
                needToGetDataWhenActivated: false
            }
        },
        computed: {
            ...mapState({
                loadingCountOfEachSearchType: state => state.search.loadingCountOfEachSearchType,
                searchQuery: state => state.search.searchQuery,
            })
        },
        created() {
            this.getData({
                searchQueryChanged: true
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
            sort(newOne,oldOne) {
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
                if(this.$route.path === `/search/${this.searchType}`) {
                    this.getData({
                        searchQueryChanged: true
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
            getData(payload) {
                this.action_search_requestSearchResult({
                    searchType: this.searchType,
                        ...payload
                })
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
            AnimatedHeightLoadingWrapper: AnimatedHeightFlagWrapper,
            CommonLoadingWrapper,
            Container: styled.div``,
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