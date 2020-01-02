import {CROSS_MUTATION_TRIGGER_LOADING} from "../crossMutation";
import {
    MUTATION_HOME_RESOLVE_DASHBOARD_DATA,
    MUTATION_HOME_RESOLVE_ISSUES,
    MUTATION_HOME_RESOLVE_NOTIFICATIONS_DATA
} from "./mutationTypes";
import {
    ACTION_HOME_REQUEST_DASHBOARD_DATA,
    ACTION_HOME_REQUEST_ISSUES,
    ACTION_HOME_REQUEST_NOTIFICATIONS_DATA
} from "./actionTypes";


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
        if(payload.actionType === ACTION_HOME_REQUEST_DASHBOARD_DATA) {
            state.dashboard.loading = payload.loading
        }else if(payload.actionType === ACTION_HOME_REQUEST_NOTIFICATIONS_DATA) {
            state.notifications.loading = payload.loading
        }else if(payload.actionType === ACTION_HOME_REQUEST_ISSUES) {
            state[payload.meta.issueType][payload.meta.meta].loading = payload.loading
        }
    }
}
