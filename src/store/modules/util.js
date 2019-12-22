import {CROSS_MUTATION_RESOLVE_DATA,CROSS_MUTATION_TRIGGER_FLAG, CROSS_MUTATION_TRIGGER_LOADING} from "./crossMutation";

export function commitTriggerLoadingMutation(context, storeId, loading) {
    const payload = {
        storeId: storeId,
        loading: loading
    }
    context.commit(CROSS_MUTATION_TRIGGER_LOADING, payload)
}

export function commitResolveDataMutation(context, storeId, data) {
    const payload = {
        storeId: storeId,
        data: data
    }
    context.commit(CROSS_MUTATION_RESOLVE_DATA, payload)
}

export function commitTriggerFlagMutation(context,storeId,flag) {
    const payload = {
        storeId: storeId,
        flag: flag
    }
    context.commit(CROSS_MUTATION_TRIGGER_FLAG, payload)
}

export function handleException(e) {
    console.log(e)
}

