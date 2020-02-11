import {CROSS_MUTATION_TRIGGER_LOADING} from "../crossMutation";
import {
    MUTATION_ISSUES_RESOLVE_ISSUES,
    MUTATION_ISSUES_RESOLVE_ISSUES_ADDITIONAL_DATA,
    MUTATION_ISSUES_RESOLVE_COUNT_OF_ISSUE_BY_STATE
} from "./mutationTypes";
import {
    ACTION_ISSUES_REQUEST_ISSUES,
    ACTION_ISSUES_REQUEST_ISSUES_ADDITIONAL_DATA,
    ACTION_ISSUES_REQUEST_COUNT_OF_ISSUE_BY_STATE
} from "./actionTypes";
import Vue from 'vue'

export default {
  
    [MUTATION_ISSUES_RESOLVE_ISSUES](state,payload) {
        state[payload.belongTo][payload.issueType].data = payload.data
        state[payload.belongTo][payload.issueType].pageInfo = payload.pageInfo
    },

    [MUTATION_ISSUES_RESOLVE_ISSUES_ADDITIONAL_DATA](state,payload) {
        state[payload.belongTo][payload.issueType].data.forEach((item,index) => {
            Vue.set(state[payload.belongTo][payload.issueType].data,index,Object.assign({},item,state[payload.belongTo][payload.issueType].data[index]))
        })
    },

    [MUTATION_ISSUES_RESOLVE_COUNT_OF_ISSUE_BY_STATE](state,payload) {
        state[payload.belongTo][payload.issueType].countInfo = payload.data
    },



    [CROSS_MUTATION_TRIGGER_LOADING](state, payload) {
       if(payload.actionType === ACTION_ISSUES_REQUEST_ISSUES) {
            state[payload.meta.belongTo][payload.meta.issueType].loading = payload.loading
        }
        else if(payload.actionType === ACTION_ISSUES_REQUEST_ISSUES_ADDITIONAL_DATA) {
            state[payload.meta.belongTo][payload.meta.issueType].loadingAdditionalData = payload.loading
        }
        else if(payload.actionType === ACTION_ISSUES_REQUEST_COUNT_OF_ISSUE_BY_STATE) {
            state[payload.meta.belongTo][payload.meta.issueType].loadingCountOfIssueByState = payload.loading
        }
    }
}
