export const ORG_PACKAGES = `
query($login:String!,$after:String,$packageType:PackageType){
    organization(login: $login) {
      packages(first: 100,after:$after,packageType:$packageType) {
        nodes {
            name
            repository {
              nameWithOwner
            }
            packageType
            statistics {
              downloadsTotalCount
            }
            latestVersion {
              version
              summary
            }
        }
        pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
        }
      }
    }
  }
`