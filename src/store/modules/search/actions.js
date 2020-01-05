import {
    ACTION_SEARCH_REQUEST_SEARCH_RESULT,
    ACTION_SEARCH_REQUEST_REPOSITORIES_ADDITIONAL_DATA,
    ACTION_SEARCH_REQUEST_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE,
    ACTION_SERACH_REQUEST_FIRST_TOPIC,
    ACTION_SEARCH_REQUEST_COUNT_OF_RESULT_GROUP_BY_SEARCH_TYPE,
    ACTION_SEARCH_REQUEST_COUNT_OF_ISSUE_GROUP_BY_LANGUAGE,
    ACTION_SEARCH_REQUEST_TOPICS_ADDITIONAL_DATA,
    ACTION_SEARCH_REQUEST_COUNT_OF_USER_GROUP_BY_LANGUAGE,
    ACTION_SEARCH_REQUEST_USERS_ADDITIONAL_DATA 
} from "./actionTypes";
import {
    commitCancelAndUpdateAxiosCancelTokenSourceMutation,
    commitTriggerLoadingMutation,
    handleException
} from "../util";
import {authRequiredGet, authRequiredGitHubGraphqlApiQuery} from "../network";
import {API_SEARCH} from "../api";
import {
    MUTATION_SEARCH_RESOLVE_COUNT_OF_ISSUE_GROUP_BY_LANGUAGE,
    MUTATION_SEARCH_RESOLVE_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE,
    MUTATION_SEARCH_RESOLVE_COUNT_OF_RESULT_GROUP_BY_SEARCH_TYPE,
    MUTATION_SEARCH_RESOLVE_FIRST_TOPIC,
     MUTATION_SEARCH_RESOLVE_RELATED_TOPICS,
    MUTATION_SEARCH_RESOLVE_REPOSITORIES_TOPICS, 
    MUTATION_SEARCH_RESOLVE_REPOSITORY_COUNT_BY_TOPICS,
    MUTATION_SEARCH_RESOLVE_SEARCH_RESULT, 
    MUTATION_SEARCH_RESOLVE_VIEWER_HAS_STARRED_TOPICS,
    MUTATION_SEARCH_RESOLVE_ADDITIONAL_DATA_OF_USERS,
    MUTATION_SEARCH_RESOLVE_COUNT_OF_USER_GROUP_BY_LANGUAGE
} from "./mutationTypes";
import {
    GRAPHQL_COUNT_GROUP_BY_SEARCH_TYPE, 
    GRAPHQL_COUNT_OF_ISSUE_GROUP_BY_LANGUAGE, 
    GRAPHQL_COUNT_OF_REPOSITORY_BY_TOPICS,
    GRAPHQL_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE, 
    GRAPHQL_RELATIVE_TOPICS_OF_TOPICS,
    GRAPHQL_TOPICS_AND_LANGUAGE_COLOR_AND_HELP_WANTED_ISSUES_COUNT_OF_REPOSITORIES,
    GRAPHQL_NAME_BIO_LOCATION_EMAIL_FOLLOWSHIP_OF_USERS,
    GRAPHQL_COUNT_OF_USER_GROUP_BY_LANGUAGE
} from "./graphql";
import {LANGUAGE_LIST} from "../../../constant/fileType";

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
        console.log(payload)
        try{
            commitCancelAndUpdateAxiosCancelTokenSourceMutation(context,ACTION_SEARCH_REQUEST_SEARCH_RESULT,payload.searchType)
            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_SEARCH_RESULT,true,payload.searchType)
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
                    if(searchSuffix[key] && searchSuffix[key].trim() !== "") {
                        searchQuery = `${searchQuery} ${key}:${searchSuffix[key]}`
                    }
                }
                url = API_SEARCH(payload.searchType,{
                    q: searchQuery,
                    page: currentPage,
                    per_page: perPage,
                }) + (query ? `&${query}` : "")
            }

            const cancelToken =  context.rootState.search.searchResult[payload.searchType].source.token
            let config = {
                cancelToken,
                
                headers: {
                    "Accept": "application/vnd.github.mercy-preview+json," +
                        "application/vnd.github.cloak-preview," +
                        "application/vnd.github.v3.text-match+json"
                }
            }

            //repositories分页内获取各语言的搜索结果数量；获取first topic
            if(payload.searchType === "repositories") {
                if(payload.searchQueryChanged && !payload.changePage) {
                    context.dispatch(ACTION_SEARCH_REQUEST_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE)
                    context.dispatch(ACTION_SERACH_REQUEST_FIRST_TOPIC)
                }
            }
            //issues分页下获取各语言的搜索结果数量
            if(payload.searchType === "issues") {
                if(payload.searchQueryChanged && !payload.changePage) {
                    context.dispatch(ACTION_SEARCH_REQUEST_COUNT_OF_ISSUE_GROUP_BY_LANGUAGE)
                }
            }
            //users分页下获取各语言的搜索结果数量
            if(payload.searchType === "users") {
                if(payload.searchQueryChanged && !payload.changePage) {
                    context.dispatch(ACTION_SEARCH_REQUEST_COUNT_OF_USER_GROUP_BY_LANGUAGE)
                }
            }
            const res = await authRequiredGet(url,config)
           
            const linkParsed = parse(res.headers.link)

            context.commit({
                type: MUTATION_SEARCH_RESOLVE_SEARCH_RESULT,
                searchType: payload.searchType,
                data: res.data.items,
                totalCount: res.data.total_count,
                pageInfo: linkParsed
            })

            //获取各分页的搜索结果数量
          /*   if(payload.getCountGroupBySearchType) {
                context.dispatch({
                    type: ACTION_SEARCH_REQUEST_COUNT_OF_RESULT_GROUP_BY_SEARCH_TYPE,
                    exclude: payload.searchType
                })
            } */

            //repositories分页下获取各搜索结果的其他信息：关联topic、语言、需要协助的issue数量
            if(payload.searchType === "repositories") {
                context.dispatch(ACTION_SEARCH_REQUEST_REPOSITORIES_ADDITIONAL_DATA,res.data.items)
            }

            //topics分页下获取额外信息： 关联topic、从属仓库数量、是否star
            if(payload.searchType === "topics") {
                context.dispatch(ACTION_SEARCH_REQUEST_TOPICS_ADDITIONAL_DATA,res.data.items)
            }

            //users分页下获取额外信息：是否可follow、是否following、地址、邮件地址
            if(payload.searchType === 'users') {
                context.dispatch(ACTION_SEARCH_REQUEST_USERS_ADDITIONAL_DATA,res.data.items)
            }

            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_SEARCH_RESULT,false,payload.searchType)

        }catch (e) {
            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_SEARCH_RESULT,false,payload.searchType)
            handleException(e,{throwNetworkErrorToComponent: true})
        }
    },

    async [ACTION_SEARCH_REQUEST_REPOSITORIES_ADDITIONAL_DATA](context, payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_REPOSITORIES_ADDITIONAL_DATA,true)

            const cancelToken =  context.rootState.search.searchResult.repositories.source.token
            const res = await authRequiredGitHubGraphqlApiQuery(GRAPHQL_TOPICS_AND_LANGUAGE_COLOR_AND_HELP_WANTED_ISSUES_COUNT_OF_REPOSITORIES(payload),{cancelToken})
            const topics = {}
            const languageColors = {}
            const helpWantedIssuesCount = {}
            for(let key in res.data.data) {
                topics[res.data.data[key].nameWithOwner] = res.data.data[key].repositoryTopics.nodes
                languageColors[res.data.data[key].nameWithOwner] = res.data.data[key].languages.nodes[0] && res.data.data[key].languages.nodes
                helpWantedIssuesCount[res.data.data[key].nameWithOwner] = res.data.data[key].issues.totalCount
            }
            context.commit({
                type: MUTATION_SEARCH_RESOLVE_REPOSITORIES_TOPICS,
                data: topics,
                languageColors,
                helpWantedIssuesCount
            })
            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_REPOSITORIES_ADDITIONAL_DATA,false)

        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_REPOSITORIES_ADDITIONAL_DATA,false)

        }
    },

    async [ACTION_SEARCH_REQUEST_TOPICS_ADDITIONAL_DATA](context, payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_TOPICS_ADDITIONAL_DATA,true)

            const cancelToken =  context.rootState.search.searchResult.topics.source.token
            const res = await Promise.all([
                authRequiredGitHubGraphqlApiQuery(GRAPHQL_RELATIVE_TOPICS_OF_TOPICS(payload),{cancelToken}),
                authRequiredGitHubGraphqlApiQuery(GRAPHQL_COUNT_OF_REPOSITORY_BY_TOPICS(payload),{cancelToken})
            ])
            const relatedTopicsData = res[0].data.data
            const repositoryCountData = res[1].data.data
            const relatedTopics = {}
            const repositoryCount = {}
            const viewerHasStarred = {}
            let repositoryCountCursor = {}
            payload.forEach((item,index) => {
                repositoryCountCursor[`topic${index}`] = item.name
            })

            for(let key in relatedTopicsData) {
                relatedTopics[relatedTopicsData[key].name] = relatedTopicsData[key].relatedTopics
                viewerHasStarred[relatedTopicsData[key].name] = relatedTopicsData[key].viewerHasStarred
            }
            for(let key in repositoryCountData) {
                repositoryCount[repositoryCountCursor[key]] = repositoryCountData[key].repositoryCount
            }

            context.commit({
                type: MUTATION_SEARCH_RESOLVE_RELATED_TOPICS,
                data: relatedTopics,
            })
            context.commit({
                type: MUTATION_SEARCH_RESOLVE_REPOSITORY_COUNT_BY_TOPICS,
                data: repositoryCount
            })
            context.commit({
                type: MUTATION_SEARCH_RESOLVE_VIEWER_HAS_STARRED_TOPICS,
                data: viewerHasStarred
            })
            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_TOPICS_ADDITIONAL_DATA,false)

        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_TOPICS_ADDITIONAL_DATA,false)

        }
    },

    async [ACTION_SEARCH_REQUEST_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE] (context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE,true)

            const cancelToken =  context.rootState.search.searchResult.repositories.source.token
            const searchQuery = context.rootState.search.searchQuery
            const res = await authRequiredGitHubGraphqlApiQuery(GRAPHQL_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE(searchQuery),{cancelToken})
            let languageCursor = {}
            LANGUAGE_LIST.forEach((item,index) => {
                languageCursor[`language${index}`] = item.language
            })
            let countOfEachLanguage = []
            for(let key in res.data.data) {
                if(res.data.data[key].repositoryCount > 0 && res.data.data[key].nodes[0].languages.nodes.length > 0) {
                    countOfEachLanguage.push({
                        language: languageCursor[key],
                        count: res.data.data[key].repositoryCount
                    })
                }
            }
            countOfEachLanguage.sort((a,b) => {
                return b.count - a.count
            })
            context.commit({
                type: MUTATION_SEARCH_RESOLVE_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE,
                countOfEachLanguage: countOfEachLanguage.slice(0,10)
            })
            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE,false)

        }catch (e) {
            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE,false)
            handleException(e)
        }

    },

    async [ACTION_SEARCH_REQUEST_COUNT_OF_USER_GROUP_BY_LANGUAGE] (context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_COUNT_OF_USER_GROUP_BY_LANGUAGE,true)

            const cancelToken =  context.rootState.search.searchResult.users.source.token
            const searchQuery = context.rootState.search.searchQuery
            const res = await authRequiredGitHubGraphqlApiQuery(GRAPHQL_COUNT_OF_USER_GROUP_BY_LANGUAGE(searchQuery),{cancelToken})
            let languageCursor = {}
            LANGUAGE_LIST.forEach((item,index) => {
                languageCursor[`language${index}`] = item.language
            })
            let countOfEachLanguage = []
            for(let key in res.data.data) {
                if(res.data.data[key].userCount > 0) {
                    countOfEachLanguage.push({
                        language: languageCursor[key],
                        count: res.data.data[key].userCount
                    })
                }
            }
            countOfEachLanguage.sort((a,b) => {
                return b.count - a.count
            })
            context.commit({
                type: MUTATION_SEARCH_RESOLVE_COUNT_OF_USER_GROUP_BY_LANGUAGE,
                countOfEachLanguage: countOfEachLanguage.slice(0,10)
            })
            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_COUNT_OF_USER_GROUP_BY_LANGUAGE,false)

        }catch (e) {
            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_COUNT_OF_USER_GROUP_BY_LANGUAGE,false)
            handleException(e)
        }

    },

    async [ACTION_SERACH_REQUEST_FIRST_TOPIC] (context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_SERACH_REQUEST_FIRST_TOPIC,true)
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
            commitTriggerLoadingMutation(context,ACTION_SERACH_REQUEST_FIRST_TOPIC,false)
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,ACTION_SERACH_REQUEST_FIRST_TOPIC,false)
        }
    },

    async [ACTION_SEARCH_REQUEST_COUNT_OF_RESULT_GROUP_BY_SEARCH_TYPE] (context, payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_COUNT_OF_RESULT_GROUP_BY_SEARCH_TYPE,true)
            context.commit({
                type: MUTATION_SEARCH_RESOLVE_COUNT_OF_RESULT_GROUP_BY_SEARCH_TYPE,
                repositories: 0,
                users: 0,
                issues:0,
                code: 0,
                commits: 0,
                topics: 0,
            })
            const cancelToken =  context.rootState.search.loadingCountOfEachSearchTypeSource.token
            const searchQuery = context.rootState.search.searchQuery
            const res_graphql = await authRequiredGitHubGraphqlApiQuery(GRAPHQL_COUNT_GROUP_BY_SEARCH_TYPE(searchQuery),{cancelToken})
            const restParam = {
                q: searchQuery,
                page: 1,
                per_page: 1
            }
            const res_rest_arr = await Promise.all([
                authRequiredGet(API_SEARCH("code",restParam),{
                    headers: {"Accept": "application/vnd.github.mercy-preview+json"},
                    cancelToken
                }),
                authRequiredGet(API_SEARCH("commits",restParam),{
                    headers: {"Accept": "application/vnd.github.cloak-preview"},
                    cancelToken
                }),
                authRequiredGet(API_SEARCH("topics",restParam),{
                    headers: {"Accept": "application/vnd.github.mercy-preview+json"},
                    cancelToken
                }),
            ])
            context.commit({
                type: MUTATION_SEARCH_RESOLVE_COUNT_OF_RESULT_GROUP_BY_SEARCH_TYPE,
                repositories: res_graphql.data.data.REPOSITORY.repositoryCount,
                users: res_graphql.data.data.USER.userCount,
                issues: res_graphql.data.data.ISSUE.issueCount,
                code: res_rest_arr[0].data.total_count,
                commits: res_rest_arr[1].data.total_count,
                topics: res_rest_arr[2].data.total_count,
            })

            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_COUNT_OF_RESULT_GROUP_BY_SEARCH_TYPE,false)
        }catch (e) {
            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_COUNT_OF_RESULT_GROUP_BY_SEARCH_TYPE,false)
            handleException(e)
        }
    },

    async [ACTION_SEARCH_REQUEST_COUNT_OF_ISSUE_GROUP_BY_LANGUAGE] (context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_COUNT_OF_ISSUE_GROUP_BY_LANGUAGE,true)

            const cancelToken =  context.rootState.search.searchResult.repositories.source.token
            const searchQuery = context.rootState.search.searchQuery
            const res = await authRequiredGitHubGraphqlApiQuery(GRAPHQL_COUNT_OF_ISSUE_GROUP_BY_LANGUAGE(searchQuery),{cancelToken})
            let languageCursor = {}
            LANGUAGE_LIST.forEach((item,index) => {
                languageCursor[`language${index}`] = item.language
            })
            let countOfEachLanguage = []
            for(let key in res.data.data) {
                if(res.data.data[key].issueCount > 0) {
                    countOfEachLanguage.push({
                        language: languageCursor[key],
                        count: res.data.data[key].issueCount
                    })
                }
            }
            countOfEachLanguage.sort((a,b) => {
                return b.count - a.count
            })
            context.commit({
                type: MUTATION_SEARCH_RESOLVE_COUNT_OF_ISSUE_GROUP_BY_LANGUAGE,
                countOfEachLanguage: countOfEachLanguage.slice(0,10)
            })
            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_COUNT_OF_ISSUE_GROUP_BY_LANGUAGE,false)

        }catch (e) {
            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_COUNT_OF_ISSUE_GROUP_BY_LANGUAGE,false)
            handleException(e)
        }
    },

    async [ACTION_SEARCH_REQUEST_USERS_ADDITIONAL_DATA] (context, payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_USERS_ADDITIONAL_DATA,true)

            const cancelToken =  context.rootState.search.searchResult.users.source.token
            const res = await  authRequiredGitHubGraphqlApiQuery(GRAPHQL_NAME_BIO_LOCATION_EMAIL_FOLLOWSHIP_OF_USERS(payload),{cancelToken})
            const data = res.data.data
            const additionalData = {}

            for(let key in data) {
                additionalData[data[key].login] = {
                    name: data[key].name,
                    bio: data[key].bio,
                    location: data[key].location,
                    email: data[key].email,
                    viewerIsFollowing: data[key].viewerIsFollowing,
                    viewerCanFollow: data[key].viewerCanFollow
                }
            }
            context.commit({
                type: MUTATION_SEARCH_RESOLVE_ADDITIONAL_DATA_OF_USERS,
                data: additionalData
            })
            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_USERS_ADDITIONAL_DATA,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_SEARCH_REQUEST_USERS_ADDITIONAL_DATA,false)
            handleException(e)
        }
    }

}
