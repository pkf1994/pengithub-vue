export const UPDATE_SUBSCRIPTION = `
mutation ($state: SubscriptionState!,$subscribableId: ID!) {
    updateSubscription(input: {subscribableId: $subscribableId, state: $state}) {
      subscribable {
        viewerSubscription
      }
    }
  }
`