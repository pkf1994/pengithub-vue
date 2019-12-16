const CLIENT_ID = "125cb651f63615c6d362"
const SCOPE = "repo user"
const GITHUB_REST_API_BASE = "https://api.github.com"

export const API_GRAPHQL_ENDPOINT = "https://api.github.com/graphql"

export const HOST = process.env.VUE_APP_HOST

export const API_TRENDING = (language,since) => `https://github-trending-api.now.sh/repositories?language=${language}&since=${since}`

export const API_OAUTH2 = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`

export const API_OAUTH2_ACCESS_TOKEN = (code) => `http://127.0.0.1:8088/oauth2server/oauth2/access_token.do?code=${code}`

export const API_OAUTH2_USER_INFO = GITHUB_REST_API_BASE + "/user"



