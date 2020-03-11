import {
    ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA,
    ACTION_REPOSITORY_REQUEST_BASIC_DATA,
    /* ACTION_REPOSITORY_REQUEST_ISSUES,
    ACTION_REPOSITORY_REQUEST_ISSUES_ADDITIONAL_DATA, */
    ACTION_REPOSITORY_REQUEST_ISSUES_AVALIABLE_USERS,
   /*  ACTION_REPOSITORY_REQUEST_ISSUE_BODY,
    ACTION_REPOSITORY_REQUEST_ISSUE_TIMELINE,
    ACTION_REPOSITORY_REQUEST_ISSUE_TIMELINE_COMMENT_BODY_HTML_AND_REACTIONS,
    ACTION_REPOSITORY_REQUEST_ISSUE_PROJECTS, */
    ACTION_REPOSITORY_REQUEST_LABELS,
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
    ACTION_REPOSITORY_REQUEST_ISSUE_DETAIL_DATA,
    ACTION_REPOSITORY_REQUEST_README_DATA} from './actionTypes'
import { handleException,commitTriggerLoadingMutation,cancelAndUpdateAxiosCancelTokenSource } from '../util'
import {authRequiredGitHubGraphqlApiQuery, authRequiredGet, authRequiredPost} from '../network'
import { 
    GRAPHQL_REPOSITORY_BASIC_INFO,
    GRAPHQL_REPOSITORY_CODE_BASIC_INFO,
    GRAPHQL_REPOSITORY_COMMITS_COUNT_BY_BRANCH,
    GRAPHQL_REPOSITORY_PROJECTS,
    GRAPHQL_REPOSITORY_ISSUES,
    GRAPHQL_ISSUE_PROJECTS,
    GRAPHQL_REPOSITORY_GET_ISSUES_FOR_LABELS,
    GRAPHQL_ISSUE_COMMENT_BODY_AND_REACTIONS,
    GRAPHQL_ISSUE_BODY,
    GRAPHQL_USER,
    GRAPHQL_REPOSITORY_CONTENT_AND_LAST_COMMIT_AND_COMMIT_HISTORY,
    GRAPHQL_REPOSITORY_LAST_COMMITDATE_BY_PATH,
    GRAPHQL_REPOSITORY_CONTENTS,
    GRAPHQL_SEARCH_FOR_ISSUES_COUNT_BY_ASSOCIATE_USER,
    GRAPHQL_REPOSITORY_ISSUES_BY_NUMBERS,
    GRAPHQL_REPOSITORY_GET_USER_NAME_BY_LOGIN} from './graphql'
/* import {
    mutationType.MUTATION_REPOSITORY_CODE_RESOLVE_BASIC_INFO,
    mutationType.MUTATION_REPOSITORY_RESOLVE_CONTRIBUTORS_LIST,
    mutationType.MUTATION_REPOSITORY_RESOLVE_ISSUES_AVALIABLE_USERS,
    mutationType.MUTATION_REPOSITORY_RESOLVE_ISSUE_DETAIL_DATA,
    mutationType.MUTATION_REPOSITORY_RESOLVE_ISSUE_BODY,
    mutationType.MUTATION_REPOSITORY_RESOLVE_ISSUE_TIMELINE,
    mutationType.MUTATION_REPOSITORY_RESOLVE_ISSUE_COMMENT_BODY_AND_REACTIONS,
    mutationType.MUTATION_REPOSITORY_RESOLVE_LABELS,
    mutationType.MUTATION_REPOSITORY_RESOLVE_PROJECTS,
    mutationType.MUTATION_REPOSITORY_RESOLVE_BASIC_DATA,
    mutationType.MUTATION_REPOSITORY_PULSE_RESOLVE_COMMIT_COUNT,
    mutationType.MUTATION_REPOSITORY_RESOLVE_PULSE_ISSUES,
    mutationType.MUTATION_REPOSITORY_RESOLVE_UPDATEDAT_OF_CONTENTS,
    mutationType.MUTATION_REPOSITORY_RESOLVE_COMMUNITY_DATA,
    mutationType.MUTATION_REPOSITORY_RESOLVE_CONTENTS_TREE,
    mutationType.MUTATION_REPOSITORY_RESOLVE_CONTENTS_BLOB,
    mutationType.MUTATION_REPOSITORY_RESOLVE_CONTRIBUTORS_OF_CONTENT,
    mutationType.MUTATION_REPOSITORY_RESOLVE_LAST_COMMIT_OF_CONTENT,
    mutationType.MUTATION_REPOSITORY_RESOLVE_CODE_COMMITS_COUNT_BY_BRANCH,
    mutationType.MUTATION_REPOSITORY_RESOLVE_README_DATA} from './mutationTypes' */
