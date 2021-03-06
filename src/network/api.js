import {util_queryParse} from "../util";

const CLIENT_ID = "125cb651f63615c6d362"
const SCOPE = "user public_repo repo repo_deployment repo:status read:repo_hook read:org read:public_key read:gpg_key repo:invite admin:repo_hook home admin:org admin:public_key admin:org_hook gist notifications delete_repo write:discussion read:discussion write:packages read:packages delete:packages admin:gpg_key workflow"
const GITHUB_REST_API_BASE = "https://api.github.com"
const BACK_END_API_BASE = "http://127.0.0.1:8088"
export const PROXY_API_BASE = "http://127.0.0.1:8888"

export const API_GRAPHQL_ENDPOINT = "https://api.github.com/graphql"

export const HOST = process.env.VUE_APP_HOST

export const GITHUB_TRENDING_API = 'http://127.0.0.1:8887'

export const API_TRENDING = (type,params) => {
    let query = util_queryParse.querify(params)
    return  `${GITHUB_TRENDING_API}/${type}?${query}`
}


export const API_ALL_SPOKEN_LANGUAGE = `${GITHUB_TRENDING_API}/spoken_languages`

export const API_ALL_LANGUAGE = `${GITHUB_TRENDING_API}/languages`

export const API_OAUTH2 = payload => {
    return `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}&state=${payload.state}`
}


export const API_OAUTH2_ACCESS_TOKEN = code => `${BACK_END_API_BASE}/oauth2server/oauth2/access_token.do?code=${code}`

export const API_OAUTH2_REVOKE_ACCESS_TOKEN = accessToken => `${BACK_END_API_BASE}/oauth2server/oauth2/revoke.do?accessToken=${accessToken}`

export const API_PROXY = payload => `${BACK_END_API_BASE}/oauth2server/proxy/proxy.do?url=${payload}`

export const API_OAUTH2_USER_INFO = `${GITHUB_REST_API_BASE}/user`

export const API_EVENTS = `${GITHUB_REST_API_BASE}/events`

export const API_USER_EVENTS = (login,pararms) => {
    let query = util_queryParse.querify(pararms)
    return `${GITHUB_REST_API_BASE}/users/${login}/events?${query}`
}

export const API_USER_RECEIVED_EVENTS = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/users/${payload.user}/received_events?${query}`
}

export const API_USER_ORG_EVENTS = (user,org) => `${GITHUB_REST_API_BASE}/users/${user}/events/orgs/${org}`

export const API_USER_NOTIFICATIONS = payload => {
    let query = util_queryParse.querify(payload)
    return `${GITHUB_REST_API_BASE}/notifications?${query}`
}

export const API_USER_NOTIFICATION_THREAD = payload => `${GITHUB_REST_API_BASE}/notifications/threads/${payload}`

export const API_USER = login => `${GITHUB_REST_API_BASE}/users/${login}`

export const API_ORG = organization => `${GITHUB_REST_API_BASE}/orgs/${organization}`

export const API_ORG_PUBLIC_MEMBER = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/orgs/${payload.organization}/public_members?${query}`
}

export const API_ORG_REPOS = (organization,params) => {
    let query = util_queryParse.querify(params)
    return `${GITHUB_REST_API_BASE}/orgs/${organization}/repos?${query}`
}


export const API_VIEWER_REPOS = payload => {
    let query = util_queryParse.querify(payload)
    return `${GITHUB_REST_API_BASE}/user/repos?${query}`
}

export const API_USER_STARRED_REPOS = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/users/${payload.login}/starred?${query}`
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

export const API_SEARCH = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/search/${payload.type}?${query}`
}

export const API_REPO = fullName => `${GITHUB_REST_API_BASE}/repos/${fullName}`

export const API_REPO_PROJECTS = (fullName,params) => {
    let query = util_queryParse.querify(params)
    return `${GITHUB_REST_API_BASE}/repos/${fullName}/projects?${query}`
}

export const API_README = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/readme?${query}`
}

export const API_CONTENTS = (payload) => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/contents${payload.path ? '/' + payload.path : ''}${payload.ref?'?ref='+payload.ref:''}`

