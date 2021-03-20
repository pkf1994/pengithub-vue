export const GRAPHQL_MUTATION_UNMINIMIZE_COMMENT = `
mutation ($subjectId:ID!) {
  unminimizeComment(input: {subjectId: $subjectId}) {
    unminimizedComment {
      minimizedReason
      isMinimized
      viewerCanMinimize
    }
  }
}
`

export const GRAPHQL_DELETED_COMMENT_AUTHOR = `
query($id:ID!){
  node(id: $id) {
    ... on CommentDeletedEvent {
      deletedCommentAuthor {
        login
      }
    }
  }
}
`
export const NODES_ISSUE_COMMENT = `
query($ids:[ID!]!){
    nodes(ids: $ids) {
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
            userContentEdits {
                totalCount
            }
            authorAssociation
            EYES: reactions(content: EYES) {
                totalCount
                viewerHasReacted
            }
            ROCKET: reactions(content: ROCKET) {
                totalCount
                viewerHasReacted
            }
            HEART: reactions(content: HEART) {
                totalCount
                viewerHasReacted
            }
            CONFUSED: reactions(content: CONFUSED) {
                totalCount
                viewerHasReacted
            }
            HOORAY: reactions(content: HOORAY) {
                totalCount
                viewerHasReacted
            }
            LAUGH: reactions(content: LAUGH) {
                totalCount
                viewerHasReacted
            }
            THUMBS_UP: reactions(content: THUMBS_UP) {
                totalCount
                viewerHasReacted
            }
            THUMBS_DOWN: reactions(content: THUMBS_DOWN) {
                totalCount
                viewerHasReacted
            }
        }
    }
  }
`
