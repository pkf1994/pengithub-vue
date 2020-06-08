export const GRAPHQL_ORG_MEMBER = payload => {
    let graphql = ``
    payload.forEach((item,index) => {
        graphql = `
            ${graphql}
            user${index}: user(login:"${item.login}") {
                name
                login
                viewerCanFollow
                viewerIsFollowing
            }
        `.trim()
    })

    return `
        {
            ${graphql}
        }
    `
}