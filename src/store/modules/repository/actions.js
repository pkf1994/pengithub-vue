import {
    ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA,
    ACTION_REPOSITORY_REQUEST_BASIC_DATA,
    ACTION_REPOSITORY_REQUEST_ISSUES,
    ACTION_REPOSITORY_REQUEST_PROJECTS_DATA,
    ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA,
    ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_REST,
    ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_GRAPHQL,
    ACTION_REPOSITORY_REQUEST_COMMUNITY_DATA,
    ACTION_REPOSITORY_REQUEST_PULSE_COMMIT_COUNT,
    ACTION_REPOSITORY_REQUEST_README_DATA} from './actionTypes'
import { handleException,commitTriggerLoadingMutation,cancelAndUpdateAxiosCancelTokenSource } from '../util'
import {authRequiredGitHubGraphqlApiQuery, authRequiredGet, authRequiredPost} from '../network'
import { 
    GRAPHQL_REPOSITORY_BASIC_INFO,
    GRAPHQL_REPOSITORY_CODE_BASIC_INFO,
    GRAPHQL_REPOSITORY_PROJECTS,
    GRAPHQL_REPOSITORY_ISSUES } from './graphql'
import {
    MUTATION_REPOSITORY_CODE_RESOLVE_BASIC_INFO,
    MUTATION_REPOSITORY_RESOLVE_CONTRIBUTORS_LIST,
    MUTATION_REPOSITORY_RESOLVE_ISSUES,
    MUTATION_REPOSITORY_RESOLVE_PROJECTS,
    MUTATION_REPOSITORY_RESOLVE_BASIC_DATA,
    MUTATION_REPOSITORY_PULSE_RESOLVE_COMMIT_COUNT,
    MUTATION_REPOSITORY_RESOLVE_PULSE_ISSUES,
    MUTATION_REPOSITORY_RESOLVE_COMMUNITY_DATA,
    MUTATION_REPOSITORY_RESOLVE_README_DATA} from './mutationTypes'
