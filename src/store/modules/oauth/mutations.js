import {CROSS_MUTATION_TRIGGER_LOADING} from '../crossMutation'
import {STORE_ID} from "../constant";

export const MUTATION_OAUTH_RESOLVE_ACCESS_TOKEN = "MUTATION_OAUTH_RESOLVE_ACCESS_TOKEN"

export const MUTATION_OAUTH_GETTING_ACCESS_TOKEN_FAILED = "MUTATION_OAUTH_GETTING_ACCESS_TOKEN_FAILED"

export default {
    [MUTATION_OAUTH_RESOLVE_ACCESS_TOKEN](state, payload) {
        state.accessToken = payload.access_token
        state.scope = payload.scope
        state.tokenType = payload.token_type
        state.authenticated = payload.authenticated
    },

    [MUTATION_OAUTH_GETTING_ACCESS_TOKEN_FAILED](state,payload) {
        state.exceptionOccurred = true
        state.loading = false
        state.exception = payload.exception
    },

    [CROSS_MUTATION_TRIGGER_LOADING](state, payload) {
        if(payload.storeId === STORE_ID.OAUTH) {
            if(payload.loading) {
                state.exceptionOccurred = false
            }
            state.loading = payload.loading
        }
    }
}
