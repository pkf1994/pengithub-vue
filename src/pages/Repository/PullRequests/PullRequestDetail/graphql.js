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

  export const GRAPHQL_PR_TIMELINE_COUNT = 
      `query($itemTypes:[PullRequestTimelineItemsItemType!],$repo:String!,$owner:String!,$number:Int!){
        repository(name:$repo,owner:$owner) {
          pullRequest(number: $number) {
            timelineItems(itemTypes: $itemTypes) {
              totalCount
            }
          }
        }
      }`


  export const GRAPHQL_PR_REVIEW_COMMENTS = `
    query($ids:[ID!]!){
      nodes(ids: $ids) {
        ... on PullRequestReviewComment {
          id
          state
          viewerCanReact
          viewerCanUpdate
          viewerCanMinimize
          viewerCanDelete
          minimizedReason
          isMinimized
          outdated
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

  export const GRAPHQL_PR_PENDING_REVIEWS = `
    query($name:String!,$owner:String!,$number:Int!) {
      repository(name:$name,owner:$owner) {
        pullRequest(number:$number) {
          reviews(first:1,states:[PENDING]) {
            totalCount
            nodes{
              databaseId
              id
              body
              viewerCanDelete
              viewerCanUpdate
            }
          }
        }
      }
    }
  `

  export const GRAPHQL_COMMIT_COMMENTS = payload => {
    return `
    {
      node(id: "${payload.nodeId}") {
        ... on CommitCommentThread {
          comments(first: ${payload.perPage}${payload.after ? ',after:"' + payload.after +'"' : ''}) {
            totalCount
            nodes {
              id
              position
              createdAt
              bodyHTML
              isMinimized
              minimizedReason
              viewerCanUpdate
              viewerCanDelete
              viewerCanReact
              viewerCanMinimize
              viewerCannotUpdateReasons
              viewerDidAuthor
              resourcePath
              userContentEdits {
                totalCount
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
  }

  export const GRAPHQL_COMMIT_COMMENT = `
    query($ids: [ID!]!) {
      nodes(ids:$ids) {
        ... on CommitComment{
          isMinimized
          minimizedReason
          viewerCanDelete
          viewerCanUpdate
          viewerCanMinimize
          viewerCanReact
        }
      }
    }
  `

  export const GRAPHQL_ADD_PULL_REQUEST_REVIEW_COMMENT = `
    mutation($input:AddPullRequestReviewCommentInput!) {
      addPullRequestReviewComment(input:$input) {
        comment {
          databaseId
          state
        }
      }
    }
  `

  export const GRAPHQL_ADD_PULL_REQUEST_REVIEW = `
  mutation($input:AddPullRequestReviewInput!) {
    addPullRequestReview(input:$input) {
      pullRequestReview {
        databaseId
        state
      }
    }
  }
  `