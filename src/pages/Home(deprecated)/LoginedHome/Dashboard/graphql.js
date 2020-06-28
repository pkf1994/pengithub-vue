export const GRAPHQL_DASHBOARD = (login) => `
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
        repositoriesContributedTo(first:10,orderBy: {field:UPDATED_AT,direction:DESC}) {
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