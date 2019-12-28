<template>
    <Container>
        <Selector :syncSelectedValue="syncLanguageSelectedValue" :options="counts"  label="Language">
            <option v-for="item in counts"
                    :value="item.language"
                    :key="item.language">{{item.language}}</option>
        </Selector>

        <Selector :syncSelectedValue="syncSortSelectedValue" label="Sort">
            <option value="">Best match</option>
            <option value="o=desc&s=stars">Most stars</option>
            <option value="o=asc&s=stars">Fewest stars</option>
            <option value="o=desc&s=forks">Most forks</option>
            <option value="o=asc&s=forks">Fewest forks</option>
            <option value="o=desc&s=updated">Recently updated</option>
            <option value="o=asc&s=updated">Least recently updated</option>
        </Selector>

        <ResultContent class="pt-3 px-3">
            <Title class="pb-3 border-bottom">{{totalCount}} repository results</Title>
        </ResultContent>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ACTION_SEARCH_REQUEST_SEARCH_RESULT} from "../../../store/modules/search/actionTypes";
    import {mapActions, mapState} from "vuex";
    import {Selector} from './components'
    import {util_numberFormat} from '../../../util'
    export default {
        data() {
            return {
                sort: "",
                language: ""
            }
        },
        created() {
            this.action_search_requestSearchResult({
                searchType: 'repositories',
            })
        },
        computed: {
            ...mapState({
                totalCount: state => util_numberFormat.thousands(state.search.searchResult.repositories.totalCount),
                loading: state => state.search.searchResult.repositories.loading,
                data: state => state.search.searchResult.repositories.data,
                counts: state => state.search.searchResult.repositories.counts
            })
        },
        watch: {

        },
        methods: {
            ...mapActions({
                action_search_requestSearchResult: ACTION_SEARCH_REQUEST_SEARCH_RESULT
            }),
            syncSortSelectedValue(newOne) {
                this.sort = newOne
            },
            syncLanguageSelectedValue(newOne) {
                this.language = newOne
            }
        },
        components: {
            Selector,
            Container: styled.div``,
            LanguageSelector: styled.div``,
            SortSelector: styled.div``,
            ResultContent: styled.div``,
            Title: styled.h3``
        }
    }
</script>

<style scoped>

</style>