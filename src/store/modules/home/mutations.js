import {CROSS_MUTATION_TRIGGER_LOADING} from "../crossMutation";
import {STORE_ID} from "../constant";
import {
    MUTATION_HOME_RESOLVE_DASHBOARD_DATA,
    MUTATION_HOME_RESOLVE_ISSUES,
    MUTATION_HOME_RESOLVE_NOTIFICATIONS_DATA
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

    [MUTATION_HOME_RESOLVE_ISSUES](state,payload) {
        state[payload.issueType][payload.meta] = Object.assign(state[payload.issueType][payload.meta],payload)
        if(!payload.changePage) return
        if(payload.forward) {
            state[payload.issueType][payload.meta].currentPage += 1
        } else {
            state[payload.issueType][payload.meta].currentPage += -1
        }
    },

    [CROSS_MUTATION_TRIGGER_LOADING](state, payload) {
        if(payload.storeId === STORE_ID.HOME_DASHBOARD) {
            state.dashboard.loading = payload.loading
        }else if(payload.storeId === STORE_ID.HOME_NOTIFICATIONS) {
            state.notifications.loading = payload.loading
        }else if(payload.storeId === STORE_ID.HOME_PULL_REQUESTS_CREATED) {
            state.pullRequest.created.loading = payload.loading
        }else if(payload.storeId === STORE_ID.HOME_PULL_REQUESTS_ASSIGNED) {
            state.pullRequest.assigned.loading = payload.loading
        }else if(payload.storeId === STORE_ID.HOME_PULL_REQUESTS_MENTIONED) {
            state.pullRequest.mentioned.loading = payload.loading
        }else if(payload.storeId === STORE_ID.HOME_ISSUES_CREATED) {
            state.issue.created.loading = payload.loading
        }else if(payload.storeId === STORE_ID.HOME_ISSUES_ASSIGNED) {
            state.issue.assigned.loading = payload.loading
        }else if(payload.storeId === STORE_ID.HOME_ISSUES_MENTIONED) {
            state.issue.mentioned.loading = payload.loading
        }
    }
}
