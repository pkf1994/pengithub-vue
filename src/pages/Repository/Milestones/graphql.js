export const GRAPHQL_LABELS = `
query($ids:[ID!]!){
    nodes(ids: $ids) {
      ... on Label {
        id
        name
        pullRequests(states: OPEN) {
          totalCount
        }
        issues(states: OPEN) {
          totalCount
        }
      }
    }
  }
`