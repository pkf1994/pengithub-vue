import {DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE,
    DEFAULT_REST_PAGINATIONAL_DATA_STATE} from "../constant";

export default {
    basic: {
        data: {},
        loading: false
    },
    code: {
        loading: false,
        data: {},
        readme: {
            data: undefined,
            loading: false
        },
        codeFileBrowser: {
            loading: false,
            data: [],
            path: '',
            countOfCommits: {
                data: 0,
                loading: false
            }
        }
    },
    projects: {
        loadingMore: false,
        searchQuery: '',
        totalCountOpen: 0,
        totalCountClosed: 0,
        ...DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE()
    },
    issue: {
        open: DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE(),
        closed: DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE(),
        yours: DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE()
    },
    pullRequest: {
        open: DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE(),
        closed: DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE(),
        yours: DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE()
    },
    pulse: {
        codeChanges: {
            data: [],
            loading: false,
            commitCount: {
                data: 0,
                loading: false
            },
        },
        pullsMerged: {
            issueCount: 0,
            loadingMore: false,
            ...DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE()
        },
        pullsProposed: {
            loadingMore: false,
            ...DEFAULT_REST_PAGINATIONAL_DATA_STATE()
        },
        issuesClosed: {
            issueCount: 0,
            loadingMore: false,
            ...DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE()
        },
        issuesOpened: {
            loadingMore: false,
            ...DEFAULT_REST_PAGINATIONAL_DATA_STATE()
        }
    },
    community: {
        data: {},
        loading: false
    }
}