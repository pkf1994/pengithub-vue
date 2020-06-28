export const GRAPHQL_COMMIT = `
query($id:ID!){
    node(id: $id) {
      ... on Commit {
        id
        status {
          state
        }
      }
    }
  }
  
`