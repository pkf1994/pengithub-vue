export const GRAPHQL_TAG = `
query($name:String!,$owner:String!,$qualifiedName:String!) {
    repository(name: $name, owner: $owner) {
      ref(qualifiedName: $qualifiedName) {
        target {
          ... on Tag {
            id
            name
          }
        }
      }
    }
  }
  
`