export const STORE_ID = {
    OAUTH_ACCESS_TOKEN: 'oauth_accessToken',
    OAUTH_VIEWER_INFO: 'oauth_viewerInfo',
    HOME_DASHBOARD: 'home_dashboard',
    HOME_PULL_REQUESTS_CREATED: 'home_pullRequestsCreated',
    HOME_PULL_REQUESTS_ASSIGNED: 'home_pullRequestsAssigned',
    HOME_PULL_REQUESTS_MENTIONED: 'home_pullRequestsMentioned',
    HOME_ISSUES_CREATED: 'home_issuesCreated',
    HOME_ISSUES_ASSIGNED: 'home_issuesAssigned',
    HOME_ISSUES_MENTIONED: 'home_issuesMentioned',
    HOME_ISSUES: 'home_issues',
    HOME_NOTIFICATIONS: 'home_notifications'
}

export const DEFAULT_PAGINATIONAL_DATA_STATE = (payload) => {
    payload = {
        perPage: 8,
        ...payload
    }
    return {
        nodes: [],
        totalCount: 0,
        perPage: payload.perPage,
        currentPage: 0,
        loading: false,
        pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: undefined,
            endCursor: undefined
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