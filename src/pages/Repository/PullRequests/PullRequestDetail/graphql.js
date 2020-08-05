export const GRAPHQL_PR = `
query($name:String!,$owner:String!,$number:Int!){
  repository(name: $name, owner: $owner)  {
    pullRequest(number: $number) {
      id
      activeLockReason
      viewerCannotUpdateReasons
      viewerDidAuthor
      viewerSubscription
      viewerCanUpdate
      viewerCanSubscribe
      viewerCanReact
      viewerCanApplySuggestion
      locked
      userContentEdits(first:1) {
        totalCount
        nodes {
          editedAt
        }
      }
      participants(first: 21) {
        totalCount
        nodes {
          avatarUrl
          id
          login
        }
      }
    }
  }
}  
`
export const GRAPHQL_PULL_TIMELINE = `
  query($ids:[ID!]!) {
    nodes(ids:$ids) {
      ... on PullRequestReview {
        id
        viewerCanDelete
        viewerCanReact
        viewerCanUpdate
        viewerCannotUpdateReasons
        viewerDidAuthor
        userContentEdits(first:1) {
          totalCount
          nodes {
            editedAt
          }
        }
        authorAssociation
      }
      ... on IssueComment {
        id
        isMinimized
        minimizedReason
        viewerCanDelete
        viewerCanMinimize
        viewerCanReact
        viewerCanUpdate
        viewerCannotUpdateReasons
        viewerDidAuthor
        userContentEdits(first:1) {
          totalCount
          nodes {
            editedAt
          }
        }
        authorAssociation
      }
    }
  }
`

  export const GRAPHQL_PR_TIMELINE_COUNT = payload => {
      let graphql = ''
      payload.timelineTypes.forEach(item => {
        graphql = `
          ${graphql}
          ${item}:timelineItems(itemTypes: ${item}) {
            totalCount
          }
        `
      })
      return `
      {
        node(id: "${payload.nodeId}") {
          ... on PullRequest {
            ${graphql}
          }
        }
      }
      `
  }

  export const GRAPHQL_PR_REVIEW_COMMENTS = `
    query($id:ID!,$first:Int!,$after:String){
      node(id: $id) {
        ... on PullRequestReview {
          comments(first:$first,after:$after) {
            totalCount
            nodes {
              id
              viewerCanReact
              resourcePath
              replyTo {
                id
              }
              author {
                login
                avatarUrl
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    }
    `

  export const GRAPHQL_PR_REVIEW_COMMENTS_WITH_NODE_ID = `
  query($ids:[ID!]!){
    nodes(ids:$ids) {
      ... on PullRequestReviewComment {
        id
        viewerCanReact
        viewerCanUpdate
        viewerCanDelete
      }
    }
  }
  `

  export const GRAPHQL_PULLS_COMMITS = (payload) => {
    payload = {
      perPage: 100,
      ...payload
    }
    return `
  {
    repository(name: "${payload.repo}", owner: "${payload.owner}") {
      pullRequest(number: ${payload.number}) {
        commits(first:${payload.perPage}${payload.after ? ',after:"' + payload.after  + '"': ''}) {
          nodes {
            commit {
              oid
              commitResourcePath
              committer {
                date
                avatarUrl
                user {
                  avatarUrl
                  login
                }
              }
              authoredByCommitter
              author {
                avatarUrl
                user {
                  login
                }
              }
              abbreviatedOid
              messageHeadlineHTML
            }
          }
          totalCount
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
        }
      }
    }
  }
  `}

  export const GRAPHQL_PR_ALL_REVIEW_COMMENTS = payload => {
    return `
    {
      repository(name:"${payload.repo}",owner:"${payload.owner}") {
        pullRequest(number:${payload.number}){
          id
          timelineItems(first: 10, itemTypes: PULL_REQUEST_REVIEW) {
            nodes {
              ... on PullRequestReview {
                id
                state
                comments(first: 100) {
                  nodes {
                    id
                    author {
                      avatarUrl
                      login
                    }
                    authorAssociation
                    path
                    position
                    originalPosition
                    replyTo {
                      author {
                        login
                      }
                    }
                    isMinimized
                    minimizedReason
                    userContentEdits {
                      totalCount
                    }
                    viewerCanDelete
                    viewerCanMinimize
                    viewerCanReact
                    viewerCanUpdate
                    viewerCannotUpdateReasons
                    viewerDidAuthor
                    state
                    createdAt
                  }
                }
                userContentEdits {
                  totalCount
                }
              }
            }
            totalCount
          }
        }
      }
    }
    
    `
  }