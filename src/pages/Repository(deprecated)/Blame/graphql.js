export const GRAPHQL_BLAME = `
query($owner:String!,$name:String!,$expression:String!,$path:String!){
    repository(name:$name, owner:$owner) {
      object(expression:$expression) {
        ... on Commit {
          id
          blame(path:$path) {
            ranges {
              startingLine
              endingLine
              age
              commit {
                id
                author {
                  user {
                    login
                  }
                  name
                  avatarUrl
                }
                committer {
                  user {
                    login
                  }
                  name
                  avatarUrl
                }
                message
                committedDate
                commitResourcePath
              }
            }
          }
        }
      }
    }
  }
`

export const GRAPHQL_FILE =  `
query($name:String!,$owner:String!,$expression:String){
  repository(name: $name, owner: $owner) {
    object(expression: $expression) {
      ... on Blob {
        text
        byteSize
        isBinary
      }
    }
  }
}
`