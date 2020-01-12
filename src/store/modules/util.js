import {
    CROSS_MUTATION_RESOLVE_DATA,
    CROSS_MUTATION_TRIGGER_FLAG,
    CROSS_MUTATION_TRIGGER_LOADING
} from "./crossMutation";
import Vue from 'vue'
import axios from 'axios'

export function commitTriggerLoadingMutation(context, actionType, loading, meta) {
    const payload = {
        actionType,
        loading,
        meta
    }
    context.commit(CROSS_MUTATION_TRIGGER_LOADING, payload)
}

export function cancelAndUpdateAxiosCancelTokenSource(meta) {
    axiosCancelTokenSourceStore[meta] && axiosCancelTokenSourceStore[meta].cancel()
    axiosCancelTokenSourceStore[meta] = axios.CancelToken.source()
    return  axiosCancelTokenSourceStore[meta].token
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

export function handleException(e,meta) {
    meta = {
        throwNetworkErrorToComponent: false,
        toastError: true,
        ...meta
    }
    if(meta.throwNetworkErrorToComponent) {
        throw e
        return
    }
    if(meta.toastError) {
        Vue.toast(e.message,{type:"error"})
    }
    console.log(e)
}

export const axiosCancelTokenSourceStore = {

}