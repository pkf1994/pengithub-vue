import {MUTATION_UPDATE_DIRTY} from './mutationTypes'
import Vue from 'vue'

export default {
    [MUTATION_UPDATE_DIRTY] (state,payload) {
        Vue.set(state,payload.key,payload.value) 
    }
}