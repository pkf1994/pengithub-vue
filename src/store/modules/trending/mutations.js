import {COMMON_MUATION_RESOLVE_DATA, COMMON_MUTATION_TRIGGER_LOADING} from "../commonMutation";

export default {
    [COMMON_MUTATION_TRIGGER_LOADING](state,payload) {
        if(payload.storeId === "trending") {
            state.loading = payload.loading
        }
    },
    [COMMON_MUATION_RESOLVE_DATA](state,payload) {
        if(payload.storeId === "trending") {
            state.repositoryList = payload.data
        }
    }
}