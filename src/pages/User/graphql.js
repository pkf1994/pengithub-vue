export const GRAPHQL_USER_INFO = payload => `
{
    user(login: "${payload}") {
      viewerCanFollow
      viewerIsFollowing
      isDeveloperProgramMember
      isCampusExpert
      status {
        emojiHTML
        message
        indicatesLimitedAvailability
      }
      sponsorshipsAsMaintainer(first: 13) {
        totalCount
        nodes {
          sponsor {
            login
            avatarUrl
          }
        }
      }
      sponsorshipsAsSponsor(first: 13) {
        totalCount
        nodes {
          maintainer {
            login
            avatarUrl
          }
        }
      }
    }
  }
  
`
