export const GRAPHQL_ORG_STATISTIC = `
query($query:String!,$after:String){
  search(query:$query, type:REPOSITORY, first:100, after:$after) {
    pageInfo {
      endCursor
      hasNextPage
    }
    nodes {
      ... on Repository {
        id
        name
        primaryLanguage {
          name
          color
        }
        repositoryTopics(first: 10) {
          nodes {
            topic {
              name
            }
          }
        }
      }
    }
  }
}

`

export const GRAPHQL_ORG_PINNED_PEOPLE = `
query($login:String!){
  organization(login: $login) {
    membersWithRole(first: 20) {
      nodes {
        id
        login
        avatarUrl
      }
      totalCount
    }
  }
}

`