import {
    ACTION_SEARCH_REQUEST_SEARCH_RESULT,
    ACTION_SEARCH_REQUEST_REPOSITORIES_TOPICS,
    ACTION_SEARCH_REQUEST_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE
} from "./actionTypes";
import {commitTriggerLoadingMutation, handleException} from "../util";
import {STORE_ID} from "../constant";
import {authRequiredGet, authRequiredGitHubGraphqlApiQuery} from "../network";
import {API_SEARCH} from "../api";
import {
    MUTATION_SEARCH_RESOLVE_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE,
    MUTATION_SEARCH_RESOLVE_REPOSITORIES_TOPICS,
    MUTATION_SEARCH_RESOLVE_SEARCH_RESULT
} from "./mutationTypes";
import {
    GRAPHQL_COUNT_OF_REPOSITORIES_GROUP_BY_LANGUAGE,
    GRAPHQL_TOPICS_OF_REPOSITORIES,
    LANGUAGE_LIST
} from "./graphql";
var parse = require('parse-link-header');

export const actions = {
    async [ACTION_SEARCH_REQUEST_SEARCH_RESULT](context, payload) {
        payload = {
            searchType: 'repositories',
            changePage: false,
            forward: true,
            ...payload
        }
        try{
            commitTriggerLoadingMutation(context,`search_${payload.searchType}`,true)
            let url
            if(payload.changePage) {
                if(payload.forward) {
                    url = context.rootState.search.searchResult[payload.searchType].pageInfo.next
                } else {
                    url = context.rootState.search.searchResult[payload.searchType].pageInfo.prev
                }
            } else {
                const currentPage = context.rootState.search.searchResult[payload.searchType].currentPage
                let searchQuery = context.rootState.search.searchQuery
                const perPage = context.rootState.search.searchResult[payload.searchType].perPage
                const searchSuffix = context.rootState.search.searchResult[payload.searchType].searchSuffix
                const query = context.rootState.search.searchResult[payload.searchType].query
                for(let key in searchSuffix) {
                    searchQuery = `${searchQuery} ${key}:${searchSuffix[key]}`
                }
                url = API_SEARCH(payload.searchType,{
                    q: searchQuery,
                    page: currentPage,
                    per_page: perPage,
                    ...query
                })
            }
            const res = await authRequiredGet(url)
            const linkParsed = parse(res.headers.link)

            context.commit({
                type: MUTATION_SEARCH_RESOLVE_SEARCH_RESULT,
                searchType: payload.searchType,
                data: res.data.items,
                totalCount: res.data.total_count,
                pageInfo: linkParsed
            })

            if(payload.searchType === "repositories") {
               await Promise.all([
                   context.dispatch(ACTION_SEARCH_REQUEST_REPOSITORIES_TOPICS,res.data.items),
                   context.dispatch(ACTION_SEARCH_REQUEST_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE,context.rootState.search.searchQuery)
               ])
            }
            commitTriggerLoadingMutation(context,`search_${payload.searchType}`,false)
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,`search_${payload.searchType}`,false)
        }
    },

    async [ACTION_SEARCH_REQUEST_REPOSITORIES_TOPICS](context,payload) {
        const res = await authRequiredGitHubGraphqlApiQuery(GRAPHQL_TOPICS_OF_REPOSITORIES(payload))
        const topics = {}
        for(let key in res.data.data) {
            topics[res.data.data[key].nameWithOwner] = res.data.data[key].repositoryTopics.nodes
        }
        context.commit({
            type: MUTATION_SEARCH_RESOLVE_REPOSITORIES_TOPICS,
            data: topics
        })
    },

    async [ACTION_SEARCH_REQUEST_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE] (context,payload) {
        const res = await authRequiredGitHubGraphqlApiQuery(GRAPHQL_COUNT_OF_REPOSITORIES_GROUP_BY_LANGUAGE(payload))
        let languageCursor = {}
        LANGUAGE_LIST.forEach((item,index) => {
            languageCursor[`language${index}`] = item
        })
        let counts = []
        for(let key in res.data.data) {
            if(res.data.data[key].repositoryCount > 0 && res.data.data[key].nodes[0].languages.nodes.length > 0) {
                counts.push({
                    language: languageCursor[key],
                    count: res.data.data[key].repositoryCount
                })
            }
        }
        counts.sort((a,b) => {
            return b.count - a.count
        })
        context.commit({
            type: MUTATION_SEARCH_RESOLVE_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE,
            counts: counts.slice(0,10)
        })
    }
}
