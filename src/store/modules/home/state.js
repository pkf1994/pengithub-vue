import {GRAPHQL_DEFAULT_PAGINATIONAL_DATA_STATE} from "../constant";

export default {
    notifications: GRAPHQL_DEFAULT_PAGINATIONAL_DATA_STATE(),
    dashboard: {
        loading: false,
        repositoriesContributedTo: [],
        starredRepositories: [],
        events: [],
        organizations: []
    },
    pullRequests: {
        created: GRAPHQL_DEFAULT_PAGINATIONAL_DATA_STATE(),
        mentioned: GRAPHQL_DEFAULT_PAGINATIONAL_DATA_STATE(),
        assigned:GRAPHQL_DEFAULT_PAGINATIONAL_DATA_STATE()
    },
    issues: {
        created: GRAPHQL_DEFAULT_PAGINATIONAL_DATA_STATE(),
        mentioned: GRAPHQL_DEFAULT_PAGINATIONAL_DATA_STATE(),
        assigned: GRAPHQL_DEFAULT_PAGINATIONAL_DATA_STATE()
    }
}
