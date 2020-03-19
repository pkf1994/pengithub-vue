export const GRAPHQL_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE = (query, languageList) => {
    let ql = ""
    languageList.forEach((item,index) => {
        ql = `
            ${ql}
            language${index}: search(type: REPOSITORY, query: "${query} in:name,description language:${item.language}") {
                repositoryCount
            }
        `
    })
    return `{${ql}}`
}