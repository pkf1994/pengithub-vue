export const GRAPHQL_PR = `
query($name:String!,$owner:String!,$number:Int!){
  repository(name: $name, owner: $owner)  {
    pullRequest(number: $number) {
      id
      activeLockReason
      viewerCannotUpdateReasons
      viewerDidAuthor
      viewerSubscription
      viewerCanUpdate
      viewerCanSubscribe
      viewerCanReact
      locked
      userContentEdits(first:1) {
        totalCount
        nodes {
          editedAt
        }
      }
      participants(first: 21) {
        totalCount
        nodes {
          avatarUrl
          id
          login
        }
      }
    }
  }
}  
`

  export const GRAPHQL_PR_COMMENT_AND_REVIEW_EXTRA_DATA = payload => {
    let graphql = ''
    payload.forEach((item,index) => {
      if(item.event === 'commented') {
        graphql = `
        ${graphql}
        comment${index}:node(id: "${item.node_id}") {
          ... on IssueComment {
            id
            bodyHTML
            isMinimized
            minimizedReason
            viewerCanDelete
            viewerCanMinimize
            viewerCanReact
            viewerCanUpdate
            viewerCannotUpdateReasons
            viewerDidAuthor
            userContentEdits(first:1) {
              totalCount
              nodes {
                editedAt
              }
            }
            authorAssociation
            THUMBS_UP :reactions(content: THUMBS_UP) {
                totalCount
            }
            THUMBS_DOWN :reactions(content: THUMBS_DOWN) {
                totalCount
            }
            LAUGH :reactions(content: LAUGH) {
                totalCount
            }
            HOORAY :reactions(content: HOORAY) {
                totalCount
            }
            CONFUSED :reactions(content: CONFUSED) {
                totalCount
            }
            HEART :reactions(content: HEART) {
                totalCount
            }
            ROCKET :reactions(content: ROCKET) {
                totalCount
            }
            EYES :reactions(content: EYES) {
                totalCount
            }
          }
        }
       
      `
      }else if(item.event === 'reviewed') {
        graphql = `
        ${graphql}
        review${index}:node(id: "${item.node_id}") {
          ... on PullRequestReview {
            id
            bodyHTML
            viewerCanDelete
            viewerCanReact
            viewerCanUpdate
            viewerCannotUpdateReasons
            viewerDidAuthor
            userContentEdits(first:1) {
              totalCount
              nodes {
                editedAt
              }
            }
            authorAssociation
            THUMBS_UP :reactions(content: THUMBS_UP) {
                totalCount
            }
            THUMBS_DOWN :reactions(content: THUMBS_DOWN) {
                totalCount
            }
            LAUGH :reactions(content: LAUGH) {
                totalCount
            }
            HOORAY :reactions(content: HOORAY) {
                totalCount
            }
            CONFUSED :reactions(content: CONFUSED) {
                totalCount
            }
            HEART :reactions(content: HEART) {
                totalCount
            }
            ROCKET :reactions(content: ROCKET) {
                totalCount
            }
            EYES :reactions(content: EYES) {
                totalCount
            }
          }
        }
      `
      }
     
    })
    return `{${graphql}}`
  }


  export const GRAPHQL_PR_TIMELINE_COUNT = payload => {
      let graphql = ''
      payload.timelineTypes.forEach(item => {
        graphql = `
          ${graphql}
          ${item}:timelineItems(itemTypes: ${item}) {
            totalCount
          }
        `
      })
      return `
      {
        node(id: "${payload.nodeId}") {
          ... on PullRequest {
            ${graphql}
          }
        }
      }
      `
  }

  export const GRAPHQL_PR_REVIEW_COMMENTS = payload => {
    return `
    {
      node(id: "${payload.nodeId}") {
        ... on PullRequestReview {
          comments(first: ${payload.perPage}${payload.after ? ',after:"' + payload.after +'"' : ''}) {
            totalCount
            nodes {
              id
              path
              position
              outdated
              diffHunk
              createdAt
              updatedAt
              state
              bodyHTML
              viewerCanReact
              resourcePath
              replyTo {
                id
              }
              author {
                login
                avatarUrl
              }
              THUMBS_UP :reactions(content: THUMBS_UP) {
                totalCount
              }
              THUMBS_DOWN :reactions(content: THUMBS_DOWN) {
                  totalCount
              }
              LAUGH :reactions(content: LAUGH) {
                  totalCount
              }
              HOORAY :reactions(content: HOORAY) {
                  totalCount
              }
              CONFUSED :reactions(content: CONFUSED) {
                  totalCount
              }
              HEART :reactions(content: HEART) {
                  totalCount
              }
              ROCKET :reactions(content: ROCKET) {
                  totalCount
              }
              EYES :reactions(content: EYES) {
                  totalCount
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    }
    `
  }

  export const GRAPHQL_PR_REVIEW_COMMENTS_WITH_NODE_ID = payload => {
    return `
    {
      nodes(ids:${JSON.stringify(payload.nodeIds)}) {
        ... on PullRequestReviewComment {
          id
          path
          position
          outdated
          diffHunk
          createdAt
          bodyHTML
          viewerCanReact
          author {
            login
            avatarUrl
          }
          THUMBS_UP :reactions(content: THUMBS_UP) {
            totalCount
          }
          THUMBS_DOWN :reactions(content: THUMBS_DOWN) {
              totalCount
          }
          LAUGH :reactions(content: LAUGH) {
              totalCount
          }
          HOORAY :reactions(content: HOORAY) {
              totalCount
          }
          CONFUSED :reactions(content: CONFUSED) {
              totalCount
          }
          HEART :reactions(content: HEART) {
              totalCount
          }
          ROCKET :reactions(content: ROCKET) {
              totalCount
          }
          EYES :reactions(content: EYES) {
              totalCount
          }
        }
      }
    }
    `
  }

  export const GRAPHQL_PULLS_COMMITS = (payload) => {
    payload = {
      perPage: 100,
      ...payload
    }
    return `
  {
    repository(name: "${payload.repo}", owner: "${payload.owner}") {
      pullRequest(number: ${payload.number}) {
        commits(first:${payload.perPage}${payload.after ? ',after:"' + payload.after  + '"': ''}) {
          nodes {
            commit {
              oid
              commitResourcePath
              committer {
                date
                avatarUrl
                user {
                  avatarUrl
                  login
                }
              }
              authoredByCommitter
              author {
                avatarUrl
                user {
                  login
                }
              }
              abbreviatedOid
              messageHeadlineHTML
            }
          }
          totalCount
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
        }
      }
    }
  }
  `}

  export const GRAPHQL_PR_ALL_REVIEW_COMMENTS = payload => {
    return `
    {
      repository(name:"${payload.repo}",owner:"${payload.owner}") {
        pullRequest(number:${payload.number}){
          id
          timelineItems(first: 10, itemTypes: PULL_REQUEST_REVIEW) {
            nodes {
              ... on PullRequestReview {
                id
                state
                comments(first: 100) {
                  nodes {
                    id
                    author {
                      avatarUrl
                      login
                    }
                    authorAssociation
                    path
                    bodyHTML
                    position
                    originalPosition
                    replyTo {
                      author {
                        login
                      }
                    }
                    isMinimized
                    minimizedReason
                    userContentEdits {
                      totalCount
                    }
                    viewerCanDelete
                    viewerCanMinimize
                    viewerCanReact
                    viewerCanUpdate
                    viewerCannotUpdateReasons
                    viewerDidAuthor
                    state
                    createdAt
                    THUMBS_UP :reactions(content: THUMBS_UP) {
                      totalCount
                    }
                    THUMBS_DOWN :reactions(content: THUMBS_DOWN) {
                        totalCount
                    }
                    LAUGH :reactions(content: LAUGH) {
                        totalCount
                    }
                    HOORAY :reactions(content: HOORAY) {
                        totalCount
                    }
                    CONFUSED :reactions(content: CONFUSED) {
                        totalCount
                    }
                    HEART :reactions(content: HEART) {
                        totalCount
                    }
                    ROCKET :reactions(content: ROCKET) {
                        totalCount
                    }
                    EYES :reactions(content: EYES) {
                        totalCount
                    }
                  }
                }
                userContentEdits {
                  totalCount
                }
              }
            }
            totalCount
          }
        }
      }
    }
    
    `
  }