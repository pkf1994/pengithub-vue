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