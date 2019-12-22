
export const GRAPH_QL_DASHBOARD = (login) => `
    query {
    viewer {
        organizations(first:4){
            totalCount
            nodes{
                name,
                login,
                teams(userLogins:["${login}"],first: 4){
                    totalCount
                    nodes{
                        name,
                        url
                    }
                }
            }
        }
        topRepositories(first:10,orderBy: {field:UPDATED_AT,direction:DESC}) {
            nodes {
                nameWithOwner,
                stargazers{
                    totalCount
                }
            }
        }
        starredRepositories(first:10,orderBy: {field:STARRED_AT,direction:DESC}) {
            nodes {
                nameWithOwner
                stargazers{
                    totalCount
                }
            }
        }
    }
}
`

export const GRAPH_QL_VIEWER_PULL_REQUEST_CREATED = `
    query {
    viewer {
        pullRequests(first: 20,orderBy:{field:UPDATED_AT,direction:DESC},states:[OPEN]) {
            totalCount
            nodes{
                author{
                    login
                }
                title
                url
                repository{
                    owner{
                        login
                    }
                    name
                }
            }
        }
    }
}
`