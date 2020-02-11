import {
    ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA,
    ACTION_REPOSITORY_REQUEST_README_DATA,
    ACTION_REPOSITORY_REQUEST_ISSUES,
    ACTION_REPOSITORY_REQUEST_PULSE_COMMIT_COUNT,
    ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA,
    ACTION_REPOSITORY_REQUEST_BASIC_DATA,
    ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_REST,
    ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_GRAPHQL,
    ACTION_REPOSITORY_REQUEST_UPDATEDAT_OF_CONTENTS,
    ACTION_REPOSITORY_REQUEST_CONTENTS_TREE,
    ACTION_REPOSITORY_REQUEST_CONTENT_CONTRIBUTORS,
    ACTION_REPOSITORY_REQUEST_CONTENTS_BLOB,
    ACTION_REPOSITORY_REQUEST_COMMITS_COUNT_BY_BRANCH,
    ACTION_REPOSITORY_REQUEST_PROJECTS_DATA,
    ACTION_REPOSITORY_REQUEST_COMMUNITY_DATA,
    ACTION_REPOSITORY_REQUEST_ISSUES_ADDITIONAL_DATA} from './actionTypes.js'
import { 
    MUTATION_REPOSITORY_CODE_RESOLVE_BASIC_INFO,
    MUTATION_REPOSITORY_RESOLVE_ISSUES,
    MUTATION_REPOSITORY_RESOLVE_ISSUES_ADDITIONAL_DATA,
    MUTATION_REPOSITORY_SYNC_SEARCH_PROJECTS_QUERY,
    MUTATION_REPOSITORY_PULSE_RESOLVE_COMMIT_COUNT,
    MUTATION_REPOSITORY_RESOLVE_CONTRIBUTORS_LIST,
    MUTATION_REPOSITORY_RESOLVE_README_DATA,
    MUTATION_REPOSITORY_RESOLVE_UPDATEDAT_OF_CONTENTS,
    MUTATION_REPOSITORY_RESOLVE_PULSE_ISSUES,
    MUTATION_REPOSITORY_RESOLVE_CONTENTS_TREE,
    MUTATION_REPOSITORY_RESOLVE_CONTENTS_BLOB,
    MUTATION_REPOSITORY_RESOLVE_CONTRIBUTORS_OF_CONTENT,
    MUTATION_REPOSITORY_RESOLVE_LAST_COMMIT_OF_CONTENT,
    MUTATION_REPOSITORY_RESOLVE_CODE_COMMITS_COUNT_BY_BRANCH,
    MUTATION_REPOSITORY_RESOLVE_COMMUNITY_DATA,
    MUTATION_REPOSITORY_RESOLVE_PROJECTS,
    MUTATION_REPOSITORY_RESOLVE_BASIC_DATA } from './mutationTypes.js'
