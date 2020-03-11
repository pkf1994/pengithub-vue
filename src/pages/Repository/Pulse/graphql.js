export const GRAPHQL_REPOSITORY_ISSUES = (payload) => {
    payload = {
      perPage:10,
      ...payload
    }
    return `
   {
    search(type: ISSUE,query: "${payload.query}",first:${payload.perPage}${payload.after ? ',after:' + '"'+ payload.after+'"' : '' }) {
        issueCount
        nodes {
          ... on Issue {
            id
            title
            url
            number
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
            author {
              login
            }
          }
        ... on PullRequest {
            id
            title
            url
            number
            state
            createdAt
            closedAt
            merged
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
          }
        }
        pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
      }
    }
  }
  `}
  