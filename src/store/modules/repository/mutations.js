/* import {
    actionType.ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA,
    actionType.ACTION_REPOSITORY_REQUEST_README_DATA,
    actionType.ACTION_REPOSITORY_REQUEST_LABELS,
    actionType.ACTION_REPOSITORY_REQUEST_PULSE_COMMIT_COUNT,
    actionType.ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA,
    actionType.ACTION_REPOSITORY_REQUEST_BASIC_DATA,
    actionType.ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_REST,
    actionType.ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_GRAPHQL,
    actionType.ACTION_REPOSITORY_REQUEST_UPDATEDAT_OF_CONTENTS,
    actionType.ACTION_REPOSITORY_REQUEST_CONTENTS_TREE,
    actionType.ACTION_REPOSITORY_REQUEST_CONTENT_CONTRIBUTORS,
    actionType.ACTION_REPOSITORY_REQUEST_CONTENTS_BLOB,
    actionType.ACTION_REPOSITORY_REQUEST_COMMITS_COUNT_BY_BRANCH,
    actionType.ACTION_REPOSITORY_REQUEST_ISSUE_DETAIL_DATA,
    actionType.ACTION_REPOSITORY_REQUEST_ISSUE_BODY,
    actionType.ACTION_REPOSITORY_REQUEST_ISSUE_TIMELINE,
    actionType.ACTION_REPOSITORY_REQUEST_ISSUE_TIMELINE_COMMENT_BODY_HTML,
    actionType.ACTION_REPOSITORY_REQUEST_PROJECTS_DATA,
    actionType.ACTION_REPOSITORY_REQUEST_COMMUNITY_DATA,
    actionType.ACTION_REPOSITORY_REQUEST_ISSUES_AVALIABLE_USERS} from './actionTypes.js' */
/* import { 
    MUTATION_REPOSITORY_CODE_RESOLVE_BASIC_INFO,
    MUTATION_REPOSITORY_RESOLVE_ISSUES_AVALIABLE_USERS,
    MUTATION_REPOSITORY_RESOLVE_ISSUE_DETAIL_DATA,
    MUTATION_REPOSITORY_RESOLVE_ISSUE_BODY,
    MUTATION_REPOSITORY_RESOLVE_ISSUE_TIMELINE,
    MUTATION_REPOSITORY_RESOLVE_ISSUE_COMMENT_BODY_AND_REACTIONS,
    MUTATION_REPOSITORY_SYNC_SEARCH_PROJECTS_QUERY,
    MUTATION_REPOSITORY_PULSE_RESOLVE_COMMIT_COUNT,
    MUTATION_REPOSITORY_RESOLVE_CONTRIBUTORS_LIST,
    MUTATION_REPOSITORY_RESOLVE_README_DATA,
    MUTATION_REPOSITORY_RESOLVE_LABELS,
    MUTATION_REPOSITORY_RESOLVE_UPDATEDAT_OF_CONTENTS,
    MUTATION_REPOSITORY_RESOLVE_PULSE_ISSUES,
    MUTATION_REPOSITORY_RESOLVE_CONTENTS_TREE,
    MUTATION_REPOSITORY_RESOLVE_CONTENTS_BLOB,
    MUTATION_REPOSITORY_RESOLVE_CONTRIBUTORS_OF_CONTENT,
    MUTATION_REPOSITORY_RESOLVE_LAST_COMMIT_OF_CONTENT,
    MUTATION_REPOSITORY_RESOLVE_CODE_COMMITS_COUNT_BY_BRANCH,
    MUTATION_REPOSITORY_RESOLVE_COMMUNITY_DATA,
    MUTATION_REPOSITORY_RESOLVE_PROJECTS,
    MUTATION_REPOSITORY_RESOLVE_BASIC_DATA } from './mutationTypes.js' */
