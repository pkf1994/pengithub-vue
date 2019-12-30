import {commitTriggerLoadingMutation, handleException} from "../util";
import {authRequiredGet, authRequiredGitHubGraphqlApiQuery, commonGet} from "../network";
import {STORE_ID} from "../constant";
import {
    ACTION_HOME_REQUEST_DASHBOARD_DATA,
    ACTION_HOME_REQUEST_ISSUES,
    ACTION_HOME_REQUEST_NOTIFICATIONS_DATA
} from "./actionTypes";
import {
    MUTATION_HOME_RESOLVE_DASHBOARD_DATA,
    MUTATION_HOME_RESOLVE_ISSUES,
    MUTATION_HOME_RESOLVE_NOTIFICATIONS_DATA,
} from "./mutationTypes";
import {
    GRAPHQL_DASHBOARD,
    GRAPHQL_VIEWER_ISSUES_ASSIGNED,
    GRAPHQL_VIEWER_ISSUES_CREATED,
    GRAPHQL_VIEWER_ISSUES_MENTIONED,
    GRAPHQL_VIEWER_PR_ASSIGNED,
    GRAPHQL_VIEWER_PR_MENTIONED,
    GRAPHQL_VIEWER_PULL_REQUEST_CREATED
} from "./graphql";
import {
    API_OAUTH2_USER_INFO,
    API_USER_EVENTS,
    API_USER_NOTIFICATIONS,
    API_USER_ORG_EVENTS,
    API_USER_RECEIVED_EVENTS
} from "../api";


export const actions = {
    async [ACTION_HOME_REQUEST_NOTIFICATIONS_DATA] (context,payload) {
        try{
            commitTriggerLoadingMutation(context,STORE_ID.HOME_NOTIFICATIONS,true)
            //notifications
            const res= await authRequiredGet(API_USER_NOTIFICATIONS)
            context.commit({
                type: MUTATION_HOME_RESOLVE_NOTIFICATIONS_DATA,
                notifications: res.data,
            })
            commitTriggerLoadingMutation(context,STORE_ID.HOME_NOTIFICATIONS,false)
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,STORE_ID.HOME_NOTIFICATIONS,false)
        }
    },

    async [ACTION_HOME_REQUEST_DASHBOARD_DATA] (context, payload) {
        try{
            commitTriggerLoadingMutation(context,STORE_ID.HOME_DASHBOARD,true)

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
            console.log(organizations)

            context.commit({
                type: MUTATION_HOME_RESOLVE_DASHBOARD_DATA,
                repositoriesContributedTo: repositoriesContributedTo,
                starredRepositories: starredRepositories,
                organizations: organizations,
                events: filterredEvents.slice(0,4),
            })
            commitTriggerLoadingMutation(context,STORE_ID.HOME_DASHBOARD,false)
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,STORE_ID.HOME_DASHBOARD,false)
        }
    },

    async [ACTION_HOME_REQUEST_ISSUES] (context,payload) {
        payload = {
            changePage: false,
            forward: true,
            issueType: "issue",
            meta: "created",
            ...payload
        }
        const storeId = 'home_' + payload.issueType + '_' + payload.meta
        try{
            commitTriggerLoadingMutation(context,storeId,true)
            const perPage = context.rootState.home[payload.issueType][payload.meta].perPage
            const after = context.rootState.home[payload.issueType][payload.meta].pageInfo.endCursor
            const before = context.rootState.home[payload.issueType][payload.meta].pageInfo.startCursor
            const login = context.rootState.oauth.viewerInfo.login
            let _payload
            if(!payload.changePage) {
                _payload = {
                    perPage,login
                }
            }else{
                _payload = payload.forward ? {perPage,login,after} : {perPage,login,before}
            }

            let url
            if(payload.issueType === "pullRequest") {
               switch (payload.meta) {
                   case "created":
                       url = GRAPHQL_VIEWER_PULL_REQUEST_CREATED(_payload)
                       break
                   case "assigned":
                       url = GRAPHQL_VIEWER_PR_ASSIGNED(_payload)
                       break
                   default:
                       url = GRAPHQL_VIEWER_PR_MENTIONED(_payload)
               }
            }else{
                switch (payload.meta) {
                    case "created":
                        url = GRAPHQL_VIEWER_ISSUES_CREATED(_payload)
                        break
                    case "assigned":
                        url = GRAPHQL_VIEWER_ISSUES_ASSIGNED(_payload)
                        break
                    default:
                        url = GRAPHQL_VIEWER_ISSUES_MENTIONED(_payload)
                }
            }

            const res = await authRequiredGitHubGraphqlApiQuery(url)
            let data
            if(payload.meta === "created") {
                data = res.data.data.viewer[`${payload.issueType}s`]
            }else{
                data = res.data.data.search
            }
            context.commit({
                type: MUTATION_HOME_RESOLVE_ISSUES,
                ...payload,
                ...data
            })

            commitTriggerLoadingMutation(context,storeId,false)
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,storeId,false)
        }
    }

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

