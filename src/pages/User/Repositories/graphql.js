
export const GRAPHQL_USER_REPOSITORY = payload => `
{
  search(query: "${payload.query}",first: ${payload.perPage || 20}, type: REPOSITORY${payload.after ? ',after:"' + payload.after + '"': ''}${payload.before ? ',before:"' + payload.before + '"': ''}) {
    nodes {
      ... on 
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
    repositoryCount
  }
}
`

export const GRAPHQL_USER_REPOSITORY_EXTRA = payload => {
  let grapqhl = ''
  payload.forEach((item,index) => {
    grapqhl = `
      ${grapqhl}
      repo${index}:repository(name:"${item.name}", owner:"${item.owner.login}") {
        id
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