import {commitTriggerLoadingMutation, handleException, cancelAndUpdateAxiosCancelTokenSource} from "../util";
import {authRequiredGet, authRequiredGitHubGraphqlApiQuery, commonGet} from "../network";
import {
    ACTION_HOME_REQUEST_DASHBOARD_DATA,
    ACTION_HOME_REQUEST_NOTIFICATIONS_DATA,
} from "./actionTypes";
import {
    MUTATION_HOME_RESOLVE_DASHBOARD_DATA,
    MUTATION_HOME_RESOLVE_NOTIFICATIONS_DATA,
} from "./mutationTypes";
import {
    GRAPHQL_DASHBOARD,
} from "./graphql";
import {
    API_USER_EVENTS,
    API_USER_NOTIFICATIONS,
} from "../api";

export const actions = {
    async [ACTION_HOME_REQUEST_NOTIFICATIONS_DATA] (context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_HOME_REQUEST_NOTIFICATIONS_DATA,true)
            //notifications
            const res= await authRequiredGet(API_USER_NOTIFICATIONS)
            context.commit({
                type: MUTATION_HOME_RESOLVE_NOTIFICATIONS_DATA,
                notifications: res.data,
            })
            commitTriggerLoadingMutation(context,ACTION_HOME_REQUEST_NOTIFICATIONS_DATA,false)

        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,ACTION_HOME_REQUEST_NOTIFICATIONS_DATA,false)

        }
    },

    async [ACTION_HOME_REQUEST_DASHBOARD_DATA] (context, payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_HOME_REQUEST_DASHBOARD_DATA,true)

            const login = context.rootState.oauth.viewerInfo.login
            //recent activity (partially)
            const url_events = API_USER_EVENTS(login)
            const res_events = await authRequiredGet(url_events)
            const filterredEvents = filterRecentActivityEvents(res_events.data)

            //repos contribute to and starred repos
            const res_dashboard = await authRequiredGitHubGraphqlApiQuery(GRAPHQL_DASHBOARD(login))
            const repositoriesContributedTo = res_dashboard.data.data.viewer.topRepositories.nodes
            const starredRepositories = res_dashboard.data.data.viewer.starredRepositories.nodes

            //organizations
            const organizations = res_dashboard.data.data.viewer.organizations.nodes

            context.commit({
                type: MUTATION_HOME_RESOLVE_DASHBOARD_DATA,
                repositoriesContributedTo: repositoriesContributedTo,
                starredRepositories: starredRepositories,
                organizations: organizations,
                events: filterredEvents.slice(0,4),
            })
            commitTriggerLoadingMutation(context,ACTION_HOME_REQUEST_DASHBOARD_DATA,false)
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,ACTION_HOME_REQUEST_DASHBOARD_DATA,false)
        }
    },

    /* async [ACTION_HOME_REQUEST_ISSUES] (context,payload) {
        payload = {
            changePage: false,
            forward: true,
            issueType: "issue",
            ...payload
        }
        try{
            commitTriggerLoadingMutation(context,ACTION_HOME_REQUEST_ISSUES,true,payload)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_HOME_REQUEST_ISSUES)
            const perPage = context.rootState.home[`${payload.issueType}s`].perPage
            const pageInfo = context.rootState.home[`${payload.issueType}s`].pageInfo
           
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
                type: MUTATION_HOME_RESOLVE_ISSUES,
                totalCount: res.data.total_count,
                data: res.data.items,
                pageInfo: _pageInfo,
                ...payload,
            })

            context.dispatch({
                ...payload,
                type: ACTION_HOME_REQUEST_ISSUES_ADDITIONAL_DATA,
                issues: res.data.items
            })

            commitTriggerLoadingMutation(context,ACTION_HOME_REQUEST_ISSUES,false,payload)
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,ACTION_HOME_REQUEST_ISSUES,false,payload)
        }
    },

    async [ACTION_HOME_REQUEST_ISSUES_ADDITIONAL_DATA] (context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_HOME_REQUEST_ISSUES_ADDITIONAL_DATA,true,payload)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_HOME_REQUEST_ISSUES_ADDITIONAL_DATA)
            
            let graphql = GRAPHQL_HOME
            
            context.commit({
                type: MUTATION_HOME_RESOLVE_ISSUES,
                totalCount: res.data.total_count,
                data: res.data.items,
                pageInfo: _pageInfo,
                ...payload,
            })

           

            commitTriggerLoadingMutation(context,ACTION_HOME_REQUEST_ISSUES_ADDITIONAL_DATA,false,payload)
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,ACTION_HOME_REQUEST_ISSUES_ADDITIONAL_DATA,false,payload)
        }
    }, */

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

