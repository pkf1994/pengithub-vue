export const GRAPHQL_COMMITS = `
query($ids:[ID!]!){
    nodes(ids: $ids) {
        ... on Commit {
            id
            messageHeadlineHTML
            status {
                state
            }
        }
    }
}
`
   