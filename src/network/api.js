import {util_queryParse} from "../util";

const CLIENT_ID = "125cb651f63615c6d362"
const SCOPE = "user repo repo_deployment repo:invite admin:repo_hook home admin:org admin:public_key admin:org_hook gist notifications delete_repo write:discussion read:discussion write:packages read:packages delete:packages admin:gpg_key workflow"
const GITHUB_REST_API_BASE = "https://api.github.com"

export const API_GRAPHQL_ENDPOINT = "https://api.github.com/graphql"

export const HOST = process.env.VUE_APP_HOST

export const API_TRENDING = (language,since) => `https://github-trending-api.now.sh/repositories?language=${language}&since=${since}`

export const API_OAUTH2 = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`

export const API_OAUTH2_ACCESS_TOKEN = code => `http://127.0.0.1:8088/oauth2server/oauth2/access_token.do?code=${code}`

export const API_OAUTH2_USER_INFO = `${GITHUB_REST_API_BASE}/user`

export const API_EVENTS = `${GITHUB_REST_API_BASE}/events`

export const API_USER_EVENTS = user => `${GITHUB_REST_API_BASE}/users/${user}/events`

export const API_USER_RECEIVED_EVENTS = user => `${GITHUB_REST_API_BASE}/users/${user}/received_events`

export const API_USER_ORG_EVENTS = (user,org) => `${GITHUB_REST_API_BASE}/users/${user}/events/orgs/${org}`

export const API_USER_NOTIFICATIONS = `${GITHUB_REST_API_BASE}/notifications?all=true`

export const API_TOP_LANGUAGES = "https://api.github.com/repos/drujensen/fib/Hello-World/languages"

export const API_SEARCH = (type,param) => {
    let query = util_queryParse.querify(param)
    return `${GITHUB_REST_API_BASE}/search/${type}?${query}`
}

export const API_REPO = (owner,repo) => `${GITHUB_REST_API_BASE}/repos/${owner}/${repo}`

export const API_REPO_LABELS = (owner,repo) => `${GITHUB_REST_API_BASE}/repos/${owner}/${repo}/labels?per_page=100`

export const API_README = (owner,repo) => `${GITHUB_REST_API_BASE}/repos/${owner}/${repo}/readme`

export const API_CONTENTS = (owner,repo,path,branch) => `${GITHUB_REST_API_BASE}/repos/${owner}/${repo}/contents/${path}${branch?'?ref='+branch:''}`

export const API_REPOSITORY_STATISTIC_CONTRIBUTOR_LIST = (owner,repo) => `${GITHUB_REST_API_BASE}/repos/${owner}/${repo}/stats/contributors`

export const API_REPOSITORY_COMMUNITY = (owner,repo) => `${GITHUB_REST_API_BASE}/repos/${owner}/${repo}/community/profile`

export const API_REPOSITORY_COMMITS = (owner,repo,params) => {
    let query = util_queryParse.querify(params)
    return `${GITHUB_REST_API_BASE}/repos/${owner}/${repo}/commits?${query}`
}

export const API_REPOSITORY_CONTRIBUTORS = (owner,repo) => {
    return `${GITHUB_REST_API_BASE}/repos/${owner}/${repo}/contributors`
}

export const API_ISSUE = (payload) => {
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/issues/${payload.number}`
}

export const API_ISSUE_TIMELINE = (payload) => {
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/issues/${payload.number}/timeline`
}

export const API_PULLREQUEST = (payload) => {
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/pulls/${payload.number}`
}

export const API_PULL_REQUEST_REVIEW_COMMENT = (payload) => {
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/pulls/${payload.number}/comments?sort=created&direction=asc${payload.perPage ? '&per_page=' + payload.perPage : ''}`
}


export const API_COMMIT = (payload) => {
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/commits/${payload.sha}`
}

export const API_BRANCHES_FOR_HEAD_COMMIT = (payload) => {
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/commits/${payload.sha}/branches-where-head`
}

export const API_CHECK_IF_COLLABORATOR = payload => {
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/collaborators/${payload.login}`
}