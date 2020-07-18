export const GRAPHQL_USER_REPOSITORY_EXTRA = payload => {
  let grapqhl = ''
  payload.forEach((item,index) => {
    grapqhl = `
      ${grapqhl}
      repo${index}:repository(name:"${item.name}", owner:"${item.owner.login}") {
        id
        descriptionHTML
        parent {
          forkCount
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