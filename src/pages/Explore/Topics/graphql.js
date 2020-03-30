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
  topic: topic(name: "${payload}") {
    viewerHasStarred
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

export const GRAPHQL_TOPICS_VIEWER_HAS_STARRED = payload => {
  let graphql = ''
  payload.forEach((item,index) => {
    graphql = `
      ${graphql}
      topic${index}:topic(name: "${item.name}") {
        viewerHasStarred
        name
      }
    `
  })

  return `
    {
      ${graphql}
    }
  `
}

export const GRAPHQL_TOPIC_REPOS = payload => {
  let ids = []
  payload.forEach(item => {
    ids.push(item.node_id)
  })
  return `
  {
    nodes(ids: ${JSON.stringify(ids)}){
      ... on Repository{
      id
      openGraphImageUrl
      viewerHasStarred
    }
  }
}
  `
}