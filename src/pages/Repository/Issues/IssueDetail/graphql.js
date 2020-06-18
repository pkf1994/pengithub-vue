export const GRAPHQL_ISSUE = `
      query($nodeID:ID!){
        node(id: $nodeID) {
          ... on Issue {
            
            activeLockReason
            viewerCannotUpdateReasons
            viewerDidAuthor
            viewerSubscription
            viewerCanUpdate
            viewerCanSubscribe
            viewerCanReact
            userContentEdits {
              totalCount
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

  export const GRAPHQL_ISSUE_COMMENTS = `
      query($ids:[ID!]!){
        nodes(ids: $ids) {
          ... on IssueComment {
            id
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
      }
  `

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

  export const GRAPHQL_ASSIGNABLE_USERS = `
  query($name:String!,$owner:String!,$after:String){
    repository(name: $name, owner: $owner) {
      assignableUsers(first: 100,after: $after) {
        totalCount
        pageInfo {
          hasNextPage
        }
        nodes {
          id
          avatarUrl
          login
          name
        }
      }
    }
  }
  `


export const GRAPHQL_MUTATION_ADD_ASSIGNEES_TO_ASSIGNABLE = `
mutation($assignableId:ID!,$assigneeIds:[ID!]!){
  addAssigneesToAssignable(input: {assignableId: $assignableId, assigneeIds: $assigneeIds}) {
    clientMutationId
    assignable {
      assignees(first: 10) {
        nodes {
          id
        }
      }
    }
  }
}
`

export const GRAPHQL_MUTATION_REMOVE_ASSIGNEES_TO_ASSIGNABLE = `
mutation($assignableId:ID!,$assigneeIds:[ID!]!){
  removeAssigneesFromAssignable(input: {assignableId: $assignableId, assigneeIds: $assigneeIds}) {
    clientMutationId
    assignable {
      assignees(first: 10) {
        nodes {
          id
        }
      }
    }
  }
}
`

export const GRAPHQL_MUTATION_UPDATE_SUBSCRIPTION = `
mutation($subscribableId:ID!,$state:SubscriptionState!){
  updateSubscription(input: {subscribableId: $subscribableId, state: $state}) {
    subscribable {
      viewerCanSubscribe
      viewerSubscription
    }
  }
}
`