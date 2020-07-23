export const EXTRA_DATA =  `
query($name:String!,$owner:String!){
  repository(name: $name, owner: $owner) {
    viewerHasStarred
    viewerPermission
  }
}
`

