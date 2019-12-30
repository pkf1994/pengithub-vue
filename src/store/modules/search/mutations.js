import {
    CROSS_MUTATION_CANCEL_AND_UPDATE_AXIOS_CANCEL_TOKEN_SOURCE,
    CROSS_MUTATION_TRIGGER_LOADING
} from "../crossMutation";
import {STORE_ID} from "../constant";
import {
    MUTATION_SEARCH_RESOLVE_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE,
    MUTATION_SEARCH_RESOLVE_REPOSITORIES_TOPICS,
    MUTATION_SEARCH_RESOLVE_SEARCH_RESULT,
    MUTATION_SEARCH_SYNC_SEARCH_QUERY,
    MUTATION_SEARCH_SYNC_SEARCH_SUFFIX,
    MUTATION_SEARCH_SYNC_QUERY, MUTATION_SEARCH_RESOLVE_FIRST_TOPIC
} from "./mutationTypes";
import axios from "axios";

import Vue from 'vue'
export default {
    [MUTATION_SEARCH_SYNC_SEARCH_QUERY](state, payload) {
        state.searchQuery = payload.searchQuery
        state.currentPage = payload.currentPage
    },

    [MUTATION_SEARCH_SYNC_SEARCH_SUFFIX](state,payload) {
        state.searchResult[payload.searchType].searchSuffix[payload.key] = payload.value
    },

    [MUTATION_SEARCH_SYNC_QUERY](state,payload) {
        state.searchResult[payload.searchType].query = payload.query
    },

    [MUTATION_SEARCH_RESOLVE_SEARCH_RESULT] (state,payload) {
        state.searchResult[payload.searchType].data = payload.data
        state.searchResult[payload.searchType].totalCount = payload.totalCount
        state.searchResult[payload.searchType].pageInfo = payload.pageInfo
    },

    [MUTATION_SEARCH_RESOLVE_REPOSITORIES_TOPICS] (state,payload) {
        state.searchResult.repositories.data.forEach((item,index) => {

            Vue.set(state.searchResult.repositories.data,index, Object.assign({},item,{
                topics: payload.data[item.full_name],
                languageColor: payload.languageColors[item.full_name],
                helpWantedIssuesCount: payload.helpWantedIssuesCount[item.full_name]
            }))
        })
    },

    [MUTATION_SEARCH_RESOLVE_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE] (state,payload) {
        state.searchResult.repositories.counts = payload.counts
    },

    [MUTATION_SEARCH_RESOLVE_FIRST_TOPIC] (state,payload) {
        state.searchResult.repositories.firstTopic = payload.data
    },

    [CROSS_MUTATION_CANCEL_AND_UPDATE_AXIOS_CANCEL_TOKEN_SOURCE] (state,payload) {
        if(payload.storeId === STORE_ID.SEARCH_REPOSITORIES) {
            state.search.searchResult[payload.searchType].source.cancel()
            state.search.searchResult[payload.searchType].source = axios.CancelToken.source()
        }
    },

    [CROSS_MUTATION_TRIGGER_LOADING](state, payload) {
        if(payload.storeId === STORE_ID.SEARCH_REPOSITORIES) {
            state.searchResult.repositories.loading = payload.loading
        }
        else if(payload.storeId === STORE_ID.SEARCH_REPOSITORIES_COUNT) {
            state.searchResult.repositories.loadingCount = payload.loading
        }
        else if(payload.storeId === STORE_ID.SEARCH_REPOSITORIES_TOPICS_LANGUAGE_COLOR_HELP_WANTED_ISSUES_COUNT) {
            state.searchResult.repositories.loadingTopicsLanguageColorHelpWantedIssuesCount = payload.loading
        }
        else if(payload.storeId === STORE_ID.SEARCH_REPOSITORIES_FIRST_TOPIC) {
            state.searchResult.repositories.loadingFirstTopic = payload.loading
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
