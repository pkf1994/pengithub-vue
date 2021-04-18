export const REPOS = `
    query($ids:[ID!]!) {
        nodes(ids:$ids) {
            ... on Repository{
                id
                descriptionHTML
                issues(states: OPEN) {
                    totalCount
                }
                pullRequests(states: OPEN) {
                    totalCount
                }
                parent {
                    nameWithOwner
                }
                primaryLanguage {
                    name
                    color
                }
            }
        }
    }
`

  