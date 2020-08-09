export const GRAPHQL_MUTATION_MINIMIZE_COMMENT = `
mutation ($subjectId:ID!,$classifier:ReportedContentClassifiers!) {
  minimizeComment(input: {subjectId: $subjectId, classifier: $classifier}) {
    minimizedComment {
      minimizedReason
      isMinimized
      viewerCanMinimize
    }
  }
}
`

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