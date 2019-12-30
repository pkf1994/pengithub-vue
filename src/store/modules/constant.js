import axios from "axios";

export const STORE_ID = {
    OAUTH_ACCESS_TOKEN: 'oauth_accessToken',
    OAUTH_VIEWER_INFO: 'oauth_viewerInfo',
    HOME_DASHBOARD: 'home_dashboard',
    HOME_PULL_REQUESTS_CREATED: 'home_pullRequest_created',
    HOME_PULL_REQUESTS_ASSIGNED: 'home_pullRequest_assigned',
    HOME_PULL_REQUESTS_MENTIONED: 'home_pullRequest_mentioned',
    HOME_ISSUES_CREATED: 'home_issue_created',
    HOME_ISSUES_ASSIGNED: 'home_issue_assigned',
    HOME_ISSUES_MENTIONED: 'home_issue_mentioned',
    HOME_ISSUES: 'home_issues',
    HOME_NOTIFICATIONS: 'home_notifications',
    SEARCH_REPOSITORIES: 'search_repositories',
    SEARCH_REPOSITORIES_COUNT: 'search_repositories_count',
    SEARCH_REPOSITORIES_FIRST_TOPIC: 'search_repositories_firstTopic',
    SEARCH_REPOSITORIES_TOPICS_LANGUAGE_COLOR_HELP_WANTED_ISSUES_COUNT: "search_repositories_topics_languageColor_helpWantedIssuesCount",
    SEARCH_CODE: 'search_code',
    SEARCH_ISSUES: 'search_issues',
    SEARCH_COMMITS: 'search_commits',
    SEARCH_TOPICS: 'search_topics',
    SEARCH_USERS: 'search_users',
}

export const GRAPHQL_DEFAULT_PAGINATIONAL_DATA_STATE = (payload) => {
    payload = {
        perPage: 8,
        ...payload
    }
    return {
        nodes: [],
        totalCount: 0,
        perPage: payload.perPage,
        currentPage: 1,
        loading: false,
        pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: undefined,
            endCursor: undefined
        }
    }
}

export const REST_DEFAULT_PAGINATIONAL_DATA_STATE = (payload) => {
    payload = {
        perPage: 8,
        ...payload
    }
    return {
        source: axios.CancelToken.source(),
        data: [],
        totalCount: 0,
        perPage: payload.perPage,
        currentPage: 0,
        loading: false,
        pageInfo: {
            next: undefined,
            last: undefined,
            first: undefined,
            prev: undefined
        }
    }
}

export const GRAPHQL_FRAGMENT_PAGEINFO = `
    pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
         }
`