import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex)

import {
    oauthStore,
    homeStore,
    searchStore,
    repositoryStore,
    issuesStore,
    notificationsStore
} from "./modules"

export default new Vuex.Store ({
    strict: true,
    modules: {
        oauth: oauthStore,
        home: homeStore,
        search: searchStore,
        repository: repositoryStore,
        issues: issuesStore,
        notifications: notificationsStore
    },
    plugins: [
        createPersistedState({
            paths: ["oauth"]
        })
    ]
})