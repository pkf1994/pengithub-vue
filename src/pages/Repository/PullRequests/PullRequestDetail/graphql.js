export const GRAPHQL_PR_BODY_HTML_AND_REACTIONS = payload => {
    return `
      {
        node(id: "${payload.nodeId}") {
          ... on PullRequest {
            bodyHTML
            activeLockReason
            viewerCannotUpdateReasons
            viewerDidAuthor
            viewerSubscription
            viewerCanUpdate
            viewerCanSubscribe
            viewerCanReact
          
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