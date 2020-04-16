export const GRAPHQL_BRANCH_OR_TAG = payload => `
{
    repository(name: "${payload.repo}", owner: "${payload.owner}") {
        ref(qualifiedName: "${payload.ref}") {
        name
        prefix
        }
    }
}
  
`

export const GRAPHQL_COMMITS = payload => {
    let graphql = ''
    payload.forEach((item,index) => {
        graphql = `
            ${graphql.trim()}
            commit${index}:node(id: "${item.node_id}") {
                ... on Commit {
                  id
                  messageHeadlineHTML
                  status {
                    state
                  }
                }
            }
        `
    })
    return `
        {
            ${graphql}
        }
    `
}