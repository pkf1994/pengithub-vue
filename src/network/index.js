import axios from "axios";
import store from '../store'
import {API_GRAPHQL_ENDPOINT,API_OAUTH2} from "./api";
import {util_throttle} from '@/util'
import Vue from 'vue'
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
        i/* f(axios.isCancel(error)) return */
        return Promise.reject(error);
    }
)

authRequiredAxios.interceptors.response.use(
    response => response,
    error => {
        if(error.response && error.response.status == 403 && !store.state.oauth.accessToken.accessToken) {
            util_throttle.throttleByGap(() => {
                Vue.toast('GitHub api对匿名用户进行请求速率限制，请进行oauth2认证以正常访问')
            },500,'login-notice')
            return Promise.reject();
        }
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

export const commonPost = (url, data, config) => {
    return axios.post(url,data,config).then(res => {
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

export const authRequiredDelete = (url,config = {}) => {
    return authRequiredAxios.delete(url,config).then(res => {
        return res
    })
}

export const authRequiredPost = (url, data, config) => {
    return authRequiredAxios.post(url, data, config).then(res => {
        return res
    })
}

export const authRequiredPut = (url, data, config) => {
    return authRequiredAxios.put(url, data, config).then(res => {
        return res
    })
}

export const authRequiredPatch = (url, data, config) => {
    return authRequiredAxios.patch(url,data,config).then(res => {
        return res
    })
}

export const authRequiredAjax = (url, config = {}, method = 'get') => {
    return authRequiredAxios[method](url,config).then(res => {
        return res
    })
}

export const authRequiredGitHubGraphqlApiQuery = (query,data,config) => {
    return authRequiredPost(API_GRAPHQL_ENDPOINT,
        {
            query,
            ...data
        },
        config
    )
}

export const authRequiredGitHubGraphqlApiMutation = (mutation,config = {}) => {
    return authRequiredPost(API_GRAPHQL_ENDPOINT,
        {
            mutation,
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
