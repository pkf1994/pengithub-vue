export const GRAPHQL_VIEWER_HAS_STARRED = payload => {
    let graphql = ''
    payload.forEach((item,index) => {
        graphql = `
            ${graphql}
            repository${index}:repository(name: "${item.name}", owner: "${item.author}") {
                viewerHasStarred
                url
            }
        `
    })
    return `
        {
            ${graphql}
        }
    `
}

export const GRAPHQL_VIEWER_IS_FOLLOWING = payload => {
    let graphql = ''
    payload.forEach((item,index) => {
        graphql = `
            ${graphql}
            user${index}:user(login: "${item.username}") {
                login
                viewerIsFollowing
                viewerCanFollow
            }
        `
    })
    return `
        {
            ${graphql}
        }
    `
}