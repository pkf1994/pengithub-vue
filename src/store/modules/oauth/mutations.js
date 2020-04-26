import {CROSS_MUTATION_TRIGGER_LOADING} from '../crossMutation'
import {ACTION_OAUTH_REQUEST_ACCESS_TOKEN, ACTION_OAUTH_REQUEST_VIEWER_INFO} from "./actionTypes";
import state from './state'

export const MUTATION_OAUTH_RESOLVE_ACCESS_TOKEN = "MUTATION_OAUTH_RESOLVE_ACCESS_TOKEN"

export const MUTATION_OAUTH_RESOLVE_VIEWER_INFO = "MUTATION_OAUTH_RESOLVE_VIEWER_INFO"

export const MUTATION_OAUTH_GETTING_ACCESS_TOKEN_FAILED = "MUTATION_OAUTH_GETTING_ACCESS_TOKEN_FAILED"

export const MUTATION_SIGN_OUT = 'MUTATION_SIGN_OUT'

let defaultState = JSON.parse(JSON.stringify(state))

export default {
    [MUTATION_OAUTH_RESOLVE_ACCESS_TOKEN](state, payload) {
        state.accessToken.accessToken = payload.access_token
        state.accessToken.scope = payload.scope
        state.accessToken.tokenType = payload.token_type
        state.accessToken.authenticated = payload.authenticated
    },

    [MUTATION_OAUTH_RESOLVE_VIEWER_INFO](state,payload) {
        state.viewerInfo.login = payload.login
        state.viewerInfo.avatarUrl = payload.avatarUrl
    },

    [MUTATION_OAUTH_GETTING_ACCESS_TOKEN_FAILED](state,payload) {
        state.accessToken.exceptionOccurred = true
        state.accessToken.loading = false
        state.accessToken.exception = payload.exception
    },

    [MUTATION_SIGN_OUT] (state,payload) {
        Object.assign(state,defaultState)
    },

    TRIGGER_LOADING(state, payload) {
        if(payload.actionType === ACTION_OAUTH_REQUEST_ACCESS_TOKEN) {
            if(payload.loading) {
                state.accessToken.exceptionOccurred = false
            }
            state.accessToken.loading = payload.loading
        }else if(payload.actionType === ACTION_OAUTH_REQUEST_VIEWER_INFO) {
            state.viewerInfo.loading = payload.loading
        }
    }
}
