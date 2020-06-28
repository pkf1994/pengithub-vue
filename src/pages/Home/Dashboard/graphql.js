export const GRAPHQL_VIEWER_TEAMS = `
query($userLogin:[String!]){
    viewer {
      login
      organizations(first: 100) {
        nodes {
          teams(userLogins: $userLogin, first: 100){
            nodes {
                id
                combinedSlug
                teamsResourcePath
            }
          }
        }
      }
    }
  }
  
`

export const GRAPHQL_REPOSITORY = `
query($name:String!,$owner:String!){
    repository(name: $name, owner: $owner) {
      viewerHasStarred
      updatedAt
      description
    }
  }
`