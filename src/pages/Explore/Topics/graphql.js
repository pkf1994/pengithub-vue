export const GRAPHQL_TOPICS_ROSTER = `
  {
    repository(name: "explore", owner: "github") {
      object(expression: "master:topics") {
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

export const GRAPHQL_TOPICS_SKETCH = payload => {
  let graphql = ''

  payload.forEach((item,index) => {
    graphql = `
      ${graphql}
      object${index}: object(expression: "master:topics/${item.name}") {
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

export const GRAPHQL_TOPICS = payload => {
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

export const GRAPHQL_TOPIC_SKETCH_AND_RAW = payload => `
{
  repository(name: "explore", owner: "github") {
    sketch:object(expression: "master:topics/${payload}") {
      ... on Tree {
        entries {
          type
          name
        }
      }
    }
    raw: object(expression: "master:topics/${payload}/index.md") {
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