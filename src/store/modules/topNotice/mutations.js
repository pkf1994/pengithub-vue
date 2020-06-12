import * as mutation from "./mutationTypes";
import Vue from 'vue'
export default {
    [mutation.MUTATION_APPOINT_TOP_NOTICE](state,payload) {
        Vue.set(
            state,
            payload.theKey,
            {
                notice:payload.notice,
                type: payload.type
            }
        )
    },
}
