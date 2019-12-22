import {CROSS_MUTATION_TRIGGER_LOADING} from "../crossMutation";
import {STORE_ID} from "../constant";
import {
    MUTATION_HOME_RESOLVE_DASHBOARD_DATA,
    MUTATION_HOME_RESOLVE_NOTIFICATIONS_DATA,
    MUTATION_HOME_RESOLVE_PR_ASSIGNED,
    MUTATION_HOME_RESOLVE_PR_CREATED,
    MUTATION_HOME_RESOLVE_PR_MENTIONED
} from "./mutationTypes";


export default {
    [MUTATION_HOME_RESOLVE_DASHBOARD_DATA](state, payload) {
        state.dashboard.repositoriesContributedTo = payload.repositoriesContributedTo
        state.dashboard.starredRepositories = payload.starredRepositories
        state.dashboard.events = payload.events
        state.dashboard.organizations = payload.organizations
    },

    [MUTATION_HOME_RESOLVE_NOTIFICATIONS_DATA](state,payload) {
        state.notifications.data = payload.data
    },

    [MUTATION_HOME_RESOLVE_PR_CREATED](state,payload) {
        state.pullRequests.created.data = payload.data
    },

    [MUTATION_HOME_RESOLVE_PR_ASSIGNED](state,payload) {
        state.pullRequests.assigned.data = payload.data
    },

    [MUTATION_HOME_RESOLVE_PR_MENTIONED](state,payload) {
        state.pullRequests.mentioned.data = payload.data
    },

    [CROSS_MUTATION_TRIGGER_LOADING](state, payload) {
        if(payload.storeId === STORE_ID.HOME_DASHBOARD) {
            state.dashboard.loading = payload.loading
        }else if(payload.storeId === STORE_ID.HOME_NOTIFICATIONS) {
            state.notifications.loading = payload.loading
        }else if(payload.storeId === STORE_ID.HOME_PULL_REQUESTS_CREATED) {
            state.pullRequests.created.loading = payload.loading
        }else if(payload.storeId === STORE_ID.HOME_PULL_REQUESTS_ASSIGNED) {
            state.pullRequests.assigned.loading = payload.loading
        }else if(payload.storeId === STORE_ID.HOME_PULL_REQUESTS_MENTIONED) {
            state.pullRequests.mentioned.loading = payload.loading
        }
    }
}
