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