export const GRAPHQL_ISSUE = `
      query($nodeID:ID!){
        node(id: $nodeID) {
          ... on Issue {
            id
            activeLockReason
            viewerCannotUpdateReasons
            viewerDidAuthor
            viewerSubscription
            viewerCanUpdate
            viewerCanSubscribe
            viewerCanReact
            viewerCannotUpdateReasons
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
          }
        }
      }  
    `

  export const GRAPHQL_ISSUE_TIMELINE = `
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
          }
          ... on CommentDeletedEvent {
            id
            deletedCommentAuthor {
              login
            }
          } 
          ... on PullRequestReview {
            id
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
          }
          ... on CommitComment {
            id
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

export const GRAPHQL_QUERY_VIEWER_REPOSTIORIES = `
query($after:String){
  viewer {
    repositories(first: 100,after:$after,affiliations: OWNER) {
      nodes {
        id
        name
        isPrivate
        description
        hasIssuesEnabled
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
`

export const GRAPHQL_MUTATION_TRANSFER_ISSUE = `
mutation ($issueId:ID!,$repositoryId:ID!) {
  transferIssue(input: {issueId: $issueId, repositoryId: $repositoryId}) {
    issue {
      resourcePath
    }
  }
}
`

export const GRAPHQL_MUTATION_DELETE_ISSUE = `
mutation ($issueId:ID!) {
  deleteIssue(input: {issueId: $issueId}) {
    clientMutationId
  }
}
`

export const GRAPHQL_MUTATION_MINIMIZE_COMMENT = `
mutation ($subjectId:ID!,$classifier:ReportedContentClassifiers!) {
  minimizeComment(input: {subjectId: $subjectId, classifier: $classifier}) {
    minimizedComment {
      minimizedReason
      isMinimized
      viewerCanMinimize
    }
  }
}
`

export const GRAPHQL_MUTATION_UNMINIMIZE_COMMENT = `
mutation ($subjectId:ID!) {
  unminimizeComment(input: {subjectId: $subjectId}) {
    unminimizedComment {
      minimizedReason
      isMinimized
      viewerCanMinimize
    }
  }
}
`
export const GRAPHQL_ISSUE_TIMELINE_COUNT = 
`query($itemTypes:[IssueTimelineItemsItemType!],$repo:String!,$owner:String!,$number:Int!){
  repository(name:$repo,owner:$owner) {
    issue(number: $number) {
      timelineItems(itemTypes: $itemTypes) {
        totalCount
      }
    }
  }
}`