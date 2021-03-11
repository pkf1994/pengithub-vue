import * as mutationTypes from './mutationTypes'

export default {
    [mutationTypes.RESOLVE_DATA] (state,payload) {
        let mutationCrumbs = payload.mutationCrumbs
        let stateDataHolder
        mutationCrumbs.forEach(i => {
            if(!stateDataHolder) {
                stateDataHolder = state[i]
            } else {
                stateDataHolder = stateDataHolder[i]
            }
        })
        if(stateDataHolder) {
            payload.data.forEach(i => {
                if(!stateDataHolder.some((i_,index,arr) =>{
                    if(i_.id == i.id) {
                        arr.splice(index,1,i)
                    }
                    return i_.id == i.id
                })){
                    stateDataHolder.push(i)
                }
            })
        }
    }
}