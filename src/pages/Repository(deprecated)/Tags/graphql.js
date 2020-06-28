export const GRAPHQL_TAGS = payload => {
    let graphql = ``
    payload.forEach((item,index) => {
        graphql = `
            ${graphql}
            tag${index}: node(id: "${item.node_id}") {
                ... on Ref {
                  id
                  target {
                    ... on Tag {
                      message
                      target {
                        ... on Commit {
                          committedDate
                        }
                      }
                    }
                  }
                }
              }
        `.trim()
    })
    return `
        {
            ${graphql}
        }
    `
}