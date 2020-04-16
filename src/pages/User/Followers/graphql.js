
export const GRAPHQL_USER_FOLLOWER_EXTRA = payload => {
  let grapqhl = ''
  payload.forEach((item,index) => {
    grapqhl = `
      ${grapqhl}
      follower${index}:user(login: "${item.login}") {
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