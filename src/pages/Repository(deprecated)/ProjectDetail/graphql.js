export const GRAPHQL_PROJECT = payload => `
 {
    repository(name: "${payload.repo}", owner: "${payload.owner}") {
      project(number: ${payload.number}) {
        name
        viewerCanUpdate
        columns(first: 10) {
          nodes {
            name
            cards(first: 20, archivedStates: NOT_ARCHIVED) {
              pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
              }
              nodes {
                creator {
                  login
                }
                note
                state
                id
                isArchived
                content {
                  ... on Issue {
                    id
                    title
                    bodyHTML
                    state
                    number
                    resourcePath
                    author {
                      login
                    }
                    labels(first: 10) {
                      nodes {
                        color
                        name
                      }
                    }
                  }
                  ... on PullRequest {
                    id
                    state
                    title
                    bodyHTML
                    merged
                    resourcePath
                    author {
                      login
                    }
                    reviewDecision
                    commits(last: 1) {
                      nodes {
                        commit {
                          status {
                            state
                          }
                        }
                      }
                    }
                    labels(first: 10) {
                      nodes {
                        color
                        name
                      }
                    }
                    number
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`