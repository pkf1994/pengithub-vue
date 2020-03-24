export const GRAPHQL_PULLS_REF_INFO = (nodeIdArr) => {
    let graphql = ''
    nodeIdArr.forEach((item,index) => {
        graphql = `
            ${graphql}
            pullRequest${index}:node(id: "${item}") {
                ... on PullRequest {
                    id
                    headRefName
                    baseRefName
                }
            }
        `
    })

    return `{
        ${graphql}
    }`
    
}

export const GRAPHQL_COUNT_OF_ISSUE_GROUP_BY_LANGUAGE = (query, languageList) => {
    let ql = ""
    languageList.forEach((item,index) => {
        ql = `
            ${ql}
            language${index}: search(type: ISSUE, query: "${query} language:${item.language}") {
                issueCount
            }
        `
    })
    return `{${ql}}`
}