export const API_REPOSITORY_STATISTIC_CONTRIBUTOR_LIST = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/stats/contributors`

export const API_REPOSITORY_COMMUNITY = (owner,repo) => `${GITHUB_REST_API_BASE}/repos/${owner}/${repo}/community/profile`

export const API_REPOSITORY_COMMITS = payload=> {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/commits?${query}`
}

export const API_REPOSITORY_BRANCHES = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/branches?${query}`
}

export const API_REPOSITORY_RELEASES = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/releases?${query}`
}

export const API_REPOSITORY_CREATE_RELEASE = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/releases`

export const API_REPOSITORY_RELEASE = payload => {
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/releases/${payload.releaseId}`
}

export const API_REPOSITORY_LATESTRELEASE = payload => {
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/releases/latest`
}

export const API_REPOSITORY_RELEASE_ASSETS = payload => {
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/releases/${payload.releaseId}/assets`
}

export const API_REPOSITORY_RELEASE_ASSET = payload => {
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/releases/assets/${payload.assetId}`
}

export const API_REPOSITORY_RELEASE_UPLOAD_ASSET = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${FILE_UPLOAD_PROXY_API_BASE}/repos/${payload.owner}/${payload.repo}/releases/${payload.releaseId}/assets?${query}`
}

export const API_REPOSITORY_GIT_TAG = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/git/refs/tags/${payload.tag}`

export const API_REPOSITORY_TAGS = (owner,repo,params) => {
    let query = util_queryParse.querify(params)
    return `${GITHUB_REST_API_BASE}/repos/${owner}/${repo}/tags?${query}`
}

export const API_REPOSITORY_RELEASE_BY_TAG_NAME = payload => {
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/releases/tags/${payload.tag}`
}

export const API_REPOSITORY_CONTRIBUTORS = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/contributors?${query}`
}

export const API_REPOSITORY_SUBSCRIPTION = payload => {
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/subscription`
}

export const API_REPOSITORY_STARGAZERS = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/stargazers?${query}`
}

export const API_REPOSITORY_LANGUAGES = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/languages`

export const API_COMMITS_COMPARE = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/compare/${payload.baseHead}`

export const API_GIT_REF = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/git/ref/${payload.ref}`

export const API_GIT_MATCHING_REFS = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/git/matching-refs/${payload.ref}?${query}`
}

export const API_REPOSITORY_ISSUES = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/issues?${query}`
}

export const API_ISSUE = (payload) => {
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/issues/${payload.number}`
}

export const API_ISSUE_TIMELINES = (payload) => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/issues/${payload.number}/timeline?${query}`
}

export const API_PULLREQUEST = (payload) => {
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/pulls/${payload.number}`
}

export const API_REVIEW = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/pulls/${payload.number}/reviews/${payload.reviewId}`

export const API_REVIEWS = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/pulls/${payload.number}/reviews?${query}`
}

export const API_CREATE_REVIEW = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/pulls/${payload.number}/reviews`

export const API_SUBMIT_REVIEW = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/pulls/${payload.number}/reviews/${payload.reviewId}/events`

export const API_REVIEW_COMMENTS_OF_REVIEW = (payload) => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/pulls/${payload.number}/reviews/${payload.reviewId}/comments?${query}`
}

export const API_REVIEW_COMMENTS_OF_PULL_REQUEST = (payload) => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/pulls/${payload.number}/comments?${query}`
}

export const API_REVIEW_COMMENT_OF_PULL_REQUEST = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/pulls/comments/${payload.commentId}`

