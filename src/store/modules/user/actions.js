import {commitTriggerLoadingMutation, handleException} from "../util";
import {authRequiredGitHubGraphqlApiQuery, commonGet} from "../network";
import {STORE_ID} from "../constant";
import {ACTION_USER_REQUEST_USER_INFO} from "./actionTypes";
import {MUTATION_USER_RESOLVE_USER_INFO_DATA} from "./mutationTypes";
import {GRAPH_QL_VIEWER} from "./graphql";


export const actions = {
    async [ACTION_USER_REQUEST_USER_INFO] (context, payload) {
        try{
            commitTriggerLoadingMutation(context,STORE_ID.USER,true)

            const res = await authRequiredGitHubGraphqlApiQuery(GRAPH_QL_VIEWER)

            context.commit({
                type: MUTATION_USER_RESOLVE_USER_INFO_DATA,
                repositoriesContributedTo: res.data.data.viewer.repositoriesContributedTo.nodes,
                starredRepositories: res.data.data.viewer.starredRepositories.nodes,
            })
            commitTriggerLoadingMutation(context,STORE_ID.USER,false)
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,STORE_ID.USER,false)
        }
    }

}

