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

export const GRAPHQL_COLLECTIONS_SKETCH = payload => {
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

export const GRAPHQL_COLLECTION_SKETCH_AND_RAW = payload => `
{
  repository(name: "explore", owner: "github") {
    sketch:object(expression: "master:collections/${payload}") {
      ... on Tree {
        entries {
          type
          name
        }
      }
    }
    raw: object(expression: "master:collections/${payload}/index.md") {
      ... on Blob {
        text
      }
    }
  }
}
`

export const GRAPHQL_REPOS = payload => {
  let graphql = ''

  payload.forEach((item,index) => {
    graphql = `
      ${graphql}
      repository${index}: repository(name: "${item.name}", owner: "${item.owner}") {
        name
        id
        owner{
          login
        }
        viewerHasStarred
        description
        stargazers {
          totalCount
        }
        forkCount
        languages(first: 1) {
          nodes {
            color
            name
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