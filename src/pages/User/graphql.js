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
export const GRAPHQL_MUTATION_CHANGE_USER_STATUS = `
  mutation($emoji:String,$expiresAt:DateTime,$message:String,$limitedAvailability:Boolean){
    changeUserStatus(input: {emoji: $emoji, expiresAt: $expiresAt, message: $message, limitedAvailability:$limitedAvailability}) {
      status {
        emojiHTML
        message
        indicatesLimitedAvailability
      }
    }
  }
`