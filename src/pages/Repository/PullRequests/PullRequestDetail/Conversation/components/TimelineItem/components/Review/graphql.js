export const GRAPHQL_PR_PENDING_REVIEWS = `
query($name:String!,$owner:String!,$number:Int!) {
  repository(name:$name,owner:$owner) {
    pullRequest(number:$number) {
      reviews(first:1,states:[PENDING]) {
        totalCount
        nodes{
          databaseId
          id
          body
          viewerCanDelete
          viewerCanUpdate
        }
      }
    }
  }
}
`