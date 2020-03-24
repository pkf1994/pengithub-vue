
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

