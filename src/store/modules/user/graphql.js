export const GRAPH_QL_VIEWER =`
    query {
    viewer {
        repositoriesContributedTo(first:10,includeUserRepositories:true,orderBy: {field:UPDATED_AT,direction:DESC}) {
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