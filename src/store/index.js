import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex)

import {
    trendingStore,
    oauthStore,
    userStore,
} from "./modules"

export default new Vuex.Store ({
    modules: {
        trending: trendingStore,
        oauth: oauthStore,
        user: userStore,
    },
    plugins: [
        createPersistedState({
            paths: ["oauth"]
        })
    ]
})