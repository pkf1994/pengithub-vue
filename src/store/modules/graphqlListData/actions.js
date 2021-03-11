import * as actionTypes from './actionTypes'
import * as mutationTypes from './mutationTypes'
import {util_throttle} from '@/util'
import {authRequiredGitHubGraphqlApiQuery} from '@/network'
import * as graphql from './graphql'

let commitsQueue = []
let issueCommentsQueue = []

function consoleGraphqlError(graphqlRes) {
    let errors = graphqlRes.data && graphqlRes.data.errors
    if(errors) {
        errors.forEach((i,index) => {
            console.log(i.message)
        })
    }
}

export default {
    async [actionTypes.GET_NODES](context,payload) {
        payload = {
            fields:['authors','state'],
            ...payload
        }
        try {
            let _ids = payload.ids
            payload.ids = []
            let res = await authRequiredGitHubGraphqlApiQuery(payload.graphql,{
                variables: {
                    ids: _ids,
                    withAuthors: payload.fields.some(i => i == 'authors'),
                    withState: payload.fields.some(i => i == 'state'),
                }
            })
            let nodes = []
            try{
                nodes = res.data.data.nodes
            }catch(e) {
                consoleGraphqlError(res)
            }

            if(nodes.length > 0) {
                context.commit(mutationTypes.RESOLVE_DATA,{data:nodes,mutationCrumbs:payload.mutationCrumbs})
            }
        } catch (e) {
            console.log(e)
        }
    },

    [actionTypes.GET_COMMITS](context,payload) {
        if(!commitsQueue.some(i => i == payload.id)) commitsQueue.push(payload.id)
        util_throttle.throttleByDelay(() => {
            context.dispatch(actionTypes.GET_NODES,{ids:commitsQueue,graphql:graphql.NODES_COMMIT,mutationCrumbs:['commits']})
        }, 50, window)
    },

    [actionTypes.GET_ISSUE_COMMENTS](context,payload) {
        if(!issueCommentsQueue.some(i => i == payload.id)) issueCommentsQueue.push(payload.id)
        util_throttle.throttleByDelay(() => {
            context.dispatch(actionTypes.GET_NODES,{ids:issueCommentsQueue,graphql:graphql.NODES_ISSUE_COMMENT,mutationCrumbs:['issueComments']})
        }, 50, window)
    },

}