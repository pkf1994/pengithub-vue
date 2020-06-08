export const GRAPHQL_ORG_PACKAGES = `
query($login:String!,$perPage:Int = 10,$after:String,$before:String,$packageType:RegistryPackageType){
    organization(login: $login) {
      registryPackages(first: $perPage,after:$after,before:$before,publicOnly:true,packageType:$packageType) {
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
              dependencies {
                totalCount
              }
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