export const GRAPHQL_ISSUES = `
  query($ids:[ID!]!) {
    nodes(ids: $ids) {
      ... on Issue {
        id
        timelineItems(first: 1, itemTypes: CLOSED_EVENT) {
          nodes {
            ... on ClosedEvent {
              actor {
                login
              }
            }
          }
        }
      }
      ... on PullRequest {
        id
        timelineItems(first: 1, itemTypes: CLOSED_EVENT) {
          nodes {
            ... on ClosedEvent {
              actor {
                login
              }
            }
          }
        }
      }
    }
  }
`

