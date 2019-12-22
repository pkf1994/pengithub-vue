import {commitTriggerLoadingMutation, handleException} from "../util";
import {authRequiredGet, authRequiredGitHubGraphqlApiQuery, commonGet} from "../network";
import {STORE_ID} from "../constant";
import {
    ACTION_HOME_REQUEST_DASHBOARD_DATA,
    ACTION_HOME_REQUEST_NOTIFICATIONS_DATA,
    ACTION_HOME_REQUEST_PULL_REQUESTS_CREATED
} from "./actionTypes";
import {
    MUTATION_HOME_RESOLVE_DASHBOARD_DATA,
    MUTATION_HOME_RESOLVE_NOTIFICATIONS_DATA,
    MUTATION_HOME_RESOLVE_PR_CREATED
} from "./mutationTypes";
import {GRAPH_QL_DASHBOARD, GRAPH_QL_VIEWER_PULL_REQUEST_CREATED} from "./graphql";
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

            const login = context.rootState.oauth.login
            //recent activity (partially)
            const url_events = API_USER_EVENTS(login)
            const res_events = await authRequiredGet(url_events)
            const filterredEvents = filterRecentActivityEvents(res_events.data)

            //repos contribute to and starred repos
            const res_dashboard = await authRequiredGitHubGraphqlApiQuery(GRAPH_QL_DASHBOARD(login))
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

    async [ACTION_HOME_REQUEST_PULL_REQUESTS_CREATED](context, payload) {
        try{
            commitTriggerLoadingMutation(context,STORE_ID.HOME_PULL_REQUESTS_CREATED,true)

            const res = await authRequiredGitHubGraphqlApiQuery(GRAPH_QL_VIEWER_PULL_REQUEST_CREATED)
            const pullRequestsList = res.data.data.viewer.pullRequests.nodes

            context.commit({
                type: MUTATION_HOME_RESOLVE_PR_CREATED,
                data: pullRequestsList
            })

            commitTriggerLoadingMutation(context,STORE_ID.HOME_PULL_REQUESTS_CREATED,false)
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,STORE_ID.HOME_PULL_REQUESTS_CREATED,false)
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

