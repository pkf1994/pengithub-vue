export const NODES_COMMIT = `
query($ids:[ID!]!,$withAuthors:Boolean!,$withState:Boolean!){
    nodes(ids: $ids) {
      ... on Commit {
        id
        authors (first: 4) @include(if: $withAuthors) {
          nodes {
            name
            user {
              avatarUrl
              login
              name
            }
          }
        }
        status @include(if: $withState) {
            state
        }
      }
    }
  }
`
export const NODES_ISSUE_COMMENT = `
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
            EYES: reactions(content: EYES) {
                totalCount
                viewerHasReacted
            }
            ROCKET: reactions(content: ROCKET) {
                totalCount
                viewerHasReacted
            }
            HEART: reactions(content: HEART) {
                totalCount
                viewerHasReacted
            }
            CONFUSED: reactions(content: CONFUSED) {
                totalCount
                viewerHasReacted
            }
            HOORAY: reactions(content: HOORAY) {
                totalCount
                viewerHasReacted
            }
            LAUGH: reactions(content: LAUGH) {
                totalCount
                viewerHasReacted
            }
            THUMBS_UP: reactions(content: THUMBS_UP) {
                totalCount
                viewerHasReacted
            }
            THUMBS_DOWN: reactions(content: THUMBS_DOWN) {
                totalCount
                viewerHasReacted
            }
        }
    }
  }
`
