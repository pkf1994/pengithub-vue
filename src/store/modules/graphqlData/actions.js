import * as actionTypes from './actionTypes'
import * as mutationTypes from './mutationTypes'
import {util_throttle} from '@/util'
import {authRequiredGitHubGraphqlApiQuery} from '@/network'
import * as graphql from './graphql'

let nodesQueue = {}

function consoleGraphqlError(graphqlRes) {
    let errors = graphqlRes.data && graphqlRes.data.errors
    if(errors) {
        errors.forEach((i,index) => {
            console.log(i.message)
        })
    }
}

export default {
    async [actionTypes.GET_NODES_EXECUTOR](context,payload) {
        try {
            let res = await authRequiredGitHubGraphqlApiQuery(payload.graphql,{
                variables: {
                    ids: payload.ids,
                }
            })
            let nodes = []
            try{
                nodes = res.data.data.nodes
            }catch(e) {
                consoleGraphqlError(res)
            }
            if(nodes.length > 0) {
                context.commit(mutationTypes.RESOLVE_DATA,{data:nodes})
            }
        } catch (e) {
            console.log(e)
        }
    },

    async [actionTypes.GET_NODES](context,payload) {
        if(payload.sync) {
            await context.dispatch(actionTypes.GET_NODES_EXECUTOR,{ids: [payload.id],graphql:payload.graphql})
        }else{
            if(!nodesQueue[payload.graphql]) {
                nodesQueue[payload.graphql] = [payload.id]
            } else {
                nodesQueue[payload.graphql].push(payload.id) 
            }
            util_throttle.throttleByDelay(() => {
                let _nodesQueue = nodesQueue
                nodesQueue = {}
                Promise.all(Object.keys(_nodesQueue).map(graphql => {
                    context.dispatch(actionTypes.GET_NODES_EXECUTOR,{ids: _nodesQueue[graphql], graphql:graphql})
                }))
            }, 50, window)
        }
        
    },

}