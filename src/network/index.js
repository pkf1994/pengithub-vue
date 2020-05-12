import axios from "axios";
import store from '../store'
import {API_GRAPHQL_ENDPOINT,API_OAUTH2} from "./api";

const authRequiredAxios = axios.create({
})

authRequiredAxios.interceptors.request.use(
    config => {
        if(store.state.oauth.accessToken.accessToken) {
            config.auth = {
                username: store.state.oauth.accessToken.accessToken
            }
        }
        return config
    }, 
    error => {
        if(axios.isCancel(error)) return
        return Promise.reject(error);
    }
)

/* authRequiredAxios.interceptors.response.use(
    config => config,
    error => { 
        if(error.response && error.response.status) {
            switch(error.response.status) {
                case 401:
                    window.location.href = API_OAUTH2
            }
        }
        return Promise.reject(error);
    }
) */

export const commonGet = (url, config = {}) => {
    return axios.get(url,config).then(res => {
        return res
    })
}

export const commonDelete = (url, config = {}) => {
    return axios.delete(url,config).then(res => {
        return res
    })
}

export const authRequiredGet = (url, config = {}) => {
    return authRequiredAxios.get(url,config).then(res => {
        return res
    })
}

export const authRequiredPost = (url, config = {}) => {
    return authRequiredAxios.post(url,config).then(res => {
        return res
    })
}

export const authRequiredGitHubGraphqlApiQuery = (query,config = {}) => {
    return authRequiredPost(API_GRAPHQL_ENDPOINT,
        {
            query,
            ...config
        }
    )
}

export function cancelAndUpdateAxiosCancelTokenSource(meta) {
    axiosCancelTokenSourceStore[meta] && axiosCancelTokenSourceStore[meta].cancel()
    try{
        axiosCancelTokenSourceStore[meta] = axios.CancelToken.source()
    }catch(e) {
        console.log(e)
    }
    return  {
        cancelToken:axiosCancelTokenSourceStore[meta].token,
        source:axiosCancelTokenSourceStore[meta],
    }
}

export const axiosCancelTokenSourceStore = {

}
