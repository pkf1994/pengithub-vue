export const GRAPHQL_COUNT_GROUP_BY_SEARCH_TYPE = (query) => {
    let searchTypeList = [
        'REPOSITORY',
        'USER',
        'ISSUE'
    ]
    let ql = ''
    searchTypeList.forEach(item => {
        ql = `
            ${ql}
            ${item}:search(type: ${item}, query: "${query}") {
                ${item.toLowerCase()}Count
              }
        `
    })
    return `{${ql}}`
}

export const GRAPHQL_COMMIT_STATUS = (nodeIdArr) => {
    let graphql = ''
    nodeIdArr.forEach((item,index) => {
        graphql = `
            ${graphql}
            commit${index}:node(id: "${item}") {
                ... on Commit {
                    id
                    status {
                        state
                    }
                }
            }
        `
    })

    return `{
        ${graphql}
    }`
    
}

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