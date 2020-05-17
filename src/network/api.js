import {util_queryParse} from "../util";

const CLIENT_ID = "125cb651f63615c6d362"
const SCOPE = "user repo repo_deployment repo:invite admin:repo_hook home admin:org admin:public_key admin:org_hook gist notifications delete_repo write:discussion read:discussion write:packages read:packages delete:packages admin:gpg_key workflow"
const GITHUB_REST_API_BASE = "https://api.github.com"

export const API_GRAPHQL_ENDPOINT = "https://api.github.com/graphql"

export const HOST = process.env.VUE_APP_HOST

export const API_TRENDING = (type,params) => {
    let query = util_queryParse.querify(params)
    return  `https://github-trending-api.now.sh/${type}?${query}`
}

export const API_ALL_SPOKEN_LANGUAGE = "https://github-trending-api.now.sh/spoken_languages"

export const API_ALL_LANGUAGE = "https://github-trending-api.now.sh/languages"

export const API_OAUTH2 = payload => {
    return `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}&state=${payload.state}`
}

export const API_OAUTH2_ACCESS_TOKEN = code => `http://127.0.0.1:8088/oauth2server/oauth2/access_token.do?code=${code}`

export const API_OAUTH2_REVOKE_ACCESS_TOKEN = accessToken => `http://127.0.0.1:8088/oauth2server/oauth2/revoke.do?accessToken=${accessToken}`

export const API_OAUTH2_USER_INFO = `${GITHUB_REST_API_BASE}/user`

export const API_EVENTS = `${GITHUB_REST_API_BASE}/events`

export const API_USER_EVENTS = (login,pararms) => {
    let query = util_queryParse.querify(pararms)
    return `${GITHUB_REST_API_BASE}/users/${login}/events?${query}`
}

export const API_USER_RECEIVED_EVENTS = user => `${GITHUB_REST_API_BASE}/users/${user}/received_events`

export const API_USER_ORG_EVENTS = (user,org) => `${GITHUB_REST_API_BASE}/users/${user}/events/orgs/${org}`

export const API_USER_NOTIFICATIONS = payload => {
    let query = util_queryParse.querify(payload)
    return `${GITHUB_REST_API_BASE}/notifications?${query}`
}

export const API_USER = login => `${GITHUB_REST_API_BASE}/users/${login}`

export const API_ORG = organization => `${GITHUB_REST_API_BASE}/orgs/${organization}`

export const API_ORG_PUBLIC_MEMBER = (organization,params) => {
    let query = util_queryParse.querify(params)
    return `${GITHUB_REST_API_BASE}/orgs/${organization}/public_members?${query}`
}

export const API_ORG_REPOS = (organization,params) => {
    let query = util_queryParse.querify(params)
    return `${GITHUB_REST_API_BASE}/orgs/${organization}/repos?${query}`
}

export const API_USER_STARRED_REPOS = (login,params) => {
    let query = util_queryParse.querify(params)
    return `${GITHUB_REST_API_BASE}/users/${login}/starred?${query}`
}

export const API_USER_FOLLOWERS = (login,params) => {
    let query = util_queryParse.querify(params)
    return `${GITHUB_REST_API_BASE}/users/${login}/followers?${query}`
}

export const API_USER_FOLLOWING = (login,params) => {
    let query = util_queryParse.querify(params)
    return `${GITHUB_REST_API_BASE}/users/${login}/following?${query}`
}


export const API_TOP_LANGUAGES = "https://api.github.com/repos/drujensen/fib/Hello-World/languages"

export const API_SEARCH = (type,param) => {
    let query = util_queryParse.querify(param)
    return `${GITHUB_REST_API_BASE}/search/${type}?${query}`
}

export const API_REPO = fullName => `${GITHUB_REST_API_BASE}/repos/${fullName}`

export const API_REPO_PROJECTS = (fullName,params) => {
    let query = util_queryParse.querify(params)
    return `${GITHUB_REST_API_BASE}/repos/${fullName}/projects?${query}`
}

export const API_REPO_LABELS = (owner,repo) => `${GITHUB_REST_API_BASE}/repos/${owner}/${repo}/labels?per_page=100`

export const API_README = (owner,repo) => `${GITHUB_REST_API_BASE}/repos/${owner}/${repo}/readme`

export const API_CONTENTS = (payload) => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/contents/${payload.path}${payload.branch?'?ref='+payload.branch:''}`

export const API_REPOSITORY_STATISTIC_CONTRIBUTOR_LIST = (owner,repo) => `${GITHUB_REST_API_BASE}/repos/${owner}/${repo}/stats/contributors`

export const API_REPOSITORY_COMMUNITY = (owner,repo) => `${GITHUB_REST_API_BASE}/repos/${owner}/${repo}/community/profile`

export const API_REPOSITORY_COMMITS = payload=> {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/commits?${query}`
}

export const API_REPOSITORY_BRANCHES = (owner,repo,params) => {
    let query = util_queryParse.querify(params)
    return `${GITHUB_REST_API_BASE}/repos/${owner}/${repo}/branches?${query}`
}

export const API_REPOSITORY_RELEASES = (owner,repo,params) => {
    let query = util_queryParse.querify(params)
    return `${GITHUB_REST_API_BASE}/repos/${owner}/${repo}/releases?${query}`
}

export const API_REPOSITORY_TAGS = (owner,repo,params) => {
    let query = util_queryParse.querify(params)
    return `${GITHUB_REST_API_BASE}/repos/${owner}/${repo}/tags?${query}`
}

export const API_REPOSITORY_RELEASE_BY_TAG_NAME = payload => {
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/releases/tags/${payload.tag}`
}

export const API_REPOSITORY_CONTRIBUTORS = (owner,repo) => {
    return `${GITHUB_REST_API_BASE}/repos/${owner}/${repo}/contributors`
}

export const API_REPOSITORY_SUBSCRIPTION = (owner,repo) => {
    return `${GITHUB_REST_API_BASE}/repos/${owner}/${repo}/subscription`
}

export const API_COMMITS_COMPARE = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/compare/${payload.base}...${payload.head}`

export const API_GIT_REF = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/git/ref/${payload.ref}`

export const API_GIT_MATCHING_REFS = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/git/matching-refs/${payload.ref}?${query}`
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
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/commits/${payload.sha}?${query}`
}

export const API_COMMITS = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/commits?${query}`
}

export const API_BRANCHES_FOR_HEAD_COMMIT = (payload) => {
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/commits/${payload.sha}/branches-where-head`
}

export const API_CHECK_IF_COLLABORATOR = payload => {
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/collaborators/${payload.login}`
}

export const API_PR_CHANGED_FILES = payload => {
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/pulls/${payload.number}/files`
}

export const API_TREE_LIST = payload => {
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/git/trees/${payload.sha}?recursive=1`
}

