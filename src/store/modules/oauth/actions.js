import {handleException, commitTriggerLoadingMutation} from "../util";
import {util_queryParse} from "../../../util";
import {API_OAUTH2_ACCESS_TOKEN, API_OAUTH2_USER_INFO} from "../api";
import {
    MUTATION_SIGN_OUT,
    MUTATION_OAUTH_RESOLVE_ACCESS_TOKEN, 
    MUTATION_OAUTH_RESOLVE_VIEWER_INFO,
} from "./mutations";

import {authRequiredGitHubGraphqlApiQuery, commonGet, commonDelete} from "../network";
import * as actionType from "./actionTypes";
import * as api from '@/network/api'
import {GRAPH_QL_VIEWER} from "./graphql";
import router from '@/router'

import Vue from 'vue'

export default {
    async [actionType.ACTION_OAUTH_REQUEST_ACCESS_TOKEN] (context, payload) {
        //获取access_token
        const url_getAccessToken = API_OAUTH2_ACCESS_TOKEN(payload.code)
        const res_getAccessToken = await commonGet(url_getAccessToken)
        
        let accessTokenObject = util_queryParse.parse(res_getAccessToken.data)
        context.commit({
            type: MUTATION_OAUTH_RESOLVE_ACCESS_TOKEN,
            ...accessTokenObject,
            authenticated: true,
        })
    },

    async [actionType.ACTION_OAUTH_REQUEST_VIEWER_INFO] (context,payload) {
        const res_viewerBasicInfo = await authRequiredGitHubGraphqlApiQuery(GRAPH_QL_VIEWER)
        context.commit({
            type: MUTATION_OAUTH_RESOLVE_VIEWER_INFO,
            login: res_viewerBasicInfo.data.data.viewer.login,
            avatarUrl: res_viewerBasicInfo.data.data.viewer.avatarUrl,
        })
    },

    async [actionType.ACTION_SIGN_OUT] (context,payload) {
        try{
            let accessToken = context.rootState.oauth.accessToken.accessToken
            if(!accessToken || accessToken.trim() == '') return 

            context.commit({
                type: "TRIGGER_LOADING",
                actionType: actionType.ACTION_SIGN_OUT,
                loading: true,
            })

            Vue.triggerLoading(true)

            let url = api.API_OAUTH2_REVOKE_ACCESS_TOKEN(accessToken)

            let res = await commonGet(url)

            if(res.data.message) {
                throw new Error(res.data.message)
            }

            if(payload.meta.authRequired) {
                router.replace('/')
            }

            context.commit({
                type: MUTATION_SIGN_OUT
            })

        }catch(e) {
            throw(e)
        }finally{
            context.commit({
                type: "TRIGGER_LOADING",
                actionType: actionType.ACTION_SIGN_OUT,
                loading: false,
            })
            Vue.triggerLoading(false)
        }

    }
}