export const API_CREATE_REVIEW_REPLY = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/pulls/${payload.number}/comments/${payload.commentId}/replies`

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

export const API_PROXY_ISSUE_SIDEBAR = payload => `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/issues/${payload.number}/show_partial?partial=issues/sidebar`

export const API_REPOSITORY_ISSUES_AVAILABLE_AUTHORS = payload => {
    return `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/issues/show_menu_content?partial=issues/filters/authors_content&q=${payload.query}`
}

export const API_REPOSITORY_ISSUES_AVAILABLE_ASSIGNEES = payload => {
    return `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/issues/${payload.number}/show_partial?partial=issues/sidebar/assignees_menu_content`
}

export const API_REPOSITORY_ISSUES_AVAILABLE_LABELS = payload => {
    return `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/issues/show_menu_content?partial=issues/filters/labels_content&q=${payload.query}`
}

export const API_REPOSITORY_AVAILABLE_BRANCHES = payload => {
    return `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/refs/${payload.ref}${payload.path ? '/' + payload.path : ''}?source_action=${payload.sourceAction}&source_controller=${payload.sourceController}`
}

export const API_REPOSITORY_AVAILABLE_TAGS = payload => {
    return `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/refs-tags/${payload.ref}${payload.path ? '/' + payload.path : ''}?source_action=${payload.sourceAction}&source_controller=${payload.sourceController}&tag_name=${payload.ref}`
}



export const API_REPOSITORY_LABELS = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/labels?${query}`
}

export const API_REPOSITORY_MILESTONES = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/milestones?${query}`
}

export const API_REPOSITORY_MILESTONE = payload => {
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/milestones/${payload.number}`
}

export const API_MERGEABLE = payload => `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/branches/pre_mergeable/${payload.baseHead}`

export const API_REPOSITORY_COMMITS_AVAILABLE_BRANCHES = payload => `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/refs/${payload.branch}?source_action=show&source_controller=commits`

export const API_REPOSITORY_COMMITS_AVAILABLE_TAGS = payload => {
    return `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/refs-tags/${payload.branch}?source_action=show&source_controller=commits&tag_name=${payload.branch}`
}

export const API_REPOSITORY_COMPARE_AVAILABLE_BRANCHES = payload => {
    let query = util_queryParse.querify(payload.params)
    return  `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/compare/branch-list?${query}`
}

export const API_REPOSITORY_COMPARE_AVAILABLE_TAGS = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/compare/tag-list?${query}`
}

export const API_REPOSITORY_COMPARE_AVALIABLE_REPOSITORY = payload => `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/compare`

export const API_REPOSITORY_COMPARE_EXIST_PULL_REQUEST = payload => `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/compare/${payload.baseHead}`

export const API_REPOSITORY_ACTIVE_BRANCHES = payload => `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/branches/active`

export const API_BRANCHES_OVERVIEW_INFO = payload => `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/branches`

export const API_BRANCH = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/branches/${payload.branch}`

export const API_PROXY_ALL_BRANCHES = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/branches/${payload.meta}?${query}`
}

export const API_CREATE_PULL_REQUEST = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/pulls`

export const API_PROXY_USER_CONTRIBUTION_ILLUSTRATION = payload =>{
    let query = util_queryParse.querify(payload.params)
    return `${PROXY_API_BASE}/users/${payload.user}/contributions?${query}`
}


export const API_PROXY_ORGANIZATION_TAB_COUNTS = payload => `${PROXY_API_BASE}/users/${payload}/tab_counts?repo=1&project=1&package=1&team=1&member=1`

export const API_PROXY_OGRANIZATION_REPOSITORIES_AND_STATISTIC = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${PROXY_API_BASE}/${payload.login}?${query}`
}

export const API_PROXY_ORGANIZATION_PACKAGES = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${PROXY_API_BASE}/orgs/${payload.login}/packages?${query}`
}

export const API_PROXY_ORGANIZATION_PEOPLE = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${PROXY_API_BASE}/orgs/${payload.login}/people?${query}`
}

export const API_PROXY_USER_HOVERCARD = payload => `${PROXY_API_BASE}/users/${payload}/hovercard`

export const API_REPOSITORY_INVITATION_FOR_AUTHENTICATED_USER = `${GITHUB_REST_API_BASE}/user/repository_invitations`

export const API_REPOSITORY_INVITATION_ACTION = payload => `${GITHUB_REST_API_BASE}/user/repository_invitations/${payload}`

export const API_ADD_LABELS_TO_ISSUE = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/issues/${payload.number}/labels`

export const API_REMOVE_LABELS_TO_ISSUE = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/issues/${payload.number}/labels/${payload.label}`

export const API_HANDLE_LABEL = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/labels/${payload.label}`

