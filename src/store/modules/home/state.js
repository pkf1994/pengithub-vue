import {DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE} from "../constant";

export default {
    notifications: DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE(),
    dashboard: {
        loading: false,
        repositoriesContributedTo: [],
        starredRepositories: [],
        events: [],
        organizations: []
    },
    pullRequest: {
        created: DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE(),
        mentioned: DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE(),
        assigned:DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE()
    },
    issue: {
        created: DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE(),
        mentioned: DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE(),
        assigned: DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE()
    }
}
