import * as mutationTypes from './mutationTypes'
import Vue from 'vue'
export default {
    [mutationTypes.RESOLVE_DATA] (state,payload) {
        payload.data.forEach(i => {
            let existOneIdx
            let existOne = state.nodes.filter((i_,idx) => {
                if(i_.id == i.id) existOneIdx = idx
                return i_.id == i.id
            })[0]
            if(existOne) {
                Vue.set(state.nodes,existOneIdx,Object.assign(existOne,i))
               }else{
                state.nodes.push(i)
            }
        })
    }
}