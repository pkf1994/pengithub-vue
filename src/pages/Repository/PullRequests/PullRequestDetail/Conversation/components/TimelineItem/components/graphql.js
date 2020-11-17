export const GRAPHQL_HEAD_REF_FORCE_PUSH_EVENT = `
query($id:ID!){
    node(id: $id) {
      ... on HeadRefForcePushedEvent {
        id
        afterCommit {
            abbreviatedOid
        }
      }
    }
  }
  
`