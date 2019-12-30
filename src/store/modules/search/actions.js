import {
    ACTION_SEARCH_REQUEST_SEARCH_RESULT,
    ACTION_SEARCH_REQUEST_REPOSITORIES_TOPICS_AND_LANGUAGE_COLOR_AND_HELP_WANTED_ISSUES_COUNT,
    ACTION_SEARCH_REQUEST_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE, ACTION_SERACH_REQUEST_FIRST_TOPIC
} from "./actionTypes";
import {
    commitCancelAndUpdateAxiosCancelTokenSourceMutation,
    commitTriggerLoadingMutation,
    handleException
} from "../util";
import {STORE_ID} from "../constant";
import {authRequiredGet, authRequiredGitHubGraphqlApiQuery} from "../network";
import {API_SEARCH} from "../api";
import {
    MUTATION_SEARCH_RESOLVE_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE, MUTATION_SEARCH_RESOLVE_FIRST_TOPIC,
    MUTATION_SEARCH_RESOLVE_REPOSITORIES_TOPICS,
    MUTATION_SEARCH_RESOLVE_SEARCH_RESULT
} from "./mutationTypes";
import {
    GRAPHQL_COUNT_OF_REPOSITORIES_GROUP_BY_LANGUAGE,
    GRAPHQL_TOPICS_AND_LANGUAGE_COLOR_AND_HELP_WANTED_ISSUES_COUNT_OF_REPOSITORIES,
    LANGUAGE_LIST
} from "./graphql";
var parse = require('parse-link-header');

export const actions = {
    async [ACTION_SEARCH_REQUEST_SEARCH_RESULT](context, payload) {
        payload = {
            searchType: 'repositories',
            changePage: false,
            forward: true,
            searchQueryChanged: true,
            ...payload
        }
        try{

            commitCancelAndUpdateAxiosCancelTokenSourceMutation(context,STORE_ID.SEARCH_REPOSITORIES)
            commitTriggerLoadingMutation(context,`search_${payload.searchType}`,true)
            let url
            if(payload.changePage) {
                if(payload.forward) {
                    url = context.rootState.search.searchResult[payload.searchType].pageInfo.next.url
                } else {
                    url = context.rootState.search.searchResult[payload.searchType].pageInfo.prev.url
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
                }) + (query ? `&${query}` : "")
            }

            const cancelToken =  context.rootState.search.searchResult[payload.searchType].source.token
            const res = await authRequiredGet(url,{cancelToken})
            const linkParsed = parse(res.headers.link)

            context.commit({
                type: MUTATION_SEARCH_RESOLVE_SEARCH_RESULT,
                searchType: payload.searchType,
                data: res.data.items,
                totalCount: res.data.total_count,
                pageInfo: linkParsed
            })

            if(payload.searchType === "repositories") {
                if(payload.searchQueryChanged && !payload.changePage) {
                    context.dispatch(ACTION_SEARCH_REQUEST_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE)
                    context.dispatch(ACTION_SERACH_REQUEST_FIRST_TOPIC)
                }
                context.dispatch(ACTION_SEARCH_REQUEST_REPOSITORIES_TOPICS_AND_LANGUAGE_COLOR_AND_HELP_WANTED_ISSUES_COUNT,res.data.items)
            }

            commitTriggerLoadingMutation(context,`search_${payload.searchType}`,false)
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,`search_${payload.searchType}`,false)
        }
    },

    async [ACTION_SEARCH_REQUEST_REPOSITORIES_TOPICS_AND_LANGUAGE_COLOR_AND_HELP_WANTED_ISSUES_COUNT](context, payload) {
        try{
            commitTriggerLoadingMutation(context,STORE_ID.SEARCH_REPOSITORIES_TOPICS_LANGUAGE_COLOR_HELP_WANTED_ISSUES_COUNT,true)
            const cancelToken =  context.rootState.search.searchResult.repositories.source.token
            const res = await authRequiredGitHubGraphqlApiQuery(GRAPHQL_TOPICS_AND_LANGUAGE_COLOR_AND_HELP_WANTED_ISSUES_COUNT_OF_REPOSITORIES(payload),{cancelToken})
            const topics = {}
            const languageColors = {}
            const helpWantedIssuesCount = {}
            for(let key in res.data.data) {
                topics[res.data.data[key].nameWithOwner] = res.data.data[key].repositoryTopics.nodes
                languageColors[res.data.data[key].nameWithOwner] = res.data.data[key].languages.nodes[0] && res.data.data[key].languages.nodes[0].color
                helpWantedIssuesCount[res.data.data[key].nameWithOwner] = res.data.data[key].issues.totalCount
            }
            context.commit({
                type: MUTATION_SEARCH_RESOLVE_REPOSITORIES_TOPICS,
                data: topics,
                languageColors,
                helpWantedIssuesCount
            })
            commitTriggerLoadingMutation(context,STORE_ID.SEARCH_REPOSITORIES_TOPICS_LANGUAGE_COLOR_HELP_WANTED_ISSUES_COUNT,false)
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,STORE_ID.SEARCH_REPOSITORIES_TOPICS_LANGUAGE_COLOR_HELP_WANTED_ISSUES_COUNT,false)
        }
    },

    async [ACTION_SEARCH_REQUEST_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE] (context,payload) {
        try{
            commitTriggerLoadingMutation(context,STORE_ID.SEARCH_REPOSITORIES_COUNT,true)
            const cancelToken =  context.rootState.search.searchResult.repositories.source.token
            const searchQuery = context.rootState.search.searchQuery
            const res = await authRequiredGitHubGraphqlApiQuery(GRAPHQL_COUNT_OF_REPOSITORIES_GROUP_BY_LANGUAGE(searchQuery),{cancelToken})
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
            commitTriggerLoadingMutation(context,STORE_ID.SEARCH_REPOSITORIES_COUNT,false)
        }catch (e) {
            commitTriggerLoadingMutation(context,STORE_ID.SEARCH_REPOSITORIES_COUNT,false)
            handleException(e)
        }

    },

    async [ACTION_SERACH_REQUEST_FIRST_TOPIC] (context,payload) {
        try{
            commitTriggerLoadingMutation(context,STORE_ID.SEARCH_REPOSITORIES_FIRST_TOPIC,true)
            const cancelToken =  context.rootState.search.searchResult.repositories.source.token
            const searchQuery = context.rootState.search.searchQuery
            const url = API_SEARCH(
                "topics",
                {q:`is:curated is:featured ${searchQuery} `, per_page:1,page:1}
            )
            const res = await authRequiredGet(
                url,
            {
                    headers: {"Accept": "application/vnd.github.mercy-preview+json"},
                    cancelToken
                }
            )
            if(res.data.total_count > 0) {
                const url_firstTopicAvatar = API_SEARCH(
                    "repositories",
                    {q: searchQuery, per_page:1,page:1}
                )
                const res_firstTopicAvatar = await authRequiredGet(url_firstTopicAvatar,{cancelToken})
                context.commit({
                    type: MUTATION_SEARCH_RESOLVE_FIRST_TOPIC,
                    data: {
                        avatar: res_firstTopicAvatar.data.items[0].owner.avatar_url,
                        ...res.data.items[0]
                    }
                })
            }
            commitTriggerLoadingMutation(context,STORE_ID.SEARCH_REPOSITORIES_FIRST_TOPIC,false)
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,STORE_ID.SEARCH_REPOSITORIES_FIRST_TOPIC,false)
        }
    }
}
