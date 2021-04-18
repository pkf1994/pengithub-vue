export const GRAPHQL_TOPIC_REPOS = `
query($ids:[ID!]!){
  nodes(ids: $ids){
    ... on Repository{
    name
    owner{
      login
    }
    id
    openGraphImageUrl
    viewerHasStarred
    primaryLanguage {
      color
      name
    }
  }
}
}
`