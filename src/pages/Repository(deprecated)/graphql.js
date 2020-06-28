export const GRAPHQL_REPOSITORY_BASIC_INFO = (owner,repo) => `
{
  repository(name: "${repo}", owner: "${owner}") {
    hasIssuesEnabled
    hasProjectsEnabled
    projects(states: OPEN) {
      totalCount
    }
    issues(states: OPEN) {
      totalCount
    }
    pullRequests(states: OPEN) {
      totalCount
    }
    defaultBranchRef {
      name
    }
  }
}
`

