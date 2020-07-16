
export const GRAPHQL_REPOSITORY_CODE_BASIC_INFO = (owner,repo) => {
    return `
    {
        repository(name: "${repo}", owner: "${owner}") {
          homepageUrl
          id
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

export const GRAPHQL_REPOSITORY_CONTENTS = payload => `
{
  repository(name: "${payload.repo}", owner: "${payload.owner}") {
    object(expression: "${payload.branch}:${payload.path.replace(/^\//,'')}") {
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

export const GRAPHQL_REPOSITORY_LAST_COMMITDATE_BY_PATH = payload => {
  let path = payload.path.replace(/^\//,'')
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

export const GRAPHQL_REPOSITORY_CONTENT_AND_LAST_COMMIT_AND_COMMIT_HISTORY = payload => {
  
  let path = payload.path.replace(/^\//,'')
  return `
{
  repository(name: "${payload.repo}", owner: "${payload.owner}") {
    content: object(expression: "${payload.branch}:${path}") {
      ... on Blob {
        text
        byteSize
        isBinary
      }
    }
    commit: object(expression: "${payload.branch}") {
      ... on Commit {
        history(first: 1, path: "${path}") {
          nodes {
            message
            abbreviatedOid
            author {
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
        history(first: 100, path: "${path}") {
          nodes {
            author {
              avatarUrl
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
`}

export const BLOB_BYTE_SIZE = `
query($name:String!,$owner:String!,$expression:String!){
  repository(name: $name, owner: $owner) {
    object(expression: $expression) {
      ... on Blob {
        id
        byteSize
      }
    }
  }
}

`