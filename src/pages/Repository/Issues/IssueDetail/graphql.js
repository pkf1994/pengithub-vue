export const GRAPHQL_ISSUE_BODY_HTML_AND_REACTIONS_AND_PROJECTS = payload => {
    return `
      {
        node(id: "${payload.nodeId}") {
          ... on Issue {
            bodyHTML
            activeLockReason
            viewerCannotUpdateReasons
            viewerDidAuthor
            viewerSubscription
            viewerCanUpdate
            viewerCanSubscribe
            viewerCanReact
            projectCards(first: 100) {
              totalCount
              nodes {
                id
                column {
                  name
                }
                project {
                  name
                  columns(first: 100) {
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

  export const GRAPHQL_ISSUE_COMMENT_BODY_AND_REACTIONS = payload => {
    let graphql = ''
    payload.forEach((item,index) => {
      graphql = `
        ${graphql}
        commentBodyHTML${index}:node(id: "${item.node_id}") {
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
            userContentEdits {
              totalCount
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
    })
    return `{${graphql}}`
  }

  export const GRAPHQL_ISSUE_PROJECTS = payload => {
    return `
    {
      repository(name: "${payload.repo}", owner: "${payload.owner}") {
        issue(number: ${payload.number}) {
          projectCards(first: 100) {
            totalCount
            nodes {
              project {
                name
              }
            }
          }
        }
      }
    }
    `
  }

  export const GRAPHQL_ISSUE_TIMELINE_COUNT = payload => {
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
          ... on Issue {
            ${graphql}
          }
        }
      }
      `
  }