export const GRAPHQL_COMMIT = `
query($id:ID!){
    node(id: $id) {
      ... on Commit {
        id
        status {
          state
        }
      }
    }
  }
  
`

export const GRAPHQL_REPOSITORY_LAST_COMMITDATE_BY_PATH = payload => {
  console.log(payload.path)
  let path = payload.path ? payload.path.replace(/^\//,'') : ''
  if(path.length > 0 && path[path.length - 1] !== '/') {
    path = `${path}/`
  }
  let graphQL = ''
  payload.contents.forEach((item,index) => {
    graphQL = `${graphQL}
      history${index}:history(path: "${path}${item.name}", first: 1) {
        nodes {
          committedDate
        }
      }
    `
  })
return `
{
  repository(name: "${payload.repo}", owner: "${payload.owner}") {
    object(expression: "${payload.branch}") {
      ... on Commit {
        ${graphQL}
      }
    }
  }
}
`
}