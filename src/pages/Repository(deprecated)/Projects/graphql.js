export const GRAPHQL_REPOSITORY_PROJECTS = payload => {
    return `
      {
        repository(name: "${payload.repo}", owner: "${payload.owner}") {
          projects(first: ${payload.perPage},search:"${payload.query}"${payload.getMoreData ? ',after:"' + payload.after + '"' : ''}) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
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
  
  export const GRAPHQL_REPOSITORY_PROJECTS_COUNT_BY_STATE = payload => {
    let query = payload.query.replace(/is:(open|closed)/g,'')
    return `
      {
        repository(name: "${payload.repo}", owner: "${payload.owner}") {
          totalCountOpenWithoutSearchQuery:projects {
            totalCount
          }
          totalCountOpen:projects(states:OPEN,search:"${query}"){
            totalCount
          }
          totalCountClosed:projects(states:CLOSED,search:"${query}"){
            totalCount
          }
        }
      }
    `
  }
  