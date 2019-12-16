import {RequestTrendingRepositoryList} from "./network";
import {handleException, commitResolveDataMutation, commitTriggerLoadingMutation} from "../util";

export const ACTION_TRENDING_REQUEST_TRENDING_REPO_LIST_DATA = "ACTION_TRENDING_REQUEST_TRENDING_REPO_LIST_DATA"

const STORE_ID_TRENDING = "trending"

export default {
    async [ACTION_TRENDING_REQUEST_TRENDING_REPO_LIST_DATA](context,payload) {
        try{
            commitTriggerLoadingMutation(context,STORE_ID_TRENDING,true)
            const res = await RequestTrendingRepositoryList(payload)
            commitResolveDataMutation(context,STORE_ID_TRENDING,res.data)
            commitTriggerLoadingMutation(context,STORE_ID_TRENDING,false)
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,STORE_ID_TRENDING,false)
        }
    }
}

