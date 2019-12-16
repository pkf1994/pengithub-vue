import axios from "axios";
import store from '../index'
import {API_GRAPHQL_ENDPOINT} from "./api";

const authRequiredAxios = axios.create()
authRequiredAxios.interceptors.request.use(
    config => {
        if(store.state.oauth.accessToken) {
            config.auth = {
                username: store.state.oauth.accessToken
            }
        }
        return config
})

export const commonGet = (url, config = {}) => {
    return axios.get(url,config).then(res => {
        return res
    })
}

export const authRequiredPost = (url, config = {}) => {
    return authRequiredAxios.post(url,config).then(res => {
        return res
    })
}

export const authRequiredGitHubGraphqlApiQuery = (query,variables = {}) => {
    return authRequiredPost(API_GRAPHQL_ENDPOINT,
        {
            query,
            variables
        }
    )
}
