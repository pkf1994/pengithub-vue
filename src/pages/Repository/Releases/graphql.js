export const GRAPHQL_RELEASES = payload => {
    let graphql = ''
    payload.forEach((item,index) => {
        graphql = `
            ${graphql}
            release${index}:node(id: "${item.node_id}") {
                ... on Release {
                id
                tag {
                        target {
                            commitResourcePath
                            oid
                            ... on Commit {
                                id
                                abbreviatedOid
                                signature {
                                    isValid
                                    state
                                    wasSignedByGitHub
                                    ... on GpgSignature {
                                      keyId
                                    }
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

export const GRAPHQL_TAG = payload => `
{
  node(id: "${payload}") {
    ... on Tag {
      tagger {
        user {
          login
          avatarUrl
        }
      }
    }
  }
}

  
`