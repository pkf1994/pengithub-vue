import {
    DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE,
    DEFAULT_REST_PAGINATIONAL_DATA_STATE
} from "../constant";

export default {
    notifications: DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE(),
    dashboard: {
        loading: false,
        repositoriesContributedTo: [],
        starredRepositories: [],
        events: [],
        organizations: []
    },
    pullRequests: DEFAULT_REST_PAGINATIONAL_DATA_STATE(),
    issues: DEFAULT_REST_PAGINATIONAL_DATA_STATE(),
}
