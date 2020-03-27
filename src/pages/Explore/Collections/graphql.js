export const GRAPHQL_COLLECTIONS_ROSTER = `
  {
    repository(name: "explore", owner: "github") {
      object(expression: "master:collections") {
        ... on Tree {
          entries {
            type
            name
          }
        }
      }
    }
  }
  
`

export const GRAPHQL_COLLECTION_SKETCH = payload => {
  let graphql = ''

  payload.forEach((item,index) => {
    graphql = `
      ${graphql}
      object${index}: object(expression: "master:collections/${item.name}") {
        ... on Tree {
          entries {
            type
            name
          }
        }
      }
    `
  })

  return `
  {
    repository(name: "explore", owner: "github") {
      ${graphql}
    }
  }
  `
}

export const GRAPHQL_COLLECTIONS = payload => {
  let graphql = ''

  payload.forEach((item,index) => {
    graphql = `
      ${graphql}
      object${index}: object(expression: "${item.expression}") {
        ... on Blob {
          text
        }
      }
    `
  })

  return `
  {
    repository(name: "explore", owner: "github") {
      ${graphql}
    }
  }
  `
}