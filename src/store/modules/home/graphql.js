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

export const GRAPHQL_VIEWER_PULL_REQUEST_CREATED = (payload) => {
    payload = {
        perPage: 10,
        ...payload
    }
    return `
    query {
    viewer {
        pullRequests(${payload.before ? 'last' : 'first'}: ${payload.perPage},orderBy:{field:CREATED_AT,direction:DESC},states:[OPEN]${payload.after ? ',after:' + '"'+ payload.after+'"' : '' }${payload.before ? ',before:' + '"'+ payload.before+'"' : '' }) {
            totalCount
            nodes{
                author{
                    login
                }
                title
                url
                number
                createdAt
                id
                repository{
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
             ${GRAPHQL_FRAGMENT_PAGEINFO}
        }
    }
}
`}

export const GRAPHQL_VIEWER_PR_ASSIGNED = (payload) => {
    payload = {
        perPage: 10,
        ...payload
    }
    return `
{
  search(query: "assignee:${payload.login} type:pr", type: ISSUE, ${payload.before ? 'last' : 'first'}: ${payload.perPage}${payload.after ? ',after:' + '"'+ payload.after+'"' : '' }${payload.before ? ',before:' + '"'+ payload.before+'"' : '' }) {
    ${GRAPHQL_FRAGMENT_PAGEINFO}
    nodes {
      ... on PullRequest {
        id
        url
        number
        author {
          login
        }
        title
        createdAt
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

export const GRAPHQL_VIEWER_PR_MENTIONED = (payload) => {
    payload = {
        perPage: 10,
        ...payload
    }
    return `
{
  search(query: "mentions:${payload.login} type:pr", type: ISSUE, ${payload.before ? 'last' : 'first'}: ${payload.perPage}${payload.after ? ',after:' + '"'+ payload.after+'"' : '' }${payload.before ? ',before:' + '"'+ payload.before+'"' : '' }) {
    ${GRAPHQL_FRAGMENT_PAGEINFO}
    nodes {
      ... on PullRequest {
        id
        url
        number
        createdAt
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

export const GRAPHQL_VIEWER_ISSUES_CREATED = (payload) => {
    payload = {
        perPage: 10,
        ...payload
    }
    return `
    query {
    viewer {
        issues(${payload.before ? 'last' : 'first'}: ${payload.perPage},orderBy:{field:CREATED_AT,direction:DESC},states:[OPEN]${payload.after ? ',after:' + '"'+ payload.after+'"' : '' }${payload.before ? ',before:' + '"'+ payload.before+'"' : '' }) {
            totalCount
            ${GRAPHQL_FRAGMENT_PAGEINFO}
            nodes{
                author{
                    login
                }
                title
                url
                number
                createdAt
                id
                repository{
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

export const GRAPHQL_VIEWER_ISSUES_ASSIGNED = (payload) => {
    payload = {
        perPage: 10,
        ...payload
    }
    return `
{
  search(query: "assignee:${payload.login} type:issue", type: ISSUE, ${payload.before ? 'last' : 'first'}: ${payload.perPage}${payload.after ? ',after:' + '"'+ payload.after+'"' : '' }${payload.before ? ',before:' + '"'+ payload.before+'"' : '' }) {
    ${GRAPHQL_FRAGMENT_PAGEINFO}
    nodes {
      ... on Issue {
        id
        url
        number
        author {
          login
        }
        title
        createdAt
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

export const GRAPHQL_VIEWER_ISSUES_MENTIONED = (payload) => {
    payload = {
        perPage: 10,
        ...payload
    }
    return `
{
  search(query: "mentions:${payload.login} type:issue", type: ISSUE, ${payload.before ? 'last' : 'first'}: ${payload.perPage}${payload.after ? ',after:' + '"'+ payload.after+'"' : '' }${payload.before ? ',before:' + '"'+ payload.before+'"' : '' }) {
    ${GRAPHQL_FRAGMENT_PAGEINFO}
    nodes {
      ... on Issue {
        id
        url
        number
        createdAt
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