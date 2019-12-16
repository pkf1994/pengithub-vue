import {handleException, commitTriggerLoadingMutation} from "../util";
import {util_queryParse} from "../../../util";
import {API_OAUTH2_ACCESS_TOKEN, API_OAUTH2_USER_INFO} from "../api";
import {
    MUTATION_OAUTH_GETTING_ACCESS_TOKEN_FAILED,
    MUTATION_OAUTH_RESOLVE_ACCESS_TOKEN,
} from "./mutations";

import {commonGet} from "../network";
import {STORE_ID} from "../constant";
import {ACTION_OAUTH_REQUEST_ACCESS_TOKEN} from "./actionTypes";


export default {
    async [ACTION_OAUTH_REQUEST_ACCESS_TOKEN] (context,payload) {
        try{
            commitTriggerLoadingMutation(context,STORE_ID.OAUTH,true)
            //获取access_token
            const url_getAccessToken = API_OAUTH2_ACCESS_TOKEN(payload.code)
            const res_getAccessToken = await commonGet(url_getAccessToken)
            let accessTokenObject = util_queryParse(res_getAccessToken.data)
            context.commit({
                type: MUTATION_OAUTH_RESOLVE_ACCESS_TOKEN,
                ...accessTokenObject,
                authenticated: true
            })
        }catch (e) {
            handleException(e)
            context.commit({
                type: MUTATION_OAUTH_GETTING_ACCESS_TOKEN_FAILED,
                exception: e.response.data
            })
        }
    }
}

