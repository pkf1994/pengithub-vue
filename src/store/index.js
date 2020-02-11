import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex)

import {
    trendingStore,
    oauthStore,
    homeStore,
    searchStore,
    repositoryStore,
    issuesStore
} from "./modules"

export default new Vuex.Store ({
    modules: {
        trending: trendingStore,
        oauth: oauthStore,
        home: homeStore,
        search: searchStore,
        repository: repositoryStore,
        issues: issuesStore,
    },
    plugins: [
        createPersistedState({
            paths: ["oauth"]
        })
    ]
})