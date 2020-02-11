import {GRAPHQL_FRAGMENT_PAGEINFO} from "../constant";

export const GRAPHQL_REPOSITORY_CODE_BASIC_INFO = (owner,repo) => {
    return `
    {
        repository(name: "${repo}", owner: "${owner}") {
          homepageUrl
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
          repositoryTopics(first: 5) {
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
                  totalCount
                  nodes {
                    author {
                      name
                      user{
                        login
                      }
                    }
                    authoredDate
                  }
                }
              }
            }
          }
          refs(first: 100, refPrefix: "refs/heads/") {
            totalCount
            nodes {
              name
              target {
                ... on Commit {
                  history(first: 1) {
                    nodes {
                      committedDate
                    }
                  }
                }
              }
            }
          }
          releases(first: 1, orderBy: {field: CREATED_AT, direction: DESC}) {
            totalCount
            nodes {
              publishedAt
              tagName
            }
          }
          issues(first: 5, states:OPEN, orderBy: {field: UPDATED_AT, direction: DESC}, filterBy: {}) {
            totalCount
            nodes {
              title
              url
              state
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
          pullRequests(first: 5, states:OPEN, orderBy: {field: UPDATED_AT, direction: DESC}) {
            totalCount
            nodes {
              title
              state
              url
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

export const GRAPHQL_REPOSITORY_ISSUES_BY_NUMBERS = (payload) => {
  payload = {
    issueType: 'issues',
    ...payload
  }
  let issueType = payload.issueType === 'issues' ? 'issue' : 'pullRequest'
  let graphql = ''
  payload.numbers.forEach(item => {
    graphql = `
      ${graphql}
      ${issueType}${item}:${issueType}(number:${item}){
        state
        createdAt
        closedAt
        ${payload.issueType === 'pullRequests' ? 'merged' : ''}
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
        labels(first: 20) {
          nodes {
            color
            name
          }
        }
      }
    `
  })
  return `
 {
  repository(name: "${payload.repo}", owner: "${payload.owner}") {
    ${graphql}
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

export const GRAPHQL_REPOSITORY_LAST_COMMITDATE_BY_PATH = payload => {
    let path = payload.path
    if(path.length > 0 && path[path.length - 1] !== '/') {
      path = `${path}/`
    }
    let graphQL = ''
    payload.contents.forEach((item,index) => {
      graphQL = `${graphQL}
        history${index}:history(path: "${path}${item.name}", first: 1) {
          nodes {
            committedDate
          }
        }
      `
    })
  return `
  {
    repository(name: "${payload.repo}", owner: "${payload.owner}") {
      object(expression: "${payload.branch}") {
        ... on Commit {
          ${graphQL}
        }
      }
    }
  }
  `
}

export const GRAPHQL_REPOSITORY_COMMITS_COUNT_BY_BRANCH = payload => `
{
  repository(name: "${payload.repo}", owner: "${payload.owner}") {
    ref(qualifiedName: "refs/heads/${payload.branch}") {
      target {
        ... on Commit {
          history {
            totalCount
          }
        }
      }
    }
  }
}
`

export const GRAPHQL_REPOSITORY_CONTENTS = payload => `
{
  repository(name: "${payload.repo}", owner: "${payload.owner}") {
    object(expression: "${payload.branch}:${payload.path}") {
      ... on Tree {
        entries {
          oid
          name
          type
        }
      }
      ... on Blob {
        text
        isBinary
      }
    }
  }
}
`

export const GRAPHQL_REPOSITORY_CONTENT_AND_LAST_COMMIT_AND_COMMIT_HISTORY = payload => `
{
  repository(name: "${payload.repo}", owner: "${payload.owner}") {
    content: object(expression: "${payload.branch}:${payload.path}") {
      ... on Blob {
        text
        isBinary
      }
    }
    commit: object(expression: "${payload.branch}") {
      ... on Commit {
        history(first: 1, path: "${payload.path}") {
          nodes {
            message
            abbreviatedOid
            committer {
              avatarUrl
              user {
                login
              }
            }
            committedDate
          }
        }
      }
    }
    commitHistory: object(expression: "${payload.branch}") {
      ... on Commit {
        history(first: 100, path: "${payload.path}") {
          nodes {
            authoredByCommitter
            committer {
              user {
                login
              }
            }
            author {
              user {
                login
              }
            }
          }
        }
      }
    }
  }
}
`
export const GRAPHQL_USER = userLogins => {
  let graphQL = ''
  userLogins.forEach((item,index) => {
    graphQL = `
      ${graphQL}
      user${index}:user(login: "${item}") {
        avatarUrl
        login
      }
    `
  })
  return `{${graphQL}}`
}