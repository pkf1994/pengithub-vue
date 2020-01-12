import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex)

import {
    trendingStore,
    oauthStore,
    homeStore,
    searchStore,
    repositoryStore
} from "./modules"

export default new Vuex.Store ({
    modules: {
        trending: trendingStore,
        oauth: oauthStore,
        home: homeStore,
        search: searchStore,
        repository: repositoryStore
    },
    plugins: [
        createPersistedState({
            paths: ["oauth"]
        })
    ]
})