import {handleException, commitTriggerLoadingMutation} from "../util";
import {util_queryParse} from "../../../util";
import {API_OAUTH2_ACCESS_TOKEN, API_OAUTH2_USER_INFO} from "../api";
import {
    MUTATION_OAUTH_GETTING_ACCESS_TOKEN_FAILED,
    MUTATION_OAUTH_RESOLVE_ACCESS_TOKEN, MUTATION_OAUTH_RESOLVE_VIEWER_INFO,
} from "./mutations";

import {authRequiredGitHubGraphqlApiQuery, commonGet} from "../network";
import {
    ACTION_OAUTH_REQUEST_ACCESS_TOKEN,
    ACTION_OAUTH_REQUEST_VIEWER_INFO
} from "./actionTypes";
import {GRAPH_QL_VIEWER} from "./graphql";

import router from '../../../router'


export default {
    async [ACTION_OAUTH_REQUEST_ACCESS_TOKEN] (context, payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_OAUTH_REQUEST_ACCESS_TOKEN,true)
            //获取access_token
            const url_getAccessToken = API_OAUTH2_ACCESS_TOKEN(payload.code)
            const res_getAccessToken = await commonGet(url_getAccessToken)
            let accessTokenObject = util_queryParse(res_getAccessToken.data)
            await context.commit({
                type: MUTATION_OAUTH_RESOLVE_ACCESS_TOKEN,
                ...accessTokenObject,
                authenticated: true,
            })
            commitTriggerLoadingMutation(context,ACTION_OAUTH_REQUEST_ACCESS_TOKEN,false)

        }catch (e) {
            handleException(e)
            context.commit({
                type: MUTATION_OAUTH_GETTING_ACCESS_TOKEN_FAILED,
                exception: e.response.data
            })
            commitTriggerLoadingMutation(context,ACTION_OAUTH_REQUEST_ACCESS_TOKEN,false)
        }
    },

    async [ACTION_OAUTH_REQUEST_VIEWER_INFO] (context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_OAUTH_REQUEST_VIEWER_INFO,true)
            //获取基本用户信息
            const res_viewerBasicInfo = await authRequiredGitHubGraphqlApiQuery(GRAPH_QL_VIEWER)

            context.commit({
                type: MUTATION_OAUTH_RESOLVE_VIEWER_INFO,
                login: res_viewerBasicInfo.data.data.viewer.login,
                avatarUrl: res_viewerBasicInfo.data.data.viewer.avatarUrl,
            })
            commitTriggerLoadingMutation(context,ACTION_OAUTH_REQUEST_VIEWER_INFO,false)
            await router.replace({
                path: '/'
            })
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,ACTION_OAUTH_REQUEST_VIEWER_INFO,false)
        }
    }
}

