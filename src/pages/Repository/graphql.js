export const VIEWER_HAS_STARRED =  `
query($name:String!,$owner:String!){
  repository(name: $name, owner: $owner) {
    viewerHasStarred
  }
}
`

