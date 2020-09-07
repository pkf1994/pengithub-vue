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
    notificationsStore,
    topNoticeStore,
    dirtyStore,
    pullRequestDetailStore
} from "./modules"

export default new Vuex.Store ({
    strict: true,
    modules: {
        oauth: oauthStore,
        home: homeStore,
        search: searchStore,
        repository: repositoryStore,
        issues: issuesStore,
        notifications: notificationsStore,
        topNotice: topNoticeStore,
        dirty: dirtyStore,
        pullRequestDetail: pullRequestDetailStore
    },
    plugins: [
        createPersistedState({
            paths: ["oauth"]
        })
    ]
})