import * as mutationType from './mutationTypes'
import * as actionType from './actionTypes'
import {CROSS_MUTATION_TRIGGER_LOADING} from '../crossMutation'
import Vue from 'vue'
export default {
    [mutationType.MUTATION_REPOSITORY_CODE_RESOLVE_BASIC_INFO](state,payload) {
        state.code.data = payload.data
    },

    [mutationType.MUTATION_REPOSITORY_RESOLVE_README_DATA] (state,payload) {
        state.code.readme.data = payload.data
    },

    [mutationType.MUTATION_REPOSITORY_RESOLVE_BASIC_DATA](state, payload) {
        state.basic.data = payload.data
    },

    [mutationType.MUTATION_REPOSITORY_RESOLVE_PROJECTS](state,payload) {
        if(payload.getMoreData) {
            payload.data.nodes =  state.projects.nodes.concat(payload.data.nodes)
        }
        state.projects = Object.assign({}, state.projects, payload.data)
        state.projects.totalCountOpenWithoutSearchQuery = payload.totalCountOpenWithoutSearchQuery
        state.projects.totalCountOpen = payload.totalCountOpen
        state.projects.totalCountClosed = payload.totalCountClosed
    },

    [mutationType.MUTATION_REPOSITORY_SYNC_SEARCH_PROJECTS_QUERY](state,payload) {
        state.projects.searchQuery = payload.searchQuery
    },

    /* [mutationType.MUTATION_REPOSITORY_RESOLVE_ISSUES](state,payload) {
        state[payload.issueType][payload.meta].data = payload.data
        state[payload.issueType][payload.meta].totalCount = payload.totalCount
        state[payload.issueType][payload.meta].pageInfo = payload.pageInfo
    },

    [mutationType.MUTATION_REPOSITORY_RESOLVE_ISSUES_ADDITIONAL_DATA] (state,payload) {
        state[payload.issueType][payload.meta].data.forEach((item,index) => {
            Vue.set(state[payload.issueType][payload.meta].data,index,Object.assign({},item,{
                ...payload.data[index]
            }))
        })
    }, */

   
    [mutationType.MUTATION_REPOSITORY_RESOLVE_ISSUES_AVALIABLE_USERS] (state,payload) {
        state[payload.issueType].associatedUsers[payload.meta].data = Object.assign({},{
            [`${payload.owner}/${payload.repo}`]: payload.data
        },state[payload.issueType].associatedUsers[payload.meta].data)
    },

    [mutationType.MUTATION_REPOSITORY_RESOLVE_LABELS] (state,payload) {
        state.label.data = Object.assign({},{
            [`${payload.owner}/${payload.repo}`]: payload.data
        },state.label.data)
    },

    [mutationType.MUTATION_REPOSITORY_RESOLVE_CONTRIBUTORS_LIST](state,payload) {
        state.pulse.codeChanges.data = payload.data
    },

    [mutationType.MUTATION_REPOSITORY_PULSE_RESOLVE_COMMIT_COUNT] (state,payload) {
        state.pulse.codeChanges.commitCount.data = payload.data
    },

    [mutationType.MUTATION_REPOSITORY_RESOLVE_PULSE_ISSUES](state,payload) {
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


    [mutationType.MUTATION_REPOSITORY_RESOLVE_COMMUNITY_DATA] (state,payload) {
        state.community.data = payload.data
    },

    [mutationType.MUTATION_REPOSITORY_RESOLVE_CONTENTS_TREE] (state,payload) {
        state.code.codeFile.data = payload.data
    },

    
    [mutationType.MUTATION_REPOSITORY_RESOLVE_CONTENTS_BLOB] (state,payload) {
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

    [mutationType.MUTATION_REPOSITORY_RESOLVE_ISSUE_DETAIL_DATA] (state,payload) {
        state.issue.issueDetail.data = payload.data
    },

    [mutationType.MUTATION_REPOSITORY_RESOLVE_ISSUE_BODY] (state,payload) {
        state.issue.issueDetail.body.data = payload.data
    },

    [mutationType.MUTATION_REPOSITORY_RESOLVE_ISSUE_PROJECTS] (state,payload) {
        state.issue.issueDetail.projects.data = payload.data
    },

    [mutationType.MUTATION_REPOSITORY_RESOLVE_ISSUE_TIMELINE] (state,payload) {
        if(payload.changePage) {
            state.issue.issueDetail.timeline.data = state.issue.issueDetail.timeline.data.concat(payload.data)
        }else{
            state.issue.issueDetail.timeline.data = payload.data
            state.issue.issueDetail.timeline.lastData = payload.lastData
        }
        state.issue.issueDetail.timeline.pageInfo = payload.pageInfo
    },

    [mutationType.MUTATION_REPOSITORY_RESOLVE_ISSUE_COMMENT_BODY_AND_REACTIONS] (state,payload) {
        let commentBodyHTMLAndReactionArr = []
        for(let key in payload.data) {
            commentBodyHTMLAndReactionArr.push(payload.data[key])
        }
        state.issue.issueDetail.timeline.commentBodyHTMLAndReactions.data = state.issue.issueDetail.timeline.commentBodyHTMLAndReactions.data.concat(commentBodyHTMLAndReactionArr) 
    },

    [mutationType.MUTATION_REPOSITORY_RESOLVE_LAST_COMMIT_OF_CONTENT] (state,payload) {
        state.code.codeFile.fileDetail.lastCommit.data = payload.data
    },

    [mutationType.MUTATION_REPOSITORY_RESOLVE_CODE_COMMITS_COUNT_BY_BRANCH] (state,payload) {
        state.code.codeFile.countOfCommits.data = payload.data
    },

    [mutationType.MUTATION_REPOSITORY_RESOLVE_CONTRIBUTORS_OF_CONTENT] (state,payload) {
        state.code.codeFile.fileDetail.contributors.data = payload.data
    },

    [mutationType.MUTATION_REPOSITORY_RESOLVE_UPDATEDAT_OF_CONTENTS] (state,payload) {
        state.code.codeFile.data.forEach((item,index) => {
            Vue.set(state.code.codeFile.data,index,Object.assign({},item,{
                updatedAt: payload.data[`history${index}`].nodes[0].committedDate
            }))
        })
    },

    [CROSS_MUTATION_TRIGGER_LOADING](state,payload) {
        if(payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA) {
            state.code.loading = payload.loading
        }
        else if(payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_README_DATA) {
            state.code.readme.loading = payload.loading
        }
        else if(payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_PULSE_COMMIT_COUNT) {
            state.pulse.codeChanges.commitCount.loading = payload.loading
        }
        else if(payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA) {
            state.pulse.codeChanges.loading = payload.loading
        }
        else if(payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_BASIC_DATA) {
            state.basic.loading = payload.loading
        }
        else if(payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_COMMUNITY_DATA) {
            state.community.loading = payload.loading
        }
        else if(payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_UPDATEDAT_OF_CONTENTS) {
            state.code.codeFile.loadingUpdatedAtOfContents = payload.loading
        }
        /* else if(payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_ISSUES) {
            state[payload.meta.issueType][payload.meta.meta].loading = payload.loading
        }
        else if(payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_ISSUES_ADDITIONAL_DATA) {
            state[payload.meta.issueType][payload.meta.meta].loadingAdditionalData = payload.loading
        } */
        else if(payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_ISSUES_AVALIABLE_USERS) {
            state[payload.meta.issueType].associatedUsers[payload.meta.meta].loading = payload.loading
        }
        else if(payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_LABELS) {
            state.label.loading = payload.loading
        }
        else if(payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_CONTENTS_TREE) {
            state.code.codeFile.loading = payload.loading
        }
        else if(payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_COMMITS_COUNT_BY_BRANCH) {
            state.code.codeFile.countOfCommits.loading = payload.loading
        }
        else if(payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_CONTENT_CONTRIBUTORS) {
            state.code.codeFile.fileDetail.contributors.loading = payload.loading
        }
        else if(payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_CONTENTS_BLOB) {
            state.code.codeFile.fileDetail.loading = payload.loading
        }
        else if(payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_ISSUE_DETAIL_DATA) {
            state.issue.issueDetail.loading = payload.loading
        }
        else if(payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_ISSUE_BODY) {
            state.issue.issueDetail.body.loading = payload.loading
        }
        else if(payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_ISSUE_PROJECTS) {
            state.issue.issueDetail.projects.loading = payload.loading
        }
        else if(payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_ISSUE_TIMELINE) {
            state.issue.issueDetail.timeline.loading = payload.loading
        }
        else if(payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_ISSUE_TIMELINE_COMMENT_BODY_HTML) {
            state.issue.issueDetail.timeline.commentBodyHTML.loading = payload.loading
        }
        
      /*   else if(payload.actionType === ACTOIN_REPOSITORY_REQUEST_ISSUE_DETAIL_ADDITIONAL_DATA) {
            state.issue.issueDetail.loadingAdditionalData = payload.loading
        } */
        else if(payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_PROJECTS_DATA) {
            if(!payload.meta.getMoreData){
                state.projects.loading = payload.loading
            }else{
                state.projects.loadingMore = payload.loading
            }
        }
        else if(payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_REST || payload.actionType === actionType.ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_GRAPHQL) {
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