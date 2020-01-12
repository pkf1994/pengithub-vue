import {GRAPHQL_FRAGMENT_PAGEINFO} from "../constant";

export const GRAPHQL_REPOSITORY_CODE_BASIC_INFO = (owner,repo) => {
    return `
    {
        repository(name: "${repo}", owner: "${owner}") {
        
          stargazers {
            totalCount
          }
          watchers {
            totalCount
          }
          description
          fundingLinks {
            platform
            url
          }
          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }
          defaultBranchRef {
            name
            target {
              ... on Commit {
                history(first: 1) {
                  nodes {
                    author {
                      name
                    }
                    authoredDate
                  }
                }
              }
            }
          }
          refs(first: 5, refPrefix: "refs/heads/") {
            totalCount
            nodes {
              name
            }
          }
          releases(first: 1, orderBy: {field: CREATED_AT, direction: DESC}) {
            totalCount
            nodes {
              publishedAt
              tagName
            }
          }
          issues(first: 5, orderBy: {field: UPDATED_AT, direction: DESC}, filterBy: {}) {
            totalCount
            nodes {
              title
              createdAt
              number
              labels(first: 10) {
                nodes {
                  color
                  name
                }
              }
              author {
                login
              }
            }
          }
          pullRequests(first: 5, orderBy: {field: UPDATED_AT, direction: DESC}) {
            totalCount
            nodes {
              title
              number
              createdAt
              labels(first: 10) {
                nodes {
                  color
                  name
                }
              }
              author {
                login
              }
            }
          }
          viewerHasStarred
          viewerSubscription
        }
      }
    `
}

export const GRAPHQL_REPOSITORY_BASIC_INFO = (owner,repo) => `
{
  repository(name: "${repo}", owner: "${owner}") {
    hasIssuesEnabled
    hasProjectsEnabled
    projects(states: OPEN) {
      totalCount
    }
    issues(states: OPEN) {
      totalCount
    }
    pullRequests(states: OPEN) {
      totalCount
    }
    defaultBranchRef {
      name
    }
  }
}
`

export const GRAPHQL_REPOSITORY_ISSUES = (payload) => {
  payload = {
      issueType: 'issue',
      perPage: 10,
      state: 'open',
      ...payload
  }
  const firstCharToUpperCase = (str) => {
    return str[0].toUpperCase() + str.substring(1)
  }
  return `
 {
  search(query: "repo:${payload.owner}/${payload.repo} ${payload.issueType === 'pullRequest' ? 'is:pr' : ''} state:${payload.state} ${payload.closedAfter ? 'closed:>' + payload.closedAfter : ''} ${payload.createdAfter ? 'created:>' + payload.createdAfter : ''} ${payload.mergedAfter ? 'merged:>' + payload.mergedAfter : ''} ${payload.state === 'yours' ? 'author:' + payload.login : ''}",type: ISSUE,${payload.before ? 'last' : 'first'}: ${payload.perPage}${payload.after ? ',after:' + '"'+ payload.after+'"' : '' }${payload.before ? ',before:' + '"'+ payload.before+'"' : '' }) {
      issueCount
      nodes {
        ... on ${firstCharToUpperCase(payload.issueType)} {
          id
          title
          url
          number
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
          author {
            login
          }
          labels(first: 20) {
            nodes {
              color
              name
            }
          }
        }
      }
      ${GRAPHQL_FRAGMENT_PAGEINFO}
  }
}
`}

export const GRAPHQL_REPOSITORY_PROJECTS = payload => {
  const orderBy = payload.orderBy
  let orderByFragment
  if(orderBy && orderBy.field && orderBy.direction) {
    orderByFragment = `,orderBy: {field:${orderBy.field},direction:${orderBy.direction}}`
  }
  return `
    {
      repository(name: "${payload.repo}", owner: "${payload.owner}") {
        totalCountOpenWithoutSearchQuery:projects(states: OPEN){
          totalCount
        }
        totalCountOpen:projects(states: OPEN${payload.search ? ',search: "' + payload.search + '"' : ''}){
          totalCount
        }
        totalCountClosed:projects(states: CLOSED${payload.search ? ',search: "' + payload.search + '"' : ''}){
          totalCount
        }
        projects(first: ${payload.perPage}, states: ${payload.state}${payload.getMoreData ? ',after:"' + payload.after + '"' : ''}${orderByFragment ? orderByFragment : ''}${payload.search ? 'search: "' + payload.search + '"' : ''}) {
          ${GRAPHQL_FRAGMENT_PAGEINFO}
          nodes {
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