export const NODES_COMMIT = `
query($ids:[ID!]!,$withAuthors:Boolean!,$withState:Boolean!){
    nodes(ids: $ids) {
      ... on Commit {
        id
        authors (first: 4) @include(if: $withAuthors) {
          nodes {
            name
            user {
              avatarUrl
              login
              name
            }
          }
        }
        status @include(if: $withState) {
            state
        }
      }
    }
  }
`