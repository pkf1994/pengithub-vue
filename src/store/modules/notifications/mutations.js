export const MUTATION_RESOLVE_NOTIFICATIONS_COUNT = "MUTATION_RESOLVE_NOTIFICATIONS_COUNT"
import * as actionType from './actionTypes'
export default {
    [MUTATION_RESOLVE_NOTIFICATIONS_COUNT](state,payload) {
        state.unread.count = payload.data
    },
    TRIGGER_LOADING(state,payload) {
        if(payload.actionType == actionType.ACTION_GET_UNREAD_NOTIFICATIONS_COUNT) {
            state.unread.loading = payload.loading
        }
    }
}