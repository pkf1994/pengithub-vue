import {
    ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA,
    ACTION_REPOSITORY_REQUEST_BASIC_DATA,
    ACTION_REPOSITORY_REQUEST_ISSUES,
    ACTION_REPOSITORY_REQUEST_PROJECTS_DATA,
    ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA,
    ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_REST,
    ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_GRAPHQL,
    ACTION_REPOSITORY_REQUEST_COMMUNITY_DATA,
    ACTION_REPOSITORY_REQUEST_CONTENTS_TREE,
    ACTION_REPOSITORY_REQUEST_COMMITS_COUNT_BY_BRANCH,
    ACTION_REPOSITORY_REQUEST_CONTENTS_BLOB,
    ACTION_REPOSITORY_REQUEST_UPDATEDAT_OF_CONTENTS,
    ACTION_REPOSITORY_REQUEST_CONTENT_CONTRIBUTORS,
    ACTION_REPOSITORY_REQUEST_PULSE_COMMIT_COUNT,
    ACTION_REPOSITORY_REQUEST_README_DATA} from './actionTypes'
import { handleException,commitTriggerLoadingMutation,cancelAndUpdateAxiosCancelTokenSource } from '../util'
import {authRequiredGitHubGraphqlApiQuery, authRequiredGet, authRequiredPost} from '../network'
import { 
    GRAPHQL_REPOSITORY_BASIC_INFO,
    GRAPHQL_REPOSITORY_CODE_BASIC_INFO,
    GRAPHQL_REPOSITORY_COMMITS_COUNT_BY_BRANCH,
    GRAPHQL_REPOSITORY_PROJECTS,
    GRAPHQL_REPOSITORY_ISSUES,
    GRAPHQL_USER,
    GRAPHQL_REPOSITORY_CONTENT_AND_LAST_COMMIT_AND_COMMIT_HISTORY,
    GRAPHQL_REPOSITORY_LAST_COMMITDATE_BY_PATH,
    GRAPHQL_REPOSITORY_CONTENTS} from './graphql'
import {
    MUTATION_REPOSITORY_CODE_RESOLVE_BASIC_INFO,
    MUTATION_REPOSITORY_RESOLVE_CONTRIBUTORS_LIST,
    MUTATION_REPOSITORY_RESOLVE_ISSUES,
    MUTATION_REPOSITORY_RESOLVE_PROJECTS,
    MUTATION_REPOSITORY_RESOLVE_BASIC_DATA,
    MUTATION_REPOSITORY_PULSE_RESOLVE_COMMIT_COUNT,
    MUTATION_REPOSITORY_RESOLVE_PULSE_ISSUES,
    MUTATION_REPOSITORY_RESOLVE_UPDATEDAT_OF_CONTENTS,
    MUTATION_REPOSITORY_RESOLVE_COMMUNITY_DATA,
    MUTATION_REPOSITORY_RESOLVE_CONTENTS_TREE,
    MUTATION_REPOSITORY_RESOLVE_CONTENTS_BLOB,
    MUTATION_REPOSITORY_RESOLVE_CONTRIBUTORS_OF_CONTENT,
    MUTATION_REPOSITORY_RESOLVE_LAST_COMMIT_OF_CONTENT,
    MUTATION_REPOSITORY_RESOLVE_CODE_COMMITS_COUNT_BY_BRANCH,
    MUTATION_REPOSITORY_RESOLVE_README_DATA} from './mutationTypes'
