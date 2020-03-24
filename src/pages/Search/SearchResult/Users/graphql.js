export const GRAPHQL_NAME_BIO_LOCATION_EMAIL_FOLLOWSHIP_OF_USERS = users => {
    let ql = ""
    users.forEach((item,index) => {
        if(item.type === "User") {
          ql = `
              ${ql}
              user${index}:user(login: "${item.login}") {
                email
                login
                bio
                id
                name
                viewerIsFollowing
                viewerCanFollow
                location
              }
          `
        }
    })
    return `{${ql}}`
  
  }

  export const GRAPHQL_COUNT_OF_USER_GROUP_BY_LANGUAGE = (query, languageList) => {
    let ql = ""
    languageList.forEach((item,index) => {
        ql = `
            ${ql}
            language${index}: search(type: USER, query: "${query} language:${item.language}",first:1) {
                userCount
            }
        `
    })
    return `{${ql}}`
  }