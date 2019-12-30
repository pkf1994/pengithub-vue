import {
    CROSS_MUTATION_RESOLVE_DATA, CROSS_MUTATION_CANCEL_AND_UPDATE_AXIOS_CANCEL_TOKEN_SOURCE,
    CROSS_MUTATION_TRIGGER_FLAG,
    CROSS_MUTATION_TRIGGER_LOADING
} from "./crossMutation";
import Vue from 'vue'
import axios from 'axios'

export function commitTriggerLoadingMutation(context, storeId, loading) {
    const payload = {
        storeId: storeId,
        loading: loading
    }
    context.commit(CROSS_MUTATION_TRIGGER_LOADING, payload)
}

export function commitCancelAndUpdateAxiosCancelTokenSourceMutation(context, storeId) {
    context.commit(CROSS_MUTATION_CANCEL_AND_UPDATE_AXIOS_CANCEL_TOKEN_SOURCE, storeId)
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
    if (axios.isCancel(e)) {
        console.log("Request canceled", e.message)
        return
    }
    console.log(e)
    Vue.toast(e.message,{type:"error"})
}

