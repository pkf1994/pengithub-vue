export const GRAPHQL_USER_PROJECTS = payload => {
  return `
    {
      user(login: "${payload.login}") {
        openProjectCount:projects(search:"${payload.search}",states:OPEN) {
          totalCount
        }
        closedProjectCount:projects(search:"${payload.search}",states:CLOSED) {
          totalCount
        }
        projects(first: ${payload.perPage},search:"${payload.search}"${payload.after ? ',after:"' + payload.after + '"' : ''}${payload.states ? ',states:' + payload.states : ''}${payload.orderBy.direction && payload.orderBy.field ? ',orderBy:{field:' + payload.orderBy.field + ',direction:' + payload.orderBy.direction + '}' : ''}) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          totalCount
          nodes {
            id
            name
            number
            closedAt
            closed
            updatedAt
            body
            columns(first: 10) {
              totalCount
              nodes {
                name
                cards {
                  totalCount
                }
              }
            }
          }
        }
      }
    }
  `
}
