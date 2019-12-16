import {API_OAUTH2} from "../store/modules/api";

export default {
    install: (Vue) => {
        Vue.prototype.$oauthRedirect = () => {
            location.href = API_OAUTH2;
        }
    }
}