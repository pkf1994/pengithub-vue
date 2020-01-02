import {
    CROSS_MUTATION_CANCEL_AND_UPDATE_AXIOS_CANCEL_TOKEN_SOURCE,
    CROSS_MUTATION_TRIGGER_LOADING
} from "../crossMutation";
import {
    MUTATION_SEARCH_RESOLVE_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE,
    MUTATION_SEARCH_RESOLVE_REPOSITORIES_TOPICS,
    MUTATION_SEARCH_RESOLVE_SEARCH_RESULT,
    MUTATION_SEARCH_SYNC_SEARCH_QUERY,
    MUTATION_SEARCH_SYNC_SEARCH_SUFFIX,
    MUTATION_SEARCH_SYNC_QUERY,
    MUTATION_SEARCH_RESOLVE_FIRST_TOPIC,
    MUTATION_SEARCH_RESOLVE_COUNT_OF_RESULT_GROUP_BY_SEARCH_TYPE
} from "./mutationTypes";
import axios from "axios";

import Vue from 'vue'
import {
    ACTION_SEARCH_REQUEST_COUNT_OF_RESULT_GROUP_BY_SEARCH_TYPE,
    ACTION_SEARCH_REQUEST_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE,
    ACTION_SEARCH_REQUEST_REPOSITORIES_TOPICS_AND_LANGUAGE_COLOR_AND_HELP_WANTED_ISSUES_COUNT,
    ACTION_SEARCH_REQUEST_SEARCH_RESULT, ACTION_SERACH_REQUEST_FIRST_TOPIC
} from "./actionTypes";
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
        state.searchResult.repositories.countOfEachLanguage = payload.countOfEachLanguage
    },

    [MUTATION_SEARCH_RESOLVE_FIRST_TOPIC] (state,payload) {
        state.searchResult.repositories.firstTopic = payload.data
    },

    [MUTATION_SEARCH_RESOLVE_COUNT_OF_RESULT_GROUP_BY_SEARCH_TYPE] (state,payload) {
        let searchTypeList = [
            'repositories',
            'code',
            'users',
            'commits',
            'issues',
            'topics'
        ]
        searchTypeList.forEach(item => {
            if(item !== payload.exclude) {
                state.searchResult[item].totalCount = payload[item]
            }
        })
    },

    [CROSS_MUTATION_CANCEL_AND_UPDATE_AXIOS_CANCEL_TOKEN_SOURCE] (state,payload) {
        if(payload.actionType === ACTION_SEARCH_REQUEST_SEARCH_RESULT) {
            state.searchResult[payload.meta].source.cancel()
            state.searchResult[payload.meta].source = axios.CancelToken.source()
        }
    },

    [CROSS_MUTATION_TRIGGER_LOADING](state, payload) {
        if(payload.actionType === ACTION_SEARCH_REQUEST_SEARCH_RESULT) {
            state.searchResult[payload.meta].loading = payload.loading
        }
        else if(payload.actionType === ACTION_SEARCH_REQUEST_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE) {
            state.searchResult.repositories.loadingCountOfEachLanguage = payload.loading
        }
        else if(payload.actionType === ACTION_SEARCH_REQUEST_REPOSITORIES_TOPICS_AND_LANGUAGE_COLOR_AND_HELP_WANTED_ISSUES_COUNT) {
            state.searchResult.repositories.loadingTopicsLanguageColorHelpWantedIssuesCount = payload.loading
        }
        else if(payload.actionType === ACTION_SERACH_REQUEST_FIRST_TOPIC) {
            state.searchResult.repositories.loadingFirstTopic = payload.loading
        }
        else if(payload.actionType === ACTION_SEARCH_REQUEST_COUNT_OF_RESULT_GROUP_BY_SEARCH_TYPE) {
            state.loadingCountOfEachSearchType = payload.loading
        }
    }
}