import * as mutationType from './mutationTypes'
import {
    API_README,API_REPOSITORY_STATISTIC_CONTRIBUTOR_LIST, 
    API_SEARCH,API_REPOSITORY_COMMUNITY, 
    API_REPOSITORY_CONTRIBUTORS,
    API_REPO_LABELS,
    API_ISSUE,
    API_REPOSITORY_COMMITS, 
    API_CONTENTS,
    API_ISSUE_TIMELINE} from '../api'
import {util_dateFormat,util_analyseFileType} from '../../../util'
var parse = require('parse-link-header');
export default {
    async [ACTION_REPOSITORY_REQUEST_BASIC_DATA](context,payload) {
        try{
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_BASIC_DATA)
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_BASIC_DATA,true)
            const res = await authRequiredGitHubGraphqlApiQuery(GRAPHQL_REPOSITORY_BASIC_INFO(payload.owner,payload.repo),{cancelToken})
            context.commit({
                type: mutationType.MUTATION_REPOSITORY_RESOLVE_BASIC_DATA,
                data: res.data.data.repository
            })
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_BASIC_DATA,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_BASIC_DATA,false)
            handleException(e)
        }
    },
    //deprecated
    //deprecated
    //deprecated
    //deprecated
    async [ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA] (context,payload) {
        try{
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA)
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA,true)

            const res = await authRequiredGitHubGraphqlApiQuery(GRAPHQL_REPOSITORY_CODE_BASIC_INFO(payload.owner,payload.repo),{cancelToken})
            context.commit({
                type: mutationType.MUTATION_REPOSITORY_CODE_RESOLVE_BASIC_INFO,
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
                type: mutationType.MUTATION_REPOSITORY_RESOLVE_README_DATA,
                data: res_readme.data
            })
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_README_DATA,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_README_DATA,false)
            handleException(e,{throwNetworkErrorToComponent: true})
        }
    },

    /* async [ACTION_REPOSITORY_REQUEST_ISSUES] (context,payload) {
        payload = {
            changePage: false,
            forward: true,
            issueType: "issues",
            meta: "open",
            ...payload
        }
        console.log(payload)
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUES,true,payload)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_ISSUES + payload.repo + payload.owner + payload.meta)
            const perPage = context.rootState.repository[payload.issueType][payload.meta].perPage
            const pageInfo = context.rootState.repository[payload.issueType][payload.meta].pageInfo
            const login = context.rootState.oauth.viewerInfo.login

            let url
            if(payload.changePage){
                if(payload.forward) {
                    url = pageInfo.next.url
                }else{
                    url = pageInfo.prev.url
                }
            } else {
                url = API_SEARCH('issues',{
                    sort: 'created',
                    order: 'desc',
                    q: `repo:${payload.owner}/${payload.repo} is:${payload.issueType === 'issues' ? 'issue' : 'pullRequest'} ${payload.meta === 'yours' ? 'state:open author:' + login : 'state:' + payload.meta}`,
                    per_page: perPage,
                })
            }

            const res_rest = await authRequiredGet(url,{cancelToken})
            const linkParsed = parse(res_rest.headers.link)
            context.commit({
                type: mutationType.MUTATION_REPOSITORY_RESOLVE_ISSUES,
                totalCount: res_rest.data.total_count,
                data: res_rest.data.items,
                pageInfo: linkParsed,
                ...payload
            })

            context.dispatch({
                type: ACTION_REPOSITORY_REQUEST_ISSUES_ADDITIONAL_DATA,
                issues: res_rest.data.items,
                ...payload
            })

            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUES,false,payload)
        }catch (e) {
            handleException(e)
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUES,false,payload)
        }
    }, */

    /* async [ACTION_REPOSITORY_REQUEST_ISSUES_ADDITIONAL_DATA] (context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUES_ADDITIONAL_DATA,true,payload)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_ISSUES_ADDITIONAL_DATA + payload.repo + payload.owner + payload.meta)
            
            const numbers = []
            payload.issues.forEach(item => {
                numbers.push(item.number)
            })
            const graphQL = GRAPHQL_REPOSITORY_ISSUES_BY_NUMBERS({
                numbers,
                ...payload
            })
            console.log(graphQL)
            const res_graphQL = await authRequiredGitHubGraphqlApiQuery(graphQL,{cancelToken})
            let dataArr = []
            if(res_graphQL.data.data) {
                for(let key in res_graphQL.data.data.repository) {
                    dataArr.push(res_graphQL.data.data.repository[key])
                }
            }

            context.commit({
                data: dataArr,
                ...payload,
                type: mutationType.MUTATION_REPOSITORY_RESOLVE_ISSUES_ADDITIONAL_DATA
            })
            
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUES_ADDITIONAL_DATA,false,payload)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUES_ADDITIONAL_DATA,false,payload)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    }, */


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
                type: mutationType.MUTATION_REPOSITORY_RESOLVE_PROJECTS,
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

    //deprecated
    //deprecated
    //deprecated
    //deprecated
    async [ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA](context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA,true)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA)
            
            const url = API_REPOSITORY_STATISTIC_CONTRIBUTOR_LIST(payload.owner,payload.repo)
            const res = await authRequiredGet(url,{cancelToken})
            context.commit({
                type: mutationType.MUTATION_REPOSITORY_RESOLVE_CONTRIBUTORS_LIST,
                data: res.data
            })
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_PULSE_CODE_STATISTIC_DATA,false)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    },
    //deprecated
    //deprecated
    //deprecated
    //deprecated
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
                type: mutationType.MUTATION_REPOSITORY_PULSE_RESOLVE_COMMIT_COUNT,
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
                type: mutationType.MUTATION_REPOSITORY_RESOLVE_PULSE_ISSUES,
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
                type: mutationType.MUTATION_REPOSITORY_RESOLVE_PULSE_ISSUES,
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
            const res = await authRequiredGet(url,
                {
                    cancelToken,
                    headers:{
                        "Accept":"application/vnd.github.black-panther-preview+json"
                    }
                }
            )
            
            context.commit({
                type: mutationType.MUTATION_REPOSITORY_RESOLVE_COMMUNITY_DATA,
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
                type: mutationType.MUTATION_REPOSITORY_RESOLVE_CONTENTS_TREE,
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
                type: mutationType.MUTATION_REPOSITORY_RESOLVE_UPDATEDAT_OF_CONTENTS,
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
                type: mutationType.MUTATION_REPOSITORY_RESOLVE_CODE_COMMITS_COUNT_BY_BRANCH,
                data: res.data.data.repository.ref.target.history.totalCount
            })
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_COMMITS_COUNT_BY_BRANCH,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_COMMITS_COUNT_BY_BRANCH,false)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    },

    //deprecated
    //deprecated
    //deprecated
    //deprecated
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
                if(item.author.user && contributorLogins.indexOf(item.author.user.login) === -1) {
                    contributorLogins.push(item.author.user.login)
                }
                if(!item.authoredByCommitter) {
                    if(contributorLogins.indexOf(item.committer.user && item.committer.user.login) === -1) {
                        contributorLogins.push(item.committer.user && item.committer.user.login)
                    }
                }
            })

            context.dispatch({
                type: ACTION_REPOSITORY_REQUEST_CONTENT_CONTRIBUTORS,
                contributorLogins,
                ...payload
            })

            context.commit({
                type: mutationType.MUTATION_REPOSITORY_RESOLVE_LAST_COMMIT_OF_CONTENT,
                data: res_graphQL.data.data.repository.commit.history.nodes[0]
            })

            if(!res_graphQL.data.data.repository.content.isBinary) {
                context.commit({
                    type: mutationType.MUTATION_REPOSITORY_RESOLVE_CONTENTS_BLOB,
                    data: res_graphQL.data.data.repository.content.text,
                    meta: 'text'
                })
                //查看是否返回html
                const url = API_CONTENTS(payload.owner,payload.repo,payload.path,payload.branch)
                const res = await authRequiredGet(url,{
                    headers: {
                        "Accept":"application/vnd.github.VERSION.html"
                    }
                })
                if(res.status === 200) {
                    context.commit({
                        type: mutationType.MUTATION_REPOSITORY_RESOLVE_CONTENTS_BLOB,
                        data: res.data,
                        meta: 'html'
                    })
                }
            }else{
                context.commit({
                    type: mutationType.MUTATION_REPOSITORY_RESOLVE_CONTENTS_BLOB,
                    data: `https://github.com/${payload.owner}/${payload.repo}/blob/${payload.branch}/${payload.path}?raw=true`,
                    meta: 'binary'
                })
            }
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_CONTENTS_BLOB,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_CONTENTS_BLOB,false)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    },

    //deprecated
    //deprecated
    //deprecated
    //deprecated
    async [ACTION_REPOSITORY_REQUEST_CONTENT_CONTRIBUTORS](context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_CONTENT_CONTRIBUTORS,true)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_CONTENT_CONTRIBUTORS)
          
            const graphQL = GRAPHQL_USER(payload.contributorLogins)
            const res_graphQL = await authRequiredGitHubGraphqlApiQuery(graphQL,{cancelToken})

            let contributors = []
            for(let key in res_graphQL.data.data) {
                contributors.push(res_graphQL.data.data[key])
            }

            context.commit({
                type: mutationType.MUTATION_REPOSITORY_RESOLVE_CONTRIBUTORS_OF_CONTENT,
                data: contributors
            })

            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_CONTENT_CONTRIBUTORS,false)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_CONTENT_CONTRIBUTORS,false)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_ISSUES_AVALIABLE_USERS](context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUES_AVALIABLE_USERS,true,payload)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_ISSUES_AVALIABLE_USERS + payload.meta + payload.repo)
            
            const url_contributors = API_REPOSITORY_CONTRIBUTORS(payload.owner,payload.repo) 
            const res_contributors = await authRequiredGet(url_contributors,{cancelToken})

            //console.log(res_contributors.data)
            const graphql = GRAPHQL_SEARCH_FOR_ISSUES_COUNT_BY_ASSOCIATE_USER({
                users: res_contributors.data,
                meta: payload.meta,
                query: payload.query
            })
            const res_graphql = await authRequiredGitHubGraphqlApiQuery(graphql,{cancelToken})
            //console.log(res_graphql.data.data)
            let contributors = []

            for(let key in res_graphql.data.data) {
                contributors.push(res_graphql.data.data[key])
            }

            let avaliableUsers = []
            contributors.forEach((item,index) => {
                if(item.issueCount > 0) avaliableUsers.push(res_contributors.data[index])
            })

            const graphql_userName = GRAPHQL_REPOSITORY_GET_USER_NAME_BY_LOGIN({
                users: avaliableUsers
            })

            const res_userName = await authRequiredGitHubGraphqlApiQuery(graphql_userName,{cancelToken})
            
            let userNameArr = []
            for(let key in res_userName.data.data){
                userNameArr.push(res_userName.data.data[key])
            }

            let withUserNameAvaliableUsers = []
            avaliableUsers.forEach((item,index) => {
                withUserNameAvaliableUsers.push(Object.assign(item,userNameArr[index]))
            })
            
            context.commit({
                ...payload,
                type: mutationType.MUTATION_REPOSITORY_RESOLVE_ISSUES_AVALIABLE_USERS,
                data: withUserNameAvaliableUsers
            })
            
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUES_AVALIABLE_USERS,false,payload)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUES_AVALIABLE_USERS,false,payload)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    },

    async [ACTION_REPOSITORY_REQUEST_LABELS](context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_LABELS,true,payload)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_LABELS + payload.meta + payload.repo)
            
            let url = API_REPO_LABELS(payload.owner,payload.repo)
            let res = await authRequiredGet(url,{cancelToken})

            context.commit({
                ...payload,
                type: mutationType.MUTATION_REPOSITORY_RESOLVE_LABELS,
                data: res.data
            })
            
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_LABELS,false,payload)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_LABELS,false,payload)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    },

   /*  async [ACTION_REPOSITORY_REQUEST_ISSUE_DETAIL_DATA](context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUE_DETAIL_DATA,true,payload)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_ISSUE_DETAIL_DATA)

            let url_issue = API_ISSUE(payload)
            
            let res_issue = await authRequiredGet(url_issue,{cancelToken})

            context.commit({
                type: mutationType.MUTATION_REPOSITORY_RESOLVE_ISSUE_DETAIL_DATA,
                data: res_issue.data
            })

            context.dispatch({
                ...payload,
                nodeId:  res_issue.data.node_id,
                type: ACTION_REPOSITORY_REQUEST_ISSUE_BODY
            })

            context.dispatch({
                ...payload,
                type: ACTION_REPOSITORY_REQUEST_ISSUE_TIMELINE
            })

            context.dispatch({
                ...payload,
                type: ACTION_REPOSITORY_REQUEST_ISSUE_PROJECTS
            })

            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUE_DETAIL_DATA,false,payload)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUE_DETAIL_DATA,false,payload)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    }, */

    /* async [ACTION_REPOSITORY_REQUEST_ISSUE_BODY](context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUE_BODY,true,payload)
            const cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_ISSUE_BODY)

            let graphql = GRAPHQL_ISSUE_BODY(payload)
            
            let res = await authRequiredGitHubGraphqlApiQuery(graphql,{cancelToken})

            context.commit({
                type: mutationType.MUTATION_REPOSITORY_RESOLVE_ISSUE_BODY,
                data: res.data.data
            })

            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUE_BODY,false,payload)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUE_BODY,false,payload)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    }, */

    /* async [ACTION_REPOSITORY_REQUEST_ISSUE_TIMELINE](context,payload) {
        payload = {
            forward: true,
            changePage: false,
            ...payload
        }
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUE_TIMELINE,true,payload)

            let url_issueTimeline

            if(payload.changePage) {
                if(payload.forward) {
                    url_issueTimeline = context.rootState.repository.issue.issueDetail.timeline.pageInfo.next.url
                } else {
                    url_issueTimeline = context.rootState.repository.issue.issueDetail.timeline.pageInfo.prev.url
                }
            }else{
                url_issueTimeline = API_ISSUE_TIMELINE(payload) + `?per_page=${context.rootState.repository.issue.issueDetail.timeline.perPage}`
            }

            let config = {
                headers:{
                    'Accept': 'application/vnd.github.mockingbird-preview,application/vnd.github.starfox-preview+json,application/vnd.github.VERSION.html'
                }   
            }

            let res_issueTimeline = await authRequiredGet(
                url_issueTimeline,
                config
            )

            let pageInfo = parse(res_issueTimeline.headers.link)

            let lastData = []
            if(!payload.changePage) {
                if(pageInfo && pageInfo.last) {
                    let res_issueTimeline_last = await authRequiredGet(pageInfo.last.url,config)
                    lastData = res_issueTimeline_last.data
                }
            }

            context.commit({
                data: res_issueTimeline.data,
                lastData,
                pageInfo,
                ...payload,
                type: mutationType.MUTATION_REPOSITORY_RESOLVE_ISSUE_TIMELINE
            })

            let commentArr = []
           
            res_issueTimeline.data.forEach(item => {
                if(item.event === 'commented') {
                    commentArr.push(item)
                }
            })
            lastData.forEach(item => {
                if(item.event === 'commented') {
                    commentArr.push(item)
                }
            })
            context.dispatch({
                type: ACTION_REPOSITORY_REQUEST_ISSUE_TIMELINE_COMMENT_BODY_HTML_AND_REACTIONS,
                comments: commentArr
            })

            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUE_TIMELINE,false,payload)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUE_TIMELINE,false,payload)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    }, */

    /* async [ACTION_REPOSITORY_REQUEST_ISSUE_TIMELINE_COMMENT_BODY_HTML_AND_REACTIONS](context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUE_TIMELINE_COMMENT_BODY_HTML_AND_REACTIONS,true,payload)
            
            let graphql = GRAPHQL_ISSUE_COMMENT_BODY_AND_REACTIONS(payload)
            
            let res = await authRequiredGitHubGraphqlApiQuery(graphql)

            context.commit({
                type: mutationType.MUTATION_REPOSITORY_RESOLVE_ISSUE_COMMENT_BODY_AND_REACTIONS,
                data: res.data.data
            })

            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUE_TIMELINE_COMMENT_BODY_HTML_AND_REACTIONS,false,payload)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUE_TIMELINE_COMMENT_BODY_HTML_AND_REACTIONS,false,payload)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    }, */
    
    /* async [ACTION_REPOSITORY_REQUEST_ISSUE_PROJECTS](context,payload) {
        try{
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUE_PROJECTS,true,payload)
            let cancelToken = cancelAndUpdateAxiosCancelTokenSource(ACTION_REPOSITORY_REQUEST_ISSUE_PROJECTS)
            
            let graphql = GRAPHQL_ISSUE_PROJECTS(payload)
            
            let res = await authRequiredGitHubGraphqlApiQuery(graphql,{cancelToken})

            context.commit({
                type: mutationType.MUTATION_REPOSITORY_RESOLVE_ISSUE_PROJECTS,
                data: res.data.data.repository.issue.projectCards.nodes
            })
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUE_PROJECTS,false,payload)
        }catch(e) {
            commitTriggerLoadingMutation(context,ACTION_REPOSITORY_REQUEST_ISSUE_PROJECTS,false,payload)
            handleException(e,{throwNetworkErrorToComponent:true})
        }
    }, */
}