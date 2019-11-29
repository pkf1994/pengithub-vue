import {RequestTrendingRepositoryList} from "./network";
import {handleException, resolveData, triggerLoading} from "../util";

export const ACTION_TRENDING_REQUEST_TRENDING_REPO_LIST_DATA = "ACTION_TRENDING_REQUEST_TRENDING_REPO_LIST_DATA"

const STORE_ID_TRENDING = "trending"

export default {
    async [ACTION_TRENDING_REQUEST_TRENDING_REPO_LIST_DATA](context,payload) {
        try{
            triggerLoading(context,STORE_ID_TRENDING,true)
            const res = await RequestTrendingRepositoryList(payload)
            resolveData(context,STORE_ID_TRENDING,res.data)
            triggerLoading(context,STORE_ID_TRENDING,false)
        }catch (e) {
            handleException(e)
            triggerLoading(context,STORE_ID_TRENDING,false)
        }
    }
}

