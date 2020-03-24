export const GRAPHQL_COUNT_GROUP_BY_SEARCH_TYPE = (query) => {
    let searchTypeList = [
        'REPOSITORY',
        'USER',
        'ISSUE'
    ]
    let ql = ''
    searchTypeList.forEach(item => {
        ql = `
            ${ql}
            ${item}:search(type: ${item}, query: "${query}") {
                ${item.toLowerCase()}Count
              }
        `
    })
    return `{${ql}}`
}
