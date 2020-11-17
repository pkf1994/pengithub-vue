export const GRAPHQL_COMMIT_FORCE_PUSH_TO = `
query($id:ID!){
    node(id: $id) {
      ... on HeadRefForcePushedEvent {
        id
        afterCommit {
            abbreviatedOid
            sha
        }
      }
    }
  }
  
`