import {API_README,API_REPOSITORY_STATISTIC_CONTRIBUTOR_LIST, API_SEARCH,API_REPOSITORY_COMMUNITY, API_REPOSITORY_COMMITS, API_CONTENTS} from '../api'
import {util_dateFormat,util_analyseFileType} from '../../../util'
var parse = require('parse-link-header');
export default {
    async [ACTION_REPOSITORY_REQUEST_BASIC_DATA](context,payload) {
        try{
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_BASIC_DATA)
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_BASIC_DATA,true)
            const res = await authRequiredGitHubGraphqlApiQuery(GRAPHQL_REPOSITORY_BASIC_INFO(payload.owner,payload.repo),{cancelToken})
            context.commit({
                type: MUTATION_REPOSITORY_RESOLVE_BASIC_DATA,
                data: res.data.data.repository
            })
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_BASIC_DATA,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_BASIC_DATA,false)
            handleException(e)
        }
    },

    async [ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA] (context,payload) {
        try{
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA)
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA,true)

            const res = await authRequiredGitHubGraphqlApiQuery(GRAPHQL_REPOSITORY_CODE_BASIC_INFO(payload.owner,payload.repo),{cancelToken})
            context.commit({
                type: MUTATION_REPOSITORY_CODE_RESOLVE_BASIC_INFO,
                data: res.data.data.repository
            })
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA,false)
            handleException(e,{throwNetworkErrorToComponent: true})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_README_DATA] (context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_README_DATA,true)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_README_DATA)
            const config  = {
                cancelToken,
                headers: {
                    "Accept": "application/vnd.github.VERSION.html"
                }
            }
            const res_readme = await authRequiredGet(API_README(payload.owner,payload.repo),config)

            context.commit({
                type: MUTATION_REPOSITORY_RESOLVE_README_DATA,
                data: res_readme.data
            })
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_README_DATA,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_README_DATA,false)
            handleException(e,{throwNetworkErrorToComponent: true})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_ISSUES] (context,payload) {
        payload = {
            changePage: false,
            forward: true,
            issueType: "issue",
            state: "open",
            ...payload
        }
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUES,true, {issueType: payload.issueType,state:payload.state})
            const perPage = context.rootState.repository[payload.issueType][payload.state].perPage
            const after = context.rootState.repository[payload.issueType][payload.state].pageInfo.endCursor
            const before = context.rootState.repository[payload.issueType][payload.state].pageInfo.startCursor
            const login = context.rootState.oauth.viewerInfo.login
            let _payload = {
                issueType: payload.issueType,
                login: login,
                state: payload.state,
                ...payload
            }
            if(!payload.changePage) {
                _payload = {
                    perPage,
                    ..._payload
                }
            }else{
                _payload = payload.forward ? {perPage,after,..._payload} : {perPage,before,..._payload}
            }

            let graphQL = GRAPHQL_REPOSITORY_ISSUES(_payload)
            const res = await authRequiredGitHubGraphqlApiQuery(graphQL)
            let data = res.data.data.search
            context.commit({
                type: MUTATION_REPOSITORY_RESOLVE_ISSUES,
                totalCount: data.issueCount,
                ...payload,
                ...data
            })

            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUES,false,{issueType: payload.issueType,state:payload.state})
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUES,false,{issueType: payload.issueType,state:payload.state})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_PROJECTS_DATA] (context,payload) {
        payload = {
            getMoreData: false,
            ...payload
        }
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PROJECTS_DATA,true,{getMoreData:payload.getMoreData})
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_PROJECTS_DATA)
            const search = context.rootState.repository.projects.searchQuery
            const perPage = context.rootState.repository.projects.perPage
            const after = context.rootState.repository.projects.pageInfo.endCursor

            let _payload = {
                ...payload,
                perPage,
                after,
                search
            }

            const graphQL = GRAPHQL_REPOSITORY_PROJECTS(_payload)
            const res = await authRequiredGitHubGraphqlApiQuery(graphQL,{cancelToken})

            context.commit({
                type: MUTATION_REPOSITORY_RESOLVE_PROJECTS,
                data: res.data.data.repository.projects,
                totalCountOpen: res.data.data.repository.totalCountOpen.totalCount,
                totalCountOpenWithoutSearchQuery: res.data.data.repository.totalCountOpenWithoutSearchQuery.totalCount,
                totalCountClosed: res.data.data.repository.totalCountClosed.totalCount,
                ...payload
            })
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PROJECTS_DATA,false,{getMoreData:payload.getMoreData})
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PROJECTS_DATA,false,{getMoreData:payload.getMoreData})
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA](context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA,true)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA)
            
            const url = API_REPOSITORY_STATISTIC_CONTRIBUTOR_LIST(payload.owner,payload.repo)
            const res = await authRequiredGet(url,{cancelToken})
            context.commit({
                type: MUTATION_REPOSITORY_RESOLVE_CONTRIBUTORS_LIST,
                data: res.data
            })
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA,false)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_PULSE_COMMIT_COUNT](context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_COMMIT_COUNT,true)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_PULSE_COMMIT_COUNT)
            
            let commitAfterDate = new Date(Date.parse(new Date()) - 7 * 24 * 3600000) 
            const url = API_SEARCH('commits',{
                q: `repo:${payload.owner}/${payload.repo} committer-date:>${util_dateFormat.dateFormat('yyyy-MM-dd',commitAfterDate)}`,
            })
            const res = await authRequiredGet(url,{cancelToken,headers:{"Accept":"application/vnd.github.cloak-preview"}})
            
            context.commit({
                type: MUTATION_REPOSITORY_PULSE_RESOLVE_COMMIT_COUNT,
                data: res.data.total_count
            })

            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_COMMIT_COUNT,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_COMMIT_COUNT,false)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_GRAPHQL](context,payload) {
        payload = {
            howLongTrackBack: 'weekly',
            state: 'closed',
            issueType: 'pullRequest',
            getMoreData: false,
            ...payload
        }
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_GRAPHQL,true,payload)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_GRAPHQL)
            const after = context.rootState.repository.pulse.pullsMerged.pageInfo.endCursor
            let dateAfter
            if(payload.howLongTrackBack === 'monthly') {
                dateAfter = util_dateFormat.dateFormat('yyyy-MM-dd',new Date(Date.parse(new Date()) - 30 * 24 * 3600000))
            }else{
                dateAfter = util_dateFormat.dateFormat('yyyy-MM-dd',new Date(Date.parse(new Date()) - 7 * 24 * 3600000)) 
            }

            let _payload
            if(payload.getMoreData) {
                _payload = {
                    after,
                    ...payload
                }
            }else {
                _payload = {
                    ...payload
                }
            }

            let graphQL
            if(payload.state === 'closed') {
                if(payload.issueType === 'pullRequest') {
                    graphQL = GRAPHQL_REPOSITORY_ISSUES({mergedAfter:dateAfter,..._payload})
                }else{
                    graphQL = GRAPHQL_REPOSITORY_ISSUES({closedAfter:dateAfter,..._payload})
                }
            }else{
                graphQL = GRAPHQL_REPOSITORY_ISSUES({createdAfter:dateAfter,..._payload})
            }

            const res = await authRequiredGitHubGraphqlApiQuery(graphQL,{cancelToken})
            context.commit({
                type: MUTATION_REPOSITORY_RESOLVE_PULSE_ISSUES,
                data: res.data.data.search,
                from: 'graphql',
                ...payload
            })

            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_GRAPHQL,false,payload)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_GRAPHQL,false,payload)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_REST](context,payload) {
        payload = {
            howLongTrackBack: 'weekly',
            state: 'closed',
            issueType: 'pullRequest',
            getMoreData: false,
            ...payload
        }
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_REST,true,payload)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_REST + payload.meta)
            const perPage = context.rootState.repository.pulse[payload.meta].perPage
            let dateAfter
            if(payload.howLongTrackBack === 'monthly') {
                dateAfter = util_dateFormat.dateFormat('yyyy-MM-dd',new Date(Date.parse(new Date()) - 30 * 24 * 3600000))
            }else{
                dateAfter = util_dateFormat.dateFormat('yyyy-MM-dd',new Date(Date.parse(new Date()) - 7 * 24 * 3600000)) 
            }
            

            let url
            if(payload.getMoreData) {
                url = context.rootState.repository.pulse[payload.meta].pageInfo.next.url
            }else{
                let dateLimitQueryFragment 
                if(payload.issueType === 'pullRequest') {
                    if(payload.state === 'closed') {
                        dateLimitQueryFragment = `merged:>${dateAfter}`
                    }else{
                        dateLimitQueryFragment = `created:>${dateAfter}`
                    }
                }else{
                    if(payload.state === 'closed') {
                        dateLimitQueryFragment = `closed:>${dateAfter}`
                    }else{
                        dateLimitQueryFragment = `created:>${dateAfter}`
                    }
                }
                url = API_SEARCH('issues',{
                    q:`repo:${payload.owner}/${payload.repo} type:${payload.issueType === 'issue' ? 'issue' : 'pr'} state:${payload.state} ${dateLimitQueryFragment}`,
                    per_page: perPage
                })

            }

            const res = await authRequiredGet(url,{cancelToken})
            const linkParsed = parse(res.headers.link)
            context.commit({
                type: MUTATION_REPOSITORY_RESOLVE_PULSE_ISSUES,
                data: res.data,
                pageInfo: linkParsed,
                from: 'rest',
                ...payload
            })

            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_REST,false,payload)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_ISSUES_FROM_REST,false,payload)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_COMMUNITY_DATA](context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_COMMUNITY_DATA,true)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_COMMUNITY_DATA)
            
          
            const url = API_REPOSITORY_COMMUNITY(payload.owner,payload.repo)
            const res = await authRequiredGet(url,{cancelToken,headers:{"Accept":"application/vnd.github.black-panther-preview+json"}})
            
            context.commit({
                type: MUTATION_REPOSITORY_RESOLVE_COMMUNITY_DATA,
                data: res.data
            })

            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_COMMUNITY_DATA,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_COMMUNITY_DATA,false)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_CONTENTS_TREE] (context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_CONTENTS_TREE,true)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_CONTENTS_TREE)
          
            const graphQL = GRAPHQL_REPOSITORY_CONTENTS(payload) 

            const res = await authRequiredGitHubGraphqlApiQuery(graphQL,{cancelToken})
            context.commit({
                type: MUTATION_REPOSITORY_RESOLVE_CONTENTS_TREE,
                data: res.data.data.repository.object.entries
            })

            context.dispatch({
                type: ACTION_REPOSITORY_REQUEST_UPDATEDAT_OF_CONTENTS,
                contents: res.data.data.repository.object.entries,
                ...payload
            })
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_CONTENTS_TREE,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_CONTENTS_TREE,false)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_UPDATEDAT_OF_CONTENTS](context,payload) {
        
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_UPDATEDAT_OF_CONTENTS,true)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_UPDATEDAT_OF_CONTENTS)
          
            const graphQL = GRAPHQL_REPOSITORY_LAST_COMMITDATE_BY_PATH(payload) 

            const res = await authRequiredGitHubGraphqlApiQuery(graphQL,{cancelToken})
            context.commit({
                type: MUTATION_REPOSITORY_RESOLVE_UPDATEDAT_OF_CONTENTS,
                data: res.data.data.repository.object
            })
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_UPDATEDAT_OF_CONTENTS,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_UPDATEDAT_OF_CONTENTS,false)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_COMMITS_COUNT_BY_BRANCH](context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_COMMITS_COUNT_BY_BRANCH,true)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_COMMITS_COUNT_BY_BRANCH)
          
            const graphQL = GRAPHQL_REPOSITORY_COMMITS_COUNT_BY_BRANCH({
                owner: payload.owner,
                repo: payload.repo,
                branch: payload.branch
            }) 

            const res = await authRequiredGitHubGraphqlApiQuery(graphQL,{cancelToken})
            context.commit({
                type: MUTATION_REPOSITORY_RESOLVE_CODE_COMMITS_COUNT_BY_BRANCH,
                data: res.data.data.repository.ref.target.history.totalCount
            })
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_COMMITS_COUNT_BY_BRANCH,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_COMMITS_COUNT_BY_BRANCH,false)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_CONTENTS_BLOB](context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_CONTENTS_BLOB,true)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_CONTENTS_BLOB)
          
            const graphQL = GRAPHQL_REPOSITORY_CONTENT_AND_LAST_COMMIT_AND_COMMIT_HISTORY({
                ...payload
            })
            const res_graphQL = await authRequiredGitHubGraphqlApiQuery(graphQL,{cancelToken})

            let contributorLogins = []

            res_graphQL.data.data.repository.commitHistory.history.nodes.forEach(item => {
                if(contributorLogins.indexOf(item.author.user.login) === -1) {
                    contributorLogins.push(item.author.user.login)
                }
                if(!item.authoredByCommitter) {
                    if(contributorLogins.indexOf(item.committer.user.login) === -1) {
                        contributorLogins.push(item.committer.user.login)
                    }
                }
            })

            context.dispatch({
                type: ACTION_REPOSITORY_REQUEST_CONTENT_CONTRIBUTORS,
                contributorLogins,
                ...payload
            })

            context.commit({
                type: MUTATION_REPOSITORY_RESOLVE_LAST_COMMIT_OF_CONTENT,
                data: res_graphQL.data.data.repository.commit.history.nodes[0]
            })

            if(!res_graphQL.data.data.repository.content.isBinary) {
                context.commit({
                    type: MUTATION_REPOSITORY_RESOLVE_CONTENTS_BLOB,
                    data: res_graphQL.data.data.repository.content.text
                })
            }
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_CONTENTS_BLOB,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_CONTENTS_BLOB,false)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_CONTENT_CONTRIBUTORS](context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_CONTENT_CONTRIBUTORS,true)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_CONTENT_CONTRIBUTORS)
          
            const graphQL = GRAPHQL_USER(payload.contributorLogins)
            const res_graphQL = await authRequiredGitHubGraphqlApiQuery(graphQL,{cancelToken})

            console.log(res_graphQL.data.data)
            let contributors = []
            for(let key in res_graphQL.data.data) {
                contributors.push(res_graphQL.data.data[key])
            }

            context.commit({
                type: MUTATION_REPOSITORY_RESOLVE_CONTRIBUTORS_OF_CONTENT,
                data: contributors
            })

            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_CONTENT_CONTRIBUTORS,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_CONTENT_CONTRIBUTORS,false)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    }
}