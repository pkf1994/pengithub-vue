import {CROSS_MUTATION_TRIGGER_LOADING} from "../crossMutation";
import {STORE_ID} from "../constant";
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
        state.pullRequests.created = Object.assign(state.pullRequests.created,payload)
        if(payload.forward) {
            state.pullRequests.created.currentPage += 1
        } else {
            state.pullRequests.created.currentPage += -1
        }
    },

    [MUTATION_HOME_RESOLVE_PR_ASSIGNED](state,payload) {
        state.pullRequests.assigned = Object.assign(state.pullRequests.assigned,payload)
        if(payload.forward) {
            state.pullRequests.assigned.currentPage += 1
        } else {
            state.pullRequests.assigned.currentPage += -1
        }
    },

    [MUTATION_HOME_RESOLVE_PR_MENTIONED](state,payload) {
        state.pullRequests.mentioned = Object.assign(state.pullRequests.mentioned,payload)
        if(payload.forward) {
            state.pullRequests.mentioned.currentPage += 1
        } else {
            state.pullRequests.mentioned.currentPage += -1
        }
    },

    [MUTATION_HOME_RESOLVE_ISSUES_CREATED](state,payload) {
        state.issues.created = Object.assign(state.issues.created,payload)
        if(payload.forward) {
            state.issues.created.currentPage += 1
        } else {
            state.issues.created.currentPage += -1
        }
    },

    [MUTATION_HOME_RESOLVE_ISSUES_ASSIGNED](state,payload) {
        state.issues.assigned = Object.assign(state.issues.assigned,payload)
        if(payload.forward) {
            state.issues.assigned.currentPage += 1
        } else {
            state.issues.assigned.currentPage += -1
        }
    },

    [MUTATION_HOME_RESOLVE_ISSUES_MENTIONED](state,payload) {
        state.issues.mentioned = Object.assign(state.issues.mentioned,payload)
        state.issues.mentioned.currentPage += 1
        if(payload.forward) {
            state.issues.mentioned.currentPage += 1
        } else {
            state.issues.mentioned.currentPage += -1
        }
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
        }else if(payload.storeId === STORE_ID.HOME_ISSUES_CREATED) {
            state.issues.created.loading = payload.loading
        }else if(payload.storeId === STORE_ID.HOME_ISSUES_ASSIGNED) {
            state.issues.assigned.loading = payload.loading
        }else if(payload.storeId === STORE_ID.HOME_ISSUES_MENTIONED) {
            state.issues.mentioned.loading = payload.loading
        }
    }
}
