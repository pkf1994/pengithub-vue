import {COMMON_MUATION_RESOLVE_DATA, COMMON_MUTATION_TRIGGER_LOADING} from "./commonMutation";

export function triggerLoading(context,storeId,loading) {
    const payload = {
        storeId: storeId,
        loading: loading
    }
    context.commit(COMMON_MUTATION_TRIGGER_LOADING, payload)
}

export function resolveData(context,storeId,data) {
    const payload = {
        storeId: storeId,
        data: data
    }
    context.commit(COMMON_MUATION_RESOLVE_DATA, payload)
}

export function handleException(e) {
    console.log(e)
}