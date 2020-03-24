export const GRAPHQL_RELATIVE_TOPICS_OF_TOPICS = topics => {
    let ql = ""
    topics.forEach((item,index) => {
        ql = `
            ${ql}
            topic${index}: topic(name:"${item.name}") {
                name
                viewerHasStarred
                relatedTopics(first: 4) {
                  name
                }
              }
        `
    })
    return `{${ql}}`
}

export const GRAPHQL_COUNT_OF_REPOSITORY_BY_TOPICS = topics => {
    let ql = ""
    topics.forEach((item,index) => {
        let query = item.name
        let regExp = new RegExp("\\.",'g')
        ql = `
            ${ql}
            topic${index}:search(query: "topic:${query.replace(regExp,"")}", type: REPOSITORY) {
                repositoryCount
              }
        `
    })
    return `{${ql}}`
}
