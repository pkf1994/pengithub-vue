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
