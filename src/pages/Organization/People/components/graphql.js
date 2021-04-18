export const PEOPLE = `
    query($ids:[ID!]!) {
        nodes(ids:$ids) {
            ... on User{
                id
                name
                login
                viewerCanFollow
                viewerIsFollowing
            }
        }
    }
`