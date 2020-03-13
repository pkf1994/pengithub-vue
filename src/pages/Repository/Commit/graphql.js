export const GRAPHQL_COMMIT_EXTRA_DATA = payload => {
    return `
    {
        node(id:"${payload.nodeId}") {
          ... on Commit {
            id
            messageBodyHTML
            messageHeadlineHTML
            status {
                state
            }
            repository{
                refs(refPrefix: "refs/tags/", first: 100) {
                    nodes {
                        name
                        target {
                         ... on Commit {
                            id
                            committedDate
                            } 
                        }
                    }
                }
            }
            associatedPullRequests(first: 10) {
                nodes {
                    baseRef {
                        name
                    }
                    id
                    headRefName
                    number
                    resourcePath
                    }
                }
  
            }
        }
    }
      
    `
}

export const GRAPHQL_TAGS = payload => {
    return `
    {
        repository(name: "${payload.repo}", owner: "${payload.owner}") {
          refs(refPrefix: "refs/tags/", first: 100) {
            nodes {
              name
              target {
                ... on Commit {
                  id
                  committedDate
                }
              }
            }
          }
        }
      }
      
    `
}