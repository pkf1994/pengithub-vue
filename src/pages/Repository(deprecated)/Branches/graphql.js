export const GRAPHQL_ACTIVE_AND_STALE_BRANCHES = payload => {
    return `
    {
        repository(name: "${payload.repo}", owner: "${payload.owner}") {
          defaultBranchRef {
            name
            target {
              ... on Commit {
                status {
                    state
                }
                history(first: 1) {
                  nodes {
                    author {
                        user{
                            login
                        }
                    }
                    committedDate
                  }
                }
              }
            }
          }
          refs(first: 100, refPrefix: "refs/heads/") {
            totalCount
            nodes {
              name
              target {
                ... on Commit {
                    status {
                        state
                    }
                  history(first: 1) {
                    nodes {
                        committedDate
                        author {
                            user{
                                login
                            }
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
}

