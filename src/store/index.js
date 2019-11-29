import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import {
    trendingStore,
    uiStore
} from "./modules"

export default new Vuex.Store ({
    modules: {
        trending: trendingStore,
        ui: uiStore
    }
})