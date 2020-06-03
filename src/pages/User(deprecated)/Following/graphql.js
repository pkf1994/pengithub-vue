
export const GRAPHQL_USER_FOLLOWING_EXTRA = payload => {
  let grapqhl = ''
  payload.forEach((item,index) => {
    grapqhl = `
      ${grapqhl}
      following${index}:user(login: "${item.login}") {
        id
        name
        company
        location
        bioHTML
        viewerIsFollowing
        viewerCanFollow
      }
    `
  })
  return `
  {
    ${grapqhl.trim()}
  }
  `
}