export const API_ISSUE_LOCK = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/issues/${payload.number}/lock`

export const API_CREATE_ISSUE_COMMENT = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/issues/${payload.number}/comments`

export const API_ISSUE_COMMENT = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/issues/comments/${payload.commentId}`

export const API_ISSUE_REACTIONS = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/issues/${payload.number}/reactions?${query}`
}

export const API_ISSUE_REACTION = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/issues/${payload.number}/reactions/${payload.reactionId}`

export const API_ISSUE_COMMENT_REACTION = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/issues/comments/${payload.commentId}/reactions/${payload.reactionId}`

export const API_REVIEW_COMMENT_REACTION = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/pulls/comments/${payload.commentId}/reactions/${payload.reactionId}`

export const API_COMMIT_COMMENT_REACTION = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/comments/${payload.commentId}/reactions/${payload.reactionId}`


export const API_ISSUE_COMMENT_REACTIONS = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/issues/comments/${payload.commentId}/reactions?${query}`
}

export const API_PULL_REVIEW_COMMENT_REACTIONS = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/pulls/comments/${payload.comment}/reactions?${query}`
}

export const API_COMMIT_COMMENT_REACTIONS = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/comments/${payload.commentId}/reactions?${query}`
}

export const API_PROXY_ISSUE_COMMENT_EDIT_HISTORIES = payload => `${PROXY_API_BASE}/_render_node/${payload}/comments/comment_edit_history_log`

export const API_PROXY_FILE_CONTRIBUTION_MESSAGE = payload => `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/contributors/${payload.ref}/${payload.path}`

export const API_PROXY_CONTRIBUTORS_LIST = payload => `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/contributors-list/${payload.ref}/${payload.path}`

export const API_PROXY_COMMIT_STATUS = payload => `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/commit/${payload.sha}/rollup`

export const API_PROXY_COMMIT_ASSOCIATED_REFS = payload => `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/branch_commits/${payload.sha}`

export const API_PROXY_PULSE_COMMITTER_DATA = payload => `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/pulse_committer_data/${payload.period}`

export const API_PROXY_PULSE_DIFF_STATUS_SUMMARY = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/pulse_diffstat_summary?${query}`
}


export const API_STAR_OR_NOT_REPOSITORY = payload => `${GITHUB_REST_API_BASE}/user/starred/${payload.owner}/${payload.repo}`

export const API_BLOCK_USER_OR_NOT = payload => `${GITHUB_REST_API_BASE}/user/blocks/${payload}`

export const API_FOLLOW_USER_OR_NOT = payload => `${GITHUB_REST_API_BASE}/user/following/${payload}`

export const API_PROXY_SEARCH_RESULT_COUNT = payload => `${PROXY_API_BASE}/search/count?q=${payload.q}&type=${payload.type}`

export const API_THREAD_SUBSCRIPTION = payload => `${GITHUB_REST_API_BASE}/notifications/threads/${payload}/subscription`

export const API_CREATE_COMMIT = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/git/commits`

export const API_FILE_ACTION = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/contents/${payload.path}`

export const API_CREATE_REF = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/git/refs`

export const API_FORK = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/forks`

export const API_PROXY_USER_EDIT = payload => `${PROXY_API_BASE}/user_content_edits/${payload}`

export const API_COMMITS_OF_PULL_REQUEST = payload => {
    let query = util_queryParse.querify(payload.params)
    return `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/pulls/${payload.number}/commits?${query}`
}


export const API_PROXY_TAGS = payload => `${PROXY_API_BASE}/${payload.owner}/${payload.repo}/tags?q=${payload.query}`

export const API_ISSUE_ASSIGNEES_ACTION = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/issues/${payload.number}/assignees`

export const API_COMMIT_COMMENTS = payload => {
    let query = util_queryParse.querify(payload.params)
    return  `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/commits/${payload.sha}/comments?${query}`
}

export const API_WEEKLY_COMMIT_COUNT = payload => `${GITHUB_REST_API_BASE}/repos/${payload.owner}/${payload.repo}/stats/participation`