import {API_README,API_REPOSITORY_STATISTIC_CONTRIBUTOR_LIST, API_SEARCH,API_REPOSITORY_COMMUNITY} from '../api'
import {util_dateFormat} from '../../../util'
var parse = require('parse-link-header');
export default {
    async [ACTION_REPOSITORY_REQUEST_BASIC_DATA](context,payload) {
        try{
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_BASIC_DATA)
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_BASIC_DATA,true)
            const res = await authRequiredGitHubGraphqlApiQuery(GRAPHQL_REPOSITORY_BASIC_INFO(payload.owner,payload.repo),{cancelToken})
            context.commit({
                type: MUTATION_REPOSITORY_RESOLVE_BASIC_DATA,
                data: res.data.data.repository
            })
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_BASIC_DATA,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_BASIC_DATA,false)
            handleException(e)
        }
    },

    async [ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA] (context,payload) {
        try{
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA)
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA,true)

            const res = await authRequiredGitHubGraphqlApiQuery(GRAPHQL_REPOSITORY_CODE_BASIC_INFO(payload.owner,payload.repo),{cancelToken})
            context.commit({
                type: MUTATION_REPOSITORY_CODE_RESOLVE_BASIC_INFO,
                data: res.data.data.repository
            })
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA,false)
            handleException(e,{throwNetworkErrorToComponent: true})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_README_DATA] (context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_README_DATA,true)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_README_DATA)
            const config  = {
                cancelToken,
                headers: {
                    "Accept": "application/vnd.github.VERSION.html"
                }
            }
            const res_readme = await authRequiredGet(API_README(payload.owner,payload.repo),config)

            context.commit({
                type: MUTATION_REPOSITORY_RESOLVE_README_DATA,
                data: res_readme.data
            })
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_README_DATA,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_README_DATA,false)
            handleException(e,{throwNetworkErrorToComponent: true})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_ISSUES] (context,payload) {
        payload = {
            changePage: false,
            forward: true,
            issueType: "issue",
            state: "open",
            ...payload
        }
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUES,true, {issueType: payload.issueType,state:payload.state})
            const perPage = context.rootState.repository[payload.issueType][payload.state].perPage
            const after = context.rootState.repository[payload.issueType][payload.state].pageInfo.endCursor
            const before = context.rootState.repository[payload.issueType][payload.state].pageInfo.startCursor
            const login = context.rootState.oauth.viewerInfo.login
            let _payload = {
                issueType: payload.issueType,
                login: login,
                state: payload.state,
                ...payload
            }
            if(!payload.changePage) {
                _payload = {
                    perPage,
                    ..._payload
                }
            }else{
                _payload = payload.forward ? {perPage,after,..._payload} : {perPage,before,..._payload}
            }

            let graphQL = GRAPHQL_REPOSITORY_ISSUES(_payload)
            const res = await authRequiredGitHubGraphqlApiQuery(graphQL)
            let data = res.data.data.search
            context.commit({
                type: MUTATION_REPOSITORY_RESOLVE_ISSUES,
                totalCount: data.issueCount,
                ...payload,
                ...data
            })

            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUES,false,{issueType: payload.issueType,state:payload.state})
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUES,false,{issueType: payload.issueType,state:payload.state})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_PROJECTS_DATA] (context,payload) {
        payload = {
            getMoreData: false,
            ...payload
        }
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PROJECTS_DATA,true,{getMoreData:payload.getMoreData})
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_PROJECTS_DATA)
            const search = context.rootState.repository.projects.searchQuery
            const perPage = context.rootState.repository.projects.perPage
            const after = context.rootState.repository.projects.pageInfo.endCursor

            let _payload = {
                ...payload,
                perPage,
                after,
                search
            }

            const graphQL = GRAPHQL_REPOSITORY_PROJECTS(_payload)
            const res = await authRequiredGitHubGraphqlApiQuery(graphQL,{cancelToken})

            context.commit({
                type: MUTATION_REPOSITORY_RESOLVE_PROJECTS,
                data: res.data.data.repository.projects,
                totalCountOpen: res.data.data.repository.totalCountOpen.totalCount,
                totalCountOpenWithoutSearchQuery: res.data.data.repository.totalCountOpenWithoutSearchQuery.totalCount,
                totalCountClosed: res.data.data.repository.totalCountClosed.totalCount,
                ...payload
            })
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PROJECTS_DATA,false,{getMoreData:payload.getMoreData})
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PROJECTS_DATA,false,{getMoreData:payload.getMoreData})
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA](context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA,true)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA)
            
            const url = API_REPOSITORY_STATISTIC_CONTRIBUTOR_LIST(payload.owner,payload.repo)
            const res = await authRequiredGet(url,{cancelToken})
            context.commit({
                type: MUTATION_REPOSITORY_RESOLVE_CONTRIBUTORS_LIST,
                data: res.data
            })
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA,false)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_PULSE_COMMIT_COUNT](context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_COMMIT_COUNT,true)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_PULSE_COMMIT_COUNT)
            
            let commitAfterDate = new Date(Date.parse(new Date()) - 7 * 24 * 3600000) 
            const url = API_SEARCH('commits',{
                q: `repo:${payload.owner}/${payload.repo} committer-date:>${util_dateFormat.dateFormat('yyyy-MM-dd',commitAfterDate)}`,
            })
            const res = await authRequiredGet(url,{cancelToken,headers:{"Accept":"application/vnd.github.cloak-preview"}})
            
            context.commit({
                type: MUTATION_REPOSITORY_PULSE_RESOLVE_COMMIT_COUNT,
                data: res.data.total_count
            })

            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_COMMIT_COUNT,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_COMMIT_COUNT,false)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_GRAPHQL](context,payload) {
        payload = {
            howLongTrackBack: 'weekly',
            state: 'closed',
            issueType: 'pullRequest',
            getMoreData: false,
            ...payload
        }
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_GRAPHQL,true,payload)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_GRAPHQL)
            const after = context.rootState.repository.pulse.pullsMerged.pageInfo.endCursor
            let dateAfter
            if(payload.howLongTrackBack === 'monthly') {
                dateAfter = util_dateFormat.dateFormat('yyyy-MM-dd',new Date(Date.parse(new Date()) - 30 * 24 * 3600000))
            }else{
                dateAfter = util_dateFormat.dateFormat('yyyy-MM-dd',new Date(Date.parse(new Date()) - 7 * 24 * 3600000)) 
            }

            let _payload
            if(payload.getMoreData) {
                _payload = {
                    after,
                    ...payload
                }
            }else {
                _payload = {
                    ...payload
                }
            }

            let graphQL
            if(payload.state === 'closed') {
                if(payload.issueType === 'pullRequest') {
                    graphQL = GRAPHQL_REPOSITORY_ISSUES({mergedAfter:dateAfter,..._payload})
                }else{
                    graphQL = GRAPHQL_REPOSITORY_ISSUES({closedAfter:dateAfter,..._payload})
                }
            }else{
                graphQL = GRAPHQL_REPOSITORY_ISSUES({createdAfter:dateAfter,..._payload})
            }

            const res = await authRequiredGitHubGraphqlApiQuery(graphQL,{cancelToken})
            context.commit({
                type: MUTATION_REPOSITORY_RESOLVE_PULSE_ISSUES,
                data: res.data.data.search,
                from: 'graphql',
                ...payload
            })

            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_GRAPHQL,false,payload)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_GRAPHQL,false,payload)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_REST](context,payload) {
        payload = {
            howLongTrackBack: 'weekly',
            state: 'closed',
            issueType: 'pullRequest',
            getMoreData: false,
            ...payload
        }
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_REST,true,payload)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_REST + payload.meta)
            const perPage = context.rootState.repository.pulse[payload.meta].perPage
            let dateAfter
            if(payload.howLongTrackBack === 'monthly') {
                dateAfter = util_dateFormat.dateFormat('yyyy-MM-dd',new Date(Date.parse(new Date()) - 30 * 24 * 3600000))
            }else{
                dateAfter = util_dateFormat.dateFormat('yyyy-MM-dd',new Date(Date.parse(new Date()) - 7 * 24 * 3600000)) 
            }
            

            let url
            if(payload.getMoreData) {
                url = context.rootState.repository.pulse[payload.meta].pageInfo.next.url
            }else{
                let dateLimitQueryFragment 
                if(payload.issueType === 'pullRequest') {
                    if(payload.state === 'closed') {
                        dateLimitQueryFragment = `merged:>${dateAfter}`
                    }else{
                        dateLimitQueryFragment = `created:>${dateAfter}`
                    }
                }else{
                    if(payload.state === 'closed') {
                        dateLimitQueryFragment = `closed:>${dateAfter}`
                    }else{
                        dateLimitQueryFragment = `created:>${dateAfter}`
                    }
                }
                url = API_SEARCH('issues',{
                    q:`repo:${payload.owner}/${payload.repo} type:${payload.issueType === 'issue' ? 'issue' : 'pr'} state:${payload.state} ${dateLimitQueryFragment}`,
                    per_page: perPage
                })

            }

            const res = await authRequiredGet(url,{cancelToken})
            const linkParsed = parse(res.headers.link)
            context.commit({
                type: MUTATION_REPOSITORY_RESOLVE_PULSE_ISSUES,
                data: res.data,
                pageInfo: linkParsed,
                from: 'rest',
                ...payload
            })

            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_REST,false,payload)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_REST,false,payload)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_COMMUNITY_DATA](context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_COMMUNITY_DATA,true)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_COMMUNITY_DATA)
            
          
            const url = API_REPOSITORY_COMMUNITY(payload.owner,payload.repo)
            const res = await authRequiredGet(url,{cancelToken,headers:{"Accept":"application/vnd.github.black-panther-preview+json"}})
            
            context.commit({
                type: MUTATION_REPOSITORY_RESOLVE_COMMUNITY_DATA,
                data: res.data
            })

            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_COMMUNITY_DATA,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_COMMUNITY_DATA,false)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    },
}