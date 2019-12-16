import {CROSS_MUTATION_RESOLVE_DATA, CROSS_MUTATION_TRIGGER_LOADING} from "../crossMutation";

export default {
    [CROSS_MUTATION_TRIGGER_LOADING](state, payload) {
        if(payload.storeId === "trending") {
            state.loading = payload.loading
        }
    },
    [CROSS_MUTATION_RESOLVE_DATA](state, payload) {
        if(payload.storeId === "trending") {
            state.repositoryList = payload.data
        }
    }
}