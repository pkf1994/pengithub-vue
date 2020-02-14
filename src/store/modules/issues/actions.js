import {commitTriggerLoadingMutation, handleException, cancelAndUpdateAxiosCancelTokenSource} from "../util";
import {authRequiredGet, authRequiredGitHubGraphqlApiQuery} from "../network";
import {
    ACTION_ISSUES_REQUEST_ISSUES,
    ACTION_ISSUES_REQUEST_ISSUES_ADDITIONAL_DATA,
    ACTION_ISSUES_REQUEST_COUNT_OF_ISSUE_BY_STATE,
} from "./actionTypes";
import {
    MUTATION_ISSUES_RESOLVE_ISSUES,
    MUTATION_ISSUES_RESOLVE_ISSUES_ADDITIONAL_DATA,
    MUTATION_ISSUES_RESOLVE_COUNT_OF_ISSUE_BY_STATE 
} from "./mutationTypes";
import {
    GRAPHQL_GET_ISSUES_BY_REPO_AND_NUMBERS,
    GRAPHQL_COUNT_OF_ISSUE_BY_STATE
} from "./graphql";
import {
    
    API_SEARCH
} from "../api";
var parse = require('parse-link-header');


export const actions = {
    async [ACTION_ISSUES_REQUEST_ISSUES] (context,payload) {
        payload = {
            changePage: false,
            forward: true,
            issueType: "issue",
            ...payload
        }
        try{
            commitTriggerLoadingMutation(context,ACTION_ISSUES_REQUEST_ISSUES,true,payload)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_ISSUES_REQUEST_ISSUES)
            const perPage = context.rootState.issues[payload.belongTo][payload.issueType].perPage
            const pageInfo = context.rootState.issues[payload.belongTo][payload.issueType].pageInfo
           
            let url
            if(payload.changePage) {
                if(payload.forward) {
                    url = pageInfo.next.url
                } else {
                    url = pageInfo.prev.url
                }
            }else{
                url = API_SEARCH(
                    'issues',
                    {
                        q: payload.q,
                        per_page: perPage
                    }
                )
            }

            const res = await authRequiredGet(url,{cancelToken})
            let _pageInfo = parse(res.headers.link)
            
            context.commit({
                type: MUTATION_ISSUES_RESOLVE_ISSUES,
                totalCount: res.data.total_count,
                data: res.data.items,
                pageInfo: _pageInfo,
                ...payload,
            })

            if(!payload.changePage) {
                context.dispatch({
                    ...payload,
                    type: ACTION_ISSUES_REQUEST_COUNT_OF_ISSUE_BY_STATE,
                    issues: res.data.items
                })
            }

            if(res.data.items.length > 0) {
                context.dispatch({
                    ...payload,
                    type: ACTION_ISSUES_REQUEST_ISSUES_ADDITIONAL_DATA,
                    issues: res.data.items
                })
            }

            commitTriggerLoadingMutation(context,ACTION_ISSUES_REQUEST_ISSUES,false,payload)
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,ACTION_ISSUES_REQUEST_ISSUES,false,payload)
        }
    },

    async [ACTION_ISSUES_REQUEST_ISSUES_ADDITIONAL_DATA] (context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_ISSUES_REQUEST_ISSUES_ADDITIONAL_DATA,true,payload)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_ISSUES_REQUEST_ISSUES_ADDITIONAL_DATA)
            
            let graphql = GRAPHQL_GET_ISSUES_BY_REPO_AND_NUMBERS({
                ...payload,
                issueType: payload.issueType === 'pr' ? 'pullRequest' : payload.issueType
            })
        
            const res = await authRequiredGitHubGraphqlApiQuery(graphql,{cancelToken})

            let issueArr = []
            for(let key in res.data.data){
                issueArr.push(res.data.data[key][payload.issueType === 'pr' ? 'pullRequest' : payload.issueType])
            }
            context.commit({
                data: issueArr,
                ...payload,
                type: MUTATION_ISSUES_RESOLVE_ISSUES_ADDITIONAL_DATA,
            })

            commitTriggerLoadingMutation(context,ACTION_ISSUES_REQUEST_ISSUES_ADDITIONAL_DATA,false,payload)
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,ACTION_ISSUES_REQUEST_ISSUES_ADDITIONAL_DATA,false,payload)
        }
    },

    async [ACTION_ISSUES_REQUEST_COUNT_OF_ISSUE_BY_STATE] (context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_ISSUES_REQUEST_COUNT_OF_ISSUE_BY_STATE,true,payload)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_ISSUES_REQUEST_COUNT_OF_ISSUE_BY_STATE)

            let graphql = GRAPHQL_COUNT_OF_ISSUE_BY_STATE(payload)
            const res = await authRequiredGitHubGraphqlApiQuery(graphql,{cancelToken})
            context.commit({
                ...payload,
                type: MUTATION_ISSUES_RESOLVE_COUNT_OF_ISSUE_BY_STATE,
                data: res.data.data
            })

            commitTriggerLoadingMutation(context,ACTION_ISSUES_REQUEST_COUNT_OF_ISSUE_BY_STATE,false,payload)
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,ACTION_ISSUES_REQUEST_COUNT_OF_ISSUE_BY_STATE,false,payload)
        }
    },

    //deprecated
  /*   async [ACTION_HOME_REQUEST_ISSUES] (context,payload) {
        payload = {
            changePage: false,
            forward: true,
            issueType: "issue",
            meta: "created",
            ...payload
        }
        try{
            commitTriggerLoadingMutation(context,ACTION_HOME_REQUEST_ISSUES,true, {issueType: payload.issueType,meta:payload.meta})
            const perPage = context.rootState.home[payload.issueType][payload.meta].perPage
            const after = context.rootState.home[payload.issueType][payload.meta].pageInfo.endCursor
            const before = context.rootState.home[payload.issueType][payload.meta].pageInfo.startCursor
            const login = context.rootState.oauth.viewerInfo.login
            let _payload
            if(!payload.changePage) {
                _payload = {
                    ...payload,
                    perPage,
                    login
                }
            }else{
                _payload = payload.forward ? {perPage,login,after,...payload,} : {perPage,login,before,...payload,}
            }

            let url = GRAPHQL_VIEWER_ISSUES(_payload)

            const res = await authRequiredGitHubGraphqlApiQuery(url)
            let data
            data = res.data.data.search
            context.commit({
                type: MUTATION_HOME_RESOLVE_ISSUES,
                totalCount: data.issueCount,
                ...payload,
                ...data
            })

            commitTriggerLoadingMutation(context,ACTION_HOME_REQUEST_ISSUES,false,{issueType: payload.issueType,meta:payload.meta})
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,ACTION_HOME_REQUEST_ISSUES,false,{issueType: payload.issueType,meta:payload.meta})
        }
    }
 */
}



function filterRecentActivityEvents(events) {

    const recentActivityEventsClub = [
        "IssueCommentEvent",
        "IssuesEvent",
        "PullRequestEvent",
    ]

    let recentActivityEvents = []
    events.forEach(item => {
        if(recentActivityEventsClub.indexOf(item.type) !== -1) {
            recentActivityEvents.push(item)
        }
    })

    return recentActivityEvents
}

