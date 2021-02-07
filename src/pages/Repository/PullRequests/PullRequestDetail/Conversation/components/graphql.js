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

export const GRAPHQL_PULL_REVIEWS = `
query($id:ID!,$after:String){
  node(id: $id) {
    ... on PullRequest {
      reviews(first: 100, after: $after) {
        nodes {
          author {
            avatarUrl
            login
          }
          state
          commit {
            oid
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