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

export const GRAPHQL_COMMIT_COMMENTS = payload => {
  payload = {
    perPage: 10,
    forward: true,
    ...payload
  }
  return `
  {
    node(id: "${payload.nodeId}") {
      ... on Commit {
        id
        comments(${payload.forward ? 'first' : 'last'}: ${payload.perPage}${payload.after ? 'after:"' + payload.after + '"' : ''}) {
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
          totalCount
          nodes {
            author {
              login
              avatarUrl
            }
            bodyHTML
            id
            isMinimized
            minimizedReason
            viewerCanDelete
            viewerCanMinimize
            viewerCanReact
            viewerCanUpdate
            viewerDidAuthor
            authorAssociation
            createdAt
            userContentEdits {
              totalCount
            }
            THUMBS_UP :reactions(content: THUMBS_UP) {
              totalCount
            }
            THUMBS_DOWN :reactions(content: THUMBS_DOWN) {
                totalCount
            }
            LAUGH :reactions(content: LAUGH) {
                totalCount
            }
            HOORAY :reactions(content: HOORAY) {
                totalCount
            }
            CONFUSED :reactions(content: CONFUSED) {
                totalCount
            }
            HEART :reactions(content: HEART) {
                totalCount
            }
            ROCKET :reactions(content: ROCKET) {
                totalCount
            }
            EYES :reactions(content: EYES) {
                totalCount
            }
          }
        }
      }
    }
  }
  `
}