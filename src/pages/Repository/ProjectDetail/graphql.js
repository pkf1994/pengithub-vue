export const GRAPHQL_PROJECT = payload => `
 {
    repository(name: "${payload.repo}", owner: "${payload.owner}") {
      project(number: ${payload.number}) {
        name
        viewerCanUpdate
        columns(first: 10) {
          nodes {
            name
            cards(first: 20, archivedStates: NOT_ARCHIVED) {
              pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
              }
              nodes {
                creator {
                  login
                }
                note
              }
            }
          }
        }
      }
    }
  }
`