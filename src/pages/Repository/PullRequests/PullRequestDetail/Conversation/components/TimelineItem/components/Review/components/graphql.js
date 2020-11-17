export const GRAPHQL_ADD_PULL_REQUEST_REVIEW_COMMENT = `
    mutation($input:AddPullRequestReviewCommentInput!) {
      addPullRequestReviewComment(input:$input) {
        comment {
          createdAt
          id
          databaseId
          state
          diffHunk
          path
          position
          body
          author {
            avatarUrl
            login
          }
          replyTo {
            databaseId
            id
          }
          pullRequestReview {
            databaseId
            id
          }
          reactions {
            totalCount
          }
          EYES: reactions(content: EYES) {
            totalCount
          }
          ROCKET: reactions(content: ROCKET) {
            totalCount
          }
          HEART: reactions(content: HEART) {
            totalCount
          }
          CONFUSED: reactions(content: CONFUSED) {
            totalCount
          }
          LAUGH: reactions(content: LAUGH) {
            totalCount
          }
          HOORAY: reactions(content: HOORAY) {
            totalCount
          }
          THUMBS_DOWN: reactions(content: THUMBS_DOWN) {
            totalCount
          }
          THUMBS_UP: reactions(content: THUMBS_UP) {
            totalCount
          }
        }
      }
    }
  `

  export const GRAPHQL_UPDATE_PULL_REVIEW_COMMENT = `
  mutation($input:UpdatePullRequestReviewCommentInput!) {
    updatePullRequestReviewComment(input:$input) {
      pullRequestReviewComment {
        createdAt
          id
          databaseId
          state
          diffHunk
          path
          position
          body
          author {
            avatarUrl
            login
          }
          replyTo {
            databaseId
            id
          }
          pullRequestReview {
            databaseId
            id
          }
          reactions {
            totalCount
          }
          EYES: reactions(content: EYES) {
            totalCount
          }
          ROCKET: reactions(content: ROCKET) {
            totalCount
          }
          HEART: reactions(content: HEART) {
            totalCount
          }
          CONFUSED: reactions(content: CONFUSED) {
            totalCount
          }
          LAUGH: reactions(content: LAUGH) {
            totalCount
          }
          HOORAY: reactions(content: HOORAY) {
            totalCount
          }
          THUMBS_DOWN: reactions(content: THUMBS_DOWN) {
            totalCount
          }
          THUMBS_UP: reactions(content: THUMBS_UP) {
            totalCount
          }
      }
    }
  }
  `

  export const GRAPHQL_PR_REVIEW_COMMENTS = `
  query($ids:[ID!]!){
    nodes(ids: $ids) {
      ... on PullRequestReviewComment {
        id
        state
        viewerCanReact
        viewerCanUpdate
        viewerCanMinimize
        viewerCanDelete
        minimizedReason
        isMinimized
        outdated
      }
    }
  }
  `
