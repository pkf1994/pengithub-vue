export const GRAPHQL_GET_ISSUES = (payload) => {
    let graphql = ''
    payload.forEach((item,index) => {
      graphql = `
        ${graphql}
        issue${index}:node(id:"${item.node_id}") {
            ... on Issue{
                id
                state
                createdAt
                closedAt
                timelineItems(last: 1, itemTypes: CLOSED_EVENT) {
                    nodes {
                      ... on ClosedEvent {
                        id
                        actor {
                            login
                            }
                        }
                    }
                }
            }
            ... on PullRequest {
                state
                createdAt
                closedAt
                merged
                isDraft
                id
                timelineItems(last: 1, itemTypes: CLOSED_EVENT) {
                    nodes {
                      ... on ClosedEvent {
                        id
                        actor {
                            login
                            }
                        }
                    }
                }
            }
          }
      `
    })
    return `
    {
      ${graphql}
    }
  `}

  export const GRAPHQL_COUNT_OF_ISSUE_BY_STATE = (payload) => {
    let openQuery = payload.replace(/is:(open|closed)/g,'is:open')
    let closedQuery = payload.replace(/is:(open|closed)/g,'is:closed')
    return `
    {
      open:search(query:"${openQuery}", type:ISSUE){
        issueCount
      }
      closed:search(query:"${closedQuery}", type:ISSUE){
        issueCount
      }
    }
      
    `
  } 

  
export const GRAPHQL_SEARCH_FOR_ISSUES_COUNT_BY_ASSOCIATE_USER = (payload) => {
  let graphql = ''
  payload.users.forEach((item,index) => {
    graphql = `
      ${graphql}
      issueCount${index}: search(query: "${payload.query} ${payload.meta}:${item.login}", type: ISSUE) {
        issueCount
      }
    `
  })

  return `
    {
      ${graphql}
    }
  `
}

export const GRAPHQL_REPOSITORY_GET_USER_NAME_BY_LOGIN = (payload) => {
  let graphql = ''
  payload.users.forEach((item,index) => {
    graphql = `
      ${graphql}
      user${index}: user(login:"${item.login}") {
        id
        login
        name
      }
    `
  })

  return `
    {
      ${graphql}
    }
  `
}