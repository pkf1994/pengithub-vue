export const GRAPHQL_GET_ISSUES_BY_REPO_AND_NUMBERS = (payload) => {
  payload = {
    issueType: 'issue',
    ...payload
  }
  let graphql = ''
  payload.issues.forEach((item,index) => {
    let owner = item.repository_url.replace('https://api.github.com/repos/','').split('/')[0]
    let repo = item.repository_url.replace('https://api.github.com/repos/','').split('/')[1]
    graphql = `
      ${graphql}
      repository${index}:repository(name: "${repo}", owner: "${owner}") {
        ${payload.issueType}(number:${item.number}){
          state
          createdAt
          closedAt
          ${payload.issueType === 'pullRequest' ? 'merged' : ''}
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