import {CROSS_MUTATION_TRIGGER_LOADING} from "../crossMutation";
import {STORE_ID} from "../constant";
import {MUTATION_USER_RESOLVE_USER_INFO_DATA} from "./mutationTypes";


export default {
    [MUTATION_USER_RESOLVE_USER_INFO_DATA](state, payload) {
        state.repositoriesContributedTo = payload.repositoriesContributedTo
        state.starredRepositories = payload.starredRepositories
    },

    [CROSS_MUTATION_TRIGGER_LOADING](state, payload) {
        if(payload.storeId === STORE_ID.USER) {
            state.loading = payload.loading
        }
    }
}
