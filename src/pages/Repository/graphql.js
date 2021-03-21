export const REPOSITORY =  `
query($ids:[ID!]!){
  nodes(ids: $ids) {
    ... on Repository {
      id
      name
      owner {
        login
      }
      issues(states: OPEN) {
        totalCount
      }
      pullRequests(states: OPEN) {
        totalCount
      }
      viewerHasStarred
      viewerPermission
      viewerCanSubscribe
      viewerSubscription
    } 
  }
}
`

