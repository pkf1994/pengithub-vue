import {DEFAULT_PAGINATIONAL_DATA_STATE} from "../constant";

export default {
    notifications: DEFAULT_PAGINATIONAL_DATA_STATE(),
    dashboard: {
        loading: false,
        repositoriesContributedTo: [],
        starredRepositories: [],
        events: [],
        organizations: []
    },
    pullRequests: {
        created: DEFAULT_PAGINATIONAL_DATA_STATE(),
        mentioned: DEFAULT_PAGINATIONAL_DATA_STATE(),
        assigned:DEFAULT_PAGINATIONAL_DATA_STATE()
    },
    issues: {
        created: DEFAULT_PAGINATIONAL_DATA_STATE(),
        mentioned: DEFAULT_PAGINATIONAL_DATA_STATE(),
        assigned: DEFAULT_PAGINATIONAL_DATA_STATE()
    }
}
