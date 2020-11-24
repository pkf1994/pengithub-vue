export const GRAPHQL_VIEWER_HAS_REACTED_INFO = `
query($id:ID!){
    node(id: $id) {
      ... on IssueComment {
        EYES: reactions(content: EYES) {
          viewerHasReacted
        }
        ROCKET: reactions(content: ROCKET) {
          viewerHasReacted
        }
        HEART: reactions(content: HEART) {
          viewerHasReacted
        }
        CONFUSED: reactions(content: CONFUSED) {
          viewerHasReacted
        }
        HOORAY: reactions(content: HOORAY) {
          viewerHasReacted
        }
        LAUGH: reactions(content: LAUGH) {
          viewerHasReacted
        }
        THUMBS_UP: reactions(content: THUMBS_UP) {
          viewerHasReacted
        }
        THUMBS_DOWN: reactions(content: THUMBS_DOWN) {
          viewerHasReacted
        }
      }
      ... on Issue {
        EYES: reactions(content: EYES) {
          viewerHasReacted
        }
        ROCKET: reactions(content: ROCKET) {
          viewerHasReacted
        }
        HEART: reactions(content: HEART) {
          viewerHasReacted
        }
        CONFUSED: reactions(content: CONFUSED) {
          viewerHasReacted
        }
        HOORAY: reactions(content: HOORAY) {
          viewerHasReacted
        }
        LAUGH: reactions(content: LAUGH) {
          viewerHasReacted
        }
        THUMBS_UP: reactions(content: THUMBS_UP) {
          viewerHasReacted
        }
        THUMBS_DOWN: reactions(content: THUMBS_DOWN) {
          viewerHasReacted
        }
      }
      ... on PullRequest {
        EYES: reactions(content: EYES) {
          viewerHasReacted
        }
        ROCKET: reactions(content: ROCKET) {
          viewerHasReacted
        }
        HEART: reactions(content: HEART) {
          viewerHasReacted
        }
        CONFUSED: reactions(content: CONFUSED) {
          viewerHasReacted
        }
        HOORAY: reactions(content: HOORAY) {
          viewerHasReacted
        }
        LAUGH: reactions(content: LAUGH) {
          viewerHasReacted
        }
        THUMBS_UP: reactions(content: THUMBS_UP) {
          viewerHasReacted
        }
        THUMBS_DOWN: reactions(content: THUMBS_DOWN) {
          viewerHasReacted
        }
      }
      ... on PullRequestReviewComment {
         EYES: reactions(content: EYES) {
          viewerHasReacted
        }
        ROCKET: reactions(content: ROCKET) {
          viewerHasReacted
        }
        HEART: reactions(content: HEART) {
          viewerHasReacted
        }
        CONFUSED: reactions(content: CONFUSED) {
          viewerHasReacted
        }
        HOORAY: reactions(content: HOORAY) {
          viewerHasReacted
        }
        LAUGH: reactions(content: LAUGH) {
          viewerHasReacted
        }
        THUMBS_UP: reactions(content: THUMBS_UP) {
          viewerHasReacted
        }
        THUMBS_DOWN: reactions(content: THUMBS_DOWN) {
          viewerHasReacted
        }
      }
      ... on CommitComment {
         EYES: reactions(content: EYES) {
          viewerHasReacted
        }
        ROCKET: reactions(content: ROCKET) {
          viewerHasReacted
        }
        HEART: reactions(content: HEART) {
          viewerHasReacted
        }
        CONFUSED: reactions(content: CONFUSED) {
          viewerHasReacted
        }
        HOORAY: reactions(content: HOORAY) {
          viewerHasReacted
        }
        LAUGH: reactions(content: LAUGH) {
          viewerHasReacted
        }
        THUMBS_UP: reactions(content: THUMBS_UP) {
          viewerHasReacted
        }
        THUMBS_DOWN: reactions(content: THUMBS_DOWN) {
          viewerHasReacted
        }
      }
    }
  }
  
`

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
