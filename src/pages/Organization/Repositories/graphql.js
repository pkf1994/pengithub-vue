
export const GRAPHQL_ORG_REPOSITORY_EXTRA = payload => {
  let grapqhl = ''
  payload.forEach((item,index) => {
    grapqhl = `
      ${grapqhl}
      repo${index}:repository(name:"${item.name}", owner:"${item.owner.login}") {
        id
        descriptionHTML
        issues(states: OPEN) {
          totalCount
        }
        pullRequests(states: OPEN) {
          totalCount
        }
        parent {
          nameWithOwner
        }
        primaryLanguage {
          name
          color
        }
        viewerHasStarred
      }
    `
  })
  return `
  {
    ${grapqhl.trim()}
  }
  `
}

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

export const GRAPHQL_ORG_PINNED_REPOS = `
query($login:String!){
  organization(login: $login) {
    pinnableItems(types: REPOSITORY, first: 6) {
      nodes {
        ... on Repository {
          id
          name
          owner{
            login
          }
          stargazers {
            totalCount
          }
          forkCount
          primaryLanguage {
            color
            name
          }
          description
        }
      }
    }
  }
}

`