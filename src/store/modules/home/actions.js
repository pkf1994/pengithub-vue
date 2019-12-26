import {commitTriggerLoadingMutation, handleException} from "../util";
import {authRequiredGet, authRequiredGitHubGraphqlApiQuery, commonGet} from "../network";
import {STORE_ID} from "../constant";
import {
    ACTION_HOME_REQUEST_DASHBOARD_DATA,
    ACTION_HOME_REQUEST_ISSUES_ASSIGNED,
    ACTION_HOME_REQUEST_ISSUES_CREATED,
    ACTION_HOME_REQUEST_ISSUES_MENTIONED,
    ACTION_HOME_REQUEST_NOTIFICATIONS_DATA,
    ACTION_HOME_REQUEST_PULL_REQUESTS_ASSIGNED,
    ACTION_HOME_REQUEST_PULL_REQUESTS_CREATED,
    ACTION_HOME_REQUEST_PULL_REQUESTS_MENTIONED
} from "./actionTypes";
import {
    MUTATION_HOME_RESOLVE_DASHBOARD_DATA,
    MUTATION_HOME_RESOLVE_ISSUES_ASSIGNED,
    MUTATION_HOME_RESOLVE_ISSUES_CREATED,
    MUTATION_HOME_RESOLVE_ISSUES_MENTIONED,
    MUTATION_HOME_RESOLVE_NOTIFICATIONS_DATA,
    MUTATION_HOME_RESOLVE_PR_ASSIGNED,
    MUTATION_HOME_RESOLVE_PR_CREATED,
    MUTATION_HOME_RESOLVE_PR_MENTIONED
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

    async [ACTION_HOME_REQUEST_PULL_REQUESTS_CREATED] (context, payload) {
        payload = {
            forward: true,
                ...payload
        }
        try{
            commitTriggerLoadingMutation(context,STORE_ID.HOME_PULL_REQUESTS_CREATED,true)

            const perPage = context.rootState.home.pullRequests.created.perPage
            const after = context.rootState.home.pullRequests.created.pageInfo.endCursor
            const before = context.rootState.home.pullRequests.created.pageInfo.startCursor
            const res = await authRequiredGitHubGraphqlApiQuery(GRAPHQL_VIEWER_PULL_REQUEST_CREATED(payload.forward ? {perPage,after} : {perPage,before}))

            context.commit({
                type: MUTATION_HOME_RESOLVE_PR_CREATED,
                ...payload,
                ...res.data.data.viewer.pullRequests
            })

            commitTriggerLoadingMutation(context,STORE_ID.HOME_PULL_REQUESTS_CREATED,false)
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,STORE_ID.HOME_PULL_REQUESTS_CREATED,false)
        }
    },

    async [ACTION_HOME_REQUEST_PULL_REQUESTS_ASSIGNED] (context,payload) {
        payload = {
            forward: true,
            ...payload
        }
        try{
            commitTriggerLoadingMutation(context, STORE_ID.HOME_PULL_REQUESTS_ASSIGNED,true)

            const perPage = context.rootState.home.pullRequests.assigned.perPage
            const after = context.rootState.home.pullRequests.assigned.pageInfo.endCursor
            const before = context.rootState.home.pullRequests.assigned.pageInfo.startCursor
            const login = context.rootState.oauth.viewerInfo.login
            const res = await authRequiredGitHubGraphqlApiQuery(GRAPHQL_VIEWER_PR_ASSIGNED(payload.forward ? {perPage,login,after} : {perPage,login,before}))

            context.commit({
                type: MUTATION_HOME_RESOLVE_PR_ASSIGNED,
                ...res.data.data.search,
                ...payload,
            })

            commitTriggerLoadingMutation(context, STORE_ID.HOME_PULL_REQUESTS_ASSIGNED,false)
        }catch (e) {
            commitTriggerLoadingMutation(context, STORE_ID.HOME_PULL_REQUESTS_ASSIGNED,false)
            handleException(e)
        }
    },

    async [ACTION_HOME_REQUEST_PULL_REQUESTS_MENTIONED] (context,payload) {
        payload = {
            forward: true,
            ...payload
        }
        try{
            commitTriggerLoadingMutation(context, STORE_ID.HOME_PULL_REQUESTS_MENTIONED,true)

            const perPage = context.rootState.home.pullRequests.mentioned.perPage
            const after = context.rootState.home.pullRequests.mentioned.pageInfo.endCursor
            const before = context.rootState.home.pullRequests.mentioned.pageInfo.startCursor
            const login = context.rootState.oauth.viewerInfo.login
            const res = await authRequiredGitHubGraphqlApiQuery(GRAPHQL_VIEWER_PR_MENTIONED(payload.forward ? {login,perPage,after} : {login,perPage,before}))

            context.commit({
                type: MUTATION_HOME_RESOLVE_PR_MENTIONED,
                ...res.data.data.search,
                ...payload,
            })

            commitTriggerLoadingMutation(context, STORE_ID.HOME_PULL_REQUESTS_MENTIONED,false)
        }catch (e) {
            commitTriggerLoadingMutation(context, STORE_ID.HOME_PULL_REQUESTS_MENTIONED,false)
            handleException(e)
        }
    },

    async [ACTION_HOME_REQUEST_ISSUES_CREATED] (context, payload) {
        payload = {
            forward: true,
            ...payload
        }
        try{
            commitTriggerLoadingMutation(context,STORE_ID.HOME_ISSUES_CREATED,true)

            const perPage = context.rootState.home.issues.created.perPage
            const after = context.rootState.home.issues.created.pageInfo.endCursor
            const before = context.rootState.home.issues.created.pageInfo.startCursor
            const res = await authRequiredGitHubGraphqlApiQuery(GRAPHQL_VIEWER_ISSUES_CREATED(payload.forward ? {perPage,after} : {perPage,before}))
            context.commit({
                type: MUTATION_HOME_RESOLVE_ISSUES_CREATED,
                ...res.data.data.viewer.issues,
                ...payload,
            })

            commitTriggerLoadingMutation(context,STORE_ID.HOME_ISSUES_CREATED,false)
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,STORE_ID.HOME_ISSUES_CREATED,false)
        }
    },

    async [ACTION_HOME_REQUEST_ISSUES_ASSIGNED] (context,payload) {
        payload = {
            forward: true,
            ...payload
        }
        try{
            commitTriggerLoadingMutation(context, STORE_ID.HOME_ISSUES_ASSIGNED,true)

            const perPage = context.rootState.home.issues.assigned.perPage
            const after = context.rootState.home.issues.assigned.pageInfo.endCursor
            const before = context.rootState.home.issues.assigned.pageInfo.startCursor
            const login = context.rootState.oauth.viewerInfo.login
            const res = await authRequiredGitHubGraphqlApiQuery(GRAPHQL_VIEWER_ISSUES_ASSIGNED(payload.forward ? {perPage,after,login} : {perPage,before,login}))

            context.commit({
                type: MUTATION_HOME_RESOLVE_ISSUES_ASSIGNED,
                ...res.data.data.search,
                ...payload,
            })

            commitTriggerLoadingMutation(context, STORE_ID.HOME_ISSUES_ASSIGNED,false)
        }catch (e) {
            commitTriggerLoadingMutation(context, STORE_ID.HOME_ISSUES_ASSIGNED,false)
            handleException(e)
        }
    },

    async [ACTION_HOME_REQUEST_ISSUES_MENTIONED] (context,payload) {
        payload = {
            forward: true,
            ...payload
        }
        try{
            commitTriggerLoadingMutation(context, STORE_ID.HOME_ISSUES_MENTIONED,true)

            const perPage = context.rootState.home.issues.mentioned.perPage
            const after = context.rootState.home.issues.mentioned.pageInfo.endCursor
            const before = context.rootState.home.issues.mentioned.pageInfo.startCursor
            const login = context.rootState.oauth.viewerInfo.login
            const res = await authRequiredGitHubGraphqlApiQuery(GRAPHQL_VIEWER_ISSUES_MENTIONED(payload.forward ? {perPage,login,after} : {perPage,login,before}))

            context.commit({
                type: MUTATION_HOME_RESOLVE_ISSUES_MENTIONED,
                ...res.data.data.search,
                ...payload,
            })

            commitTriggerLoadingMutation(context, STORE_ID.HOME_ISSUES_MENTIONED,false)
        }catch (e) {
            commitTriggerLoadingMutation(context, STORE_ID.HOME_ISSUES_MENTIONED,false)
            handleException(e)
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

