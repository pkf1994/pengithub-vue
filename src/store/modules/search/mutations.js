import {
    CROSS_MUTATION_TRIGGER_LOADING
} from "../crossMutation";
import {
    MUTATION_SEARCH_RESOLVE_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE,
    MUTATION_SEARCH_RESOLVE_REPOSITORIES_TOPICS,
    MUTATION_SEARCH_RESOLVE_SEARCH_RESULT,
    MUTATION_SEARCH_SYNC_SEARCH_QUERY,
    MUTATION_SEARCH_RESOLVE_FIRST_TOPIC,
    MUTATION_SEARCH_RESOLVE_COUNT_OF_RESULT_GROUP_BY_SEARCH_TYPE,
    MUTATION_SEARCH_RESOLVE_COUNT_OF_ISSUE_GROUP_BY_LANGUAGE,
    MUTATION_SEARCH_RESOLVE_REPOSITORY_COUNT_BY_TOPICS,
    MUTATION_SEARCH_RESOLVE_RELATED_TOPICS, 
    MUTATION_SEARCH_RESOLVE_VIEWER_HAS_STARRED_TOPICS,
    MUTATION_SEARCH_RESOLVE_COUNT_OF_USER_GROUP_BY_LANGUAGE,
    MUTATION_SEARCH_RESOLVE_ADDITIONAL_DATA_OF_USERS
} from "./mutationTypes";
import axios from "axios";

import Vue from 'vue'
import {
    ACTION_SEARCH_REQUEST_COUNT_OF_RESULT_GROUP_BY_SEARCH_TYPE,
    ACTION_SEARCH_REQUEST_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE,
    ACTION_SEARCH_REQUEST_REPOSITORIES_ADDITIONAL_DATA,
    ACTION_SEARCH_REQUEST_SEARCH_RESULT,
    ACTION_SERACH_REQUEST_FIRST_TOPIC,
    ACTION_SEARCH_REQUEST_COUNT_OF_ISSUE_GROUP_BY_LANGUAGE, 
    ACTION_SEARCH_REQUEST_TOPICS_ADDITIONAL_DATA,
    ACTION_SEARCH_REQUEST_USERS_ADDITIONAL_DATA, 
    ACTION_SEARCH_REQUEST_COUNT_OF_USER_GROUP_BY_LANGUAGE
} from "./actionTypes";
export default {
    [MUTATION_SEARCH_SYNC_SEARCH_QUERY](state, payload) {
        state.searchQuery = payload.searchQuery
        state.currentPage = payload.currentPage
    },

    [MUTATION_SEARCH_RESOLVE_SEARCH_RESULT] (state,payload) {
        state.searchResult[payload.searchType].data = payload.data
        state.searchResult[payload.searchType].totalCount = payload.totalCount
        state.searchResult[payload.searchType].pageInfo = payload.pageInfo || {}
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

    [MUTATION_SEARCH_RESOLVE_COUNT_OF_USER_GROUP_BY_LANGUAGE] (state,payload) {
        state.searchResult.users.countOfEachLanguage = payload.countOfEachLanguage
    },


    [MUTATION_SEARCH_RESOLVE_COUNT_OF_ISSUE_GROUP_BY_LANGUAGE] (state, payload) {
        state.searchResult.issues.countOfEachLanguage = payload.countOfEachLanguage
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


    [MUTATION_SEARCH_RESOLVE_REPOSITORY_COUNT_BY_TOPICS] (state,payload) {
        state.searchResult.topics.data.forEach((item,index) => {
            Vue.set(state.searchResult.topics.data,index, Object.assign({},item,{
                repositoryCount: payload.data[item.name]
            }))
        })
    },

    [MUTATION_SEARCH_RESOLVE_RELATED_TOPICS](state,payload) {
        state.searchResult.topics.data.forEach((item,index) => {
            Vue.set(state.searchResult.topics.data,index, Object.assign({},item,{
                relatedTopics: payload.data[item.name],
            }))
        })
    },

    [MUTATION_SEARCH_RESOLVE_ADDITIONAL_DATA_OF_USERS](state, payload) {
        state.searchResult.users.data.forEach((item,index) => {
            Vue.set(state.searchResult.users.data, index, Object.assign({},item,{
                ...payload.data[item.login],
            }))
        })
    },

    [MUTATION_SEARCH_RESOLVE_COUNT_OF_USER_GROUP_BY_LANGUAGE](state,payload) {
        state.searchResult.users.countOfEachLanguage = payload.countOfEachLanguage
    },

    [MUTATION_SEARCH_RESOLVE_VIEWER_HAS_STARRED_TOPICS](state,payload) {
        state.searchResult.topics.data.forEach((item,index) => {
            Vue.set(state.searchResult.topics.data,index, Object.assign({},item,{
                viewerHasStarred: payload.data[item.name],
            }))
        })
    },

    [CROSS_MUTATION_TRIGGER_LOADING](state, payload) {
        if(payload.actionType === ACTION_SEARCH_REQUEST_SEARCH_RESULT) {
            state.searchResult[payload.meta].loading = payload.loading
        }
        else if(payload.actionType === ACTION_SEARCH_REQUEST_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE) {
            state.searchResult.repositories.loadingCountOfEachLanguage = payload.loading
        }
        else if(payload.actionType === ACTION_SEARCH_REQUEST_COUNT_OF_USER_GROUP_BY_LANGUAGE) {
            state.searchResult.users.loadingCountOfEachLanguage = payload.loading
        }
        else if(payload.actionType === ACTION_SEARCH_REQUEST_REPOSITORIES_ADDITIONAL_DATA) {
            state.searchResult.repositories.loadingAdditionalData = payload.loading
        }
        else if(payload.actionType === ACTION_SEARCH_REQUEST_USERS_ADDITIONAL_DATA) {
            state.searchResult.users.loadingAdditionalData = payload.loading
        }
        else if(payload.actionType === ACTION_SEARCH_REQUEST_TOPICS_ADDITIONAL_DATA) {
            state.searchResult.topics.loadingAdditionalData = payload.loading
        }
        else if(payload.actionType === ACTION_SERACH_REQUEST_FIRST_TOPIC) {
            state.searchResult.repositories.loadingFirstTopic = payload.loading
        }
        else if(payload.actionType === ACTION_SEARCH_REQUEST_COUNT_OF_RESULT_GROUP_BY_SEARCH_TYPE) {
            state.loadingCountOfEachSearchType = payload.loading
        }
        else if(payload.actionType === ACTION_SEARCH_REQUEST_COUNT_OF_ISSUE_GROUP_BY_LANGUAGE) {
            state.searchResult.issues.loadingCountOfEachLanguage = payload.loading
        }
        else if(payload.actionType === ACTION_SEARCH_REQUEST_TOPICS_ADDITIONAL_DATA) {
            state.searchResult.topics.loadingAdditionalData = payload.loading
        }
    }
}
