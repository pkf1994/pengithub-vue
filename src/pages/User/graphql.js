export const GRAPHQL_USER_INFO = payload => `
{
    user(login: "${payload}") {
      twitterUsername
      viewerCanFollow
      viewerIsFollowing
      isDeveloperProgramMember
      isCampusExpert
      status {
        emojiHTML
        message
        indicatesLimitedAvailability
      }
    }
  }
`

export const NODES_USER = `
query($ids:[ID!]!){
  nodes(ids: $ids) {
      ... on User {
        id
        login
        name
        twitterUsername
        viewerCanFollow
        viewerIsFollowing
        isDeveloperProgramMember
        isCampusExpert
        status {
          emojiHTML
          message
          indicatesLimitedAvailability
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