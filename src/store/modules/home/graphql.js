import {GRAPHQL_FRAGMENT_PAGEINFO} from "../constant";

export const GRAPHQL_DASHBOARD = (login) => `
    query {
    viewer {
        organizations(first:4){
            totalCount
            nodes{
                name,
                login,
                teams(userLogins:["${login}"],first: 4){
                    totalCount
                    nodes{
                        name,
                        url
                    }
                }
            }
        }
        topRepositories(first:10,orderBy: {field:UPDATED_AT,direction:DESC}) {
            nodes {
                nameWithOwner,
                stargazers{
                    totalCount
                }
            }
        }
        starredRepositories(first:10,orderBy: {field:STARRED_AT,direction:DESC}) {
            nodes {
                nameWithOwner
                stargazers{
                    totalCount
                }
            }
        }
    }
}
`

export const GRAPHQL_VIEWER_ISSUES = (payload) => {
  payload = {
      issueType: 'issue',
      perPage: 10,
      ...payload
  }

  const firstCharToUpperCase = (str) => {
    return str[0].toUpperCase() + str.substring(1)
  }

  
  return `
{
search(query: "${payload.meta === 'assigned' ? 'assignee:' + payload.login : ''} ${payload.meta === 'mentioned' ? 'mentions:' + payload.login : ''} ${payload.meta === 'created' ? 'author:' + payload.login : ''} is:${payload.issueType === 'issue' ? 'issue' : 'pr'}", type: ISSUE, ${payload.before ? 'last' : 'first'}: ${payload.perPage}${payload.after ? ',after:' + '"'+ payload.after+'"' : '' }${payload.before ? ',before:' + '"'+ payload.before+'"' : '' }) {
  ${GRAPHQL_FRAGMENT_PAGEINFO}
  issueCount
  nodes {
    ... on ${firstCharToUpperCase(payload.issueType)} {
      id
      url
      number
      state
      closedAt
      createdAt
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
      author {
        login
      }
      title
      repository {
        nameWithOwner
      }
      labels(first: 20) {
                  nodes {
                      name
                      color
                      id
                  }
              }
    }
  }
}
}
`}