import {CROSS_MUTATION_TRIGGER_LOADING} from '../crossMutation'
import Vue from 'vue'
export default {
    [MUTATION_REPOSITORY_CODE_RESOLVE_BASIC_INFO](state,payload) {
        state.code.data = payload.data
    },

    [MUTATION_REPOSITORY_RESOLVE_README_DATA] (state,payload) {
        state.code.readme.data = payload.data
    },

    [MUTATION_REPOSITORY_RESOLVE_BASIC_DATA](state, payload) {
        state.basic.data = payload.data
    },

    [MUTATION_REPOSITORY_RESOLVE_PROJECTS](state,payload) {
        if(payload.getMoreData) {
            payload.data.nodes =  state.projects.nodes.concat(payload.data.nodes)
        }
        state.projects = Object.assign({}, state.projects, payload.data)
        state.projects.totalCountOpenWithoutSearchQuery = payload.totalCountOpenWithoutSearchQuery
        state.projects.totalCountOpen = payload.totalCountOpen
        state.projects.totalCountClosed = payload.totalCountClosed
    },

    [MUTATION_REPOSITORY_SYNC_SEARCH_PROJECTS_QUERY](state,payload) {
        state.projects.searchQuery = payload.searchQuery
    },

    [MUTATION_REPOSITORY_RESOLVE_ISSUES](state,payload) {
        state[payload.issueType][payload.meta].data = payload.data
        state[payload.issueType][payload.meta].totalCount = payload.totalCount
        state[payload.issueType][payload.meta].pageInfo = payload.pageInfo
    },

    [MUTATION_REPOSITORY_RESOLVE_ISSUES_ADDITIONAL_DATA] (state,payload) {
        state[payload.issueType][payload.meta].data.forEach((item,index) => {
            Vue.set(state[payload.issueType][payload.meta].data,index,Object.assign({},item,{
                ...payload.data[index]
            }))
        })
    },

    [MUTATION_REPOSITORY_RESOLVE_CONTRIBUTORS_LIST](state,payload) {
        state.pulse.codeChanges.data = payload.data
    },

    [MUTATION_REPOSITORY_PULSE_RESOLVE_COMMIT_COUNT] (state,payload) {
        state.pulse.codeChanges.commitCount.data = payload.data
    },

    [MUTATION_REPOSITORY_RESOLVE_PULSE_ISSUES](state,payload) {
        if(payload.from === 'rest') {
            if(payload.getMoreData) {
                payload.data.items = state.pulse[payload.meta].data.concat(payload.data.items)
            }
            state.pulse[payload.meta].data = payload.data.items
            state.pulse[payload.meta].totalCount = payload.data.total_count
            state.pulse[payload.meta].pageInfo = payload.pageInfo || {}
        }
        else if(payload.from === 'graphql') {
            if(payload.getMoreData) {
                payload.data.nodes =  state.pulse[payload.meta].nodes.concat(payload.data.nodes)
            }
            state.pulse[payload.meta] = Object.assign({}, state.pulse[payload.meta], payload.data)
        }
    },


    [MUTATION_REPOSITORY_RESOLVE_COMMUNITY_DATA] (state,payload) {
        state.community.data = payload.data
    },

    [MUTATION_REPOSITORY_RESOLVE_CONTENTS_TREE] (state,payload) {
        state.code.codeFile.data = payload.data
    },

    
    [MUTATION_REPOSITORY_RESOLVE_CONTENTS_BLOB] (state,payload) {
        payload = {
            meta: 'text',
            ...payload
        }
        switch(payload.meta){
            case 'text':
                state.code.codeFile.fileDetail.data = payload.data
                break
            case 'html':
                state.code.codeFile.fileDetail.html = payload.data
                break
            case 'binary':
                state.code.codeFile.fileDetail.raw = payload.data
                break
        }
    },



    [MUTATION_REPOSITORY_RESOLVE_LAST_COMMIT_OF_CONTENT] (state,payload) {
        state.code.codeFile.fileDetail.lastCommit.data = payload.data
    },

    [MUTATION_REPOSITORY_RESOLVE_CODE_COMMITS_COUNT_BY_BRANCH] (state,payload) {
        state.code.codeFile.countOfCommits.data = payload.data
    },

    [MUTATION_REPOSITORY_RESOLVE_CONTRIBUTORS_OF_CONTENT] (state,payload) {
        state.code.codeFile.fileDetail.contributors.data = payload.data
    },

    [MUTATION_REPOSITORY_RESOLVE_UPDATEDAT_OF_CONTENTS] (state,payload) {
        state.code.codeFile.data.forEach((item,index) => {
            Vue.set(state.code.codeFile.data,index,Object.assign({},item,{
                updatedAt: payload.data[`history${index}`].nodes[0].committedDate
            }))
        })
    },

    [CROSS_MUTATION_TRIGGER_LOADING](state,payload) {
        if(payload.actionType === ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA) {
            state.code.loading = payload.loading
        }
        else if(payload.actionType === ACTION_REPOSITORY_REQUEST_README_DATA) {
            state.code.readme.loading = payload.loading
        }
        else if(payload.actionType === ACTION_REPOSITORY_REQUEST_PULSE_COMMIT_COUNT) {
            state.pulse.codeChanges.commitCount.loading = payload.loading
        }
        else if(payload.actionType === ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA) {
            state.pulse.codeChanges.loading = payload.loading
        }
        else if(payload.actionType === ACTION_REPOSITORY_REQUEST_BASIC_DATA) {
            state.basic.loading = payload.loading
        }
        else if(payload.actionType === ACTION_REPOSITORY_REQUEST_COMMUNITY_DATA) {
            state.community.loading = payload.loading
        }
        else if(payload.actionType === ACTION_REPOSITORY_REQUEST_UPDATEDAT_OF_CONTENTS) {
            state.code.codeFile.loadingUpdatedAtOfContents = payload.loading
        }
        else if(payload.actionType === ACTION_REPOSITORY_REQUEST_ISSUES) {
            state[payload.meta.issueType][payload.meta.meta].loading = payload.loading
        }
        else if(payload.actionType === ACTION_REPOSITORY_REQUEST_ISSUES_ADDITIONAL_DATA) {
            state[payload.meta.issueType][payload.meta.meta].loadingAdditionalData = payload.loading
        }
        else if(payload.actionType === ACTION_REPOSITORY_REQUEST_CONTENTS_TREE) {
            state.code.codeFile.loading = payload.loading
        }
        else if(payload.actionType === ACTION_REPOSITORY_REQUEST_COMMITS_COUNT_BY_BRANCH) {
            state.code.codeFile.countOfCommits.loading = payload.loading
        }
        else if(payload.actionType === ACTION_REPOSITORY_REQUEST_CONTENT_CONTRIBUTORS) {
            state.code.codeFile.fileDetail.contributors.loading = payload.loading
        }
        else if(payload.actionType === ACTION_REPOSITORY_REQUEST_CONTENTS_BLOB) {
            state.code.codeFile.fileDetail.loading = payload.loading
        }
        else if(payload.actionType === ACTION_REPOSITORY_REQUEST_PROJECTS_DATA) {
            if(!payload.meta.getMoreData){
                state.projects.loading = payload.loading
            }else{
                state.projects.loadingMore = payload.loading
            }
        }
        else if(payload.actionType === ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_REST || payload.actionType === ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_GRAPHQL) {
            if(payload.meta.issueType === 'pullRequest') {
                if(payload.meta.state === 'closed') {
                    if(!payload.meta.getMoreData){
                        state.pulse.pullsMerged.loading = payload.loading
                    }else{
                        state.pulse.pullsMerged.loadingMore = payload.loading
                    }
                }else{
                    if(!payload.meta.getMoreData){
                        state.pulse.pullsProposed.loading = payload.loading
                    }else{
                        state.pulse.pullsProposed.loadingMore = payload.loading
                    }
                }
            }else{
                if(payload.meta.state === 'closed') {
                    if(!payload.meta.getMoreData){
                        state.pulse.issuesClosed.loading = payload.loading
                    }else{
                        state.pulse.issuesClosed.loadingMore = payload.loading
                    }
                }else{
                    if(!payload.meta.getMoreData){
                        state.pulse.issuesOpened.loading = payload.loading
                    }else{
                        state.pulse.issuesOpened.loadingMore = payload.loading
                    }
                }
            }
        }
    }
}