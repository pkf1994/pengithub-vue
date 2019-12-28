import {CROSS_MUTATION_TRIGGER_LOADING} from "../crossMutation";
import {STORE_ID} from "../constant";
import {
    MUTATION_SEARCH_RESOLVE_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE,
    MUTATION_SEARCH_RESOLVE_REPOSITORIES_TOPICS,
    MUTATION_SEARCH_RESOLVE_SEARCH_RESULT,
    MUTATION_SEARCH_SYNC_SEARCH_QUERY
} from "./mutationTypes";


export default {
    [MUTATION_SEARCH_SYNC_SEARCH_QUERY](state, payload) {
        state.searchQuery = payload.searchQuery
        state.currentPage = payload.currentPage
    },


    [MUTATION_SEARCH_RESOLVE_SEARCH_RESULT] (state,payload) {
        state.searchResult[payload.searchType].data = payload.data
        state.searchResult[payload.searchType].totalCount = payload.totalCount
        state.searchResult[payload.searchType].pageInfo = payload.pageInfo
    },

    [MUTATION_SEARCH_RESOLVE_REPOSITORIES_TOPICS] (state,payload) {
        state.searchResult.repositories.data.forEach(item => {
            item.topics = payload.data[item.full_name]
        })
    },

    [MUTATION_SEARCH_RESOLVE_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE] (state,payload) {
        state.searchResult.repositories.counts = payload.counts
    },

    [CROSS_MUTATION_TRIGGER_LOADING](state, payload) {
        if(payload.storeId === STORE_ID.SEARCH_REPOSITORIES) {
            state.searchResult.repositories.loading = payload.loading
        }
        else if(payload.storeId === STORE_ID.SEARCH_CODE) {
            state.searchResult.code.loading = payload.loading
        }
        else if(payload.storeId === STORE_ID.SEARCH_COMMITS) {
            state.searchResult.commits.loading = payload.loading
        }
        else if(payload.storeId === STORE_ID.SEARCH_ISSUES) {
            state.searchResult.issues.loading = payload.loading
        }
        else if(payload.storeId === STORE_ID.SEARCH_USERS) {
            state.searchResult.users.loading = payload.loading
        }
        else if(payload.storeId === STORE_ID.SEARCH_TOPICS) {
            state.searchResult.topics.loading = payload.loading
        }
    }
}
